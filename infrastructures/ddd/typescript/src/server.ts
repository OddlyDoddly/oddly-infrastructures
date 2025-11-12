/**
 * Server configuration for the Oddly DDD TypeScript application.
 * 
 * This module configures the Express application with:
 * - Middleware pipeline (in correct order)
 * - Dependency injection setup
 * - Route registration
 * - Error handling
 * 
 * The application follows Domain-Driven Design (DDD) with CQRS pattern.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Import middleware
import { CorrelationIdMiddleware } from './api/middleware/CorrelationIdMiddleware';
import { ErrorHandlingMiddleware } from './api/middleware/ErrorHandlingMiddleware';
import { OwnershipMiddleware } from './api/middleware/OwnershipMiddleware';
import { UnitOfWorkMiddleware } from './api/middleware/UnitOfWorkMiddleware';

// Import controllers
import { ExampleController } from './api/controllers/ExampleController';

// Import services
import { IExampleService } from './application/services/IExampleService';
import { ExampleService } from './application/services/impl/ExampleService';

// Import repositories
import { IExampleCommandRepository } from './infrastructure/repositories/IExampleCommandRepository';
import { IExampleQueryRepository } from './infrastructure/repositories/IExampleQueryRepository';
import { ExampleCommandRepository } from './infrastructure/repositories/impl/ExampleCommandRepository';
import { ExampleQueryRepository } from './infrastructure/repositories/impl/ExampleQueryRepository';
import { IUnitOfWork } from './infrastructure/repositories/infra/IUnitOfWork';
import { UnitOfWork } from './infrastructure/repositories/infra/UnitOfWork';

// Import mappers
import { ExampleMapper } from './application/mappers/ExampleMapper';

// Import event bus
import { IEventPublisher } from './infrastructure/queues/infra/IEventPublisher';
import { IEventSubscriber } from './infrastructure/queues/infra/IEventSubscriber';
import { InMemoryEventBus } from './infrastructure/queues/InMemoryEventBus';

/**
 * Dependency Injection Container.
 * 
 * Simple container for managing application dependencies.
 * In production, consider using a full DI framework like:
 * - tsyringe
 * - inversify
 * - awilix
 */
class DependencyContainer {
    private _eventBus: InMemoryEventBus;
    private _unitOfWork: IUnitOfWork;
    private _exampleCommandRepository: IExampleCommandRepository;
    private _exampleQueryRepository: IExampleQueryRepository;
    private _exampleMapper: ExampleMapper;
    private _exampleService: IExampleService;
    private _exampleController: ExampleController;

    constructor() {
        // Initialize event bus (singleton)
        this._eventBus = new InMemoryEventBus();

        // Initialize Unit of Work
        this._unitOfWork = new UnitOfWork();

        // Initialize repositories
        this._exampleCommandRepository = new ExampleCommandRepository(this._unitOfWork);
        this._exampleQueryRepository = new ExampleQueryRepository();

        // Initialize mappers
        this._exampleMapper = new ExampleMapper();

        // Initialize services
        this._exampleService = new ExampleService(
            this._exampleCommandRepository,
            this._exampleQueryRepository,
            this._exampleMapper,
            this._eventBus
        );

        // Initialize controllers
        this._exampleController = new ExampleController(this._exampleService);
    }

    get eventPublisher(): IEventPublisher {
        return this._eventBus;
    }

    get eventSubscriber(): IEventSubscriber {
        return this._eventBus;
    }

    get unitOfWork(): IUnitOfWork {
        return this._unitOfWork;
    }

    get exampleService(): IExampleService {
        return this._exampleService;
    }

    get exampleController(): ExampleController {
        return this._exampleController;
    }
}

/**
 * Create and configure the Express application.
 * 
 * @returns Configured Express application
 */
export function createServer(): Express {
    const app = express();
    const container = new DependencyContainer();

    // ======================================
    // Configure Express
    // ======================================

    // Parse JSON bodies
    app.use(express.json());

    // Parse URL-encoded bodies
    app.use(express.urlencoded({ extended: true }));

    // ======================================
    // Configure CORS
    // ======================================

    app.use(cors({
        origin: '*', // TODO: Restrict in production to specific origins
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-Id', 'X-Request-Id', 'X-Owner-Id'],
        exposedHeaders: ['X-Correlation-Id', 'X-Request-Id'],
        credentials: true,
        maxAge: 3600
    }));

    // ======================================
    // Configure Custom Middleware Pipeline
    // ======================================
    // CRITICAL: Middleware order matters! Follow the exact sequence below.

    // 1. Correlation ID - Tracks requests across services
    app.use(CorrelationIdMiddleware);

    // 2. Logging - Request/response logging
    // TODO: Add logging middleware
    app.use((p_req: Request, p_res: Response, p_next: NextFunction) => {
        const startTime = Date.now();
        const correlationId = (p_req as any).correlationId || 'unknown';
        
        console.log(`[${new Date().toISOString()}] ${p_req.method} ${p_req.path} - Correlation ID: ${correlationId}`);
        
        p_res.on('finish', () => {
            const duration = Date.now() - startTime;
            console.log(`[${new Date().toISOString()}] ${p_req.method} ${p_req.path} - ${p_res.statusCode} - ${duration}ms`);
        });
        
        p_next();
    });

    // 3. Authentication - Verify user identity
    // TODO: Add authentication middleware
    // app.use(AuthenticationMiddleware);

    // 4. Authorization/Ownership - Verify permissions and resource ownership
    app.use(OwnershipMiddleware);

    // 5. Unit of Work - Manage database transactions
    app.use(UnitOfWorkMiddleware(container.unitOfWork));

    // ======================================
    // Register Routes
    // ======================================

    // Root endpoint
    app.get('/', (p_req: Request, p_res: Response) => {
        p_res.json({
            application: 'Oddly DDD Infrastructure',
            version: '1.0.0',
            description: 'Domain-Driven Design infrastructure template with CQRS',
            documentation: '/api-docs',
            health: '/health'
        });
    });

    // Health check endpoint
    app.get('/health', (p_req: Request, p_res: Response) => {
        p_res.json({
            status: 'healthy',
            timestamp: new Date().toISOString()
        });
    });

    // Register example controller routes
    // TODO: Replace with your actual controllers
    app.use('/api/v1/examples', (p_req: Request, p_res: Response, p_next: NextFunction) => {
        container.exampleController.registerRoutes(app);
        p_next();
    });

    // ======================================
    // Error Handling Middleware (Must be last)
    // ======================================

    app.use(ErrorHandlingMiddleware);

    // 404 handler
    app.use((p_req: Request, p_res: Response) => {
        p_res.status(404).json({
            error: {
                code: 'NOT_FOUND',
                message: `Route ${p_req.method} ${p_req.path} not found`,
                timestamp: new Date().toISOString(),
                path: p_req.path,
                requestId: (p_req as any).correlationId || 'unknown'
            }
        });
    });

    return app;
}

/**
 * Start the server.
 * 
 * @param port Port number to listen on
 * @returns Express application instance
 */
export function startServer(p_port: number = 3000): Express {
    const app = createServer();

    app.listen(p_port, () => {
        console.log('=================================');
        console.log('Oddly DDD Infrastructure');
        console.log('=================================');
        console.log(`Server is running on port ${p_port}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`API Documentation: http://localhost:${p_port}/api-docs`);
        console.log(`Health Check: http://localhost:${p_port}/health`);
        console.log('=================================');
    });

    return app;
}
