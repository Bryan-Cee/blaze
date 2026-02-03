import { WorkoutSession } from '../types';

export const workoutSessions: WorkoutSession[] = [
  {
    id: 'strength-a',
    dayOfWeek: 1, // Monday
    title: 'Strength A - Upper Push/Pull',
    type: 'strength',
    duration: 45,
    warmup: [
      'Arm circles - 30 seconds each direction',
      'Band pull-aparts - 15 reps',
      'Push-up plus - 10 reps',
      'Cat-cow stretches - 10 reps',
      'Light row or bike - 3 minutes',
    ],
    mainLifts: [
      { exercise: 'Bench Press', sets: 4, reps: '6-8', notes: 'Focus on controlled descent' },
      { exercise: 'Barbell Row', sets: 4, reps: '6-8', notes: 'Keep back flat, pull to lower chest' },
      { exercise: 'Overhead Press', sets: 3, reps: '8-10', notes: 'Brace core throughout' },
      { exercise: 'Pull-ups / Lat Pulldown', sets: 3, reps: '8-10', notes: 'Full range of motion' },
    ],
    accessories: [
      { exercise: 'Dumbbell Incline Press', sets: 3, reps: '10-12' },
      { exercise: 'Face Pulls', sets: 3, reps: '15-20' },
      { exercise: 'Tricep Pushdowns', sets: 3, reps: '12-15' },
      { exercise: 'Bicep Curls', sets: 3, reps: '12-15' },
    ],
    finisher: 'Plank hold - 3 sets x 30 seconds with 15 seconds rest',
  },
  {
    id: 'zone2-cardio',
    dayOfWeek: 2, // Tuesday
    title: 'Zone 2 Cardio + Mobility',
    type: 'cardio',
    duration: 45,
    warmup: [
      'Light walk - 3 minutes',
      'Dynamic leg swings - 10 each leg',
      'Hip circles - 10 each direction',
    ],
    mainLifts: [
      { exercise: 'Zone 2 Cardio (Running/Cycling/Rowing)', sets: 1, reps: '30 min', notes: 'Heart rate 120-140 BPM. Should be able to hold a conversation.' },
    ],
    accessories: [
      { exercise: '90/90 Hip Stretch', sets: 2, reps: '60 sec each side' },
      { exercise: 'Couch Stretch', sets: 2, reps: '60 sec each side' },
      { exercise: 'Thread the Needle', sets: 2, reps: '10 each side' },
      { exercise: 'Cat-Cow', sets: 1, reps: '20 reps' },
      { exercise: 'Pigeon Pose', sets: 2, reps: '60 sec each side' },
    ],
    finisher: 'Foam roll - 5 minutes focusing on tight areas',
  },
  {
    id: 'strength-b',
    dayOfWeek: 3, // Wednesday
    title: 'Strength B - Lower Body + Core',
    type: 'strength',
    duration: 45,
    warmup: [
      'Bodyweight squats - 15 reps',
      'Glute bridges - 15 reps',
      'Walking lunges - 10 each leg',
      'Leg swings - 10 each leg',
      'Light cardio - 3 minutes',
    ],
    mainLifts: [
      { exercise: 'Squat (Barbell/Goblet)', sets: 4, reps: '6-8', notes: 'Depth to parallel or below' },
      { exercise: 'Romanian Deadlift', sets: 4, reps: '8-10', notes: 'Feel the hamstring stretch' },
      { exercise: 'Bulgarian Split Squat', sets: 3, reps: '10 each', notes: 'Control the descent' },
    ],
    accessories: [
      { exercise: 'Leg Press', sets: 3, reps: '12-15' },
      { exercise: 'Leg Curl', sets: 3, reps: '12-15' },
      { exercise: 'Calf Raises', sets: 4, reps: '15-20' },
    ],
    finisher: 'Core circuit: Dead Bug (15 reps) + Bird Dog (10 each side) + Hollow Hold (20 sec) - 3 rounds',
  },
  {
    id: 'hiit-metcon',
    dayOfWeek: 4, // Thursday
    title: 'HIIT / MetCon Intervals',
    type: 'hiit',
    duration: 30,
    warmup: [
      'Jumping jacks - 30 seconds',
      'High knees - 30 seconds',
      'Butt kicks - 30 seconds',
      'Arm circles - 30 seconds',
      'Bodyweight squats - 10 reps',
      'Light jog - 2 minutes',
    ],
    mainLifts: [
      { exercise: 'HIIT Intervals', sets: 10, reps: '40s work / 20s rest', notes: 'Choose: Bike, Row, Run, or Burpees' },
    ],
    accessories: [],
    finisher: 'Cool down walk - 5 minutes, then stretch',
    intervalConfig: {
      rounds: 10,
      workSec: 40,
      restSec: 20,
    },
  },
  {
    id: 'strength-c',
    dayOfWeek: 5, // Friday
    title: 'Strength C - Full Body Volume',
    type: 'strength',
    duration: 45,
    warmup: [
      'Jumping jacks - 30 seconds',
      'Arm circles - 20 each direction',
      'Leg swings - 10 each leg',
      'Bodyweight squats - 10 reps',
      'Push-ups - 10 reps',
      'Light row or bike - 3 minutes',
    ],
    mainLifts: [
      { exercise: 'Deadlift', sets: 4, reps: '5-6', notes: 'Conventional or Sumo. Maintain neutral spine.' },
      { exercise: 'Incline Dumbbell Press', sets: 3, reps: '10-12', notes: 'Control the weight' },
      { exercise: 'Cable Row', sets: 3, reps: '10-12', notes: 'Squeeze shoulder blades' },
    ],
    accessories: [
      { exercise: 'Lunges (Walking or Reverse)', sets: 3, reps: '10 each leg' },
      { exercise: 'Lateral Raises', sets: 3, reps: '12-15' },
      { exercise: 'Hammer Curls', sets: 3, reps: '12-15' },
      { exercise: 'Skull Crushers', sets: 3, reps: '12-15' },
    ],
    finisher: 'Farmer carries - 3 x 40 meters with heavy dumbbells/kettlebells',
  },
  {
    id: 'rest-saturday',
    dayOfWeek: 6, // Saturday
    title: 'Rest Day',
    type: 'rest',
    duration: 0,
    warmup: [],
    mainLifts: [],
    accessories: [],
    finisher: 'Light activity encouraged: walk, stretch, or gentle yoga',
  },
  {
    id: 'rest-sunday',
    dayOfWeek: 7, // Sunday
    title: 'Rest Day',
    type: 'rest',
    duration: 0,
    warmup: [],
    mainLifts: [],
    accessories: [],
    finisher: 'Light activity encouraged: walk, stretch, or gentle yoga. Meal prep day!',
  },
];

export const getWorkoutForDay = (dayOfWeek: number): WorkoutSession | undefined => {
  return workoutSessions.find((session) => session.dayOfWeek === dayOfWeek);
};

export const getWorkoutById = (id: string): WorkoutSession | undefined => {
  return workoutSessions.find((session) => session.id === id);
};
