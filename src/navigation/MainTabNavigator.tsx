import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../theme';
import { RootTabParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';

// Stack navigators
import HomeStackNavigator from './stacks/HomeStackNavigator';
import TrainingStackNavigator from './stacks/TrainingStackNavigator';
import NutritionStackNavigator from './stacks/NutritionStackNavigator';
import ProgressStackNavigator from './stacks/ProgressStackNavigator';
import SettingsStackNavigator from './stacks/SettingsStackNavigator';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.backgroundSecondary,
          borderTopColor: colors.border,
          height: 85,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={focused ? colors.primary : colors.textSecondary} />
          ),
        }}
      />
      <Tab.Screen
        name="Training"
        component={TrainingStackNavigator}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name={focused ? 'barbell' : 'barbell-outline'} size={size} color={focused ? colors.primary : colors.textSecondary} />
          ),
        }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionStackNavigator}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name={focused ? 'nutrition' : 'nutrition-outline'} size={size} color={focused ? colors.primary : colors.textSecondary} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressStackNavigator}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name={focused ? 'trending-up' : 'trending-up-outline'} size={size} color={focused ? colors.primary : colors.textSecondary} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={focused ? colors.primary : colors.textSecondary} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

