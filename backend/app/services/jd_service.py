from app.schemas.jd import JDAnalysis
from app.services.groq_service import analyze_text_to_json

async def analyze_jd_text(text: str) -> JDAnalysis:
    """
    Sends the raw Job Description text to Groq API to extract structured fields.
    """
    system_prompt = (
        "You are an expert technical recruiter AI. Your task is to analyze a raw job description "
        "and break it down into structured key components: role, required skills, responsibilities, etc. "
        "Ensure the output strictly follows the provided JSON schema."
    )
    
    prompt = f"Please analyze the following Job Description text and extract the details:\n\n{text}"
    
    jd_analysis = await analyze_text_to_json(prompt, system_prompt, JDAnalysis)
    return jd_analysis
