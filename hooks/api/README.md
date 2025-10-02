# API Hooks Architecture

This directory contains a comprehensive, reusable architecture for API calls using React Query. The architecture provides centralized error handling, caching, and consistent patterns across the application.

## 🏗️ Architecture Overview

```
hooks/api/
├── api-client.ts          # Base API client with interceptors
├── api-instance.ts        # Configured API client instance
├── query-hooks.ts         # Generic React Query hooks factory
├── use-benefit.ts         # Individual benefit API hooks
├── use-benefits.ts        # Benefits list API hooks
├── index.ts              # Centralized exports
└── README.md             # This documentation
```

## 🚀 Key Features

### 1. **Centralized API Client**
- **Interceptors**: Request/response/error interceptors for global handling
- **Retry Logic**: Automatic retry with exponential backoff
- **Timeout Handling**: Configurable request timeouts
- **Error Handling**: Centralized error processing and logging

### 2. **Generic React Query Hooks**
- **`useApiQuery`**: Generic query hook with consistent options
- **`useApiMutation`**: Generic mutation hook with error handling
- **`useApiInfiniteQuery`**: Generic infinite query for pagination
- **`useApiQueryInvalidation`**: Query invalidation utilities
- **`useApiQueryPrefetch`**: Query prefetching utilities
- **`useApiQueryState`**: Query state management utilities

### 3. **Extensible Architecture**
- **Request Interceptors**: Add common headers or transformations
- **Error Interceptors**: Handle specific error responses globally
- **Custom Logic**: Easy to add logging, analytics, or other features

### 4. **Type Safety**
- **Full TypeScript Support**: Complete type coverage
- **Generic Types**: Reusable type definitions
- **API Response Types**: Consistent response handling

## 📖 Usage Examples

### Basic Query Hook

```typescript
import { useApiQuery } from '@/hooks/api';

function MyComponent() {
  const { data, loading, error, refetch } = useApiQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/users'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  
  return <UserList users={data} />;
}
```

### Mutation Hook

```typescript
import { useApiMutation } from '@/hooks/api';

function CreateUserForm() {
  const { mutate, isLoading, error } = useApiMutation<User, CreateUserData>({
    mutationFn: (userData) => apiClient.post('/users', userData),
    onSuccess: (user) => {
      console.log('User created:', user);
      // Invalidate users query
      queryClient.invalidateQueries(['users']);
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });

  const handleSubmit = (data: CreateUserData) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Infinite Query for Pagination

```typescript
import { useApiInfiniteQuery } from '@/hooks/api';

function InfiniteUserList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useApiInfiniteQuery<User[]>({
    queryKey: ['users', 'infinite'],
    queryFn: ({ pageParam = 1 }) => 
      apiClient.get('/users', { page: pageParam }),
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasMore ? pages.length + 1 : undefined,
    initialPageParam: 1,
  });

  const users = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <div>
      {users.map(user => <UserCard key={user.id} user={user} />)}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### Query Invalidation

```typescript
import { useApiQueryInvalidation } from '@/hooks/api';

function UserActions() {
  const { invalidateQueries, clearCache } = useApiQueryInvalidation();

  const handleRefresh = () => {
    invalidateQueries(['users']);
  };

  const handleClearCache = () => {
    clearCache();
  };

  return (
    <div>
      <button onClick={handleRefresh}>Refresh Users</button>
      <button onClick={handleClearCache}>Clear All Cache</button>
    </div>
  );
}
```

### Query Prefetching

```typescript
import { useApiQueryPrefetch } from '@/hooks/api';

function UserList() {
  const { prefetchQuery } = useApiQueryPrefetch();

  const handleUserHover = (userId: string) => {
    // Prefetch user details on hover
    prefetchQuery(
      ['user', userId],
      () => apiClient.get(`/users/${userId}`)
    );
  };

  return (
    <div>
      {users.map(user => (
        <div 
          key={user.id}
          onMouseEnter={() => handleUserHover(user.id)}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}
```

## 🔧 Configuration

### API Client Setup

```typescript
// hooks/api/api-instance.ts
import { createApiClient } from './api-client';
import { API_BASE_URL } from '@/config/api';

export const apiClient = createApiClient({
  baseURL: API_BASE_URL,
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for common transformations
apiClient.addRequestInterceptor((config) => {
  // Add any common headers or request transformations here
  // Example: Add timestamp, user agent, etc.
  return config;
});

// Add error handling interceptor
apiClient.addErrorInterceptor((error) => {
  if (error.status >= 500) {
    console.error('Server error:', error.message);
  } else if (error.status === 404) {
    console.warn('Resource not found:', error.config?.url);
  }
  return error;
});
```

### React Query Configuration

```typescript
// app/_layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
    </QueryClientProvider>
  );
}
```

## 🎯 Benefits

### 1. **Reusability**
- Generic hooks work with any API endpoint
- Consistent patterns across the application
- Easy to extend for new features

### 2. **Type Safety**
- Full TypeScript support
- Compile-time error checking
- IntelliSense and autocomplete

### 3. **Performance**
- Intelligent caching with React Query
- Background refetching
- Optimistic updates
- Request deduplication

### 4. **Error Handling**
- Centralized error processing
- Automatic retry logic
- Global error interceptors
- Consistent error states

### 5. **Developer Experience**
- Consistent API across the app
- Easy to test and mock
- Comprehensive logging
- Clear separation of concerns

## 🔄 Migration Guide

### From Old useBenefits Hook

**Before:**
```typescript
import { useBenefits } from '@/hooks/use-benefits';

function MyComponent() {
  const { data, loading, error } = useBenefits(filters);
  // ...
}
```

**After:**
```typescript
import { useBenefits } from '@/hooks/api';

function MyComponent() {
  const { data, loading, error } = useBenefits(filters);
  // Same API, better implementation!
}
```

### Creating New API Hooks

```typescript
// hooks/api/use-users.ts
import { useApiQuery, useApiMutation } from './query-hooks';
import { apiClient } from './api-instance';

export function useUsers() {
  return useApiQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/users'),
  });
}

export function useCreateUser() {
  return useApiMutation<User, CreateUserData>({
    mutationFn: (data) => apiClient.post('/users', data),
  });
}
```

## 🧪 Testing

### Mocking API Hooks

```typescript
// __mocks__/hooks/api.ts
export const useApiQuery = jest.fn(() => ({
  data: mockData,
  loading: false,
  error: null,
}));

export const useApiMutation = jest.fn(() => ({
  mutate: jest.fn(),
  isLoading: false,
  error: null,
}));
```

### Testing Components

```typescript
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MyComponent } from './MyComponent';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

test('renders user list', () => {
  const queryClient = createTestQueryClient();
  
  render(
    <QueryClientProvider client={queryClient}>
      <MyComponent />
    </QueryClientProvider>
  );
  
  expect(screen.getByText('User List')).toBeInTheDocument();
});
```

## 🚀 Future Enhancements

### Planned Features
- [ ] **Offline Support**: Cache data for offline usage
- [ ] **Real-time Updates**: WebSocket integration
- [ ] **Request Queuing**: Queue requests when offline
- [ ] **Analytics**: Track API usage and performance
- [ ] **Rate Limiting**: Built-in rate limiting support
- [ ] **Request Cancellation**: Cancel in-flight requests
- [ ] **Background Sync**: Sync data in background

This architecture provides a solid foundation for scalable, maintainable API interactions throughout your React Native application! 🎉
