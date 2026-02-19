import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LineChart } from 'react-native-chart-kit';
import { format, differenceInWeeks, parseISO } from 'date-fns';
import { useUserStore, useProgressStore, useWorkoutStore, useHydrationStore } from '../../store';
import { Card, Button, MetricTile } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { ProgressStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<ProgressStackParamList>;

const screenWidth = Dimensions.get('window').width;

export default function ProgressDashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const profile = useUserStore((state) => state.profile);
  const weightLogs = useProgressStore((state) => state.weightLogs);
  const logWeight = useProgressStore((state) => state.logWeight);
  const workoutLogs = useWorkoutStore((state) => state.logs);
  const hydrationEntries = useHydrationStore((state) => state.entries);

  const weightHistory = useMemo(
    () => [...weightLogs].sort((a, b) => a.date.localeCompare(b.date)),
    [weightLogs]
  );
  const latestWeight = useMemo(() => {
    if (weightLogs.length === 0) return null;
    const sorted = [...weightLogs].sort((a, b) => b.date.localeCompare(a.date));
    return sorted[0].weightKg;
  }, [weightLogs]);
  const hydrationHistory = useMemo(() => {
    const result: { date: string; totalMl: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const total = hydrationEntries
        .filter((entry) => entry.date === dateStr)
        .reduce((sum, entry) => sum + entry.quantityMl, 0);
      result.push({ date: dateStr, totalMl: total });
    }
    return result;
  }, [hydrationEntries]);

  const [showWeightInput, setShowWeightInput] = React.useState(false);
  const [newWeight, setNewWeight] = React.useState('');

  const currentWeight = latestWeight || profile?.startWeightKg || 0;
  const startWeight = profile?.startWeightKg || 0;
  const goalWeight = profile?.goalWeightKg || 0;
  const weightLost = startWeight - currentWeight;
  const totalToLose = startWeight - goalWeight;
  const progressPercent = totalToLose > 0 ? (weightLost / totalToLose) * 100 : 0;

  // Calculate weeks since start
  const weeksElapsed = profile?.startDate
    ? differenceInWeeks(new Date(), parseISO(profile.startDate))
    : 0;
  const expectedLossPerWeek = 0.6;
  const expectedLoss = weeksElapsed * expectedLossPerWeek;
  const onTrack = weightLost >= expectedLoss - 0.5;

  // Weekly stats
  const workoutsThisWeek = workoutLogs.filter((log) => {
    const logDate = parseISO(log.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo && log.completed;
  }).length;

  const avgHydration =
    hydrationHistory.length > 0
      ? hydrationHistory.reduce((sum, day) => sum + day.totalMl, 0) / hydrationHistory.length
      : 0;

  // Prepare chart data
  const chartData = {
    labels: weightHistory.slice(-7).map((w) => format(parseISO(w.date), 'M/d')),
    datasets: [
      {
        data:
          weightHistory.length > 0
            ? weightHistory.slice(-7).map((w) => w.weightKg)
            : [startWeight],
        color: () => colors.primary,
        strokeWidth: 3,
      },
    ],
  };

  const handleLogWeight = () => {
    const weight = parseFloat(newWeight);
    if (!isNaN(weight) && weight > 0) {
      logWeight(weight);
      setNewWeight('');
      setShowWeightInput(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress Overview */}
      <Card style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <Text style={styles.cardTitle}>Weight Progress</Text>
          <TouchableOpacity onPress={() => setShowWeightInput(!showWeightInput)}>
            <Text style={styles.logButton}>{showWeightInput ? 'Cancel' : '+ Log'}</Text>
          </TouchableOpacity>
        </View>

        {showWeightInput && (
          <View style={styles.weightInput}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <View style={styles.textInputWrapper}>
                  <Text
                    style={styles.textInput}
                    onPress={() => {}}
                  >
                    {newWeight || 'Enter weight'}
                  </Text>
                </View>
              </View>
              <Button title="Save" variant="primary" onPress={handleLogWeight} />
            </View>
            <View style={styles.numpad}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map(
                (key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.numpadKey}
                    onPress={() => {
                      if (key === '⌫') {
                        setNewWeight((w) => w.slice(0, -1));
                      } else {
                        setNewWeight((w) => w + key);
                      }
                    }}
                  >
                    <Text style={styles.numpadKeyText}>{key}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        )}

        <View style={styles.progressMain}>
          <View style={styles.progressNumbers}>
            <View style={styles.weightDisplay}>
              <Text style={styles.currentWeight}>{currentWeight.toFixed(1)}</Text>
              <Text style={styles.weightUnit}>kg</Text>
            </View>
            <View style={styles.progressIndicator}>
              <Text
                style={[
                  styles.progressText,
                  { color: onTrack ? colors.success : colors.warning },
                ]}
              >
                {weightLost >= 0 ? '-' : '+'}{Math.abs(weightLost).toFixed(1)} kg
              </Text>
              <Text style={styles.progressSubtext}>
                {onTrack ? 'On track!' : 'Slightly behind'}
              </Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(Math.max(progressPercent, 0), 100)}%` },
              ]}
            />
            <View
              style={[
                styles.progressMarker,
                { left: `${(expectedLoss / totalToLose) * 100}%` },
              ]}
            />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>{startWeight} kg</Text>
            <Text style={styles.progressLabel}>Goal: {goalWeight} kg</Text>
          </View>
        </View>
      </Card>

      {/* Weight Chart */}
      {weightHistory.length > 1 && (
        <Card style={styles.chartCard}>
          <Text style={styles.cardTitle}>Weight Trend</Text>
          <LineChart
            data={chartData}
            width={screenWidth - spacing.md * 4 - 2}
            height={180}
            chartConfig={{
              backgroundColor: colors.card,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              decimalPlaces: 1,
              color: () => colors.primary,
              labelColor: () => colors.textSecondary,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: colors.primary,
              },
              propsForBackgroundLines: {
                stroke: colors.border,
                strokeDasharray: '5,5',
              },
            }}
            bezier
            style={styles.chart}
            withInnerLines
            withOuterLines={false}
          />
          <TouchableOpacity
            style={styles.viewAllLink}
            onPress={() => navigation.navigate('WeightHistory')}
          >
            <Text style={styles.viewAllText}>View full history →</Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* Weekly Summary */}
      <Card style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Weekly Summary</Text>
        <Text style={styles.cardSubtitle}>Week {weeksElapsed + 1} of 8</Text>

        <View style={styles.statsGrid}>
          <MetricTile
            label="WORKOUTS"
            value={workoutsThisWeek}
            unit="/ 5"
            color={workoutsThisWeek >= 4 ? colors.success : colors.warning}
            compact
            style={styles.statTile}
          />
          <MetricTile
            label="AVG HYDRATION"
            value={(avgHydration / 1000).toFixed(1)}
            unit="L"
            color={avgHydration >= 2500 ? colors.success : colors.warning}
            compact
            style={styles.statTile}
          />
        </View>

        <View style={styles.adherenceBar}>
          <Text style={styles.adherenceLabel}>Overall Adherence</Text>
          <View style={styles.adherenceProgress}>
            <View
              style={[
                styles.adherenceFill,
                { width: `${Math.round(progressPercent)}%` },
              ]}
            />
          </View>
          <Text style={styles.adherencePercent}>
            {Math.round(progressPercent)}%
          </Text>
        </View>
      </Card>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Measurements')}
        >
          <Text style={styles.actionIcon}>📏</Text>
          <Text style={styles.actionText}>Log Measurements</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ProgressPhotos')}
        >
          <Text style={styles.actionIcon}>📸</Text>
          <Text style={styles.actionText}>Progress Photo</Text>
        </TouchableOpacity>
      </View>
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
  overviewCard: {
    marginBottom: spacing.md,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  logButton: {
    ...typography.buttonSmall,
    color: colors.primary,
  },
  weightInput: {
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  textInputWrapper: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  textInput: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  numpadKey: {
    width: '32%',
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  numpadKeyText: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  progressMain: {
    marginTop: spacing.sm,
  },
  progressNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  weightDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentWeight: {
    ...typography.metricLarge,
    color: colors.textPrimary,
  },
  weightUnit: {
    ...typography.h4,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  progressIndicator: {
    alignItems: 'flex-end',
  },
  progressText: {
    ...typography.h3,
  },
  progressSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 6,
    overflow: 'visible',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  progressMarker: {
    position: 'absolute',
    top: -4,
    width: 2,
    height: 20,
    backgroundColor: colors.success,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  chartCard: {
    marginBottom: spacing.md,
  },
  chart: {
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
  },
  viewAllLink: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  viewAllText: {
    ...typography.buttonSmall,
    color: colors.primary,
  },
  summaryCard: {
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statTile: {
    flex: 1,
  },
  adherenceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  adherenceLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  adherenceProgress: {
    flex: 1,
    height: 8,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  adherenceFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  adherencePercent: {
    ...typography.buttonSmall,
    color: colors.success,
    width: 40,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  actionText: {
    ...typography.buttonSmall,
    color: colors.textPrimary,
  },
});
