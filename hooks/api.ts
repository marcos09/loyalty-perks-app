import type { BenefitsResponse, CategoriesResponse, Category, FilterState } from '@/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const API_BASE_URL = "http://localhost:3000"

async function apiRequest<T>(endpoint: string): Promise<T> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
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

async function fetchBenefits(filters: FilterState, page: number = 1, limit: number = 20): Promise<BenefitsResponse> {
  const queryString = buildQueryString(filters, page, limit);
  const endpoint = queryString ? `/api/benefits?${queryString}` : '/api/benefits';
  
  const response = await apiRequest<BenefitsResponse>(endpoint);
  return response;
}

async function fetchCategories(): Promise<Category[]> {
  const response = await apiRequest<CategoriesResponse>('/api/benefits/categories');
  return response.data;
}

export function useBenefits(filters: FilterState) {
  return useInfiniteQuery({
    queryKey: ['benefits', filters],
    queryFn: ({ pageParam = 1 }) => fetchBenefits(filters, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((acc, page) => acc + page.data.length, 0);
      return totalLoaded < lastPage.total ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });
}
