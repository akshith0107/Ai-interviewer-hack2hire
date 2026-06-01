from pydantic import BaseModel, Field
from typing import List, Optional

class Project(BaseModel):
    name: str = Field(..., description="Name of the project")
    description: str = Field(..., description="Brief description of the project")
    technologies: List[str] = Field(..., description="Technologies used in the project")

class Experience(BaseModel):
    role: str = Field(..., description="Job title or role")
    company: str = Field(..., description="Name of the company")
    duration: str = Field(..., description="Duration of the experience")
    description: str = Field(..., description="Description of responsibilities and achievements")

class Education(BaseModel):
    degree: str = Field(..., description="Degree obtained")
    institution: str = Field(..., description="Name of the educational institution")
    year: str = Field(..., description="Year of graduation or duration")

class CandidateProfile(BaseModel):
    name: Optional[str] = Field(None, description="Candidate's full name")
    email: Optional[str] = Field(None, description="Candidate's email address")
    skills: List[str] = Field(..., description="List of technical and soft skills extracted from the resume")
    projects: List[Project] = Field(..., description="List of projects worked on")
    experience: List[Experience] = Field(..., description="List of professional work experiences")
    education: List[Education] = Field(..., description="List of educational qualifications")
    summary: str = Field(..., description="A short AI-generated professional summary of the candidate")
