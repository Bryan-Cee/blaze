import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../../theme';

import SettingsListScreen from '../../screens/settings/SettingsListScreen';
import ProfileScreen from '../../screens/settings/ProfileScreen';
import RemindersScreen from '../../screens/settings/RemindersScreen';
import ExportDataScreen from '../../screens/settings/ExportDataScreen';
import AboutScreen from '../../screens/settings/AboutScreen';
import KnowledgeBaseScreen from '../../screens/knowledge/KnowledgeBaseScreen';

type SettingsStackParamList = {
  SettingsList: undefined;
  Profile: undefined;
  Reminders: undefined;
  ExportData: undefined;
  About: undefined;
  KnowledgeBase: undefined;
};

const Stack = createStackNavigator<SettingsStackParamList>();

export default function SettingsStackNavigator() {
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
        name="SettingsList"
        component={SettingsListScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{ title: 'Reminders' }}
      />
      <Stack.Screen
        name="ExportData"
        component={ExportDataScreen}
        options={{ title: 'Export Data' }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'About Blaze' }}
      />
      <Stack.Screen
        name="KnowledgeBase"
        component={KnowledgeBaseScreen}
        options={{ title: 'Knowledge Base' }}
      />
    </Stack.Navigator>
  );
}
