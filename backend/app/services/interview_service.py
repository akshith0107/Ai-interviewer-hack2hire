from app.schemas.interview import InterviewState, QuestionResponse, AnswerHistory
from app.services.groq_service import analyze_text_to_json
import json

async def generate_next_question(state: InterviewState) -> QuestionResponse:
    """
    Generates the next interview question based on the resume, JD, history, and difficulty.
    """
    system_prompt = (
        "You are an expert AI technical interviewer. Generate the next interview question for the candidate. "
        "The question must match the requested difficulty and use the candidate's context (resume and job description). "
        "Do not repeat previous questions. Ensure it assesses actual skills required for the job. "
        "Strictly output valid JSON matching the schema."
    )

    history_str = json.dumps([h.model_dump() for h in state.history[-3:]], indent=2) if state.history else "No previous questions yet."
    
    # Format context
    context = ""
    if state.context.candidate_profile:
        context += f"\nCandidate Profile: {state.context.candidate_profile.summary}\nSkills: {', '.join(state.context.candidate_profile.skills)}"
    if state.context.jd_analysis:
        context += f"\nJob Role: {state.context.jd_analysis.role}\nRequired Skills: {', '.join(state.context.jd_analysis.required_skills)}"

    prompt = f"""
    Context: {context}
    
    Recent Interview History:
    {history_str}
    
    Instructions:
    Generate a {state.current_difficulty} difficulty question. 
    It can be Technical, Conceptual, Behavioral, or Scenario-based.
    """

    question_data = await analyze_text_to_json(prompt, system_prompt, QuestionResponse)
    return question_data

async def generate_followup(state: InterviewState, latest_answer: str) -> QuestionResponse:
    """
    Generates a follow-up question specifically drilling down into the candidate's latest answer.
    """
    system_prompt = (
        "You are an expert AI technical interviewer. The candidate just answered your previous question. "
        "Your task is to generate a logical, probing follow-up question based *only* on their answer. "
        "If their answer was vague, ask them to clarify or provide a specific example. "
        "If their answer was good, ask a slightly harder, related technical depth question. "
        "Strictly output valid JSON matching the schema."
    )

    last_q = state.history[-1].question if state.history else "N/A"
    
    prompt = f"""
    Previous Question: {last_q}
    Candidate's Answer: {latest_answer}
    
    Current Target Difficulty: {state.current_difficulty}
    
    Instructions:
    Generate a relevant follow-up question.
    """

    followup_data = await analyze_text_to_json(prompt, system_prompt, QuestionResponse)
    return followup_data
