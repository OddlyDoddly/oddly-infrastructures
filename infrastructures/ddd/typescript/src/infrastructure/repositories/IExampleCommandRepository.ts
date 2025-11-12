import { ICommandRepository } from './infra/ICommandRepository';
import { ExampleModel } from '../../domain/models/ExampleModel';

/**
 * Command repository interface for Example entities.
 * Repository interfaces:
 * - Live in /infrastructure/repositories/
 * - Start with I prefix
 * - Extend ICommandRepository for write operations
 * - Implementations go in /infrastructure/repositories/impl/
 * 
 * Command repositories:
 * - Work with WriteEntities internally
 * - Receive BMOs from services
 * - Handle mapping BMO ↔ WriteEntity using mapper
 * - Return void or IDs
 */
export interface IExampleCommandRepository extends ICommandRepository<ExampleModel, string> {
  /**
   * Checks if an example with the given name exists.
   * Used for validation before creating/updating.
   */
  ExistsByNameAsync(p_name: string): Promise<boolean>;
}
