from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.models import Interview, Report, Evaluation, Question, Resume, JobDescription, Answer
from app.schemas.intelligence import IntelligenceResponse, IntelligenceLLMData, SkillGap, HiringProbability
from app.services.groq_service import analyze_text_to_json, get_evaluation_model
import json

async def generate_intelligence_report(user_id: str, db: Session) -> IntelligenceResponse:
    # Get all interviews
    interviews = db.query(Interview).filter(Interview.status == "COMPLETED").order_by(Interview.started_at.desc()).all()
    if not interviews:
        raise ValueError("No completed interviews found.")
        
    latest_interview = interviews[0]
    
    # 1. Strengths & Weaknesses (from Questions/Evaluations)
    skill_scores = (
        db.query(
            Question.skill_area,
            func.avg(Evaluation.overall_score).label("avg_score")
        )
        .join(Answer, Answer.question_id == Question.id)
        .join(Evaluation, Evaluation.answer_id == Answer.id)
        .group_by(Question.skill_area)
        .all()
    )
    
    valid_scores = [s for s in skill_scores if s.skill_area and s.avg_score is not None]
    valid_scores.sort(key=lambda x: x.avg_score, reverse=True)
    
    top_strengths = [s.skill_area for s in valid_scores[:5]] if valid_scores else ["N/A"]
    top_weaknesses = [s.skill_area for s in valid_scores[-5:]] if valid_scores else ["N/A"]
    top_weaknesses.reverse() # lowest first

    # 2. Skill Gap Analysis
    matched = []
    missing = []
    match_pct = 0
    resume_skills = []
    jd_skills = []
    
    if latest_interview.resume and latest_interview.jd:
        resume_data = latest_interview.resume.skills_json or {}
        resume_skills = resume_data.get("technical_skills", []) if isinstance(resume_data, dict) else []
        if isinstance(latest_interview.resume.skills_json, list):
            resume_skills = latest_interview.resume.skills_json
            
        jd_data = latest_interview.jd.required_skills or []
        jd_skills = jd_data if isinstance(jd_data, list) else []
        
        # Simple match
        resume_skills_lower = [s.lower() for s in resume_skills]
        for js in jd_skills:
            if js.lower() in resume_skills_lower:
                matched.append(js)
            else:
                missing.append(js)
                
        total = len(jd_skills)
        match_pct = int((len(matched) / total) * 100) if total > 0 else 0
        
    skill_gap = SkillGap(
        matched_skills=matched,
        missing_skills=missing,
        match_percentage=match_pct
    )
    
    # 3. Hiring Probability
    # Avg readiness + technical (accuracy) + communication
    avg_readiness = float(db.query(func.avg(Report.readiness_score)).scalar() or 0)
    avg_tech = float(db.query(func.avg(Evaluation.accuracy)).scalar() or 0)
    avg_comm = float(db.query(func.avg(Evaluation.communication)).scalar() or 0)
    
    current_prob = int((avg_readiness * 0.5) + (avg_tech * 0.3) + (avg_comm * 0.2))
    projected_prob = min(100, current_prob + 16) # Assuming completion of roadmap
    
    prob = HiringProbability(
        current_probability=current_prob,
        projected_probability=projected_prob
    )
    
    # 4. LLM Synthesis
    reports = db.query(Report).order_by(Report.created_at.desc()).limit(3).all()
    report_texts = [f"Summary: {r.summary}\nWeaknesses: {r.weaknesses}" for r in reports]
    
    prompt = f"""
    Candidate Data:
    Resume Skills: {resume_skills}
    Target Role: {latest_interview.jd.role if latest_interview.jd else 'Unknown'}
    Top Measured Strengths: {top_strengths}
    Top Measured Weaknesses: {top_weaknesses}
    Recent Reports:
    {chr(10).join(report_texts)}
    """
    
    system_prompt = (
        "You are an elite AI Executive Recruiter.\n"
        "Analyze the candidate data to generate an Intelligence Report.\n"
        "Return ONLY JSON matching this structure exactly:\n"
        "{\n"
        "  \"hiring_recommendation\": \"(string)\",\n"
        "  \"readiness_category\": \"(Highly Recommended | Interview Ready | Needs Improvement | Not Ready)\",\n"
        "  \"executive_summary\": \"(string)\",\n"
        "  \"improvement_plan\": [ { \"week\": \"Week 1\", \"topics\": [], \"projects\": [], \"practice_areas\": [], \"mock_interview_targets\": [] } ],\n"
        "  \"personality_profile\": { \"communication_style\": \"\", \"confidence_level\": \"\", \"problem_solving_style\": \"\", \"collaboration_style\": \"\" },\n"
        "  \"recommended_roles\": [ { \"role\": \"\", \"match\": 0 } ],\n"
        "  \"career_insights\": { \"biggest_strength\": \"\", \"biggest_weakness\": \"\", \"fastest_improvement_opportunity\": \"\", \"recommended_next_skill\": \"\" }\n"
        "}\n"
        "Generate a full 4-week roadmap."
    )
    
    try:
        llm_data = await analyze_text_to_json(prompt, system_prompt, IntelligenceLLMData, model_name=get_evaluation_model())
    except Exception as e:
        print(f"Intelligence LLM generation failed: {e}")
        raise ValueError("Failed to synthesize intelligence data.")
        
    return IntelligenceResponse(
        readiness_score=int(avg_readiness),
        readiness_category=llm_data.readiness_category,
        hiring_probability=prob,
        top_strengths=top_strengths,
        top_weaknesses=top_weaknesses,
        skill_gap=skill_gap,
        recommended_roles=llm_data.recommended_roles,
        improvement_plan=llm_data.improvement_plan,
        personality_profile=llm_data.personality_profile,
        career_insights=llm_data.career_insights,
        executive_summary=llm_data.executive_summary,
        hiring_recommendation=llm_data.hiring_recommendation
    )
