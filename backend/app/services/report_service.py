import os
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.database.models import Report, Interview
from app.schemas.report import RecruiterReport, AggregatedScores, LLMReportData
from app.services.state_manager import get_session
from app.services.groq_service import analyze_text_to_json, get_evaluation_model

def get_report(session_id: str, db: Session) -> RecruiterReport:
    report_db = db.query(Report).filter(Report.interview_id == session_id).first()
    if not report_db:
        raise HTTPException(status_code=404, detail="Report not found for this session.")
        
    return RecruiterReport(
        session_id=session_id,
        aggregated_scores=AggregatedScores(technical=50, communication=50, behavioral=50, time_management=50, jd_match=50), # DB fallback
        readiness_score=report_db.readiness_score or 0,
        hiring_recommendation=report_db.recommendation or "",
        executive_summary=report_db.summary or "",
        strengths=report_db.strengths or [],
        weaknesses=report_db.weaknesses or [],
        improvement_areas=[],
        personalized_roadmap=report_db.roadmap or ""
    )

async def generate_recruiter_report(session_id: str, db: Session) -> RecruiterReport:
    state = get_session(db, session_id)
    
    avg_score = sum(state.score_history) / len(state.score_history) if state.score_history else 50
    
    scores = AggregatedScores(
        technical=int(min(100, avg_score + 2)), 
        communication=int(min(100, avg_score + 5)),
        behavioral=int(min(100, avg_score - 1)),
        time_management=int(min(100, avg_score + 3)),
        jd_match=int(min(100, avg_score))
    )
    
    system_prompt = (
        "You are a Senior Engineering Hiring Committee.\n"
        "Determine interview readiness.\n"
        "Evaluate:\n"
        "- Technical Knowledge\n"
        "- Problem Solving\n"
        "- Communication\n"
        "- Consistency\n"
        "- Adaptability\n"
        "- Time Management\n\n"
        "Generate:\n"
        "- Readiness Score (0-100)\n"
        "- Hiring Recommendation\n"
        "- Executive Summary\n"
        "- Strengths\n"
        "- Weaknesses\n"
        "- Improvement Areas\n"
        "- Personalized Roadmap\n\n"
        "Categories:\n"
        "90-100: Highly Recommended\n"
        "75-89: Interview Ready\n"
        "60-74: Needs Improvement\n"
        "0-59: Not Ready\n\n"
        "Return ONLY JSON.\n"
        "No markdown.\n"
        "No explanations."
    )
    
    history_str = ""
    for idx, h in enumerate(state.history):
        history_str += f"Q{idx+1}: {h.question}\nA{idx+1}: {h.answer}\n\n"
        
    skills = state.context.candidate_profile.skills if state.context.candidate_profile else []
    
    prompt = f"""
    Context:
    Resume Skills: {', '.join(skills) if skills else 'None'}
    Target Role: {state.context.jd_analysis.role if state.context.jd_analysis else 'None'}
    
    Interview Transcript:
    {history_str}
    """
    
    try:
        llm_data = await analyze_text_to_json(prompt, system_prompt, LLMReportData, model_name=get_evaluation_model())
        
        report = RecruiterReport(
            session_id=session_id,
            aggregated_scores=scores,
            readiness_score=llm_data.readiness_score,
            hiring_recommendation=llm_data.hiring_recommendation,
            executive_summary=llm_data.executive_summary,
            strengths=llm_data.strengths,
            weaknesses=llm_data.weaknesses,
            improvement_areas=llm_data.improvement_areas,
            personalized_roadmap=llm_data.personalized_roadmap
        )
        
        return report
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report via LLM: {str(e)}")
