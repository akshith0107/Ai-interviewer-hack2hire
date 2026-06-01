# Ai-interviewer-hack2hire

# InterviewIQ - AI Powered Mock Interview Platform

## Overview

InterviewIQ is an AI-powered mock interview platform designed to simulate real-world technical interviews and objectively measure a candidate's interview readiness.

The platform analyzes a candidate's resume and job description, generates role-specific interview questions, dynamically adapts interview difficulty based on performance, evaluates responses using AI, and provides a comprehensive hiring readiness report.

---

## Problem Statement

Many candidates struggle during interviews not because of a lack of technical knowledge, but because they lack realistic interview practice, structured feedback, and performance tracking.

InterviewIQ addresses this challenge by creating an adaptive AI interviewer capable of:

* Resume Analysis
* Job Description Analysis
* Dynamic Question Generation
* Adaptive Difficulty Adjustment
* AI-Based Answer Evaluation
* Interview Readiness Scoring
* Hiring Recommendation Generation

---

## Features

### Resume Intelligence

* PDF Resume Upload
* Skill Extraction
* Project Analysis
* Experience Detection

### Job Description Intelligence

* Role Detection
* Required Skill Extraction
* Resume-to-JD Matching

### AI Interview Engine

* Technical Questions
* Behavioral Questions
* Scenario-Based Questions
* Follow-Up Questions

### Adaptive Interview System

* Easy → Medium → Hard Progression
* Performance-Based Difficulty Adjustment
* Intelligent Follow-Up Questions

### AI Evaluation Engine

Responses are evaluated on:

* Accuracy
* Clarity
* Depth
* Relevance
* Communication Quality

### Readiness Report

* Interview Readiness Score
* Strengths
* Weaknesses
* Hiring Recommendation
* Personalized Improvement Plan

---

## Architecture

```text
Frontend (Next.js)
        │
        ▼
FastAPI Backend
        │
 ┌──────┼────────┬────────┬────────┐
 ▼      ▼        ▼        ▼        ▼
Resume  JD    Interview  Evaluation Analytics
Service Service Engine    Engine     Engine
        │
        ▼
      Groq AI
        │
        ▼
    PostgreSQL
```

---

## Tech Stack

### Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* Framer Motion
* Shadcn UI
* Recharts

### Backend

* FastAPI
* Python

### AI Models

* Groq Llama 4 Maverick
* DeepSeek R1 Distill Llama 70B

### Database

* PostgreSQL / Supabase

---

## Project Structure

```text
frontend/
backend/

backend/
├── app
│   ├── routers
│   ├── services
│   ├── schemas
│   ├── models
│   └── main.py
```

---

## API Modules

### Resume Service

* Resume Upload
* Resume Analysis

### JD Service

* Job Description Analysis

### Interview Engine

* Interview Creation
* Question Generation
* Follow-Up Generation

### Evaluation Engine

* Answer Evaluation
* Communication Analysis

### Reporting Engine

* Readiness Score
* Hiring Recommendation
* Recruiter Report

---

## How It Works

```text
Upload Resume
        ↓
Paste Job Description
        ↓
Resume & JD Analysis
        ↓
AI Interview Starts
        ↓
Adaptive Questioning
        ↓
Response Evaluation
        ↓
Readiness Score
        ↓
Recruiter Report
```

---

## Future Enhancements

* Voice-Based Interviews
* Real-Time Speech Analysis
* Webcam-Based Confidence Tracking
* Interview History Analytics
* Multi-Round Interviews
* Industry-Specific Interview Tracks

---

## Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Demo Video

Add your screen recording link here.

```text
Demo Link: <Add Video Link>
```

---

## Team

Hack2Hire Submission

InterviewIQ — Practice Interviews. Get Hired Faster.
