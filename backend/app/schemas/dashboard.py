from pydantic import BaseModel
from typing import List, Optional

class DashboardOverviewResponse(BaseModel):
    interviews_taken: int
    average_score: int
    best_score: int
    readiness_index: int
    avg_duration_minutes: int
    most_practiced_skill: str
    current_streak: int
    total_questions_answered: int

class PerformanceDataPoint(BaseModel):
    name: str # Usually date, mapped to "name" for the chart
    score: int
    role: str
    recommendation: str
    difficulty: str
    questions_answered: int
    average_score: int
    full_date: str

class DashboardPerformanceResponse(BaseModel):
    history: List[PerformanceDataPoint]

class DashboardIntelligenceResponse(BaseModel):
    strength_detected: str
    focus_area: str
    career_tip: str

class RecentOperation(BaseModel):
    role: str
    type: str # "System Design Int.", "Behavioral Int." etc
    score: int
    duration: str
    timeAgo: str
    recommendation: str

class DashboardRecentResponse(BaseModel):
    operations: List[RecentOperation]
