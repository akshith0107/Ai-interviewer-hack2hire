import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <h1 className="text-4xl font-bold text-white mb-4">Coming Soon</h1>
        <p className="text-white/60 mb-8">
          We're working hard to bring you this feature. Check back later!
        </p>
        <Link href="/">
          <PremiumButton variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </PremiumButton>
        </Link>
      </div>
    </div>
  );
}
