import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.resume import CandidateProfile
from app.services.resume_service import extract_text_from_pdf, analyze_resume_text
from pydantic import BaseModel

router = APIRouter(prefix="/resume", tags=["Resume Intelligence"])

# Temporary upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class AnalyzeRequest(BaseModel):
    text: str

@router.post("/upload", response_model=dict)
async def upload_resume(file: UploadFile = File(...)):
    """
    Uploads a PDF resume, parses it, and returns the raw extracted text.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        text = await extract_text_from_pdf(file_path)
        return {"filename": file.filename, "extracted_text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
    finally:
        # Clean up temporary file
        if os.path.exists(file_path):
            os.remove(file_path)

@router.post("/analyze", response_model=CandidateProfile)
async def analyze_resume(request: AnalyzeRequest):
    """
    Analyzes raw resume text and extracts structured candidate profile using Groq.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
        
    try:
        profile = await analyze_resume_text(request.text)
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze resume: {str(e)}")
