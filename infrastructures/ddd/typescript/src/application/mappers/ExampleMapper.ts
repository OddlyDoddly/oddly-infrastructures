import { IMapper } from './infra/IMapper';
import { CreateExampleRequest } from '../../api/dto/v1/requests/CreateExampleRequest';
import { ExampleResponse } from '../../api/dto/v1/responses/ExampleResponse';
import { ExampleModel } from '../../domain/models/ExampleModel';
import { ExampleWriteEntity } from '../../infrastructure/persistence/write/ExampleWriteEntity';
import { ExampleReadEntity } from '../../infrastructure/persistence/read/ExampleReadEntity';

/**
 * Example mapper demonstrating all required transformation patterns.
 * Mappers:
 * - Live in /application/mappers/
 * - Have Mapper suffix
 * - MANDATORY for all transformations between DTOs, BMOs, and Entities
 * - Handle mapping logic explicitly (no AutoMapper magic)
 * - Are concrete implementations (no /impl/ subdirectory)
 */
export class ExampleMapper implements IMapper<
  CreateExampleRequest,
  ExampleResponse,
  ExampleModel,
  ExampleWriteEntity,
  ExampleReadEntity
> {
  /**
   * Maps CreateExampleRequest → ExampleModel (Request DTO to BMO)
   * Used when receiving create commands from API layer
   * Note: OwnerId would typically come from authenticated user context
   */
  public ToModelFromRequest(p_dto: CreateExampleRequest): ExampleModel {
    // OwnerId should be set by controller from authenticated user
    // This is just for demonstration - controller should pass ownerId
    return ExampleModel.Create(p_dto.Name, p_dto.Description, '');
  }

  /**
   * Maps ExampleModel → ExampleWriteEntity (BMO to Persistence)
   * Used when persisting data to database (command side)
   */
  public ToWriteEntity(p_model: ExampleModel): ExampleWriteEntity {
    const entity = new ExampleWriteEntity();
    entity.Id = p_model.Id;
    entity.Name = p_model.Name;
    entity.Description = p_model.Description;
    entity.OwnerId = p_model.OwnerId;
    entity.IsActive = p_model.IsActive;
    entity.CreatedAt = p_model.CreatedAt;
    entity.UpdatedAt = p_model.UpdatedAt;
    return entity;
  }

  /**
   * Maps ExampleWriteEntity → ExampleModel (Persistence to BMO)
   * Used when loading data from database for business logic
   */
  public ToModelFromWriteEntity(p_entity: ExampleWriteEntity): ExampleModel {
    return ExampleModel.Hydrate(
      p_entity.Id,
      p_entity.Name,
      p_entity.Description,
      p_entity.OwnerId,
      p_entity.IsActive,
      p_entity.CreatedAt,
      p_entity.UpdatedAt
    );
  }

  /**
   * Maps ExampleReadEntity → ExampleResponse (Query Result to Response DTO)
   * Used for query operations - bypasses BMO in read path for performance
   */
  public ToResponseFromReadEntity(p_entity: ExampleReadEntity): ExampleResponse {
    const response = new ExampleResponse();
    response.Id = p_entity.Id;
    response.Name = p_entity.Name;
    response.Description = p_entity.Description;
    response.OwnerId = p_entity.OwnerId;
    response.OwnerName = p_entity.OwnerName;
    response.IsActive = p_entity.IsActive;
    response.DisplayName = p_entity.DisplayName;
    response.StatusText = p_entity.StatusText;
    response.CreatedAt = p_entity.CreatedAt;
    response.UpdatedAt = p_entity.UpdatedAt;
    return response;
  }

  /**
   * Maps ExampleModel → ExampleResponse (BMO to Response DTO)
   * Used when returning data from command operations
   */
  public ToResponseFromModel(p_model: ExampleModel): ExampleResponse {
    const response = new ExampleResponse();
    response.Id = p_model.Id;
    response.Name = p_model.Name;
    response.Description = p_model.Description;
    response.OwnerId = p_model.OwnerId;
    response.OwnerName = ''; // Not available in BMO, would need to be looked up
    response.IsActive = p_model.IsActive;
    response.DisplayName = p_model.Name; // Computed from model
    response.StatusText = p_model.IsActive ? 'Active' : 'Inactive';
    response.CreatedAt = p_model.CreatedAt;
    response.UpdatedAt = p_model.UpdatedAt;
    return response;
  }

  /**
   * Updates a model with data from UpdateExampleRequest
   * Used when receiving update commands from API layer
   */
  public UpdateModelFromRequest(p_model: ExampleModel, p_request: { Name: string; Description: string }): void {
    p_model.UpdateDetails(p_request.Name, p_request.Description);
  }
}
