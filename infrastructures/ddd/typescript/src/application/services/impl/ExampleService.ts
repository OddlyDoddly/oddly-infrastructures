import { IExampleService } from '../IExampleService';
import { CreateExampleRequest } from '../../../api/dto/v1/requests/CreateExampleRequest';
import { UpdateExampleRequest } from '../../../api/dto/v1/requests/UpdateExampleRequest';
import { ExampleResponse } from '../../../api/dto/v1/responses/ExampleResponse';
import { IExampleCommandRepository } from '../../../infrastructure/repositories/IExampleCommandRepository';
import { IExampleQueryRepository } from '../../../infrastructure/repositories/IExampleQueryRepository';
import { ExampleMapper } from '../../mappers/ExampleMapper';
import { ExampleModel } from '../../../domain/models/ExampleModel';
import { ExampleServiceException, ExampleErrorCode } from '../../errors/ExampleServiceException';
import { IEventPublisher } from '../../../infrastructure/queues/infra/IEventPublisher';
import { ExampleCreatedEvent } from '../../../domain/events/ExampleCreatedEvent';
import { ExampleUpdatedEvent } from '../../../domain/events/ExampleUpdatedEvent';
import { ExampleDeletedEvent } from '../../../domain/events/ExampleDeletedEvent';

/**
 * Example service implementation demonstrating service layer patterns.
 * Service implementations:
 * - Live in /application/services/impl/
 * - Implement service interface from parent directory
 * - Orchestrate use-cases, transactions, and policies
 * - Call repositories and domain services
 * - NO business logic (delegate to domain models)
 * - Publish domain events for subdomain communication
 * 
 * Transactions are managed automatically by UnitOfWorkMiddleware.
 * This service does NOT manually manage transactions.
 */
export class ExampleService implements IExampleService {
  private readonly _commandRepository: IExampleCommandRepository;
  private readonly _queryRepository: IExampleQueryRepository;
  private readonly _mapper: ExampleMapper;
  private readonly _eventPublisher: IEventPublisher;

  constructor(
    p_commandRepository: IExampleCommandRepository,
    p_queryRepository: IExampleQueryRepository,
    p_eventPublisher: IEventPublisher
  ) {
    this._commandRepository = p_commandRepository;
    this._queryRepository = p_queryRepository;
    this._mapper = new ExampleMapper();
    this._eventPublisher = p_eventPublisher;
  }

  /**
   * Creates a new example.
   * 1. Map request to BMO
   * 2. Validate business rules (BMO handles this)
   * 3. Save via command repository
   * 4. Publish domain event
   */
  public async CreateExampleAsync(
    p_request: CreateExampleRequest,
    p_userId: string,
    p_correlationId: string
  ): Promise<string> {
    // Check if example with same name already exists
    const exists = await this._commandRepository.ExistsByNameAsync(p_request.Name);
    if (exists) {
      throw new ExampleServiceException(ExampleErrorCode.AlreadyExists, {
        name: p_request.Name
      });
    }

    // Create BMO from request (business logic in domain model)
    const model = ExampleModel.Create(p_request.Name, p_request.Description, p_userId);

    // Save via command repository (handles BMO → WriteEntity mapping)
    const exampleId = await this._commandRepository.SaveAsync(model);

    // Publish domain event for subdomain communication
    const createdEvent = new ExampleCreatedEvent(
      exampleId,
      model.Name,
      model.OwnerId,
      p_correlationId
    );
    await this._eventPublisher.PublishAsync(createdEvent, 'example.created');

    return exampleId;
  }

  /**
   * Updates an existing example.
   * 1. Load BMO from command repository
   * 2. Validate ownership
   * 3. Update BMO (business logic in domain model)
   * 4. Save via command repository
   * 5. Publish domain event
   */
  public async UpdateExampleAsync(
    p_id: string,
    p_request: UpdateExampleRequest,
    p_userId: string
  ): Promise<void> {
    // Load model from command repository
    const model = await this._commandRepository.FindByIdAsync(p_id);
    if (!model) {
      throw new ExampleServiceException(ExampleErrorCode.NotFound, { id: p_id });
    }

    // Validate ownership
    try {
      model.ValidateOwnership(p_userId);
    } catch {
      throw new ExampleServiceException(ExampleErrorCode.Unauthorized, { id: p_id });
    }

    // Update model (business logic in domain model)
    model.UpdateDetails(p_request.Name, p_request.Description);

    // Save via command repository
    await this._commandRepository.UpdateAsync(model);

    // Publish domain event
    const updatedEvent = new ExampleUpdatedEvent(
      model.Id,
      model.Name,
      model.OwnerId,
      '' // correlationId should be passed from controller
    );
    await this._eventPublisher.PublishAsync(updatedEvent, 'example.updated');
  }

  /**
   * Deletes an example.
   * 1. Load BMO from command repository
   * 2. Validate ownership
   * 3. Delete via command repository
   * 4. Publish domain event
   */
  public async DeleteExampleAsync(p_id: string, p_userId: string): Promise<void> {
    // Load model from command repository
    const model = await this._commandRepository.FindByIdAsync(p_id);
    if (!model) {
      throw new ExampleServiceException(ExampleErrorCode.NotFound, { id: p_id });
    }

    // Validate ownership
    try {
      model.ValidateOwnership(p_userId);
    } catch {
      throw new ExampleServiceException(ExampleErrorCode.Unauthorized, { id: p_id });
    }

    // Delete via command repository
    await this._commandRepository.DeleteAsync(p_id);

    // Publish domain event
    const deletedEvent = new ExampleDeletedEvent(p_id, model.OwnerId, '');
    await this._eventPublisher.PublishAsync(deletedEvent, 'example.deleted');
  }

  /**
   * Gets an example by ID.
   * Uses query repository for optimized read.
   * Returns ReadEntity directly (no BMO mapping for performance).
   */
  public async GetExampleAsync(p_id: string): Promise<ExampleResponse> {
    // Query from read repository
    const entity = await this._queryRepository.FindByIdAsync(p_id);
    if (!entity) {
      throw new ExampleServiceException(ExampleErrorCode.NotFound, { id: p_id });
    }

    // Map ReadEntity → Response DTO (bypasses BMO for performance)
    return this._mapper.ToResponseFromReadEntity(entity);
  }

  /**
   * Lists all examples with pagination.
   * Uses query repository for optimized reads.
   */
  public async ListExamplesAsync(p_skip: number, p_take: number): Promise<ExampleResponse[]> {
    // Query from read repository
    const entities = await this._queryRepository.ListAsync(p_skip, p_take);

    // Map ReadEntities → Response DTOs
    return entities.map((entity) => this._mapper.ToResponseFromReadEntity(entity));
  }

  /**
   * Activates an example.
   * 1. Load BMO from command repository
   * 2. Validate ownership
   * 3. Activate (business logic in domain model)
   * 4. Save via command repository
   */
  public async ActivateExampleAsync(p_id: string, p_userId: string): Promise<void> {
    const model = await this._commandRepository.FindByIdAsync(p_id);
    if (!model) {
      throw new ExampleServiceException(ExampleErrorCode.NotFound, { id: p_id });
    }

    try {
      model.ValidateOwnership(p_userId);
    } catch {
      throw new ExampleServiceException(ExampleErrorCode.Unauthorized, { id: p_id });
    }

    model.Activate();
    await this._commandRepository.UpdateAsync(model);
  }

  /**
   * Deactivates an example.
   * 1. Load BMO from command repository
   * 2. Validate ownership
   * 3. Deactivate (business logic in domain model)
   * 4. Save via command repository
   */
  public async DeactivateExampleAsync(p_id: string, p_userId: string): Promise<void> {
    const model = await this._commandRepository.FindByIdAsync(p_id);
    if (!model) {
      throw new ExampleServiceException(ExampleErrorCode.NotFound, { id: p_id });
    }

    try {
      model.ValidateOwnership(p_userId);
    } catch {
      throw new ExampleServiceException(ExampleErrorCode.Unauthorized, { id: p_id });
    }

    model.Deactivate();
    await this._commandRepository.UpdateAsync(model);
  }
}
