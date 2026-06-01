'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { BrainCircuit, Lightbulb, Target } from 'lucide-react';
import Link from 'next/link';
import { PremiumButton } from '@/components/ui/PremiumButton';

export default function IntelligencePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Intelligence Center</h1>
        <p className="text-white/60 text-sm">Comprehensive AI-driven insights across all your interview sessions.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BrainCircuit className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">Aggregated Strengths</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-white/70">Consistently demonstrates high executive presence in behavioral rounds.</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-white/70">Strong technical vocabulary used correctly in context.</span>
            </li>
          </ul>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Target className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">Focus Areas</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-white/70">Tendency to interrupt the interviewer (AI) during follow-up questions.</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-white/70">Needs more structured approaches (STAR method) when answering conflict resolution queries.</span>
            </li>
          </ul>
        </GlassCard>
      </div>

      <GlassCard className="p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Lightbulb className="w-8 h-8 text-white/40" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Want deeper insights?</h3>
        <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
          Take a new mock interview tailored to your weaknesses to track improvement over time.
        </p>
        <Link href="/dashboard/interviews/new">
          <PremiumButton variant="primary">Start Targeted Practice</PremiumButton>
        </Link>
      </GlassCard>
    </div>
  );
}
