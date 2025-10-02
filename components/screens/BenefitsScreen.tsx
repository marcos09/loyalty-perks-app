import { useBenefitsData } from '@/hooks/use-benefits-data';
import { useFilterActions } from '@/hooks/use-filter-actions';
import { analyzeApiError } from '@/utils/error-handler';
import { useEffect, useRef } from 'react';
import { LoadingSkeleton } from '../benefits/LoadingSkeleton';
import { Screen } from '../layout/Screen';
import { BenefitsContent } from './BenefitsContent';
import { ErrorState } from './ErrorState';

export function BenefitsScreen() {
  const { benefits, loading, error, refetch } = useBenefitsData();
  const { handleClearFilters } = useFilterActions();
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

  if (loading && benefits.length === 0) {
    return (
      <Screen>
        <LoadingSkeleton />
      </Screen>
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
      <Screen>
        <ErrorState 
          error={error} 
          onRetry={errorInfo.isRetryable ? handleErrorRetry : () => {}}
          showDetails={__DEV__}
          title={errorInfo.title}
          description={errorInfo.description}
          onResetFilters={handleClearFilters}
          showResetFilters={errorInfo.shouldResetFilters}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <BenefitsContent />
    </Screen>
  );
}
