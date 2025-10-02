import '@/i18n';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/error-boundary';
import { FilterProvider } from '@/contexts/filter-context';
import { QueryClientProviderWrapper } from '@/contexts/query-client-provider';

export default function RootLayout() {

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProviderWrapper>
          <FilterProvider>
            <ThemeProvider value={DefaultTheme}>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                <Stack.Screen name="error" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </FilterProvider>
        </QueryClientProviderWrapper>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
