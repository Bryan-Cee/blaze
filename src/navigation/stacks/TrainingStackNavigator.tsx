import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TrainingStackParamList } from '../../types';
import { colors } from '../../theme';

import WorkoutListScreen from '../../screens/workouts/WorkoutListScreen';
import WorkoutDetailScreen from '../../screens/workouts/WorkoutDetailScreen';
import WorkoutTimerScreen from '../../screens/workouts/WorkoutTimerScreen';
import IntervalTimerScreen from '../../screens/workouts/IntervalTimerScreen';

const Stack = createStackNavigator<TrainingStackParamList>();

export default function TrainingStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundSecondary,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="WorkoutList"
        component={WorkoutListScreen}
        options={{ title: 'Training' }}
      />
      <Stack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{ title: 'Workout' }}
      />
      <Stack.Screen
        name="WorkoutTimer"
        component={WorkoutTimerScreen}
        options={{ title: 'Workout Timer', headerShown: false }}
      />
      <Stack.Screen
        name="IntervalTimer"
        component={IntervalTimerScreen}
        options={{ title: 'Interval Timer', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
