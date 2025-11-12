# TypeScript DDD Architecture Documentation

## Overview

This document describes the Domain-Driven Design (DDD) architecture implemented in this TypeScript template, including CQRS patterns, layering principles, and communication patterns.

## Architecture Layers

The architecture follows a strict layered approach (outer → inner):

```
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (Web)                          │
│  Controllers, DTOs, Middleware                               │
│  - HTTP request/response handling                            │
│  - Input validation                                          │
│  - Authentication & Authorization                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Application Layer                           │
│  Services, Mappers, Errors                                   │
│  - Use-case orchestration                                    │
│  - Transaction coordination                                  │
│  - DTO ↔ BMO transformations                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Domain Layer                              │
│  Models (BMOs), Events                                       │
│  - Business logic and invariants                             │
│  - Domain events                                             │
│  - NO persistence concerns                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                Infrastructure Layer                          │
│  Repositories, Persistence, Queues                           │
│  - Data access (WriteEntity/ReadEntity)                      │
│  - Message queue integration                                 │
│  - External service integration                              │
└─────────────────────────────────────────────────────────────┘
```

## CQRS Implementation

### Command Side (Write Operations)

**Flow**: Controller → Service → CommandRepository → WriteEntity → Database

```typescript
// 1. Controller receives request
const request: CreateExampleRequest = { Name: 'Test', Description: 'Test' };

// 2. Service creates BMO (business logic)
const model = ExampleModel.Create(request.Name, request.Description, userId);

// 3. Repository maps BMO → WriteEntity
const entity = mapper.ToWriteEntity(model);

// 4. Save to database
await database.save(entity);

// 5. Publish domain event
await eventPublisher.PublishAsync(new ExampleCreatedEvent(...), 'example.created');
```

**Key Points:**
- BMOs contain business logic
- WriteEntities contain persistence mappings
- Mapper handles BMO ↔ WriteEntity transformations
- Command repositories return void or IDs (NOT entities)

### Query Side (Read Operations)

**Flow**: Controller → Service → QueryRepository → ReadEntity → Response

```typescript
// 1. Controller requests data
const id = request.params.id;

// 2. Service queries read repository
const entity = await queryRepository.FindByIdAsync(id);

// 3. Mapper transforms ReadEntity → Response DTO (bypasses BMO)
const response = mapper.ToResponseFromReadEntity(entity);

// 4. Return to client
return response;
```

**Key Points:**
- ReadEntities are denormalized for performance
- No BMO mapping in read path (optimization)
- Read models can aggregate data from multiple write models
- Separate read database/collections possible

## Object Types and Responsibilities

### 1. Request/Response DTOs

**Location**: `/api/dto/v1/requests/`, `/api/dto/v1/responses/`

**Purpose**: HTTP transport

**Example**:
```typescript
export class CreateExampleRequest extends BaseRequestDto {
  public Name: string;
  public Description: string;
}

export class ExampleResponse extends BaseResponseDto {
  public Id: string;
  public Name: string;
  public IsActive: boolean;
}
```

**Rules**:
- NO business logic
- Validation only (edge validation)
- Flat structure preferred
- Suffix: Request, Response, Dto

### 2. Business Model Objects (BMOs)

**Location**: `/domain/models/`

**Purpose**: Business logic and invariants

**Example**:
```typescript
export class ExampleModel extends BaseModel {
  private _name: string;
  private _isActive: boolean;

  public static Create(p_name: string, p_description: string, p_ownerId: string): ExampleModel {
    const model = new ExampleModel();
    model._name = p_name;
    model.Validate();
    return model;
  }

  public UpdateDetails(p_name: string, p_description: string): void {
    this._name = p_name;
    this._updatedAt = new Date();
    this.Validate();
  }

  public Validate(): void {
    if (!this._name || this._name.length > 100) {
      throw new Error('Invalid name');
    }
  }
}
```

**Rules**:
- Contains business logic
- **NEVER** has database attributes
- Validates its own invariants
- Uses factory methods for creation
- Member fields: `_variable` prefix

### 3. Write Entities

**Location**: `/infrastructure/persistence/write/`

**Purpose**: Command side persistence

**Example**:
```typescript
export class ExampleWriteEntity extends BaseWriteEntity {
  // ORM attributes allowed here
  // TypeORM: @Column()
  // Mongoose: @Prop()
  public Name: string;
  public Description: string;
  public OwnerId: string;
  public IsActive: boolean;
}
```

**Rules**:
- CAN have ORM/database attributes
- Mapped from BMO by mapper
- Used for CREATE, UPDATE, DELETE
- Contains all fields for business operations
- Suffix: WriteEntity

### 4. Read Entities

**Location**: `/infrastructure/persistence/read/`

**Purpose**: Query side persistence

**Example**:
```typescript
export class ExampleReadEntity extends BaseReadEntity {
  public Name: string;
  public OwnerId: string;
  public OwnerName: string;  // Denormalized from User
  public DisplayName: string; // Pre-calculated
  public StatusText: string;  // Pre-formatted
}
```

**Rules**:
- CAN have ORM/database attributes
- Denormalized for performance
- Pre-calculated display values
- MAY aggregate from multiple WriteEntities
- Returned directly to service (no BMO)
- Suffix: ReadEntity

### 5. Mappers

**Location**: `/application/mappers/`

**Purpose**: Transform between types

**Example**:
```typescript
export class ExampleMapper implements IMapper<...> {
  public ToModelFromRequest(p_dto: CreateExampleRequest): ExampleModel {
    return ExampleModel.Create(p_dto.Name, p_dto.Description, '');
  }

  public ToWriteEntity(p_model: ExampleModel): ExampleWriteEntity {
    const entity = new ExampleWriteEntity();
    entity.Id = p_model.Id;
    entity.Name = p_model.Name;
    return entity;
  }

  public ToResponseFromReadEntity(p_entity: ExampleReadEntity): ExampleResponse {
    const response = new ExampleResponse();
    response.Id = p_entity.Id;
    response.Name = p_entity.Name;
    return response;
  }
}
```

**Rules**:
- **MANDATORY** for all transformations
- No AutoMapper magic - explicit mapping
- Lives in root (no /impl/ subdirectory)
- Handles: DTO → BMO, BMO → Entity, Entity → DTO

### 6. Domain Events

**Location**: `/domain/events/`

**Purpose**: Subdomain-to-subdomain communication

**Example**:
```typescript
export class ExampleCreatedEvent extends BaseDomainEvent {
  public readonly ExampleId: string;
  public readonly Name: string;
  public readonly OwnerId: string;

  constructor(p_exampleId: string, p_name: string, p_ownerId: string, p_correlationId: string) {
    super(p_correlationId);
    this.ExampleId = p_exampleId;
    this.Name = p_name;
    this.OwnerId = p_ownerId;
  }
}
```

**Rules**:
- Immutable (readonly properties)
- Pattern: `{Object}{Action}Event`
- Include: eventId, timestamp, correlationId
- Published after state changes
- Consumed by other subdomains

## Service Exception Pattern

### Error Code Enum

```typescript
export enum ExampleErrorCode {
  NotFound = 'NotFound',
  ValidationFailed = 'ValidationFailed',
  Conflict = 'Conflict',
  Unauthorized = 'Unauthorized'
}
```

### Service Exception

```typescript
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

### HTTP Status Mapping

```typescript
NotFound → 404
Conflict → 409
ValidationFailed → 400
Unauthorized → 401
Forbidden → 403
Unknown → 500
```

## Communication Patterns

### 1. Front-End ↔ Subdomain

**Method**: REST API (HTTP)

```
Front-End → [REST API] → Controller → Service → Repository
```

**Rules**:
- REST endpoints for UI only
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response
- Authentication/authorization required

### 2. Subdomain ↔ Subdomain

**Method**: Domain Events (Message Queue)

```
Subdomain A: Service → EventPublisher → Queue
                                           ↓
Subdomain B: Queue → EventSubscriber → Service
```

**Rules**:
- **ONLY** via domain events
- **NEVER** HTTP calls between subdomains
- **NEVER** shared databases
- Asynchronous communication
- Each subdomain has own database

### 3. Within Subdomain

**Method**: Direct calls

```
Controller → Service → Repository → Database
```

**Rules**:
- Direct method calls allowed
- Follow layering (no layer skipping)
- Synchronous communication

## Middleware Pipeline

### Order of Execution

```
1. CorrelationIdMiddleware     ← Tracks requests
2. LoggingMiddleware            ← Logs requests/responses
3. AuthenticationMiddleware     ← Verifies identity
4. OwnershipMiddleware          ← Verifies resource ownership
5. UnitOfWorkMiddleware (begin) ← Begins transaction
6. Controller                   ← Handles request
7. UnitOfWorkMiddleware (end)   ← Commits/rolls back
8. ErrorHandlingMiddleware      ← Maps errors to HTTP
```

### Transaction Management

```typescript
// Automatic transaction handling by middleware
POST /api/v1/example
  ↓
UnitOfWork.BeginTransactionAsync()
  ↓
Controller.CreateExample()
  ↓
Service.CreateExampleAsync()
  ↓
Repository.SaveAsync()
  ↓
[Success: status < 400]
  ↓
UnitOfWork.CommitAsync()
  ↓
Response 201 Created

// Or on error:
[Error: status >= 400 or exception]
  ↓
UnitOfWork.RollbackAsync()
  ↓
ErrorHandlingMiddleware
  ↓
Response 4xx/5xx with ErrorResponseDto
```

## Repository Pattern

### Command Repository

```typescript
export interface ICommandRepository<TModel, TId> {
  SaveAsync(p_model: TModel): Promise<TId>;
  UpdateAsync(p_model: TModel): Promise<void>;
  DeleteAsync(p_id: TId): Promise<void>;
  FindByIdAsync(p_id: TId): Promise<TModel | null>;
}
```

**Responsibilities**:
- Receives BMOs from service
- Maps BMO → WriteEntity internally
- Performs CRUD operations
- Returns void or IDs (NOT entities)

### Query Repository

```typescript
export interface IQueryRepository<TReadEntity, TId> {
  FindByIdAsync(p_id: TId): Promise<TReadEntity | null>;
  ListAsync(p_skip: number, p_take: number): Promise<TReadEntity[]>;
}
```

**Responsibilities**:
- Returns ReadEntities directly
- No BMO mapping (performance optimization)
- Queries denormalized views
- Optimized for specific queries

## Unit of Work Pattern

```typescript
export interface IUnitOfWork {
  BeginTransactionAsync(): Promise<void>;
  CommitAsync(): Promise<void>;
  RollbackAsync(): Promise<void>;
}
```

**Usage**:
- Applied automatically by middleware
- Services NEVER manage transactions manually
- Commits on success (status < 400)
- Rolls back on error (status >= 400)

## Best Practices

### ✅ DO

1. **Separate concerns**
   - BMOs for business logic
   - Entities for persistence
   - DTOs for transport

2. **Use mappers**
   - ALL transformations via mappers
   - No AutoMapper shortcuts

3. **Domain events for subdomain communication**
   - ONLY way to communicate
   - NO HTTP between subdomains

4. **Validate at boundaries**
   - Edge validation in DTOs
   - Invariant validation in BMOs

5. **Let middleware manage transactions**
   - Don't call BeginTransaction/Commit in services

### ❌ DON'T

1. **Mix concerns**
   - Database attributes in domain models
   - Business logic in controllers/repositories

2. **Skip mappers**
   - Always use explicit mapping

3. **HTTP between subdomains**
   - Use domain events instead

4. **Share databases**
   - Each subdomain has own database

5. **Return entities from repositories**
   - Command repos return void/IDs
   - Query repos return ReadEntities

## Testing Strategy

### Unit Tests
- Test BMO business logic
- Test mapper transformations
- Test service orchestration
- Mock repositories and dependencies

### Integration Tests
- Test repository implementations
- Test database operations
- Test complete request flows

### End-to-End Tests
- Test API endpoints
- Test middleware pipeline
- Test error handling

## Summary

This architecture provides:
- ✅ Clear separation of concerns
- ✅ CQRS for read/write optimization
- ✅ Domain-driven design principles
- ✅ Event-driven subdomain communication
- ✅ Transaction management
- ✅ Scalability and maintainability

Follow these patterns consistently for a robust, maintainable codebase.
