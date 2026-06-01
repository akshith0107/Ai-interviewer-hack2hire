'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { User, Bell, Shield, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
        <p className="text-white/60 text-sm">Manage your account preferences and application settings.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg bg-white/10 text-white text-sm font-medium transition-colors">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
            <Shield className="w-4 h-4" />
            <span>Privacy</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
            <Key className="w-4 h-4" />
            <span>API Keys</span>
          </button>
        </div>

        <div className="md:col-span-3 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Profile Settings</h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-white/50 uppercase">First Name</label>
                  <input type="text" defaultValue="Alex" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-white/50 uppercase">Last Name</label>
                  <input type="text" defaultValue="Rivera" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-white/50 uppercase">Email Address</label>
                <input type="email" defaultValue="alex@example.com" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-white/50 uppercase">Current Role</label>
                <input type="text" defaultValue="Sr. Product Designer" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30" />
              </div>

              <div className="pt-4 flex justify-end">
                <PremiumButton variant="primary" type="button">Save Changes</PremiumButton>
              </div>
            </form>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Danger Zone</h3>
            <p className="text-sm text-white/50 mb-4">Permanently delete your account and all interview history.</p>
            <PremiumButton variant="outline" className="text-red-400 border-red-500/20 hover:bg-red-500/10">Delete Account</PremiumButton>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
