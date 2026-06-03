from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
import math

from app.database.models import Interview, Report, Evaluation, Question, Answer
from app.schemas.dashboard import (
    DashboardOverviewResponse,
    DashboardPerformanceResponse,
    PerformanceDataPoint,
    DashboardIntelligenceResponse,
    DashboardRecentResponse,
    RecentOperation
)
from app.services.groq_service import analyze_text_to_json, get_evaluation_model

def get_dashboard_overview(db: Session, user_id: str) -> DashboardOverviewResponse:
    # 1. Total Interviews
    interviews_taken = db.query(Interview).filter(Interview.status == "COMPLETED", Interview.user_id == user_id).count()
    if interviews_taken == 0:
        return DashboardOverviewResponse(
            interviews_taken=0, average_score=0, best_score=0, readiness_index=0,
            avg_duration_minutes=0, most_practiced_skill="None", current_streak=0, total_questions_answered=0
        )
    
    # 2. Average Score
    avg_score = float(db.query(func.avg(Report.readiness_score)).join(Interview).filter(Interview.user_id == user_id).scalar() or 0)
    
    # 3. Best Score
    best_score = float(db.query(func.max(Report.readiness_score)).join(Interview).filter(Interview.user_id == user_id).scalar() or 0)
    
    # 4. Readiness Index (40% Tech, 20% Comm, 20% Prob, 20% Behav)
    tech = float(db.query(func.avg(Evaluation.accuracy)).join(Answer).join(Question).join(Interview).filter(Interview.user_id == user_id).scalar() or 0)
    comm = float(db.query(func.avg(Evaluation.communication)).join(Answer).join(Question).join(Interview).filter(Interview.user_id == user_id).scalar() or 0)
    prob = float(db.query(func.avg(Evaluation.time_efficiency)).join(Answer).join(Question).join(Interview).filter(Interview.user_id == user_id).scalar() or 0)
    behav = float(db.query(func.avg(Evaluation.relevance)).join(Answer).join(Question).join(Interview).filter(Interview.user_id == user_id).scalar() or 0)
    readiness_index = int((tech * 0.4) + (comm * 0.2) + (prob * 0.2) + (behav * 0.2))
    
    # Quick Stats
    # Avg Duration
    avg_dur_sec = float(db.query(func.avg(Answer.time_taken_seconds)).join(Question).join(Interview).filter(Interview.user_id == user_id).scalar() or 0)
    avg_duration_minutes = int((avg_dur_sec * 5) / 60) # Approx total time per interview if 5 questions
    
    # Most Practiced Skill
    skill_counts = db.query(Question.skill_area, func.count(Question.id).label("count")).join(Interview).filter(Interview.user_id == user_id).group_by(Question.skill_area).order_by(func.count(Question.id).desc()).first()
    most_practiced_skill = skill_counts.skill_area if skill_counts else "General"
    
    # Total Questions Answered
    total_questions_answered = db.query(Answer).join(Question).join(Interview).filter(Interview.user_id == user_id).count()
    
    # Current Streak
    current_streak = min(interviews_taken, 3) # Simplify logic for MVP
    
    return DashboardOverviewResponse(
        interviews_taken=interviews_taken,
        average_score=int(avg_score),
        best_score=int(best_score),
        readiness_index=readiness_index,
        avg_duration_minutes=avg_duration_minutes,
        most_practiced_skill=most_practiced_skill.title(),
        current_streak=current_streak,
        total_questions_answered=total_questions_answered
    )

def get_dashboard_performance(db: Session, user_id: str) -> DashboardPerformanceResponse:
    reports = (
        db.query(Report, Interview)
        .join(Interview, Interview.id == Report.interview_id)
        .filter(Interview.status == "COMPLETED", Interview.user_id == user_id)
        .order_by(Interview.started_at.asc())
        .all()
    )
    
    history = []
    for r, interview in reports:
        role = interview.jd.role if interview.jd else "Interview"
        
        ans_count = db.query(Answer).join(Question).filter(Question.interview_id == interview.id).count()
        eval_avg = db.query(func.avg(Evaluation.overall_score)).join(Answer).join(Question).filter(Question.interview_id == interview.id).scalar()
        avg_score = int(eval_avg) if eval_avg else (r.readiness_score or 0)
        
        history.append(PerformanceDataPoint(
            name=interview.started_at.strftime("%b %d"),
            score=r.readiness_score or 0,
            role=role,
            recommendation=r.recommendation or "Pending Review",
            difficulty=interview.difficulty or "Medium",
            questions_answered=ans_count,
            average_score=avg_score,
            full_date=interview.started_at.strftime("%b %d, %Y")
        ))
        
    return DashboardPerformanceResponse(history=history)

async def get_dashboard_intelligence(db: Session, user_id: str) -> DashboardIntelligenceResponse:
    reports = db.query(Report).join(Interview).filter(Interview.user_id == user_id).order_by(Report.created_at.desc()).limit(2).all()
    if not reports:
        return DashboardIntelligenceResponse(
            strength_detected="Complete an interview to generate insights.",
            focus_area="Complete an interview to generate insights.",
            career_tip="Complete an interview to generate insights."
        )
        
    context = ""
    for r in reports:
        context += f"Summary: {r.summary}\nStrengths: {r.strengths}\nWeaknesses: {r.weaknesses}\n\n"
        
    system_prompt = (
        "You are an AI Career Coach. Analyze the latest interview reports and generate short, punchy dashboard insights.\n"
        "Return ONLY JSON matching this structure exactly:\n"
        "{\n"
        "  \"strength_detected\": \"(1 sentence highlighting a top strength)\",\n"
        "  \"focus_area\": \"(1 sentence highlighting an improvement area)\",\n"
        "  \"career_tip\": \"(1 sentence giving an actionable tip)\"\n"
        "}"
    )
    
    try:
        data = await analyze_text_to_json(context, system_prompt, DashboardIntelligenceResponse, model_name=get_evaluation_model())
        return data
    except Exception as e:
        print(f"Failed dashboard AI logic: {e}")
        return DashboardIntelligenceResponse(
            strength_detected="Strong communication detected in recent responses.",
            focus_area="Focus on system design fundamentals.",
            career_tip="Practice the STAR method for behavioral answers."
        )

def get_dashboard_recent(db: Session, user_id: str) -> DashboardRecentResponse:
    interviews = (
        db.query(Interview)
        .filter(Interview.status == "COMPLETED", Interview.user_id == user_id)
        .order_by(Interview.started_at.desc())
        .limit(5)
        .all()
    )
    
    ops = []
    for i in interviews:
        role = i.jd.role if i.jd else "General"
        score = i.report.readiness_score if i.report else 0
        rec = i.report.recommendation if i.report else "N/A"
        
        # Calculate time ago
        time_diff = datetime.utcnow() - i.started_at.replace(tzinfo=None)
        days = time_diff.days
        if days == 0:
            time_ago = "Today"
        elif days == 1:
            time_ago = "Yesterday"
        else:
            time_ago = f"{days}d ago"
            
        ops.append(RecentOperation(
            role=role,
            type="Technical Interview" if "engineer" in role.lower() or "developer" in role.lower() else "General Interview",
            score=score,
            duration="30m",
            timeAgo=time_ago,
            recommendation=rec
        ))
        
    return DashboardRecentResponse(operations=ops)
