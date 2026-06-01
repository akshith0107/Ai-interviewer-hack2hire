'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function ProcessingScreen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    // Simulate AI processing delay
    const timer = setTimeout(() => {
      router.push(`/dashboard/results/${id}`);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 bg-noise opacity-[0.03]"></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-20"></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial-glow"></div>

      <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in zoom-in duration-1000">
        <div className="w-24 h-24 relative mb-8 flex items-center justify-center">
          <div className="absolute inset-0 border-t-2 border-l-2 border-white rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-b-2 border-r-2 border-white/50 rounded-full animate-spin-reverse"></div>
          <BrainCircuit className="w-8 h-8 text-white animate-pulse" />
        </div>
        
        <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Analyzing Interview Performance</h2>
        
        <div className="space-y-2 text-white/50 text-sm h-20">
          <p className="animate-pulse">Evaluating behavioral indicators...</p>
          <p className="animate-pulse animation-delay-1000">Cross-referencing technical competency...</p>
          <p className="animate-pulse animation-delay-2000">Generating readiness index...</p>
        </div>
      </div>
    </div>
  );
}
