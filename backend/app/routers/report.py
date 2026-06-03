from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.report import RecruiterReport, GenerateReportRequest
from app.services.report_service import generate_recruiter_report, get_report
from app.services.state_manager import save_report

router = APIRouter(prefix="/report", tags=["Recruiter Report"])

@router.post("/generate", response_model=RecruiterReport)
async def generate_report(request: GenerateReportRequest, db: Session = Depends(get_db)):
    # Generate via LLM
    report = await generate_recruiter_report(request.session_id, db)
    
    # Save to DB
    save_report(db, request.session_id, report.model_dump())
    
    return report

@router.get("/{interview_id}", response_model=RecruiterReport)
async def fetch_report(interview_id: str, db: Session = Depends(get_db)):
    return get_report(interview_id, db)
