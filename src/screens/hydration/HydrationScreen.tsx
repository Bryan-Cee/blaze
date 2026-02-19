import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { format, subDays } from 'date-fns';
import { useUserStore, useHydrationStore, useProgressStore } from '../../store';
import { recoveryChecklist } from '../../data';
import { Card, Button, Slider } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function HydrationScreen() {
  const profile = useUserStore((state) => state.profile);
  const hydrationEntries = useHydrationStore((state) => state.entries);
  const addHydration = useHydrationStore((state) => state.addEntry);
  const biofeedbackLogs = useProgressStore((state) => state.biofeedbackLogs);
  const logBiofeedback = useProgressStore((state) => state.logBiofeedback);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayHydration = useMemo(
    () => hydrationEntries
      .filter((entry) => entry.date === todayStr)
      .reduce((sum, entry) => sum + entry.quantityMl, 0),
    [hydrationEntries, todayStr]
  );
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
  const hydrationStreak = useMemo(() => {
    const targetMl = profile?.hydrationTargetMl || 3000;
    const dailyTotals = new Map<string, number>();
    hydrationEntries.forEach((entry) => {
      const current = dailyTotals.get(entry.date) || 0;
      dailyTotals.set(entry.date, current + entry.quantityMl);
    });
    const today = new Date();
    let streak = 0;
    for (let i = 1; i <= 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      if ((dailyTotals.get(dateStr) || 0) >= targetMl) {
        streak++;
      } else {
        break;
      }
    }
    if ((dailyTotals.get(todayStr) || 0) >= targetMl) streak++;
    return streak;
  }, [hydrationEntries, profile?.hydrationTargetMl, todayStr]);
  const todayBiofeedback = useMemo(
    () => biofeedbackLogs.find((log) => log.date === todayStr),
    [biofeedbackLogs, todayStr]
  );

  const [energy, setEnergy] = useState(todayBiofeedback?.energy || 3);
  const [hunger, setHunger] = useState(todayBiofeedback?.hunger || 3);
  const [sleepQuality, setSleepQuality] = useState(todayBiofeedback?.sleepQuality || 3);
  const [checkedRecovery, setCheckedRecovery] = useState<Set<string>>(new Set());

  const hydrationTarget = profile?.hydrationTargetMl || 3000;
  const hydrationProgress = todayHydration / hydrationTarget;

  const quickAddAmounts = [250, 500, 750, 1000];

  const handleSaveBiofeedback = () => {
    logBiofeedback({
      date: format(new Date(), 'yyyy-MM-dd'),
      energy,
      hunger,
      sleepQuality,
    });
  };

  const toggleRecoveryItem = (id: string) => {
    const newChecked = new Set(checkedRecovery);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedRecovery(newChecked);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hydration Card */}
      <Card style={styles.hydrationCard}>
        <Text style={styles.cardTitle}>Today's Hydration</Text>

        <View style={styles.hydrationMain}>
          <View style={styles.hydrationProgress}>
            <View style={styles.hydrationRing}>
              <Text style={styles.hydrationValue}>
                {(todayHydration / 1000).toFixed(1)}
              </Text>
              <Text style={styles.hydrationUnit}>L</Text>
            </View>
            <Text style={styles.hydrationTarget}>
              of {(hydrationTarget / 1000).toFixed(1)}L target
            </Text>
          </View>

          <View style={styles.hydrationStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{hydrationStreak}</Text>
              <Text style={styles.statLabel}>day streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(hydrationProgress * 100)}%
              </Text>
              <Text style={styles.statLabel}>today</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(hydrationProgress * 100, 100)}%` },
            ]}
          />
        </View>

        <View style={styles.quickAdd}>
          {quickAddAmounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={styles.quickAddButton}
              onPress={() => addHydration(amount)}
            >
              <Text style={styles.quickAddText}>+{amount}ml</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Weekly History */}
      <Card style={styles.historyCard}>
        <Text style={styles.cardTitle}>This Week</Text>
        <View style={styles.historyChart}>
          {hydrationHistory.map((day, index) => {
            const dayProgress = day.totalMl / hydrationTarget;
            return (
              <View key={index} style={styles.historyBar}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${Math.min(dayProgress * 100, 100)}%`,
                        backgroundColor:
                          dayProgress >= 1 ? colors.success : colors.water,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>
                  {format(subDays(new Date(), 6 - index), 'EEE')}
                </Text>
              </View>
            );
          })}
        </View>
      </Card>

      {/* Biofeedback */}
      <Card style={styles.biofeedbackCard}>
        <Text style={styles.cardTitle}>Daily Biofeedback</Text>
        <Text style={styles.cardSubtitle}>
          Track how you feel to optimize recovery
        </Text>

        <Slider
          label="Energy Level"
          value={energy}
          min={1}
          max={5}
          onChange={setEnergy}
          labels={['Low', '', 'Moderate', '', 'High']}
        />

        <Slider
          label="Hunger Level"
          value={hunger}
          min={1}
          max={5}
          onChange={setHunger}
          labels={['Not hungry', '', 'Normal', '', 'Very hungry']}
        />

        <Slider
          label="Sleep Quality"
          value={sleepQuality}
          min={1}
          max={5}
          onChange={setSleepQuality}
          labels={['Poor', '', 'Average', '', 'Excellent']}
        />

        <Button
          title="Save Biofeedback"
          variant="primary"
          onPress={handleSaveBiofeedback}
          fullWidth
        />
      </Card>

      {/* Recovery Checklist */}
      <Card style={styles.recoveryCard}>
        <Text style={styles.cardTitle}>Recovery Checklist</Text>
        <Text style={styles.cardSubtitle}>
          {checkedRecovery.size}/{recoveryChecklist.length} completed today
        </Text>

        {recoveryChecklist.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.checklistItem}
            onPress={() => toggleRecoveryItem(item.id)}
          >
            <View
              style={[
                styles.checkbox,
                checkedRecovery.has(item.id) && styles.checkboxChecked,
              ]}
            >
              {checkedRecovery.has(item.id) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text
              style={[
                styles.checklistText,
                checkedRecovery.has(item.id) && styles.checklistTextChecked,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
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
  hydrationCard: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  hydrationMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  hydrationProgress: {
    flex: 1,
    alignItems: 'center',
  },
  hydrationRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: colors.water,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  hydrationValue: {
    ...typography.metricLarge,
    color: colors.textPrimary,
  },
  hydrationUnit: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: -8,
  },
  hydrationTarget: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  hydrationStats: {
    flex: 1,
  },
  statItem: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statValue: {
    ...typography.h2,
    color: colors.water,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.water,
    borderRadius: 4,
  },
  quickAdd: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickAddButton: {
    flex: 1,
    backgroundColor: colors.backgroundTertiary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  quickAddText: {
    ...typography.buttonSmall,
    color: colors.water,
  },
  historyCard: {
    marginBottom: spacing.md,
  },
  historyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginTop: spacing.md,
  },
  historyBar: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    width: 24,
    height: 80,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 12,
  },
  barLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  biofeedbackCard: {
    marginBottom: spacing.md,
  },
  recoveryCard: {
    marginBottom: spacing.md,
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
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
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
});
