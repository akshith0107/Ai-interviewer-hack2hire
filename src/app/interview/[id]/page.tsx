'use client';

import { useSessionStore } from '@/store/useSessionStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { MonitorSmartphone, Timer, Pause, Square, Check, Mic } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';

export default function LiveInterviewRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const session = useSessionStore((state) => state.session);
  const [isRecording, setIsRecording] = useState(true);

  if (!session) return null;

  const currentQ = session.questions[session.currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    router.push(`/interview/${id}/processing`);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 bg-noise opacity-[0.03]"></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-20"></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial-glow"></div>

      <header className="p-8 relative z-10">
        <div className="flex items-center space-x-2 text-white">
          <MonitorSmartphone className="w-5 h-5" />
          <span className="text-lg font-medium">Live Interview Room</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 max-w-5xl mx-auto w-full">
        <GlassCard className="w-full flex flex-col p-6 min-h-[600px] relative animate-in zoom-in-95 duration-700">
          {/* Internal Header */}
          <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold text-white tracking-tighter">InterviewIQ</span>
              <div className="flex items-center space-x-2 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/50'}`} />
                <span className="text-[10px] font-bold tracking-wider text-white/70 uppercase">Live Session</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-white/80">
              <Timer className="w-4 h-4" />
              <span className="font-medium text-sm tabular-nums">{formatTime(session.timeRemaining)}</span>
            </div>
          </div>

          {/* Question Area */}
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto w-full">
            <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-8">
              <span className="text-[10px] font-bold tracking-wider text-white/50 uppercase">
                Question {session.currentQuestionIndex + 1} of {session.totalQuestions}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6 animate-in slide-in-from-bottom-4">
              {currentQ.text}
            </h2>

            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl mb-16 animate-in slide-in-from-bottom-8">
              Please focus on your specific role, the strategies you employed to maintain team alignment, and the final outcome of the project.
            </p>

            {/* Live Transcription */}
            <div className="h-24 w-full flex items-center justify-center">
              <p className="text-lg text-white/80 italic animate-pulse">
                &quot;To manage this, I implemented a strict daily standup and...&quot;
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center space-x-4 mt-auto pt-8">
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              {isRecording ? <Pause className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <PremiumButton variant="primary" className="px-8 h-12 rounded-full" onClick={handleSubmit}>
              <Check className="w-5 h-5 mr-2" />
              SUBMIT ANSWER
            </PremiumButton>

            <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-red-500 hover:bg-white/10 hover:text-red-400 transition-colors">
              <Square className="w-4 h-4" />
            </button>
          </div>

          {/* End Early */}
          <div className="absolute bottom-6 right-6">
            <button className="text-[10px] font-bold tracking-wider text-white/30 uppercase hover:text-white/70 transition-colors">
              End Interview Early
            </button>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
