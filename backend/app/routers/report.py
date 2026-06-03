from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import User
from app.core.deps import get_current_user
from app.schemas.report import RecruiterReport, GenerateReportRequest
from app.services.report_service import generate_recruiter_report, get_report
from app.services.state_manager import save_report

router = APIRouter(prefix="/report", tags=["Recruiter Report"])

@router.post("/generate", response_model=RecruiterReport)
async def generate_report(request: GenerateReportRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Generate via LLM
    report = await generate_recruiter_report(request.session_id, db, current_user.id)
    
    # Save to DB
    save_report(db, request.session_id, report.model_dump())
    
    return report

@router.get("/{interview_id}", response_model=RecruiterReport)
async def fetch_report(interview_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_report(interview_id, db, current_user.id)
