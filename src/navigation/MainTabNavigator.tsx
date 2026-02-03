import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { RootTabParamList } from '../types';

// Stack navigators
import HomeStackNavigator from './stacks/HomeStackNavigator';
import TrainingStackNavigator from './stacks/TrainingStackNavigator';
import NutritionStackNavigator from './stacks/NutritionStackNavigator';
import ProgressStackNavigator from './stacks/ProgressStackNavigator';
import SettingsStackNavigator from './stacks/SettingsStackNavigator';

// Simple icon components
const TabIcon = ({ focused, type }: { focused: boolean; type: string }) => {
  const iconColor = focused ? colors.primary : colors.textSecondary;

  const getIconPath = () => {
    switch (type) {
      case 'home':
        return (
          <View style={[styles.iconBox, { borderColor: iconColor }]}>
            <View style={[styles.homeRoof, { borderBottomColor: iconColor }]} />
          </View>
        );
      case 'training':
        return (
          <View style={styles.dumbbellContainer}>
            <View style={[styles.dumbbellWeight, { backgroundColor: iconColor }]} />
            <View style={[styles.dumbbellBar, { backgroundColor: iconColor }]} />
            <View style={[styles.dumbbellWeight, { backgroundColor: iconColor }]} />
          </View>
        );
      case 'nutrition':
        return (
          <View style={[styles.iconCircle, { borderColor: iconColor }]}>
            <View style={[styles.leafStem, { backgroundColor: iconColor }]} />
          </View>
        );
      case 'progress':
        return (
          <View style={styles.chartContainer}>
            <View style={[styles.chartBar, { height: 8, backgroundColor: iconColor }]} />
            <View style={[styles.chartBar, { height: 14, backgroundColor: iconColor }]} />
            <View style={[styles.chartBar, { height: 20, backgroundColor: iconColor }]} />
          </View>
        );
      case 'settings':
        return (
          <View style={[styles.gearOuter, { borderColor: iconColor }]}>
            <View style={[styles.gearInner, { backgroundColor: iconColor }]} />
          </View>
        );
      default:
        return <View style={[styles.defaultIcon, { backgroundColor: iconColor }]} />;
    }
  };

  return <View style={styles.iconContainer}>{getIconPath()}</View>;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.backgroundSecondary,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
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
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} type="home" />,
        }}
      />
      <Tab.Screen
        name="Training"
        component={TrainingStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} type="training" />,
        }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} type="nutrition" />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} type="progress" />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} type="settings" />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 18,
    height: 14,
    borderWidth: 2,
    borderRadius: 2,
  },
  homeRoof: {
    position: 'absolute',
    top: -8,
    left: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  dumbbellContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dumbbellWeight: {
    width: 6,
    height: 16,
    borderRadius: 2,
  },
  dumbbellBar: {
    width: 10,
    height: 4,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafStem: {
    width: 2,
    height: 10,
    borderRadius: 1,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  chartBar: {
    width: 5,
    borderRadius: 1,
  },
  gearOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  defaultIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
});
