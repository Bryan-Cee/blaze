import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProgressStackParamList } from '../../types';
import { colors } from '../../theme';

import ProgressDashboardScreen from '../../screens/progress/ProgressDashboardScreen';
import WeightHistoryScreen from '../../screens/progress/WeightHistoryScreen';
import MeasurementsScreen from '../../screens/progress/MeasurementsScreen';
import ProgressPhotosScreen from '../../screens/progress/ProgressPhotosScreen';

const Stack = createStackNavigator<ProgressStackParamList>();

export default function ProgressStackNavigator() {
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
        name="ProgressDashboard"
        component={ProgressDashboardScreen}
        options={{ title: 'Progress' }}
      />
      <Stack.Screen
        name="WeightHistory"
        component={WeightHistoryScreen}
        options={{ title: 'Weight History' }}
      />
      <Stack.Screen
        name="Measurements"
        component={MeasurementsScreen}
        options={{ title: 'Body Measurements' }}
      />
      <Stack.Screen
        name="ProgressPhotos"
        component={ProgressPhotosScreen}
        options={{ title: 'Progress Photos' }}
      />
    </Stack.Navigator>
  );
}
