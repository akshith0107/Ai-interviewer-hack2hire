from sqlalchemy import Column, String, Text, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    password_hash = Column(String, nullable=False, server_default="placeholder")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    resumes = relationship("Resume", back_populates="user")
    jds = relationship("JobDescription", back_populates="user")
    interviews = relationship("Interview", back_populates="user")

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    file_name = Column(String, nullable=True)
    resume_text = Column(Text, nullable=True)
    skills_json = Column(JSON, nullable=True)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="resumes")
    interviews = relationship("Interview", back_populates="resume")

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    role = Column(String, nullable=False)
    required_skills = Column(JSON, nullable=True)
    nice_to_have_skills = Column(JSON, nullable=True)
    core_focus = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="jds")
    interviews = relationship("Interview", back_populates="jd")

class Interview(Base):
    __tablename__ = "interviews"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    resume_id = Column(String, ForeignKey("resumes.id"), nullable=True)
    jd_id = Column(String, ForeignKey("job_descriptions.id"), nullable=True)
    status = Column(String, default="ACTIVE") # ACTIVE, COMPLETED, TERMINATED
    difficulty = Column(String, nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="interviews")
    resume = relationship("Resume", back_populates="interviews")
    jd = relationship("JobDescription", back_populates="interviews")
    questions = relationship("Question", back_populates="interview")
    report = relationship("Report", back_populates="interview", uselist=False)

class Question(Base):
    __tablename__ = "questions"
    id = Column(String, primary_key=True, index=True)
    interview_id = Column(String, ForeignKey("interviews.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    difficulty = Column(String, nullable=True)
    skill_area = Column(String, nullable=True)
    question_number = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    interview = relationship("Interview", back_populates="questions")
    answer = relationship("Answer", back_populates="question", uselist=False)

class Answer(Base):
    __tablename__ = "answers"
    id = Column(String, primary_key=True, index=True)
    question_id = Column(String, ForeignKey("questions.id"), nullable=False)
    candidate_answer = Column(Text, nullable=False)
    time_taken_seconds = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    question = relationship("Question", back_populates="answer")
    evaluation = relationship("Evaluation", back_populates="answer", uselist=False)

class Evaluation(Base):
    __tablename__ = "evaluations"
    id = Column(String, primary_key=True, index=True)
    answer_id = Column(String, ForeignKey("answers.id"), nullable=False)
    accuracy = Column(Integer, nullable=True)
    clarity = Column(Integer, nullable=True)
    depth = Column(Integer, nullable=True)
    relevance = Column(Integer, nullable=True)
    communication = Column(Integer, nullable=True)
    time_efficiency = Column(Integer, nullable=True)
    overall_score = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    answer = relationship("Answer", back_populates="evaluation")

class Report(Base):
    __tablename__ = "reports"
    id = Column(String, primary_key=True, index=True)
    interview_id = Column(String, ForeignKey("interviews.id"), nullable=False)
    readiness_score = Column(Integer, nullable=True)
    recommendation = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    strengths = Column(JSON, nullable=True)
    weaknesses = Column(JSON, nullable=True)
    roadmap = Column(Text, nullable=True)
    pdf_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    interview = relationship("Interview", back_populates="report")
