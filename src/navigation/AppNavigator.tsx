import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useUserStore } from '../store';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import MainTabNavigator from './MainTabNavigator';
import { colors } from '../theme';

const Stack = createStackNavigator();

const BlazeTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.primary,
  },
};

export default function AppNavigator() {
  const profile = useUserStore((state) => state.profile);
  const isOnboarded = profile?.onboardingCompleted ?? false;

  return (
    <NavigationContainer theme={BlazeTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
