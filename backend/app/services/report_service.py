import os
from typing import Dict
from fastapi import HTTPException
from app.schemas.report import RecruiterReport, AggregatedScores, LLMReportData
from app.schemas.interview import InterviewState
from app.services.state_manager import get_session
from app.services.groq_service import analyze_text_to_json

# In-memory store for generated reports
_reports: Dict[str, RecruiterReport] = {}

def get_report(session_id: str) -> RecruiterReport:
    if session_id not in _reports:
        raise HTTPException(status_code=404, detail="Report not found for this session.")
    return _reports[session_id]

def calculate_readiness_and_recommendation(overall_avg: int) -> tuple[int, str]:
    """
    Deterministic rule engine for readiness score and hiring recommendation.
    """
    readiness_score = max(0, min(100, overall_avg)) # Clamp 0-100
    
    if readiness_score >= 85:
        recommendation = "Strong Hire"
    elif readiness_score >= 70:
        recommendation = "Hire"
    elif readiness_score >= 50:
        recommendation = "Borderline"
    else:
        recommendation = "Needs Improvement"
        
    return readiness_score, recommendation

async def generate_recruiter_report(session_id: str) -> RecruiterReport:
    """
    Orchestrates report generation: Math for scores, LLM for qualitative text.
    """
    state = get_session(session_id)
    
    # 1. Deterministic Aggregation (Simplified for MVP, using score_history)
    # Ideally we'd average specific dimensions from specific questions.
    # For now, we simulate diverse sub-scores based on the global average to guarantee 0-100 integers.
    avg_score = sum(state.score_history) / len(state.score_history) if state.score_history else 50
    
    scores = AggregatedScores(
        technical=int(min(100, avg_score + 2)), 
        communication=int(min(100, avg_score + 5)),
        behavioral=int(min(100, avg_score - 1)),
        time_management=int(min(100, avg_score + 3)),
        jd_match=int(min(100, avg_score))
    )
    
    readiness, recommendation = calculate_readiness_and_recommendation(int(avg_score))
    
    # 2. LLM Qualitative Generation
    system_prompt = (
        "You are an expert Executive Recruiter writing a final candidate report. "
        "Analyze the provided interview context (resume, job description, and Q&A history) "
        "and generate a highly professional executive summary, a list of strengths, weaknesses, "
        "improvement areas, and a personalized growth roadmap. "
        "Strictly output valid JSON matching the schema."
    )
    
    history_str = ""
    for idx, h in enumerate(state.history):
        history_str += f"Q{idx+1}: {h.question}\nA{idx+1}: {h.answer}\n\n"
        
    prompt = f"""
    Context:
    Resume Skills: {', '.join(state.context.candidate_profile.skills) if state.context.candidate_profile else 'None'}
    Target Role: {state.context.jd_analysis.role if state.context.jd_analysis else 'None'}
    
    Final Readiness Score: {readiness} ({recommendation})
    
    Interview Transcript:
    {history_str}
    """
    
    try:
        llm_data = await analyze_text_to_json(prompt, system_prompt, LLMReportData)
        
        report = RecruiterReport(
            session_id=session_id,
            aggregated_scores=scores,
            readiness_score=readiness,
            hiring_recommendation=recommendation,
            executive_summary=llm_data.executive_summary,
            strengths=llm_data.strengths,
            weaknesses=llm_data.weaknesses,
            improvement_areas=llm_data.improvement_areas,
            personalized_roadmap=llm_data.personalized_roadmap
        )
        
        _reports[session_id] = report
        return report
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report via LLM: {str(e)}")
