import { create } from 'zustand';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  tier: string;
  avatarUrl: string;
}

interface UserState {
  profile: UserProfile | null;
  isAuthenticated: boolean;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isAuthenticated: false,
  setProfile: (profile) => set({ profile, isAuthenticated: true }),
  clearProfile: () => set({ profile: null, isAuthenticated: false }),
}));
