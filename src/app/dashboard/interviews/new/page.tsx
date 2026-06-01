'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Upload, FileText, Settings, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateInterviewPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleGenerate = () => {
    setIsUploading(true);
    setTimeout(() => {
      router.push('/dashboard/interviews/analysis');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Interview</h1>
        <p className="text-white/60 text-sm">Configure your next AI mock interview session.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <GlassCard className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Upload className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Resume</h3>
            </div>
            <label className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer group block relative">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />
              <FileText className="w-8 h-8 text-white/30 mx-auto mb-3 group-hover:text-white/60 transition-colors" />
              <p className="text-sm font-medium text-white mb-1">
                {fileName ? fileName : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-white/50">PDF, DOCX up to 5MB</p>
            </label>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Difficulty Configuration</h3>
            </div>
            <div className="space-y-3">
              {['Standard', 'Hard', 'Expert (FAANG Level)'].map((level, i) => (
                <label key={level} className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <span className="text-sm font-medium text-white">{level}</span>
                  <input type="radio" name="difficulty" defaultChecked={i === 1} className="accent-white" />
                </label>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-8 h-full flex flex-col">
          <GlassCard className="p-6 flex-1 flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Job Description</h3>
            </div>
            <textarea 
              className="w-full flex-1 min-h-[200px] bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all resize-none"
              placeholder="Paste the target job description here..."
            />
          </GlassCard>

          <PremiumButton 
            variant="primary" 
            size="lg" 
            className="w-full" 
            onClick={handleGenerate}
            isLoading={isUploading}
          >
            {isUploading ? 'Analyzing Data...' : 'Generate Interview'}
            {!isUploading && <ArrowRight className="w-5 h-5 ml-2" />}
          </PremiumButton>
        </div>
      </div>
    </div>
  );
}
