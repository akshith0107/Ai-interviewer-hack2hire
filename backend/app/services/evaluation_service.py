import os
import logging
from app.schemas.evaluation import EvaluationResponse, EvaluationScores, EvaluationFeedback
from app.services.groq_service import analyze_text_to_json

# Setup custom logger for Evaluation Engine
logger = logging.getLogger("evaluation_engine")
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
ch.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.addHandler(ch)

# Using DeepSeek model for deep analysis if requested, else default
EVAL_MODEL = os.getenv("GROQ_EVALUATION_MODEL", "deepseek-r1-distill-llama-70b")

# Define a temporary schema just for the LLM to output cleanly before we merge
from pydantic import BaseModel, Field
from typing import List

class LLMEvaluationRaw(BaseModel):
    accuracy: int = Field(..., ge=0, le=100)
    clarity: int = Field(..., ge=0, le=100)
    depth: int = Field(..., ge=0, le=100)
    relevance: int = Field(..., ge=0, le=100)
    communication: int = Field(..., ge=0, le=100)
    detailed_feedback: str
    improvement_suggestions: List[str]

def calculate_time_penalty(time_taken_seconds: int, word_count: int) -> int:
    """
    Mathematical formula to penalize rambling or overly brief answers.
    Returns a score modifier between -10 and +5.
    """
    if not time_taken_seconds:
        return 0
    words_per_minute = (word_count / time_taken_seconds) * 60
    
    # Rambling: speaking fast but too long, or too slow
    if time_taken_seconds > 180: # > 3 minutes is usually too long for a standard answer
        return -5
    if words_per_minute < 80: # Speaking too slowly/hesitating
        return -5
    if words_per_minute > 160 and time_taken_seconds < 30: # Rushing
        return -2
    return 0

def normalize_overall_score(scores: dict, time_penalty: int) -> int:
    """
    Weighted average for normalization.
    Accuracy: 30%
    Depth: 25%
    Relevance: 20%
    Clarity: 15%
    Communication: 10%
    """
    weighted = (
        scores['accuracy'] * 0.30 +
        scores['depth'] * 0.25 +
        scores['relevance'] * 0.20 +
        scores['clarity'] * 0.15 +
        scores['communication'] * 0.10
    )
    final = round(weighted) + time_penalty
    return max(0, min(100, final)) # Clamp between 0-100

async def generate_comprehensive_evaluation(question: str, expected: str, answer: str, time_taken: int = None) -> EvaluationResponse:
    """
    Orchestrates the evaluation by calling Groq, applying math penalties, and returning structured data.
    """
    logger.info(f"Starting evaluation for question: {question[:50]}...")
    
    system_prompt = (
        "You are an expert technical interviewer evaluating a candidate's answer. "
        "Critically grade the candidate on Accuracy, Clarity, Depth, Relevance, and Communication on a scale of 0-100. "
        "Provide detailed, constructive feedback and actionable improvement suggestions. "
        "Strictly output valid JSON matching the schema."
    )
    
    prompt = f"""
    Question Asked: {question}
    Expected Ideal Response Key Points: {expected}
    
    Candidate's Actual Answer: {answer}
    """
    
    # Call Groq (Note: Using the existing analyze_text_to_json. To strictly use the EVAL_MODEL, 
    # we might need to modify groq_service or temporarily override it, but for Phase 3 
    # we assume the generic groq_service is sufficient or uses a fallback model)
    try:
        raw_eval = await analyze_text_to_json(prompt, system_prompt, LLMEvaluationRaw)
        
        # Calculate Time Efficiency
        word_count = len(answer.split())
        time_penalty = calculate_time_penalty(time_taken, word_count) if time_taken else 0
        
        # Normalize
        raw_scores_dict = {
            "accuracy": raw_eval.accuracy,
            "clarity": raw_eval.clarity,
            "depth": raw_eval.depth,
            "relevance": raw_eval.relevance,
            "communication": raw_eval.communication
        }
        overall = normalize_overall_score(raw_scores_dict, time_penalty)
        
        scores = EvaluationScores(
            accuracy=raw_eval.accuracy,
            clarity=raw_eval.clarity,
            depth=raw_eval.depth,
            relevance=raw_eval.relevance,
            communication=raw_eval.communication,
            overall_score=overall
        )
        
        feedback = EvaluationFeedback(
            detailed_feedback=raw_eval.detailed_feedback,
            improvement_suggestions=raw_eval.improvement_suggestions
        )
        
        logger.info(f"Evaluation complete. Overall Score: {overall}")
        return EvaluationResponse(scores=scores, feedback=feedback)
        
    except Exception as e:
        logger.error(f"Evaluation failed: {str(e)}")
        raise e
