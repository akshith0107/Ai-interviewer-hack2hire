'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Lightbulb, History, TrendingUp, Calendar, Target, Brain, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { fetchWithAuth } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface Overview {
  readiness_score: number;
  total_interviews: number;
  average_score: number;
  strongest_skill: string;
  weakest_skill: string;
}

interface Trend {
  date: string;
  score: number;
  role: string;
}

interface Skills {
  technical: number;
  communication: number;
  behavioral: number;
  problem_solving: number;
  system_design: number;
  confidence: number;
}

interface Difficulty {
  easy: number;
  medium: number;
  hard: number;
}

interface Insights {
  top_strength: string;
  biggest_gap: string;
  improvement_focus: string;
  projected_readiness: string;
}

interface HistoryItem {
  id: string;
  date: string;
  role: string;
  score: number;
  recommendation: string;
  status: string;
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [difficulty, setDifficulty] = useState<any[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, trendsRes, skillsRes, diffRes, insightsRes, historyRes] = await Promise.all([
          fetchWithAuth(`${API_BASE}/analytics/overview`),
          fetchWithAuth(`${API_BASE}/analytics/trends`),
          fetchWithAuth(`${API_BASE}/analytics/skills`),
          fetchWithAuth(`${API_BASE}/analytics/difficulty`),
          fetchWithAuth(`${API_BASE}/analytics/insights`),
          fetchWithAuth(`${API_BASE}/analytics/history`)
        ]);

        const oData = await overviewRes.json();
        setOverview(oData);

        const tData = await trendsRes.json();
        setTrends(tData.history);

        const sData = await skillsRes.json();
        setSkills([
          { subject: 'Technical', A: sData.technical, fullMark: 100 },
          { subject: 'Comm.', A: sData.communication, fullMark: 100 },
          { subject: 'Behavioral', A: sData.behavioral, fullMark: 100 },
          { subject: 'Prob. Solving', A: sData.problem_solving, fullMark: 100 },
          { subject: 'System Design', A: sData.system_design, fullMark: 100 },
          { subject: 'Confidence', A: sData.confidence, fullMark: 100 },
        ]);

        const dData = await diffRes.json();
        setDifficulty([
          { name: 'Easy', score: dData.easy },
          { name: 'Medium', score: dData.medium },
          { name: 'Hard', score: dData.hard },
        ]);

        const iData = await insightsRes.json();
        setInsights(iData);

        const hData = await historyRes.json();
        setHistory(hData.history);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white/50 animate-spin" />
      </div>
    );
  }

  if (overview?.total_interviews === 0) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Analytics</h1>
          <p className="text-white/60 text-sm">Deep dive into your performance metrics and skill growth.</p>
        </header>
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-white/10">
          <Brain className="w-16 h-16 text-white/20 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Data Available</h2>
          <p className="text-white/50 max-w-md">
            Complete your first interview to unlock advanced analytics, performance tracking, and AI-driven career insights.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Analytics Engine</h1>
        <p className="text-white/60 text-sm">Data-driven performance intelligence based on your recent interviews.</p>
      </header>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <div className="text-white/60 text-sm mb-1">Readiness Score</div>
          <div className="text-3xl font-bold text-white flex items-center">
            {overview?.readiness_score}%
            <ArrowUpRight className="w-5 h-5 text-emerald-400 ml-2" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-5">
          <div className="text-white/60 text-sm mb-1">Average Score</div>
          <div className="text-3xl font-bold text-white">{overview?.average_score} <span className="text-base font-normal text-white/40">/100</span></div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="text-white/60 text-sm mb-1">Strongest Skill</div>
          <div className="text-xl font-bold text-emerald-400 capitalize truncate">{overview?.strongest_skill}</div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="text-white/60 text-sm mb-1">Total Interviews</div>
          <div className="text-3xl font-bold text-white">{overview?.total_interviews}</div>
        </GlassCard>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Performance Trends */}
        <GlassCard className="p-6 xl:col-span-2">
          <div className="flex items-center space-x-2 mb-6 text-white">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold">Readiness Trends</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Skill Radar */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-2 mb-2 text-white">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold">Skill Distribution</h3>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skills}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Candidate" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Difficulty Breakdown */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-2 mb-6 text-white">
            <BarChart className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold">Difficulty Performance</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficulty} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                <Bar dataKey="score" fill="#34d399" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* AI Insights */}
        <GlassCard className="p-6 xl:col-span-2 flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-4 text-white">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold">AI Career Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Top Strength</div>
              <div className="text-white font-medium">{insights?.top_strength}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Biggest Gap</div>
              <div className="text-white font-medium">{insights?.biggest_gap}</div>
            </div>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex-1 flex flex-col justify-center">
            <div className="text-white/50 text-xs uppercase tracking-wider mb-2">Improvement Focus</div>
            <div className="text-white/90 text-sm leading-relaxed">{insights?.improvement_focus}</div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-white/50">Projected Readiness:</span>
            <span className="text-emerald-400 font-medium bg-emerald-400/10 px-3 py-1 rounded-full">{insights?.projected_readiness}</span>
          </div>
        </GlassCard>
      </div>

      {/* History Table */}
      <GlassCard className="p-6">
        <div className="flex items-center space-x-2 mb-6 text-white">
          <History className="w-5 h-5 text-white/70" />
          <h3 className="text-lg font-semibold">Interview History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-white/70">
            <thead className="text-xs text-white/40 uppercase border-b border-white/10">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">{item.date}</td>
                  <td className="px-4 py-4 font-medium text-white">{item.role}</td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs">{item.status}</span>
                  </td>
                  <td className="px-4 py-4 font-bold">{item.score > 0 ? `${item.score}%` : '--'}</td>
                  <td className="px-4 py-4">{item.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

    </div>
  );
}
