from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import resume, jd, interview, report
import uvicorn

app = FastAPI(
    title="InterviewIQ Backend API",
    description="Backend services for Phase 1 InterviewIQ Intelligence Layers.",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(resume.router)
app.include_router(jd.router)
app.include_router(interview.router)
app.include_router(report.router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "InterviewIQ Backend"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
