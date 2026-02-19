import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useUserStore,
  useWorkoutStore,
  useHydrationStore,
  useNutritionStore,
  useProgressStore,
} from '../../store';
import { Card } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { syncReminders } from '../../services/notificationService';
type SettingsStackParamList = {
  SettingsList: undefined;
  Profile: undefined;
  Reminders: undefined;
  ExportData: undefined;
  About: undefined;
  KnowledgeBase: undefined;
};

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList>;

interface SettingsItem {
  id: string;
  label: string;
  icon: string;
  screen?: keyof SettingsStackParamList;
  action?: () => void;
  value?: string;
  destructive?: boolean;
}

export default function SettingsListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const profile = useUserStore((state) => state.profile);
  const resetProfile = useUserStore((state) => state.resetProfile);
  const resetWorkouts = useWorkoutStore((state) => state.reset);
  const resetHydration = useHydrationStore((state) => state.reset);
  const resetNutrition = useNutritionStore((state) => state.reset);
  const resetProgress = useProgressStore((state) => state.reset);

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your progress, logs, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetWorkouts();
            resetHydration();
            resetNutrition();
            resetProgress();
            syncReminders([]);
            resetProfile();
          },
        },
      ]
    );
  };

  const sections: { title: string; items: SettingsItem[] }[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          label: 'Profile & Goals',
          icon: '👤',
          screen: 'Profile',
          value: `${profile?.startWeightKg || 0} → ${profile?.goalWeightKg || 0} kg`,
        },
        {
          id: 'reminders',
          label: 'Reminders',
          icon: '🔔',
          screen: 'Reminders',
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          id: 'export',
          label: 'Export Data',
          icon: '📤',
          screen: 'ExportData',
        },
      ],
    },
    {
      title: 'Resources',
      items: [
        {
          id: 'knowledge',
          label: 'Knowledge Base',
          icon: '📚',
          screen: 'KnowledgeBase',
        },
        {
          id: 'about',
          label: 'About Blaze',
          icon: '🔥',
          screen: 'About',
        },
      ],
    },
    {
      title: 'Danger Zone',
      items: [
        {
          id: 'reset',
          label: 'Reset All Data',
          icon: '⚠️',
          action: handleReset,
          destructive: true,
        },
      ],
    },
  ];

  const renderItem = (item: SettingsItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.item}
      onPress={() => {
        if (item.action) {
          item.action();
        } else if (item.screen) {
          navigation.navigate(item.screen);
        }
      }}
    >
      <View style={styles.itemLeft}>
        <Text style={styles.itemIcon}>{item.icon}</Text>
        <Text
          style={[
            styles.itemLabel,
            item.destructive && styles.itemLabelDestructive,
          ]}
        >
          {item.label}
        </Text>
      </View>
      <View style={styles.itemRight}>
        {item.value && <Text style={styles.itemValue}>{item.value}</Text>}
        {!item.destructive && <Text style={styles.chevron}>›</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Summary Card */}
      <Card style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🔥</Text>
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>Blaze</Text>
            <Text style={styles.summarySubtitle}>
              8-Week Cut Plan • Week {getCurrentWeek(profile?.startDate)}
            </Text>
          </View>
        </View>
        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>
              {profile?.calorieTarget || 0}
            </Text>
            <Text style={styles.summaryStatLabel}>kcal</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>
              {profile?.proteinTarget || 0}g
            </Text>
            <Text style={styles.summaryStatLabel}>protein</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>
              {((profile?.hydrationTargetMl || 0) / 1000).toFixed(1)}L
            </Text>
            <Text style={styles.summaryStatLabel}>water</Text>
          </View>
        </View>
      </Card>

      {/* Settings Sections */}
      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Card style={styles.sectionCard}>
            {section.items.map((item, index) => (
              <View key={item.id}>
                {renderItem(item)}
                {index < section.items.length - 1 && (
                  <View style={styles.itemDivider} />
                )}
              </View>
            ))}
          </Card>
        </View>
      ))}

      {/* App Info */}
      <Text style={styles.version}>Blaze v1.0.0</Text>
    </ScrollView>
  );
}

function getCurrentWeek(startDate?: string): number {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(Math.ceil(diffDays / 7), 8);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 28,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  summarySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatValue: {
    ...typography.h4,
    color: colors.primary,
  },
  summaryStatLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  sectionCard: {
    padding: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 28,
    textAlign: 'center',
  },
  itemLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  itemLabelDestructive: {
    color: colors.error,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  chevron: {
    ...typography.h3,
    color: colors.textTertiary,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 56,
  },
  version: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
