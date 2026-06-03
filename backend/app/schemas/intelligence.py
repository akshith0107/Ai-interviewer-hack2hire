from pydantic import BaseModel
from typing import List, Dict, Optional

class ImprovementWeek(BaseModel):
    week: str
    topics: List[str]
    projects: List[str]
    practice_areas: List[str]
    mock_interview_targets: List[str]

class PersonalityProfile(BaseModel):
    communication_style: str
    confidence_level: str
    problem_solving_style: str
    collaboration_style: str

class RoleMatch(BaseModel):
    role: str
    match: int

class AICareerInsights(BaseModel):
    biggest_strength: str
    biggest_weakness: str
    fastest_improvement_opportunity: str
    recommended_next_skill: str

# Expected output from GPT OSS 120B
class IntelligenceLLMData(BaseModel):
    hiring_recommendation: str
    readiness_category: str
    executive_summary: str
    improvement_plan: List[ImprovementWeek]
    personality_profile: PersonalityProfile
    recommended_roles: List[RoleMatch]
    career_insights: AICareerInsights

# Full response to Frontend
class SkillGap(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str]
    match_percentage: int

class HiringProbability(BaseModel):
    current_probability: int
    projected_probability: int

class IntelligenceResponse(BaseModel):
    readiness_score: int
    readiness_category: str
    hiring_probability: HiringProbability
    top_strengths: List[str]
    top_weaknesses: List[str]
    skill_gap: SkillGap
    recommended_roles: List[RoleMatch]
    improvement_plan: List[ImprovementWeek]
    personality_profile: PersonalityProfile
    career_insights: AICareerInsights
    executive_summary: str
    hiring_recommendation: str
