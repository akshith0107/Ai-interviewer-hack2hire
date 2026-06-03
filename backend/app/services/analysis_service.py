import os
from fastapi import HTTPException
from app.schemas.analysis import PreInterviewAnalysis
from app.services.groq_service import analyze_text_to_json, get_evaluation_model

async def generate_pre_interview_analysis(resume_text: str, jd_text: str) -> PreInterviewAnalysis:
    """
    Orchestrates the AI-driven pre-interview analysis comparing a resume against a job description.
    """
    system_prompt = (
        "You are an expert technical recruiter and AI interviewer. "
        "Your task is to analyze the provided candidate resume text against the provided job description text. "
        "You must generate a completely unbiased, highly accurate, and structured analysis. "
        "Calculate a match percentage strictly based on overlapping skills and required experience. "
        "Provide critical feedback on missing skills, strengths, weaknesses, and dictate the areas the subsequent AI interview should focus on. "
        "Output your response strictly as valid JSON matching the requested schema."
    )
    
    # Apply token optimizations
    safe_resume = resume_text[:6000]
    safe_jd = jd_text[:3000]
    
    prompt = f"""
    JOB DESCRIPTION:
    {safe_jd}
    
    ================================================
    
    CANDIDATE RESUME:
    {safe_resume}
    """
    
    try:
        analysis = await analyze_text_to_json(
            prompt=prompt,
            system_prompt=system_prompt,
            response_model=PreInterviewAnalysis,
            model_name=get_evaluation_model()
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate pre-interview analysis: {str(e)}")
