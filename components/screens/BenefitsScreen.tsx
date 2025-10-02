import { useBenefitsData } from '@/hooks/use-benefits-data';
import { useFilterActions } from '@/hooks/use-filter-actions';
import { analyzeApiError } from '@/utils/error-handler';
import { useEffect, useRef, useState } from 'react';
import { BenefitsList } from '../benefits/BenefitsList';
import { LoadingSkeleton } from '../benefits/LoadingSkeleton';
import { FiltersModal } from '../filters/FiltersModal';
import { FiltersState } from '../filters/FiltersState';
import { ThemedView } from '../themed-view';
import { BenefitsHeader } from './BenefitsHeader';
import { ErrorState } from './ErrorState';

export function BenefitsScreen() {
  const { benefits, loading, error, refetch } = useBenefitsData();
  const { handleClearFilters, applyFilters, resetDraftToApplied } = useFilterActions();
  const previousErrorRef = useRef<unknown>(null);
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);

  useEffect(() => {
    if (error && error !== previousErrorRef.current) {
      previousErrorRef.current = error;
    }
  }, [error]);

  const handleErrorRetry = () => {
    refetch();
  };

  const handleOpenFilters = () => {
    setFiltersModalVisible(true);
  };

  const handleCloseFilters = () => {
    try {
      setFiltersModalVisible(false);
      resetDraftToApplied();
    } catch (error) {
      console.error('Error closing filters modal:', error);
      setFiltersModalVisible(false);
    }
  };

  const handleApplyFilters = () => {
    try {
      applyFilters();
      setFiltersModalVisible(false);
    } catch (error) {
      console.error('Error applying filters:', error);
      setFiltersModalVisible(false);
    }
  };

  const handleClearAllFilters = () => {
    try {
      handleClearFilters();
      setFiltersModalVisible(false);
    } catch (error) {
      console.error('Error clearing filters:', error);
      setFiltersModalVisible(false);
    }
  };

  if (loading && benefits.length === 0) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <LoadingSkeleton />
      </ThemedView>
    );
  }

  if (error) {
    const errorInfo = analyzeApiError(error);
    
    
    return (
      <ThemedView style={{ flex: 1 }}>
        <ErrorState 
          error={error} 
          onRetry={errorInfo.isRetryable ? handleErrorRetry : () => {}}
          showDetails={__DEV__}
          title={errorInfo.title}
          description={errorInfo.description}
          onResetFilters={handleClearFilters}
          showResetFilters={errorInfo.shouldResetFilters}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <BenefitsHeader onOpenFilters={handleOpenFilters} />
      <FiltersState />
      <BenefitsList onClearFilters={handleClearFilters} />
      
      <FiltersModal
        visible={filtersModalVisible}
        onClose={handleCloseFilters}
        onApply={handleApplyFilters}
        onClear={handleClearAllFilters}
      />
    </ThemedView>
  );
}
