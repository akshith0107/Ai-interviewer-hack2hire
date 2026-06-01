'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Video, BrainCircuit, BarChart2, Settings, Plus, LifeBuoy, LogOut } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Interviews', href: '/dashboard/interviews', icon: Video },
  { name: 'Intelligence', href: '/dashboard/intelligence', icon: BrainCircuit },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, clearProfile } = useUserStore();

  const handleSignOut = () => {
    clearProfile();
    router.push('/login');
  };

  return (
    <aside className="w-64 border-r border-white/10 glass-panel flex flex-col h-full sticky top-0">
      <div className="p-6">
        <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-white">
          InterviewIQ
        </Link>
      </div>

      {profile && (
        <div className="px-6 py-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border border-white/20">
            <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">{profile.name}</div>
            <div className="text-xs text-white/50">{profile.tier}</div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link href="/dashboard/interviews/new" className="block mb-6">
          <PremiumButton variant="primary" className="w-full justify-start pl-4" size="md">
            <Plus className="w-4 h-4 mr-2" />
            New Interview
          </PremiumButton>
        </Link>
        <div className="space-y-1">
          <button 
            onClick={() => router.push('/coming-soon')}
            className="flex items-center space-x-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Support</span>
          </button>
          <button 
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
