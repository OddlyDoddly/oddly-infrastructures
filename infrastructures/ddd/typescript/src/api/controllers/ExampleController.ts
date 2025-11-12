import { Request, Response, NextFunction } from 'express';
import { BaseController } from './infra/BaseController';
import { IExampleService } from '../../application/services/IExampleService';
import { CreateExampleRequest } from '../dto/v1/requests/CreateExampleRequest';
import { UpdateExampleRequest } from '../dto/v1/requests/UpdateExampleRequest';

/**
 * Example controller demonstrating controller layer patterns.
 * Controllers:
 * - Live in /api/controllers/
 * - Have Controller suffix
 * - Handle HTTP only: bind, validate, authorize, map DTOs
 * - NO business logic (delegate to services)
 * - Are concrete implementations (no /impl/ subdirectory)
 * 
 * Middleware order (automatically applied):
 * 1. Correlation ID → 2. Logging → 3. Authentication → 
 * 4. Authorization/Ownership → 5. UnitOfWork → 6. Controller →
 * 7. UnitOfWork commit/rollback → 8. Error Handling
 * 
 * Routes (example with Express):
 * POST   /api/v1/example
 * GET    /api/v1/example/:id
 * GET    /api/v1/example
 * PUT    /api/v1/example/:id
 * DELETE /api/v1/example/:id
 * POST   /api/v1/example/:id/activate
 * POST   /api/v1/example/:id/deactivate
 */
export class ExampleController extends BaseController {
  private readonly _exampleService: IExampleService;

  constructor(p_exampleService: IExampleService) {
    super();
    this._exampleService = p_exampleService;
  }

  /**
   * Creates a new example.
   * POST /api/v1/example
   */
  public async CreateExample(
    p_request: Request,
    p_response: Response,
    p_next: NextFunction
  ): Promise<void> {
    try {
      // Validate request (edge validation)
      const body = p_request.body as CreateExampleRequest;
      this.ValidateRequest(body);

      // Get user ID from auth context
      const userId = this.GetUserId(p_request);
      const correlationId = this.GetCorrelationId(p_request);

      // Delegate to service (business logic happens here)
      const exampleId = await this._exampleService.CreateExampleAsync(body, userId, correlationId);

      // Return created response
      p_response.status(201).json({ id: exampleId });
    } catch (error) {
      p_next(error);
    }
  }

  /**
   * Gets an example by ID.
   * GET /api/v1/example/:id
   */
  public async GetExample(
    p_request: Request,
    p_response: Response,
    p_next: NextFunction
  ): Promise<void> {
    try {
      const id = p_request.params.id;
      const result = await this._exampleService.GetExampleAsync(id);
      p_response.status(200).json(result);
    } catch (error) {
      p_next(error);
    }
  }

  /**
   * Lists examples with pagination.
   * GET /api/v1/example?skip=0&take=10
   */
  public async ListExamples(
    p_request: Request,
    p_response: Response,
    p_next: NextFunction
  ): Promise<void> {
    try {
      const skip = parseInt(p_request.query.skip as string) || 0;
      const take = parseInt(p_request.query.take as string) || 10;
      
      const results = await this._exampleService.ListExamplesAsync(skip, take);
      p_response.status(200).json(results);
    } catch (error) {
      p_next(error);
    }
  }

  /**
   * Updates an example.
   * PUT /api/v1/example/:id
   */
  public async UpdateExample(
    p_request: Request,
    p_response: Response,
    p_next: NextFunction
  ): Promise<void> {
    try {
      const id = p_request.params.id;
      const body = p_request.body as UpdateExampleRequest;
      this.ValidateRequest(body);

      const userId = this.GetUserId(p_request);
      await this._exampleService.UpdateExampleAsync(id, body, userId);

      p_response.status(204).send();
    } catch (error) {
      p_next(error);
    }
  }

  /**
   * Deletes an example.
   * DELETE /api/v1/example/:id
   */
  public async DeleteExample(
    p_request: Request,
    p_response: Response,
    p_next: NextFunction
  ): Promise<void> {
    try {
      const id = p_request.params.id;
      const userId = this.GetUserId(p_request);
      
      await this._exampleService.DeleteExampleAsync(id, userId);
      p_response.status(204).send();
    } catch (error) {
      p_next(error);
    }
  }

  /**
   * Activates an example.
   * POST /api/v1/example/:id/activate
   */
  public async ActivateExample(
    p_request: Request,
    p_response: Response,
    p_next: NextFunction
  ): Promise<void> {
    try {
      const id = p_request.params.id;
      const userId = this.GetUserId(p_request);
      
      await this._exampleService.ActivateExampleAsync(id, userId);
      p_response.status(204).send();
    } catch (error) {
      p_next(error);
    }
  }

  /**
   * Deactivates an example.
   * POST /api/v1/example/:id/deactivate
   */
  public async DeactivateExample(
    p_request: Request,
    p_response: Response,
    p_next: NextFunction
  ): Promise<void> {
    try {
      const id = p_request.params.id;
      const userId = this.GetUserId(p_request);
      
      await this._exampleService.DeactivateExampleAsync(id, userId);
      p_response.status(204).send();
    } catch (error) {
      p_next(error);
    }
  }
}
