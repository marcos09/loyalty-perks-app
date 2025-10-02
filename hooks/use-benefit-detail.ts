import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

import { API_BASE_URL } from '@/config/api';
import type { Benefit } from '@/types';

async function fetchBenefit(id: string): Promise<Benefit> {
  // Add a 1.5 second delay to see loading states (remove in production)
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const response = await fetch(`${API_BASE_URL}/api/benefits/${id}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Benefit not found');
  }
  
  return result.data;
}

export function useBenefitDetail() {
  const params = useLocalSearchParams<{ id?: string }>();
  
  const { data: benefit, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['benefit', params?.id],
    queryFn: () => fetchBenefit(params!.id!),
    enabled: !!params?.id,
  });

  return {
    benefit,
    loading,
    error,
    refetch,
  };
}
