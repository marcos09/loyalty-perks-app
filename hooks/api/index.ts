// ============================================================================
// API HOOKS EXPORTS
// ============================================================================

// Core API functionality
export { createApiClient } from './api-client';
export { apiClient } from './api-instance';

// Generic React Query hooks
export {
    useApiInfiniteQuery, useApiMutation, useApiQuery, useApiQueryInvalidation,
    useApiQueryPrefetch,
    useApiQueryState
} from './query-hooks';

// Specific API hooks
export { useBenefit } from './use-benefit';
export { useBenefits } from './use-benefits';

// React Query examples and utilities
export {
    useOptimisticUpdate, usePrefetchUserProfile, useQueryInvalidation, useRealtimeData, useUpdateUserProfile, useUserPosts, useUserProfile
} from '../use-query-examples';

// Re-export types for convenience
export type {
    UseApiInfiniteQueryOptions, UseApiMutationOptions, UseApiQueryOptions
} from './query-hooks';

