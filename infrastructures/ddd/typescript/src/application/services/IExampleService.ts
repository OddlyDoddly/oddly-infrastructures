import { CreateExampleRequest } from '../../api/dto/v1/requests/CreateExampleRequest';
import { UpdateExampleRequest } from '../../api/dto/v1/requests/UpdateExampleRequest';
import { ExampleResponse } from '../../api/dto/v1/responses/ExampleResponse';

/**
 * Example service interface demonstrating service layer patterns.
 * Service interfaces:
 * - Live in /application/services/
 * - Start with I prefix
 * - Implementations go in /application/services/impl/
 * - Orchestrate use-cases, transactions, and policies
 * - Call repositories and domain services
 * - NO business logic (delegate to domain models)
 * 
 * Transactions are managed automatically by UnitOfWorkMiddleware.
 * Services should NEVER manually manage transactions.
 */
export interface IExampleService {
  /**
   * Creates a new example.
   * Transaction managed by UnitOfWork middleware.
   */
  CreateExampleAsync(
    p_request: CreateExampleRequest,
    p_userId: string,
    p_correlationId: string
  ): Promise<string>;

  /**
   * Updates an existing example.
   * Transaction managed by UnitOfWork middleware.
   */
  UpdateExampleAsync(p_id: string, p_request: UpdateExampleRequest, p_userId: string): Promise<void>;

  /**
   * Deletes an example.
   * Transaction managed by UnitOfWork middleware.
   */
  DeleteExampleAsync(p_id: string, p_userId: string): Promise<void>;

  /**
   * Gets an example by ID.
   * Uses read entity for optimized query.
   */
  GetExampleAsync(p_id: string): Promise<ExampleResponse>;

  /**
   * Lists all examples with pagination.
   * Uses read entities for optimized queries.
   */
  ListExamplesAsync(p_skip: number, p_take: number): Promise<ExampleResponse[]>;

  /**
   * Activates an example.
   */
  ActivateExampleAsync(p_id: string, p_userId: string): Promise<void>;

  /**
   * Deactivates an example.
   */
  DeactivateExampleAsync(p_id: string, p_userId: string): Promise<void>;
}
