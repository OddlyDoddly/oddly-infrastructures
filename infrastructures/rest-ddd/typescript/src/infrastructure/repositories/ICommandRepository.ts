/**
 * Command Repository Interface (Write Operations)
 * Works with WriteEntity, receives BMO, returns void/ID.
 */

export interface ICommandRepository<TModel, TId> {
  /**
   * Interface for Command Repository (CQRS Write side).
   * 
   * Rules:
   * - Receives BMO (Business Model Object)
   * - Maps BMO → WriteEntity internally
   * - Returns void or ID
   * - Handles CREATE, UPDATE, DELETE operations
   */

  /**
   * Save a new entity.
   * Maps BMO → WriteEntity internally.
   * Returns the generated ID.
   */
  saveAsync(p_model: TModel): Promise<TId>;

  /**
   * Update an existing entity.
   * Maps BMO → WriteEntity internally.
   */
  updateAsync(p_model: TModel): Promise<void>;

  /**
   * Delete an entity by ID.
   */
  deleteAsync(p_id: TId): Promise<void>;

  /**
   * Check if entity exists by ID.
   */
  existsAsync(p_id: TId): Promise<boolean>;
}
