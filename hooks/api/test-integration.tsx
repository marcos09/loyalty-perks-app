// ============================================================================
// REACT QUERY INTEGRATION TEST
// ============================================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Button, Text, View } from 'react-native';

/**
 * Test component to verify React Query integration
 */
export function ReactQueryTest() {
  const queryClient = useQueryClient();

  // Test basic query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['test-query'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: 'React Query is working!', timestamp: Date.now() };
    },
    staleTime: 5 * 60 * 1000,
  });

  // Test mutation
  const mutation = useMutation({
    mutationFn: async (newMessage: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: newMessage, timestamp: Date.now() };
    },
    onSuccess: () => {
      // Invalidate test query to refetch
      queryClient.invalidateQueries({ queryKey: ['test-query'] });
    },
  });

  const handleUpdate = () => {
    mutation.mutate('Updated via mutation!');
  };

  const handleRefetch = () => {
    refetch();
  };

  const handleClearCache = () => {
    queryClient.clear();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        React Query Integration Test
      </Text>

      {isLoading && <Text>Loading...</Text>}
      
      {error && (
        <Text style={{ color: 'red' }}>
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      )}

      {data && (
        <View style={{ marginBottom: 20 }}>
          <Text>Data: {data.message}</Text>
          <Text>Timestamp: {new Date(data.timestamp).toLocaleTimeString()}</Text>
        </View>
      )}

      <View style={{ gap: 10 }}>
        <Button title="Refetch Query" onPress={handleRefetch} />
        <Button title="Update via Mutation" onPress={handleUpdate} />
        <Button title="Clear Cache" onPress={handleClearCache} />
      </View>

      {mutation.isPending && <Text>Mutation in progress...</Text>}
      {mutation.isError && (
        <Text style={{ color: 'red' }}>
          Mutation error: {mutation.error?.message}
        </Text>
      )}
      {mutation.isSuccess && (
        <Text style={{ color: 'green' }}>Mutation successful!</Text>
      )}
    </View>
  );
}
