/**
 * Example Service Implementation
 * Orchestrates Example use-cases.
 */

import { IExampleService } from '../IExampleService';
import { ExampleModel } from '../../../domain/models/ExampleModel';
import { ExampleReadEntity } from '../../../infrastructure/persistence/read/ExampleReadEntity';
import { ICommandRepository } from '../../../infrastructure/repositories/ICommandRepository';
import { IQueryRepository } from '../../../infrastructure/repositories/IQueryRepository';
import { IEventPublisher } from '../../../infrastructure/queues/IEventPublisher';
import { ExampleCreatedEvent } from '../../../domain/events/ExampleCreatedEvent';
import { ExampleMapper } from '../../mappers/ExampleMapper';
import { ExampleServiceException, ExampleErrorCode } from '../../errors/ExampleServiceException';

export class ExampleService implements IExampleService {
  /**
   * Service implementation for Example operations.
   * 
   * Rules:
   * - Located in /application/services/impl/
   * - Suffix with 'Service'
   * - Orchestrates use-cases
   * - Calls repositories and domain services
   * - NO business logic (belongs in domain models)
   * - Transaction managed by UnitOfWork middleware
   */

  constructor(
    private readonly _commandRepository: ICommandRepository<ExampleModel, string>,
    private readonly _queryRepository: IQueryRepository<ExampleReadEntity, string>,
    private readonly _eventPublisher: IEventPublisher,
    private readonly _mapper: ExampleMapper
  ) {}

  async createAsync(p_model: ExampleModel): Promise<string> {
    // Validate business rules
    p_model.validate();

    // Check for duplicates (example business rule)
    // const exists = await this._commandRepository.existsAsync(p_model.id);
    // if (exists) {
    //   throw new ExampleServiceException(
    //     ExampleErrorCode.CONFLICT,
    //     { id: p_model.id }
    //   );
    // }

    // Save to database
    const exampleId = await this._commandRepository.saveAsync(p_model);

    // Publish domain event
    await this._eventPublisher.publishAsync(
      new ExampleCreatedEvent(exampleId, p_model.name, p_model.ownerId),
      'example.created'
    );

    return exampleId;
  }

  async updateAsync(p_id: string, p_model: ExampleModel): Promise<void> {
    // Check if exists
    const exists = await this._commandRepository.existsAsync(p_id);
    if (!exists) {
      throw new ExampleServiceException(
        ExampleErrorCode.NOT_FOUND,
        { id: p_id }
      );
    }

    // Validate business rules
    p_model.validate();

    // Update in database
    await this._commandRepository.updateAsync(p_model);
  }

  async deleteAsync(p_id: string): Promise<void> {
    // Check if exists
    const exists = await this._commandRepository.existsAsync(p_id);
    if (!exists) {
      throw new ExampleServiceException(
        ExampleErrorCode.NOT_FOUND,
        { id: p_id }
      );
    }

    // Delete from database
    await this._commandRepository.deleteAsync(p_id);
  }

  async getByIdAsync(p_id: string): Promise<ExampleReadEntity | null> {
    // Query read entity
    const entity = await this._queryRepository.findByIdAsync(p_id);

    if (!entity) {
      throw new ExampleServiceException(
        ExampleErrorCode.NOT_FOUND,
        { id: p_id }
      );
    }

    return entity;
  }

  async listAsync(p_page: number, p_pageSize: number): Promise<ExampleReadEntity[]> {
    // Query read entities with pagination
    return await this._queryRepository.listByFilterAsync({}, p_page, p_pageSize);
  }

  async activateAsync(p_id: string): Promise<void> {
    // Get entity
    const entity = await this._queryRepository.findByIdAsync(p_id);
    if (!entity) {
      throw new ExampleServiceException(
        ExampleErrorCode.NOT_FOUND,
        { id: p_id }
      );
    }

    // Map to model
    const writeEntity = await this._getWriteEntity(p_id);
    const model = this._mapper.toModelFromWriteEntity(writeEntity);

    // Execute business logic
    model.activate();
    model.validate();

    // Update in database
    await this._commandRepository.updateAsync(model);
  }

  async deactivateAsync(p_id: string): Promise<void> {
    // Get entity
    const entity = await this._queryRepository.findByIdAsync(p_id);
    if (!entity) {
      throw new ExampleServiceException(
        ExampleErrorCode.NOT_FOUND,
        { id: p_id }
      );
    }

    // Map to model
    const writeEntity = await this._getWriteEntity(p_id);
    const model = this._mapper.toModelFromWriteEntity(writeEntity);

    // Execute business logic
    model.deactivate();
    model.validate();

    // Update in database
    await this._commandRepository.updateAsync(model);
  }

  private async _getWriteEntity(p_id: string): Promise<any> {
    // In real implementation, fetch from write repository
    // This is a placeholder
    throw new Error('Not implemented');
  }
}
