# Architecture Guide

## Overview

This DDD infrastructure template follows Domain-Driven Design principles with CQRS pattern and clean architecture.

## Core Principles

### 1. Separation of Concerns

Each layer has a specific responsibility:

- **API Layer**: HTTP concerns only (routing, binding, validation)
- **Application Layer**: Use-case orchestration, coordination
- **Domain Layer**: Business logic and invariants
- **Infrastructure Layer**: Technical concerns (database, queues)

### 2. Dependency Direction

Dependencies flow inward:
```
API → Application → Domain
        ↓
  Infrastructure
```

- Domain has NO dependencies (pure business logic)
- Application depends on Domain
- Infrastructure depends on Domain and Application
- API depends on all layers

### 3. CQRS Pattern

Commands (writes) and Queries (reads) are separated:

**Command Side**:
- Uses `WriteEntity` (full data model)
- Goes through BMO (business model)
- Enforces business rules
- Publishes domain events

**Query Side**:
- Uses `ReadEntity` (denormalized views)
- Bypasses BMO for performance
- Optimized for specific queries
- Read-only operations

## Object Types

### 1. BMO (Business Model Object)
```
Location: /domain/models/
Suffix: Model or BMO
Purpose: Business logic and invariants
```

**Characteristics**:
- Pure Python classes
- NO database/ORM attributes
- Contains business methods
- Enforces invariants
- Factory methods for creation

**Example**:
```python
class ExampleModel(BaseModel):
    def __init__(self):
        super().__init__()
        self._name: str = ""
        self._is_active: bool = True
    
    @staticmethod
    def create(p_name: str, p_owner_id: str) -> 'ExampleModel':
        model = ExampleModel()
        model._name = p_name
        model._owner_id = p_owner_id
        model.validate()
        return model
    
    def activate(self) -> None:
        self._is_active = True
        self._updated_at = datetime.utcnow()
```

### 2. WriteEntity (Command Side)
```
Location: /infrastructure/persistence/write/
Suffix: WriteEntity
Purpose: Database persistence for commands
```

**Characteristics**:
- Has ORM attributes/decorators
- Full data model
- Used for business operations
- May have versioning for concurrency

**Example**:
```python
class ExampleWriteEntity(BaseWriteEntity):
    def __init__(self):
        super().__init__()
        self.name: str = ""
        self.owner_id: str = ""
        self.is_active: bool = True
```

### 3. ReadEntity (Query Side)
```
Location: /infrastructure/persistence/read/
Suffix: ReadEntity
Purpose: Optimized views for queries
```

**Characteristics**:
- Has ORM attributes/decorators
- Denormalized data
- May aggregate multiple sources
- Optimized for specific queries

**Example**:
```python
class ExampleReadEntity(BaseReadEntity):
    def __init__(self):
        super().__init__()
        self.name: str = ""
        self.owner_name: str = ""  # Denormalized
        self.display_name: str = ""  # Computed
        self.status_text: str = ""  # Computed
```

### 4. DTO (Data Transfer Object)
```
Location: /api/dto/
Suffix: Request or Response
Purpose: HTTP transport
```

**Characteristics**:
- Simple data containers
- Validation attributes
- NO business logic
- Framework-specific decorators

## Workflows

### Command Workflow (Create/Update/Delete)

```
1. Controller receives Request DTO
2. Controller validates DTO (edge validation)
3. Controller calls Service
4. Service maps DTO → BMO
5. BMO validates business rules
6. Service calls CommandRepository
7. Repository maps BMO → WriteEntity
8. Repository saves WriteEntity
9. Service publishes Domain Event
10. Controller returns response
```

**Flow Diagram**:
```
HTTP Request
    ↓
Controller (validate)
    ↓
Service (orchestrate)
    ↓
Mapper (DTO → BMO)
    ↓
BMO (business logic)
    ↓
Mapper (BMO → WriteEntity)
    ↓
CommandRepository (save)
    ↓
Database (WriteEntity)
    ↓
EventPublisher (domain event)
```

### Query Workflow (Find/List)

```
1. Controller receives request
2. Controller calls Service
3. Service calls QueryRepository
4. Repository returns ReadEntity
5. Service maps ReadEntity → Response DTO
6. Controller returns response
```

**Flow Diagram**:
```
HTTP Request
    ↓
Controller
    ↓
Service
    ↓
QueryRepository (query)
    ↓
Database (ReadEntity)
    ↓
Mapper (ReadEntity → Response)
    ↓
HTTP Response
```

Note: NO BMO in read path for performance!

## Mapping Strategy

All transformations MUST use explicit mappers:

```python
class ExampleMapper(IMapper):
    # Request → BMO (for commands)
    def to_model_from_request(self, p_dto: CreateRequest) -> Model
    
    # BMO → WriteEntity (for persistence)
    def to_write_entity(self, p_model: Model) -> WriteEntity
    
    # WriteEntity → BMO (for loading)
    def to_model_from_write_entity(self, p_entity: WriteEntity) -> Model
    
    # ReadEntity → Response (for queries)
    def to_response_from_read_entity(self, p_entity: ReadEntity) -> Response
    
    # BMO → Response (for command results)
    def to_response_from_model(self, p_model: Model) -> Response
```

## Transaction Management

### UnitOfWork Pattern

Transactions are managed by `UnitOfWorkMiddleware`:

1. Middleware begins transaction before controller
2. Controller → Service → Repository operations
3. Middleware commits on success (status < 400)
4. Middleware rolls back on error

**Services MUST NOT**:
- Manually begin transactions
- Manually commit transactions
- Manually rollback transactions

**Services MAY**:
- Call multiple repositories
- All operations in one transaction

## Domain Events

### Purpose
- Asynchronous subdomain-to-subdomain communication
- ONLY way to communicate between subdomains
- HTTP calls between subdomains are FORBIDDEN

### Pattern
```python
@dataclass(frozen=True)
class ExampleCreatedEvent(BaseDomainEvent):
    example_id: str
    name: str
    owner_id: str
```

### Publishing
```python
# In service after command
await self._event_publisher.publish_async(
    ExampleCreatedEvent(...),
    "example.created"
)
```

### Subscribing
```python
# Register at startup
await event_bus.subscribe_async(
    "example.created",
    subscriber.handle_example_created
)
```

## Error Handling

### ServiceException Pattern

```python
# Define error codes (enum)
class ExampleErrorCode(Enum):
    NOT_FOUND = "not_found"
    VALIDATION_FAILED = "validation_failed"

# Define exception
class ExampleServiceException(TypedServiceException[ExampleErrorCode]):
    _MESSAGE_TEMPLATES = {
        ExampleErrorCode.NOT_FOUND: "Example '{id}' not found"
    }

# Throw in service
raise ExampleServiceException(
    ExampleErrorCode.NOT_FOUND,
    {"id": example_id}
)

# Middleware catches and converts to HTTP error response
```

### HTTP Status Mapping
- `NOT_FOUND` → 404
- `CONFLICT` → 409
- `VALIDATION_FAILED` → 400
- `UNAUTHORIZED` → 401
- `FORBIDDEN` → 403
- Unknown → 500

## Communication Architecture

### Within Subdomain (Same Repo)
✅ Direct service calls
✅ Direct repository calls
✅ Synchronous operations

### Between Subdomains (Different Repos)
✅ Domain events via message queue
✅ Asynchronous communication
✅ Event-driven architecture

❌ HTTP calls between subdomains
❌ Shared databases
❌ Synchronous coupling

## Testing Strategy

### Unit Tests
- Test domain models (business logic)
- Test mappers (transformations)
- Mock repositories and services

### Integration Tests
- Test repositories (database operations)
- Test services (orchestration)
- Use test database

### End-to-End Tests
- Test controllers (HTTP)
- Test full workflows
- Use test environment

## Performance Considerations

### CQRS Benefits
- Read operations bypass BMO (faster)
- Write operations enforce business rules
- Separate optimization strategies

### Denormalization
- ReadEntities can aggregate data
- Pre-computed fields for queries
- Trade: storage for read speed

### Async Operations
- All I/O operations are async
- Non-blocking database calls
- Concurrent event publishing

## Security

### Authentication
- JWT tokens
- OAuth2
- API keys

### Authorization
- OwnershipMiddleware validates access
- Resource-level permissions
- Role-based access control (RBAC)

### Validation
- Edge validation in DTOs
- Business validation in BMOs
- Double validation strategy

## Scalability

### Horizontal Scaling
- Stateless services
- Shared database
- Load balancer

### Event-Driven
- Message queue for subdomain communication
- Asynchronous processing
- Eventual consistency

### CQRS
- Separate read and write databases
- Read replicas for queries
- Write master for commands
