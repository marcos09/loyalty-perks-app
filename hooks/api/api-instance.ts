import { API_BASE_URL } from '@/config/api';
import { createApiClient } from './api-client';
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

apiClient.addRequestInterceptor((config) => {
  return config;
});

apiClient.addResponseInterceptor((response) => {
  if (__DEV__) {
    console.log('API Response:', response);
  }
  
  return response;
});

apiClient.addErrorInterceptor((error) => {
  if (__DEV__) {
    console.error('API Error intercepted:', {
      message: error.message,
      status: error.status,
      url: error.config?.url,
      error,
    });
  }
  
  if (error.status >= 500) {
    console.error('Server error:', error.message, 'Status:', error.status);
  } else if (error.status === 404) {
    console.warn('Resource not found:', error.config?.url);
  }
  
  return error;
});
