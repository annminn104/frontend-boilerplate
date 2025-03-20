/**
 * Base API client for making HTTP requests to internal Next.js API routes
 */

// No need for API_BASE_URL since we're using relative paths for internal API routes

interface RequestOptions extends RequestInit {
  token?: string
}

export async function apiClient<T>(
  endpoint: string,
  { token, ...customConfig }: RequestOptions = {}
): Promise {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const config: RequestInit = {
    method: customConfig.method || 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (customConfig.body) {
    config.body = JSON.stringify(customConfig.body)
  }

  try {
    // Ensure endpoint starts with a slash
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const response = await fetch(`/api${normalizedEndpoint}`, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return Promise.reject(new Error(errorData.message || response.statusText))
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return {} as T
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API request failed:', error)
    return Promise.reject(error instanceof Error ? error : new Error('Unknown error occurred'))
  }
}

// API client with auth token
export function createAuthClient(token: string) {
  return {
    get: <T>(endpoint: string, customConfig: RequestOptions = {}) =>
      apiClient<T>(endpoint, { ...customConfig, token, method: 'GET' }),
    post: <T>(endpoint: string, data: any, customConfig: RequestOptions = {}) =>
      apiClient<T>(endpoint, { ...customConfig, token, method: 'POST', body: data }),
    put: <T>(endpoint: string, data: any, customConfig: RequestOptions = {}) =>
      apiClient<T>(endpoint, { ...customConfig, token, method: 'PUT', body: data }),
    patch: <T>(endpoint: string, data: any, customConfig: RequestOptions = {}) =>
      apiClient<T>(endpoint, { ...customConfig, token, method: 'PATCH', body: data }),
    delete: <T>(endpoint: string, customConfig: RequestOptions = {}) =>
      apiClient<T>(endpoint, { ...customConfig, token, method: 'DELETE' }),
  }
}

// API client without auth
export const client = {
  get: <T>(endpoint: string, customConfig: RequestOptions = {}) =>
    apiClient<T>(endpoint, { ...customConfig, method: 'GET' }),
  post: <T>(endpoint: string, data: any, customConfig: RequestOptions = {}) =>
    apiClient<T>(endpoint, { ...customConfig, method: 'POST', body: data }),
  put: <T>(endpoint: string, data: any, customConfig: RequestOptions = {}) =>
    apiClient<T>(endpoint, { ...customConfig, method: 'PUT', body: data }),
  patch: <T>(endpoint: string, data: any, customConfig: RequestOptions = {}) =>
    apiClient<T>(endpoint, { ...customConfig, method: 'PATCH', body: data }),
  delete: <T>(endpoint: string, customConfig: RequestOptions = {}) =>
    apiClient<T>(endpoint, { ...customConfig, method: 'DELETE' }),
}
