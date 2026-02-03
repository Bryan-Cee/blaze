// User Profile
export interface UserProfile {
  id: string;
  startDate: string; // ISO date
  startWeightKg: number;
  goalWeightKg: number;
  calorieTarget: number;
  proteinTarget: number;
  fatTarget: number;
  carbTarget: number;
  hydrationTargetMl: number;
  onboardingCompleted: boolean;
}

// Workout Types
export interface Exercise {
  exercise: string;
  sets: number;
  reps: string;
  notes?: string;
}

export interface IntervalConfig {
  rounds: number;
  workSec: number;
  restSec: number;
}

export interface WorkoutSession {
  id: string;
  dayOfWeek: number; // 1=Mon ... 7=Sun
  title: string;
  type: 'strength' | 'cardio' | 'hiit' | 'rest';
  warmup: string[];
  mainLifts: Exercise[];
  accessories: Exercise[];
  finisher: string;
  duration: number; // minutes
  intervalConfig?: IntervalConfig;
}

export interface WorkoutLog {
  id: string;
  sessionId: string;
  date: string; // ISO date
  completed: boolean;
  startTime?: string;
  endTime?: string;
  notes?: string;
  rpe?: number; // 1-10
  metrics?: Record<string, number>; // weight used, etc.
}

// Hydration Types
export interface HydrationEntry {
  id: string;
  date: string;
  quantityMl: number;
  timestamp: string;
}

export interface HydrationLog {
  date: string;
  totalMl: number;
  entries: HydrationEntry[];
}

// Nutrition Types
export interface NutritionLog {
  id: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
}

export interface MealPrepItem {
  id: string;
  name: string;
  completed: boolean;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

// Weight & Progress Types
export interface WeightLog {
  id: string;
  date: string;
  weightKg: number;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  waistCm?: number;
  hipCm?: number;
  chestCm?: number;
  notes?: string;
}

export interface BiofeedbackLog {
  id: string;
  date: string;
  energy: number; // 1-5
  hunger: number; // 1-5
  sleepQuality: number; // 1-5
  sleepHours?: number;
}

// Recovery Types
export interface RecoveryChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

// Reminder Types
export type ReminderType = 'workout' | 'hydration' | 'mealPrep' | 'checkIn';

export interface ReminderSetting {
  type: ReminderType;
  enabled: boolean;
  time?: string; // e.g. "07:00"
  frequency?: 'daily' | 'weekly';
}

// Knowledge Base Types
export interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  category: 'training' | 'nutrition' | 'recovery' | 'general';
}

export interface TipEntry {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface FAQEntry {
  id: string;
  question: string;
  answer: string;
}

// Navigation Types
export type RootTabParamList = {
  Home: undefined;
  Training: undefined;
  Nutrition: undefined;
  Progress: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  Dashboard: undefined;
  WorkoutDetail: { sessionId: string; date: string };
};

export type TrainingStackParamList = {
  WorkoutList: undefined;
  WorkoutDetail: { sessionId: string; date: string };
  WorkoutTimer: { sessionId: string };
  IntervalTimer: { config: IntervalConfig };
};

export type NutritionStackParamList = {
  NutritionDashboard: undefined;
  MealPlan: undefined;
  GroceryList: undefined;
};

export type ProgressStackParamList = {
  ProgressDashboard: undefined;
  WeightHistory: undefined;
  Measurements: undefined;
};

export type SettingsStackParamList = {
  SettingsList: undefined;
  Profile: undefined;
  Reminders: undefined;
  ExportData: undefined;
  About: undefined;
};
