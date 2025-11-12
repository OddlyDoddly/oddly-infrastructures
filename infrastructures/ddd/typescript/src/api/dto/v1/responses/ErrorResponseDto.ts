/**
 * Standard error response DTO.
 * ALL error responses MUST follow this contract.
 * 
 * HTTP Status Code Mapping:
 * - NotFound → 404
 * - Conflict → 409
 * - ValidationFailed → 400
 * - Unauthorized → 401
 * - Forbidden → 403
 * - Unknown → 500
 * 
 * Example:
 * {
 *   "error": {
 *     "code": "NotFound",
 *     "message": "Example 'abc123' not found",
 *     "details": { "id": "abc123" },
 *     "timestamp": "2024-01-01T00:00:00Z",
 *     "path": "/api/v1/example/abc123",
 *     "requestId": "correlation-id-here"
 *   }
 * }
 */
export class ErrorResponseDto {
  public error: {
    /**
     * Error code from enum
     */
    code: string;

    /**
     * Human-readable error message
     */
    message: string;

    /**
     * Optional structured details
     */
    details?: Record<string, unknown>;

    /**
     * ISO 8601 timestamp
     */
    timestamp: string;

    /**
     * Request path
     */
    path: string;

    /**
     * Correlation/request ID
     */
    requestId: string;
  };

  constructor(
    p_code: string,
    p_message: string,
    p_path: string,
    p_requestId: string,
    p_details?: Record<string, unknown>
  ) {
    this.error = {
      code: p_code,
      message: p_message,
      details: p_details,
      timestamp: new Date().toISOString(),
      path: p_path,
      requestId: p_requestId
    };
  }
}
