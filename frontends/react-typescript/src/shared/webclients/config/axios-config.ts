import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { WebClientError, WebClientErrorCode } from '../errors/WebClientError'

/**
 * Axios Configuration
 * 
 * Base axios instance with interceptors for:
 * - Request authentication
 * - Error handling
 * - Logging
 */

/**
 * Create configured axios instance
 */
export function createAxiosInstance(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor - add auth token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('auth_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Add correlation ID for request tracing
      const correlationId = crypto.randomUUID()
      if (config.headers) {
        config.headers['x-correlation-id'] = correlationId
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor - handle errors
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const webClientError = mapAxiosErrorToWebClientError(error)
      return Promise.reject(webClientError)
    }
  )

  return instance
}

/**
 * Map Axios errors to WebClientError
 */
function mapAxiosErrorToWebClientError(error: AxiosError): WebClientError {
  const timestamp = new Date()
  const url = error.config?.url
  const method = error.config?.method?.toUpperCase()

  // Network error (no response from server)
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    return new WebClientError({
      code: WebClientErrorCode.NETWORK_ERROR,
      message: 'Network error occurred',
      url,
      method,
      timestamp,
    })
  }

  // Timeout
  if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
    return new WebClientError({
      code: WebClientErrorCode.TIMEOUT,
      message: 'Request timed out',
      url,
      method,
      timestamp,
    })
  }

  // Server responded with error status
  if (error.response) {
    const statusCode = error.response.status
    const data = error.response.data

    switch (statusCode) {
      case 400:
        return new WebClientError({
          code: WebClientErrorCode.BAD_REQUEST,
          message: 'Bad request',
          statusCode,
          url,
          method,
          timestamp,
          data,
        })

      case 401:
        return new WebClientError({
          code: WebClientErrorCode.UNAUTHORIZED,
          message: 'Unauthorized',
          statusCode,
          url,
          method,
          timestamp,
          data,
        })

      case 403:
        return new WebClientError({
          code: WebClientErrorCode.FORBIDDEN,
          message: 'Forbidden',
          statusCode,
          url,
          method,
          timestamp,
          data,
        })

      case 404:
        return new WebClientError({
          code: WebClientErrorCode.NOT_FOUND,
          message: 'Not found',
          statusCode,
          url,
          method,
          timestamp,
          data,
        })

      case 409:
        return new WebClientError({
          code: WebClientErrorCode.CONFLICT,
          message: 'Conflict',
          statusCode,
          url,
          method,
          timestamp,
          data,
        })

      case 500:
        return new WebClientError({
          code: WebClientErrorCode.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          statusCode,
          url,
          method,
          timestamp,
          data,
        })

      case 503:
        return new WebClientError({
          code: WebClientErrorCode.SERVICE_UNAVAILABLE,
          message: 'Service unavailable',
          statusCode,
          url,
          method,
          timestamp,
          data,
        })

      default:
        return new WebClientError({
          code: WebClientErrorCode.UNKNOWN_ERROR,
          message: `HTTP ${statusCode} error`,
          statusCode,
          url,
          method,
          timestamp,
          data,
        })
    }
  }

  // Unknown error
  return new WebClientError({
    code: WebClientErrorCode.UNKNOWN_ERROR,
    message: error.message || 'Unknown error occurred',
    url,
    method,
    timestamp,
  })
}

/**
 * Default axios instance for internal API
 */
export const defaultAxiosInstance = createAxiosInstance(
  import.meta.env.VITE_API_BASE_URL || '/api'
)
