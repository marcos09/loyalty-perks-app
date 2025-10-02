// ============================================================================
// BENEFIT API HOOKS
// ============================================================================

import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import { useQuery } from '@tanstack/react-query';

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

export type UseBenefitReturn = {
  data: Benefit | undefined;
  loading: boolean;
  error: unknown;
  refetch: () => void;
};

/**
 * Fetch a single benefit by ID
 */
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

/**
 * Hook to fetch a single benefit by ID
 */
export function useBenefit(id: string | undefined): UseBenefitReturn {
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
