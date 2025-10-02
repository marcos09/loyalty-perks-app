import type { CategoriesResponse, Category } from '@/types';
import { apiClient } from './api-instance';
import { useApiQuery } from './query-hooks';

export type UseCategoriesReturn = {
  data: Category[];
  loading: boolean;
  error: unknown;
  refetch: () => void;
};

async function fetchCategories(): Promise<Category[]> {
  const response = await apiClient.get<CategoriesResponse>('/api/benefits/categories');
  return response.data.data;
}

export function useCategories(): UseCategoriesReturn {
  const {
    data = [],
    isLoading: loading,
    error,
    refetch,
  } = useApiQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories change less frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    data,
    loading,
    error,
    refetch,
  };
}
