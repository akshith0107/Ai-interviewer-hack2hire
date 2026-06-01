from pydantic import BaseModel, Field
from typing import List, Optional

class AggregatedScores(BaseModel):
    technical: int = Field(..., ge=0, le=100)
    communication: int = Field(..., ge=0, le=100)
    behavioral: int = Field(..., ge=0, le=100)
    time_management: int = Field(..., ge=0, le=100)
    jd_match: int = Field(..., ge=0, le=100)

class LLMReportData(BaseModel):
    executive_summary: str
    strengths: List[str]
    weaknesses: List[str]
    improvement_areas: List[str]
    personalized_roadmap: str

class RecruiterReport(BaseModel):
    session_id: str
    aggregated_scores: AggregatedScores
    readiness_score: int = Field(..., ge=0, le=100)
    hiring_recommendation: str
    executive_summary: str
    strengths: List[str]
    weaknesses: List[str]
    improvement_areas: List[str]
    personalized_roadmap: str

class GenerateReportRequest(BaseModel):
    session_id: str
