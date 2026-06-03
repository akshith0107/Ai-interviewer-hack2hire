from app.schemas.interview import InterviewState, QuestionResponse, AnswerHistory
from app.services.groq_service import analyze_text_to_json, get_fast_model
import json

async def generate_next_question(state: InterviewState) -> QuestionResponse:
    """
    Generates the next interview question based on the resume, JD, history, and difficulty.
    """
    system_prompt = (
        "You are a Senior Technical Interviewer.\n"
        "Generate exactly ONE interview question.\n\n"
        "Rules:\n"
        "- Ask one question only.\n"
        "- No greetings.\n"
        "- No explanations.\n"
        "- No multiple questions.\n"
        "- Focus on real-world assessment.\n"
        "- Prefer scenario-based questions.\n"
        "- Avoid repeating previous questions.\n\n"
        "Return ONLY JSON."
    )

    history_str = json.dumps([h.model_dump() for h in state.history[-5:]], indent=2) if state.history else "No previous questions yet."
    
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

    question_data = await analyze_text_to_json(prompt, system_prompt, QuestionResponse, model_name=get_fast_model())
    return question_data

async def generate_followup(state: InterviewState, latest_answer: str) -> QuestionResponse:
    """
    Generates a follow-up question specifically drilling down into the candidate's latest answer.
    """
    system_prompt = (
        "You are a Senior Technical Interviewer.\n"
        "The candidate just answered your previous question.\n"
        "Your task is to generate exactly ONE logical, probing follow-up question based *only* on their answer.\n"
        "If their answer was vague, ask them to clarify or provide a specific example.\n"
        "If their answer was good, ask a slightly harder, related technical depth question.\n\n"
        "Rules:\n"
        "- Ask one question only.\n"
        "- No greetings.\n"
        "- No explanations.\n"
        "- No multiple questions.\n\n"
        "Return ONLY JSON."
    )

    last_q = state.history[-1].question if state.history else "N/A"
    
    prompt = f"""
    Previous Question: {last_q}
    Candidate's Answer: {latest_answer}
    
    Current Target Difficulty: {state.current_difficulty}
    
    Instructions:
    Generate a relevant follow-up question.
    """

    followup_data = await analyze_text_to_json(prompt, system_prompt, QuestionResponse, model_name=get_fast_model())
    return followup_data
