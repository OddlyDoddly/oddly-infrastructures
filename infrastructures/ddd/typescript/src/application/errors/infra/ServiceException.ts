/**
 * Base class for all service exceptions.
 * Service exceptions:
 * - Live in /application/errors/ (NOT /services/)
 * - Suffix with "ServiceException"
 * - Pattern: {Object}ServiceException extends ServiceException<{Object}ErrorCode>
 * - Define error codes as enums (NOT strings)
 * - Include message templates for formatting
 * - Include optional details object
 * 
 * Error codes map to HTTP status codes:
 * - NotFound → 404
 * - Conflict → 409
 * - ValidationFailed → 400
 * - Unauthorized → 401
 * - Forbidden → 403
 * - Unknown → 500
 * 
 * Example usage:
 * throw new ExampleServiceException(
 *   ExampleErrorCode.NotFound,
 *   { id: exampleId }
 * );
 */
export abstract class ServiceException<TErrorCode> extends Error {
  public readonly ErrorCode: TErrorCode;
  public readonly Details?: Record<string, unknown>;

  protected constructor(
    p_errorCode: TErrorCode,
    p_messageTemplates: Record<string, string>,
    p_details?: Record<string, unknown>
  ) {
    const message = ServiceException.FormatMessage(
      p_errorCode,
      p_messageTemplates,
      p_details
    );
    super(message);
    
    this.ErrorCode = p_errorCode;
    this.Details = p_details;
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Formats the error message using the template and details.
   */
  private static FormatMessage<TErrorCode>(
    p_errorCode: TErrorCode,
    p_messageTemplates: Record<string, string>,
    p_details?: Record<string, unknown>
  ): string {
    const codeKey = String(p_errorCode);
    let template = p_messageTemplates[codeKey] || 'An error occurred';

    if (p_details) {
      // Replace placeholders like {id} with actual values from details
      for (const [key, value] of Object.entries(p_details)) {
        template = template.replace(`{${key}}`, String(value));
      }
    }

    return template;
  }

  /**
   * Gets the generic error code as a string.
   * Used by error handling middleware.
   */
  public get GenericErrorCode(): string {
    return String(this.ErrorCode);
  }
}
