from pydantic import BaseModel, Field
from typing import List

class JDAnalysis(BaseModel):
    role: str = Field(..., description="The primary job title or role")
    required_skills: List[str] = Field(..., description="List of mandatory technical and soft skills required")
    nice_to_have_skills: List[str] = Field(..., description="List of optional or preferred skills")
    responsibilities: List[str] = Field(..., description="Key responsibilities and duties of the role")
    core_focus_areas: List[str] = Field(..., description="List of core focus areas for the role")
    expected_experience_level: str = Field(..., description="Expected experience level (e.g., Junior, Mid, Senior)")
