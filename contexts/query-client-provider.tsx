
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { Platform } from 'react-native';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        gcTime: 0,
        retry: (failureCount, error: any) => {
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry fewer times for 500 errors to show error faster
          if (error?.status >= 500) {
            return failureCount < 2;
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex, error: any) => {
          // Shorter delays for 500 errors to show error faster
          if (error?.status >= 500) {
            return Math.min(1000 * 2 ** attemptIndex, 5000); // 1s, 2s, max 5s
          }
          return Math.min(1000 * 2 ** attemptIndex, 30000); // 1s, 2s, 4s, 8s, 16s, max 30s
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: (failureCount, error: any) => {
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry more times for 500 errors
          if (error?.status >= 500) {
            return failureCount < 4;
          }
          return failureCount < 2;
        },
        retryDelay: (attemptIndex, error: any) => {
          // Longer delays for 500 errors
          if (error?.status >= 500) {
            return Math.min(2000 * 2 ** attemptIndex, 60000); // 2s, 4s, 8s, 16s, max 60s
          }
          return Math.min(1000 * 2 ** attemptIndex, 30000); // 1s, 2s, 4s, 8s, max 30s
        },
      },
    },
  });
}

export function QueryClientProviderWrapper({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {__DEV__ && Platform.OS === 'web' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
