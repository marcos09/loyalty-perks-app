// API configuration
export const API_BASE_URL = __DEV__ 
  ? '' // For development with MSW (relative URLs)
  : 'https://api.your-production-domain.com'; // For production

export const API_ENDPOINTS = {
  BENEFITS: '/api/benefits',
  BENEFIT_BY_ID: (id: string) => `/api/benefits/${id}`,
  CATEGORIES: '/api/benefits/categories',
} as const;
