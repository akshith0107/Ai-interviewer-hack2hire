import { Sidebar } from './Sidebar';
import { Background } from '@/components/ui/Background';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent flex relative">
      <Background />
      {/* Main Content Area */}
      <div className="relative z-10 flex w-full max-w-[1600px] mx-auto overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto h-screen scroll-smooth">
          <div className="p-8 pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
