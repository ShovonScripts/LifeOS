import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { seedSampleData } from '@/services/sample-data';
import { Button } from '@/components/ui';
import { ShieldCheck, Zap, Layers } from 'lucide-react-native';
import { db } from '@/db/client';
import { setSetting } from '@/db/repositories/app-settings';

export default function OnboardingScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [step, setStep] = useState(0);

  const slides = [
    {
      icon: ShieldCheck,
      title: '100% Local-First & Private',
      description:
        'Your tasks, habits, and notes stay strictly on your device. No forced accounts, no cloud tracking, and no internet required.',
    },
    {
      icon: Zap,
      title: '3-Second Quick Capture',
      description:
        'Type naturally like "Meeting with team tomorrow 3pm !high #work" and let LifeOS organize everything instantly.',
    },
    {
      icon: Layers,
      title: 'All-In-One Productivity',
      description:
        'Tasks, Calendar, Habit Streaks, Goal Milestones, Notes, and Focus Timer seamlessly integrated in one beautiful app.',
    },
  ];

  const handleFinish = () => {
    try {
      seedSampleData();
      setSetting(db, 'onboarding_completed', 'true');
    } catch {
      // handled
    }
    router.replace('/(tabs)' as const);
  };

  const currentSlide = slides[step] ?? slides[0]!;
  const IconComponent = currentSlide.icon;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.slideContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.surfaceAlt }]}>
            <IconComponent size={48} color={theme.colors.primary} />
          </View>

          <Text style={[theme.typography.h1, { color: theme.colors.text, textAlign: 'center' }]}>
            {currentSlide.title}
          </Text>

          <Text
            style={[
              theme.typography.body,
              { color: theme.colors.textSecondary, textAlign: 'center' },
            ]}
          >
            {currentSlide.description}
          </Text>
        </View>

        {/* Step Indicators */}
        <View style={styles.dotsRow}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === step ? theme.colors.primary : theme.colors.surfaceAlt,
                  width: index === step ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.bottomBar}>
          {step < slides.length - 1 ? (
            <Button onPress={() => setStep(step + 1)} size="lg">
              Continue
            </Button>
          ) : (
            <Button onPress={handleFinish} size="lg">
              Get Started
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingVertical: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slideContainer: {
    alignItems: 'center',
    gap: 20,
    marginTop: 40,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  bottomBar: {
    width: '100%',
  },
});
