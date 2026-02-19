import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeightLog, BodyMeasurement, BiofeedbackLog, ProgressPhoto } from '../types';
import * as Crypto from 'expo-crypto';
import { format, parseISO, differenceInWeeks } from 'date-fns';

interface ProgressState {
  weightLogs: WeightLog[];
  measurements: BodyMeasurement[];
  biofeedbackLogs: BiofeedbackLog[];
  progressPhotos: ProgressPhoto[];

  // Photo actions
  addProgressPhoto: (uri: string, note?: string, date?: string) => void;
  deleteProgressPhoto: (id: string) => void;

  // Weight actions
  logWeight: (weightKg: number, date?: string) => void;
  deleteWeightLog: (id: string) => void;
  getLatestWeight: () => number | null;
  getWeightHistory: () => WeightLog[];
  getExpectedTrajectory: (startWeight: number, goalWeight: number, weeks: number) => { week: number; weight: number }[];

  // Measurement actions
  logMeasurement: (measurement: Omit<BodyMeasurement, 'id'>) => void;
  deleteMeasurement: (id: string) => void;
  getMeasurementHistory: () => BodyMeasurement[];

  // Biofeedback actions
  logBiofeedback: (log: Omit<BiofeedbackLog, 'id'>) => void;
  getTodayBiofeedback: () => BiofeedbackLog | undefined;
  getBiofeedbackHistory: (days: number) => BiofeedbackLog[];
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      weightLogs: [],
      measurements: [],
      biofeedbackLogs: [],
      progressPhotos: [],

      addProgressPhoto: (uri, note, date) => {
        const photoDate = date || format(new Date(), 'yyyy-MM-dd');
        set((state) => ({
          progressPhotos: [
            { id: Crypto.randomUUID(), date: photoDate, uri, note },
            ...state.progressPhotos,
          ],
        }));
      },

      deleteProgressPhoto: (id) =>
        set((state) => ({
          progressPhotos: state.progressPhotos.filter((p) => p.id !== id),
        })),

      logWeight: (weightKg, date) => {
        const logDate = date || format(new Date(), 'yyyy-MM-dd');
        // Check if we already have a log for this date
        const existing = get().weightLogs.find((log) => log.date === logDate);
        if (existing) {
          // Update existing
          set((state) => ({
            weightLogs: state.weightLogs.map((log) =>
              log.date === logDate ? { ...log, weightKg } : log
            ),
          }));
        } else {
          // Add new
          set((state) => ({
            weightLogs: [
              ...state.weightLogs,
              { id: Crypto.randomUUID(), date: logDate, weightKg },
            ].sort((a, b) => a.date.localeCompare(b.date)),
          }));
        }
      },

      deleteWeightLog: (id) =>
        set((state) => ({
          weightLogs: state.weightLogs.filter((log) => log.id !== id),
        })),

      getLatestWeight: () => {
        const logs = get().weightLogs;
        if (logs.length === 0) return null;
        const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
        return sorted[0].weightKg;
      },

      getWeightHistory: () => {
        return [...get().weightLogs].sort((a, b) => a.date.localeCompare(b.date));
      },

      getExpectedTrajectory: (startWeight, goalWeight, weeks) => {
        const weightLossPerWeek = (startWeight - goalWeight) / weeks;
        const trajectory: { week: number; weight: number }[] = [];
        for (let i = 0; i <= weeks; i++) {
          trajectory.push({
            week: i,
            weight: Math.round((startWeight - weightLossPerWeek * i) * 10) / 10,
          });
        }
        return trajectory;
      },

      logMeasurement: (measurement) =>
        set((state) => ({
          measurements: [
            ...state.measurements,
            { id: Crypto.randomUUID(), ...measurement },
          ].sort((a, b) => a.date.localeCompare(b.date)),
        })),

      deleteMeasurement: (id) =>
        set((state) => ({
          measurements: state.measurements.filter((m) => m.id !== id),
        })),

      getMeasurementHistory: () => {
        return [...get().measurements].sort((a, b) => a.date.localeCompare(b.date));
      },

      logBiofeedback: (log) => {
        const logDate = log.date || format(new Date(), 'yyyy-MM-dd');
        // Check if we already have a log for this date
        const existing = get().biofeedbackLogs.find((l) => l.date === logDate);
        if (existing) {
          set((state) => ({
            biofeedbackLogs: state.biofeedbackLogs.map((l) =>
              l.date === logDate ? { ...l, ...log, id: l.id } : l
            ),
          }));
        } else {
          set((state) => ({
            biofeedbackLogs: [
              ...state.biofeedbackLogs,
              { id: Crypto.randomUUID(), ...log, date: logDate },
            ],
          }));
        }
      },

      getTodayBiofeedback: () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        return get().biofeedbackLogs.find((log) => log.date === today);
      },

      getBiofeedbackHistory: (days) => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - days);
        const startStr = format(startDate, 'yyyy-MM-dd');
        return get().biofeedbackLogs.filter((log) => log.date >= startStr);
      },
    }),
    {
      name: 'blaze-progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
