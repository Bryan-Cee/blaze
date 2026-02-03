import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { sampleMealPlan } from '../../data';
import { Card } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function MealPlanScreen() {
  const totalMacros = Object.values(sampleMealPlan).reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Daily Totals */}
      <Card style={styles.totalsCard}>
        <Text style={styles.sectionTitle}>Daily Totals</Text>
        <View style={styles.totalsGrid}>
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: colors.warning }]}>
              {totalMacros.calories}
            </Text>
            <Text style={styles.totalLabel}>kcal</Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: colors.protein }]}>
              {totalMacros.protein}g
            </Text>
            <Text style={styles.totalLabel}>protein</Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: colors.carbs }]}>
              {totalMacros.carbs}g
            </Text>
            <Text style={styles.totalLabel}>carbs</Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: colors.fat }]}>
              {totalMacros.fat}g
            </Text>
            <Text style={styles.totalLabel}>fat</Text>
          </View>
        </View>
      </Card>

      {/* Meals */}
      {Object.entries(sampleMealPlan).map(([key, meal]) => (
        <Card key={key} style={styles.mealCard}>
          <View style={styles.mealHeader}>
            <Text style={styles.mealTime}>{getMealTime(key)}</Text>
            <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
          </View>

          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={styles.mealDescription}>{meal.description}</Text>

          <View style={styles.macroBar}>
            <View
              style={[
                styles.macroSegment,
                {
                  flex: meal.protein * 4,
                  backgroundColor: colors.protein,
                },
              ]}
            />
            <View
              style={[
                styles.macroSegment,
                {
                  flex: meal.carbs * 4,
                  backgroundColor: colors.carbs,
                },
              ]}
            />
            <View
              style={[
                styles.macroSegment,
                {
                  flex: meal.fat * 9,
                  backgroundColor: colors.fat,
                },
              ]}
            />
          </View>

          <View style={styles.macroDetails}>
            <Text style={[styles.macroDetail, { color: colors.protein }]}>
              P: {meal.protein}g
            </Text>
            <Text style={[styles.macroDetail, { color: colors.carbs }]}>
              C: {meal.carbs}g
            </Text>
            <Text style={[styles.macroDetail, { color: colors.fat }]}>
              F: {meal.fat}g
            </Text>
          </View>

          <View style={styles.ingredients}>
            <Text style={styles.ingredientsTitle}>Ingredients:</Text>
            {meal.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredient}>
                • {ingredient}
              </Text>
            ))}
          </View>
        </Card>
      ))}

      {/* Tips */}
      <Card style={styles.tipsCard}>
        <Text style={styles.sectionTitle}>Meal Timing Tips</Text>
        <View style={styles.tip}>
          <Text style={styles.tipText}>
            • Eat protein-rich breakfast within 1-2 hours of waking
          </Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipText}>
            • Space meals 3-4 hours apart for optimal digestion
          </Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipText}>
            • Have casein shake 30-60 min before bed for overnight recovery
          </Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipText}>
            • Pre-workout meal 2-3 hours before training
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

function getMealTime(key: string): string {
  const times: Record<string, string> = {
    breakfast: '7:00 AM',
    snack1: '10:00 AM',
    lunch: '12:30 PM',
    snack2: '3:30 PM',
    dinner: '6:30 PM',
  };
  return times[key] || '';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  totalsCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  totalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  totalItem: {
    alignItems: 'center',
  },
  totalValue: {
    ...typography.h3,
  },
  totalLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  mealCard: {
    marginBottom: spacing.md,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  mealTime: {
    ...typography.label,
    color: colors.primary,
  },
  mealCalories: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  mealName: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  mealDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  macroBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  macroSegment: {
    height: '100%',
  },
  macroDetails: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  macroDetail: {
    ...typography.buttonSmall,
  },
  ingredients: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  ingredientsTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  ingredient: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tipsCard: {
    backgroundColor: colors.backgroundTertiary,
    marginBottom: spacing.md,
  },
  tip: {
    marginBottom: spacing.xs,
  },
  tipText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
