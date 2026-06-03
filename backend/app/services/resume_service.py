import fitz  # PyMuPDF
import pdfplumber
import os
from fastapi import UploadFile
from app.schemas.resume import CandidateProfile
from app.services.groq_service import analyze_text_to_json, get_evaluation_model

async def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text robustly from a PDF using both PyMuPDF and pdfplumber for fallback.
    """
    text = ""
    try:
        # Try PyMuPDF first (very fast)
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        print(f"PyMuPDF failed, falling back to pdfplumber: {e}")
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e2:
            raise ValueError("Failed to extract text from PDF using all parsers.")
            
    if not text.strip():
        raise ValueError("The uploaded PDF appears to be empty or contains non-extractable image text.")
        
    return text

async def analyze_resume_text(text: str) -> CandidateProfile:
    """
    Sends the raw resume text to Groq API to extract structured fields.
    """
    system_prompt = (
        "You are a Senior Technical Recruiter with 15 years of hiring experience.\n"
        "Analyze the candidate resume.\n"
        "Extract:\n"
        "- Candidate Name\n"
        "- Technical Skills\n"
        "- Soft Skills\n"
        "- Projects\n"
        "- Experience\n"
        "- Education\n"
        "- Experience Level\n\n"
        "Generate:\n"
        "- Professional Summary\n"
        "- Top Strengths\n"
        "- Missing Skills\n"
        "- Interview Focus Areas\n\n"
        "Return ONLY valid JSON.\n"
        "No markdown.\n"
        "No explanations.\n"
        "No text outside JSON."
    )
    
    prompt = f"Please analyze the following resume text and extract the candidate profile details:\n\n{text}"
    
    profile = await analyze_text_to_json(prompt, system_prompt, CandidateProfile, model_name=get_evaluation_model())
    return profile
