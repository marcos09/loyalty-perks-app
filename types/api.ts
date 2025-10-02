import type { SortBy } from './index';

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

export interface BenefitsResponseDto {
  data: BenefitDto[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
}

export interface CategoriesResponseDto {
  data: string[];
  success: boolean;
}

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

export interface ErrorResponseDto {
  error: string;
  success: false;
}


export interface ApiEndpoints {
  BENEFITS: string;
  BENEFIT_BY_ID: (id: string) => string;
  CATEGORIES: string;
}

export interface ApiConfig {
  baseUrl: string;
  endpoints: ApiEndpoints;
  timeout: number;
  retries: number;
}


export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError extends Error {
  status?: number;
  response?: ApiResponse;
  config?: ApiRequestConfig;
}


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

export interface ApiQueryOptions {
  staleTime?: number;
  gcTime?: number;
  retry?: boolean | number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
}


export function isApiSuccess<T>(response: any): response is { data: T; success: true } {
  return response && response.success === true && 'data' in response;
}

export function isApiError(response: any): response is { error: string; success: false } {
  return response && response.success === false && 'error' in response;
}

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

export function isCategoriesResponseDto(value: any): value is CategoriesResponseDto {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.success === 'boolean' &&
    Array.isArray(value.data) &&
    value.data.every((item: any) => typeof item === 'string')
  );
}
