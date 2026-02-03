import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../store';
import { Card, Button, Input } from '../../components/common';
import { colors, spacing, typography } from '../../theme';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);

  const [startWeight, setStartWeight] = useState(profile?.startWeightKg.toString() || '');
  const [goalWeight, setGoalWeight] = useState(profile?.goalWeightKg.toString() || '');
  const [calories, setCalories] = useState(profile?.calorieTarget.toString() || '');
  const [protein, setProtein] = useState(profile?.proteinTarget.toString() || '');
  const [carbs, setCarbs] = useState(profile?.carbTarget.toString() || '');
  const [fat, setFat] = useState(profile?.fatTarget.toString() || '');
  const [hydration, setHydration] = useState(profile?.hydrationTargetMl.toString() || '');

  const handleSave = () => {
    setProfile({
      startWeightKg: parseFloat(startWeight) || profile?.startWeightKg,
      goalWeightKg: parseFloat(goalWeight) || profile?.goalWeightKg,
      calorieTarget: parseInt(calories, 10) || profile?.calorieTarget,
      proteinTarget: parseInt(protein, 10) || profile?.proteinTarget,
      carbTarget: parseInt(carbs, 10) || profile?.carbTarget,
      fatTarget: parseInt(fat, 10) || profile?.fatTarget,
      hydrationTargetMl: parseInt(hydration, 10) || profile?.hydrationTargetMl,
    });

    Alert.alert('Saved', 'Your profile has been updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Weight Goals</Text>

        <View style={styles.row}>
          <Input
            label="START WEIGHT (KG)"
            value={startWeight}
            onChangeText={setStartWeight}
            keyboardType="decimal-pad"
            containerStyle={styles.halfInput}
          />
          <Input
            label="GOAL WEIGHT (KG)"
            value={goalWeight}
            onChangeText={setGoalWeight}
            keyboardType="decimal-pad"
            containerStyle={styles.halfInput}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Nutrition Targets</Text>

        <Input
          label="DAILY CALORIES (KCAL)"
          value={calories}
          onChangeText={setCalories}
          keyboardType="number-pad"
          hint="Recommended: 2100-2300 for cutting"
        />

        <View style={styles.row}>
          <Input
            label="PROTEIN (G)"
            value={protein}
            onChangeText={setProtein}
            keyboardType="number-pad"
            containerStyle={styles.thirdInput}
          />
          <Input
            label="CARBS (G)"
            value={carbs}
            onChangeText={setCarbs}
            keyboardType="number-pad"
            containerStyle={styles.thirdInput}
          />
          <Input
            label="FAT (G)"
            value={fat}
            onChangeText={setFat}
            keyboardType="number-pad"
            containerStyle={styles.thirdInput}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Hydration</Text>

        <Input
          label="DAILY TARGET (ML)"
          value={hydration}
          onChangeText={setHydration}
          keyboardType="number-pad"
          hint="Recommended: 3000ml (3L)"
        />
      </Card>

      <Button title="Save Changes" variant="primary" onPress={handleSave} fullWidth />
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
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  thirdInput: {
    flex: 1,
  },
});
