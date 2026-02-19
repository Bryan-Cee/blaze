import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NutritionLog, MealPrepItem, GroceryItem } from '../types';
import * as Crypto from 'expo-crypto';
import { format } from 'date-fns';

interface NutritionState {
  logs: NutritionLog[];
  mealPrepItems: MealPrepItem[];
  groceryItems: GroceryItem[];

  // Nutrition log actions
  logNutrition: (log: Omit<NutritionLog, 'id'>) => void;
  updateNutritionLog: (id: string, updates: Partial<NutritionLog>) => void;
  getTodayLog: () => NutritionLog | undefined;
  getLogForDate: (date: string) => NutritionLog | undefined;

  // Meal prep actions
  toggleMealPrepItem: (id: string) => void;
  resetMealPrepList: () => void;
  setMealPrepItems: (items: MealPrepItem[]) => void;

  // Grocery list actions
  toggleGroceryItem: (id: string) => void;
  resetGroceryList: () => void;
  setGroceryItems: (items: GroceryItem[]) => void;

  reset: () => void;
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      logs: [],
      mealPrepItems: [],
      groceryItems: [],

      logNutrition: (log) =>
        set((state) => ({
          logs: [
            ...state.logs,
            {
              id: Crypto.randomUUID(),
              ...log,
            },
          ],
        })),

      updateNutritionLog: (id, updates) =>
        set((state) => ({
          logs: state.logs.map((log) =>
            log.id === id ? { ...log, ...updates } : log
          ),
        })),

      getTodayLog: () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        return get().logs.find((log) => log.date === today);
      },

      getLogForDate: (date) => {
        return get().logs.find((log) => log.date === date);
      },

      toggleMealPrepItem: (id) =>
        set((state) => ({
          mealPrepItems: state.mealPrepItems.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
          ),
        })),

      resetMealPrepList: () =>
        set((state) => ({
          mealPrepItems: state.mealPrepItems.map((item) => ({
            ...item,
            completed: false,
          })),
        })),

      setMealPrepItems: (items) => set({ mealPrepItems: items }),

      toggleGroceryItem: (id) =>
        set((state) => ({
          groceryItems: state.groceryItems.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        })),

      resetGroceryList: () =>
        set((state) => ({
          groceryItems: state.groceryItems.map((item) => ({
            ...item,
            checked: false,
          })),
        })),

      setGroceryItems: (items) => set({ groceryItems: items }),

      reset: () => set({ logs: [], mealPrepItems: [], groceryItems: [] }),
    }),
    {
      name: 'blaze-nutrition-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
