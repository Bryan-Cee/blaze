import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HydrationEntry } from '../types';
import * as Crypto from 'expo-crypto';
import { format, parseISO, differenceInDays } from 'date-fns';

interface HydrationState {
  entries: HydrationEntry[];

  // Actions
  addEntry: (quantityMl: number, date?: string) => void;
  removeEntry: (id: string) => void;
  getTodayTotal: () => number;
  getTotalForDate: (date: string) => number;
  getStreak: (targetMl: number) => number;
  getHistory: (days: number) => { date: string; totalMl: number }[];
  reset: () => void;
}

export const useHydrationStore = create<HydrationState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (quantityMl, date) => {
        const now = new Date();
        const entryDate = date || format(now, 'yyyy-MM-dd');
        set((state) => ({
          entries: [
            ...state.entries,
            {
              id: Crypto.randomUUID(),
              date: entryDate,
              quantityMl,
              timestamp: now.toISOString(),
            },
          ],
        }));
      },

      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),

      getTodayTotal: () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        return get()
          .entries.filter((entry) => entry.date === today)
          .reduce((sum, entry) => sum + entry.quantityMl, 0);
      },

      getTotalForDate: (date) => {
        return get()
          .entries.filter((entry) => entry.date === date)
          .reduce((sum, entry) => sum + entry.quantityMl, 0);
      },

      getStreak: (targetMl) => {
        const entries = get().entries;
        const today = new Date();
        let streak = 0;

        // Group entries by date and sum
        const dailyTotals = new Map<string, number>();
        entries.forEach((entry) => {
          const current = dailyTotals.get(entry.date) || 0;
          dailyTotals.set(entry.date, current + entry.quantityMl);
        });

        // Check consecutive days backwards from yesterday
        for (let i = 1; i <= 365; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);
          const dateStr = format(checkDate, 'yyyy-MM-dd');
          const total = dailyTotals.get(dateStr) || 0;

          if (total >= targetMl) {
            streak++;
          } else {
            break;
          }
        }

        // Check if today's goal is met
        const todayStr = format(today, 'yyyy-MM-dd');
        const todayTotal = dailyTotals.get(todayStr) || 0;
        if (todayTotal >= targetMl) {
          streak++;
        }

        return streak;
      },

      getHistory: (days) => {
        const entries = get().entries;
        const result: { date: string; totalMl: number }[] = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);
          const dateStr = format(checkDate, 'yyyy-MM-dd');
          const total = entries
            .filter((entry) => entry.date === dateStr)
            .reduce((sum, entry) => sum + entry.quantityMl, 0);
          result.push({ date: dateStr, totalMl: total });
        }

        return result;
      },

      reset: () => set({ entries: [] }),
    }),
    {
      name: 'blaze-hydration-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
