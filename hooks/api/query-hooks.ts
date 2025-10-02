// ============================================================================
// GENERIC REACT QUERY HOOKS
// ============================================================================

import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    type MutationKey,
    type QueryKey,
    type UseInfiniteQueryOptions,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';

import type { ApiError, ApiResponse } from '@/types/api';

/**
 * Generic query hook options
 */
export interface UseApiQueryOptions<TData = any, TError = ApiError> extends Omit<
  UseQueryOptions<ApiResponse<TData>, TError, TData, QueryKey>,
  'queryFn' | 'queryKey'
> {
  queryKey: QueryKey;
  queryFn: () => Promise<ApiResponse<TData>>;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  retry?: boolean | number | ((failureCount: number, error: TError) => boolean);
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
}

/**
 * Generic mutation hook options
 */
export interface UseApiMutationOptions<TData = any, TVariables = any, TError = ApiError> extends Omit<
  UseMutationOptions<ApiResponse<TData>, TError, TVariables, MutationKey>,
  'mutationFn'
> {
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>;
  onSuccess?: (data: TData, variables: TVariables, context: any) => void;
  onError?: (error: TError, variables: TVariables, context: any) => void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables, context: any) => void;
}

/**
 * Generic infinite query hook options
 */
export interface UseApiInfiniteQueryOptions<TData = any, TError = ApiError> extends Omit<
  UseInfiniteQueryOptions<ApiResponse<TData>, TError, TData, QueryKey, number>,
  'queryFn' | 'queryKey'
> {
  queryKey: QueryKey;
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<ApiResponse<TData>>;
  getNextPageParam: (lastPage: ApiResponse<TData>, allPages: ApiResponse<TData>[]) => number | undefined;
  initialPageParam: number;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  retry?: boolean | number | ((failureCount: number, error: TError) => boolean);
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
}

/**
 * Generic query hook
 */
export function useApiQuery<TData = any, TError = ApiError>(
  options: UseApiQueryOptions<TData, TError>
) {
  const {
    queryKey,
    queryFn,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
    retry = 3,
    refetchOnWindowFocus = false,
    refetchOnMount = true,
    refetchOnReconnect = true,
    ...restOptions
  } = options;

  return useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    gcTime,
    retry,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
    ...restOptions,
  });
}

/**
 * Generic mutation hook
 */
export function useApiMutation<TData = any, TVariables = any, TError = ApiError>(
  options: UseApiMutationOptions<TData, TVariables, TError>
) {
  const {
    mutationFn,
    onSuccess,
    onError,
    onSettled,
    ...restOptions
  } = options;

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      onSuccess?.(data.data, variables, context);
    },
    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      onSettled?.(data?.data, error, variables, context);
    },
    ...restOptions,
  });
}

/**
 * Generic infinite query hook
 */
export function useApiInfiniteQuery<TData = any, TError = ApiError>(
  options: UseApiInfiniteQueryOptions<TData, TError>
) {
  const {
    queryKey,
    queryFn,
    getNextPageParam,
    initialPageParam,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
    retry = 3,
    refetchOnWindowFocus = false,
    refetchOnMount = true,
    refetchOnReconnect = true,
    ...restOptions
  } = options;

  return useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam,
    initialPageParam,
    enabled,
    staleTime,
    gcTime,
    retry,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
    ...restOptions,
  });
}

/**
 * Generic query invalidation hook
 */
export function useApiQueryInvalidation() {
  const queryClient = useQueryClient();

  const invalidateQueries = (queryKey: QueryKey) => {
    return queryClient.invalidateQueries({ queryKey });
  };

  const invalidateAllQueries = () => {
    return queryClient.invalidateQueries();
  };

  const removeQueries = (queryKey: QueryKey) => {
    return queryClient.removeQueries({ queryKey });
  };

  const clearCache = () => {
    return queryClient.clear();
  };

  const refetchQueries = (queryKey: QueryKey) => {
    return queryClient.refetchQueries({ queryKey });
  };

  return {
    invalidateQueries,
    invalidateAllQueries,
    removeQueries,
    clearCache,
    refetchQueries,
  };
}

/**
 * Generic query prefetching hook
 */
export function useApiQueryPrefetch() {
  const queryClient = useQueryClient();

  const prefetchQuery = async <TData = any>(
    queryKey: QueryKey,
    queryFn: () => Promise<ApiResponse<TData>>,
    options?: {
      staleTime?: number;
      gcTime?: number;
    }
  ) => {
    return queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: options?.staleTime ?? 5 * 60 * 1000,
      gcTime: options?.gcTime ?? 10 * 60 * 1000,
    });
  };

  const prefetchInfiniteQuery = async <TData = any>(
    queryKey: QueryKey,
    queryFn: ({ pageParam }: { pageParam: number }) => Promise<ApiResponse<TData>>,
    getNextPageParam: (lastPage: ApiResponse<TData>, allPages: ApiResponse<TData>[]) => number | undefined,
    initialPageParam: number,
    options?: {
      staleTime?: number;
      gcTime?: number;
    }
  ) => {
    return queryClient.prefetchInfiniteQuery({
      queryKey,
      queryFn,
      getNextPageParam,
      initialPageParam,
      staleTime: options?.staleTime ?? 5 * 60 * 1000,
      gcTime: options?.gcTime ?? 10 * 60 * 1000,
    });
  };

  return {
    prefetchQuery,
    prefetchInfiniteQuery,
  };
}

/**
 * Generic query state hook
 */
export function useApiQueryState() {
  const queryClient = useQueryClient();

  const getQueryData = <TData = any>(queryKey: QueryKey): TData | undefined => {
    return queryClient.getQueryData<TData>(queryKey);
  };

  const setQueryData = <TData = any>(
    queryKey: QueryKey,
    data: TData | ((oldData: TData | undefined) => TData)
  ) => {
    return queryClient.setQueryData(queryKey, data);
  };

  const getQueryState = (queryKey: QueryKey) => {
    return queryClient.getQueryState(queryKey);
  };

  const isQueryLoading = (queryKey: QueryKey): boolean => {
    const state = queryClient.getQueryState(queryKey);
    return state?.status === 'pending';
  };

  const isQueryError = (queryKey: QueryKey): boolean => {
    const state = queryClient.getQueryState(queryKey);
    return state?.status === 'error';
  };

  const isQuerySuccess = (queryKey: QueryKey): boolean => {
    const state = queryClient.getQueryState(queryKey);
    return state?.status === 'success';
  };

  return {
    getQueryData,
    setQueryData,
    getQueryState,
    isQueryLoading,
    isQueryError,
    isQuerySuccess,
  };
}
