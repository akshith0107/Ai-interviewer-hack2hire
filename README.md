

https://github.com/user-attachments/assets/480a6091-1730-4436-b5cd-85f564c8eb0e

<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
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

https://github.com/user-attachments/assets/8c915ccc-f8e7-45c8-8c6c-a8ad84fd0b23


Demo Link: <Add Video Link>
```

---

## Team

Hack2Hire Submission

InterviewIQ — Practice Interviews. Get Hired Faster.
>>>>>>> 6ddff03115432d7ecd4a55f0a4b87ddb9e75911b
