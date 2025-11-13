import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/**
 * Base RTK Query API
 * 
 * Provides:
 * - Base query with auth header injection
 * - Tag-based cache invalidation
 * - Error handling and retries
 * 
 * Features extend this via `injectEndpoints`
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    prepareHeaders: (headers) => {
      // Inject auth token from localStorage
      const token = localStorage.getItem('auth_token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      
      // Add correlation ID for request tracing
      const correlationId = crypto.randomUUID()
      headers.set('x-correlation-id', correlationId)
      
      return headers
    },
    // Credentials for CORS
    credentials: 'include',
  }),
  
  // Tag types for cache invalidation
  tagTypes: ['Auth', 'User', 'Photo', 'Album'],
  
  // Features inject endpoints here
  endpoints: () => ({}),
})

/**
 * Export hooks and utilities
 */
export const { middleware: apiMiddleware } = baseApi
