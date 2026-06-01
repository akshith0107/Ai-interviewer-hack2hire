from pydantic import BaseModel, Field
from typing import Optional

class DecisionRequest(BaseModel):
    session_id: str
    latest_score: int = Field(..., ge=0, le=100)

class DecisionResponse(BaseModel):
    next_round_name: str
    next_difficulty: str
    is_terminated: bool
    message: str

class TerminateRequest(BaseModel):
    session_id: str
    reason: Optional[str] = None
