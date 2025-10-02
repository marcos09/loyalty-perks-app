/**
 * Centralized logging utility
 * Provides consistent logging across the application
 */

export const logger = {
  info: (message: string, data?: any) => {
    if (__DEV__) {
      console.log(`ℹ️ ${message}`, data || '');
    }
  },

  error: (message: string, error?: any) => {
    if (__DEV__) {
      console.error(`❌ ${message}`, error || '');
    }
  },

  warn: (message: string, data?: any) => {
    if (__DEV__) {
      console.warn(`⚠️ ${message}`, data || '');
    }
  },

  success: (message: string, data?: any) => {
    if (__DEV__) {
      console.log(`✅ ${message}`, data || '');
    }
  },

  api: {
    request: (url: string, method: string, data?: any) => {
      if (__DEV__) {
        console.log(`🌐 API ${method} ${url}`, data || '');
      }
    },

    response: (url: string, status: number, data?: any) => {
      if (__DEV__) {
        console.log(`📡 API Response ${status} ${url}`, data || '');
      }
    },

    error: (url: string, status: number, error?: any) => {
      if (__DEV__) {
        console.error(`💥 API Error ${status} ${url}`, error || '');
      }
    },
  },

  component: {
    render: (componentName: string, props?: any) => {
      if (__DEV__) {
        console.log(`🎨 ${componentName} render`, props || '');
      }
    },

    mount: (componentName: string) => {
      if (__DEV__) {
        console.log(`🚀 ${componentName} mounted`);
      }
    },

    unmount: (componentName: string) => {
      if (__DEV__) {
        console.log(`🛑 ${componentName} unmounted`);
      }
    },
  },
};
