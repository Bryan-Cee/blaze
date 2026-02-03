import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format, addDays, startOfWeek, getDay } from 'date-fns';
import { workoutSessions } from '../../data';
import { useWorkoutStore } from '../../store';
import { Card } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { TrainingStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<TrainingStackParamList>;

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WorkoutListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const workoutLogs = useWorkoutStore((state) => state.logs);
  const today = new Date();
  const currentDayOfWeek = getDay(today) === 0 ? 7 : getDay(today);

  // Get start of current week (Monday)
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });

  const getWorkoutForDayOfWeek = (dow: number) => {
    return workoutSessions.find((w) => w.dayOfWeek === dow);
  };

  const getDateForDayOfWeek = (dow: number) => {
    return format(addDays(weekStart, dow - 1), 'yyyy-MM-dd');
  };

  const isWorkoutCompleted = (sessionId: string, date: string) => {
    return workoutLogs.some(
      (log) => log.sessionId === sessionId && log.date === date && log.completed
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>This Week</Text>
      <Text style={styles.weekRange}>
        {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
      </Text>

      <View style={styles.weekGrid}>
        {DAYS.map((day, index) => {
          const dayOfWeek = index + 1;
          const workout = getWorkoutForDayOfWeek(dayOfWeek);
          const date = getDateForDayOfWeek(dayOfWeek);
          const isToday = dayOfWeek === currentDayOfWeek;
          const isPast = dayOfWeek < currentDayOfWeek;
          const isCompleted = workout
            ? isWorkoutCompleted(workout.id, date)
            : false;
          const isRest = workout?.type === 'rest';

          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayCard,
                isToday && styles.dayCardToday,
                isPast && !isCompleted && !isRest && styles.dayCardMissed,
              ]}
              onPress={() => {
                if (workout && !isRest) {
                  navigation.navigate('WorkoutDetail', {
                    sessionId: workout.id,
                    date,
                  });
                }
              }}
              disabled={isRest}
            >
              <Text style={[styles.dayName, isToday && styles.dayNameToday]}>
                {day}
              </Text>
              <Text style={styles.dayDate}>
                {format(addDays(weekStart, index), 'd')}
              </Text>
              {isCompleted && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
              {isRest && <Text style={styles.restLabel}>Rest</Text>}
              {!isRest && !isCompleted && (
                <View
                  style={[
                    styles.workoutIndicator,
                    { backgroundColor: getWorkoutColor(workout?.type) },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Weekly Schedule</Text>

      {workoutSessions.map((workout) => {
        const date = getDateForDayOfWeek(workout.dayOfWeek);
        const isCompleted = isWorkoutCompleted(workout.id, date);
        const isRest = workout.type === 'rest';

        return (
          <Card
            key={workout.id}
            style={isRest ? [styles.workoutCard, styles.restCard] : styles.workoutCard}
          >
            <TouchableOpacity
              style={styles.workoutCardContent}
              onPress={() => {
                if (!isRest) {
                  navigation.navigate('WorkoutDetail', {
                    sessionId: workout.id,
                    date,
                  });
                }
              }}
              disabled={isRest}
            >
              <View style={styles.workoutLeft}>
                <View
                  style={[
                    styles.dayBadge,
                    { backgroundColor: getWorkoutColor(workout.type) },
                  ]}
                >
                  <Text style={styles.dayBadgeText}>
                    {DAYS[workout.dayOfWeek - 1]}
                  </Text>
                </View>
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutTitle}>{workout.title}</Text>
                  {!isRest && (
                    <Text style={styles.workoutMeta}>
                      {workout.duration} min • {workout.mainLifts.length} exercises
                    </Text>
                  )}
                  {isRest && (
                    <Text style={styles.workoutMeta}>{workout.finisher}</Text>
                  )}
                </View>
              </View>
              {isCompleted && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✓</Text>
                </View>
              )}
              {!isRest && !isCompleted && (
                <Text style={styles.chevron}>›</Text>
              )}
            </TouchableOpacity>
          </Card>
        );
      })}
    </ScrollView>
  );
}

function getWorkoutColor(type?: string): string {
  switch (type) {
    case 'strength':
      return colors.primary;
    case 'cardio':
      return colors.secondary;
    case 'hiit':
      return colors.warning;
    case 'rest':
      return colors.backgroundTertiary;
    default:
      return colors.textTertiary;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  weekRange: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  weekGrid: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  dayCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
  },
  dayCardToday: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  dayCardMissed: {
    opacity: 0.5,
  },
  dayName: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dayNameToday: {
    color: colors.primary,
  },
  dayDate: {
    ...typography.h4,
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  restLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  workoutIndicator: {
    width: 20,
    height: 4,
    borderRadius: 2,
  },
  workoutCard: {
    marginBottom: spacing.sm,
    padding: 0,
  },
  restCard: {
    opacity: 0.7,
  },
  workoutCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  workoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dayBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  dayBadgeText: {
    ...typography.buttonSmall,
    color: colors.textPrimary,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  workoutMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  chevron: {
    ...typography.h2,
    color: colors.textTertiary,
  },
});
