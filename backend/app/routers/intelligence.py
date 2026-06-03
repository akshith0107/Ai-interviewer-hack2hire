from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import User
from app.core.deps import get_current_user
from app.schemas.intelligence import IntelligenceResponse
from app.services.intelligence_service import generate_intelligence_report

router = APIRouter(prefix="/intelligence", tags=["Intelligence Center"])

@router.get("/me", response_model=IntelligenceResponse)
async def fetch_intelligence(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return await generate_intelligence_report(current_user.id, db)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
