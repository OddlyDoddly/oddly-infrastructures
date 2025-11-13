/**
 * WebClient Error Types
 * 
 * Standardized error handling for all web requests.
 * UI can consume these errors for user-friendly messages.
 */

export enum WebClientErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface WebClientErrorDetails {
  code: WebClientErrorCode
  message: string
  statusCode?: number
  url?: string
  method?: string
  timestamp: Date
  data?: unknown
}

/**
 * WebClientError
 * 
 * Base error class for all web client exceptions.
 * Thrown by request functions and caught by UI.
 * 
 * @example
 * try {
 *   await authWebClient.login(credentials)
 * } catch (error) {
 *   if (error instanceof WebClientError) {
 *     if (error.code === WebClientErrorCode.UNAUTHORIZED) {
 *       showMessage('Invalid credentials')
 *     }
 *   }
 * }
 */
export class WebClientError extends Error {
  public readonly code: WebClientErrorCode
  public readonly statusCode?: number
  public readonly url?: string
  public readonly method?: string
  public readonly timestamp: Date
  public readonly data?: unknown

  constructor(details: WebClientErrorDetails) {
    super(details.message)
    this.name = 'WebClientError'
    this.code = details.code
    this.statusCode = details.statusCode
    this.url = details.url
    this.method = details.method
    this.timestamp = details.timestamp
    this.data = details.data

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WebClientError)
    }
  }

  /**
   * Check if error is a specific type
   */
  public is(code: WebClientErrorCode): boolean {
    return this.code === code
  }

  /**
   * Get user-friendly error message
   */
  public getUserMessage(): string {
    switch (this.code) {
      case WebClientErrorCode.NETWORK_ERROR:
        return 'Unable to connect. Please check your internet connection.'
      case WebClientErrorCode.TIMEOUT:
        return 'Request timed out. Please try again.'
      case WebClientErrorCode.UNAUTHORIZED:
        return 'Authentication failed. Please log in again.'
      case WebClientErrorCode.FORBIDDEN:
        return 'You do not have permission to perform this action.'
      case WebClientErrorCode.NOT_FOUND:
        return 'The requested resource was not found.'
      case WebClientErrorCode.BAD_REQUEST:
        return 'Invalid request. Please check your input.'
      case WebClientErrorCode.CONFLICT:
        return 'A conflict occurred. The resource may have been modified.'
      case WebClientErrorCode.INTERNAL_SERVER_ERROR:
        return 'A server error occurred. Please try again later.'
      case WebClientErrorCode.SERVICE_UNAVAILABLE:
        return 'Service is temporarily unavailable. Please try again later.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  /**
   * Convert to JSON for logging/telemetry
   */
  public toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      url: this.url,
      method: this.method,
      timestamp: this.timestamp.toISOString(),
      data: this.data,
    }
  }
}
