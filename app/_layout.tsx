import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  HindSiliguri_400Regular,
  HindSiliguri_500Medium,
  HindSiliguri_600SemiBold,
  HindSiliguri_700Bold,
} from '@expo-google-fonts/hind-siliguri';

import { useTheme } from '@/theme/useTheme';
import { bootstrapDatabase } from '@/features/settings/hooks';
import { db } from '@/db/client';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/db/migrations/migrations';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useTheme();
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    HindSiliguri_400Regular,
    HindSiliguri_500Medium,
    HindSiliguri_600SemiBold,
    HindSiliguri_700Bold,
  });

  const { success, error: migrationError } = useMigrations(db, migrations);
  const ready = fontsLoaded && success;
  const error = fontError || migrationError;

  const bootstrappedRef = useRef(false);

  useEffect(() => {
    if (ready && !bootstrappedRef.current) {
      bootstrapDatabase(db);
      bootstrappedRef.current = true;
    }
  }, [ready]);

  useEffect(() => {
    if (ready || error) {
      void SplashScreen.hideAsync();
    }
  }, [ready, error]);

  if (!ready && !error) {
    return null;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to initialize app</Text>
        <Text style={styles.errorDetail}>{String(error)}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={theme.isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.bg } }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F7F7FC',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 13,
    color: '#6B6980',
    textAlign: 'center',
  },
});
