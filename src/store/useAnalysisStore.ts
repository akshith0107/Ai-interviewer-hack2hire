import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PreInterviewAnalysis {
  match_percentage: number;
  strengths: string[];
  weaknesses: string[];
  missing_skills: string[];
  skill_gap_analysis: string;
  recommended_difficulty: string;
  readiness_estimate: string;
  suggested_focus_areas: string[];
}

interface AnalysisState {
  resumeText: string | null;
  jdText: string | null;
  analysisResult: PreInterviewAnalysis | null;
  status: 'idle' | 'processing' | 'completed' | 'error';
  error: string | null;
  
  setResumeText: (text: string) => void;
  setJdText: (text: string) => void;
  setAnalysisResult: (result: PreInterviewAnalysis) => void;
  setStatus: (status: 'idle' | 'processing' | 'completed' | 'error') => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      resumeText: null,
      jdText: null,
      analysisResult: null,
      status: 'idle',
      error: null,
      
      setResumeText: (text) => set({ resumeText: text }),
      setJdText: (text) => set({ jdText: text }),
      setAnalysisResult: (result) => set({ analysisResult: result }),
      setStatus: (status) => set({ status }),
      setError: (error) => set({ error }),
      reset: () => set({
        resumeText: null,
        jdText: null,
        analysisResult: null,
        status: 'idle',
        error: null
      })
    }),
    {
      name: 'analysis-storage', // name of the item in the storage (must be unique)
    }
  )
);
