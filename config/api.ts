// API configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000' // For development with backend server
  : 'https://api.your-production-domain.com'; // For production

export const API_ENDPOINTS = {
  BENEFITS: '/api/benefits',
  BENEFIT_BY_ID: (id: string) => `/api/benefits/${id}`,
  CATEGORIES: '/api/benefits/categories',
} as const;
