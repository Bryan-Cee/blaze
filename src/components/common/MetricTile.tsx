import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors, spacing, borderRadius, typography } from "../../theme";

interface MetricTileProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
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
      case "up":
        return "↑";
      case "down":
        return "↓";
      default:
        return "→";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return colors.success;
      case "down":
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
      <View
        style={[
          styles.indicator,
          compact && styles.compactIndicator,
          { backgroundColor: color },
        ]}
      />
      <Text style={[styles.label, compact && styles.compactLabel]}>
        {label}
      </Text>
      <View
        style={[styles.valueContainer, compact && styles.compactValueContainer]}
      >
        <Text style={[styles.value, compact && styles.compactValue]}>
          {value}
        </Text>
        {unit && (
          <Text style={[styles.unit, compact && styles.compactUnit]}>
            {unit}
          </Text>
        )}
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
    paddingVertical: spacing.sm,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
    minWidth: 0,
    alignSelf: "flex-start" as const,
  },
  indicator: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.md,
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  compactIndicator: {
    top: spacing.xs,
    left: spacing.xs,
    height: 18,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
  },
  compactLabel: {
    fontSize: 9,
    marginLeft: spacing.xs,
    marginBottom: 2,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginLeft: spacing.md,
  },
  value: {
    ...typography.metricSmall,
    color: colors.textPrimary,
  },
  compactValueContainer: {
    marginLeft: spacing.xs,
  },
  compactValue: {
    fontSize: 18,
  },
  compactUnit: {
    fontSize: 11,
    marginLeft: 2,
  },
  unit: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    marginLeft: spacing.md,
  },
  trendIcon: {
    fontSize: 14,
    fontWeight: "700",
    marginRight: 2,
  },
  trendValue: {
    ...typography.caption,
  },
});
