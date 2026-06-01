import { create } from 'zustand';

interface AnalyticsState {
  interviewsTaken: number;
  averageScore: number;
  bestScore: number;
  readinessIndex: 'Low' | 'Medium' | 'High';
  readinessPercentage: number;
  performanceTrajectory: Array<{ name: string; score: number }>;
  recentOperations: Array<{
    role: string;
    type: string;
    duration: string;
    score: number;
    timeAgo: string;
  }>;
}

export const useAnalyticsStore = create<AnalyticsState>(() => ({
  interviewsTaken: 0,
  averageScore: 0,
  bestScore: 0,
  readinessIndex: 'Low',
  readinessPercentage: 0,
  performanceTrajectory: [],
  recentOperations: []
}));
