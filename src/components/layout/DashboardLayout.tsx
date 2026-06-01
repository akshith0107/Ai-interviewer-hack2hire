import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-noise opacity-[0.03]"></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-20"></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial-glow"></div>

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
