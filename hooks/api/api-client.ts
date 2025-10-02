import type {
    ApiError,
    ApiRequestConfig,
    ApiResponse
} from '@/types/api';
interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export type RequestInterceptor = (config: ApiRequestConfig) => ApiRequestConfig | Promise<ApiRequestConfig>;

export type ResponseInterceptor = (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;

export type ErrorInterceptor = (error: ApiError) => ApiError | Promise<ApiError>;
export class ApiClient {
  private config: Required<ApiClientConfig>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...config,
    };
  }

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  private async executeRequestInterceptors(config: ApiRequestConfig): Promise<ApiRequestConfig> {
    let processedConfig = { ...config };
    
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    
    return processedConfig;
  }

  private async executeResponseInterceptors(response: ApiResponse): Promise<ApiResponse> {
    let processedResponse = { ...response };
    
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }
    
    return processedResponse;
  }

  private async executeErrorInterceptors(error: ApiError): Promise<ApiError> {
    let processedError = { ...error };
    
    for (const interceptor of this.errorInterceptors) {
      processedError = await interceptor(processedError);
    }
    
    return processedError;
  }

  private buildURL(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    
    const baseURL = this.config.baseURL.endsWith('/') 
      ? this.config.baseURL.slice(0, -1) 
      : this.config.baseURL;
    
    const cleanURL = url.startsWith('/') ? url : `/${url}`;
    
    return `${baseURL}${cleanURL}`;
  }

  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    
    return searchParams.toString();
  }

  private createAbortController(): AbortController {
    const controller = new AbortController();
    
    setTimeout(() => {
      controller.abort();
    }, this.config.timeout);
    
    return controller;
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number = this.config.retries
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0 && this.shouldRetry(error as ApiError)) {
        await this.delay(this.config.retryDelay);
        return this.retryRequest(requestFn, retries - 1);
      }
      throw error;
    }
  }

  private shouldRetry(error: ApiError): boolean {
    return !error.status;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async request<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    try {
      const processedConfig = await this.executeRequestInterceptors(config);
      
      const fullURL = this.buildURL(processedConfig.url);
      const urlWithParams = processedConfig.params 
        ? `${fullURL}?${this.buildQueryString(processedConfig.params)}`
        : fullURL;

      const abortController = this.createAbortController();

      const fetchOptions: RequestInit = {
        method: processedConfig.method,
        headers: {
          ...this.config.headers,
          ...processedConfig.headers,
        },
        signal: abortController.signal,
      };

      if (processedConfig.data && processedConfig.method !== 'GET') {
        fetchOptions.body = JSON.stringify(processedConfig.data);
      }

      const response = await this.retryRequest(async () => {
        const res = await fetch(urlWithParams, fetchOptions);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const error: ApiError = new Error(`HTTP ${res.status}: ${res.statusText}`) as ApiError;
          error.status = res.status;
          error.response = {
            data: errorData,
            status: res.status,
            statusText: res.statusText,
            headers: {},
          };
          error.config = processedConfig;
          throw error;
        }

        return res;
      });

      const data = await response.json();
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      const apiResponse: ApiResponse<T> = {
        data,
        status: response.status,
        statusText: response.status,
        headers,
      };

      return await this.executeResponseInterceptors(apiResponse);

    } catch (error) {
      const apiError = error as ApiError;
      
      const processedError = await this.executeErrorInterceptors(apiError);
      
      throw processedError;
    }
  }

  async get<T = any>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
    });
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
    });
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
    });
  }

  async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
    });
  }

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
    });
  }
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}
