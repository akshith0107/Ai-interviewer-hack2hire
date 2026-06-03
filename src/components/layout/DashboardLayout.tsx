'use client';

import { Sidebar } from './Sidebar';
import { Background } from '@/components/ui/Background';
import { Menu } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { setMobileMenuOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row relative">
      <Background />
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 glass-panel sticky top-0 z-30">
        <div className="text-xl font-bold tracking-tighter text-white">InterviewIQ</div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="text-white/70 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex w-full max-w-[1600px] mx-auto overflow-hidden flex-1 flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen scroll-smooth">
          <div className="p-4 md:p-8 pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
