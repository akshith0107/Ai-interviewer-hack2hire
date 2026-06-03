from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.interview import (
    StartInterviewRequest, StartInterviewResponse, 
    NextQuestionRequest, QuestionResponse, 
    FollowUpRequest, AnswerHistory
)
from app.schemas.evaluation import EvaluateRequest, EvaluationResponse
from app.schemas.decision import DecisionRequest, DecisionResponse, TerminateRequest
from app.services.state_manager import (
    create_session, get_session, update_session, 
    save_question, save_answer, save_evaluation
)
from app.services.interview_service import generate_next_question, generate_followup
from app.services.evaluation_service import generate_comprehensive_evaluation
from app.services.decision_service import (
    process_adaptive_difficulty, 
    check_early_termination, 
    manage_rounds
)

router = APIRouter(prefix="/interview", tags=["Interview Engine"])

@router.post("/start", response_model=StartInterviewResponse)
async def start_interview(request: StartInterviewRequest, db: Session = Depends(get_db)):
    try:
        state = create_session(db, request)
        return StartInterviewResponse(session_id=state.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/question", response_model=QuestionResponse)
async def get_next_question(request: NextQuestionRequest, db: Session = Depends(get_db)):
    state = get_session(db, request.session_id)
    
    try:
        question_data = await generate_next_question(state)
        save_question(db, request.session_id, question_data.question_text, question_data.difficulty, question_data.question_type)
        return question_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate question: {str(e)}")

@router.post("/followup", response_model=QuestionResponse)
async def get_followup(request: FollowUpRequest, db: Session = Depends(get_db)):
    state = get_session(db, request.session_id)
    
    try:
        # First save the answer to the DB that triggered this followup
        last_q = state.history[-1].question if state.history else ""
        if last_q:
            save_answer(db, request.session_id, last_q, request.answer)
            
        followup_data = await generate_followup(state, request.answer)
        save_question(db, request.session_id, followup_data.question_text, followup_data.difficulty, followup_data.question_type)
        return followup_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate follow-up: {str(e)}")

@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_answer(request: EvaluateRequest, db: Session = Depends(get_db)):
    try:
        # Save the answer first
        save_answer(db, request.session_id, request.question_text, request.candidate_answer, request.time_taken_seconds)
        
        evaluation = await generate_comprehensive_evaluation(
            question=request.question_text,
            expected=request.expected_ideal_response,
            answer=request.candidate_answer,
            time_taken=request.time_taken_seconds
        )
        
        # Save the evaluation
        save_evaluation(db, request.session_id, request.candidate_answer, evaluation.scores.model_dump() | {"feedback": evaluation.feedback.feedback})
        return evaluation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")

@router.post("/decision", response_model=DecisionResponse)
async def process_decision(request: DecisionRequest, db: Session = Depends(get_db)):
    state = get_session(db, request.session_id)
    
    if state.status == "terminated" or state.status == "completed":
        return DecisionResponse(
            next_round_name=state.current_round_name,
            next_difficulty=state.current_difficulty,
            is_terminated=True,
            message=f"Session is already {state.status}."
        )
        
    state.score_history.append(request.latest_score)
    state.questions_in_current_round += 1
    
    if check_early_termination(state.score_history):
        state.status = "terminated"
        update_session(db, state)
        return DecisionResponse(
            next_round_name=state.current_round_name,
            next_difficulty=state.current_difficulty,
            is_terminated=True,
            message="Interview terminated early due to low average score."
        )
        
    next_round = manage_rounds(state.current_round_name, state.questions_in_current_round)
    if next_round != state.current_round_name:
        if next_round == "Completed":
            state.status = "completed"
            update_session(db, state)
            return DecisionResponse(
                next_round_name=state.current_round_name,
                next_difficulty=state.current_difficulty,
                is_terminated=True,
                message="Interview completed successfully."
            )
        state.current_round_name = next_round
        state.questions_in_current_round = 0
        state.current_round += 1
        
    state.current_difficulty = process_adaptive_difficulty(state.current_difficulty, request.latest_score)
    update_session(db, state)
    
    return DecisionResponse(
        next_round_name=state.current_round_name,
        next_difficulty=state.current_difficulty,
        is_terminated=False,
        message="State updated successfully."
    )

@router.post("/terminate")
async def terminate_interview(request: TerminateRequest, db: Session = Depends(get_db)):
    state = get_session(db, request.session_id)
    state.status = "terminated"
    update_session(db, state)
    return {"message": "Interview terminated.", "reason": request.reason}
