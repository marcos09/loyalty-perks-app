# React Query Integration Guide

This project now includes a complete React Query setup for efficient data fetching, caching, and state management.

## 🚀 Quick Start

### Basic Usage

```tsx
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Hello {data?.name}!</div>;
}
```

### Mutations

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function UpdateProfile() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: 'New Name' })}>
      Update Profile
    </button>
  );
}
```

## 📁 Project Structure

```
hooks/
├── api/
│   ├── api-client.ts          # HTTP client configuration
│   ├── api-instance.ts        # Main API client instance
│   ├── query-hooks.ts         # Generic React Query hooks
│   ├── use-benefit.ts         # Single benefit hook
│   ├── use-benefits.ts        # Benefits list hook
│   └── index.ts               # Exports
├── use-query-examples.ts      # Example hooks and patterns
└── use-benefits.ts            # Main benefits hook (updated)
```

## 🔧 Configuration

### QueryClient Setup

The QueryClient is configured in `contexts/query-client-provider.tsx` with:

- **Stale Time**: 5 minutes (data stays fresh)
- **Garbage Collection Time**: 10 minutes (unused data cleanup)
- **Retry Logic**: Smart retry with exponential backoff
- **Refetch Behavior**: Optimized for mobile apps

### Default Options

```typescript
{
  queries: {
    staleTime: 5 * 60 * 1000,        // 5 minutes
    gcTime: 10 * 60 * 1000,          // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry 4xx errors
      if (error?.status >= 400 && error?.status < 500) return false;
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,      // Disabled for mobile
    refetchOnMount: true,
    refetchOnReconnect: true,
  }
}
```

## 🎯 Available Hooks

### Core Hooks

#### `useBenefits(filters)`
Fetches benefits with infinite scroll pagination.

```tsx
const { data, loading, loadMore, hasMore } = useBenefits({
  selectedCategory: 'food',
  searchQuery: 'pizza',
  selectedDays: ['monday', 'tuesday'],
  onlyActive: true,
  sortBy: 'relevance',
});
```

#### `useBenefit(id)`
Fetches a single benefit by ID.

```tsx
const { data, loading, error, refetch } = useBenefit('benefit-123');
```

### Generic Hooks

#### `useApiQuery(options)`
Generic query hook with API integration.

```tsx
const { data, isLoading, error } = useApiQuery({
  queryKey: ['custom-data'],
  queryFn: () => apiClient.get('/custom-endpoint'),
  staleTime: 10 * 60 * 1000,
});
```

#### `useApiMutation(options)`
Generic mutation hook with API integration.

```tsx
const mutation = useApiMutation({
  mutationFn: (data) => apiClient.post('/endpoint', data),
  onSuccess: (data) => console.log('Success:', data),
});
```

#### `useApiInfiniteQuery(options)`
Generic infinite query hook for pagination.

```tsx
const { data, fetchNextPage, hasNextPage } = useApiInfiniteQuery({
  queryKey: ['infinite-data'],
  queryFn: ({ pageParam }) => fetchData(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextPage,
  initialPageParam: 1,
});
```

### Utility Hooks

#### `useApiQueryInvalidation()`
Query invalidation utilities.

```tsx
const { invalidateQueries, invalidateAllQueries } = useApiQueryInvalidation();

// Invalidate specific queries
invalidateQueries(['user']);

// Invalidate all queries
invalidateAllQueries();
```

#### `useApiQueryPrefetch()`
Query prefetching utilities.

```tsx
const { prefetchQuery } = useApiQueryPrefetch();

// Prefetch data
prefetchQuery(['user', userId], () => fetchUser(userId));
```

## 📚 Example Patterns

### 1. Dependent Queries

```tsx
function UserPosts({ userId }: { userId: string }) {
  // First, get user info
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Then, get user's posts (depends on user being loaded)
  const { data: posts } = useQuery({
    queryKey: ['user', userId, 'posts'],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user, // Only run when user is loaded
  });

  return <div>{posts?.map(post => <div key={post.id}>{post.title}</div>)}</div>;
}
```

### 2. Optimistic Updates

```tsx
function OptimisticUpdate() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateUser,
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user'] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(['user']);

      // Optimistically update
      queryClient.setQueryData(['user'], (old: any) => ({
        ...old,
        ...newData,
      }));

      return { previousData };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(['user'], context?.previousData);
    },
    onSettled: () => {
      // Refetch after success or error
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return <button onClick={() => mutation.mutate({ name: 'New Name' })}>
    Update
  </button>;
}
```

### 3. Background Refetching

```tsx
function RealtimeData() {
  const { data } = useQuery({
    queryKey: ['realtime-data'],
    queryFn: fetchRealtimeData,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchIntervalInBackground: true, // Continue in background
    staleTime: 0, // Always consider data stale
  });

  return <div>Data: {data?.value}</div>;
}
```

### 4. Prefetching

```tsx
function UserList() {
  const queryClient = useQueryClient();

  const prefetchUser = (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <div>
      {users.map(user => (
        <div
          key={user.id}
          onMouseEnter={() => prefetchUser(user.id)}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}
```

## 🔍 DevTools

React Query DevTools are automatically enabled in development mode. You can:

- Inspect query states
- View cache contents
- Trigger refetches
- Monitor query performance

## 🎨 Best Practices

### 1. Query Keys
Use consistent, hierarchical query keys:

```tsx
// Good
['user', userId]
['user', userId, 'posts']
['benefits', { category: 'food', search: 'pizza' }]

// Avoid
['userData']
['userPosts']
```

### 2. Error Handling
Always handle loading and error states:

```tsx
const { data, isLoading, error } = useQuery({...});

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <DataComponent data={data} />;
```

### 3. Stale Time
Set appropriate stale times based on data freshness needs:

```tsx
// User profile - changes rarely
staleTime: 10 * 60 * 1000, // 10 minutes

// Real-time data - changes frequently
staleTime: 0, // Always stale

// Static data - never changes
staleTime: Infinity,
```

### 4. Cache Management
Use invalidation strategically:

```tsx
// After creating a new item
queryClient.invalidateQueries({ queryKey: ['items'] });

// After updating a specific item
queryClient.invalidateQueries({ queryKey: ['item', itemId] });

// After deleting an item
queryClient.removeQueries({ queryKey: ['item', itemId] });
```

## 🚨 Common Pitfalls

1. **Don't use useEffect for data fetching** - Use useQuery instead
2. **Don't forget to handle loading states** - Always show loading indicators
3. **Don't over-invalidate** - Only invalidate when data actually changes
4. **Don't ignore error states** - Always handle and display errors
5. **Don't use stale closures** - Use proper dependency arrays

## 📖 Further Reading

- [React Query Documentation](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [Query Key Factory Pattern](https://tkdodo.eu/blog/effective-react-query-keys)
