'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { MonitorSmartphone, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { Starfield } from '@/components/ui/starfield-1';

export default function VerifyEmailPage() {
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
          <GlassCard className="p-8 flex flex-col relative overflow-hidden text-center">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <MailCheck className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Check your email</h1>
            <p className="text-sm text-white/60 mb-8 leading-relaxed">
              We&apos;ve sent a verification link to your email address. Please click the link to activate your account.
            </p>

            <Link href="/login" className="w-full">
              <PremiumButton variant="secondary" className="w-full">
                Back to Login
              </PremiumButton>
            </Link>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
