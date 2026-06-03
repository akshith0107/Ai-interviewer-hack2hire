from app.schemas.jd import JDAnalysis
from app.services.groq_service import analyze_text_to_json, get_evaluation_model

async def analyze_jd_text(text: str) -> JDAnalysis:
    """
    Sends the raw Job Description text to Groq API to extract structured fields.
    """
    system_prompt = (
        "You are a Senior Engineering Hiring Manager.\n"
        "Analyze the Job Description.\n"
        "Extract:\n"
        "- Role\n"
        "- Required Skills\n"
        "- Nice-to-Have Skills\n"
        "- Responsibilities\n"
        "- Core Focus Areas\n"
        "- Expected Experience Level\n\n"
        "Return ONLY JSON.\n"
        "No markdown.\n"
        "No explanations."
    )
    
    prompt = f"Please analyze the following Job Description text and extract the details:\n\n{text}"
    
    jd_analysis = await analyze_text_to_json(prompt, system_prompt, JDAnalysis, model_name=get_evaluation_model())
    return jd_analysis
