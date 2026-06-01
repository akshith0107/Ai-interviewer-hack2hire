'use client';

import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Lightbulb, History, TrendingUp, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  const analytics = useAnalyticsStore();

  const skillData = [
    { name: 'System Design', score: 88 },
    { name: 'Algorithms', score: 75 },
    { name: 'Behavioral', score: 92 },
    { name: 'Leadership', score: 85 },
    { name: 'Communication', score: 95 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Analytics</h1>
        <p className="text-white/60 text-sm">Deep dive into your performance metrics and skill growth.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center space-x-2 mb-6 text-white">
            <TrendingUp className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Readiness Trends</h3>
          </div>
          <PerformanceChart />
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-2 mb-6 text-white">
            <BarChart className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Skill Growth</h3>
          </div>
          <div className="h-[400px] w-full flex items-center justify-center relative">
            {analytics.interviewsTaken === 0 ? (
              <div className="text-white/50 text-sm">No analytics data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="score" fill="#ffffff" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center space-x-2 mb-6 text-white">
            <History className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Interview History</h3>
          </div>
          <div className="space-y-2">
            {analytics.recentOperations.length === 0 ? (
              <div className="py-8 text-center text-white/50 text-sm">
                No interviews found.
              </div>
            ) : (
              analytics.recentOperations.map((op, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white/70" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{op.role}</div>
                      <div className="text-xs text-white/50">{op.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{op.score}/100</div>
                    <div className="text-xs text-white/50">{op.timeAgo}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-2 mb-6 text-white">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold">AI Recommendations</h3>
          </div>
          <ul className="space-y-4">
            <li className="text-sm text-white/70 bg-white/5 p-4 rounded-lg border border-white/10">
              Your algorithmic problem-solving speed is in the top 20%, but code modularity scores lower. Focus on extracting helper functions during technical rounds.
            </li>
            <li className="text-sm text-white/70 bg-white/5 p-4 rounded-lg border border-white/10">
              When answering behavioral questions, you tend to rush the &quot;Result&quot; part of the STAR method. Take more time to quantify your impact.
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
