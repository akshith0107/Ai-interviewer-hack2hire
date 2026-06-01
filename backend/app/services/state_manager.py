import uuid
from typing import Dict
from fastapi import HTTPException
from app.schemas.interview import InterviewState, InterviewContext, StartInterviewRequest

# In-memory store for MVP
_sessions: Dict[str, InterviewState] = {}

def create_session(request: StartInterviewRequest) -> InterviewState:
    session_id = str(uuid.uuid4())
    state = InterviewState(
        session_id=session_id,
        context=InterviewContext(
            candidate_profile=request.candidate_profile,
            jd_analysis=request.jd_analysis
        ),
        current_difficulty=request.starting_difficulty,
    )
    _sessions[session_id] = state
    return state

def get_session(session_id: str) -> InterviewState:
    if session_id not in _sessions:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    return _sessions[session_id]

def update_session(state: InterviewState) -> None:
    _sessions[state.session_id] = state
