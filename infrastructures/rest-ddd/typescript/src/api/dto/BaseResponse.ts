/**
 * Base Response DTOs
 * Standard HTTP response contracts.
 */

export class BaseResponse {
  /**
   * Base response DTO for successful operations.
   */
}

export interface ErrorResponse {
  /**
   * Standard error response contract.
   * 
   * Rules:
   * - MUST follow this structure for all errors
   * - Status code mapping handled by middleware
   * - NO internal details leaked in production
   */
  error: {
    code: string;              // Error code from enum
    message: string;           // Human-readable message
    timestamp: string;         // ISO 8601
    path: string;              // Request path
    requestId: string;         // Correlation ID
    details?: Record<string, any>;  // Optional structured details
  };
}

export function createErrorResponse(
  p_code: string,
  p_message: string,
  p_path: string,
  p_requestId: string,
  p_details?: Record<string, any>
): ErrorResponse {
  return {
    error: {
      code: p_code,
      message: p_message,
      timestamp: new Date().toISOString(),
      path: p_path,
      requestId: p_requestId,
      details: p_details
    }
  };
}

export interface PaginatedResponse<T> extends BaseResponse {
  /**
   * Base response for paginated queries.
   */
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export function createPaginatedResponse<T>(
  p_items: T[],
  p_page: number,
  p_pageSize: number,
  p_totalCount: number
): PaginatedResponse<T> {
  return {
    items: p_items,
    page: p_page,
    pageSize: p_pageSize,
    totalCount: p_totalCount,
    totalPages: Math.ceil(p_totalCount / p_pageSize)
  };
}
