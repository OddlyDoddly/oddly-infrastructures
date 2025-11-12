/**
 * Base WebClient Error
 * 
 * Base class for all WebClient-related errors.
 * Provides consistent error handling across all web service integrations.
 */
export class BaseWebClientError extends Error {
  constructor(
    message: string,
    public originalError?: unknown,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'BaseWebClientError';
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseWebClientError);
    }
  }
}
