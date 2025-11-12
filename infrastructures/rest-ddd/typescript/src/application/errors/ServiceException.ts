/**
 * Service Exception Base Classes
 * ALL service exceptions MUST follow this pattern.
 * Location: /application/errors/ (NOT /services/)
 */

export abstract class ServiceException<TErrorCode extends string> extends Error {
  /**
   * Abstract base class for all service exceptions.
   * 
   * Rules:
   * - Pattern: {Object}ServiceException
   * - Define: {Object}ErrorCode enum (NOT strings)
   * - Location: /application/errors/
   */

  public readonly errorCode: TErrorCode;
  public readonly details?: Record<string, any>;

  constructor(
    p_errorCode: TErrorCode,
    p_messageTemplates: Record<string, string>,
    p_details?: Record<string, any>
  ) {
    const message = ServiceException.formatMessage(
      p_errorCode,
      p_messageTemplates,
      p_details
    );
    super(message);
    
    this.errorCode = p_errorCode;
    this.details = p_details;
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  private static formatMessage(
    p_code: string,
    p_templates: Record<string, string>,
    p_details?: Record<string, any>
  ): string {
    const template = p_templates[p_code] || `Error: ${p_code}`;
    
    if (p_details) {
      return template.replace(/\{(\w+)\}/g, (match, key) => {
        return p_details[key]?.toString() || match;
      });
    }
    
    return template;
  }
}

// Example usage template:
/**
 * 
 * // Define error codes as const enum or string union
 * export enum FeatureErrorCode {
 *   NOT_FOUND = 'NOT_FOUND',
 *   VALIDATION_FAILED = 'VALIDATION_FAILED',
 *   CONFLICT = 'CONFLICT'
 * }
 * 
 * // Define service exception
 * export class FeatureServiceException extends ServiceException<FeatureErrorCode> {
 *   private static readonly MESSAGE_TEMPLATES: Record<FeatureErrorCode, string> = {
 *     [FeatureErrorCode.NOT_FOUND]: "Feature '{id}' not found",
 *     [FeatureErrorCode.VALIDATION_FAILED]: "Validation failed: {reason}",
 *     [FeatureErrorCode.CONFLICT]: "Feature '{id}' already exists"
 *   };
 * 
 *   constructor(
 *     p_errorCode: FeatureErrorCode,
 *     p_details?: Record<string, any>
 *   ) {
 *     super(p_errorCode, FeatureServiceException.MESSAGE_TEMPLATES, p_details);
 *   }
 * }
 * 
 * // Usage:
 * throw new FeatureServiceException(
 *   FeatureErrorCode.NOT_FOUND,
 *   { id: '123' }
 * );
 */
