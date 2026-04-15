import { createContext, useContext, useState, ReactNode } from 'react';

export type Mood = 'rough' | 'low' | 'okay' | 'good' | 'great';
export type Tag = 'work' | 'sleep' | 'food' | 'social' | 'exercise';
export type Intention = 'Energised' | 'Calm' | 'Focused' | 'Happy' | 'Resilient';

export interface CheckIn {
  id: string;
  mood: Mood;
  tags: Tag[];
  time: Date;
}

export interface Settings {
  wakeTime: string;
  sleepTime: string;
  interval: string;
  notificationsEnabled: boolean;
  anchorMoods: string[];
  darkMode: boolean;
}

interface MoodFlowState {
  checkIns: CheckIn[];
  currentIntention: Intention | null;
  settings: Settings;
  streak: number;
  onboardingComplete: boolean;
  addCheckIn: (mood: Mood, tags: Tag[]) => void;
  setIntention: (intention: Intention) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  completeOnboarding: () => void;
}

const defaultSettings: Settings = {
  wakeTime: '7:00 AM',
  sleepTime: '11:00 PM',
  interval: 'every 2h',
  notificationsEnabled: true,
  anchorMoods: ['Happy', 'Calm', 'Focused'],
  darkMode: false,
};

const MoodFlowContext = createContext<MoodFlowState | undefined>(undefined);

export function MoodFlowProvider({ children }: { children: ReactNode }) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [currentIntention, setCurrentIntention] = useState<Intention | null>('Focused');
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [streak, setStreak] = useState(12);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const addCheckIn = (mood: Mood, tags: Tag[]) => {
    const newCheckIn: CheckIn = {
      id: Date.now().toString(),
      mood,
      tags,
      time: new Date(),
    };
    setCheckIns([newCheckIn, ...checkIns]);
  };

  const setIntention = (intention: Intention) => {
    setCurrentIntention(intention);
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const completeOnboarding = () => {
    setOnboardingComplete(true);
  };

  return (
    <MoodFlowContext.Provider
      value={{
        checkIns,
        currentIntention,
        settings,
        streak,
        onboardingComplete,
        addCheckIn,
        setIntention,
        updateSettings,
        completeOnboarding,
      }}
    >
      {children}
    </MoodFlowContext.Provider>
  );
}

export function useMoodFlow() {
  const context = useContext(MoodFlowContext);
  if (context === undefined) {
    throw new Error('useMoodFlow must be used within a MoodFlowProvider');
  }
  return context;
}
