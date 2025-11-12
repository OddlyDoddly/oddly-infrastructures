/**
 * Example Mapper
 * MANDATORY for all transformations between layers.
 */

import { IMapper } from './IMapper';
import { ExampleModel, ExampleStatus } from '../../domain/models/ExampleModel';
import { ExampleWriteEntity } from '../../infrastructure/persistence/write/ExampleWriteEntity';
import { ExampleReadEntity } from '../../infrastructure/persistence/read/ExampleReadEntity';
import { CreateExampleRequest } from '../../api/dto/CreateExampleRequest';
import { ExampleResponse } from '../../api/dto/ExampleResponse';

export class ExampleMapper implements IMapper<
  CreateExampleRequest,
  ExampleModel,
  ExampleWriteEntity,
  ExampleReadEntity,
  ExampleResponse
> {
  /**
   * Mapper for Example entity.
   * 
   * Rules:
   * - Located in /application/mappers/
   * - Handles all transformations: DTO ↔ BMO ↔ Entity
   * - MANDATORY for all layer transitions
   */

  toModelFromRequest(p_dto: CreateExampleRequest): ExampleModel {
    return new ExampleModel(
      p_dto.name,
      p_dto.description,
      ExampleStatus.PENDING,
      p_dto.ownerId
    );
  }

  toWriteEntity(p_model: ExampleModel): ExampleWriteEntity {
    return new ExampleWriteEntity(
      p_model.name,
      p_model.description,
      p_model.status,
      p_model.ownerId,
      p_model.id
    );
  }

  toModelFromWriteEntity(p_entity: ExampleWriteEntity): ExampleModel {
    return new ExampleModel(
      p_entity.name,
      p_entity.description,
      p_entity.status as ExampleStatus,
      p_entity.ownerId,
      p_entity.id
    );
  }

  toResponseFromReadEntity(p_entity: ExampleReadEntity): ExampleResponse {
    return {
      id: p_entity.id!,
      name: p_entity.name,
      description: p_entity.description,
      status: p_entity.status,
      ownerId: p_entity.ownerId,
      ownerName: p_entity.ownerName,
      createdAt: p_entity.createdAt,
      updatedAt: p_entity.updatedAt
    };
  }

  toResponseFromModel(p_model: ExampleModel): ExampleResponse {
    return {
      id: p_model.id!,
      name: p_model.name,
      description: p_model.description,
      status: p_model.status,
      ownerId: p_model.ownerId,
      ownerName: '', // Not available in model
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}
