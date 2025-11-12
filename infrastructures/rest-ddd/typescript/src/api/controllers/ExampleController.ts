/**
 * Example Controller
 * HTTP endpoints for Example operations.
 */

import { IExampleService } from '../../application/services/IExampleService';
import { ExampleMapper } from '../../application/mappers/ExampleMapper';
import { CreateExampleRequest, UpdateExampleRequest } from '../dto/CreateExampleRequest';
import { ExampleResponse } from '../dto/ExampleResponse';
import { ExampleServiceException, ExampleErrorCode } from '../../application/errors/ExampleServiceException';
import { createErrorResponse } from '../dto/BaseResponse';

export class ExampleController {
  /**
   * Controller for Example HTTP endpoints.
   * 
   * Rules:
   * - Located in /api/controllers/
   * - Suffix with 'Controller'
   * - HTTP layer ONLY
   * - Bind, validate, authorize, map DTOs
   * - NO business logic
   */

  constructor(
    private readonly _service: IExampleService,
    private readonly _mapper: ExampleMapper
  ) {}

  /**
   * POST /api/v1/examples
   * Create a new Example.
   */
  async create(p_request: CreateExampleRequest, p_userId: string, p_requestId: string): Promise<ExampleResponse> {
    try {
      // Map DTO → Model
      const model = this._mapper.toModelFromRequest(p_request);

      // Call service
      const exampleId = await this._service.createAsync(model);

      // Get created entity
      const entity = await this._service.getByIdAsync(exampleId);

      if (!entity) {
        throw new ExampleServiceException(
          ExampleErrorCode.NOT_FOUND,
          { id: exampleId }
        );
      }

      // Map Entity → Response
      return this._mapper.toResponseFromReadEntity(entity);
    } catch (error) {
      if (error instanceof ExampleServiceException) {
        throw error;
      }
      throw error;
    }
  }

  /**
   * GET /api/v1/examples/:id
   * Get Example by ID.
   */
  async getById(p_id: string, p_requestId: string): Promise<ExampleResponse> {
    try {
      const entity = await this._service.getByIdAsync(p_id);

      if (!entity) {
        throw new ExampleServiceException(
          ExampleErrorCode.NOT_FOUND,
          { id: p_id }
        );
      }

      return this._mapper.toResponseFromReadEntity(entity);
    } catch (error) {
      if (error instanceof ExampleServiceException) {
        throw error;
      }
      throw error;
    }
  }

  /**
   * PUT /api/v1/examples/:id
   * Update an Example.
   */
  async update(
    p_id: string,
    p_request: UpdateExampleRequest,
    p_userId: string,
    p_requestId: string
  ): Promise<ExampleResponse> {
    try {
      // Get existing entity
      const existingEntity = await this._service.getByIdAsync(p_id);

      if (!existingEntity) {
        throw new ExampleServiceException(
          ExampleErrorCode.NOT_FOUND,
          { id: p_id }
        );
      }

      // Create updated model
      // In real implementation, merge p_request with existing data
      const model = this._mapper.toModelFromRequest({
        name: p_request.name || existingEntity.name,
        description: p_request.description || existingEntity.description,
        ownerId: existingEntity.ownerId
      });

      // Call service
      await this._service.updateAsync(p_id, model);

      // Get updated entity
      const updatedEntity = await this._service.getByIdAsync(p_id);

      if (!updatedEntity) {
        throw new ExampleServiceException(
          ExampleErrorCode.NOT_FOUND,
          { id: p_id }
        );
      }

      return this._mapper.toResponseFromReadEntity(updatedEntity);
    } catch (error) {
      if (error instanceof ExampleServiceException) {
        throw error;
      }
      throw error;
    }
  }

  /**
   * DELETE /api/v1/examples/:id
   * Delete an Example.
   */
  async delete(p_id: string, p_userId: string, p_requestId: string): Promise<void> {
    try {
      await this._service.deleteAsync(p_id);
    } catch (error) {
      if (error instanceof ExampleServiceException) {
        throw error;
      }
      throw error;
    }
  }

  /**
   * GET /api/v1/examples
   * List Examples with pagination.
   */
  async list(p_page: number = 1, p_pageSize: number = 50, p_requestId: string): Promise<ExampleResponse[]> {
    try {
      const entities = await this._service.listAsync(p_page, p_pageSize);
      return entities.map(e => this._mapper.toResponseFromReadEntity(e));
    } catch (error) {
      throw error;
    }
  }

  /**
   * POST /api/v1/examples/:id/activate
   * Activate an Example.
   */
  async activate(p_id: string, p_userId: string, p_requestId: string): Promise<ExampleResponse> {
    try {
      await this._service.activateAsync(p_id);

      const entity = await this._service.getByIdAsync(p_id);

      if (!entity) {
        throw new ExampleServiceException(
          ExampleErrorCode.NOT_FOUND,
          { id: p_id }
        );
      }

      return this._mapper.toResponseFromReadEntity(entity);
    } catch (error) {
      if (error instanceof ExampleServiceException) {
        throw error;
      }
      throw error;
    }
  }

  /**
   * POST /api/v1/examples/:id/deactivate
   * Deactivate an Example.
   */
  async deactivate(p_id: string, p_userId: string, p_requestId: string): Promise<ExampleResponse> {
    try {
      await this._service.deactivateAsync(p_id);

      const entity = await this._service.getByIdAsync(p_id);

      if (!entity) {
        throw new ExampleServiceException(
          ExampleErrorCode.NOT_FOUND,
          { id: p_id }
        );
      }

      return this._mapper.toResponseFromReadEntity(entity);
    } catch (error) {
      if (error instanceof ExampleServiceException) {
        throw error;
      }
      throw error;
    }
  }
}

// Example Express.js integration:
/**
 * 
 * import express, { Request, Response } from 'express';
 * 
 * const router = express.Router();
 * const controller = new ExampleController(service, mapper);
 * 
 * router.post('/api/v1/examples', async (req: Request, res: Response) => {
 *   try {
 *     const userId = req.user?.id;
 *     const requestId = req.headers['x-request-id'] as string;
 *     const response = await controller.create(req.body, userId, requestId);
 *     res.status(201).json(response);
 *   } catch (error) {
 *     if (error instanceof ExampleServiceException) {
 *       const statusCode = ExampleServiceException.toHttpStatus(error.errorCode);
 *       res.status(statusCode).json(createErrorResponse(
 *         error.errorCode,
 *         error.message,
 *         req.path,
 *         requestId,
 *         error.details
 *       ));
 *     } else {
 *       res.status(500).json({ error: 'Internal server error' });
 *     }
 *   }
 * });
 */
