import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useUserStore } from '../../store';
import { Button, Input, Card } from '../../components/common';
import { colors, spacing, typography } from '../../theme';
import { format } from 'date-fns';

interface OnboardingForm {
  startWeight: string;
  goalWeight: string;
  calorieTarget: string;
  proteinTarget: string;
  carbTarget: string;
  fatTarget: string;
  hydrationTarget: string;
}

const defaultValues: OnboardingForm = {
  startWeight: '',
  goalWeight: '',
  calorieTarget: '2200',
  proteinTarget: '180',
  carbTarget: '200',
  fatTarget: '70',
  hydrationTarget: '3000',
};

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<OnboardingForm>({
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (data: OnboardingForm) => {
    completeOnboarding({
      startDate: format(new Date(), 'yyyy-MM-dd'),
      startWeightKg: parseFloat(data.startWeight),
      goalWeightKg: parseFloat(data.goalWeight),
      calorieTarget: parseInt(data.calorieTarget, 10),
      proteinTarget: parseInt(data.proteinTarget, 10),
      carbTarget: parseInt(data.carbTarget, 10),
      fatTarget: parseInt(data.fatTarget, 10),
      hydrationTargetMl: parseInt(data.hydrationTarget, 10),
    });
  };

  const handleNext = async () => {
    const fieldsToValidate = step === 0
      ? ['startWeight', 'goalWeight']
      : ['calorieTarget', 'proteinTarget', 'carbTarget', 'fatTarget', 'hydrationTarget'];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      if (step < 2) {
        setStep(step + 1);
      } else {
        handleSubmit(onSubmit)();
      }
    }
  };

  const renderStep0 = () => (
    <>
      <Text style={styles.stepTitle}>Welcome to Blaze</Text>
      <Text style={styles.stepDescription}>
        Let's set up your 8-week fat loss journey. First, tell us about your weight goals.
      </Text>

      <Controller
        control={control}
        name="startWeight"
        rules={{
          required: 'Starting weight is required',
          pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: 'Enter a valid weight',
          },
          min: { value: 30, message: 'Weight must be at least 30 kg' },
          max: { value: 300, message: 'Weight must be less than 300 kg' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="CURRENT WEIGHT (KG)"
            placeholder="e.g., 85"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="decimal-pad"
            error={errors.startWeight?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="goalWeight"
        rules={{
          required: 'Goal weight is required',
          pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: 'Enter a valid weight',
          },
          validate: (value) => {
            const start = parseFloat(getValues('startWeight'));
            const goal = parseFloat(value);
            if (goal >= start) {
              return 'Goal weight should be less than starting weight';
            }
            if (start - goal > 15) {
              return 'Target loss should not exceed 15 kg for this program';
            }
            return true;
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="GOAL WEIGHT (KG)"
            placeholder="e.g., 80"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="decimal-pad"
            error={errors.goalWeight?.message}
            hint="Aim for 5-10 kg loss over 8 weeks"
          />
        )}
      />
    </>
  );

  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>Nutrition Targets</Text>
      <Text style={styles.stepDescription}>
        We've pre-filled recommended values. Adjust based on your preferences or nutritionist's advice.
      </Text>

      <Controller
        control={control}
        name="calorieTarget"
        rules={{
          required: 'Calorie target is required',
          min: { value: 1200, message: 'Minimum 1200 kcal' },
          max: { value: 4000, message: 'Maximum 4000 kcal' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="DAILY CALORIES (KCAL)"
            placeholder="2200"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="number-pad"
            error={errors.calorieTarget?.message}
          />
        )}
      />

      <View style={styles.macroRow}>
        <View style={styles.macroInput}>
          <Controller
            control={control}
            name="proteinTarget"
            rules={{ required: true, min: 50, max: 400 }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="PROTEIN (G)"
                placeholder="180"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                error={errors.proteinTarget ? 'Required' : undefined}
              />
            )}
          />
        </View>
        <View style={styles.macroInput}>
          <Controller
            control={control}
            name="carbTarget"
            rules={{ required: true, min: 50, max: 500 }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="CARBS (G)"
                placeholder="200"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                error={errors.carbTarget ? 'Required' : undefined}
              />
            )}
          />
        </View>
        <View style={styles.macroInput}>
          <Controller
            control={control}
            name="fatTarget"
            rules={{ required: true, min: 20, max: 200 }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="FAT (G)"
                placeholder="70"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                error={errors.fatTarget ? 'Required' : undefined}
              />
            )}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="hydrationTarget"
        rules={{
          required: 'Hydration target is required',
          min: { value: 1000, message: 'Minimum 1000 ml' },
          max: { value: 6000, message: 'Maximum 6000 ml' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="DAILY HYDRATION (ML)"
            placeholder="3000"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="number-pad"
            error={errors.hydrationTarget?.message}
            hint="3 liters recommended"
          />
        )}
      />
    </>
  );

  const renderStep2 = () => {
    const values = getValues();
    const weightLoss = parseFloat(values.startWeight) - parseFloat(values.goalWeight);

    return (
      <>
        <Text style={styles.stepTitle}>Ready to Blaze!</Text>
        <Text style={styles.stepDescription}>
          Here's your 8-week plan summary. You'll receive reminders for workouts, hydration, and weekly check-ins.
        </Text>

        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Weight Goal</Text>
            <Text style={styles.summaryValue}>
              {values.startWeight} → {values.goalWeight} kg (-{weightLoss.toFixed(1)} kg)
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Daily Calories</Text>
            <Text style={styles.summaryValue}>{values.calorieTarget} kcal</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Macros (P/C/F)</Text>
            <Text style={styles.summaryValue}>
              {values.proteinTarget}g / {values.carbTarget}g / {values.fatTarget}g
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Hydration</Text>
            <Text style={styles.summaryValue}>{values.hydrationTarget} ml/day</Text>
          </View>
          <View style={[styles.summaryRow, styles.noBorder]}>
            <Text style={styles.summaryLabel}>Training Days</Text>
            <Text style={styles.summaryValue}>Mon–Fri (5 days/week)</Text>
          </View>
        </Card>

        <Card style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>Your Data</Text>
          <Text style={styles.privacyText}>
            All data is stored locally on your device. No account needed, no cloud sync. Your progress is yours alone.
          </Text>
        </Card>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.logo}>BLAZE</Text>
            <View style={styles.progressDots}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[styles.dot, i === step && styles.dotActive, i < step && styles.dotCompleted]}
                />
              ))}
            </View>
          </View>

          <View style={styles.content}>
            {step === 0 && renderStep0()}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
          </View>

          <View style={styles.footer}>
            {step > 0 && (
              <Button
                title="Back"
                variant="ghost"
                onPress={() => setStep(step - 1)}
                style={styles.backButton}
              />
            )}
            <Button
              title={step === 2 ? "Let's Go!" : 'Continue'}
              variant="primary"
              onPress={handleNext}
              fullWidth={step === 0}
              style={step > 0 ? styles.nextButton : undefined}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: spacing.md,
  },
  progressDots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.backgroundTertiary,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  dotCompleted: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  stepTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  stepDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  macroRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  macroInput: {
    flex: 1,
  },
  summaryCard: {
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  privacyCard: {
    backgroundColor: colors.backgroundTertiary,
  },
  privacyTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  privacyText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
