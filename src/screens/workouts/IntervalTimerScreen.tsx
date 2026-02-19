import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { TrainingStackParamList, IntervalConfig } from '../../types';

type RouteProps = RouteProp<TrainingStackParamList, 'IntervalTimer'>;

type Phase = 'ready' | 'work' | 'rest' | 'complete';

export default function IntervalTimerScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { config } = route.params;

  const [phase, setPhase] = useState<Phase>('ready');
  const [currentRound, setCurrentRound] = useState(1);
  const [seconds, setSeconds] = useState(3); // Countdown before start
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          // Transition to next phase
          handlePhaseTransition();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, phase, currentRound]);

  const handlePhaseTransition = () => {
    Vibration.vibrate(200);

    if (phase === 'ready') {
      setPhase('work');
      setSeconds(config.workSec);
    } else if (phase === 'work') {
      if (currentRound >= config.rounds) {
        setPhase('complete');
        setIsRunning(false);
      } else {
        setPhase('rest');
        setSeconds(config.restSec);
      }
    } else if (phase === 'rest') {
      setCurrentRound((r) => r + 1);
      setPhase('work');
      setSeconds(config.workSec);
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'ready':
        return colors.warning;
      case 'work':
        return colors.primary;
      case 'rest':
        return colors.success;
      case 'complete':
        return colors.secondary;
      default:
        return colors.primary;
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'ready':
        return 'GET READY';
      case 'work':
        return 'WORK!';
      case 'rest':
        return 'REST';
      case 'complete':
        return 'COMPLETE!';
      default:
        return '';
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setPhase('ready');
    setCurrentRound(1);
    setSeconds(3);
    setIsRunning(false);
  };

  const totalTime =
    config.rounds * config.workSec + (config.rounds - 1) * config.restSec;
  const elapsedRounds = currentRound - 1;
  const elapsedTime =
    elapsedRounds * (config.workSec + config.restSec) +
    (phase === 'work'
      ? config.workSec - seconds
      : phase === 'rest'
      ? config.workSec + (config.restSec - seconds)
      : 0);
  const progress = phase === 'complete' ? 1 : elapsedTime / totalTime;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getPhaseColor() }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Exit</Text>
        </TouchableOpacity>
        <Text style={styles.title}>HIIT Timer</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Round indicator */}
        <View style={styles.roundsContainer}>
          {Array.from({ length: config.rounds }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.roundDot,
                i < currentRound && styles.roundDotComplete,
                i === currentRound - 1 && phase !== 'complete' && styles.roundDotCurrent,
              ]}
            />
          ))}
        </View>

        <Text style={styles.roundText}>
          Round {currentRound} of {config.rounds}
        </Text>

        {/* Phase Label */}
        <Text style={styles.phaseLabel}>{getPhaseLabel()}</Text>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{seconds}</Text>
        </View>

        {/* Up next */}
        {phase === 'work' && currentRound < config.rounds && (
          <Text style={styles.upNext}>Up next: {config.restSec}s rest</Text>
        )}
        {phase === 'rest' && (
          <Text style={styles.upNext}>Up next: {config.workSec}s work</Text>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={resetTimer}>
            <Text style={styles.controlButtonText}>Reset</Text>
          </TouchableOpacity>

          {phase !== 'complete' && (
            <TouchableOpacity style={styles.mainButton} onPress={toggleTimer}>
              <Text style={styles.mainButtonText}>
                {isRunning ? '⏸' : '▶'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.controlButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progress * 100)}% complete
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  backButton: {
    ...typography.button,
    color: colors.textPrimary,
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
  roundsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  roundDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  roundDotComplete: {
    backgroundColor: colors.textPrimary,
  },
  roundDotCurrent: {
    backgroundColor: colors.textPrimary,
    transform: [{ scale: 1.3 }],
  },
  roundText: {
    ...typography.body,
    color: colors.textPrimary,
    opacity: 0.8,
    marginBottom: spacing.lg,
  },
  phaseLabel: {
    ...typography.h1,
    color: colors.textPrimary,
    letterSpacing: 4,
    marginBottom: spacing.md,
  },
  timerContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  timerText: {
    fontSize: 80,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  upNext: {
    ...typography.body,
    color: colors.textPrimary,
    opacity: 0.7,
    marginBottom: spacing.xl,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginBottom: spacing.xl,
  },
  controlButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  controlButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonText: {
    fontSize: 32,
    color: colors.textPrimary,
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.textPrimary,
    borderRadius: 4,
  },
  progressText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    textAlign: 'center',
    opacity: 0.8,
  },
});
