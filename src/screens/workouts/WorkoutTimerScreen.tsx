import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function WorkoutTimerScreen() {
  const navigation = useNavigation();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  // Calculate progress for 45-minute target
  const targetSeconds = 45 * 60;
  const progress = Math.min(seconds / targetSeconds, 1);
  const progressDegrees = progress * 360;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Workout Timer</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.timerContainer}>
          <View style={styles.progressRing}>
            <View
              style={[
                styles.progressFill,
                {
                  transform: [{ rotate: `${progressDegrees}deg` }],
                },
              ]}
            />
            <View style={styles.timerInner}>
              <Text style={styles.timerText}>{formatTime(seconds)}</Text>
              <Text style={styles.targetText}>/ 45:00 target</Text>
            </View>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={resetTimer}>
            <Text style={styles.controlButtonText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mainButton, !isRunning && styles.mainButtonPaused]}
            onPress={toggleTimer}
          >
            <Text style={styles.mainButtonText}>
              {isRunning ? 'Pause' : 'Resume'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.controlButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.round((seconds / targetSeconds) * 100)}%
            </Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.max(0, Math.floor((targetSeconds - seconds) / 60))}
            </Text>
            <Text style={styles.statLabel}>min remaining</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    ...typography.button,
    color: colors.primary,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  timerContainer: {
    marginBottom: spacing.xxl,
  },
  progressRing: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    width: 140,
    height: 280,
    backgroundColor: colors.primary,
    left: 0,
    transformOrigin: 'right center',
  },
  timerInner: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    ...typography.metricLarge,
    color: colors.textPrimary,
    fontSize: 56,
  },
  targetText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  controlButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  controlButtonText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  mainButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonPaused: {
    backgroundColor: colors.success,
  },
  mainButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.primary,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
});
