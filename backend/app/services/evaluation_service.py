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

from app.services.groq_service import analyze_text_to_json, get_evaluation_model

# Define a temporary schema just for the LLM to output cleanly before we merge
from pydantic import BaseModel, Field
from typing import List

class LLMEvaluationRaw(BaseModel):
    accuracy: int = Field(..., ge=0, le=100)
    clarity: int = Field(..., ge=0, le=100)
    depth: int = Field(..., ge=0, le=100)
    relevance: int = Field(..., ge=0, le=100)
    communication: int = Field(..., ge=0, le=100)
    time_efficiency: int = Field(..., ge=0, le=100)
    overall_score: int = Field(..., ge=0, le=100)
    feedback: str
    strengths: List[str]
    weaknesses: List[str]



async def generate_comprehensive_evaluation(question: str, expected: str, answer: str, time_taken: int = None) -> EvaluationResponse:
    """
    Orchestrates the evaluation by calling Groq, applying math penalties, and returning structured data.
    """
    logger.info(f"Starting evaluation for question: {question[:50]}...")
    
    system_prompt = (
        "You are a Senior Engineering Hiring Panel.\n"
        "Evaluate the candidate answer.\n"
        "Compare against the ideal answer.\n"
        "Score:\n"
        "- Accuracy\n"
        "- Clarity\n"
        "- Depth\n"
        "- Relevance\n"
        "- Communication\n"
        "- Time Efficiency\n\n"
        "Scale: 0-100\n\n"
        "Rules:\n"
        "- Reward correctness.\n"
        "- Penalize hallucinations.\n"
        "- Penalize irrelevant content.\n"
        "- Penalize incomplete answers.\n"
        "- Evaluate quality, not length.\n"
        "- Extremely slow answers should reduce time efficiency.\n"
        "- Fast but incorrect answers should be penalized.\n"
        "- Be strict and realistic.\n\n"
        "Calculate overall score.\n"
        "Return ONLY JSON."
    )
    
    prompt = f"""
    Question Asked: {question}
    Expected Ideal Response Key Points: {expected}
    
    Candidate's Actual Answer: {answer}
    Time Taken (seconds): {time_taken or 'N/A'}
    """
    
    # Call Groq
    try:
        raw_eval = await analyze_text_to_json(prompt, system_prompt, LLMEvaluationRaw, model_name=get_evaluation_model())
        
        scores = EvaluationScores(
            accuracy=raw_eval.accuracy,
            clarity=raw_eval.clarity,
            depth=raw_eval.depth,
            relevance=raw_eval.relevance,
            communication=raw_eval.communication,
            time_efficiency=raw_eval.time_efficiency,
            overall_score=raw_eval.overall_score
        )
        
        feedback = EvaluationFeedback(
            feedback=raw_eval.feedback,
            strengths=raw_eval.strengths,
            weaknesses=raw_eval.weaknesses
        )
        
        logger.info(f"Evaluation complete. Overall Score: {raw_eval.overall_score}")
        return EvaluationResponse(scores=scores, feedback=feedback)
        
    except Exception as e:
        logger.error(f"Evaluation failed: {str(e)}")
        raise e
