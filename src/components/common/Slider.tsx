import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  labels?: string[];
}

export default function Slider({
  label,
  value,
  min = 1,
  max = 5,
  step = 1,
  onChange,
  labels,
}: SliderProps) {
  const steps = Math.floor((max - min) / step) + 1;
  const values = Array.from({ length: steps }, (_, i) => min + i * step);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.track}>
        {values.map((v) => (
          <TouchableOpacity
            key={v}
            style={[
              styles.step,
              v <= value && styles.stepActive,
              v === value && styles.stepCurrent,
            ]}
            onPress={() => onChange(v)}
          />
        ))}
      </View>
      {labels && labels.length === steps && (
        <View style={styles.labels}>
          {labels.map((l, i) => (
            <Text
              key={i}
              style={[
                styles.stepLabel,
                values[i] === value && styles.stepLabelActive,
              ]}
            >
              {l}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
  },
  value: {
    ...typography.h4,
    color: colors.primary,
  },
  track: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  step: {
    flex: 1,
    height: 8,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.sm,
  },
  stepActive: {
    backgroundColor: colors.primary,
  },
  stepCurrent: {
    backgroundColor: colors.primaryLight,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  stepLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    flex: 1,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: colors.primary,
  },
});
