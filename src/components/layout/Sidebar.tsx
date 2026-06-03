'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Video, BrainCircuit, BarChart2, Settings, Plus, LifeBuoy, LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useUIStore } from '@/store/useUIStore';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useEffect } from 'react';

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
  const { isSidebarCollapsed, isMobileMenuOpen, toggleSidebar, setMobileMenuOpen } = useUIStore();

  const handleSignOut = () => {
    clearProfile();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    router.push('/login');
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const showLabels = !isSidebarCollapsed || isMobileMenuOpen;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#050505]/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <aside className={cn(
        "glass-panel flex flex-col h-full fixed md:sticky top-0 transition-all duration-300 z-50",
        "md:translate-x-0 border-r border-white/10",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        isSidebarCollapsed ? "md:w-20" : "md:w-64",
        "w-64" // Always 64 on mobile when open
      )}>
        <div className="p-6 flex items-center justify-between">
          {showLabels ? (
            <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-white truncate">
              InterviewIQ
            </Link>
          ) : (
            <Link href="/dashboard" className="text-xl font-bold tracking-tighter text-white mx-auto">
              IQ
            </Link>
          )}
          
          {/* Desktop Collapse Toggle */}
          <button 
            onClick={toggleSidebar}
            className="hidden md:flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {/* Mobile Close Button */}
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {profile && (
          <div className={cn("px-6 py-4 flex items-center", isSidebarCollapsed && !isMobileMenuOpen ? "justify-center px-0" : "space-x-3")}>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0 border border-white/10 relative">
              <img src={profile.profile_image_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} alt={profile.full_name || 'User'} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
            {showLabels && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{profile.full_name || 'User'}</div>
                <div className="text-xs text-white/50 truncate flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30 mr-1.5"></span>
                  {profile.target_role || 'Free Tier'}
                </div>
              </div>
            )}
          </div>
        )}

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isSidebarCollapsed && !isMobileMenuOpen ? 'justify-center' : 'space-x-3',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
                title={isSidebarCollapsed && !isMobileMenuOpen ? item.name : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {showLabels && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/dashboard/interviews/new" className="block mb-6" title={isSidebarCollapsed && !isMobileMenuOpen ? "New Interview" : undefined}>
            <PremiumButton variant="primary" className={cn("w-full transition-all", isSidebarCollapsed && !isMobileMenuOpen ? "justify-center px-0" : "justify-start pl-4")} size="md">
              <Plus className={cn("w-5 h-5 shrink-0", showLabels && "mr-2")} />
              {showLabels && <span className="truncate">New Interview</span>}
            </PremiumButton>
          </Link>
          <div className="space-y-2">
            <button 
              onClick={() => router.push('/coming-soon')}
              className={cn("flex items-center px-3 py-2 w-full rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors", isSidebarCollapsed && !isMobileMenuOpen ? "justify-center" : "space-x-3")}
              title={isSidebarCollapsed && !isMobileMenuOpen ? "Support" : undefined}
            >
              <LifeBuoy className="w-5 h-5 shrink-0" />
              {showLabels && <span>Support</span>}
            </button>
            <button 
              onClick={handleSignOut}
              className={cn("flex items-center px-3 py-2 w-full rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors", isSidebarCollapsed && !isMobileMenuOpen ? "justify-center" : "space-x-3")}
              title={isSidebarCollapsed && !isMobileMenuOpen ? "Sign Out" : undefined}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {showLabels && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
