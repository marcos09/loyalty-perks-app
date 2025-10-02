// ============================================================================
// API-SPECIFIC TYPES
// ============================================================================

import type { SortBy } from './index';

/**
 * Backend DTO for benefit data
 */
export interface BenefitDto {
  id: string;
  title: string;
  discount: string;
  category: string;
  imageSquare: any; // TODO: Replace with proper image type
  imageHero: any; // TODO: Replace with proper image type
  description: string;
  validDays: string[];
  expiresAt: string;
}

/**
 * Benefits API response DTO
 */
export interface BenefitsResponseDto {
  data: BenefitDto[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
}

/**
 * Categories API response DTO
 */
export interface CategoriesResponseDto {
  data: string[];
  success: boolean;
}

/**
 * Benefits filters DTO for API requests
 */
export interface BenefitsFiltersDto {
  category?: string;
  search?: string;
  days?: string[];
  onlyActive?: boolean;
  minDiscountPercent?: number;
  sortBy?: SortBy;
  page?: number;
  limit?: number;
}

/**
 * Error response DTO
 */
export interface ErrorResponseDto {
  error: string;
  success: false;
}

// ============================================================================
// API ENDPOINT TYPES
// ============================================================================

/**
 * API endpoint configuration
 */
export interface ApiEndpoints {
  BENEFITS: string;
  BENEFIT_BY_ID: (id: string) => string;
  CATEGORIES: string;
}

/**
 * API configuration
 */
export interface ApiConfig {
  baseUrl: string;
  endpoints: ApiEndpoints;
  timeout: number;
  retries: number;
}

// ============================================================================
// API CLIENT TYPES
// ============================================================================

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * API request configuration
 */
export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * API error
 */
export interface ApiError extends Error {
  status?: number;
  response?: ApiResponse;
  config?: ApiRequestConfig;
}

// ============================================================================
// REACT QUERY API TYPES
// ============================================================================

/**
 * Query key factory for API endpoints
 */
export class ApiQueryKeys {
  static benefits = (filters?: Partial<BenefitsFiltersDto>) => 
    ['benefits', filters] as const;
  
  static benefit = (id: string) => 
    ['benefit', id] as const;
  
  static categories = () => 
    ['categories'] as const;
  
  static infiniteBenefits = (filters?: Partial<BenefitsFiltersDto>) => 
    [...this.benefits(filters), 'infinite'] as const;
}

/**
 * Query options for API calls
 */
export interface ApiQueryOptions {
  staleTime?: number;
  gcTime?: number;
  retry?: boolean | number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
}

// ============================================================================
// TYPE GUARDS FOR API RESPONSES
// ============================================================================

/**
 * Type guard for API success response
 */
export function isApiSuccess<T>(response: any): response is { data: T; success: true } {
  return response && response.success === true && 'data' in response;
}

/**
 * Type guard for API error response
 */
export function isApiError(response: any): response is { error: string; success: false } {
  return response && response.success === false && 'error' in response;
}

/**
 * Type guard for BenefitDto
 */
export function isBenefitDto(value: any): value is BenefitDto {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.discount === 'string' &&
    typeof value.category === 'string' &&
    typeof value.description === 'string' &&
    Array.isArray(value.validDays) &&
    typeof value.expiresAt === 'string'
  );
}

/**
 * Type guard for BenefitsResponseDto
 */
export function isBenefitsResponseDto(value: any): value is BenefitsResponseDto {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.success === 'boolean' &&
    typeof value.total === 'number' &&
    typeof value.page === 'number' &&
    typeof value.limit === 'number' &&
    Array.isArray(value.data)
  );
}

/**
 * Type guard for CategoriesResponseDto
 */
export function isCategoriesResponseDto(value: any): value is CategoriesResponseDto {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.success === 'boolean' &&
    Array.isArray(value.data) &&
    value.data.every((item: any) => typeof item === 'string')
  );
}
