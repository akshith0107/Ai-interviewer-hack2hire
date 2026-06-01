import { create } from 'zustand';

interface ResultState {
  readinessScore: number;
  peerAverage: number;
  confidenceLevel: 'Low' | 'Medium' | 'High';
  hiringRecommendation: string;
  aiSummary: string;
  competencyScores: {
    strategy: number;
    technical: number;
    leadership: number;
    communication: number;
    problemSolving: number;
  };
  strengths: string[];
  weaknesses: string[];
  roadmap: Array<{
    term: string;
    focus: string;
    description: string;
  }>;
}

export const useResultsStore = create<ResultState>(() => ({
  readinessScore: 0,
  peerAverage: 0,
  confidenceLevel: 'Low',
  hiringRecommendation: '',
  aiSummary: '',
  competencyScores: {
    strategy: 0,
    technical: 0,
    leadership: 0,
    communication: 0,
    problemSolving: 0,
  },
  strengths: [],
  weaknesses: [],
  roadmap: []
}));
