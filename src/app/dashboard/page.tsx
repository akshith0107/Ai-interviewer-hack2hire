'use client';

import { useState, useEffect } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { BookOpen, Activity, Trophy, Zap, TrendingUp, CircleDot, Video, BrainCircuit, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 min-w-[240px]">
        <div className="text-sm font-bold text-white mb-1">{data.role}</div>
        <div className="text-xs text-white/50 mb-4">{data.full_date || data.name}</div>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-white/60">Readiness:</span>
            <span className="font-medium text-white">{data.score}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">Recommendation:</span>
            <span className="font-medium text-emerald-400">{data.recommendation}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">Difficulty:</span>
            <span className="font-medium text-white">{data.difficulty}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">Questions:</span>
            <span className="font-medium text-white">{data.questions_answered}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">Average Score:</span>
            <span className="font-medium text-white">{data.average_score}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [overview, setOverview] = useState<any>(null);
  const [performance, setPerformance] = useState<any[]>([]);
  const [intelligence, setIntelligence] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Time filter state
  const [timeFilter, setTimeFilter] = useState<'1M' | '3M' | 'ALL'>('ALL');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes, perfRes, intelRes, recentRes] = await Promise.all([
          fetch(`${API_BASE}/dashboard/overview`),
          fetch(`${API_BASE}/dashboard/performance`),
          fetch(`${API_BASE}/dashboard/intelligence`),
          fetch(`${API_BASE}/dashboard/recent`)
        ]);

        const oData = await overviewRes.json();
        setOverview(oData);

        const pData = await perfRes.json();
        setPerformance(pData.history || []);

        const iData = await intelRes.json();
        setIntelligence(iData);

        const rData = await recentRes.json();
        setRecent(rData.operations || []);

      } catch (e) {
        console.error("Dashboard fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white/50 animate-spin" />
      </div>
    );
  }

  // Handle filtering performance data locally
  const filteredPerformance = performance.filter(item => {
    if (timeFilter === 'ALL') return true;
    
    if (timeFilter === '1M') {
      return performance.indexOf(item) >= performance.length - 5; 
    }
    if (timeFilter === '3M') {
      return performance.indexOf(item) >= performance.length - 15; 
    }
    return true;
  });

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
          <span className="text-white/80">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </header>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Interviews Taken"
          value={overview?.interviews_taken || 0}
          icon={<BookOpen className="w-4 h-4" />}
          subtitle={overview?.interviews_taken > 0 ? <span className="text-emerald-400 font-medium">Active</span> : "No data"}
        />
        <StatCard
          title="Average Score"
          value={overview?.interviews_taken > 0 ? overview?.average_score : "--"}
          valueSuffix={overview?.interviews_taken > 0 ? "/100" : ""}
          icon={<Activity className="w-4 h-4" />}
          subtitle={
            overview?.interviews_taken > 0 ? (
              <div className="flex items-center text-white/80">
                <TrendingUp className="w-3 h-3 mr-1 text-emerald-400" />
                <span className="truncate max-w-[120px]">{overview?.most_practiced_skill}</span>
              </div>
            ) : "No data"
          }
        />
        <StatCard
          title="Best Score"
          value={overview?.interviews_taken > 0 ? overview?.best_score : "--"}
          valueSuffix={overview?.interviews_taken > 0 ? "/100" : ""}
          icon={<Trophy className="w-4 h-4" />}
          subtitle={overview?.interviews_taken > 0 ? `Avg ${overview?.avg_duration_minutes}m per session` : "No data"}
        />
        <StatCard
          title="Readiness Index"
          value={overview?.interviews_taken > 0 ? overview?.readiness_index : "--"}
          icon={<Zap className="w-4 h-4" />}
          subtitle={
            overview?.interviews_taken > 0 ? (
              <div className="mt-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>Current</span>
                  <span>{overview?.readiness_index}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-1000" 
                    style={{ width: `${overview?.readiness_index}%` }}
                  />
                </div>
              </div>
            ) : "No data"
          }
        />
      </div>

      {overview?.interviews_taken === 0 ? (
        <GlassCard className="p-12 text-center border-dashed border-2 border-white/10">
          <BrainCircuit className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Awaiting Data</h2>
          <p className="text-white/50 max-w-md mx-auto mb-6">
            Complete your first interview to unlock personalized insights, performance tracking, and actionable AI career advice.
          </p>
          <Link href="/dashboard/interviews/new">
            <PremiumButton>Start Interview</PremiumButton>
          </Link>
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Inline Performance Chart */}
            <div className="lg:col-span-2">
              <GlassCard className="p-6 h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Performance Trajectory</h3>
                  <div className="flex space-x-2 text-xs font-medium text-white/50">
                    <button 
                      onClick={() => setTimeFilter('1M')}
                      className={`px-3 py-1 rounded-full transition-colors ${timeFilter === '1M' ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/10 text-white/70'}`}
                    >1M</button>
                    <button 
                      onClick={() => setTimeFilter('3M')}
                      className={`px-3 py-1 rounded-full transition-colors ${timeFilter === '3M' ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/10 text-white/70'}`}
                    >3M</button>
                    <button 
                      onClick={() => setTimeFilter('ALL')}
                      className={`px-3 py-1 rounded-full transition-colors ${timeFilter === 'ALL' ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/10 text-white/70'}`}
                    >ALL</button>
                  </div>
                </div>
                <div className="flex-1 w-full min-h-0 flex items-center justify-center relative">
                  {filteredPerformance.length === 0 ? (
                    <div className="text-white/50 text-sm">Not enough data to plot.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={filteredPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area type="monotone" dataKey="score" stroke="#ffffff" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, fill: '#fff', stroke: '#000', strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Intelligence Widget */}
            <GlassCard className="p-6 flex flex-col h-[400px]">
              <div className="flex items-center space-x-2 mb-6 text-white shrink-0">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold">AI Intelligence</h3>
              </div>
              
              <div className="space-y-5 overflow-y-auto pr-2 mb-4 flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div>
                  <div className="flex items-center space-x-2 text-sm font-medium text-white mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Strength Detected</span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {intelligence?.strength_detected}
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-sm font-medium text-white mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Focus Area</span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {intelligence?.focus_area}
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-sm font-medium text-white mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>Career Tip</span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {intelligence?.career_tip}
                  </p>
                </div>
              </div>
              
              <Link href="/dashboard/intelligence" className="block mt-auto shrink-0">
                <PremiumButton variant="secondary" className="w-full">
                  View Full Intelligence
                </PremiumButton>
              </Link>
            </GlassCard>
          </div>

          {/* Recent Operations */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Operations</h3>
              <Link href="/dashboard/interviews" className="text-sm text-white/60 hover:text-white transition-colors">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {recent.length === 0 ? (
                <div className="py-8 text-center text-white/50 text-sm">
                  No interviews completed yet.
                </div>
              ) : (
                recent.map((op, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/5 hover:border-white/10">
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                        <Video className="w-5 h-5 text-white/70" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{op.role}</div>
                        <div className="text-xs text-white/50">{op.type} • {op.duration}</div>
                      </div>
                    </div>
                    <div className="sm:text-right flex justify-between sm:block">
                      <div className="text-sm font-bold text-white">{op.score > 0 ? `${op.score} Score` : 'Pending'}</div>
                      <div className="text-xs text-emerald-400">{op.recommendation}</div>
                      <div className="text-xs text-white/40">{op.timeAgo}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}
