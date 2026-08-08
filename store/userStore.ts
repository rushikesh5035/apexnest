import { create } from "zustand";

interface UserStore {
  currency: string;
  setCurrency: (value: string) => void;
  needsOnboarding: boolean | null; 
  setNeedsOnboarding: (value: boolean) => void;
}

// setting up a zustand store to store the user's currency and onboarding status
export const useUserStore = create<UserStore>((set) => ({
  currency: "INR",
  setCurrency: (value) => set({ currency: value }),
  needsOnboarding: null,
  setNeedsOnboarding: (value) => set({ needsOnboarding: value }),
}));
