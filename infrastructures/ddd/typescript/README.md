# TypeScript DDD Infrastructure Template

This is a comprehensive Domain-Driven Design (DDD) infrastructure template for TypeScript projects following strict architectural standards and CQRS patterns.

## Project Structure

```
src/
├── api/
│   ├── controllers/          # HTTP endpoints - BaseController, ExampleController
│   │   └── infra/           # Base controller abstractions
│   ├── dto/v1/              # Request/Response DTOs
│   │   ├── infra/           # Base DTO abstractions
│   │   ├── requests/        # Request DTOs
│   │   └── responses/       # Response DTOs
│   └── middleware/          # Security, UnitOfWork, auth, logging, errors
├── application/
│   ├── services/            # Service contracts - IExampleService
│   │   └── impl/           # Service implementations - ExampleService
│   ├── mappers/            # Mapper implementations - ExampleMapper
│   │   └── infra/          # Mapper base abstractions - IMapper
│   └── errors/             # Service exceptions - ExampleServiceException
│       └── infra/          # ServiceException base class
├── domain/
│   ├── models/             # Business models (BMOs) - ExampleModel
│   │   └── infra/          # BaseModel
│   └── events/             # Domain events - ExampleCreatedEvent
│       └── infra/          # BaseDomainEvent
└── infrastructure/
    ├── repositories/       # Repository contracts
    │   ├── impl/          # Repository implementations
    │   └── infra/         # Repository base abstractions
    ├── persistence/       # Entities and database contexts
    │   ├── write/        # WriteEntities for commands
    │   │   └── infra/    # BaseWriteEntity
    │   ├── read/         # ReadEntities for queries
    │   │   └── infra/    # BaseReadEntity
    │   └── infra/        # BaseEntity
    └── queues/           # Queue infrastructure
        ├── infra/        # Queue base abstractions
        └── subscribers/  # Event subscribers
```

## File Organization Pattern

The codebase follows a specific pattern for organizing interfaces, implementations, and base abstractions:

### Services & Repositories (Autowiring Contracts)
- **Contract Interfaces** (e.g., `IExampleService`, `IExampleCommandRepository`) → Root directory
  - These define the contract between layers
  - Used for dependency injection
- **Implementations** (e.g., `ExampleService`, `ExampleCommandRepository`) → `/impl/` subdirectory
  - Concrete implementations of the contracts

### Mappers, Queues, Controllers (No Autowiring)
- **Implementations** (e.g., `ExampleMapper`, `InMemoryEventBus`, `ExampleController`) → Root directory
  - Concrete classes
  - No `/impl/` subdirectory needed
- **Base Abstractions** (e.g., `IMapper`, `IEventPublisher`) → `/infra/` subdirectory
  - Generic interfaces and base types
  - Not used for dependency injection contracts

### Base Abstractions & Infrastructure
- **Base Types** (e.g., `BaseModel`, `BaseEntity`, `ICommandRepository`) → `/infra/` subdirectory
  - Generic base interfaces
  - Abstract base classes
  - Infrastructure-level abstractions
  - Shared across multiple implementations

## Key Architectural Patterns

### CQRS (Command Query Responsibility Segregation)

#### Write Side (Commands)
- **WriteEntities** in `/infrastructure/persistence/write/`
- Used for: Create, Update, Delete operations
- Contains all fields needed for business operations
- Mapped from/to BMOs by repositories using mappers

#### Read Side (Queries)
- **ReadEntities** in `/infrastructure/persistence/read/`
- Used for: Get, List, Search operations
- Denormalized for query performance
- Returned directly to services (no BMO mapping for performance)

### Repository Pattern

#### Command Repository
- Interface: `ICommandRepository<TModel, TId>`
- Works with WriteEntities internally
- Receives BMOs from services
- Returns void or IDs
- Handles mapping BMO ↔ WriteEntity

#### Query Repository
- Interface: `IQueryRepository<TReadEntity, TId>`
- Returns ReadEntities directly
- No BMO mapping in read path
- Optimized for query performance

### Object Types

1. **DTOs** (`/api/dto/v1/`)
   - Purpose: HTTP transport only
   - Suffix: Request, Response, or Dto
   - No business logic
   - Example: `CreateExampleRequest`, `ExampleResponse`

2. **BMOs** (`/domain/models/`)
   - Purpose: Business logic and invariants
   - Suffix: Model or BMO
   - **CRITICAL**: NO database attributes
   - Example: `ExampleModel`

3. **WriteEntities** (`/infrastructure/persistence/write/`)
   - Purpose: Command side persistence
   - Suffix: WriteEntity
   - CAN have ORM attributes
   - Example: `ExampleWriteEntity`

4. **ReadEntities** (`/infrastructure/persistence/read/`)
   - Purpose: Query side persistence
   - Suffix: ReadEntity
   - CAN have ORM attributes
   - Denormalized for performance
   - Example: `ExampleReadEntity`

5. **Mappers** (`/application/mappers/`)
   - Purpose: Transform between types
   - Suffix: Mapper
   - **MANDATORY** for all transformations
   - Example: `ExampleMapper`

6. **Domain Events** (`/domain/events/`)
   - Purpose: Subdomain-to-subdomain communication
   - Suffix: Event
   - Pattern: `{Object}{Action}Event`
   - Immutable (readonly properties)
   - Example: `ExampleCreatedEvent`

## Middleware Pipeline

Middleware MUST be applied in this order:

1. **Correlation ID** - Tracks requests across services
2. **Logging** - Request/response logging
3. **Authentication** - Verify user identity
4. **Authorization/Ownership** - Verify permissions and resource ownership
5. **UnitOfWork** - Manage database transactions
6. **Controller** - Handle request
7. **UnitOfWork** commit/rollback - Finalize transaction
8. **Error Handling** - Map exceptions to HTTP responses

## Service Exception Pattern

All service exceptions MUST:
- Extend `ServiceException<TErrorCode>`
- Define an enum for error codes (NOT strings)
- Live in `/application/errors/`
- Use the pattern: `{Object}ServiceException`

Example:
```typescript
export enum ExampleErrorCode {
  NotFound = 'NotFound',
  ValidationFailed = 'ValidationFailed',
  Conflict = 'Conflict'
}

export class ExampleServiceException extends ServiceException<ExampleErrorCode> {
  private static readonly _messageTemplates: Record<string, string> = {
    [ExampleErrorCode.NotFound]: "Example '{id}' not found",
    [ExampleErrorCode.ValidationFailed]: "Validation failed: {reason}"
  };
  
  constructor(p_code: ExampleErrorCode, p_details?: Record<string, unknown>) {
    super(p_code, ExampleServiceException._messageTemplates, p_details);
  }
}
```

## Communication Architecture

### Within Subdomain
- Direct service calls are allowed
- Follow hierarchy: Controller → Service → Repository

### Between Subdomains
- **ONLY** via domain events through message queue
- **NEVER** via HTTP calls
- **NEVER** share databases

### Front-End Communication
- **ONLY** via REST API endpoints
- Controllers expose HTTP endpoints

## Domain Events

Domain events are the **ONLY** way subdomains communicate:

```typescript
// Subdomain A: Publish event
const createdEvent = new ExampleCreatedEvent(exampleId, name, ownerId, correlationId);
await eventPublisher.PublishAsync(createdEvent, 'example.created');

// Subdomain B: Subscribe to event (in different repo)
await subscriber.SubscribeAsync<ExampleCreatedEvent>(
  'example.created',
  handleExampleCreatedAsync
);
```

Topic naming convention: `{subdomain}.{action}`
- `example.created`
- `example.updated`
- `example.deleted`

## Naming Conventions

- **Controllers**: `Controller` suffix
- **Services**: `Service` suffix (interface starts with `I`)
- **Repositories**: `Repository` suffix (interface starts with `I`)
- **WriteEntities**: `WriteEntity` suffix
- **ReadEntities**: `ReadEntity` suffix
- **Models**: `Model` or `BMO` suffix
- **DTOs**: `Request`, `Response`, or `Dto` suffix
- **Events**: `Event` suffix, pattern `{Object}{Action}Event`
- **Mappers**: `Mapper` suffix
- **Middleware**: `Middleware` suffix
- **Async methods**: `Async` suffix
- **Member fields**: `_variable` prefix
- **Parameters**: `p_variable` prefix
- **Local variables**: camelCase

## Error Response Contract

All error responses follow this standard contract:

```json
{
  "error": {
    "code": "NotFound",
    "message": "Example 'abc123' not found",
    "details": { "id": "abc123" },
    "timestamp": "2024-01-01T00:00:00Z",
    "path": "/api/v1/example/abc123",
    "requestId": "correlation-id-here"
  }
}
```

Status code mapping:
- NotFound → 404
- Conflict → 409
- ValidationFailed → 400
- Unauthorized → 401
- Forbidden → 403
- Unknown → 500

## Transaction Management

- Transactions are **automatically** managed by `UnitOfWorkMiddleware`
- Services should **NEVER** manually manage transactions
- Commits on success (status < 400)
- Rolls back on error (status >= 400 or exception)

## Getting Started

1. Copy this template to your new project
2. Update namespaces/imports for your project name
3. Install dependencies: `npm install`
4. Implement your specific database context and ORM configuration
5. Implement your specific message queue integration
6. Add authentication/authorization configuration
7. Register all services in dependency injection container
8. Configure middleware pipeline
9. Build: `npm run build`

## Running the Application

The application includes `index.ts` as the main entry point and `server.ts` for Express configuration.

### Prerequisites
- Node.js 18 or later
- npm or yarn

### Build and Run

```bash
# Install dependencies
npm install

# Run in development mode (with auto-reload)
npm run dev

# Or build and run in production mode
npm run build
npm start

# The application will start on http://localhost:3000
```

### Available Endpoints

Once running, you can access:
- **Root**: `http://localhost:3000/` - Application information
- **Health**: `http://localhost:3000/health` - Health check endpoint
- **Example API**: `http://localhost:3000/api/v1/examples` - Example CRUD endpoints

### Configuration

Configure the application via:
- Environment variables (PORT, NODE_ENV, etc.)
- Configuration files (create `config/` directory)
- Command line arguments

## Dependencies

This template is designed to work with:
- Node.js 18+
- TypeScript 5+
- Express.js for web APIs
- Any ORM (TypeORM, Mongoose, Sequelize, Prisma, etc.)
- Any message queue (RabbitMQ, Azure Service Bus, AWS SQS, etc.)

## Best Practices

✅ **DO:**
- Separate BMOs from Entities
- Use mappers for all transformations
- Keep business logic in domain models
- Use domain events for subdomain communication
- Follow the exact folder structure
- Use the naming conventions
- Let UnitOfWork middleware manage transactions

❌ **DON'T:**
- Put database attributes on domain models
- Skip the mapper layer
- Put business logic in controllers or repositories
- Use HTTP calls between subdomains
- Share databases between subdomains
- Manually manage transactions in services
- Return entities directly from repositories to controllers

## License

This template is provided as-is for use in your projects.
