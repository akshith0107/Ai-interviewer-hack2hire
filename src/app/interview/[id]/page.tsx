'use client';

import { useSessionStore } from '@/store/useSessionStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { MonitorSmartphone, Timer, Pause, Square, Check, Mic, Activity, Brain, ShieldAlert, AlertCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Background } from '@/components/ui/Background';

interface CurrentQuestion {
  question_text: string;
  question_type: string;
  difficulty: string;
  expected_ideal_response: string;
}

export default function LiveInterviewRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  // Backend State
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion | null>(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Speech & Time State
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timeTaken, setTimeTaken] = useState(0);
  const [micPermission, setMicPermission] = useState<string>('unknown');
  
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
          if (event.error === 'not-allowed') {
            setMicPermission('denied');
          }
        };
      } else {
        console.warn("Speech Recognition not supported in this browser.");
        setMicPermission('unsupported');
      }
    }
  }, []);

  // Request Microphone Access check
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setMicPermission('granted'))
      .catch(() => setMicPermission('denied'));
  }, []);

  // Timer logic
  useEffect(() => {
    if (currentQuestion && !isEvaluating) {
      timerRef.current = setInterval(() => {
        setTimeTaken((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentQuestion, isEvaluating]);

  // Fetch First Question on Mount
  useEffect(() => {
    fetchNextQuestion();
  }, [id]);

  const fetchNextQuestion = async () => {
    try {
      setError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/interview/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: id })
      });
      if (res.status === 404) {
        alert("Interview session expired or not found. Please start a new interview.");
        router.push('/dashboard/interviews/new');
        return;
      }
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`API Error: ${res.status}`, errorText);
        throw new Error(`Failed to fetch next question: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      setCurrentQuestion(data);
      setTranscript('');
      setTimeTaken(0);
      setIsRecording(false);
      console.log("Question Generated:", data);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to AI engine. Please refresh.");
    }
  };

  const toggleRecording = () => {
    if (micPermission === 'denied' || micPermission === 'unsupported') {
      alert("Microphone is blocked or unsupported. Please type your answer instead.");
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };

  const handleSubmit = async () => {
    if (!currentQuestion || !transcript.trim()) return;
    
    setIsEvaluating(true);
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
    
    try {
      console.log("Answer Submitted. Evaluating...");
      
      // Step 1: Evaluate Answer
      const evalRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/interview/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: id,
          question_text: currentQuestion.question_text,
          expected_ideal_response: currentQuestion.expected_ideal_response,
          candidate_answer: transcript,
          time_taken_seconds: timeTaken
        })
      });
      if (evalRes.status === 404) {
        alert("Interview session expired. Please start a new interview.");
        router.push('/dashboard/interviews/new');
        return;
      }
      if (!evalRes.ok) {
        const errText = await evalRes.text();
        throw new Error(`Evaluation failed: ${errText}`);
      }
      const evalData = await evalRes.json();
      console.log("Answer Evaluated:", evalData);
      
      // Step 2: Process Decision (Adaptive Difficulty + Round check)
      const decRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/interview/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: id,
          latest_score: evalData.scores.overall_score
        })
      });
      if (decRes.status === 404) {
        alert("Interview session expired.");
        router.push('/dashboard/interviews/new');
        return;
      }
      if (!decRes.ok) {
        const errText = await decRes.text();
        throw new Error(`Decision engine failed: ${errText}`);
      }
      const decData = await decRes.json();
      console.log("Difficulty Updated & Decision:", decData);
      
      if (decData.is_terminated) {
        console.log("Interview Ended:", decData.message);
        router.push(`/dashboard/results/${id}`);
      } else {
        setQuestionCount(prev => prev + 1);
        await fetchNextQuestion();
      }
    } catch (err) {
      console.error("Error in submission pipeline", err);
      setError("An error occurred while evaluating your answer. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleEndEarly = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/interview/terminate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: id, reason: "User ended manually" })
      });
    } catch (err) {
      console.error(err);
    }
    router.push(`/dashboard/results/${id}`);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Activity className="w-12 h-12 text-blue-500 animate-pulse mb-4" />
        <h2 className="text-xl font-medium">Generating Your Interview...</h2>
        <p className="text-white/50 mt-2 text-sm">Our AI is analyzing your profile to formulate the first question.</p>
        {error && <p className="text-red-400 mt-4 text-sm bg-red-500/10 px-4 py-2 rounded">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden">
      <Background />
      
      <header className="p-6 relative z-10 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 text-white">
            <Brain className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold tracking-tighter">InterviewIQ</span>
            <div className="flex items-center space-x-2 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20 ml-4">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider text-red-500 uppercase">Live Event</span>
            </div>
          </div>
          <button onClick={handleEndEarly} className="text-sm font-medium text-white/40 hover:text-red-400 transition-colors flex items-center">
            <ShieldAlert className="w-4 h-4 mr-2" />
            End Early
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-8">
        
        {/* LEFT PANEL: Context */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <GlassCard className="p-5 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-1 mb-4">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">AI Interviewer</h2>
            </div>
            
            <div className="w-full bg-white/5 rounded-lg p-3 flex justify-between items-center mb-2 border border-white/5">
              <span className="text-xs text-white/60 uppercase">Difficulty</span>
              <span className={`text-xs font-bold uppercase ${
                currentQuestion.difficulty.toLowerCase() === 'hard' ? 'text-red-400' :
                currentQuestion.difficulty.toLowerCase() === 'medium' ? 'text-blue-400' : 'text-green-400'
              }`}>{currentQuestion.difficulty}</span>
            </div>
            <div className="w-full bg-white/5 rounded-lg p-3 flex justify-between items-center border border-white/5">
              <span className="text-xs text-white/60 uppercase">Testing</span>
              <span className="text-xs font-bold text-purple-400 uppercase">{currentQuestion.question_type}</span>
            </div>
          </GlassCard>
        </div>

        {/* CENTER PANEL: Active Area */}
        <div className="lg:col-span-6 flex flex-col">
          <GlassCard className="p-8 flex flex-col min-h-[600px] relative">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
               <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
                 <Activity className="w-3 h-3 mr-2" />
                 Question {questionCount}
               </div>
               <div className="flex items-center space-x-2 text-white/60 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                 <Timer className="w-4 h-4" />
                 <span>{formatTime(timeTaken)}</span>
               </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-8">
              {currentQuestion.question_text}
            </h2>

            <div className="flex-1 flex flex-col mt-auto relative">
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Click the microphone to speak, or type your answer here..."
                className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-white/90 text-lg leading-relaxed focus:outline-none focus:border-blue-500/50 resize-none"
                disabled={isEvaluating}
              />
              
              {isEvaluating && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center border border-white/10">
                   <Activity className="w-8 h-8 text-blue-500 animate-pulse mb-3" />
                   <span className="text-white font-medium tracking-wide">Evaluating Answer...</span>
                   <span className="text-white/50 text-xs mt-2">Running through deep reasoning engine</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-6">
               <button 
                onClick={toggleRecording}
                disabled={isEvaluating}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isRecording 
                  ? 'bg-red-500 text-white shadow-red-500/20 animate-pulse' 
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                } disabled:opacity-50`}
                title="Toggle Microphone"
              >
                {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-6 h-6" />}
              </button>
              
              <PremiumButton 
                variant="primary" 
                className="px-8 h-14 rounded-full font-bold tracking-wide" 
                onClick={handleSubmit}
                disabled={isEvaluating || !transcript.trim()}
              >
                {isEvaluating ? 'PROCESSING...' : 'SUBMIT ANSWER'}
                <Check className="w-5 h-5 ml-2" />
              </PremiumButton>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT PANEL: Stats */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
           <GlassCard className="p-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Status</h3>
              <div className="space-y-4">
                 <div>
                   <div className="text-xs text-white/50 uppercase mb-1">Mic Status</div>
                   <div className={`text-xs font-bold flex items-center ${
                     micPermission === 'granted' ? 'text-green-400' :
                     micPermission === 'denied' ? 'text-red-400' : 'text-yellow-400'
                   }`}>
                     <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                       micPermission === 'granted' ? 'bg-green-400' :
                       micPermission === 'denied' ? 'bg-red-400' : 'bg-yellow-400'
                     }`} /> 
                     {micPermission === 'granted' ? 'Permitted' :
                      micPermission === 'denied' ? 'Blocked' : 'Unknown'}
                   </div>
                 </div>
                 <div>
                   <div className="text-xs text-white/50 uppercase mb-1">Status</div>
                   <div className="text-xs font-bold text-blue-400 flex items-center">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2" /> In Progress
                   </div>
                 </div>
              </div>
           </GlassCard>
        </div>

      </main>
    </div>
  );
}
