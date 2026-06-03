from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import User
from app.core.deps import get_current_user
from app.schemas.analytics import (
    AnalyticsOverviewResponse,
    AnalyticsTrendsResponse,
    AnalyticsSkillsResponse,
    AnalyticsInsightsResponse,
    AnalyticsHistoryResponse,
    AnalyticsDifficultyResponse
)
from app.services.analytics_service import (
    get_analytics_overview,
    get_analytics_trends,
    get_analytics_skills,
    get_analytics_insights,
    get_analytics_history,
    get_analytics_difficulty
)

router = APIRouter(prefix="/analytics", tags=["Analytics Dashboard"])

@router.get("/overview", response_model=AnalyticsOverviewResponse)
async def fetch_overview(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return get_analytics_overview(db, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trends", response_model=AnalyticsTrendsResponse)
async def fetch_trends(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return get_analytics_trends(db, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/skills", response_model=AnalyticsSkillsResponse)
async def fetch_skills(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return get_analytics_skills(db, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/difficulty", response_model=AnalyticsDifficultyResponse)
async def fetch_difficulty(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return get_analytics_difficulty(db, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/insights", response_model=AnalyticsInsightsResponse)
async def fetch_insights(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return await get_analytics_insights(db, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=AnalyticsHistoryResponse)
async def fetch_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return get_analytics_history(db, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
