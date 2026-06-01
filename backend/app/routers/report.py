from fastapi import APIRouter
from app.schemas.report import RecruiterReport, GenerateReportRequest
from app.services.report_service import generate_recruiter_report, get_report

router = APIRouter(prefix="/report", tags=["Recruiter Report"])

@router.post("/generate", response_model=RecruiterReport)
async def generate_report(request: GenerateReportRequest):
    """
    Analyzes the complete interview session state and generates a final recruiter report via LLM.
    """
    report = await generate_recruiter_report(request.session_id)
    return report

@router.get("/{interview_id}", response_model=RecruiterReport)
async def fetch_report(interview_id: str):
    """
    Retrieves a previously generated recruiter report for a specific session ID.
    """
    return get_report(interview_id)
