import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useUserStore } from '../../store';
import { Card } from '../../components/common';
import { colors, spacing, typography } from '../../theme';
import { ReminderType } from '../../types';
import { syncReminders } from '../../services/notificationService';

interface ReminderConfig {
  type: ReminderType;
  title: string;
  description: string;
  icon: string;
}

const reminderConfigs: ReminderConfig[] = [
  {
    type: 'workout',
    title: 'Workout Reminders',
    description: 'Daily at 6:45 AM (Mon-Fri)',
    icon: '💪',
  },
  {
    type: 'hydration',
    title: 'Hydration Reminders',
    description: 'Every 90 min (8 AM - 8 PM)',
    icon: '💧',
  },
  {
    type: 'mealPrep',
    title: 'Meal Prep Reminders',
    description: 'Sunday 5 PM, Wednesday 6 PM',
    icon: '🥗',
  },
  {
    type: 'checkIn',
    title: 'Weekly Check-in',
    description: 'Monday at 7:30 AM',
    icon: '📊',
  },
];

export default function RemindersScreen() {
  const reminders = useUserStore((state) => state.reminders);
  const updateReminder = useUserStore((state) => state.updateReminder);

  const getReminder = (type: ReminderType) => {
    return reminders.find((r) => r.type === type) || { type, enabled: false };
  };

  const toggleReminder = (type: ReminderType) => {
    const current = getReminder(type);
    const updated = { ...current, enabled: !current.enabled };
    updateReminder(updated);

    // Rebuild notification schedule with the toggled value
    const newReminders = reminders.map((r) =>
      r.type === type ? updated : r
    );
    syncReminders(newReminders);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.description}>
        Blaze uses local notifications to keep you on track. Customize which
        reminders you'd like to receive.
      </Text>

      <Card style={styles.card}>
        {reminderConfigs.map((config, index) => {
          const reminder = getReminder(config.type);
          return (
            <View key={config.type}>
              <View style={styles.reminderItem}>
                <View style={styles.reminderLeft}>
                  <Text style={styles.reminderIcon}>{config.icon}</Text>
                  <View style={styles.reminderInfo}>
                    <Text style={styles.reminderTitle}>{config.title}</Text>
                    <Text style={styles.reminderDescription}>
                      {config.description}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={reminder.enabled}
                  onValueChange={() => toggleReminder(config.type)}
                  trackColor={{
                    false: colors.backgroundTertiary,
                    true: colors.primary,
                  }}
                  thumbColor={colors.textPrimary}
                />
              </View>
              {index < reminderConfigs.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          );
        })}
      </Card>

      <Card style={styles.noteCard}>
        <Text style={styles.noteTitle}>How Reminders Work</Text>
        <Text style={styles.noteText}>
          • Workout reminders include today's session details
        </Text>
        <Text style={styles.noteText}>
          • Hydration reminders pause when daily goal is met
        </Text>
        <Text style={styles.noteText}>
          • Check-in prompts you to log weight and take progress photos
        </Text>
        <Text style={styles.noteText}>
          • All notifications are local - no data leaves your device
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  card: {
    padding: 0,
    marginBottom: spacing.lg,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderIcon: {
    fontSize: 24,
    marginRight: spacing.md,
    width: 32,
    textAlign: 'center',
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  reminderDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 56,
  },
  noteCard: {
    backgroundColor: colors.backgroundTertiary,
  },
  noteTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  noteText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
});
