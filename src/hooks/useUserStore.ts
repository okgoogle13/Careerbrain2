import { create } from 'zustand';

interface UserState {
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
  hasSetJobTarget: boolean;
  setHasSetJobTarget: (value: boolean) => void;
  onboardingPath: 'PROFILE' | 'WORKSPACE' | 'QUICK_APPLY' | null;
  setOnboardingPath: (path: 'PROFILE' | 'WORKSPACE' | 'QUICK_APPLY' | null) => void;
  dismissedChecklist: boolean;
  setDismissedChecklist: (value: boolean) => void;
  pendingJobUrl: string | null;
  setPendingJobUrl: (url: string | null) => void;
  isGovernmentJob: boolean;
  setIsGovernmentJob: (value: boolean) => void;
  hasGeneratedDocument: boolean;
  setHasGeneratedDocument: (value: boolean) => void;
}

export const useUserStore = create<UserState>()(
  (set) => ({
    hasCompletedOnboarding: false,
    setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
    hasSetJobTarget: false,
    setHasSetJobTarget: (value) => set({ hasSetJobTarget: value }),
    onboardingPath: null,
    setOnboardingPath: (path) => set({ onboardingPath: path }),
    dismissedChecklist: false,
    setDismissedChecklist: (value) => set({ dismissedChecklist: value }),
    pendingJobUrl: null,
    setPendingJobUrl: (url) => set({ pendingJobUrl: url }),
    isGovernmentJob: false,
    setIsGovernmentJob: (value) => set({ isGovernmentJob: value }),
    hasGeneratedDocument: false,
    setHasGeneratedDocument: (value) => set({ hasGeneratedDocument: value }),
  })
);
