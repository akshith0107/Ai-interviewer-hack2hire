import { create } from 'zustand';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  target_role: string | null;
  phone_number?: string | null;
  profile_image_url?: string | null;
  college?: string | null;
  degree?: string | null;
  graduation_year?: number | null;
  experience_level?: string | null;
  bio?: string | null;
  created_at?: string | null;
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
