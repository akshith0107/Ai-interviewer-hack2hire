import Link from 'next/link';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Sparkles } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 h-20 z-50 flex items-center justify-between px-6 md:px-12 backdrop-blur-md border-b border-white/5 bg-black/20">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-white" />
        <span className="text-xl font-bold tracking-tighter text-white">InterviewIQ</span>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <Link href="/coming-soon" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Product</Link>
        <Link href="/#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Features</Link>
        <Link href="/coming-soon" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Intelligence</Link>
        <Link href="/coming-soon" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Pricing</Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden md:block">
          Login
        </Link>
        <Link href="/login">
          <PremiumButton variant="primary" size="sm">
            Get Started
          </PremiumButton>
        </Link>
      </div>
    </nav>
  );
}
