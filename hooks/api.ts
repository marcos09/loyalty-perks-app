import { API_BASE_URL } from '@/config/api';
import type { BenefitsResponse, CategoriesResponse, Category, FilterState } from '@/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

// Simple API client
async function apiRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'API request failed');
  }
  
  return result;
}

// Build query string from filters
function buildQueryString(filters: FilterState, page: number = 1, limit: number = 20): string {
  const params = new URLSearchParams();
  
  if (filters.selectedCategory) params.append('category', filters.selectedCategory);
  if (filters.searchQuery) params.append('search', filters.searchQuery);
  if (filters.selectedDays.length > 0) params.append('days', filters.selectedDays.join(','));
  if (filters.onlyActive) params.append('onlyActive', 'true');
  if (filters.minDiscountPercent !== undefined) params.append('minDiscountPercent', filters.minDiscountPercent.toString());
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  return params.toString();
}

// Fetch benefits with filters and pagination
async function fetchBenefits(filters: FilterState, page: number = 1, limit: number = 20): Promise<BenefitsResponse> {
  const queryString = buildQueryString(filters, page, limit);
  const endpoint = queryString ? `/api/benefits?${queryString}` : '/api/benefits';
  
  const response = await apiRequest<BenefitsResponse>(endpoint);
  return response;
}

// Fetch categories
async function fetchCategories(): Promise<Category[]> {
  const response = await apiRequest<CategoriesResponse>('/api/benefits/categories');
  return response.data;
}

// Hook for benefits with filters and infinite scrolling
export function useBenefits(filters: FilterState) {
  return useInfiniteQuery({
    queryKey: ['benefits', filters],
    queryFn: ({ pageParam = 1 }) => fetchBenefits(filters, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
      return totalLoaded < lastPage.total ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for categories
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories change less frequently
  });
}
