import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { useUserStore, useNutritionStore } from '../../store';
import { sampleMealPlan, defaultMealPrepItems } from '../../data';
import { Card, Button, ProgressRing, Input } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { NutritionStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<NutritionStackParamList>;

export default function NutritionDashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const profile = useUserStore((state) => state.profile);
  const nutritionLogs = useNutritionStore((state) => state.logs);
  const todayLog = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return nutritionLogs.find((log) => log.date === today);
  }, [nutritionLogs]);
  const logNutrition = useNutritionStore((state) => state.logNutrition);
  const updateNutritionLog = useNutritionStore((state) => state.updateNutritionLog);
  const mealPrepItems = useNutritionStore((state) => state.mealPrepItems);
  const toggleMealPrepItem = useNutritionStore((state) => state.toggleMealPrepItem);
  const setMealPrepItems = useNutritionStore((state) => state.setMealPrepItems);

  const [showLogModal, setShowLogModal] = useState(false);
  const [calories, setCalories] = useState(todayLog?.calories.toString() || '');
  const [protein, setProtein] = useState(todayLog?.protein.toString() || '');
  const [carbs, setCarbs] = useState(todayLog?.carbs.toString() || '');
  const [fat, setFat] = useState(todayLog?.fat.toString() || '');

  // Initialize meal prep items if empty
  React.useEffect(() => {
    if (mealPrepItems.length === 0) {
      setMealPrepItems(defaultMealPrepItems);
    }
  }, []);

  const calorieTarget = profile?.calorieTarget || 2200;
  const proteinTarget = profile?.proteinTarget || 180;
  const carbTarget = profile?.carbTarget || 200;
  const fatTarget = profile?.fatTarget || 70;

  const currentCalories = todayLog?.calories || 0;
  const currentProtein = todayLog?.protein || 0;
  const currentCarbs = todayLog?.carbs || 0;
  const currentFat = todayLog?.fat || 0;

  const handleLogNutrition = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const data = {
      date: today,
      calories: parseInt(calories, 10) || 0,
      protein: parseInt(protein, 10) || 0,
      carbs: parseInt(carbs, 10) || 0,
      fat: parseInt(fat, 10) || 0,
    };

    if (todayLog) {
      updateNutritionLog(todayLog.id, data);
    } else {
      logNutrition(data);
    }
    setShowLogModal(false);
  };

  const mealPrepProgress =
    mealPrepItems.length > 0
      ? mealPrepItems.filter((item) => item.completed).length / mealPrepItems.length
      : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Macro Overview */}
      <Card style={styles.macroCard}>
        <View style={styles.macroHeader}>
          <Text style={styles.cardTitle}>Today's Macros</Text>
          <TouchableOpacity onPress={() => setShowLogModal(!showLogModal)}>
            <Text style={styles.logButton}>{showLogModal ? 'Cancel' : '+ Log'}</Text>
          </TouchableOpacity>
        </View>

        {showLogModal ? (
          <View style={styles.logForm}>
            <View style={styles.logRow}>
              <Input
                label="CALORIES"
                value={calories}
                onChangeText={setCalories}
                keyboardType="number-pad"
                containerStyle={styles.logInput}
              />
              <Input
                label="PROTEIN (G)"
                value={protein}
                onChangeText={setProtein}
                keyboardType="number-pad"
                containerStyle={styles.logInput}
              />
            </View>
            <View style={styles.logRow}>
              <Input
                label="CARBS (G)"
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="number-pad"
                containerStyle={styles.logInput}
              />
              <Input
                label="FAT (G)"
                value={fat}
                onChangeText={setFat}
                keyboardType="number-pad"
                containerStyle={styles.logInput}
              />
            </View>
            <Button title="Save" variant="primary" onPress={handleLogNutrition} fullWidth />
          </View>
        ) : (
          <View style={styles.macroGrid}>
            <View style={styles.macroItem}>
              <ProgressRing
                progress={currentCalories / calorieTarget}
                size={80}
                strokeWidth={6}
                color={colors.warning}
                value={currentCalories.toString()}
                unit="kcal"
              />
              <Text style={styles.macroTarget}>/ {calorieTarget}</Text>
            </View>
            <View style={styles.macroItem}>
              <ProgressRing
                progress={currentProtein / proteinTarget}
                size={80}
                strokeWidth={6}
                color={colors.protein}
                value={currentProtein.toString()}
                unit="g protein"
              />
              <Text style={styles.macroTarget}>/ {proteinTarget}g</Text>
            </View>
            <View style={styles.macroItem}>
              <ProgressRing
                progress={currentCarbs / carbTarget}
                size={80}
                strokeWidth={6}
                color={colors.carbs}
                value={currentCarbs.toString()}
                unit="g carbs"
              />
              <Text style={styles.macroTarget}>/ {carbTarget}g</Text>
            </View>
            <View style={styles.macroItem}>
              <ProgressRing
                progress={currentFat / fatTarget}
                size={80}
                strokeWidth={6}
                color={colors.fat}
                value={currentFat.toString()}
                unit="g fat"
              />
              <Text style={styles.macroTarget}>/ {fatTarget}g</Text>
            </View>
          </View>
        )}
      </Card>

      {/* Quick Links */}
      <View style={styles.quickLinks}>
        <TouchableOpacity
          style={styles.quickLink}
          onPress={() => navigation.navigate('MealPlan')}
        >
          <Text style={styles.quickLinkIcon}>🍽️</Text>
          <Text style={styles.quickLinkText}>Meal Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickLink}
          onPress={() => navigation.navigate('GroceryList')}
        >
          <Text style={styles.quickLinkIcon}>🛒</Text>
          <Text style={styles.quickLinkText}>Grocery List</Text>
        </TouchableOpacity>
      </View>

      {/* Sample Meal */}
      <Card style={styles.mealCard}>
        <Text style={styles.cardTitle}>Sample Day</Text>
        <Text style={styles.cardSubtitle}>
          Total: {Object.values(sampleMealPlan).reduce((sum, meal) => sum + meal.calories, 0)} kcal
        </Text>

        {Object.entries(sampleMealPlan).map(([key, meal]) => (
          <View key={key} style={styles.mealItem}>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealDescription}>{meal.description}</Text>
            </View>
            <View style={styles.mealMacros}>
              <Text style={styles.mealCalories}>{meal.calories}</Text>
              <Text style={styles.mealCaloriesLabel}>kcal</Text>
            </View>
          </View>
        ))}
      </Card>

      {/* Meal Prep Checklist */}
      <Card style={styles.prepCard}>
        <View style={styles.prepHeader}>
          <View>
            <Text style={styles.cardTitle}>Meal Prep</Text>
            <Text style={styles.cardSubtitle}>
              {Math.round(mealPrepProgress * 100)}% complete
            </Text>
          </View>
          <View style={styles.prepProgress}>
            <View
              style={[
                styles.prepProgressFill,
                { width: `${mealPrepProgress * 100}%` },
              ]}
            />
          </View>
        </View>

        {mealPrepItems.slice(0, 4).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.prepItem}
            onPress={() => toggleMealPrepItem(item.id)}
          >
            <View
              style={[
                styles.prepCheckbox,
                item.completed && styles.prepCheckboxChecked,
              ]}
            >
              {item.completed && <Text style={styles.prepCheckmark}>✓</Text>}
            </View>
            <Text
              style={[
                styles.prepItemText,
                item.completed && styles.prepItemTextChecked,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}

        {mealPrepItems.length > 4 && (
          <Text style={styles.moreItems}>
            +{mealPrepItems.length - 4} more items
          </Text>
        )}
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
  macroCard: {
    marginBottom: spacing.md,
  },
  macroHeader: {
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
  },
  logButton: {
    ...typography.buttonSmall,
    color: colors.primary,
  },
  logForm: {
    gap: spacing.sm,
  },
  logRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  logInput: {
    flex: 1,
    marginBottom: 0,
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  macroItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  macroTarget: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  quickLinks: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  quickLink: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickLinkIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  quickLinkText: {
    ...typography.buttonSmall,
    color: colors.textPrimary,
  },
  mealCard: {
    marginBottom: spacing.md,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  mealDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  mealMacros: {
    alignItems: 'flex-end',
  },
  mealCalories: {
    ...typography.h4,
    color: colors.primary,
  },
  mealCaloriesLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  prepCard: {
    marginBottom: spacing.md,
  },
  prepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  prepProgress: {
    width: 60,
    height: 6,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  prepProgressFill: {
    height: '100%',
    backgroundColor: colors.success,
  },
  prepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  prepCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.textTertiary,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prepCheckboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  prepCheckmark: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  prepItemText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  prepItemTextChecked: {
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  moreItems: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
