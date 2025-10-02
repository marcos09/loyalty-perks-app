import { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BenefitsContent } from '@/components/benefits-content';
import { ErrorState } from '@/components/error-state';
import { FiltersContainer } from '@/components/filters-container';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { ThemedView } from '@/components/themed-view';
import { useFilterContext } from '@/contexts/filter-context';
import { useBenefits } from '@/hooks/api';
import { analyzeApiError } from '@/utils/error-handler';

export default function BenefitsScreen() {
  const { appliedFilters, clearFilters } = useFilterContext();
  const { data, isLoading: loading, error, refetch } = useBenefits(appliedFilters);
  
  const benefits = data?.pages.flatMap(page => page.data) ?? [];
  const previousErrorRef = useRef<unknown>(null);

  useEffect(() => {
    if (error && error !== previousErrorRef.current) {
      const errorInfo = analyzeApiError(error);
      if (__DEV__) {
        console.log('API error detected:', {
          error,
          errorInfo,
          shouldResetFilters: errorInfo.shouldResetFilters,
        });
      }
      previousErrorRef.current = error;
    }
  }, [error]);

  const handleErrorRetry = () => {
    refetch();
  };

  const handleResetFilters = () => {
    clearFilters();
  };


  if (loading && benefits.length === 0) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <LoadingSkeleton />
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (error) {
    const errorInfo = analyzeApiError(error);
    
    if (__DEV__) {
      console.log('Error detected in BenefitsScreen:', {
        error,
        errorInfo,
        statusCode: errorInfo.statusCode,
        isRetryable: errorInfo.isRetryable,
        shouldResetFilters: errorInfo.shouldResetFilters,
      });
    }
    
    return (
      <ThemedView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ErrorState 
            error={error} 
            onRetry={errorInfo.isRetryable ? handleErrorRetry : () => {}}
            showDetails={__DEV__}
            title={errorInfo.title}
            description={errorInfo.description}
            onResetFilters={handleResetFilters}
            showResetFilters={errorInfo.shouldResetFilters}
          />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <FiltersContainer>
          {(onFiltersPress) => (
            <BenefitsContent onFiltersPress={onFiltersPress} />
          )}
        </FiltersContainer>
      </SafeAreaView>
    </ThemedView>
  );
}


