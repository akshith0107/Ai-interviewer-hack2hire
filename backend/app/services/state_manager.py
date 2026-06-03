import uuid
from typing import Dict, List
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.database import models
from app.schemas.interview import InterviewState, InterviewContext, StartInterviewRequest, AnswerHistory
from app.schemas.resume import CandidateProfile
from app.schemas.jd import JDAnalysis

def get_session(db: Session, session_id: str, user_id: str = None) -> InterviewState:
    interview_db = db.query(models.Interview).filter(models.Interview.id == session_id).first()
    if not interview_db:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    if user_id and interview_db.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this interview.")
    
    resume_db = interview_db.resume
    jd_db = interview_db.jd
    
    profile = None
    if resume_db and resume_db.skills_json:
        profile = CandidateProfile(
            summary=resume_db.summary,
            skills=resume_db.skills_json.get("skills", []),
            experience_years=resume_db.skills_json.get("experience_years", 0),
            education=resume_db.skills_json.get("education", [])
        )
        
    jd_analysis = None
    if jd_db and jd_db.required_skills:
        jd_analysis = JDAnalysis(
            role=jd_db.role,
            required_skills=jd_db.required_skills.get("required_skills", []),
            nice_to_have_skills=jd_db.nice_to_have_skills.get("nice_to_have_skills", []),
            core_focus=jd_db.core_focus
        )
        
    context = InterviewContext(candidate_profile=profile, jd_analysis=jd_analysis)
    
    history = []
    score_history = []
    questions = sorted(interview_db.questions, key=lambda q: q.created_at) if interview_db.questions else []
    
    for q in questions:
        if q.answer:
            history.append(AnswerHistory(
                question=q.question_text,
                answer=q.answer.candidate_answer,
                question_type=q.skill_area or "Unknown",
                difficulty=q.difficulty or "Medium"
            ))
            if q.answer.evaluation:
                score_history.append(q.answer.evaluation.overall_score)

    state = InterviewState(
        session_id=session_id,
        context=context,
        current_difficulty=interview_db.difficulty or "Medium",
        status=interview_db.status.lower(),
        history=history,
        score_history=score_history,
        question_count=len(questions),
        current_round=1, # simplified
        current_round_name="Technical",
        questions_in_current_round=len(questions)
    )
    return state

def create_session(db: Session, request: StartInterviewRequest, user_id: str) -> InterviewState:
    session_id = str(uuid.uuid4())
    
    resume_id = None
    if request.candidate_profile:
        resume_id = str(uuid.uuid4())
        resume = models.Resume(
            id=resume_id,
            user_id=user_id,
            skills_json={"skills": request.candidate_profile.skills, "experience_years": request.candidate_profile.experience_years, "education": request.candidate_profile.education},
            summary=request.candidate_profile.summary
        )
        db.add(resume)
    
    jd_id = None
    if request.jd_analysis:
        jd_id = str(uuid.uuid4())
        jd = models.JobDescription(
            id=jd_id,
            user_id=user_id,
            role=request.jd_analysis.role,
            required_skills={"required_skills": request.jd_analysis.required_skills},
            nice_to_have_skills={"nice_to_have_skills": request.jd_analysis.nice_to_have_skills},
            core_focus=request.jd_analysis.core_focus
        )
        db.add(jd)
        
    interview = models.Interview(
        id=session_id,
        user_id=user_id,
        resume_id=resume_id,
        jd_id=jd_id,
        difficulty=request.starting_difficulty,
        status="ACTIVE"
    )
    db.add(interview)
    db.commit()
    
    return get_session(db, session_id)

def update_session(db: Session, state: InterviewState) -> None:
    interview = db.query(models.Interview).filter(models.Interview.id == state.session_id).first()
    if not interview:
        return
        
    interview.difficulty = state.current_difficulty
    interview.status = state.status.upper()
    db.commit()

def save_question(db: Session, session_id: str, question_text: str, difficulty: str, skill_area: str) -> str:
    q_count = db.query(models.Question).filter(models.Question.interview_id == session_id).count()
    q_id = str(uuid.uuid4())
    q = models.Question(
        id=q_id,
        interview_id=session_id,
        question_text=question_text,
        difficulty=difficulty,
        skill_area=skill_area,
        question_number=q_count + 1
    )
    db.add(q)
    db.commit()
    return q_id

def save_answer(db: Session, session_id: str, question_text: str, answer_text: str, time_taken: int = None) -> str:
    # Find most recent question matching text
    q = db.query(models.Question).filter(
        models.Question.interview_id == session_id,
        models.Question.question_text == question_text
    ).order_by(models.Question.created_at.desc()).first()
    
    if not q:
        # Fallback to just getting latest question
        q = db.query(models.Question).filter(models.Question.interview_id == session_id).order_by(models.Question.created_at.desc()).first()
        
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
        
    ans_id = str(uuid.uuid4())
    ans = models.Answer(
        id=ans_id,
        question_id=q.id,
        candidate_answer=answer_text,
        time_taken_seconds=time_taken
    )
    db.add(ans)
    db.commit()
    return ans_id

def save_evaluation(db: Session, session_id: str, answer_text: str, eval_data: dict) -> None:
    # Find latest answer
    # Note: For robust implementation, answer_id should be passed, but sticking to existing contract
    ans = db.query(models.Answer).join(models.Question).filter(
        models.Question.interview_id == session_id,
        models.Answer.candidate_answer == answer_text
    ).order_by(models.Answer.created_at.desc()).first()
    
    if not ans:
        # Fallback latest answer
        ans = db.query(models.Answer).join(models.Question).filter(models.Question.interview_id == session_id).order_by(models.Answer.created_at.desc()).first()
        
    if not ans:
        return
        
    ev = models.Evaluation(
        id=str(uuid.uuid4()),
        answer_id=ans.id,
        accuracy=eval_data.get("accuracy", 0),
        clarity=eval_data.get("clarity", 0),
        depth=eval_data.get("depth", 0),
        relevance=eval_data.get("relevance", 0),
        communication=eval_data.get("communication", 0),
        time_efficiency=eval_data.get("time_efficiency", 0),
        overall_score=eval_data.get("overall_score", 0),
        feedback=eval_data.get("feedback", "")
    )
    db.add(ev)
    db.commit()

def save_report(db: Session, session_id: str, report_data: dict) -> None:
    # Delete existing if any
    db.query(models.Report).filter(models.Report.interview_id == session_id).delete()
    
    rep = models.Report(
        id=str(uuid.uuid4()),
        interview_id=session_id,
        readiness_score=report_data.get("readiness_score", 0),
        recommendation=report_data.get("recommendation", ""),
        summary=report_data.get("summary", ""),
        strengths=report_data.get("strengths", []),
        weaknesses=report_data.get("weaknesses", []),
        roadmap=report_data.get("improvement_plan", "")
    )
    db.add(rep)
    
    # Mark interview complete
    interview = db.query(models.Interview).filter(models.Interview.id == session_id).first()
    if interview:
        interview.status = "COMPLETED"
        
    db.commit()

