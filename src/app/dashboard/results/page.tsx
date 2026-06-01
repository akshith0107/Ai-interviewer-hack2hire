'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Trophy } from 'lucide-react';
import Link from 'next/link';

export default function ResultsIndexPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Results</h1>
        <p className="text-white/60 text-sm">View comprehensive recruiter reports for completed interviews.</p>
      </header>

      <GlassCard className="p-12 flex flex-col items-center justify-center text-center border-white/5">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
          <Trophy className="w-8 h-8 text-white/30" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-3">No Results Found</h2>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          Complete an interview to view your results. The AI will generate a detailed recruiter report based on your performance.
        </p>
        <Link href="/dashboard/interviews/new">
          <PremiumButton variant="primary">Start an Interview</PremiumButton>
        </Link>
      </GlassCard>
    </div>
  );
}
