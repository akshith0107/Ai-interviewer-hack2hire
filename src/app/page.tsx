import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { ArrowRight, PlayCircle, Bot, Zap, Target, BarChart3, CheckCircle2, Sparkles } from 'lucide-react';
import { Starfield } from '@/components/ui/starfield-1';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      <Starfield speed={0.5} quantity={400} starColor="rgba(255, 255, 255, 0.7)" />
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <Bot className="w-4 h-4 text-white/70" />
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Next-Gen Interview Intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[1.1]">
              Practice Interviews.<br />
              Get Hired Faster.
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 max-w-xl leading-relaxed">
              An AI interviewer that analyzes resumes, adapts question difficulty, evaluates responses, and predicts hiring readiness.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Link href="/login" className="w-full sm:w-auto">
                <PremiumButton variant="primary" size="lg" className="w-full">
                  Start Interview
                  <ArrowRight className="w-5 h-5 ml-2" />
                </PremiumButton>
              </Link>
              <PremiumButton variant="secondary" size="lg" className="w-full sm:w-auto">
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch Demo
              </PremiumButton>
            </div>
          </div>

          {/* Floating Glass Dashboard Preview */}
          <div className="relative h-[500px] w-full hidden lg:flex items-center justify-center animate-in fade-in zoom-in duration-1000 delay-300">
            {/* The main floating card */}
            <GlassCard className="absolute z-20 w-[400px] p-6 shadow-2xl transform translate-x-10 -translate-y-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-semibold text-white">AI Interview Readiness</h3>
                <div className="text-3xl font-bold text-white">84<span className="text-sm text-white/50">/100</span></div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>Technical</span>
                    <span>88%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[88%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>Communication</span>
                    <span>92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[92%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>Problem Solving</span>
                    <span>74%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[74%]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-white/50">Hiring Recommendation</div>
                    <div className="text-sm font-bold text-white">Strong Candidate</div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Smaller floating element 1 */}
            <GlassCard className="absolute z-30 p-3 flex items-center space-x-3 shadow-xl transform -translate-x-16 translate-y-36">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-white/50">Response Time</div>
                <div className="text-sm font-bold text-white">Optimal</div>
              </div>
            </GlassCard>

            {/* Smaller floating element 2 */}
            <GlassCard className="absolute z-30 p-3 flex items-center space-x-3 shadow-xl transform translate-x-20 -translate-y-48">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-white">Live Analysis Active</span>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="w-full max-w-7xl mt-32 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Engineered for Excellence</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Our platform combines cutting-edge AI with proven psychological assessment models.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-8 md:col-span-2 h-[300px] flex flex-col justify-end relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              {/* Using a placeholder gradient for the image instead of actual image since none provided for hero backgrounds */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-black to-black opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
              
              <div className="relative z-20">
                <Bot className="w-8 h-8 text-white mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Adaptive Questioning</h3>
                <p className="text-white/60 text-sm max-w-sm">The AI dynamically adjusts the difficulty and focus of questions based on your real-time performance and resume details.</p>
              </div>
            </GlassCard>

            <GlassCard className="p-8 h-[300px] flex flex-col justify-between">
              <Target className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Resume Parsing</h3>
                <p className="text-white/60 text-sm">Instant analysis of your background to tailor the interview scenario.</p>
              </div>
            </GlassCard>

            <GlassCard className="p-8 h-[300px] flex flex-col justify-between">
              <Zap className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Micro-Expression Analysis</h3>
                <p className="text-white/60 text-sm">Optional visual feedback evaluating confidence and clarity.</p>
              </div>
            </GlassCard>

            <GlassCard className="p-8 md:col-span-2 h-[300px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 bottom-0 p-8 opacity-20">
                <BarChart3 className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-2 py-1 mb-4">
                  <span className="text-[10px] font-semibold text-white uppercase tracking-wider">New Feature</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Industry-Specific Benchmarking</h3>
                <p className="text-white/60 text-sm max-w-sm">Compare your performance against thousands of successful candidates in your specific field.</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 relative z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sparkles className="w-4 h-4 text-white/50" />
            <span className="text-sm font-bold text-white/50">InterviewIQ</span>
          </div>
          <div className="flex space-x-6">
            <Link href="/coming-soon" className="text-xs text-white/50 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/coming-soon" className="text-xs text-white/50 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/coming-soon" className="text-xs text-white/50 hover:text-white transition-colors">Security</Link>
            <Link href="/coming-soon" className="text-xs text-white/50 hover:text-white transition-colors">System Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
