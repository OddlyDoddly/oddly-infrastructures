import { Request, Response, NextFunction } from 'express';
import { ServiceException } from '../../application/errors/infra/ServiceException';
import { ErrorResponseDto } from '../dto/v1/responses/ErrorResponseDto';

/**
 * Middleware for handling errors and mapping them to HTTP responses.
 * MUST be applied LAST in the middleware pipeline (error handler).
 * 
 * This middleware:
 * - Catches all errors from controllers and services
 * - Maps ServiceExceptions to appropriate HTTP status codes
 * - Returns standardized error responses
 * - Logs errors for monitoring
 * 
 * Error code to HTTP status mapping:
 * - NotFound → 404
 * - Conflict → 409
 * - ValidationFailed → 400
 * - Unauthorized → 401
 * - Forbidden → 403
 * - Unknown → 500
 * 
 * Middleware order:
 * 1. Correlation ID → 2. Logging → 3. Authentication → 
 * 4. Authorization/Ownership → 5. UnitOfWork → 6. Controller →
 * 7. UnitOfWork commit/rollback → 8. Error Handling (THIS)
 */
export class ErrorHandlingMiddleware {
  /**
   * Error handler middleware function.
   * Use with Express: app.use((err, req, res, next) => ErrorHandlingMiddleware.Handle(err, req, res, next))
   */
  public static Handle(
    p_error: any,
    p_request: Request,
    p_response: Response,
    _p_next: NextFunction
  ): void {
    // Log error for monitoring
    console.error('[ErrorHandling] Error occurred:', p_error);

    // Get correlation ID for tracking
    const correlationId = p_request.headers['x-correlation-id'] as string || 'unknown';
    const path = p_request.path;

    // Check if error is a ServiceException
    if (p_error instanceof ServiceException) {
      const statusCode = ErrorHandlingMiddleware.MapErrorCodeToStatusCode(p_error.GenericErrorCode);
      
      const errorResponse = new ErrorResponseDto(
        p_error.GenericErrorCode,
        p_error.message,
        path,
        correlationId,
        p_error.Details
      );

      p_response.status(statusCode).json(errorResponse);
      return;
    }

    // Handle generic errors
    const errorResponse = new ErrorResponseDto(
      'InternalServerError',
      'An unexpected error occurred',
      path,
      correlationId
    );

    p_response.status(500).json(errorResponse);
  }

  /**
   * Maps error codes to HTTP status codes.
   */
  private static MapErrorCodeToStatusCode(p_errorCode: string): number {
    const mapping: Record<string, number> = {
      NotFound: 404,
      Conflict: 409,
      ValidationFailed: 400,
      Unauthorized: 401,
      Forbidden: 403,
      AlreadyExists: 409
    };

    return mapping[p_errorCode] || 500;
  }
}
