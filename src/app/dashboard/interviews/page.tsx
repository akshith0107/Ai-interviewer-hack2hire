'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Video, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';

export default function InterviewsPage() {
  const operations = useAnalyticsStore(state => state.recentOperations);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Interviews</h1>
          <p className="text-white/60 text-sm">Manage your past interview sessions and start new ones.</p>
        </div>
        <Link href="/dashboard/interviews/new">
          <PremiumButton variant="primary" size="md">
            <Plus className="w-4 h-4 mr-2" />
            New Interview
          </PremiumButton>
        </Link>
      </header>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Interview History</h3>
        
        {operations.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
              <Video className="w-8 h-8 text-white/30" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">No interviews yet</h4>
            <p className="text-white/50 text-sm mb-6">You haven't taken any mock interviews. Start one to see your results here.</p>
            <Link href="/dashboard/interviews/new">
              <PremiumButton variant="secondary">Start Practice</PremiumButton>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {operations.map((op, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                    <Video className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{op.role}</div>
                    <div className="text-xs text-white/50">{op.type} • {op.duration}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{op.score} Score</div>
                  <div className="text-xs text-white/50">{op.timeAgo}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
