from pydantic import BaseModel
from typing import List, Optional

class AnalyticsOverviewResponse(BaseModel):
    readiness_score: int
    total_interviews: int
    average_score: int
    strongest_skill: str
    weakest_skill: str

class TrendDataPoint(BaseModel):
    date: str
    score: int
    role: str

class AnalyticsTrendsResponse(BaseModel):
    history: List[TrendDataPoint]

class AnalyticsSkillsResponse(BaseModel):
    technical: int
    communication: int
    behavioral: int
    problem_solving: int
    system_design: int
    confidence: int

class AnalyticsDifficultyResponse(BaseModel):
    easy: int
    medium: int
    hard: int

class AnalyticsInsightsResponse(BaseModel):
    top_strength: str
    biggest_gap: str
    improvement_focus: str
    projected_readiness: str

class InterviewHistoryItem(BaseModel):
    id: str
    date: str
    role: str
    score: int
    recommendation: str
    status: str

class AnalyticsHistoryResponse(BaseModel):
    history: List[InterviewHistoryItem]
