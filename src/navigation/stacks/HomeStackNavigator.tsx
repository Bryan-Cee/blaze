import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList } from '../../types';
import { colors } from '../../theme';

import DashboardScreen from '../../screens/home/DashboardScreen';
import WorkoutDetailScreen from '../../screens/workouts/WorkoutDetailScreen';
import WorkoutTimerScreen from '../../screens/workouts/WorkoutTimerScreen';
import IntervalTimerScreen from '../../screens/workouts/IntervalTimerScreen';

const Stack = createStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
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
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
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
