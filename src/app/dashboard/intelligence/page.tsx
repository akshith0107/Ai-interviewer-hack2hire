'use client';

import { useState, useEffect, useRef } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Brain, Download, Target, TrendingUp, AlertTriangle, 
  CheckCircle2, UserCircle, Briefcase, Map, Lightbulb, Loader2 
} from 'lucide-react';
import { fetchWithAuth } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function IntelligencePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE}/intelligence/me`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const { jsPDF } = await import('jspdf');
      
      const element = reportRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#050505', logging: false });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      const pdf = new jsPDF({ unit: 'in', format: 'letter', orientation: 'portrait' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('AI_Intelligence_Report.pdf');
    } catch (e) {
      console.error("PDF Export failed", e);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white/50 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Intelligence Center</h1>
          <p className="text-white/60 text-sm">Your AI-powered career brain.</p>
        </header>
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-white/10">
          <Brain className="w-16 h-16 text-white/20 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Data Available</h2>
          <p className="text-white/50 max-w-md">
            Complete your first interview to unlock AI Intelligence Insights.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Intelligence Center</h1>
          <p className="text-white/60 text-sm">Actionable career intelligence and AI-powered recommendations.</p>
        </div>
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors border border-white/10"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>{exporting ? 'Generating PDF...' : 'Export PDF'}</span>
        </button>
      </header>

      {/* Wrapping the exportable area */}
      <div ref={reportRef} className="space-y-8 text-[#ffffff]">
        
        {/* Sections 1, 2, 3: Verdict & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-semibold">AI Recruiter Verdict</h2>
              </div>
              <p className="text-[#ffffff]/80 leading-relaxed mb-6">
                {data.executive_summary}
              </p>
            </div>
            <div className="bg-[#ffffff]/5 border border-[#ffffff]/10 rounded-lg p-4">
              <span className="text-[#ffffff]/50 text-sm uppercase tracking-wider block mb-1">Recommendation</span>
              <span className="text-lg font-medium">{data.hiring_recommendation}</span>
            </div>
          </GlassCard>

          <div className="flex flex-col gap-6 h-full">
            <GlassCard className="p-6 flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-[#ffffff]/50 text-sm uppercase tracking-wider mb-2">Readiness Category</div>
              <div className="text-4xl font-bold mb-2">{data.readiness_score}</div>
              <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
                {data.readiness_category}
              </div>
            </GlassCard>
            <GlassCard className="p-6 flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-[#ffffff]/50 text-sm uppercase tracking-wider mb-2">Hiring Probability</div>
              <div className="flex items-end space-x-2 mb-2">
                <span className="text-4xl font-bold">{data.hiring_probability?.current_probability}%</span>
                <span className="text-sm text-[#ffffff]/40 pb-1">Current</span>
              </div>
              <div className="text-sm text-[#ffffff]/60">
                Projected: <span className="text-emerald-400">{data.hiring_probability?.projected_probability}%</span> after roadmap completion
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Sections 4, 5, 6: Strengths, Weaknesses, Skill Gap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Target className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold">Top Strengths</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.top_strengths?.map((s: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-[#ffffff]/10 border border-[#ffffff]/20 rounded-md text-sm">
                  {s}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold">Improvement Areas</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.top_weaknesses?.map((w: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-[#ffffff]/5 border border-[#ffffff]/10 text-[#ffffff]/70 rounded-md text-sm">
                  {w}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold">Skill Gap</h3>
              </div>
              <span className="text-blue-400 font-bold">{data.skill_gap?.match_percentage}% Match</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-[#ffffff]/50 mb-2 uppercase">Missing Required Skills</div>
                <div className="flex flex-wrap gap-2">
                  {data.skill_gap?.missing_skills?.length > 0 ? (
                    data.skill_gap.missing_skills.map((s: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-red-500/10 text-red-300 text-xs rounded">{s}</span>
                    ))
                  ) : (
                    <span className="text-sm text-[#ffffff]/50">No critical gaps detected.</span>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Section 9, 10: Career Insights & Role Match */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold">Career Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-[#ffffff]/5 p-4 rounded-lg border border-[#ffffff]/10">
                <span className="text-[#ffffff]/50 text-xs uppercase block mb-1">Fastest Improvement Opportunity</span>
                <span className="text-sm font-medium">{data.career_insights?.fastest_improvement_opportunity}</span>
              </div>
              <div className="bg-[#ffffff]/5 p-4 rounded-lg border border-[#ffffff]/10">
                <span className="text-[#ffffff]/50 text-xs uppercase block mb-1">Recommended Next Skill</span>
                <span className="text-sm font-medium text-amber-300">{data.career_insights?.recommended_next_skill}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold">Role Match Analysis</h3>
            </div>
            <div className="space-y-4">
              {data.recommended_roles?.map((role: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#ffffff]/5 border border-[#ffffff]/10 rounded-lg">
                  <span className="font-medium">{role.role}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 h-2 bg-[#ffffff]/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400" style={{ width: `${role.match}%` }}></div>
                    </div>
                    <span className="text-sm font-bold w-8 text-right">{role.match}%</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Section 7: Personality Profile */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <UserCircle className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold">Interview Personality Profile</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#ffffff]/5 p-4 rounded-lg text-center border border-[#ffffff]/10">
              <div className="text-xs text-[#ffffff]/50 uppercase mb-2">Communication</div>
              <div className="font-semibold text-purple-300">{data.personality_profile?.communication_style}</div>
            </div>
            <div className="bg-[#ffffff]/5 p-4 rounded-lg text-center border border-[#ffffff]/10">
              <div className="text-xs text-[#ffffff]/50 uppercase mb-2">Confidence</div>
              <div className="font-semibold text-purple-300">{data.personality_profile?.confidence_level}</div>
            </div>
            <div className="bg-[#ffffff]/5 p-4 rounded-lg text-center border border-[#ffffff]/10">
              <div className="text-xs text-[#ffffff]/50 uppercase mb-2">Problem Solving</div>
              <div className="font-semibold text-purple-300">{data.personality_profile?.problem_solving_style}</div>
            </div>
            <div className="bg-[#ffffff]/5 p-4 rounded-lg text-center border border-[#ffffff]/10">
              <div className="text-xs text-[#ffffff]/50 uppercase mb-2">Collaboration</div>
              <div className="font-semibold text-purple-300">{data.personality_profile?.collaboration_style}</div>
            </div>
          </div>
        </GlassCard>

        {/* Section 8: Improvement Roadmap */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Map className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold">30-Day Improvement Roadmap</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.improvement_plan?.map((week: any, i: number) => (
              <div key={i} className="bg-[#ffffff]/5 border border-[#ffffff]/10 rounded-lg p-5">
                <div className="font-bold text-lg mb-4 text-blue-300">{week.week}</div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs uppercase text-[#ffffff]/50 mb-1">Focus Topics</div>
                    <ul className="list-disc list-inside text-sm text-[#ffffff]/80 space-y-1">
                      {week.topics.map((t: string, j: number) => <li key={j}>{t}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-[#ffffff]/50 mb-1">Projects / Practice</div>
                    <ul className="list-disc list-inside text-sm text-[#ffffff]/80 space-y-1">
                      {week.projects.map((t: string, j: number) => <li key={j}>{t}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
