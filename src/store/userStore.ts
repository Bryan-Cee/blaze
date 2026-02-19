import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, ReminderSetting } from '../types';
import * as Crypto from 'expo-crypto';

interface UserState {
  profile: UserProfile | null;
  reminders: ReminderSetting[];
  _hasHydrated: boolean;

  // Actions
  setProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: (data: Omit<UserProfile, 'id' | 'onboardingCompleted'>) => void;
  updateReminder: (reminder: ReminderSetting) => void;
  resetProfile: () => void;
  setHasHydrated: (state: boolean) => void;
}

const defaultReminders: ReminderSetting[] = [
  { type: 'workout', enabled: true, time: '06:45', frequency: 'daily' },
  { type: 'hydration', enabled: true, frequency: 'daily' },
  { type: 'mealPrep', enabled: true, time: '17:00', frequency: 'weekly' },
  { type: 'checkIn', enabled: true, time: '07:30', frequency: 'weekly' },
];

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      reminders: defaultReminders,
      _hasHydrated: false,

      setProfile: (profileData) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...profileData }
            : null,
        })),

      completeOnboarding: (data) =>
        set({
          profile: {
            id: Crypto.randomUUID(),
            ...data,
            onboardingCompleted: true,
          },
        }),

      updateReminder: (reminder) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.type === reminder.type ? reminder : r
          ),
        })),

      resetProfile: () =>
        set({
          profile: null,
          reminders: defaultReminders,
        }),

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: 'blaze-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        profile: state.profile,
        reminders: state.reminders,
      }),
    }
  )
);
