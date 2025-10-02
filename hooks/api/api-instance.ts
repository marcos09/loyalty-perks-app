// ============================================================================
// API INSTANCE
// ============================================================================

import { API_BASE_URL } from '@/config/api';
import { createApiClient } from './api-client';

/**
 * Create and configure the main API client instance
 */
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

// Add request interceptor for common headers or transformations
apiClient.addRequestInterceptor((config) => {
  // Add any common headers or request transformations here
  // Example: Add timestamp, user agent, etc.
  
  return config;
});

// Add response interceptor for error handling
apiClient.addResponseInterceptor((response) => {
  // Log successful responses in development
  if (__DEV__) {
    console.log('API Response:', response);
  }
  
  return response;
});

// Add error interceptor for global error handling
apiClient.addErrorInterceptor((error) => {
  // Log errors in development
  if (__DEV__) {
    console.error('API Error:', error);
  }
  
  // Handle specific error cases
  if (error.status >= 500) {
    // Handle server errors - show generic error message
    console.error('Server error:', error.message);
  } else if (error.status === 404) {
    // Handle not found errors
    console.warn('Resource not found:', error.config?.url);
  }
  
  return error;
});
