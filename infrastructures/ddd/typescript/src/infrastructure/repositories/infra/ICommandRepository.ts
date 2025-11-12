/**
 * Base interface for command repositories (write operations in CQRS).
 * Command repositories:
 * - Work with WriteEntities internally
 * - Receive BMOs (Business Model Objects) from services
 * - Handle mapping from BMO to WriteEntity internally
 * - Return void or IDs (no entities returned to service layer)
 * 
 * @template TModel The business model object type (BMO)
 * @template TId The identifier type
 */
export interface ICommandRepository<TModel, TId> {
  /**
   * Saves a new entity to the database.
   * Maps BMO to WriteEntity internally.
   * @param p_model The business model to save
   * @returns The identifier of the created entity
   */
  SaveAsync(p_model: TModel): Promise<TId>;

  /**
   * Updates an existing entity in the database.
   * Maps BMO to WriteEntity internally.
   * @param p_model The business model to update
   */
  UpdateAsync(p_model: TModel): Promise<void>;

  /**
   * Deletes an entity from the database by its identifier.
   * @param p_id The identifier of the entity to delete
   */
  DeleteAsync(p_id: TId): Promise<void>;

  /**
   * Checks if an entity exists by its identifier.
   * @param p_id The identifier to check
   * @returns True if the entity exists, false otherwise
   */
  ExistsAsync(p_id: TId): Promise<boolean>;

  /**
   * Loads an entity by its identifier for business logic execution.
   * Maps WriteEntity to BMO internally.
   * @param p_id The identifier of the entity to load
   * @returns The business model or null if not found
   */
  FindByIdAsync(p_id: TId): Promise<TModel | null>;
}
