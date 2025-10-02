
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

export interface UseApiMutationOptions<TData = any, TVariables = any, TError = ApiError> extends Omit<
  UseMutationOptions<ApiResponse<TData>, TError, TVariables, MutationKey>,
  'mutationFn' | 'onSuccess' | 'onError' | 'onSettled'
> {
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>;
  onSuccess?: (data: TData, variables: TVariables, context: any) => void;
  onError?: (error: TError, variables: TVariables, context: any) => void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables, context: any) => void;
}

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

export function useApiQuery<TData = any, TError = ApiError>(
  options: UseApiQueryOptions<TData, TError>
) {
  const {
    queryKey,
    queryFn,
    enabled = true,
    staleTime,
    gcTime,
    retry,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
    ...restOptions
  } = options;

  return useQuery({
    queryKey,
    queryFn,
    enabled,
    ...(staleTime !== undefined && { staleTime }),
    ...(gcTime !== undefined && { gcTime }),
    ...(retry !== undefined && { retry }),
    ...(refetchOnWindowFocus !== undefined && { refetchOnWindowFocus }),
    ...(refetchOnMount !== undefined && { refetchOnMount }),
    ...(refetchOnReconnect !== undefined && { refetchOnReconnect }),
    ...restOptions,
  });
}

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

export function useApiInfiniteQuery<TData = any, TError = ApiError>(
  options: UseApiInfiniteQueryOptions<TData, TError>
) {
  const {
    queryKey,
    queryFn,
    getNextPageParam,
    initialPageParam,
    enabled = true,
    staleTime,
    gcTime,
    retry,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
    ...restOptions
  } = options;

  return useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam,
    initialPageParam,
    enabled,
    ...(staleTime !== undefined && { staleTime }),
    ...(gcTime !== undefined && { gcTime }),
    ...(retry !== undefined && { retry }),
    ...(refetchOnWindowFocus !== undefined && { refetchOnWindowFocus }),
    ...(refetchOnMount !== undefined && { refetchOnMount }),
    ...(refetchOnReconnect !== undefined && { refetchOnReconnect }),
    ...restOptions,
  });
}

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
      ...(options?.staleTime !== undefined && { staleTime: options.staleTime }),
      ...(options?.gcTime !== undefined && { gcTime: options.gcTime }),
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
      ...(options?.staleTime !== undefined && { staleTime: options.staleTime }),
      ...(options?.gcTime !== undefined && { gcTime: options.gcTime }),
    });
  };

  return {
    prefetchQuery,
    prefetchInfiniteQuery,
  };
}

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
