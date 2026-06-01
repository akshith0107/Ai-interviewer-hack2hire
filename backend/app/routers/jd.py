from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.schemas.jd import JDAnalysis
from app.services.jd_service import analyze_jd_text

router = APIRouter(prefix="/jd", tags=["JD Intelligence"])

class JDRequest(BaseModel):
    text: str

@router.post("/analyze", response_model=JDAnalysis)
async def analyze_jd(request: JDRequest):
    """
    Analyzes raw job description text and extracts structured details using Groq.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Job description text cannot be empty.")
        
    try:
        jd_analysis = await analyze_jd_text(request.text)
        return jd_analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze Job Description: {str(e)}")
