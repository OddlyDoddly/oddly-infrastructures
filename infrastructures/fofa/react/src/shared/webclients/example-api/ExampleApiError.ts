import { BaseWebClientError } from '../infra/BaseWebClientError';

/**
 * Example API Error
 * 
 * Custom error class for ExampleApi-specific errors.
 * Extends BaseWebClientError to provide consistent error handling.
 */
export class ExampleApiError extends BaseWebClientError {
  constructor(message: string, originalError?: unknown, statusCode?: number) {
    super(message, originalError, statusCode);
    this.name = 'ExampleApiError';
  }
}
