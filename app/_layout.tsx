import '@/i18n';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FilterProvider } from '@/contexts/filter-context';
import { QueryClientProviderWrapper } from '@/contexts/query-client-provider';

export default function RootLayout() {

  return (
    <SafeAreaProvider>
      <QueryClientProviderWrapper>
        <FilterProvider>
          <ThemeProvider value={DefaultTheme}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </FilterProvider>
      </QueryClientProviderWrapper>
    </SafeAreaProvider>
  );
}
