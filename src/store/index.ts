import { create } from 'zustand';

interface OnboardingState {
  wakeTime: string;
  sleepTime: string;
  checkInIntervalHours: number;
  anchorMoods: string[];
  setSchedule: (wake: string, sleep: string, interval: number) => void;
  setAnchorMoods: (moods: string[]) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  wakeTime: '07:00',
  sleepTime: '23:00',
  checkInIntervalHours: 2,
  anchorMoods: [],
  setSchedule: (wakeTime, sleepTime, checkInIntervalHours) => set({ wakeTime, sleepTime, checkInIntervalHours }),
  setAnchorMoods: (anchorMoods) => set({ anchorMoods }),
}));
