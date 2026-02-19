import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Share } from 'react-native';
import { format } from 'date-fns';
import { useUserStore, useProgressStore, useHydrationStore, useWorkoutStore } from '../../store';
import { Card, Button } from '../../components/common';
import { colors, spacing, typography } from '../../theme';

export default function ExportDataScreen() {
  const [exporting, setExporting] = useState<string | null>(null);

  const profile = useUserStore((state) => state.profile);
  const rawWeightLogs = useProgressStore((state) => state.weightLogs);
  const rawMeasurements = useProgressStore((state) => state.measurements);
  const weightLogs = useMemo(
    () => [...rawWeightLogs].sort((a, b) => a.date.localeCompare(b.date)),
    [rawWeightLogs]
  );
  const measurements = useMemo(
    () => [...rawMeasurements].sort((a, b) => a.date.localeCompare(b.date)),
    [rawMeasurements]
  );
  const hydrationEntries = useHydrationStore((state) => state.entries);
  const workoutLogs = useWorkoutStore((state) => state.logs);

  const exportAsJSON = async (dataType: string) => {
    setExporting(dataType);
    try {
      let data: any;
      let filename: string;

      switch (dataType) {
        case 'weight':
          data = weightLogs;
          filename = 'blaze_weight_logs';
          break;
        case 'measurements':
          data = measurements;
          filename = 'blaze_measurements';
          break;
        case 'hydration':
          data = hydrationEntries;
          filename = 'blaze_hydration';
          break;
        case 'workouts':
          data = workoutLogs;
          filename = 'blaze_workouts';
          break;
        case 'all':
          data = {
            profile,
            weightLogs,
            measurements,
            hydrationEntries,
            workoutLogs,
            exportDate: new Date().toISOString(),
          };
          filename = 'blaze_full_export';
          break;
        default:
          return;
      }

      const jsonString = JSON.stringify(data, null, 2);

      await Share.share({
        message: jsonString,
        title: `${filename}_${format(new Date(), 'yyyy-MM-dd')}.json`,
      });
    } catch (error) {
      Alert.alert('Export Failed', 'Unable to export data. Please try again.');
    }
    setExporting(null);
  };

  const exportAsCSV = async (dataType: string) => {
    setExporting(dataType);
    try {
      let csvContent: string;
      let filename: string;

      switch (dataType) {
        case 'weight':
          csvContent = 'Date,Weight (kg)\n' +
            weightLogs.map((w) => `${w.date},${w.weightKg}`).join('\n');
          filename = 'blaze_weight_logs';
          break;
        case 'hydration':
          csvContent = 'Date,Amount (ml),Timestamp\n' +
            hydrationEntries.map((h) => `${h.date},${h.quantityMl},${h.timestamp}`).join('\n');
          filename = 'blaze_hydration';
          break;
        default:
          return;
      }

      await Share.share({
        message: csvContent,
        title: `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`,
      });
    } catch (error) {
      Alert.alert('Export Failed', 'Unable to export data. Please try again.');
    }
    setExporting(null);
  };

  const dataCards = [
    {
      id: 'weight',
      title: 'Weight Logs',
      description: `${weightLogs.length} entries`,
      icon: '⚖️',
      hasCSV: true,
    },
    {
      id: 'measurements',
      title: 'Body Measurements',
      description: `${measurements.length} entries`,
      icon: '📏',
      hasCSV: false,
    },
    {
      id: 'hydration',
      title: 'Hydration Logs',
      description: `${hydrationEntries.length} entries`,
      icon: '💧',
      hasCSV: true,
    },
    {
      id: 'workouts',
      title: 'Workout Logs',
      description: `${workoutLogs.length} entries`,
      icon: '💪',
      hasCSV: false,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.description}>
        Export your Blaze data for backup or analysis. Data is exported to your
        device's share sheet - you can save to Files, send via email, or use
        with other apps.
      </Text>

      {/* Full Export */}
      <Card style={styles.fullExportCard}>
        <View style={styles.fullExportHeader}>
          <Text style={styles.fullExportIcon}>📦</Text>
          <View style={styles.fullExportInfo}>
            <Text style={styles.fullExportTitle}>Full Data Export</Text>
            <Text style={styles.fullExportDescription}>
              All data including profile, logs, and settings
            </Text>
          </View>
        </View>
        <Button
          title="Export All (JSON)"
          variant="primary"
          onPress={() => exportAsJSON('all')}
          loading={exporting === 'all'}
          fullWidth
        />
      </Card>

      {/* Individual Exports */}
      <Text style={styles.sectionTitle}>Export by Category</Text>

      {dataCards.map((card) => (
        <Card key={card.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>{card.icon}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </View>
          </View>
          <View style={styles.cardButtons}>
            <Button
              title="JSON"
              variant="outline"
              size="small"
              onPress={() => exportAsJSON(card.id)}
              loading={exporting === card.id}
              style={styles.exportButton}
            />
            {card.hasCSV && (
              <Button
                title="CSV"
                variant="outline"
                size="small"
                onPress={() => exportAsCSV(card.id)}
                loading={exporting === card.id}
                style={styles.exportButton}
              />
            )}
          </View>
        </Card>
      ))}

      {/* Info */}
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Data Format Notes</Text>
        <Text style={styles.infoText}>
          • JSON: Complete data including all fields, best for backups
        </Text>
        <Text style={styles.infoText}>
          • CSV: Simplified format, compatible with Excel/Google Sheets
        </Text>
        <Text style={styles.infoText}>
          • Dates are in ISO 8601 format (YYYY-MM-DD)
        </Text>
        <Text style={styles.infoText}>
          • Weights are in kilograms, volumes in milliliters
        </Text>
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
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  fullExportCard: {
    marginBottom: spacing.lg,
  },
  fullExportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  fullExportIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  fullExportInfo: {
    flex: 1,
  },
  fullExportTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  fullExportDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  card: {
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  cardDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  cardButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  exportButton: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: colors.backgroundTertiary,
    marginTop: spacing.lg,
  },
  infoTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
});
