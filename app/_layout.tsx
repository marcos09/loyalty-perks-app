import '@/i18n';
import { startMockServer } from '@/mocks/setup';
import { testApiEndpoints } from '@/utils/api-test';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

async function startMsw() {
  if (__DEV__) {
    startMockServer();
    // Test the API endpoints after a short delay
    setTimeout(() => {
      testApiEndpoints();
    }, 1000);
  }
}

export default function RootLayout() {
  useEffect(() => {
    startMsw();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
