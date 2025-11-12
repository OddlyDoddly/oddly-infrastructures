/**
 * Base Read Entity - For Queries (SELECT)
 * Pre-rendered views optimized for front-end.
 * Denormalized for query performance.
 */

export abstract class BaseReadEntity {
  /**
   * Abstract base class for all Read Entities (Query side).
   * 
   * Rules:
   * - MUST be in /infrastructure/persistence/read/
   * - MUST suffix with 'ReadEntity'
   * - Pre-rendered views optimized for queries
   * - Denormalized data (may aggregate from multiple WriteEntities)
   * - NO version tracking needed (read-only)
   */

  protected _id?: string;

  constructor(p_id?: string) {
    this._id = p_id;
  }

  get id(): string | undefined {
    return this._id;
  }

  set id(p_value: string) {
    this._id = p_value;
  }
}
