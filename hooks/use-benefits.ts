import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import { useCallback, useEffect, useState } from 'react';

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
  const [data, setData] = useState<Benefit[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats);
    } catch (e) {
      console.error('Failed to load categories:', e);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      console.log('useBenefits: Starting load with filters:', appliedFilters);
      setLoading(true);
      setError(null);
      setCurrentPage(1);
      setHasMore(true);
      // Don't clear data immediately - let the loading state show with previous data
      try {
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
        
        console.log('useBenefits: Fetching with filters:', filters);
        const res = await fetchBenefits(filters);
        console.log('useBenefits: Got response:', res);
        setData(res.data);
        setTotal(res.total);
        setHasMore(res.data.length < res.total);
      } catch (e) {
        console.error('useBenefits: Error:', e);
        setError(e);
      } finally {
        console.log('useBenefits: Setting loading to false');
        setLoading(false);
      }
    };

    load();
  }, [appliedFilters]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const filters = {
        category: appliedFilters.selectedCategory,
        search: appliedFilters.searchQuery,
        days: appliedFilters.selectedDays,
        onlyActive: appliedFilters.onlyActive,
        minDiscountPercent: appliedFilters.minDiscountPercent,
        sortBy: appliedFilters.sortBy,
        page: nextPage,
        limit: 20,
      };
      
      const res = await fetchBenefits(filters);
      setData(prev => [...prev, ...res.data]);
      setCurrentPage(nextPage);
      setHasMore(res.data.length === 20 && (data.length + res.data.length) < res.total);
    } catch (e) {
      setError(e);
    } finally {
      setLoadingMore(false);
    }
  }, [appliedFilters, currentPage, hasMore, loadingMore, data.length]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    setHasMore(true);
    try {
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
      
      const res = await fetchBenefits(filters);
      setData(res.data);
      setTotal(res.total);
      setHasMore(res.data.length < res.total);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

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
  const [data, setData] = useState<Benefit | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const benefit = await fetchBenefitById(id);
      setData(benefit);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    refetch: load,
  };
}


