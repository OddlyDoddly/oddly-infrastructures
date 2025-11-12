import { ServiceException } from './infra/ServiceException';

/**
 * Error codes for Example service exceptions.
 * MUST be an enum, NOT strings.
 */
export enum ExampleErrorCode {
  NotFound = 'NotFound',
  ValidationFailed = 'ValidationFailed',
  Conflict = 'Conflict',
  Unauthorized = 'Unauthorized',
  AlreadyExists = 'AlreadyExists'
}

/**
 * Example service exception demonstrating the service exception pattern.
 * Pattern: {Object}ServiceException extends ServiceException<{Object}ErrorCode>
 * Location: MUST be in /application/errors/ (NOT /services/)
 * 
 * Usage:
 * throw new ExampleServiceException(
 *   ExampleErrorCode.NotFound,
 *   { id: exampleId }
 * );
 */
export class ExampleServiceException extends ServiceException<ExampleErrorCode> {
  private static readonly _messageTemplates: Record<string, string> = {
    [ExampleErrorCode.NotFound]: "Example '{id}' not found",
    [ExampleErrorCode.ValidationFailed]: "Validation failed: {reason}",
    [ExampleErrorCode.Conflict]: "Example '{name}' already exists",
    [ExampleErrorCode.Unauthorized]: "You are not authorized to access example '{id}'",
    [ExampleErrorCode.AlreadyExists]: "Example with name '{name}' already exists"
  };

  constructor(p_code: ExampleErrorCode, p_details?: Record<string, unknown>) {
    super(p_code, ExampleServiceException._messageTemplates, p_details);
  }
}
