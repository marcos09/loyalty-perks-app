import type { ApiError } from '@/types/api';

export interface ErrorInfo {
  title: string;
  description: string;
  isRetryable: boolean;
  shouldResetFilters: boolean;
  statusCode?: number;
}

/**
 * Analyzes an API error and returns appropriate error information
 */
export function analyzeApiError(error: unknown): ErrorInfo {
  const apiError = error as ApiError;
  const statusCode = apiError?.status;

  // Network/connection errors
  if (!statusCode || statusCode === 0) {
    return {
      title: 'Connection Error',
      description: 'Unable to connect to the server. Please check your internet connection and try again.',
      isRetryable: true,
      shouldResetFilters: true,
      statusCode: 0,
    };
  }

  // Server errors (5xx)
  if (statusCode >= 500) {
    return {
      title: 'Server Error',
      description: 'Our servers are experiencing issues. Please try again in a few moments.',
      isRetryable: true,
      shouldResetFilters: true,
      statusCode,
    };
  }

  // Client errors (4xx)
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

  // Unknown error
  return {
    title: 'Unknown Error',
    description: 'An unexpected error occurred. Please try again.',
    isRetryable: true,
    shouldResetFilters: true,
    statusCode,
  };
}

/**
 * Gets a user-friendly error message for display
 */
export function getErrorMessage(error: unknown): string {
  const apiError = error as ApiError;
  return apiError?.message || String(error) || 'An unknown error occurred';
}

/**
 * Determines if an error should trigger a retry
 */
export function shouldRetryError(error: unknown): boolean {
  const apiError = error as ApiError;
  const statusCode = apiError?.status;

  // Retry for network errors and server errors
  if (!statusCode || statusCode === 0 || statusCode >= 500) {
    return true;
  }

  // Retry for specific client errors
  if (statusCode === 408 || statusCode === 429) {
    return true;
  }

  return false;
}
