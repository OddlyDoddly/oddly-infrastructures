# C# DDD Architecture Documentation

## Overview

This template implements a complete Domain-Driven Design (DDD) architecture with strict CQRS (Command Query Responsibility Segregation) patterns and event-driven subdomain communication.

## Architecture Layers

### 1. API Layer (`/Api`)
- **Purpose**: HTTP boundary, request/response handling
- **Responsibilities**: Bind, validate, authorize, map DTOs
- **Rules**: NO business logic

#### Controllers
- `BaseController` - Common controller functionality
- `ExampleController` - Example CRUD operations

#### DTOs (Data Transfer Objects)
- `BaseRequestDto` / `BaseResponseDto` - Base DTO classes
- `CreateExampleRequest` / `UpdateExampleRequest` - Command DTOs
- `ExampleResponse` - Query response DTO
- `ErrorResponseDto` - Standard error response contract

#### Middleware
- `CorrelationIdMiddleware` - Request tracking across services
- `UnitOfWorkMiddleware` - Automatic transaction management
- `OwnershipMiddleware` - Resource ownership verification
- `ErrorHandlingMiddleware` - Exception to HTTP response mapping

### 2. Application Layer (`/Application`)
- **Purpose**: Use-case orchestration, transaction boundaries
- **Responsibilities**: Coordinate between API, Domain, and Infrastructure
- **Rules**: NO business logic (delegate to domain)

#### Services
- `IExampleService` - Service contract interface (root directory)
- `ExampleService` - Service implementation (in `/Impl`)
- Orchestrates repositories, domain models, and events
- Contract interfaces used for dependency injection

#### Mappers
- `ExampleMapper` - Transforms between DTOs ↔ BMOs ↔ Entities (root directory)
- `IMapper<>` - Base mapper interface (in `/Infra`)
- **MANDATORY** for all type transformations
- No `/Impl` folder needed (mappers don't have autowiring contracts)

#### Errors
- `ServiceException<TErrorCode>` - Base typed exception
- `ExampleServiceException` - Example service errors
- Defines error codes as enums (NOT strings)

### 3. Domain Layer (`/Domain`)
- **Purpose**: Business logic and invariants
- **Responsibilities**: Enforce business rules
- **Rules**: Pure business logic, NO database attributes

#### Models (BMOs - Business Model Objects)
- `BaseModel` - Base model with common properties
- `ExampleModel` - Example business model
- **CRITICAL**: NO ORM attributes allowed here

#### Events
- `BaseDomainEvent` - Base event with correlation tracking
- `ExampleCreatedEvent` / `ExampleUpdatedEvent` / `ExampleDeletedEvent`
- Pattern: `{Object}{Action}Event`
- Used for subdomain-to-subdomain communication

### 4. Infrastructure Layer (`/Infrastructure`)
- **Purpose**: Persistence, external integrations
- **Responsibilities**: Database access, message queue, external APIs
- **Rules**: Maps entities to/from domain models

#### Persistence

##### Write Side (Commands)
- `BaseWriteEntity` - Base write entity
- `ExampleWriteEntity` - Entity for command operations
- Contains all fields for business operations
- CAN have ORM attributes

##### Read Side (Queries)
- `BaseReadEntity` - Base read entity
- `ExampleReadEntity` - Denormalized view for queries
- Optimized for front-end consumption
- CAN have ORM attributes

#### Repositories

##### Contract Interfaces (Root Directory)
- `IExampleCommandRepository` - Example command repository contract
- `IExampleQueryRepository` - Example query repository contract
- Used for dependency injection
- Define service contracts

##### Base Abstractions (in `/Infra`)
- `ICommandRepository<TModel, TId>` - Base command repository interface
- `IQueryRepository<TReadEntity, TId>` - Base query repository interface
- `IUnitOfWork` - Transaction management
- Generic base types shared across implementations

##### Implementations (in `/Impl`)
- `ExampleCommandRepository` - Handles Create/Update/Delete
  - Receives BMOs, maps to WriteEntity
- `ExampleQueryRepository` - Handles Get/List/Search
  - Returns ReadEntities directly (no BMO)

#### Queues

##### Base Abstractions (in `/Infra`)
- `IEventPublisher` - Publishes events to queue
- `IEventSubscriber` - Subscribes to events from queue
- Generic infrastructure interfaces

##### Implementations (in `/Impl`)
- `InMemoryEventBus` - Simple in-memory implementation
  - Replace with real queue in production (RabbitMQ, Azure Service Bus, etc.)

##### Subscribers (in `/Subscribers`)
- `ExampleEventSubscriber` - Handles events from other subdomains
- Processes events asynchronously

## CQRS Pattern Implementation

### Command Side (Write)
```
Controller → Service → CommandRepository → WriteEntity → Database
                ↓
            EventPublisher → Queue
```

1. Controller receives request DTO
2. Service maps DTO → BMO using mapper
3. BMO validates business rules
4. CommandRepository maps BMO → WriteEntity
5. WriteEntity saved to database
6. Domain event published to queue

### Query Side (Read)
```
Controller → Service → QueryRepository → ReadEntity → Response DTO
```

1. Controller receives query
2. Service calls QueryRepository
3. QueryRepository returns ReadEntity (no BMO)
4. Service maps ReadEntity → Response DTO
5. Controller returns response

### Why CQRS?

- **Performance**: Read models denormalized for speed
- **Scalability**: Separate read/write scaling
- **Flexibility**: Different models for different purposes
- **Clarity**: Clear separation of concerns

## Communication Patterns

### Within Subdomain
```
Controller → Service A → Service B → Repository
```
- Direct method calls allowed
- Synchronous communication

### Between Subdomains
```
Subdomain A → EventPublisher → Queue → EventSubscriber → Subdomain B
```
- **ONLY** via domain events
- Asynchronous communication
- **NEVER** HTTP calls between subdomains
- **NEVER** shared databases

### Front-End Communication
```
Front-End → REST API → Controller → Service
```
- REST endpoints ONLY for front-end
- Synchronous HTTP

## Transaction Management

Handled automatically by `UnitOfWorkMiddleware`:

```
Request → Begin Transaction → Controller → Service → Repository → Commit/Rollback
```

- **Commits**: When response status < 400
- **Rollbacks**: When status >= 400 or exception
- **Services**: Never manually manage transactions

## Error Handling

### Exception Flow
```
Service throws ServiceException → ErrorHandlingMiddleware → HTTP Response
```

### Error Response Contract
```json
{
  "error": {
    "code": "NotFound",
    "message": "Example 'abc123' not found",
    "details": { "id": "abc123" },
    "timestamp": "2024-01-01T00:00:00Z",
    "path": "/api/v1/example/abc123",
    "requestId": "correlation-id"
  }
}
```

### Status Code Mapping
- NotFound → 404
- Conflict → 409
- ValidationFailed → 400
- Unauthorized → 401
- Forbidden → 403
- Unknown → 500

## Naming Conventions

### Classes
- Controllers: `{Name}Controller`
- Services: `I{Name}Service` (interface), `{Name}Service` (impl)
- Repositories: `I{Name}Repository` (interface), `{Name}Repository` (impl)
- WriteEntities: `{Name}WriteEntity`
- ReadEntities: `{Name}ReadEntity`
- Models: `{Name}Model` or `{Name}BMO`
- DTOs: `{Name}Request`, `{Name}Response`, `{Name}Dto`
- Events: `{Object}{Action}Event`
- Mappers: `{Name}Mapper`

### Variables
- Member fields: `_variableName`
- Parameters: `p_variableName`
- Local variables: `variableName` (camelCase)

## Middleware Pipeline Order

**MUST** be applied in this exact order:

1. **CorrelationIdMiddleware** - Track request
2. **Logging** - Log request/response
3. **Authentication** - Verify identity
4. **OwnershipMiddleware** - Verify permissions
5. **UnitOfWorkMiddleware** - Begin transaction
6. **Controller** - Process request
7. **UnitOfWorkMiddleware** - Commit/rollback
8. **ErrorHandlingMiddleware** - Handle errors

## Key Architectural Rules

### ✅ DO

1. Separate BMOs from Entities
2. Use mappers for ALL transformations
3. Keep business logic in domain models
4. Use domain events for subdomain communication
5. Follow exact folder structure
6. Use naming conventions
7. Let middleware manage transactions
8. Validate at both edges (DTO) and domain
9. Return ReadEntities from query repositories
10. Map BMOs in command repositories

### ❌ DON'T

1. Put database attributes on domain models
2. Skip mapper layer
3. Put business logic in controllers/repositories
4. Use HTTP between subdomains
5. Share databases between subdomains
6. Manually manage transactions
7. Return entities directly to controllers
8. Mix write and read operations
9. Use WriteEntity for queries
10. Use ReadEntity for commands

## Object Lifecycle

### Command (Create/Update/Delete)
```
Request DTO → Mapper → BMO → Validate → Mapper → WriteEntity → Database
                                                        ↓
                                                   Domain Event
```

### Query (Get/List)
```
Database → ReadEntity → Mapper → Response DTO
```

## Example Flow: Create Example

1. **Controller** receives `CreateExampleRequest`
2. **Validation** checks request is valid
3. **Controller** extracts userId and correlationId
4. **Service** maps Request → ExampleModel
5. **ExampleModel** validates business rules
6. **CommandRepository** maps ExampleModel → ExampleWriteEntity
7. **Database** saves ExampleWriteEntity
8. **Service** publishes ExampleCreatedEvent
9. **Queue** distributes event to subscribers
10. **Controller** returns 201 Created with ID

## Example Flow: Get Example

1. **Controller** receives GET request with ID
2. **Service** calls QueryRepository.FindByIdAsync(id)
3. **QueryRepository** returns ExampleReadEntity
4. **Service** maps ReadEntity → ExampleResponse
5. **Controller** returns 200 OK with response

## Testing Strategy

### Unit Tests
- Domain models (business logic)
- Mappers (transformations)
- Services (orchestration)
- Validators (rules)

### Integration Tests
- Repositories (database access)
- Controllers (HTTP endpoints)
- Middleware (request pipeline)

### End-to-End Tests
- Complete user flows
- Cross-subdomain communication
- Error scenarios

## Dependencies

### Required
- .NET 8.0+
- ASP.NET Core (for web APIs)

### Choose One ORM
- Entity Framework Core
- Dapper
- MongoDB.Driver
- NHibernate

### Choose One Message Queue
- RabbitMQ
- Azure Service Bus
- AWS SQS
- Apache Kafka

## Extending the Template

### Adding a New Feature

1. Create domain model in `/Domain/Models/`
2. Create write entity in `/Infrastructure/Persistence/Write/`
3. Create read entity in `/Infrastructure/Persistence/Read/`
4. Create mapper in `/Application/Mappers/`
5. Create repositories in `/Infrastructure/Repositories/`
6. Implement repositories in `/Infrastructure/Repositories/Impl/`
7. Create DTOs in `/Api/Dto/V1/`
8. Create service exception in `/Application/Errors/`
9. Create service in `/Application/Services/`
10. Implement service in `/Application/Services/Impl/`
11. Create controller in `/Api/Controllers/`
12. Create domain events in `/Domain/Events/`
13. Register services in DI container

### Adding Cross-Subdomain Communication

1. Define domain event in originating subdomain
2. Publish event in service after command
3. Create event subscriber in consuming subdomain
4. Register subscriber at application startup
5. Process event in subscriber handler

## Production Considerations

### Replace In-Memory Implementations

- **InMemoryEventBus** → Real message queue
- Template repositories → Real database implementation
- Add proper authentication/authorization
- Configure production logging
- Set up monitoring and observability
- Implement retry policies
- Add circuit breakers
- Configure connection pooling
- Set up database migrations
- Implement caching strategy

### Security

- Implement proper authentication (JWT, OAuth, etc.)
- Add authorization policies
- Use HTTPS only
- Implement rate limiting
- Add API key validation
- Implement CORS properly
- Validate all inputs
- Sanitize outputs
- Use parameterized queries
- Implement audit logging

### Performance

- Add caching (Redis, MemoryCache)
- Implement pagination for all lists
- Use async/await properly
- Optimize database queries
- Add database indexes
- Use connection pooling
- Implement response compression
- Add CDN for static content
- Use read replicas for queries
- Implement request throttling

## Summary

This template provides a complete, production-ready DDD architecture with:

- ✅ Strict layer separation
- ✅ CQRS pattern implementation
- ✅ Event-driven architecture
- ✅ Automatic transaction management
- ✅ Standard error handling
- ✅ Type-safe transformations
- ✅ Clear communication patterns
- ✅ Comprehensive documentation
- ✅ Example implementations
- ✅ Best practices enforced

Follow the patterns, use the examples, and build maintainable, scalable applications!
