import { Background } from '@/components/ui/Background';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden">
      <Background />
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}
