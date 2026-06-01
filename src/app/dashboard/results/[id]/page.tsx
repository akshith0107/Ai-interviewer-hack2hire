'use client';

import { useResultsStore } from '@/store/useResultsStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { CompetencyRadarChart } from '@/components/dashboard/CompetencyRadarChart';
import { Share2, Download, CheckCircle2, Bot, Target, MinusCircle } from 'lucide-react';
import { use } from 'react';

export default function ResultsDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const results = useResultsStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-xs font-semibold text-white bg-white/10 px-2.5 py-1 rounded-md border border-white/10">Sr. Product Designer</span>
            <span className="text-xs text-white/50">Completed Oct 24, 2024</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Intelligence Report</h1>
          <p className="text-white/60 text-sm max-w-2xl">Comprehensive analysis of behavioral responses, technical aptitude, and executive presence.</p>
        </div>
        <div className="flex space-x-3">
          <PremiumButton variant="secondary" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </PremiumButton>
          <PremiumButton variant="primary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </PremiumButton>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Overall Readiness */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <GlassCard className="p-8 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/5 to-transparent"></div>
            
            <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase mb-8">Overall Readiness</h3>
            
            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
              {/* Fake SVG Circle Progress */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
                <circle 
                  cx="96" cy="96" r="88" 
                  stroke="#ffffff" strokeWidth="4" fill="none" 
                  strokeDasharray="552.92" 
                  strokeDashoffset={552.92 - (552.92 * results.readinessScore) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="text-center">
                <div className="flex items-baseline justify-center text-5xl font-bold text-white">
                  {results.readinessScore}<span className="text-2xl text-white/50">%</span>
                </div>
                <div className="text-xs text-emerald-400 font-medium mt-2 flex items-center justify-center">
                  <TrendingUpIcon className="w-3 h-3 mr-1" />
                  +4% vs peer average
                </div>
              </div>
            </div>

            <div className="w-full flex justify-between items-center text-sm border-t border-white/10 pt-4 mb-6">
              <span className="text-white/50">Confidence Level</span>
              <span className="text-white font-medium">{results.confidenceLevel}</span>
            </div>

            <div className="w-full bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
              <div className="text-left">
                <div className="text-xs text-white/50 mb-1">AI Recommendation</div>
                <div className="text-lg font-bold text-white">{results.hiringRecommendation}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bot className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">AI Recruiter Summary</h3>
            </div>
            <div className="text-white/70 text-sm leading-relaxed space-y-4">
              {results.aiSummary.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <GlassCard className="p-6 flex flex-col">
              <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase mb-6">Competency Mapping</h3>
              <div className="flex-1 flex items-center justify-center">
                <CompetencyRadarChart />
              </div>
            </GlassCard>

            <div className="space-y-6 flex flex-col">
              <GlassCard className="p-6 flex-1">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">Core Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {results.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-3 flex-shrink-0" />
                      <span className="text-white/70">{strength}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-6 flex-1">
                <div className="flex items-center space-x-2 mb-4">
                  <MinusCircle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white">Growth Areas</h3>
                </div>
                <ul className="space-y-3">
                  {results.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 mr-3 flex-shrink-0" />
                      <span className="text-white/70">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Improvement Roadmap */}
      <GlassCard className="p-8">
        <div className="flex items-center space-x-2 mb-8">
          <Target className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Improvement Roadmap</h3>
        </div>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-2.5 left-0 w-full h-px bg-white/10 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {results.roadmap.map((item, i) => (
              <div key={i} className="relative">
                {/* Timeline Dot */}
                <div className="hidden md:block absolute top-0 left-0 w-5 h-5 -mt-2 -ml-2 rounded-full bg-black border-4 border-white/20 z-10" />
                
                <div className="md:mt-8">
                  <div className="text-xs font-semibold text-white/50 mb-1">{item.term}</div>
                  <div className="text-base font-bold text-white mb-2">{item.focus}</div>
                  <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// Needed icon for trending up in the circular progress
import { TrendingUp as TrendingUpIcon } from 'lucide-react';
