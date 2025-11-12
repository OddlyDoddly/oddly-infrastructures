/**
 * Example Read Entity - For Queries
 * Denormalized view optimized for front-end.
 * MUST suffix with 'ReadEntity'.
 */

import { BaseReadEntity } from './BaseReadEntity';

export class ExampleReadEntity extends BaseReadEntity {
  /**
   * Read Entity for query operations (SELECT).
   * 
   * Rules:
   * - Located in /infrastructure/persistence/read/
   * - Suffix with 'ReadEntity'
   * - Denormalized for query performance
   * - May aggregate from multiple WriteEntities
   * - NO version tracking (read-only)
   */

  private _name: string;
  private _description: string;
  private _status: string;
  private _ownerId: string;
  private _ownerName: string;  // Denormalized from User
  private _createdAt: string;
  private _updatedAt: string;

  constructor(
    p_id: string,
    p_name: string,
    p_description: string,
    p_status: string,
    p_ownerId: string,
    p_ownerName: string,
    p_createdAt: string,
    p_updatedAt: string
  ) {
    super(p_id);
    this._name = p_name;
    this._description = p_description;
    this._status = p_status;
    this._ownerId = p_ownerId;
    this._ownerName = p_ownerName;
    this._createdAt = p_createdAt;
    this._updatedAt = p_updatedAt;
  }

  // Getters only (read-only)
  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get status(): string {
    return this._status;
  }

  get ownerId(): string {
    return this._ownerId;
  }

  get ownerName(): string {
    return this._ownerName;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }
}

// Example with MongoDB decorators (if using TypeORM or similar):
/**
 * import { Entity, Column } from 'typeorm';
 * 
 * @Entity('examples_view')
 * export class ExampleReadEntity extends BaseReadEntity {
 *   @Column()
 *   private _name: string;
 * 
 *   @Column()
 *   private _description: string;
 * 
 *   @Column()
 *   private _status: string;
 * 
 *   @Column()
 *   private _ownerId: string;
 * 
 *   @Column()
 *   private _ownerName: string;
 * 
 *   @Column()
 *   private _createdAt: string;
 * 
 *   @Column()
 *   private _updatedAt: string;
 *   
 *   // ... rest of implementation
 * }
 */
