from fastapi import APIRouter, HTTPException
from app.schemas.interview import (
    StartInterviewRequest, StartInterviewResponse, 
    NextQuestionRequest, QuestionResponse, 
    FollowUpRequest, AnswerHistory
)
from app.schemas.evaluation import EvaluateRequest, EvaluationResponse
from app.schemas.decision import DecisionRequest, DecisionResponse, TerminateRequest
from app.services.state_manager import create_session, get_session, update_session
from app.services.interview_service import generate_next_question, generate_followup
from app.services.evaluation_service import generate_comprehensive_evaluation
from app.services.decision_service import (
    process_adaptive_difficulty, 
    check_early_termination, 
    manage_rounds
)

router = APIRouter(prefix="/interview", tags=["Interview Engine"])

@router.post("/start", response_model=StartInterviewResponse)
async def start_interview(request: StartInterviewRequest):
    """
    Initializes a new interview session in memory.
    """
    try:
        state = create_session(request)
        return StartInterviewResponse(session_id=state.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/question", response_model=QuestionResponse)
async def get_next_question(request: NextQuestionRequest):
    """
    Generates the next interview question based on the session state.
    """
    state = get_session(request.session_id)
    
    try:
        question_data = await generate_next_question(state)
        # We don't save the question to history until the user answers it.
        # But we could increment the question count.
        state.question_count += 1
        update_session(state)
        
        return question_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate question: {str(e)}")

@router.post("/followup", response_model=QuestionResponse)
async def get_followup(request: FollowUpRequest):
    """
    Submits an answer and generates a follow-up question.
    """
    state = get_session(request.session_id)
    
    try:
        followup_data = await generate_followup(state, request.answer)
        
        # Save the history
        # (Assuming the client just answered the *last* generated question, 
        # normally we'd pass the question ID or text back, but for MVP we simplify)
        
        # We just store what they answered as context.
        state.history.append(AnswerHistory(
            question="Follow up triggered", # Placeholder since we didn't track the exact question string statefuly before this
            answer=request.answer,
            question_type=followup_data.question_type,
            difficulty=followup_data.difficulty
        ))
        update_session(state)
        
        return followup_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate follow-up: {str(e)}")

@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_answer(request: EvaluateRequest):
    """
    Evaluates a candidate's answer across multiple dimensions and returns normalized scores.
    """
    try:
        # Note: In a full stateful system, we would fetch the session and log these scores.
        # For Phase 3 MVP, we just compute and return the evaluation.
        evaluation = await generate_comprehensive_evaluation(
            question=request.question_text,
            expected=request.expected_ideal_response,
            answer=request.candidate_answer,
            time_taken=request.time_taken_seconds
        )
        return evaluation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")

@router.post("/decision", response_model=DecisionResponse)
async def process_decision(request: DecisionRequest):
    """
    Deterministic engine to update state based on evaluation scores.
    """
    state = get_session(request.session_id)
    
    if state.status == "terminated" or state.status == "completed":
        return DecisionResponse(
            next_round_name=state.current_round_name,
            next_difficulty=state.current_difficulty,
            is_terminated=True,
            message=f"Session is already {state.status}."
        )
        
    state.score_history.append(request.latest_score)
    state.questions_in_current_round += 1
    
    # Check Termination
    if check_early_termination(state.score_history):
        state.status = "terminated"
        update_session(state)
        return DecisionResponse(
            next_round_name=state.current_round_name,
            next_difficulty=state.current_difficulty,
            is_terminated=True,
            message="Interview terminated early due to low average score."
        )
        
    # Check Round Progression
    next_round = manage_rounds(state.current_round_name, state.questions_in_current_round)
    if next_round != state.current_round_name:
        if next_round == "Completed":
            state.status = "completed"
            update_session(state)
            return DecisionResponse(
                next_round_name=state.current_round_name,
                next_difficulty=state.current_difficulty,
                is_terminated=True,
                message="Interview completed successfully."
            )
        # Progress to new round
        state.current_round_name = next_round
        state.questions_in_current_round = 0
        state.current_round += 1
        
    # Adaptive Difficulty
    state.current_difficulty = process_adaptive_difficulty(state.current_difficulty, request.latest_score)
    
    update_session(state)
    
    return DecisionResponse(
        next_round_name=state.current_round_name,
        next_difficulty=state.current_difficulty,
        is_terminated=False,
        message="State updated successfully."
    )

@router.post("/terminate")
async def terminate_interview(request: TerminateRequest):
    """
    Manually flag an interview session as terminated.
    """
    state = get_session(request.session_id)
    state.status = "terminated"
    update_session(state)
    return {"message": "Interview terminated.", "reason": request.reason}
