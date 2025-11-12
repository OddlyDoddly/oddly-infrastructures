/**
 * Example Service Interface
 * Defines contract for Example use-cases.
 */

import { ExampleModel } from '../../domain/models/ExampleModel';
import { ExampleReadEntity } from '../../infrastructure/persistence/read/ExampleReadEntity';

export interface IExampleService {
  /**
   * Service interface for Example operations.
   * 
   * Rules:
   * - Located in /application/services/
   * - Prefix with 'I' for interface
   * - Implementation in /application/services/impl/
   * - Orchestrates use-cases
   * - NO business logic (belongs in domain)
   */

  /**
   * Create a new Example.
   */
  createAsync(p_model: ExampleModel): Promise<string>;

  /**
   * Update an existing Example.
   */
  updateAsync(p_id: string, p_model: ExampleModel): Promise<void>;

  /**
   * Delete an Example.
   */
  deleteAsync(p_id: string): Promise<void>;

  /**
   * Get Example by ID.
   */
  getByIdAsync(p_id: string): Promise<ExampleReadEntity | null>;

  /**
   * List Examples with pagination.
   */
  listAsync(p_page: number, p_pageSize: number): Promise<ExampleReadEntity[]>;

  /**
   * Activate an Example.
   */
  activateAsync(p_id: string): Promise<void>;

  /**
   * Deactivate an Example.
   */
  deactivateAsync(p_id: string): Promise<void>;
}
