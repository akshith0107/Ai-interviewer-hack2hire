'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { ArrowRight, MonitorSmartphone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Starfield } from '@/components/ui/starfield-1';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <Starfield speed={0.5} quantity={400} starColor="rgba(255, 255, 255, 0.7)" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-noise opacity-[0.03]"></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-20"></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial-glow"></div>

      <header className="p-8 relative z-10">
        <Link href="/" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
          <MonitorSmartphone className="w-5 h-5" />
          <span className="text-lg font-medium">InterviewIQ</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-8 duration-700">
          <GlassCard className="p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div className="text-center mb-8 relative">
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Reset Password</h1>
              <p className="text-sm text-white/50">Enter your email and we&apos;ll send you a link to reset your password.</p>
            </div>

            {isSent ? (
              <div className="text-center space-y-6">
                <div className="text-emerald-400 text-sm bg-emerald-400/10 py-3 rounded-lg border border-emerald-400/20">
                  Reset link sent to your email.
                </div>
                <Link href="/login" className="block">
                  <PremiumButton variant="secondary" className="w-full">
                    Return to Login
                  </PremiumButton>
                </Link>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleReset}>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-white/50 uppercase">Email</label>
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                  />
                </div>

                <PremiumButton variant="primary" className="w-full" type="submit" isLoading={isLoading}>
                  {isLoading ? 'SENDING...' : 'SEND RESET LINK'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </PremiumButton>
                
                <div className="text-center text-xs text-white/50 pt-2">
                  <Link href="/login" className="hover:text-white transition-colors">Back to Login</Link>
                </div>
              </form>
            )}
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
