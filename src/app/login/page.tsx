'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { ArrowRight, MonitorSmartphone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Starfield } from '@/components/ui/starfield-1';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    
    setErrorMsg('');
    setIsLoading(true);
    
    // Simulate network delay for loading state
    setTimeout(() => {
      router.push('/dashboard');
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
          <span className="text-lg font-medium">Login / Signup</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-8 duration-700">
          <GlassCard className="p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div className="text-center mb-8 relative">
              {/* Center crosshair decoration */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 flex items-center justify-center opacity-30">
                <div className="w-full h-px bg-white"></div>
                <div className="w-px h-full bg-white absolute"></div>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2 mt-4">Welcome back</h1>
              <p className="text-sm text-white/50">Enter your details to access your intelligence dashboard.</p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-white/50 uppercase">Email</label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold tracking-wider text-white/50 uppercase">Password</label>
                  <Link href="/coming-soon" className="text-[10px] font-medium text-white/50 hover:text-white transition-colors">Forgot?</Link>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                />
              </div>

              {errorMsg && (
                <div className="text-red-400 text-xs text-center py-1 bg-red-400/10 rounded border border-red-400/20">
                  {errorMsg}
                </div>
              )}

              <div className="pt-2">
                <PremiumButton variant="primary" className="w-full" type="submit" isLoading={isLoading}>
                  {isLoading ? 'SIGNING IN...' : 'CONTINUE'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </PremiumButton>
              </div>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-white/10"></div>
              <div className="px-4 text-[10px] font-bold tracking-wider text-white/30 uppercase">Or continue with</div>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md py-2 px-3 transition-colors text-xs font-medium text-white">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md py-2 px-3 transition-colors text-xs font-medium text-white">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            <div className="text-center text-xs text-white/50">
              Don&apos;t have an account? <Link href="/onboarding/step1" className="text-white font-medium hover:underline">Sign up</Link>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
