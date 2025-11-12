/**
 * Example Write Entity - For Commands
 * Contains ORM/database attributes.
 * MUST suffix with 'WriteEntity'.
 */

import { BaseWriteEntity } from './BaseWriteEntity';

export class ExampleWriteEntity extends BaseWriteEntity {
  /**
   * Write Entity for command operations (CREATE, UPDATE, DELETE).
   * 
   * Rules:
   * - Located in /infrastructure/persistence/write/
   * - Suffix with 'WriteEntity'
   * - Contains database/ORM attributes
   * - Used for business operations
   */

  private _name: string;
  private _description: string;
  private _status: string;
  private _ownerId: string;

  constructor(
    p_name: string,
    p_description: string,
    p_status: string,
    p_ownerId: string,
    p_id?: string,
    p_version?: number,
    p_createdAt?: Date,
    p_updatedAt?: Date
  ) {
    super(p_id, p_version, p_createdAt, p_updatedAt);
    this._name = p_name;
    this._description = p_description;
    this._status = p_status;
    this._ownerId = p_ownerId;
  }

  // Getters and setters
  get name(): string {
    return this._name;
  }

  set name(p_value: string) {
    this._name = p_value;
  }

  get description(): string {
    return this._description;
  }

  set description(p_value: string) {
    this._description = p_value;
  }

  get status(): string {
    return this._status;
  }

  set status(p_value: string) {
    this._status = p_value;
  }

  get ownerId(): string {
    return this._ownerId;
  }

  set ownerId(p_value: string) {
    this._ownerId = p_value;
  }
}

// Example with MongoDB decorators (if using TypeORM or similar):
/**
 * import { Entity, Column, ObjectIdColumn } from 'typeorm';
 * 
 * @Entity('examples')
 * export class ExampleWriteEntity extends BaseWriteEntity {
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
 *   // ... rest of implementation
 * }
 */
