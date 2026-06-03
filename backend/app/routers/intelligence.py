from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.intelligence import IntelligenceResponse
from app.services.intelligence_service import generate_intelligence_report

router = APIRouter(prefix="/intelligence", tags=["Intelligence Center"])

@router.get("/{user_id}", response_model=IntelligenceResponse)
async def fetch_intelligence(user_id: str, db: Session = Depends(get_db)):
    try:
        return await generate_intelligence_report(user_id, db)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
