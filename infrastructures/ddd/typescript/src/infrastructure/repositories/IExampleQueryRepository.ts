import { IQueryRepository } from './infra/IQueryRepository';
import { ExampleReadEntity } from '../persistence/read/ExampleReadEntity';

/**
 * Query repository interface for Example read entities.
 * Repository interfaces:
 * - Live in /infrastructure/repositories/
 * - Start with I prefix
 * - Extend IQueryRepository for read operations
 * - Implementations go in /infrastructure/repositories/impl/
 * 
 * Query repositories:
 * - Return ReadEntities directly to services
 * - No BMO mapping in read path for performance
 * - Optimized for query operations
 */
export interface IExampleQueryRepository extends IQueryRepository<ExampleReadEntity, string> {
  /**
   * Lists active examples with pagination.
   * Returns only active examples.
   */
  ListActiveAsync(p_skip: number, p_take: number): Promise<ExampleReadEntity[]>;

  /**
   * Lists examples by owner with pagination.
   */
  ListByOwnerAsync(p_ownerId: string, p_skip: number, p_take: number): Promise<ExampleReadEntity[]>;
}
