'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { ArrowRight, User, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { useUserStore } from '@/store/useUserStore';

export default function OnboardingStep1() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { profile, setProfile } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: name,
          target_role: role
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        router.push('/dashboard');
      } else {
        setErrorMsg('Failed to update profile.');
      }
    } catch (e) {
      setErrorMsg('Network error.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-8 duration-700">
      <GlassCard className="p-8">
        <div className="flex items-center space-x-2 text-white/50 mb-6">
          <div className="w-8 h-1 rounded-full bg-white"></div>
          <div className="w-8 h-1 rounded-full bg-white/20"></div>
          <div className="w-8 h-1 rounded-full bg-white/20"></div>
          <div className="w-8 h-1 rounded-full bg-white/20"></div>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 mb-4 text-white">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Personal Information</h1>
          <p className="text-sm text-white/50">Let&apos;s start by setting up your basic profile.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-wider text-white/50 uppercase">Full Name</label>
            <input 
              type="text" 
              placeholder="Alex Rivera" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-wider text-white/50 uppercase">Current Role / Title</label>
            <input 
              type="text" 
              placeholder="e.g. Software Engineer" 
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          {errorMsg && (
            <div className="text-red-400 text-xs text-center py-1 bg-red-400/10 rounded border border-red-400/20">
              {errorMsg}
            </div>
          )}

          <div className="pt-6">
            <PremiumButton variant="primary" className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
              ) : (
                <>Next Step <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </PremiumButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
