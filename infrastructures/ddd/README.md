# DDD Infrastructure Templates

This directory contains Domain-Driven Design (DDD) infrastructure templates for multiple programming languages. Each template implements the same architectural patterns and standards, adapted for the idioms and best practices of its respective language.

## Purpose

These templates serve as:
1. **Starting Points** - Copy to new projects for consistent structure
2. **Reference Implementations** - Learn how DDD patterns work
3. **AI Training Data** - Help AI agents understand expected structure
4. **Pattern Libraries** - See how architectural patterns connect

## Available Templates

### ✅ C# (.NET 8.0+)
**Status**: Complete

**Location**: `./csharp/`

**Features**:
- Full CQRS implementation with separate Write/Read entities
- ASP.NET Core Web API patterns
- Comprehensive middleware pipeline
- Event-driven subdomain communication
- Type-safe error handling with ServiceException<TErrorCode>
- Complete example implementations
- Extensive documentation (README + ARCHITECTURE)

**Technologies**:
- .NET 8.0+
- ASP.NET Core
- Any ORM (EF Core, Dapper, MongoDB.Driver, etc.)
- Any message queue (RabbitMQ, Azure Service Bus, AWS SQS, etc.)

[📖 View C# Documentation](./csharp/README.md)

### ⏳ TypeScript (Node.js)
**Status**: Pending

**Planned Features**:
- Express.js or NestJS patterns
- TypeScript strict mode
- Decorators for DI
- Similar CQRS implementation
- Event-driven architecture
- TypeORM or Prisma examples

### ⏳ Python
**Status**: Pending

**Planned Features**:
- FastAPI or Flask patterns
- Type hints and Pydantic
- SQLAlchemy or similar ORM
- Async/await patterns
- Event-driven architecture
- Similar CQRS implementation

### ⏳ Java (Spring)
**Status**: Pending

**Planned Features**:
- Spring Boot framework
- Spring Data JPA
- Lombok for boilerplate reduction
- Similar CQRS implementation
- Event-driven architecture
- Maven/Gradle build systems

## Shared Architectural Patterns

All templates implement these core patterns:

### 1. CQRS (Command Query Responsibility Segregation)
- **Write Side**: Commands modify state using WriteEntities
- **Read Side**: Queries return data using denormalized ReadEntities
- Separate repositories for commands and queries
- Performance-optimized read models

### 2. Clean Architecture Layers
```
┌─────────────────────────────────────┐
│   API Layer (Controllers, DTOs)    │ ← HTTP Boundary
├─────────────────────────────────────┤
│   Application (Services, Mappers)  │ ← Use Case Orchestration
├─────────────────────────────────────┤
│   Domain (Models, Events)          │ ← Business Logic
├─────────────────────────────────────┤
│   Infrastructure (Repos, Queue)    │ ← External Systems
└─────────────────────────────────────┘
```

### 3. Event-Driven Communication
- **Within Subdomain**: Direct method calls
- **Between Subdomains**: Domain events via message queue ONLY
- **To Front-End**: REST API endpoints

### 4. Mandatory Mappers
All transformations between types require explicit mappers:
- DTO → BMO (Request to Business Model)
- BMO → WriteEntity (Business Model to Persistence)
- WriteEntity → BMO (Persistence to Business Model)
- ReadEntity → Response DTO (Query to Response)

### 5. Type-Safe Error Handling
- Enum-based error codes (NOT strings)
- Standard HTTP error response contract
- Automatic status code mapping
- Structured error details

### 6. Transaction Management
- Automatic via UnitOfWork middleware
- Commits on success (status < 400)
- Rolls back on error (status >= 400)
- Services never manually manage transactions

## Directory Structure Pattern

All templates follow this structure (adapted for language conventions):

```
template/
├── README.md                    # Quick start guide
├── ARCHITECTURE.md              # Detailed architecture docs
└── src/
    ├── api/
    │   ├── controllers/        # HTTP endpoints
    │   ├── dto/               # Request/Response DTOs
    │   └── middleware/        # Request pipeline
    ├── application/
    │   ├── services/          # Use-case orchestration
    │   │   └── impl/         # Service implementations
    │   ├── mappers/          # Type transformations
    │   └── errors/           # Service exceptions
    ├── domain/
    │   ├── models/           # Business models (NO DB attributes)
    │   └── events/           # Domain events
    └── infrastructure/
        ├── repositories/     # Data access
        │   └── impl/        # Repository implementations
        ├── persistence/     # Entities and contexts
        │   ├── write/      # WriteEntities (commands)
        │   └── read/       # ReadEntities (queries)
        └── queues/         # Event publisher/subscriber
            ├── impl/       # Queue implementations
            └── subscribers/ # Event handlers
```

## Naming Conventions

### Common Across All Languages

**Suffixes**:
- Controllers: `Controller`
- Services: `Service`
- Repositories: `Repository`
- Write Entities: `WriteEntity`
- Read Entities: `ReadEntity`
- Models/BMOs: `Model` or `BMO`
- DTOs: `Request`, `Response`, or `Dto`
- Events: `Event` (pattern: `{Object}{Action}Event`)
- Mappers: `Mapper`
- Middleware: `Middleware`

**Prefixes**:
- Interfaces: `I` (e.g., `IExampleService`)
- Member fields: `_` or `m_` depending on language
- Parameters: `p_` where supported

### Language-Specific Adaptations

Each template adapts these conventions to fit language idioms:
- **C#**: PascalCase for public, `_camelCase` for private
- **TypeScript**: camelCase, optional `_` for private
- **Python**: snake_case, optional `_` for protected
- **Java**: camelCase, `m_` prefix for members

## Communication Rules

### ✅ Allowed
- REST API endpoints for front-end communication
- Direct method calls within same subdomain
- Domain events via queue between subdomains

### ❌ Forbidden
- HTTP calls between subdomains
- Shared databases between subdomains
- Direct database access from controllers
- Business logic in controllers or repositories
- Database attributes on domain models
- Skipping mapper layer

## Getting Started

1. **Choose your language**: Select the appropriate template directory
2. **Read the README**: Understand the quick start guide
3. **Read ARCHITECTURE.md**: Understand the detailed patterns
4. **Copy the template**: Clone to your new project
5. **Update namespaces**: Change template names to your project name
6. **Implement infrastructure**: Add real database and queue
7. **Add authentication**: Configure auth/authorization
8. **Start building**: Follow the example patterns

## Example Implementations

Each template includes complete example implementations:

- ✅ **ExampleModel** - Domain model with business logic
- ✅ **ExampleWriteEntity** - Command-side persistence
- ✅ **ExampleReadEntity** - Query-side persistence
- ✅ **ExampleMapper** - All transformation patterns
- ✅ **ExampleService** - Use-case orchestration
- ✅ **ExampleCommandRepository** - Write operations
- ✅ **ExampleQueryRepository** - Read operations
- ✅ **ExampleController** - HTTP endpoints
- ✅ **ExampleCreatedEvent** - Domain event
- ✅ **ExampleServiceException** - Error handling

## Key Principles

### 1. Separation of Concerns
Each layer has a clear, single responsibility:
- **API**: HTTP boundary
- **Application**: Orchestration
- **Domain**: Business logic
- **Infrastructure**: External systems

### 2. Dependency Rule
Dependencies point inward:
```
API → Application → Domain
         ↓
   Infrastructure
```

Domain never depends on Infrastructure.

### 3. No Database in Domain
Domain models are pure business logic:
- ✅ Business rules and invariants
- ✅ Validation logic
- ✅ Domain events
- ❌ ORM attributes
- ❌ Database concerns
- ❌ Persistence logic

### 4. Explicit Mapping
Never use automatic mapping (like AutoMapper):
- Write explicit mapping code
- Control transformations
- Handle edge cases
- Clear data flow

### 5. Event-Driven Boundaries
Subdomains are autonomous:
- Own their data
- Own their logic
- Communicate via events
- No shared databases

## Testing Strategy

Each template includes test structure:

### Unit Tests
- Domain models (business logic)
- Mappers (transformations)
- Services (orchestration mocks)
- Validators (business rules)

### Integration Tests
- Repositories (real database)
- Controllers (real HTTP)
- Middleware (request pipeline)

### End-to-End Tests
- Complete user flows
- Cross-subdomain scenarios
- Error handling paths

## Production Checklist

Before deploying:

- [ ] Replace in-memory event bus with real queue
- [ ] Implement real database access
- [ ] Add authentication/authorization
- [ ] Configure production logging
- [ ] Set up monitoring/observability
- [ ] Implement retry policies
- [ ] Add circuit breakers
- [ ] Configure connection pooling
- [ ] Set up database migrations
- [ ] Implement caching strategy
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Use HTTPS only
- [ ] Implement audit logging
- [ ] Add health check endpoints

## Contributing

When adding new templates:

1. Follow the same structure pattern
2. Implement all core patterns
3. Include complete examples
4. Write comprehensive documentation
5. Add README and ARCHITECTURE docs
6. Ensure it builds successfully
7. Update this overview README

## Support

For questions about:
- **Architecture**: Read ARCHITECTURE.md in each template
- **Usage**: Read README.md in each template
- **Patterns**: Review the example implementations
- **Standards**: Check the agent instructions

## License

These templates are provided as-is for use in your projects.

---

**Current Status**: C# template complete. TypeScript, Python, and Java templates pending.
