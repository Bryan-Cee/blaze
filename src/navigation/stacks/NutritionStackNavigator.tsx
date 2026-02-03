import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../../theme';

import NutritionDashboardScreen from '../../screens/nutrition/NutritionDashboardScreen';
import MealPlanScreen from '../../screens/nutrition/MealPlanScreen';
import GroceryListScreen from '../../screens/nutrition/GroceryListScreen';
import HydrationScreen from '../../screens/hydration/HydrationScreen';

type NutritionStackParamList = {
  NutritionDashboard: undefined;
  MealPlan: undefined;
  GroceryList: undefined;
  Hydration: undefined;
};

const Stack = createNativeStackNavigator<NutritionStackParamList>();

export default function NutritionStackNavigator() {
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
        name="NutritionDashboard"
        component={NutritionDashboardScreen}
        options={{ title: 'Nutrition' }}
      />
      <Stack.Screen
        name="MealPlan"
        component={MealPlanScreen}
        options={{ title: 'Meal Plan' }}
      />
      <Stack.Screen
        name="GroceryList"
        component={GroceryListScreen}
        options={{ title: 'Grocery List' }}
      />
      <Stack.Screen
        name="Hydration"
        component={HydrationScreen}
        options={{ title: 'Hydration & Recovery' }}
      />
    </Stack.Navigator>
  );
}
