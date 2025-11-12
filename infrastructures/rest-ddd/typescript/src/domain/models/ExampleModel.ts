/**
 * Example Model (BMO) - Business Model Object
 * NO database attributes - pure business logic only.
 */

import { BaseModel } from './BaseModel';

export class ExampleModel extends BaseModel {
  /**
   * Example domain model demonstrating DDD principles.
   * 
   * Rules:
   * - Member fields prefixed with underscore: _variable
   * - NO database/ORM attributes
   * - Contains business logic and validation
   * - Located in /domain/models/
   */

  private _id?: string;
  private _name: string;
  private _description: string;
  private _status: ExampleStatus;
  private _ownerId: string;

  constructor(
    p_name: string,
    p_description: string,
    p_status: ExampleStatus,
    p_ownerId: string,
    p_id?: string
  ) {
    super();
    this._id = p_id;
    this._name = p_name;
    this._description = p_description;
    this._status = p_status;
    this._ownerId = p_ownerId;
  }

  // Getters
  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get status(): ExampleStatus {
    return this._status;
  }

  get ownerId(): string {
    return this._ownerId;
  }

  // Business logic methods
  validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Name is required');
    }

    if (this._name.length < 3) {
      throw new Error('Name must be at least 3 characters');
    }

    if (this._name.length > 100) {
      throw new Error('Name must not exceed 100 characters');
    }

    if (!this._ownerId) {
      throw new Error('Owner ID is required');
    }
  }

  activate(): void {
    if (this._status === ExampleStatus.ACTIVE) {
      throw new Error('Example is already active');
    }
    this._status = ExampleStatus.ACTIVE;
  }

  deactivate(): void {
    if (this._status === ExampleStatus.INACTIVE) {
      throw new Error('Example is already inactive');
    }
    this._status = ExampleStatus.INACTIVE;
  }

  updateDescription(p_description: string): void {
    if (p_description.length > 500) {
      throw new Error('Description must not exceed 500 characters');
    }
    this._description = p_description;
  }

  toObject(): Record<string, any> {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      status: this._status,
      ownerId: this._ownerId
    };
  }
}

export enum ExampleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}
