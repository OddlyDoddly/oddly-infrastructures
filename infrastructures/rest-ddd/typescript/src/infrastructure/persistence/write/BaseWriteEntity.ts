/**
 * Base Write Entity - For Commands (CREATE, UPDATE, DELETE)
 * Used when business logic executes against data.
 * Contains all fields needed for business operations.
 */

export abstract class BaseWriteEntity {
  /**
   * Abstract base class for all Write Entities (Command side).
   * 
   * Rules:
   * - MUST be in /infrastructure/persistence/write/
   * - MUST suffix with 'WriteEntity'
   * - Contains ORM/database attributes
   * - Used for commands that modify data
   * - Contains version for optimistic locking
   */

  protected _id?: string;
  protected _version: number;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  constructor(
    p_id?: string,
    p_version?: number,
    p_createdAt?: Date,
    p_updatedAt?: Date
  ) {
    this._id = p_id;
    this._version = p_version || 1;
    this._createdAt = p_createdAt || new Date();
    this._updatedAt = p_updatedAt || new Date();
  }

  get id(): string | undefined {
    return this._id;
  }

  set id(p_value: string) {
    this._id = p_value;
  }

  get version(): number {
    return this._version;
  }

  set version(p_value: number) {
    this._version = p_value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(p_value: Date) {
    this._updatedAt = p_value;
  }

  /**
   * Increment version for optimistic locking.
   */
  incrementVersion(): void {
    this._version += 1;
    this._updatedAt = new Date();
  }
}
