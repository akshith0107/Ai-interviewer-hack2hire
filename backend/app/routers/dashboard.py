from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import User
from app.core.deps import get_current_user
from app.schemas.dashboard import (
    DashboardOverviewResponse,
    DashboardPerformanceResponse,
    DashboardIntelligenceResponse,
    DashboardRecentResponse
)
from app.services.dashboard_service import (
    get_dashboard_overview,
    get_dashboard_performance,
    get_dashboard_intelligence,
    get_dashboard_recent
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/overview", response_model=DashboardOverviewResponse)
async def fetch_overview(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return get_dashboard_overview(db, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/performance", response_model=DashboardPerformanceResponse)
async def fetch_performance(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return get_dashboard_performance(db, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/intelligence", response_model=DashboardIntelligenceResponse)
async def fetch_intelligence(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return await get_dashboard_intelligence(db, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recent", response_model=DashboardRecentResponse)
async def fetch_recent(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return get_dashboard_recent(db, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
