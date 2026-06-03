'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { ArrowRight, MonitorSmartphone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Starfield } from '@/components/ui/starfield-1';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    
    setErrorMsg('');
    setIsLoading(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
          full_name: email.split('@')[0], // fallback
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Signup failed');
      }
      
      // Since it's MVP, immediately login and set token, or redirect to login.
      // We will just redirect to login with a success message, but wait, 
      // let's just log them in directly by hitting the login API too.
      const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email, password: password }),
      });
      
      if (loginRes.ok) {
        const data = await loginRes.json();
        localStorage.setItem('token', data.access_token);
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
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
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 flex items-center justify-center opacity-30">
                <div className="w-full h-px bg-white"></div>
                <div className="w-px h-full bg-white absolute"></div>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2 mt-4">Create Account</h1>
              <p className="text-sm text-white/50">Join InterviewIQ and start your journey.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSignup}>
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
                <label className="text-[10px] font-bold tracking-wider text-white/50 uppercase">Password</label>
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
                  {isLoading ? 'CREATING...' : 'SIGN UP'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </PremiumButton>
              </div>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-white/10"></div>
              <div className="px-4 text-[10px] font-bold tracking-wider text-white/30 uppercase">Or</div>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <div className="text-center text-xs text-white/50">
              Already have an account? <Link href="/login" className="text-white font-medium hover:underline">Log in</Link>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
