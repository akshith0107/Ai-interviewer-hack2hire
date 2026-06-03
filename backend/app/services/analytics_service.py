from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.models import Interview, Report, Evaluation, Question, Answer
from app.schemas.analytics import (
    AnalyticsOverviewResponse,
    AnalyticsTrendsResponse,
    TrendDataPoint,
    AnalyticsSkillsResponse,
    AnalyticsInsightsResponse,
    AnalyticsHistoryResponse,
    InterviewHistoryItem
)
from app.services.groq_service import analyze_text_to_json, get_evaluation_model

def get_analytics_overview(db: Session) -> AnalyticsOverviewResponse:
    # 1. Total Interviews
    total_interviews = db.query(Interview).filter(Interview.status == "COMPLETED").count()
    if total_interviews == 0:
        return AnalyticsOverviewResponse(
            readiness_score=0,
            total_interviews=0,
            average_score=0,
            strongest_skill="N/A",
            weakest_skill="N/A"
        )
    
    # 2. Average Readiness Score
    avg_readiness = db.query(func.avg(Report.readiness_score)).scalar() or 0
    
    # 3. Average Score
    avg_overall = db.query(func.avg(Evaluation.overall_score)).scalar() or 0
    
    # 4. Strongest / Weakest Skills
    # Group by question.skill_area and average evaluation.overall_score
    skill_scores = (
        db.query(
            Question.skill_area,
            func.avg(Evaluation.overall_score).label("avg_score")
        )
        .join(Answer, Answer.question_id == Question.id)
        .join(Evaluation, Evaluation.answer_id == Answer.id)
        .group_by(Question.skill_area)
        .all()
    )
    
    strongest_skill = "N/A"
    weakest_skill = "N/A"
    
    if skill_scores:
        valid_scores = [s for s in skill_scores if s.skill_area and s.avg_score is not None]
        if valid_scores:
            valid_scores.sort(key=lambda x: x.avg_score, reverse=True)
            strongest_skill = valid_scores[0].skill_area
            weakest_skill = valid_scores[-1].skill_area
            
    return AnalyticsOverviewResponse(
        readiness_score=int(avg_readiness),
        total_interviews=total_interviews,
        average_score=int(avg_overall),
        strongest_skill=strongest_skill,
        weakest_skill=weakest_skill
    )

def get_analytics_trends(db: Session) -> AnalyticsTrendsResponse:
    reports = (
        db.query(Report, Interview.started_at, Interview.jd_id)
        .join(Interview, Interview.id == Report.interview_id)
        .order_by(Interview.started_at.asc())
        .all()
    )
    
    history = []
    for r, started_at, jd_id in reports:
        # Get role name if jd exists
        role = "Software Engineer" # Fallback
        if r.interview.jd:
            role = r.interview.jd.role
            
        history.append(TrendDataPoint(
            date=started_at.strftime("%Y-%m-%d %H:%M") if started_at else "Unknown",
            score=r.readiness_score or 0,
            role=role
        ))
        
    return AnalyticsTrendsResponse(history=history)

def get_analytics_skills(db: Session) -> AnalyticsSkillsResponse:
    evals = db.query(
        func.avg(Evaluation.accuracy).label("technical"),
        func.avg(Evaluation.communication).label("communication"),
        func.avg(Evaluation.relevance).label("behavioral"),
        func.avg(Evaluation.depth).label("system_design"),
        func.avg(Evaluation.time_efficiency).label("problem_solving"),
        func.avg(Evaluation.clarity).label("confidence")
    ).first()
    
    if not evals or evals.technical is None:
        return AnalyticsSkillsResponse(
            technical=0, communication=0, behavioral=0,
            problem_solving=0, system_design=0, confidence=0
        )
        
    return AnalyticsSkillsResponse(
        technical=int(evals.technical or 0),
        communication=int(evals.communication or 0),
        behavioral=int(evals.behavioral or 0),
        problem_solving=int(evals.problem_solving or 0),
        system_design=int(evals.system_design or 0),
        confidence=int(evals.confidence or 0)
    )

def get_analytics_difficulty(db: Session) -> dict: # Returning dict to be wrapped by Pydantic
    difficulties = (
        db.query(
            Question.difficulty,
            func.avg(Evaluation.overall_score).label("avg_score")
        )
        .join(Answer, Answer.question_id == Question.id)
        .join(Evaluation, Evaluation.answer_id == Answer.id)
        .group_by(Question.difficulty)
        .all()
    )
    
    res = {"easy": 0, "medium": 0, "hard": 0}
    for d, score in difficulties:
        if d and score is not None:
            res[d.lower()] = int(score)
            
    return res

async def get_analytics_insights(db: Session) -> AnalyticsInsightsResponse:
    reports = db.query(Report).all()
    if not reports:
        return AnalyticsInsightsResponse(
            top_strength="N/A",
            biggest_gap="N/A",
            improvement_focus="Complete more interviews to generate insights.",
            projected_readiness="N/A"
        )
        
    report_texts = []
    for r in reports[-3:]: # Take last 3 reports to avoid context limit
        report_texts.append(f"Summary: {r.summary}\nStrengths: {r.strengths}\nWeaknesses: {r.weaknesses}\nRecommendation: {r.recommendation}")
        
    context = "\n\n---\n\n".join(report_texts)
    
    system_prompt = (
        "You are an AI Career Coach analyzing multiple interview reports.\n"
        "Generate overall career insights based on the candidate's recent performance.\n"
        "Return EXACTLY ONE JSON object with these keys:\n"
        "- top_strength (string, 2-5 words)\n"
        "- biggest_gap (string, 2-5 words)\n"
        "- improvement_focus (string, 1-2 sentences of advice)\n"
        "- projected_readiness (string, e.g. 'Ready in 2 weeks', 'Needs 1 month', 'Interview Ready Now')\n"
        "Do not include markdown or explanations."
    )
    
    prompt = f"Recent Interview Reports:\n{context}"
    
    try:
        insights = await analyze_text_to_json(prompt, system_prompt, AnalyticsInsightsResponse, model_name=get_evaluation_model())
        return insights
    except Exception as e:
        print(f"Error generating insights: {e}")
        return AnalyticsInsightsResponse(
            top_strength="Communication",
            biggest_gap="System Design",
            improvement_focus="Continue practicing and complete more mock interviews.",
            projected_readiness="Needs more data"
        )

def get_analytics_history(db: Session) -> AnalyticsHistoryResponse:
    interviews = (
        db.query(Interview)
        .order_by(Interview.started_at.desc())
        .limit(10)
        .all()
    )
    
    history = []
    for i in interviews:
        role = i.jd.role if i.jd else "General Interview"
        score = i.report.readiness_score if i.report else 0
        recommendation = i.report.recommendation if i.report else "N/A"
        
        history.append(InterviewHistoryItem(
            id=i.id,
            date=i.started_at.strftime("%b %d, %Y") if i.started_at else "Unknown",
            role=role,
            score=score,
            recommendation=recommendation,
            status=i.status
        ))
        
    return AnalyticsHistoryResponse(history=history)
