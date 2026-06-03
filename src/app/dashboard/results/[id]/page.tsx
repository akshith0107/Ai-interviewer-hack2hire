'use client';

import { useState, useEffect, use } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { CompetencyRadarChart } from '@/components/dashboard/CompetencyRadarChart';
import { Share2, Download, CheckCircle2, Bot, Target, MinusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { TrendingUp as TrendingUpIcon } from 'lucide-react';

export default function ResultsDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/report/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: id })
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch or generate report. Ensure the session exists.');
        }
        
        const data = await res.json();
        console.log("Report Response:", data);
        setReport(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [id]);

  const handleExportPDF = async () => {
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const { jsPDF } = await import('jspdf');
      
      const element = document.getElementById('report-content');
      if (!element) return;
      
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#000000', logging: false });
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
      
      pdf.save(`Intelligence_Report_${id}.pdf`);
    } catch (err) {
      console.error("PDF Export failed:", err);
      alert("Failed to export PDF.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-500">
        <Loader2 className="w-12 h-12 text-white/50 animate-spin" />
        <h2 className="text-xl font-bold text-white tracking-tight">Generating Your Interview Report...</h2>
        <p className="text-white/50 text-sm">Analyzing your interview performance and preparing insights.</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
          <Bot className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Report Unavailable</h2>
        <p className="text-white/60 max-w-md">Complete an interview to generate your AI Intelligence Report. The session may have expired or does not exist.</p>
        <Link href="/dashboard/interviews/new">
          <PremiumButton variant="primary">Start a New Interview</PremiumButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: '#ffffff' }}>Intelligence Report</h1>
          <p className="text-sm max-w-2xl" style={{ color: 'rgba(255,255,255,0.6)' }}>Comprehensive analysis of behavioral responses, technical aptitude, and executive presence.</p>
        </div>
        <div className="flex space-x-3">
          <PremiumButton variant="secondary" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </PremiumButton>
          <PremiumButton variant="primary" size="sm" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </PremiumButton>
        </div>
      </header>

      <div id="report-content" className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
        {/* Left Column: Overall Readiness */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <GlassCard className="p-8 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-32" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)' }}></div>
            
            <h3 className="text-xs font-semibold tracking-wider uppercase mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>Overall Readiness</h3>
            
            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
              {/* Fake SVG Circle Progress */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
                <circle 
                  cx="96" cy="96" r="88" 
                  stroke="#ffffff" strokeWidth="4" fill="none" 
                  strokeDasharray="552.92" 
                  strokeDashoffset={552.92 - (552.92 * report.readiness_score) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="text-center">
                <div className="flex items-baseline justify-center text-5xl font-bold" style={{ color: '#ffffff' }}>
                  {report.readiness_score}<span className="text-2xl" style={{ color: 'rgba(255,255,255,0.5)' }}>%</span>
                </div>
                <div className="text-xs font-medium mt-2 flex items-center justify-center" style={{ color: '#34d399' }}>
                  <TrendingUpIcon className="w-3 h-3 mr-1" />
                  +4% vs peer average
                </div>
              </div>
            </div>

            <div className="w-full flex justify-between items-center text-sm border-t pt-4 mb-6" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Category</span>
              <span className="font-medium" style={{ color: '#ffffff' }}>
                {report.readiness_score >= 90 ? 'Highly Recommended' : 
                 report.readiness_score >= 75 ? 'Interview Ready' : 
                 report.readiness_score >= 60 ? 'Needs Improvement' : 'Not Ready'}
              </span>
            </div>

            <div className="w-full border rounded-lg p-4 flex items-center justify-between" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="text-left">
                <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>AI Recommendation</div>
                <div className="text-lg font-bold" style={{ color: '#ffffff' }}>{report.hiring_recommendation}</div>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bot className="w-5 h-5" style={{ color: '#ffffff' }} />
              <h3 className="text-lg font-semibold" style={{ color: '#ffffff' }}>AI Recruiter Summary</h3>
            </div>
            <div className="text-sm leading-relaxed space-y-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {report.executive_summary.split('\n\n').map((paragraph: string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <GlassCard className="p-6 flex flex-col">
              <h3 className="text-xs font-semibold tracking-wider uppercase mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>Competency Mapping</h3>
              <div className="flex-1 flex items-center justify-center">
                <CompetencyRadarChart scores={report.aggregated_scores} />
              </div>
            </GlassCard>

            <div className="space-y-6 flex flex-col">
              <GlassCard className="p-6 flex-1">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#34d399' }} />
                  <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Core Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {report.strengths.map((strength: string, i: number) => (
                    <li key={i} className="flex items-start text-sm">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 mr-3 flex-shrink-0" style={{ backgroundColor: '#34d399' }} />
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>{strength}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-6 flex-1">
                <div className="flex items-center space-x-2 mb-4">
                  <MinusCircle className="w-4 h-4" style={{ color: '#fbbf24' }} />
                  <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Growth Areas</h3>
                </div>
                <ul className="space-y-3">
                  {report.improvement_areas.map((weakness: string, i: number) => (
                    <li key={i} className="flex items-start text-sm">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 mr-3 flex-shrink-0" style={{ backgroundColor: '#fbbf24' }} />
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>{weakness}</span>
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
          <Target className="w-5 h-5" style={{ color: '#ffffff' }} />
          <h3 className="text-lg font-semibold" style={{ color: '#ffffff' }}>Improvement Roadmap</h3>
        </div>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-2.5 left-0 w-full h-px hidden md:block" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              <div className="relative">
                <div className="hidden md:block absolute top-0 left-0 w-5 h-5 -mt-2 -ml-2 rounded-full border-4 z-10" style={{ backgroundColor: '#000000', borderColor: 'rgba(255,255,255,0.2)' }} />
                <div className="md:mt-8">
                  <div className="text-base font-bold mb-2" style={{ color: '#ffffff' }}>Detailed AI Feedback</div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.6)' }}>{report.personalized_roadmap}</p>
                </div>
              </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
