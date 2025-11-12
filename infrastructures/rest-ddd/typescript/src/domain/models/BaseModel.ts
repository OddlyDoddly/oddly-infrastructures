/**
 * Base Model (BMO) - Business Model Object
 * Pure business logic with NO database attributes.
 * All domain models MUST extend this base class.
 */

export abstract class BaseModel {
  /**
   * Abstract base class for all Business Model Objects (BMOs).
   * 
   * Rules:
   * - NO database/persistence attributes
   * - Contains business logic and invariants
   * - Validates business rules
   * - Immutable by default (use readonly properties)
   */

  /**
   * Validate business invariants.
   * Throws exception if invalid.
   */
  abstract validate(): void;

  /**
   * Convert model to plain object representation.
   * Used by mappers for transformation.
   */
  abstract toObject(): Record<string, any>;
}
