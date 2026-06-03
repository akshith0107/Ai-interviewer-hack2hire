from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
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
async def fetch_overview(db: Session = Depends(get_db)):
    try:
        return get_dashboard_overview(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/performance", response_model=DashboardPerformanceResponse)
async def fetch_performance(db: Session = Depends(get_db)):
    try:
        return get_dashboard_performance(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/intelligence", response_model=DashboardIntelligenceResponse)
async def fetch_intelligence(db: Session = Depends(get_db)):
    try:
        return await get_dashboard_intelligence(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recent", response_model=DashboardRecentResponse)
async def fetch_recent(db: Session = Depends(get_db)):
    try:
        return get_dashboard_recent(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
