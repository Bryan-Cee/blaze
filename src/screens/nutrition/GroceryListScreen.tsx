import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import { useNutritionStore } from '../../store';
import { defaultGroceryList } from '../../data';
import { Card, Button } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function GroceryListScreen() {
  const groceryItems = useNutritionStore((state) => state.groceryItems);
  const toggleGroceryItem = useNutritionStore((state) => state.toggleGroceryItem);
  const resetGroceryList = useNutritionStore((state) => state.resetGroceryList);
  const setGroceryItems = useNutritionStore((state) => state.setGroceryItems);

  // Initialize grocery items if empty
  useEffect(() => {
    if (groceryItems.length === 0) {
      setGroceryItems(defaultGroceryList);
    }
  }, []);

  // Group items by category
  const categories = groceryItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof groceryItems>);

  const sections = Object.entries(categories).map(([title, data]) => ({
    title,
    data,
  }));

  const checkedCount = groceryItems.filter((item) => item.checked).length;
  const progress = groceryItems.length > 0 ? checkedCount / groceryItems.length : 0;

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.header}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {checkedCount} of {groceryItems.length} items
          </Text>
          <Text style={styles.progressPercent}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <Button
          title="Reset List"
          variant="ghost"
          size="small"
          onPress={resetGroceryList}
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title, data } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionCount}>
              {data.filter((i) => i.checked).length}/{data.length}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => toggleGroceryItem(item.id)}
          >
            <View
              style={[
                styles.checkbox,
                item.checked && styles.checkboxChecked,
              ]}
            >
              {item.checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.itemInfo}>
              <Text
                style={[
                  styles.itemName,
                  item.checked && styles.itemNameChecked,
                ]}
              >
                {item.name}
              </Text>
              <Text style={styles.itemQuantity}>{item.quantity}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  progressPercent: {
    ...typography.h4,
    color: colors.success,
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
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  listContent: {
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.primary,
  },
  sectionCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
    marginBottom: spacing.xs,
    borderRadius: borderRadius.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...typography.body,
    color: colors.textPrimary,
  },
  itemNameChecked: {
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  itemQuantity: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
