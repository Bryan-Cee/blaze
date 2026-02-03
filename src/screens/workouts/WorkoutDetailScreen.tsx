import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getWorkoutById } from '../../data';
import { useWorkoutStore } from '../../store';
import { Card, Button, Input, Slider } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { TrainingStackParamList } from '../../types';

type RouteProps = RouteProp<TrainingStackParamList, 'WorkoutDetail'>;
type NavigationProp = NativeStackNavigationProp<TrainingStackParamList>;

type TabType = 'warmup' | 'main' | 'accessory' | 'finisher';

export default function WorkoutDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { sessionId, date } = route.params;

  const workout = getWorkoutById(sessionId);
  const workoutLogs = useWorkoutStore((state) => state.logs);
  const logWorkout = useWorkoutStore((state) => state.logWorkout);
  const updateLog = useWorkoutStore((state) => state.updateLog);

  const existingLog = workoutLogs.find(
    (log) => log.sessionId === sessionId && log.date === date
  );

  const [activeTab, setActiveTab] = useState<TabType>('warmup');
  const [notes, setNotes] = useState(existingLog?.notes || '');
  const [rpe, setRpe] = useState(existingLog?.rpe || 7);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Workout not found</Text>
      </View>
    );
  }

  const tabs: { key: TabType; label: string }[] = [
    { key: 'warmup', label: 'Warm-up' },
    { key: 'main', label: 'Main' },
    { key: 'accessory', label: 'Accessory' },
    { key: 'finisher', label: 'Finisher' },
  ];

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const handleComplete = () => {
    if (existingLog) {
      updateLog(existingLog.id, {
        completed: true,
        notes,
        rpe,
        endTime: new Date().toISOString(),
      });
    } else {
      logWorkout({
        sessionId,
        date,
        completed: true,
        notes,
        rpe,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
      });
    }
    navigation.goBack();
  };

  const handleStartTimer = () => {
    if (workout.intervalConfig) {
      navigation.navigate('IntervalTimer', { config: workout.intervalConfig });
    } else {
      navigation.navigate('WorkoutTimer', { sessionId });
    }
  };

  const renderWarmup = () => (
    <View>
      {workout.warmup.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.checklistItem}
          onPress={() => toggleItem(`warmup-${index}`)}
        >
          <View
            style={[
              styles.checkbox,
              checkedItems.has(`warmup-${index}`) && styles.checkboxChecked,
            ]}
          >
            {checkedItems.has(`warmup-${index}`) && (
              <Text style={styles.checkboxCheck}>✓</Text>
            )}
          </View>
          <Text
            style={[
              styles.checklistText,
              checkedItems.has(`warmup-${index}`) && styles.checklistTextChecked,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderExercises = (
    exercises: typeof workout.mainLifts,
    prefix: string
  ) => (
    <View>
      {exercises.map((exercise, index) => (
        <Card key={index} style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseNumber}>{index + 1}</Text>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.exercise}</Text>
              <Text style={styles.exerciseSets}>
                {exercise.sets} sets × {exercise.reps}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.exerciseCheck,
                checkedItems.has(`${prefix}-${index}`) && styles.exerciseCheckDone,
              ]}
              onPress={() => toggleItem(`${prefix}-${index}`)}
            >
              {checkedItems.has(`${prefix}-${index}`) && (
                <Text style={styles.exerciseCheckText}>✓</Text>
              )}
            </TouchableOpacity>
          </View>
          {exercise.notes && (
            <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
          )}
        </Card>
      ))}
    </View>
  );

  const renderFinisher = () => (
    <View>
      <Card style={styles.finisherCard}>
        <Text style={styles.finisherText}>{workout.finisher}</Text>
      </Card>
      {workout.intervalConfig && (
        <Button
          title="Start Interval Timer"
          variant="secondary"
          onPress={handleStartTimer}
          fullWidth
          style={styles.timerButton}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Workout Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{workout.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{workout.duration}</Text>
              <Text style={styles.metaLabel}>min</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>
                {workout.mainLifts.length + workout.accessories.length}
              </Text>
              <Text style={styles.metaLabel}>exercises</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={[styles.metaValue, { color: getTypeColor(workout.type) }]}>
                {workout.type.toUpperCase()}
              </Text>
              <Text style={styles.metaLabel}>type</Text>
            </View>
          </View>
        </View>

        {/* Timer Button */}
        <Button
          title="Start Workout Timer"
          variant="primary"
          onPress={handleStartTimer}
          fullWidth
          style={styles.startButton}
        />

        {/* Tabs */}
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'warmup' && renderWarmup()}
          {activeTab === 'main' && renderExercises(workout.mainLifts, 'main')}
          {activeTab === 'accessory' &&
            renderExercises(workout.accessories, 'accessory')}
          {activeTab === 'finisher' && renderFinisher()}
        </View>

        {/* Completion Section */}
        <Card style={styles.completionCard}>
          <Text style={styles.completionTitle}>Log Workout</Text>

          <Slider
            label="RPE (Rate of Perceived Exertion)"
            value={rpe}
            min={1}
            max={10}
            onChange={setRpe}
            labels={['Easy', '', '', '', 'Moderate', '', '', '', '', 'Max']}
          />

          <Input
            label="NOTES"
            placeholder="How did it feel? Any PRs?"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            style={styles.notesInput}
          />

          <Button
            title={existingLog?.completed ? 'Update Log' : 'Complete Workout'}
            variant="primary"
            onPress={handleComplete}
            fullWidth
          />
        </Card>
      </ScrollView>
    </View>
  );
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'strength':
      return colors.primary;
    case 'cardio':
      return colors.secondary;
    case 'hiit':
      return colors.warning;
    default:
      return colors.textSecondary;
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
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaValue: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  metaLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  metaDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  startButton: {
    marginBottom: spacing.lg,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.buttonSmall,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabContent: {
    marginBottom: spacing.lg,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkboxCheck: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  checklistText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  checklistTextChecked: {
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  exerciseCard: {
    marginBottom: spacing.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseNumber: {
    ...typography.h3,
    color: colors.primary,
    width: 32,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  exerciseSets: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  exerciseCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseCheckDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  exerciseCheckText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  exerciseNotes: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
    marginLeft: 32,
  },
  finisherCard: {
    backgroundColor: colors.backgroundTertiary,
  },
  finisherText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  timerButton: {
    marginTop: spacing.md,
  },
  completionCard: {
    marginTop: spacing.md,
  },
  completionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
});
