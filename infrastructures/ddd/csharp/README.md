# C# DDD Infrastructure Template

This is a comprehensive Domain-Driven Design (DDD) infrastructure template for C# projects following strict architectural standards and CQRS patterns.

## Project Structure

```
src/
├── Api/
│   ├── Controllers/          # HTTP endpoints - BaseController, ExampleController
│   ├── Dto/V1/              # Request/Response DTOs
│   └── Middleware/          # Security, UnitOfWork, auth, logging, errors
├── Application/
│   ├── Services/            # Use-case orchestration - IExampleService
│   │   └── Impl/           # Service implementations - ExampleService
│   ├── Mappers/            # DTO↔BMO↔Entity transformations - ExampleMapper
│   ├── Policies/           # Authorization, domain policies
│   └── Errors/             # Service exceptions - ExampleServiceException
├── Domain/
│   ├── Models/             # Business models (BMOs) - ExampleModel
│   └── Events/             # Domain events - ExampleCreatedEvent
└── Infrastructure/
    ├── Repositories/       # Data access interfaces
    │   └── Impl/          # Repository implementations
    ├── Persistence/       # Entities and database contexts
    │   ├── Write/        # WriteEntities for commands - ExampleWriteEntity
    │   └── Read/         # ReadEntities for queries - ExampleReadEntity
    ├── Queues/           # Event publisher/subscriber
    │   ├── Impl/         # Event bus implementations
    │   └── Subscribers/  # Event subscribers
    └── Integrations/     # External HTTP clients
```

## Key Architectural Patterns

### CQRS (Command Query Responsibility Segregation)

#### Write Side (Commands)
- **WriteEntities** in `/Infrastructure/Persistence/Write/`
- Used for: Create, Update, Delete operations
- Contains all fields needed for business operations
- Mapped from/to BMOs by repositories using mappers

#### Read Side (Queries)
- **ReadEntities** in `/Infrastructure/Persistence/Read/`
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

1. **DTOs** (`/Api/Dto/`)
   - Purpose: HTTP transport only
   - Suffix: Request, Response, or Dto
   - No business logic
   - Example: `CreateExampleRequest`, `ExampleResponse`

2. **BMOs** (`/Domain/Models/`)
   - Purpose: Business logic and invariants
   - Suffix: Model or BMO
   - **CRITICAL**: NO database attributes
   - Example: `ExampleModel`

3. **WriteEntities** (`/Infrastructure/Persistence/Write/`)
   - Purpose: Command side persistence
   - Suffix: WriteEntity
   - CAN have ORM attributes
   - Example: `ExampleWriteEntity`

4. **ReadEntities** (`/Infrastructure/Persistence/Read/`)
   - Purpose: Query side persistence
   - Suffix: ReadEntity
   - CAN have ORM attributes
   - Denormalized for performance
   - Example: `ExampleReadEntity`

5. **Mappers** (`/Application/Mappers/`)
   - Purpose: Transform between types
   - Suffix: Mapper
   - **MANDATORY** for all transformations
   - Example: `ExampleMapper`

6. **Domain Events** (`/Domain/Events/`)
   - Purpose: Subdomain-to-subdomain communication
   - Suffix: Event
   - Pattern: `{Object}{Action}Event`
   - Immutable (init-only properties)
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
- Inherit from `ServiceException<TErrorCode>`
- Define an enum for error codes (NOT strings)
- Live in `/Application/Errors/`
- Use the pattern: `{Object}ServiceException`

Example:
```csharp
public enum ExampleErrorCode { NotFound, ValidationFailed, Conflict }

public class ExampleServiceException : ServiceException<ExampleErrorCode>
{
    private static readonly IReadOnlyDictionary<string, string> _messageTemplates = ...;
    
    public ExampleServiceException(ExampleErrorCode p_code, 
        IReadOnlyDictionary<string, object>? p_details = null)
        : base(p_code, _messageTemplates, p_details) { }
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

```csharp
// Subdomain A: Publish event
var createdEvent = new ExampleCreatedEvent(exampleId, name, ownerId, correlationId);
await _eventPublisher.PublishAsync(createdEvent, "example.created");

// Subdomain B: Subscribe to event (in different repo)
await _subscriber.SubscribeAsync<ExampleCreatedEvent>(
    "example.created",
    HandleExampleCreatedAsync
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

## Example Usage

### Creating a New Feature

1. **Define the domain model** (`/Domain/Models/`)
   ```csharp
   public class FeatureModel : BaseModel { }
   ```

2. **Create write entity** (`/Infrastructure/Persistence/Write/`)
   ```csharp
   public class FeatureWriteEntity : BaseWriteEntity { }
   ```

3. **Create read entity** (`/Infrastructure/Persistence/Read/`)
   ```csharp
   public class FeatureReadEntity : BaseReadEntity { }
   ```

4. **Create mapper** (`/Application/Mappers/`)
   ```csharp
   public class FeatureMapper : IMapper<...> { }
   ```

5. **Create repositories** (`/Infrastructure/Repositories/`)
   ```csharp
   public interface IFeatureCommandRepository : ICommandRepository<FeatureModel, string> { }
   public interface IFeatureQueryRepository : IQueryRepository<FeatureReadEntity, string> { }
   ```

6. **Implement repositories** (`/Infrastructure/Repositories/Impl/`)
   ```csharp
   public class FeatureCommandRepository : IFeatureCommandRepository { }
   public class FeatureQueryRepository : IFeatureQueryRepository { }
   ```

7. **Create DTOs** (`/Api/Dto/V1/`)
   ```csharp
   public class CreateFeatureRequest : BaseRequestDto { }
   public class FeatureResponse : BaseResponseDto { }
   ```

8. **Create service exception** (`/Application/Errors/`)
   ```csharp
   public enum FeatureErrorCode { ... }
   public class FeatureServiceException : ServiceException<FeatureErrorCode> { }
   ```

9. **Create service** (`/Application/Services/`)
   ```csharp
   public interface IFeatureService { }
   public class FeatureService : IFeatureService { }
   ```

10. **Create controller** (`/Api/Controllers/`)
    ```csharp
    public class FeatureController : BaseController { }
    ```

11. **Create domain events** (`/Domain/Events/`)
    ```csharp
    public class FeatureCreatedEvent : BaseDomainEvent { }
    ```

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

## Dependencies

This template is designed to work with:
- .NET 8.0+
- ASP.NET Core for web APIs
- Any ORM (Entity Framework Core, Dapper, MongoDB.Driver, etc.)
- Any message queue (RabbitMQ, Azure Service Bus, AWS SQS, etc.)

## Getting Started

1. Copy this template to your new project
2. Update namespaces from `OddlyDdd` to your project name
3. Implement your specific database context and ORM configuration
4. Implement your specific message queue integration
5. Add authentication/authorization configuration
6. Register all services in dependency injection container
7. Configure middleware pipeline

## License

This template is provided as-is for use in your projects.
