'use client';

import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { BookOpen, Activity, Trophy, Zap, TrendingUp, CircleDot, Video, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const analytics = useAnalyticsStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Mission Control</h1>
          <p className="text-white/60 text-sm">System readiness optimal. Analyzing recent performance data.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-medium text-white/50 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <CircleDot className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Live Sync</span>
          <span className="text-white/30 px-1">•</span>
          <span className="text-white/80">Oct 24, 2024</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Interviews Taken"
          value={analytics.interviewsTaken}
          icon={<BookOpen className="w-4 h-4" />}
          subtitle={analytics.interviewsTaken > 0 ? <span className="text-emerald-400 font-medium">+3 this week</span> : "No data"}
        />
        <StatCard
          title="Average Score"
          value={analytics.interviewsTaken > 0 ? analytics.averageScore : "--"}
          valueSuffix={analytics.interviewsTaken > 0 ? "/100" : ""}
          icon={<Activity className="w-4 h-4" />}
          subtitle={
            analytics.interviewsTaken > 0 ? (
              <div className="flex items-center text-white/80">
                <TrendingUp className="w-3 h-3 mr-1 text-emerald-400" />
                <span>Top 15%</span>
              </div>
            ) : "No data"
          }
        />
        <StatCard
          title="Best Score"
          value={analytics.interviewsTaken > 0 ? analytics.bestScore : "--"}
          valueSuffix={analytics.interviewsTaken > 0 ? "/100" : ""}
          icon={<Trophy className="w-4 h-4" />}
          subtitle={analytics.interviewsTaken > 0 ? "System Design Int." : "No data"}
        />
        <StatCard
          title="Readiness Index"
          value={analytics.interviewsTaken > 0 ? analytics.readinessIndex : "--"}
          icon={<Zap className="w-4 h-4" />}
          subtitle={
            analytics.interviewsTaken > 0 ? (
              <div className="mt-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>Current</span>
                  <span>{analytics.readinessPercentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-1000" 
                    style={{ width: `${analytics.readinessPercentage}%` }}
                  />
                </div>
              </div>
            ) : "No data"
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <GlassCard className="p-6 flex flex-col justify-between h-[400px]">
          <div>
            <div className="flex items-center space-x-2 mb-6 text-white">
              <BrainCircuit className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Intelligence</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 text-sm font-medium text-white mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Strength Detected</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  Your responses regarding asynchronous architecture showed top-tier clarity and depth in the last 3 sessions.
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm font-medium text-white mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Focus Area</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  Pacing during behavioral questions is slightly rushed. Recommend inserting 1s pauses before answering.
                </p>
              </div>
            </div>
          </div>
          
          <Link href="/dashboard/intelligence" className="block mt-4">
            <PremiumButton variant="secondary" className="w-full">
              View Full Analysis
            </PremiumButton>
          </Link>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Operations</h3>
          <button className="text-sm text-white/60 hover:text-white transition-colors">View All</button>
        </div>
        <div className="space-y-1">
          {analytics.recentOperations.length === 0 ? (
            <div className="py-8 text-center text-white/50 text-sm">
              No interviews completed yet.
            </div>
          ) : (
            analytics.recentOperations.map((op, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/5">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
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
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}

