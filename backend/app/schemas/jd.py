from pydantic import BaseModel, Field
from typing import List

class JDAnalysis(BaseModel):
    role: str = Field(..., description="The primary job title or role")
    required_skills: List[str] = Field(..., description="List of mandatory technical and soft skills required")
    nice_to_have_skills: List[str] = Field(..., description="List of optional or preferred skills")
    responsibilities: List[str] = Field(..., description="Key responsibilities and duties of the role")
    core_focus: str = Field(..., description="A short summary of what the role fundamentally entails")
