from pydantic import BaseModel, Field
from typing import List, Optional

class LLMEvaluationRaw(BaseModel):
    accuracy: int = Field(..., ge=0, le=100)
    clarity: int = Field(..., ge=0, le=100)
    depth: int = Field(..., ge=0, le=100)
    relevance: int = Field(..., ge=0, le=100)
    communication: int = Field(..., ge=0, le=100)
    time_efficiency: int = Field(..., ge=0, le=100)
    overall_score: int = Field(..., ge=0, le=100)
    strengths: List[str]
    weaknesses: List[str]
    feedback: str

class EvaluationScores(BaseModel):
    accuracy: int = Field(..., ge=0, le=100)
    clarity: int = Field(..., ge=0, le=100)
    depth: int = Field(..., ge=0, le=100)
    relevance: int = Field(..., ge=0, le=100)
    communication: int = Field(..., ge=0, le=100)
    time_efficiency: int = Field(..., ge=0, le=100)
    overall_score: int = Field(..., ge=0, le=100)

class EvaluationFeedback(BaseModel):
    feedback: str
    strengths: List[str]
    weaknesses: List[str]

class EvaluationResponse(BaseModel):
    scores: EvaluationScores
    feedback: EvaluationFeedback

class EvaluateRequest(BaseModel):
    session_id: str
    question_text: str
    expected_ideal_response: str
    candidate_answer: str
    time_taken_seconds: Optional[int] = None
