from pydantic import BaseModel, Field
from typing import List

class PreInterviewAnalysis(BaseModel):
    match_percentage: int = Field(..., description="A score from 0 to 100 indicating how well the resume matches the job description.")
    strengths: List[str] = Field(..., description="List of the candidate's core strengths relative to the role.")
    weaknesses: List[str] = Field(..., description="List of the candidate's weaknesses or potential red flags relative to the role.")
    missing_skills: List[str] = Field(..., description="List of crucial skills required by the JD that are missing from the resume.")
    skill_gap_analysis: str = Field(..., description="A brief narrative explaining the gap between the candidate's experience and the role's requirements.")
    recommended_difficulty: str = Field(..., description="Recommended starting interview difficulty (e.g., 'Easy', 'Medium', 'Hard') based on candidate profile strength.")
    readiness_estimate: str = Field(..., description="A short narrative summarizing the candidate's overall readiness for the interview based on the JD.")
    suggested_focus_areas: List[str] = Field(..., description="Specific topics or behavioral areas the AI interviewer should focus on to probe potential gaps.")
