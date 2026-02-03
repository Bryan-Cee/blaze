import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { format, parseISO } from 'date-fns';
import { useProgressStore, useUserStore } from '../../store';
import { Card } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function WeightHistoryScreen() {
  const profile = useUserStore((state) => state.profile);
  const weightHistory = useProgressStore((state) => state.getWeightHistory());

  const startWeight = profile?.startWeightKg || 0;

  const renderItem = ({ item, index }: { item: typeof weightHistory[0]; index: number }) => {
    const prevWeight = index < weightHistory.length - 1
      ? weightHistory[index + 1].weightKg
      : startWeight;
    const change = item.weightKg - prevWeight;
    const isLoss = change < 0;

    return (
      <View style={styles.item}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateDay}>{format(parseISO(item.date), 'd')}</Text>
          <Text style={styles.dateMonth}>{format(parseISO(item.date), 'MMM')}</Text>
        </View>
        <View style={styles.weightContainer}>
          <Text style={styles.weight}>{item.weightKg.toFixed(1)}</Text>
          <Text style={styles.weightUnit}>kg</Text>
        </View>
        <View style={styles.changeContainer}>
          <Text style={[
            styles.change,
            { color: isLoss ? colors.success : change > 0 ? colors.error : colors.textSecondary }
          ]}>
            {change > 0 ? '+' : ''}{change.toFixed(1)} kg
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {weightHistory.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No weight entries yet</Text>
          <Text style={styles.emptySubtext}>
            Log your weight from the Progress dashboard
          </Text>
        </Card>
      ) : (
        <FlatList
          data={[...weightHistory].reverse()}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerText}>
                {weightHistory.length} entries • Started at {startWeight.toFixed(1)} kg
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.md,
  },
  headerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  dateContainer: {
    alignItems: 'center',
    width: 50,
    marginRight: spacing.md,
  },
  dateDay: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  dateMonth: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  weightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  weight: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  weightUnit: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  changeContainer: {
    alignItems: 'flex-end',
  },
  change: {
    ...typography.body,
    fontWeight: '600',
  },
  emptyCard: {
    margin: spacing.md,
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
