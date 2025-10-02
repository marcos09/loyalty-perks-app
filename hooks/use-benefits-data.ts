import { useFilterContext } from '@/contexts/filter-context';
import { useMemo } from 'react';
import { useBenefits } from './api';

export function useBenefitsData() {
  const { appliedFilters } = useFilterContext();
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    isFetchingNextPage: loadingMore,
    hasNextPage,
    fetchNextPage 
  } = useBenefits(appliedFilters);
  
  // Flatten all pages into a single array
  const benefits = useMemo(() => 
    data?.pages.flatMap(page => page.data) ?? [], 
    [data]
  );
  
  // Get total count from first page
  const total = useMemo(() => 
    data?.pages[0]?.total ?? benefits.length, 
    [data, benefits.length]
  );
  
  // Check if there are applied filters
  const hasAppliedFilters = useMemo(() => 
    !!appliedFilters.selectedCategory ||
    appliedFilters.selectedDays.length > 0 ||
    !!appliedFilters.onlyActive ||
    appliedFilters.minDiscountPercent !== undefined ||
    appliedFilters.sortBy !== 'relevance' ||
    appliedFilters.searchQuery.trim().length > 0,
    [appliedFilters]
  );
  
  const loadMore = () => {
    if (hasNextPage && !loadingMore) {
      fetchNextPage();
    }
  };
  
  return {
    benefits,
    total,
    hasAppliedFilters,
    loading: isLoading,
    loadingMore,
    error,
    refetch,
    loadMore,
    hasNextPage,
  };
}
