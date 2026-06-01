import { create } from 'zustand';

interface InterviewSession {
  id: string;
  role: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  status: 'idle' | 'in-progress' | 'completed';
  currentQuestionIndex: number;
  totalQuestions: number;
  timeRemaining: number; // in seconds
  questions: Array<{
    id: string;
    text: string;
    focus: string;
  }>;
}

interface SessionState {
  session: InterviewSession | null;
  setSession: (session: InterviewSession) => void;
  updateStatus: (status: InterviewSession['status']) => void;
  nextQuestion: () => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  updateStatus: (status) => set((state) => ({ 
    session: state.session ? { ...state.session, status } : null 
  })),
  nextQuestion: () => set((state) => ({
    session: state.session ? {
      ...state.session,
      currentQuestionIndex: Math.min(state.session.currentQuestionIndex + 1, state.session.totalQuestions - 1)
    } : null
  })),
  clearSession: () => set({ session: null }),
}));
