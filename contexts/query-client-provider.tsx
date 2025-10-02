
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
          if (error?.status >= 500) {
            return failureCount < 2;
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex, error: any) => {
          if (error?.status >= 500) {
            return Math.min(1000 * 2 ** attemptIndex, 5000);
          }
          return Math.min(1000 * 2 ** attemptIndex, 30000);
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
          if (error?.status >= 500) {
            return failureCount < 4;
          }
          return failureCount < 2;
        },
        retryDelay: (attemptIndex, error: any) => {
          if (error?.status >= 500) {
            return Math.min(2000 * 2 ** attemptIndex, 60000);
          }
          return Math.min(1000 * 2 ** attemptIndex, 30000);
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
