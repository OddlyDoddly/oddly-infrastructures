/**
 * Base class for all Business Model Objects (BMOs).
 * This class:
 * - Lives in /domain/models/infra/
 * - Contains common fields and validation logic
 * - MUST NOT have database/ORM attributes
 * - Uses member field naming convention: _variable
 * 
 * Domain models (BMOs):
 * - Contain business logic and invariants
 * - Are pure TypeScript/JavaScript objects
 * - Validate their own state
 * - Are persistence-ignorant
 */
export abstract class BaseModel {
  protected _id: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  constructor() {
    this._id = '';
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  public get Id(): string {
    return this._id;
  }

  public get CreatedAt(): Date {
    return this._createdAt;
  }

  public get UpdatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Validates the business invariants of the model.
   * Subclasses should override this method to add their own validation.
   * @throws Error if validation fails
   */
  public Validate(): void {
    if (!this._id) {
      throw new Error('Model ID cannot be empty');
    }
  }
}
