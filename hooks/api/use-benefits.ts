import type {
  BenefitsFilters,
  BenefitsResponse,
  FilterState,
  UseBenefitsReturn
} from '@/types';
import { apiClient } from './api-instance';
import { useApiInfiniteQuery, useApiQuery } from './query-hooks';
import { useCategories } from './use-categories';

function getBenefitsCacheKey(filters: FilterState) {
  return [
    'benefits',
    {
      category: filters.selectedCategory,
      search: filters.searchQuery,
      days: filters.selectedDays.sort(),
      onlyActive: filters.onlyActive,
      minDiscountPercent: filters.minDiscountPercent,
      sortBy: filters.sortBy,
    }
  ];
}

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

async function fetchBenefits(filters: BenefitsFilters): Promise<BenefitsResponse> {
  const queryString = buildQueryString(filters);
  const url = queryString ? `/api/benefits?${queryString}` : '/api/benefits';
  const response = await apiClient.get<BenefitsResponse>(url);
  return response.data;
}


export function useBenefits(appliedFilters: FilterState): UseBenefitsReturn {
  const cacheKey = getBenefitsCacheKey(appliedFilters);
  
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
  });

  const { data: categories = [] } = useCategories();

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
  });

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
    filtered: data,
    categories,
    loadMore,
    loadingMore,
    hasMore,
    total,
    loading,
    error,
    refetch,
  };
}
