import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { FocusService } from '@/features/focus/service';
import { Button, ProgressRing } from '@/components/ui';
import { ArrowLeft, RotateCcw } from 'lucide-react-native';

const DEFAULT_PLANNED_SECONDS = 25 * 60;

export default function FocusScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_PLANNED_SECONDS);
  const [isActive, setIsActive] = useState(false);
  const [startedAt, setStartedAt] = useState<string | null>(null);

  const handleFinish = useCallback(() => {
    setIsActive(false);
    if (startedAt) {
      FocusService.recordSession({
        startedAt,
        endedAt: new Date().toISOString(),
        plannedSeconds: DEFAULT_PLANNED_SECONDS,
        actualSeconds: DEFAULT_PLANNED_SECONDS,
        completed: true,
      });
    }
  }, [startedAt]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => handleFinish(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, handleFinish]);

  const handleStartPause = () => {
    if (!isActive && !startedAt) {
      setStartedAt(new Date().toISOString());
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(DEFAULT_PLANNED_SECONDS);
    setStartedAt(null);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const remainderSeconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(remainderSeconds).padStart(2, '0')}`;
  const progressPercent = (DEFAULT_PLANNED_SECONDS - secondsLeft) / DEFAULT_PLANNED_SECONDS;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: theme.colors.text }]}>Focus Timer</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.centerContainer}>
        <ProgressRing
          progress={progressPercent}
          size={220}
          strokeWidth={10}
          showLabel
          label={timeFormatted}
        />

        <View style={styles.controlsRow}>
          <Button onPress={handleStartPause} size="lg">
            {isActive ? 'Pause' : 'Start Focus'}
          </Button>

          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <RotateCcw size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  resetBtn: {
    padding: 12,
    borderRadius: 12,
  },
});
