import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { format, parseISO } from 'date-fns';
import { useProgressStore } from '../../store';
import { Card, Button, Input } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function MeasurementsScreen() {
  const measurements = useProgressStore((state) => state.getMeasurementHistory());
  const logMeasurement = useProgressStore((state) => state.logMeasurement);

  const [showForm, setShowForm] = useState(false);
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [chest, setChest] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    logMeasurement({
      date: format(new Date(), 'yyyy-MM-dd'),
      waistCm: waist ? parseFloat(waist) : undefined,
      hipCm: hip ? parseFloat(hip) : undefined,
      chestCm: chest ? parseFloat(chest) : undefined,
      notes: notes || undefined,
    });
    setWaist('');
    setHip('');
    setChest('');
    setNotes('');
    setShowForm(false);
  };

  const latestMeasurement = measurements[measurements.length - 1];
  const firstMeasurement = measurements[0];

  const getChange = (current?: number, first?: number) => {
    if (!current || !first) return null;
    const change = current - first;
    return change;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Add New */}
      <Card style={styles.addCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Log Measurements</Text>
          <Button
            title={showForm ? 'Cancel' : '+ Add'}
            variant="ghost"
            size="small"
            onPress={() => setShowForm(!showForm)}
          />
        </View>

        {showForm && (
          <View style={styles.form}>
            <View style={styles.formRow}>
              <Input
                label="WAIST (CM)"
                value={waist}
                onChangeText={setWaist}
                keyboardType="decimal-pad"
                placeholder="e.g., 85"
                containerStyle={styles.formInput}
              />
              <Input
                label="HIP (CM)"
                value={hip}
                onChangeText={setHip}
                keyboardType="decimal-pad"
                placeholder="e.g., 100"
                containerStyle={styles.formInput}
              />
            </View>
            <Input
              label="CHEST (CM)"
              value={chest}
              onChangeText={setChest}
              keyboardType="decimal-pad"
              placeholder="e.g., 105"
            />
            <Input
              label="NOTES (OPTIONAL)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Any observations..."
              multiline
            />
            <Button title="Save Measurements" variant="primary" onPress={handleSave} fullWidth />
          </View>
        )}
      </Card>

      {/* Summary */}
      {measurements.length > 0 && (
        <Card style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Current vs Start</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Waist</Text>
              <Text style={styles.summaryValue}>
                {latestMeasurement?.waistCm?.toFixed(1) || '-'} cm
              </Text>
              {getChange(latestMeasurement?.waistCm, firstMeasurement?.waistCm) !== null && (
                <Text style={[
                  styles.summaryChange,
                  { color: getChange(latestMeasurement?.waistCm, firstMeasurement?.waistCm)! < 0
                    ? colors.success
                    : colors.error }
                ]}>
                  {getChange(latestMeasurement?.waistCm, firstMeasurement?.waistCm)! > 0 ? '+' : ''}
                  {getChange(latestMeasurement?.waistCm, firstMeasurement?.waistCm)!.toFixed(1)} cm
                </Text>
              )}
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Hip</Text>
              <Text style={styles.summaryValue}>
                {latestMeasurement?.hipCm?.toFixed(1) || '-'} cm
              </Text>
              {getChange(latestMeasurement?.hipCm, firstMeasurement?.hipCm) !== null && (
                <Text style={[
                  styles.summaryChange,
                  { color: getChange(latestMeasurement?.hipCm, firstMeasurement?.hipCm)! < 0
                    ? colors.success
                    : colors.error }
                ]}>
                  {getChange(latestMeasurement?.hipCm, firstMeasurement?.hipCm)! > 0 ? '+' : ''}
                  {getChange(latestMeasurement?.hipCm, firstMeasurement?.hipCm)!.toFixed(1)} cm
                </Text>
              )}
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Chest</Text>
              <Text style={styles.summaryValue}>
                {latestMeasurement?.chestCm?.toFixed(1) || '-'} cm
              </Text>
              {getChange(latestMeasurement?.chestCm, firstMeasurement?.chestCm) !== null && (
                <Text style={[
                  styles.summaryChange,
                  { color: Math.abs(getChange(latestMeasurement?.chestCm, firstMeasurement?.chestCm)!) < 2
                    ? colors.textSecondary
                    : colors.warning }
                ]}>
                  {getChange(latestMeasurement?.chestCm, firstMeasurement?.chestCm)! > 0 ? '+' : ''}
                  {getChange(latestMeasurement?.chestCm, firstMeasurement?.chestCm)!.toFixed(1)} cm
                </Text>
              )}
            </View>
          </View>
        </Card>
      )}

      {/* History */}
      <Card style={styles.historyCard}>
        <Text style={styles.cardTitle}>History</Text>
        {measurements.length === 0 ? (
          <Text style={styles.emptyText}>No measurements logged yet</Text>
        ) : (
          [...measurements].reverse().map((m, index) => (
            <View key={m.id} style={styles.historyItem}>
              <Text style={styles.historyDate}>
                {format(parseISO(m.date), 'MMM d, yyyy')}
              </Text>
              <View style={styles.historyValues}>
                {m.waistCm && (
                  <Text style={styles.historyValue}>W: {m.waistCm} cm</Text>
                )}
                {m.hipCm && (
                  <Text style={styles.historyValue}>H: {m.hipCm} cm</Text>
                )}
                {m.chestCm && (
                  <Text style={styles.historyValue}>C: {m.chestCm} cm</Text>
                )}
              </View>
              {m.notes && <Text style={styles.historyNotes}>{m.notes}</Text>}
            </View>
          ))
        )}
      </Card>

      {/* Tips */}
      <Card style={styles.tipsCard}>
        <Text style={styles.cardTitle}>Measurement Tips</Text>
        <Text style={styles.tipText}>
          • Measure at the same time of day (morning preferred)
        </Text>
        <Text style={styles.tipText}>
          • Waist: narrowest point, usually at navel
        </Text>
        <Text style={styles.tipText}>
          • Hip: widest point around buttocks
        </Text>
        <Text style={styles.tipText}>
          • Chest: fullest part, tape under armpits
        </Text>
        <Text style={styles.tipText}>
          • Measure every 2 weeks for best tracking
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
  addCard: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  form: {
    marginTop: spacing.md,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  formInput: {
    flex: 1,
  },
  summaryCard: {
    marginBottom: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  summaryChange: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },
  historyCard: {
    marginBottom: spacing.md,
  },
  historyItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyDate: {
    ...typography.label,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  historyValues: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  historyValue: {
    ...typography.body,
    color: colors.textPrimary,
  },
  historyNotes: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  tipsCard: {
    backgroundColor: colors.backgroundTertiary,
  },
  tipText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
