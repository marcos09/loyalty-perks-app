import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export type Benefit = {
  id: string;
  title: string;
  discount: string;
  category: string;
  imageSquare: any;
  imageHero: any;
  description: string;
  validDays: string[];
  expiresAt: string;
};

export type SortBy =
  | 'relevance'
  | 'expiresAsc'
  | 'expiresDesc'
  | 'discountDesc'
  | 'titleAsc';

// Backend API response types
type BenefitsResponse = {
  data: Benefit[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
};

type CategoriesResponse = {
  data: string[];
  success: boolean;
};

// Build query string from filters
function buildQueryString(filters: {
  category?: string;
  search?: string;
  days?: string[];
  onlyActive?: boolean;
  minDiscountPercent?: number;
  sortBy?: SortBy;
  page?: number;
  limit?: number;
}): string {
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

async function fetchBenefits(filters: {
  category?: string;
  search?: string;
  days?: string[];
  onlyActive?: boolean;
  minDiscountPercent?: number;
  sortBy?: SortBy;
  page?: number;
  limit?: number;
} = {}): Promise<BenefitsResponse> {
  try {
    // Add a delay to see loading states
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const queryString = buildQueryString(filters);
    const url = `${API_BASE_URL}${API_ENDPOINTS.BENEFITS}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to fetch benefits:', error);
    throw error;
  }
}

async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: CategoriesResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
}

async function fetchBenefitById(id: string): Promise<Benefit> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BENEFIT_BY_ID(id)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Benefit not found');
    }
    return result.data;
  } catch (error) {
    console.error('Failed to fetch benefit:', error);
    throw error;
  }
}

export function useBenefits(appliedFilters: {
  selectedCategory?: string;
  searchQuery: string;
  selectedDays: string[];
  onlyActive: boolean;
  minDiscountPercent?: number;
  sortBy: SortBy;
}) {
  // Build query key for caching
  const queryKey = [
    'benefits',
    {
      category: appliedFilters.selectedCategory,
      search: appliedFilters.searchQuery,
      days: appliedFilters.selectedDays.sort(), // Sort to ensure consistent cache keys
      onlyActive: appliedFilters.onlyActive,
      minDiscountPercent: appliedFilters.minDiscountPercent,
      sortBy: appliedFilters.sortBy,
    }
  ];

  // Fetch categories with React Query
  const {
    data: categories = [],
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories change less frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Use infinite query for pagination
  const {
    data: infiniteData,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage: loadingMore,
    refetch,
  } = useInfiniteQuery({
    queryKey: [...queryKey, 'infinite'],
    queryFn: ({ pageParam = 1 }) => {
      console.log('useBenefits: Fetching with filters:', appliedFilters);
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Flatten all pages data
  const data = infiniteData?.pages.flatMap(page => page.data) ?? [];
  const total = infiniteData?.pages[0]?.total ?? 0;
  const hasMore = hasNextPage ?? false;

  const loadMore = useCallback(async () => {
    if (hasMore && !loadingMore) {
      await fetchNextPage();
    }
  }, [hasMore, loadingMore, fetchNextPage]);

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

export function useBenefit(id: string | undefined) {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['benefit', id],
    queryFn: () => fetchBenefitById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data,
    loading,
    error,
    refetch,
  };
}


