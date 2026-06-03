'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { Target, CheckCircle2, XCircle, ArrowRight, Video, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { fetchWithAuth } from '@/lib/api';

export default function ResumeAnalysisPage() {
  const analysis = useAnalysisStore(state => state.analysisResult);
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartInterview = async () => {
    setIsStarting(true);
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          starting_difficulty: analysis?.recommended_difficulty || 'Medium'
        })
      });
      if (!res.ok) throw new Error("Failed to start session");
      const data = await res.json();
      router.push(`/interview/${data.session_id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to start interview. Check backend.");
      setIsStarting(false);
    }
  };

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto h-[600px] flex flex-col items-center justify-center animate-in fade-in duration-700">
        <GlassCard className="p-12 text-center max-w-md">
          <FileText className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Analysis Available</h2>
          <p className="text-white/60 text-sm mb-6">
            Upload your resume and job description to generate AI insights and determine your interview readiness.
          </p>
          <Link href="/dashboard/interviews/new">
            <PremiumButton variant="primary" className="w-full">
              Generate Analysis
            </PremiumButton>
          </Link>
        </GlassCard>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Pre-Interview Analysis</h1>
        <p className="text-white/60 text-sm">AI analysis of your resume against the target role.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 md:col-span-1 flex flex-col items-center justify-center text-center">
          <Target className="w-8 h-8 text-white/50 mb-4" />
          <div className="text-xs font-semibold tracking-wider text-white/50 uppercase mb-2">Resume Match</div>
          <div className="flex items-baseline justify-center text-5xl font-bold text-white mb-4">
            {analysis.match_percentage}<span className="text-2xl text-white/50">%</span>
          </div>
          <div className="text-sm text-emerald-400 font-medium">
            {analysis.match_percentage >= 80 ? 'Strong Alignment' : analysis.match_percentage >= 50 ? 'Moderate Alignment' : 'Low Alignment'}
          </div>
        </GlassCard>

        <GlassCard className="p-6 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Skills Verified</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {analysis.strengths.length > 0 ? (
              analysis.strengths.map(skill => (
                <span key={skill} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-white">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-white/50">No notable strengths identified.</span>
            )}
          </div>

          <div className="flex items-center space-x-2 mb-4 pt-4 border-t border-white/10">
            <XCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Potential Gaps (Interview Focus)</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_skills.length > 0 ? (
              analysis.missing_skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-xs font-medium text-amber-200">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-white/50">No missing skills identified.</span>
            )}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Readiness Estimate</h3>
        <p className="text-sm text-white/70 leading-relaxed mb-4">
          {analysis.readiness_estimate}
        </p>
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg mb-6">
          <h4 className="text-sm font-semibold text-white mb-2">AI Gap Analysis & Focus Areas</h4>
          <p className="text-sm text-white/60 mb-3">{analysis.skill_gap_analysis}</p>
          <ul className="list-disc pl-5 text-sm text-white/60 space-y-1">
            {analysis.suggested_focus_areas.map((focus, idx) => (
              <li key={idx}>{focus}</li>
            ))}
          </ul>
        </div>

        <PremiumButton 
          variant="primary" 
          size="lg" 
          className="w-full mt-4" 
          onClick={handleStartInterview} 
          disabled={isStarting}
        >
          <Video className="w-5 h-5 mr-2" />
          {isStarting ? 'Starting Session...' : 'Enter Live Interview Room'}
        </PremiumButton>
      </GlassCard>
    </div>
  );
}
