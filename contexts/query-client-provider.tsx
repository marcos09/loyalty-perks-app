// ============================================================================
// REACT QUERY PROVIDER
// ============================================================================

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { Platform } from 'react-native';

/**
 * Create a new QueryClient instance with default options
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Time in milliseconds that data remains fresh
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Time in milliseconds that unused/inactive cache data remains in memory
        gcTime: 10 * 60 * 1000, // 10 minutes
        // Retry failed requests
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch behavior
        refetchOnWindowFocus: false, // Disable refetch on window focus for mobile
        refetchOnMount: true, // Refetch when component mounts
        refetchOnReconnect: true, // Refetch when network reconnects
      },
      mutations: {
        // Retry failed mutations
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry up to 2 times for other errors
          return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });
}

/**
 * QueryClient Provider Component
 * 
 * This component provides React Query functionality to the entire app.
 * It creates a QueryClient instance and wraps the app with QueryClientProvider.
 */
export function QueryClientProviderWrapper({ children }: { children: React.ReactNode }) {
  // Create QueryClient instance once and keep it stable
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development and on web platform */}
      {__DEV__ && Platform.OS === 'web' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
