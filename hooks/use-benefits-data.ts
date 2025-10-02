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
  
  const benefits = useMemo(() => 
    data?.pages.flatMap(page => page.data) ?? [], 
    [data]
  );
  
  const total = useMemo(() => 
    data?.pages[0]?.total ?? benefits.length, 
    [data, benefits.length]
  );
  
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
