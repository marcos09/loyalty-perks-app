// ============================================================================
// REACT QUERY EXAMPLES AND UTILITIES
// ============================================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * Example: Simple data fetching with useQuery
 */
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://via.placeholder.com/150',
      };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Example: Mutation with useMutation
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, data };
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: ['user'] });
      console.log('Profile updated successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
    },
  });
}

/**
 * Example: Prefetching data
 */
export function usePrefetchUserProfile() {
  const queryClient = useQueryClient();

  const prefetchProfile = useCallback((userId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          id: userId,
          name: 'Prefetched User',
          email: 'prefetched@example.com',
        };
      },
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  return { prefetchProfile };
}

/**
 * Example: Optimistic updates
 */
export function useOptimisticUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newData: { id: string; name: string }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return newData;
    },
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user', newData.id] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['user', newData.id]);

      // Optimistically update to the new value
      queryClient.setQueryData(['user', newData.id], (old: any) => ({
        ...old,
        ...newData,
      }));

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, newData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['user', newData.id], context?.previousData);
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
}

/**
 * Example: Dependent queries
 */
export function useUserPosts(userId: string) {
  // First, get user info
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: userId, name: 'User Name' };
    },
  });

  // Then, get user's posts (depends on user being loaded)
  return useQuery({
    queryKey: ['user', userId, 'posts'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' },
      ];
    },
    enabled: !!user, // Only run when user is loaded
  });
}

/**
 * Example: Background refetching
 */
export function useRealtimeData() {
  return useQuery({
    queryKey: ['realtime-data'],
    queryFn: async () => {
      const response = await fetch('/api/realtime');
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchIntervalInBackground: true, // Continue refetching in background
    staleTime: 0, // Always consider data stale
  });
}

/**
 * Example: Query invalidation utilities
 */
export function useQueryInvalidation() {
  const queryClient = useQueryClient();

  const invalidateUserQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
  }, [queryClient]);

  const invalidateAllQueries = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  const removeUserQueries = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['user'] });
  }, [queryClient]);

  return {
    invalidateUserQueries,
    invalidateAllQueries,
    removeUserQueries,
  };
}
