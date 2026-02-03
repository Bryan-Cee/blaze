import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutLog } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format, startOfWeek, endOfWeek, parseISO } from 'date-fns';

interface WorkoutState {
  logs: WorkoutLog[];

  // Actions
  logWorkout: (log: Omit<WorkoutLog, 'id'>) => void;
  updateLog: (id: string, updates: Partial<WorkoutLog>) => void;
  deleteLog: (id: string) => void;
  getLogByDate: (date: string) => WorkoutLog | undefined;
  getLogsForWeek: (date: Date) => WorkoutLog[];
  getCompletedCount: () => number;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      logs: [],

      logWorkout: (log) =>
        set((state) => ({
          logs: [
            ...state.logs,
            {
              id: uuidv4(),
              ...log,
            },
          ],
        })),

      updateLog: (id, updates) =>
        set((state) => ({
          logs: state.logs.map((log) =>
            log.id === id ? { ...log, ...updates } : log
          ),
        })),

      deleteLog: (id) =>
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== id),
        })),

      getLogByDate: (date) => {
        return get().logs.find((log) => log.date === date);
      },

      getLogsForWeek: (date) => {
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
        return get().logs.filter((log) => {
          const logDate = parseISO(log.date);
          return logDate >= weekStart && logDate <= weekEnd;
        });
      },

      getCompletedCount: () => {
        return get().logs.filter((log) => log.completed).length;
      },
    }),
    {
      name: 'blaze-workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
