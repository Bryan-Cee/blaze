import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { format, getDay } from "date-fns";
import {
  useUserStore,
  useHydrationStore,
  useWorkoutStore,
  useProgressStore,
} from "../../store";
import { getWorkoutForDay } from "../../data";
import {
  Card,
  Button,
  ProgressRing,
  MetricTile,
} from "../../components/common";
import { colors, spacing, typography, borderRadius } from "../../theme";
import { HomeStackParamList } from "../../types";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const profile = useUserStore((state) => state.profile);
  const hydrationEntries = useHydrationStore((state) => state.entries);
  const addHydration = useHydrationStore((state) => state.addEntry);
  const removeHydration = useHydrationStore((state) => state.removeEntry);
  const weightLogs = useProgressStore((state) => state.weightLogs);
  const workoutLogs = useWorkoutStore((state) => state.logs);

  const today = new Date();
  const dayOfWeek = getDay(today) === 0 ? 7 : getDay(today); // Convert Sunday from 0 to 7
  const todayWorkout = getWorkoutForDay(dayOfWeek);
  const todayDate = format(today, "yyyy-MM-dd");
  const todayWorkoutLog = workoutLogs.find(
    (log) => log.date === todayDate && log.sessionId === todayWorkout?.id,
  );

  const todayEntries = useMemo(
    () => hydrationEntries.filter((entry) => entry.date === todayDate),
    [hydrationEntries, todayDate],
  );
  const todayHydration = useMemo(
    () => todayEntries.reduce((sum, entry) => sum + entry.quantityMl, 0),
    [todayEntries],
  );
  const latestWeight = useMemo(() => {
    if (weightLogs.length === 0) return null;
    const sorted = [...weightLogs].sort((a, b) => b.date.localeCompare(a.date));
    return sorted[0].weightKg;
  }, [weightLogs]);

  const hydrationTarget = profile?.hydrationTargetMl || 3000;
  const hydrationProgress = todayHydration / hydrationTarget;

  const currentWeight = latestWeight || profile?.startWeightKg || 0;
  const weightLost = profile ? profile.startWeightKg - currentWeight : 0;
  const weightGoalProgress = profile
    ? weightLost / (profile.startWeightKg - profile.goalWeightKg)
    : 0;

  const quickAddWater = (ml: number) => {
    addHydration(ml);
  };

  const undoLastEntry = () => {
    if (todayEntries.length === 0) return;
    const last = todayEntries[todayEntries.length - 1];
    removeHydration(last.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
            <Text style={styles.date}>{format(today, "EEEE, MMMM d")}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>
              Week {getCurrentWeek(profile?.startDate)}
            </Text>
          </View>
        </View>

        {/* Weight Progress Card */}
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.cardTitle}>Weight Progress</Text>
            <Text style={styles.cardSubtitle}>
              {currentWeight.toFixed(1)} / {profile?.goalWeightKg || 0} kg
            </Text>
          </View>
          <View style={styles.progressContent}>
            <ProgressRing
              progress={Math.min(weightGoalProgress, 1)}
              size={200}
              strokeWidth={14}
              color={colors.primary}
              value={weightLost.toFixed(1)}
              unit="kg lost"
            />
            <View style={styles.progressStats}>
              <MetricTile
                label="START"
                value={profile?.startWeightKg.toFixed(1) || "-"}
                unit="kg"
                color={colors.textTertiary}
                compact
              />
              <MetricTile
                label="CURRENT"
                value={currentWeight.toFixed(1)}
                unit="kg"
                color={colors.primary}
                compact
              />
              <MetricTile
                label="GOAL"
                value={profile?.goalWeightKg.toFixed(1) || "-"}
                unit="kg"
                color={colors.success}
                compact
              />
            </View>
          </View>
        </Card>

        {/* Today's Workout Card */}
        <Card style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <View>
              <Text style={styles.cardTitle}>Today's Workout</Text>
              <Text style={styles.workoutTitle}>
                {todayWorkout?.title || "Rest Day"}
              </Text>
            </View>
            {todayWorkoutLog?.completed && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>✓ Done</Text>
              </View>
            )}
          </View>
          {todayWorkout && todayWorkout.type !== "rest" && (
            <>
              <View style={styles.workoutMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Duration</Text>
                  <Text style={styles.metaValue}>
                    {todayWorkout.duration} min
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Type</Text>
                  <Text style={styles.metaValue}>
                    {todayWorkout.type.charAt(0).toUpperCase() +
                      todayWorkout.type.slice(1)}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Exercises</Text>
                  <Text style={styles.metaValue}>
                    {todayWorkout.mainLifts.length +
                      todayWorkout.accessories.length}
                  </Text>
                </View>
              </View>
              <Button
                title={
                  todayWorkoutLog?.completed ? "View Details" : "Start Workout"
                }
                variant={todayWorkoutLog?.completed ? "outline" : "primary"}
                onPress={() =>
                  navigation.navigate("WorkoutDetail", {
                    sessionId: todayWorkout.id,
                    date: todayDate,
                  })
                }
                fullWidth
              />
            </>
          )}
          {todayWorkout?.type === "rest" && (
            <Text style={styles.restText}>{todayWorkout.finisher}</Text>
          )}
        </Card>

        {/* Hydration Card */}
        <Card style={styles.hydrationCard}>
          <View style={styles.hydrationHeader}>
            <Text style={styles.cardTitle}>Hydration</Text>
            <Text style={styles.cardSubtitle}>
              {(todayHydration / 1000).toFixed(1)} /{" "}
              {(hydrationTarget / 1000).toFixed(1)} L
            </Text>
          </View>
          <View style={styles.hydrationBar}>
            <View
              style={[
                styles.hydrationFill,
                { width: `${Math.min(hydrationProgress * 100, 100)}%` },
              ]}
            />
          </View>
          <View style={styles.quickAddButtons}>
            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => quickAddWater(250)}
            >
              <Text style={styles.quickAddText}>+250ml</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => quickAddWater(500)}
            >
              <Text style={styles.quickAddText}>+500ml</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => quickAddWater(750)}
            >
              <Text style={styles.quickAddText}>+750ml</Text>
            </TouchableOpacity>
            {todayEntries.length > 0 && (
              <TouchableOpacity
                style={styles.undoButton}
                onPress={undoLastEntry}
              >
                <Text style={styles.undoText}>Undo</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {/* Quick Stats Row */}
        <View style={styles.statsRow}>
          <MetricTile
            label="CALORIES"
            value={profile?.calorieTarget || 0}
            unit="kcal"
            color={colors.warning}
            style={styles.statTile}
          />
          <MetricTile
            label="PROTEIN"
            value={profile?.proteinTarget || 0}
            unit="g"
            color={colors.protein}
            style={styles.statTile}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
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
  scrollContent: {
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  date: {
    ...typography.body,
    color: colors.textSecondary,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
  },
  streakIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  streakText: {
    ...typography.buttonSmall,
    color: colors.primary,
  },
  progressCard: {
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  progressContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressStats: {
    gap: spacing.sm,
    alignItems: "flex-end" as const,
  },
  workoutCard: {
    marginBottom: spacing.md,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  workoutTitle: {
    ...typography.h3,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  completedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  completedText: {
    ...typography.buttonSmall,
    color: colors.textPrimary,
  },
  workoutMeta: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  metaItem: {
    alignItems: "center",
  },
  metaLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  metaValue: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  restText: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  hydrationCard: {
    marginBottom: spacing.md,
  },
  hydrationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  hydrationBar: {
    height: 12,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.round,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  hydrationFill: {
    height: "100%",
    backgroundColor: colors.water,
    borderRadius: borderRadius.round,
  },
  quickAddButtons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  quickAddButton: {
    flex: 1,
    backgroundColor: colors.backgroundTertiary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  quickAddText: {
    ...typography.buttonSmall,
    color: colors.water,
  },
  undoButton: {
    backgroundColor: colors.backgroundTertiary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  undoText: {
    ...typography.buttonSmall,
    color: colors.textTertiary,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  statTile: {
    flex: 1,
  },
});
