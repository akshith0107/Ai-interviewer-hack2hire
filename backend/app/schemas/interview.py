from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.schemas.resume import CandidateProfile
from app.schemas.jd import JDAnalysis

class InterviewContext(BaseModel):
    candidate_profile: Optional[CandidateProfile] = None
    jd_analysis: Optional[JDAnalysis] = None

class AnswerHistory(BaseModel):
    question: str
    answer: str
    question_type: str
    difficulty: str

class InterviewState(BaseModel):
    session_id: str
    context: InterviewContext
    current_round: int = 1
    current_round_name: str = "Introduction"
    current_difficulty: str = "Medium"
    question_count: int = 0
    questions_in_current_round: int = 0
    history: List[AnswerHistory] = []
    score_history: List[int] = []
    # Just to hold basic state logic
    status: str = "active"

class StartInterviewRequest(BaseModel):
    candidate_profile: Optional[CandidateProfile] = None
    jd_analysis: Optional[JDAnalysis] = None
    starting_difficulty: str = "Medium"

class StartInterviewResponse(BaseModel):
    session_id: str
    message: str = "Interview session started successfully."

class QuestionResponse(BaseModel):
    question_text: str = Field(..., description="The actual question to ask the candidate.")
    question_type: str = Field(..., description="Type of question: Technical, Conceptual, Behavioral, or Scenario-based.")
    difficulty: str = Field(..., description="Difficulty level: Easy, Medium, or Hard.")
    expected_ideal_response: str = Field(..., description="Key points the interviewer expects in a good answer.")

class FollowUpRequest(BaseModel):
    session_id: str
    answer: str

class NextQuestionRequest(BaseModel):
    session_id: str
