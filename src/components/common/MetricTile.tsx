import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface MetricTileProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
  compact?: boolean;
}

export default function MetricTile({
  label,
  value,
  unit,
  trend,
  trendValue,
  color = colors.primary,
  onPress,
  style,
  compact = false,
}: MetricTileProps) {
  const Container = onPress ? TouchableOpacity : View;

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return colors.success;
      case 'down':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <Container
      style={[styles.container, compact && styles.compact, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <Text style={[styles.label, compact && styles.compactLabel]}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, compact && styles.compactValue]}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
      {trend && trendValue && (
        <View style={styles.trendContainer}>
          <Text style={[styles.trendIcon, { color: getTrendColor() }]}>
            {getTrendIcon()}
          </Text>
          <Text style={[styles.trendValue, { color: getTrendColor() }]}>
            {trendValue}
          </Text>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 100,
  },
  compact: {
    padding: spacing.sm,
    minWidth: 80,
  },
  indicator: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
  },
  compactLabel: {
    fontSize: 10,
    marginLeft: spacing.sm,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginLeft: spacing.md,
  },
  value: {
    ...typography.metricSmall,
    color: colors.textPrimary,
  },
  compactValue: {
    fontSize: 20,
  },
  unit: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginLeft: spacing.md,
  },
  trendIcon: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 2,
  },
  trendValue: {
    ...typography.caption,
  },
});
