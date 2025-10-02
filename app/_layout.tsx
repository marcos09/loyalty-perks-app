import '@/i18n';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/shared/error-boundary';
import { FilterProvider } from '@/contexts/filter-context';
import { QueryClientProviderWrapper } from '@/contexts/query-client-provider';

export default function RootLayout() {

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProviderWrapper>
          <FilterProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="benefit-detail" options={{ headerShown: false }} />
              <Stack.Screen name="error" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </FilterProvider>
        </QueryClientProviderWrapper>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
