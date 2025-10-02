export { createApiClient } from './api-client';
export { apiClient } from './api-instance';

export {
    useApiInfiniteQuery, useApiMutation, useApiQuery, useApiQueryInvalidation,
    useApiQueryPrefetch,
    useApiQueryState
} from './query-hooks';

export { useBenefit } from './use-benefit';
export { useBenefits } from './use-benefits';
export { useCategories } from './use-categories';

export {
    useOptimisticUpdate, usePrefetchUserProfile, useQueryInvalidation, useRealtimeData, useUpdateUserProfile, useUserPosts, useUserProfile
} from '../use-query-examples';

export type {
    UseApiInfiniteQueryOptions, UseApiMutationOptions, UseApiQueryOptions
} from './query-hooks';

