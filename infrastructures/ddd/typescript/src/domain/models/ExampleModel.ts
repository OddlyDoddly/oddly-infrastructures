import { BaseModel } from './infra/BaseModel';
import { randomUUID } from 'crypto';

/**
 * Example Business Model Object (BMO) demonstrating domain layer patterns.
 * This class:
 * - Lives in /domain/models/
 * - Has Model or BMO suffix
 * - Contains business logic and invariants
 * - MUST NOT have database/ORM attributes
 * - Uses member field naming convention: _variable
 * - Uses parameter naming convention: p_variable
 */
export class ExampleModel extends BaseModel {
  private _name: string;
  private _description: string;
  private _ownerId: string;
  private _isActive: boolean;

  public get Name(): string {
    return this._name;
  }

  public get Description(): string {
    return this._description;
  }

  public get OwnerId(): string {
    return this._ownerId;
  }

  public get IsActive(): boolean {
    return this._isActive;
  }

  // Private constructor for hydration from database
  private constructor() {
    super();
    this._name = '';
    this._description = '';
    this._ownerId = '';
    this._isActive = false;
  }

  /**
   * Public factory method for creating new instances.
   * Validates business rules before returning.
   */
  public static Create(p_name: string, p_description: string, p_ownerId: string): ExampleModel {
    const model = new ExampleModel();
    model._id = randomUUID();
    model._name = p_name;
    model._description = p_description;
    model._ownerId = p_ownerId;
    model._isActive = true;
    model._createdAt = new Date();
    model._updatedAt = new Date();

    model.Validate();
    return model;
  }

  /**
   * Factory method for hydration from persistence layer.
   * Used by repositories when loading from database.
   */
  public static Hydrate(
    p_id: string,
    p_name: string,
    p_description: string,
    p_ownerId: string,
    p_isActive: boolean,
    p_createdAt: Date,
    p_updatedAt: Date
  ): ExampleModel {
    const model = new ExampleModel();
    model._id = p_id;
    model._name = p_name;
    model._description = p_description;
    model._ownerId = p_ownerId;
    model._isActive = p_isActive;
    model._createdAt = p_createdAt;
    model._updatedAt = p_updatedAt;

    return model;
  }

  // Business logic methods

  /**
   * Updates the details of the example.
   * Validates business rules before applying changes.
   */
  public UpdateDetails(p_name: string, p_description: string): void {
    if (!p_name || p_name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }

    this._name = p_name;
    this._description = p_description;
    this._updatedAt = new Date();

    this.Validate();
  }

  /**
   * Activates the example.
   */
  public Activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  /**
   * Deactivates the example.
   */
  public Deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  /**
   * Validates that the user owns this resource.
   * Used by ownership middleware and service layer.
   */
  public ValidateOwnership(p_userId: string): void {
    if (this._ownerId !== p_userId) {
      throw new Error('User does not own this resource');
    }
  }

  /**
   * Validates business invariants.
   * Override from BaseModel to add domain-specific rules.
   */
  public override Validate(): void {
    super.Validate();

    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Example name cannot be empty');
    }

    if (this._name.length > 100) {
      throw new Error('Example name cannot exceed 100 characters');
    }

    if (!this._ownerId || this._ownerId.trim().length === 0) {
      throw new Error('Example must have an owner');
    }
  }
}
