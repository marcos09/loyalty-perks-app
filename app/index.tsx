import { SafeAreaView } from 'react-native-safe-area-context';

import { BenefitsContent } from '@/components/benefits-content';
import { ErrorState } from '@/components/error-state';
import { FiltersContainer } from '@/components/filters-container';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { ThemedView } from '@/components/themed-view';
import { useFilterContext } from '@/contexts/filter-context';
import { useBenefits } from '@/hooks/use-benefits';

export default function BenefitsScreen() {
  const { appliedFilters } = useFilterContext();
  const { loading, error, refetch, data } = useBenefits(appliedFilters);

  // Only show full screen loading on initial load (when data is empty)
  if (loading && data.length === 0) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <LoadingSkeleton />
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ErrorState error={error} onRetry={refetch} />
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


