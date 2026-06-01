from pydantic import BaseModel, Field
from typing import List, Optional

class EvaluationScores(BaseModel):
    accuracy: int = Field(..., ge=0, le=100, description="Score for technical or factual accuracy of the answer")
    clarity: int = Field(..., ge=0, le=100, description="Score for how clear and understandable the answer was")
    depth: int = Field(..., ge=0, le=100, description="Score for the depth of knowledge shown")
    relevance: int = Field(..., ge=0, le=100, description="Score for staying on topic and answering the actual question")
    communication: int = Field(..., ge=0, le=100, description="Score for overall communication skills, confidence, and structure")
    overall_score: int = Field(..., ge=0, le=100, description="Normalized overall score based on weighted sub-scores")

class EvaluationFeedback(BaseModel):
    detailed_feedback: str = Field(..., description="Comprehensive feedback paragraph explaining what the candidate did well and poorly.")
    improvement_suggestions: List[str] = Field(..., description="Actionable bullet points for how the candidate can improve next time.")

class EvaluationResponse(BaseModel):
    scores: EvaluationScores
    feedback: EvaluationFeedback

class EvaluateRequest(BaseModel):
    session_id: str
    question_text: str
    expected_ideal_response: str
    candidate_answer: str
    time_taken_seconds: Optional[int] = None
