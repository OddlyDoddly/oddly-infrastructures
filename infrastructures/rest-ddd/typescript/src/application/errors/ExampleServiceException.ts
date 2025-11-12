/**
 * Example Service Exception
 * Follows ServiceException pattern with error codes.
 */

import { ServiceException } from './ServiceException';

export enum ExampleErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  CONFLICT = 'CONFLICT',
  FORBIDDEN = 'FORBIDDEN'
}

export class ExampleServiceException extends ServiceException<ExampleErrorCode> {
  /**
   * Service exception for Example operations.
   * 
   * Rules:
   * - Located in /application/errors/
   * - Pattern: {Object}ServiceException
   * - Define error codes as enum
   * - Define message templates
   */

  private static readonly MESSAGE_TEMPLATES: Record<ExampleErrorCode, string> = {
    [ExampleErrorCode.NOT_FOUND]: "Example '{id}' not found",
    [ExampleErrorCode.VALIDATION_FAILED]: "Validation failed: {reason}",
    [ExampleErrorCode.CONFLICT]: "Example '{id}' already exists",
    [ExampleErrorCode.FORBIDDEN]: "Access to Example '{id}' is forbidden"
  };

  constructor(
    p_errorCode: ExampleErrorCode,
    p_details?: Record<string, any>
  ) {
    super(p_errorCode, ExampleServiceException.MESSAGE_TEMPLATES, p_details);
  }

  /**
   * Map error code to HTTP status code.
   */
  static toHttpStatus(p_errorCode: ExampleErrorCode): number {
    const mapping: Record<ExampleErrorCode, number> = {
      [ExampleErrorCode.NOT_FOUND]: 404,
      [ExampleErrorCode.VALIDATION_FAILED]: 400,
      [ExampleErrorCode.CONFLICT]: 409,
      [ExampleErrorCode.FORBIDDEN]: 403
    };

    return mapping[p_errorCode] || 500;
  }
}
