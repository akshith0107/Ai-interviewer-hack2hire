print("====================================")
print("INTERVIEWIQ MAIN.PY LOADED")
print("====================================")

import os
from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.routers import resume, jd, interview, report, analysis, analytics, intelligence, dashboard, auth
import uvicorn

from app.database.db import verify_db_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    fast_model = os.getenv("GROQ_FAST_MODEL", "openai/gpt-oss-20b")
    eval_model = os.getenv("GROQ_EVALUATION_MODEL", "openai/gpt-oss-120b")
    print("\n========================================")
    print("InterviewIQ Backend Starting Up...")
    print(f"FAST MODEL: {fast_model}")
    print(f"EVALUATION MODEL: {eval_model}")
    commit_hash = os.environ.get("RENDER_GIT_COMMIT", "Unknown Commit")
    print(f"DEPLOYED COMMIT HASH: {commit_hash}")
    print("ACTIVE AI SERVICES: Resume, JD, Question Gen, Evaluation, Report, Analytics, Intelligence, Dashboard")
    print("JWT AUTHENTICATION: Initialized")
    print("AUTH ROUTES: Registered")
    
    # Verify DB Connection
    try:
        verify_db_connection()
        print("DATABASE: Connected")
    except Exception as e:
        print(f"DATABASE CONNECTION FAILED: {e}")
    
    print("========================================\n")
    yield

app = FastAPI(
    title="InterviewIQ Backend API",
    description="Backend services for Phase 1 InterviewIQ Intelligence Layers.",
    version="1.0.0",
    lifespan=lifespan
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
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(jd.router)
app.include_router(interview.router)
app.include_router(report.router)
app.include_router(analysis.router)
app.include_router(analytics.router)
app.include_router(intelligence.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {
        "message": "INTERVIEWIQ_BACKEND_RUNNING"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "InterviewIQ Backend"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
