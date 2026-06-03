from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.schemas.analysis import PreInterviewAnalysis
from app.services.analysis_service import generate_pre_interview_analysis

router = APIRouter(prefix="/analysis", tags=["Pre-Interview Analysis"])

class AnalysisRequest(BaseModel):
    resume_text: str
    jd_text: str

@router.post("/pre-interview", response_model=PreInterviewAnalysis)
async def analyze_pre_interview(request: AnalysisRequest):
    """
    Analyzes a candidate's resume against a job description to generate actionable interview insights and a readiness estimate.
    """
    if not request.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    if not request.jd_text.strip():
        raise HTTPException(status_code=400, detail="Job description text cannot be empty.")
        
    try:
        analysis = await generate_pre_interview_analysis(request.resume_text, request.jd_text)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze pre-interview data: {str(e)}")
