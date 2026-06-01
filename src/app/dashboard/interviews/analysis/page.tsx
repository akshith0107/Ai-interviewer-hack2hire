'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Target, CheckCircle2, XCircle, ArrowRight, Video } from 'lucide-react';
import Link from 'next/link';

export default function ResumeAnalysisPage() {
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
            82<span className="text-2xl text-white/50">%</span>
          </div>
          <div className="text-sm text-emerald-400 font-medium">Strong Alignment</div>
        </GlassCard>

        <GlassCard className="p-6 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Skills Verified</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {['Systems Design', 'Figma', 'Prototyping', 'User Research', 'Design Systems', 'Agile'].map(skill => (
              <span key={skill} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-white">
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2 mb-4 pt-4 border-t border-white/10">
            <XCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Potential Gaps (Interview Focus)</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['A/B Testing', 'Stakeholder Management', 'Analytics Tools'].map(skill => (
              <span key={skill} className="px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-xs font-medium text-amber-200">
                {skill}
              </span>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Readiness Estimate</h3>
        <p className="text-sm text-white/70 leading-relaxed mb-6">
          Based on the job description, the AI will heavily probe your experience with <strong className="text-white">A/B Testing</strong> and <strong className="text-white">Stakeholder Management</strong>. Ensure you have STAR-method answers prepared for scenarios where you had to push back on requirements or rely on data to make design decisions.
        </p>

        <Link href="/interview/s-123" className="block">
          <PremiumButton variant="primary" size="lg" className="w-full">
            <Video className="w-5 h-5 mr-2" />
            Enter Live Interview Room
          </PremiumButton>
        </Link>
      </GlassCard>
    </div>
  );
}
