# DDD Infrastructure Template - Java/Spring Boot

This is a comprehensive Domain-Driven Design (DDD) infrastructure template for Java/Spring Boot projects following CQRS pattern and custom architectural standards.

## Overview

This template provides a complete, production-ready DDD structure with:
- ✅ Clean separation of concerns (API, Application, Domain, Infrastructure)
- ✅ CQRS pattern (Command/Query Responsibility Segregation)
- ✅ Domain-driven design with rich business models
- ✅ Event-driven architecture for subdomain communication
- ✅ Middleware for cross-cutting concerns
- ✅ Complete example implementations

## Technology Stack

- **Language**: Java 17 (LTS)
- **Framework**: Spring Boot 3.2.0
- **Persistence**: Spring Data JPA
- **Validation**: Jakarta Bean Validation
- **Security**: Spring Security
- **Build Tool**: Maven

## Project Structure

```
src/main/java/com/oddly/ddd/
├── api/
│   ├── controllers/              # Controller implementations (no /impl/)
│   │   ├── infra/                # BaseController
│   │   └── ExampleController.java
│   ├── dto/
│   │   └── v1/
│   │       ├── infra/            # BaseRequestDto, BaseResponseDto
│   │       ├── requests/         # Request DTOs
│   │       └── responses/        # Response DTOs, ErrorResponseDto
│   └── middleware/               # Cross-cutting concerns
│       ├── UnitOfWorkMiddleware.java
│       ├── OwnershipMiddleware.java
│       ├── CorrelationIdMiddleware.java
│       └── ErrorHandlingMiddleware.java
├── application/
│   ├── services/                 # Service interfaces
│   │   ├── impl/                 # Service implementations
│   │   └── IExampleService.java
│   ├── mappers/                  # Mapper implementations (no /impl/)
│   │   ├── infra/                # IMapper interface
│   │   └── ExampleMapper.java
│   └── errors/                   # Service exceptions
│       ├── infra/                # ServiceException base class
│       └── ExampleServiceException.java
├── domain/
│   ├── models/                   # Business Model Objects (BMOs)
│   │   ├── infra/                # BaseModel
│   │   └── ExampleModel.java
│   └── events/                   # Domain events
│       ├── infra/                # BaseDomainEvent
│       ├── ExampleCreatedEvent.java
│       ├── ExampleUpdatedEvent.java
│       └── ExampleDeletedEvent.java
└── infrastructure/
    ├── persistence/
    │   ├── write/                # WriteEntities for commands
    │   │   ├── infra/            # BaseWriteEntity
    │   │   └── ExampleWriteEntity.java
    │   └── read/                 # ReadEntities for queries
    │       ├── infra/            # BaseReadEntity
    │       └── ExampleReadEntity.java
    ├── repositories/             # Repository interfaces
    │   ├── impl/                 # Repository implementations
    │   ├── infra/                # ICommandRepository, IQueryRepository, IUnitOfWork
    │   ├── IExampleCommandRepository.java
    │   └── IExampleQueryRepository.java
    └── queues/                   # Event bus implementations (no /impl/)
        ├── infra/                # IEventPublisher, IEventSubscriber
        ├── subscribers/          # Event subscribers
        └── InMemoryEventBus.java
```

## Key Architectural Patterns

### 1. CQRS (Command Query Responsibility Segregation)

**Commands (Writes)**:
- Use `WriteEntity` in `/infrastructure/persistence/write/`
- Work with Business Model Objects (BMOs)
- Handled by `ICommandRepository`

**Queries (Reads)**:
- Use `ReadEntity` in `/infrastructure/persistence/read/`
- Denormalized views optimized for queries
- Handled by `IQueryRepository`
- No BMO conversion needed

### 2. Domain Model Objects (BMOs)

- Live in `/domain/models/`
- Contain business logic and invariants
- **MUST NOT** have database/ORM annotations
- Pure domain logic only

Example:
```java
public class ExampleModel extends BaseModel {
    public void activate(String p_userId) {
        validateOwnership(p_userId);
        this.m_isActive = true;
        touch();
    }
}
```

### 3. Mappers

- Handle ALL transformations between types
- DTO ↔ BMO ↔ Entity conversions
- Implementations in root (no `/impl/` - no autowiring contracts)

### 4. Middleware Chain

Applied in order:
1. **CorrelationId** - Tracks requests across services
2. **Logging** - Logs requests/responses
3. **Authentication** - Verifies user identity
4. **Authorization/Ownership** - Checks permissions
5. **UnitOfWork** - Manages transactions
6. **Controller** - Handles request
7. **UnitOfWork commit/rollback** - Completes transaction
8. **ErrorHandling** - Standardizes error responses

### 5. Domain Events

- Follow pattern: `{Object}{Action}Event`
- Immutable (all fields final)
- Used for subdomain-to-subdomain communication
- Published via `IEventPublisher`

Example:
```java
ExampleCreatedEvent event = new ExampleCreatedEvent(
    exampleId, name, ownerId, correlationId
);
eventPublisher.publishAsync(event, "example.created");
```

## Naming Conventions

**MANDATORY** naming patterns (override Java defaults):

- **Controllers**: `Controller` suffix
- **Services**: `Service` suffix, interfaces start with `I`
- **Repositories**: `Repository` suffix
- **Write Entities**: `WriteEntity` suffix
- **Read Entities**: `ReadEntity` suffix
- **Business Models**: `Model` or `BMO` suffix
- **DTOs**: `Request`, `Response`, or `Dto` suffix
- **Domain Events**: `Event` suffix, pattern `{Object}{Action}Event`
- **Member fields**: `m_variable` prefix
- **Parameters**: `p_variable` prefix
- **Local variables**: camelCase

## Interface/Implementation Organization

### With Autowiring Contracts (Services, Repositories):
- **Interfaces**: Root directory
- **Implementations**: `/impl/` subdirectory

### Without Autowiring Contracts (Mappers, Queues, Controllers, DTOs):
- **Implementations**: Root directory (NO `/impl/`)

### Infrastructure Abstractions:
- **All base classes and generic interfaces**: `/infra/` subdirectory

## Communication Architecture

### REST APIs (Front-End Only)
- REST endpoints EXCLUSIVELY for front-end (UI)
- **MUST NOT** use HTTP between backend subdomains

### Domain Events (Subdomain-to-Subdomain)
- **MUST** use domain events via message queue
- **MUST NOT** use synchronous calls between subdomains

Example:
```java
// Subdomain A publishes event
eventPublisher.publishAsync(
    new ExampleCreatedEvent(...), 
    "example.created"
);

// Subdomain B subscribes and handles
@Component
public class ExampleEventSubscriber implements IEventSubscriber<ExampleCreatedEvent> {
    public CompletableFuture<Void> handleAsync(ExampleCreatedEvent p_event) {
        // Process event from another subdomain
    }
}
```

## Error Handling

All errors follow standardized `ErrorResponseDto` contract:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Example 'abc123' not found",
    "details": {"id": "abc123"},
    "timestamp": "2024-01-15T10:30:00",
    "path": "/api/v1/examples/abc123",
    "requestId": "correlation-id-here"
  }
}
```

Status code mapping:
- `NOT_FOUND` → 404
- `CONFLICT` → 409
- `VALIDATION_FAILED` → 400
- `UNAUTHORIZED` → 401
- `FORBIDDEN` → 403
- Others → 500

## Building and Running

The application includes `OddlyDddApplication.java` as the main entry point with Spring Boot auto-configuration.

### Prerequisites
- Java 17 or later
- Maven 3.6 or later

### Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# The application will start on http://localhost:8080

# Run tests
mvn test
```

### Available Endpoints

Once running, you can access:
- **Root**: `http://localhost:8080/` - (Configure in your controllers)
- **Health**: Configure Spring Boot Actuator for health checks
- **H2 Console**: `http://localhost:8080/h2-console` - Database console (in Development)
- **Example API**: Configure your REST endpoints in controllers

### Configuration

The application is configured via `src/main/resources/application.properties`:
- Server port
- Database connection (H2, PostgreSQL, MySQL, etc.)
- JPA/Hibernate settings
- Logging levels
- Security configuration
- Custom application properties

## Usage in New Projects

1. Copy this `java/` folder to your new project
2. Rename packages from `com.oddly.ddd` to your project namespace
3. Update `pom.xml` with your project details
4. Replace `Example*` classes with your domain objects
5. Implement actual database connections (currently using H2 for demo)
6. Implement actual event bus (currently using in-memory for demo)
7. Configure security and authentication

## Key Rules (MUST FOLLOW)

❌ **NEVER**:
- Put database attributes on `/domain/models/` classes
- Return Entity from Repository to Service (always map to BMO)
- Skip Mapper layer
- Mix WriteEntities and ReadEntities
- Use WriteEntity for queries or ReadEntity for commands
- Make HTTP calls between subdomains
- Share databases across subdomains

✅ **ALWAYS**:
- Separate BMOs (domain) from Entities (persistence)
- Create Mappers for ALL transformations
- Use CQRS pattern (separate read/write)
- Use domain events for subdomain communication
- Validate at edges (DTOs) and re-validate in domain
- Let UnitOfWork middleware handle transactions
- Follow naming conventions exactly

## Additional Resources

- [C# Implementation Reference](../csharp/) - Reference implementation
- [Architecture Decision Records](../../docs/adrs/) - Design decisions
- [OpenAPI Specification](../../docs/openapi/) - API documentation

## License

This template is provided as-is for use in Oddly projects.
