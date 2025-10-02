import type { ApiError } from '@/types/api';

export interface ErrorInfo {
  title: string;
  description: string;
  isRetryable: boolean;
  shouldResetFilters: boolean;
  statusCode?: number;
}

export function analyzeApiError(error: unknown): ErrorInfo {
  const apiError = error as ApiError;
  const statusCode = apiError?.status;

  if (!statusCode || statusCode === 0) {
    return {
      title: 'Connection Error',
      description: 'Unable to connect to the server. Please check your internet connection and try again.',
      isRetryable: true,
      shouldResetFilters: true,
      statusCode: 0,
    };
  }

  if (statusCode >= 500) {
    return {
      title: 'Server Error',
      description: 'Our servers are experiencing issues. Please try again in a few moments.',
      isRetryable: true,
      shouldResetFilters: true,
      statusCode,
    };
  }

  if (statusCode >= 400) {
    switch (statusCode) {
      case 400:
        return {
          title: 'Bad Request',
          description: 'The request was invalid. Please check your input and try again.',
          isRetryable: false,
          shouldResetFilters: true,
          statusCode,
        };
      case 401:
        return {
          title: 'Unauthorized',
          description: 'You need to log in to access this resource.',
          isRetryable: false,
          shouldResetFilters: false,
          statusCode,
        };
      case 403:
        return {
          title: 'Forbidden',
          description: 'You do not have permission to access this resource.',
          isRetryable: false,
          shouldResetFilters: false,
          statusCode,
        };
      case 404:
        return {
          title: 'Not Found',
          description: 'The requested resource was not found.',
          isRetryable: false,
          shouldResetFilters: true,
          statusCode,
        };
      case 408:
        return {
          title: 'Request Timeout',
          description: 'The request took too long to complete. Please try again.',
          isRetryable: true,
          shouldResetFilters: true,
          statusCode,
        };
      case 429:
        return {
          title: 'Too Many Requests',
          description: 'You have made too many requests. Please wait a moment and try again.',
          isRetryable: true,
          shouldResetFilters: false,
          statusCode,
        };
      default:
        return {
          title: 'Request Failed',
          description: 'There was an issue with your request. Please try again.',
          isRetryable: false,
          shouldResetFilters: true,
          statusCode,
        };
    }
  }

  return {
    title: 'Unknown Error',
    description: 'An unexpected error occurred. Please try again.',
    isRetryable: true,
    shouldResetFilters: true,
    statusCode,
  };
}

export function getErrorMessage(error: unknown): string {
  const apiError = error as ApiError;
  return apiError?.message || String(error) || 'An unknown error occurred';
}

export function shouldRetryError(error: unknown): boolean {
  const apiError = error as ApiError;
  const statusCode = apiError?.status;

  if (!statusCode || statusCode === 0 || statusCode >= 500) {
    return true;
  }

  if (statusCode === 408 || statusCode === 429) {
    return true;
  }

  return false;
}
