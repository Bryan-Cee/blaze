import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProgressStackParamList } from '../../types';
import { colors } from '../../theme';

import ProgressDashboardScreen from '../../screens/progress/ProgressDashboardScreen';
import WeightHistoryScreen from '../../screens/progress/WeightHistoryScreen';
import MeasurementsScreen from '../../screens/progress/MeasurementsScreen';

const Stack = createNativeStackNavigator<ProgressStackParamList>();

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
    </Stack.Navigator>
  );
}
