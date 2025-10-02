// ============================================================================
// BENEFITS API HOOKS
// ============================================================================

import type {
    BenefitsFilters,
    BenefitsResponse,
    CategoriesResponse,
    Category,
    FilterState,
    UseBenefitsReturn
} from '@/types';
import { apiClient } from './api-instance';
import { useApiInfiniteQuery, useApiQuery } from './query-hooks';

/**
 * Generate cache key for benefits queries
 */
function getBenefitsCacheKey(filters: FilterState) {
  return [
    'benefits',
    {
      category: filters.selectedCategory,
      search: filters.searchQuery,
      days: filters.selectedDays.sort(), // Sort to ensure consistent cache keys
      onlyActive: filters.onlyActive,
      minDiscountPercent: filters.minDiscountPercent,
      sortBy: filters.sortBy,
    }
  ];
}

/**
 * Build query string from filters
 */
function buildQueryString(filters: BenefitsFilters): string {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.days && filters.days.length > 0) params.append('days', filters.days.join(','));
  if (filters.onlyActive) params.append('onlyActive', 'true');
  if (filters.minDiscountPercent !== undefined) params.append('minDiscountPercent', filters.minDiscountPercent.toString());
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  
  return params.toString();
}

/**
 * Fetch benefits with filters
 */
async function fetchBenefits(filters: BenefitsFilters): Promise<BenefitsResponse> {
  const queryString = buildQueryString(filters);
  const url = queryString ? `/benefits?${queryString}` : '/benefits';
  const response = await apiClient.get<BenefitsResponse>(url);
  return response.data;
}

/**
 * Fetch categories
 */
async function fetchCategories(): Promise<Category[]> {
  const response = await apiClient.get<CategoriesResponse>('/categories');
  return response.data.data;
}

/**
 * Hook to fetch benefits with filters
 */
export function useBenefits(appliedFilters: FilterState): UseBenefitsReturn {
  const cacheKey = getBenefitsCacheKey(appliedFilters);
  
  // Use React Query for benefits data
  const {
    data: benefitsData,
    isLoading: loading,
    error,
    refetch,
  } = useApiQuery<BenefitsResponse>({
    queryKey: cacheKey,
    queryFn: () => {
      console.log('useBenefits: Fetching with filters:', appliedFilters);
      const filters = {
        category: appliedFilters.selectedCategory,
        search: appliedFilters.searchQuery,
        days: appliedFilters.selectedDays,
        onlyActive: appliedFilters.onlyActive,
        minDiscountPercent: appliedFilters.minDiscountPercent,
        sortBy: appliedFilters.sortBy,
        page: 1,
        limit: 20,
      };
      
      return fetchBenefits(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Use React Query for categories
  const {
    data: categories = [],
  } = useApiQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories change less frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Use infinite query for pagination
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage: loadingMore,
  } = useApiInfiniteQuery<BenefitsResponse>({
    queryKey: [...cacheKey, 'infinite'],
    queryFn: ({ pageParam = 1 }) => {
      const filters = {
        category: appliedFilters.selectedCategory,
        search: appliedFilters.searchQuery,
        days: appliedFilters.selectedDays,
        onlyActive: appliedFilters.onlyActive,
        minDiscountPercent: appliedFilters.minDiscountPercent,
        sortBy: appliedFilters.sortBy,
        page: pageParam as number,
        limit: 20,
      };
      
      return fetchBenefits(filters);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const totalLoaded = pages.reduce((acc, page) => acc + page.data.length, 0);
      return totalLoaded < lastPage.total ? pages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Flatten all pages data
  const data = infiniteData?.pages.flatMap(page => page.data) ?? [];
  const total = benefitsData?.total ?? 0;
  const hasMore = hasNextPage ?? false;

  const loadMore = async () => {
    if (hasMore && !loadingMore) {
      await fetchNextPage();
    }
  };

  return {
    data,
    filtered: data, // Backend already filters, so filtered = data
    categories,
    // Pagination
    loadMore,
    loadingMore,
    hasMore,
    total,
    loading,
    error,
    refetch,
  };
}
