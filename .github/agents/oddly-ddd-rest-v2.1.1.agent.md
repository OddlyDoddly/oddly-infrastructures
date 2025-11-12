---
name: oddly-ddd-rest-v2.1.1
id: agent-ddd-rest-0a7f72f9
version: 2.1.1
description: >
  Build REST backends using DDD + MVC with MANDATORY separation of layers and object types.
  These are REQUIREMENTS, not suggestions. Custom standards override ALL language conventions.
goals:
  - Generate services following this architecture with zero deviation
  - All rules are MANDATORY - treat every instruction as a hard requirement
  - Custom standards ALWAYS override language/framework conventions (C#, Java, etc.)
defaults:
  language: typescript
  http_framework: nest-like
  db_engine: postgres
  orm: "lightweight; repository pattern on top"
  queue: none
  cache: none
  test_style: "unit-first; e2e for risky paths"
  api_style: rest
style:
  lines_max: 120
  prefer_vertical_space: true
  comments: concise, technical, no filler
  naming:
    - "Types PascalCase; methods camelCase. REST paths kebab-case."
  commits:
    - "Conventional: feat|fix|refactor|docs|test|build(scope): message"
---

# ⚠️ CRITICAL: READ THIS FIRST ⚠️

**THESE ARE MANDATORY REQUIREMENTS, NOT OPTIONAL GUIDELINES**

Every rule is a **MUST** unless explicitly marked optional. These custom standards OVERRIDE all language/framework conventions.

**DO NOT:**
- Follow C#/Java/framework conventions if they conflict with these rules
- Assume you know better than these specifications

## 🚨 STEP 0: .gitignore (BEFORE ANY CODE) 🚨

**MANDATORY: CREATE .gitignore BEFORE WRITING CODE**

```
# Build outputs (MANDATORY)
bin/, obj/, dist/, out/, build/, target/
*.dll, *.exe, *.so, *.dylib, *.pdb, *.class, *.pyc, *.o

# IDE/Editor (MANDATORY)
.vs/, .vscode/, .idea/, *.suo, *.user

# Dependencies (MANDATORY)
node_modules/, packages/, __pycache__/, *.egg-info/

# OS/Caches (MANDATORY)
.DS_Store, Thumbs.db, *.cache, .nuget/
```

**IF YOU COMMIT BINARIES/BUILD ARTIFACTS, YOU HAVE FAILED**

## Pre-flight Checklist (MANDATORY before coding)

- [ ] .gitignore exists with all patterns above
- [ ] I understand: BMOs in /domain/models/ MUST NOT have database attributes
- [ ] I understand: Entities in /infrastructure/persistence/ MUST end with "Entity" suffix
- [ ] I understand: WriteEntities (commands) vs ReadEntities (queries) separation
- [ ] I understand: Mappers REQUIRED in /application/mappers/ for all transformations
- [ ] I understand: Repositories map Entity internally, return BMO externally
- [ ] I understand: Custom standards override C#/Java/framework conventions
- [ ] I understand: Services/Repositories - interfaces in root, implementations in /impl/
- [ ] I understand: Objects without contracts (Mappers, Queues, Controllers, DTOs) - implementations in root (no /impl/)
- [ ] I understand: ALL folders need /infra/ subdirectory for abstractions (BaseRepository, IMapper, ServiceException, BaseModel, BaseEntity, etc.)

---

# ❌ ANTI-PATTERNS (NEVER DO THESE) ❌

**FORBIDDEN - If you do any of these, you have failed:**

❌ **Database attributes on /domain/models/ classes** - Domain models MUST be pure business logic
❌ **Returning Entity from Repository to Service** - Repositories MUST map Entity → BMO
❌ **Skipping Mapper layer** - ALL transformations require explicit mappers
❌ **Following framework conventions over custom standards** - OUR standards win
❌ **ServiceExceptions in /application/services/** - MUST be in `/application/errors/`
❌ **Committing build artifacts** - bin/, obj/, *.dll, *.exe, node_modules/, etc.
❌ **Mixing service/repository interfaces with implementations** - Interfaces in root, impls in /impl/
❌ **Creating /impl/ for objects without contracts** - Mappers, Queues, Controllers, DTOs have no contracts, keep implementations in root
❌ **Missing /infra/ subdirectory** - EVERY folder needs /infra/ for base classes/abstractions (BaseRepository, IMapper, ServiceException, BaseModel, BaseEntity, BaseController, BaseRequest, BaseResponse, etc.)
❌ **Putting infrastructure abstractions with implementations** - ALL base classes and generic interfaces MUST go in /infra/
❌ **Mixing ReadEntities and WriteEntities** - Separate /write/ and /read/ directories
❌ **Using WriteEntity for queries or ReadEntity for commands** - Strict separation required
❌ **Single repository for read/write** - MUST separate ICommandRepository and IQueryRepository
❌ **Manual transaction management** - UnitOfWork middleware handles ALL transactions
❌ **Skipping ownership checks** - MUST verify user owns resource
❌ **Wrong domain event naming** - MUST suffix with `Event`: `{Object}{Action}Event`
❌ **HTTP calls between subdomains** - MUST use domain events via queue
❌ **Direct database access across subdomains** - Each subdomain has own database
❌ **Non-standard error responses** - MUST follow ErrorResponse contract

---

# Architecture Rules (MANDATORY)

## LAYERS (outer → inner):

1. **Web/Controller**: HTTP only. Bind, validate, authorize, map DTOs. NO business logic.
2. **Application/Service**: Orchestrates use-cases, transactions, policies. Calls repos/domain services.
3. **Domain**: BMOs + domain services. Pure logic. NO persistence annotations.
4. **Data Access**: Repositories only. Persistence logic. Maps Entity ↔ BMO internally.

## CQRS Pattern (MANDATORY):

### WriteEntity (Commands):
- MUST: `/infrastructure/persistence/write/` with `WriteEntity` suffix
- MUST: Used when business logic executes against data
- MUST: Contains all fields needed for business operations

### ReadEntity (Queries):
- MUST: `/infrastructure/persistence/read/` with `ReadEntity` suffix
- MUST: Pre-rendered views optimized for front-end
- MUST: Denormalized for query performance
- MAY: Aggregate from multiple WriteEntities

### Repository Separation:
- **CommandRepository**: Works with WriteEntity, receives BMO, returns void/ID
- **QueryRepository**: Returns ReadEntity directly to service (no BMO in read path)

## OBJECT TYPES (MANDATORY):

**Decision Tree:**
1. **HTTP transport?** → `/api/dto/` suffix: Request|Response|Dto
2. **Business logic?** → `/domain/models/` suffix: Model|BMO (NO ORM attributes)
3. **Database mapping?** → Determine Write or Read:
   - **Write (Commands)**: `/infrastructure/persistence/write/` suffix: WriteEntity
   - **Read (Queries)**: `/infrastructure/persistence/read/` suffix: ReadEntity
4. **Transforms types?** → `/application/mappers/` suffix: Mapper

**Rules:**
- DTOs: Transport only, /api/dto/, NO business logic
- BMOs: Behavior + invariants, /domain/models/, NO database attributes
- WriteEntity: Commands, /persistence/write/, WITH ORM attributes
- ReadEntity: Queries, /persistence/read/, WITH ORM attributes, denormalized
- Mappers: Explicit transformers, /application/mappers/, DTO ↔ BMO ↔ Entity
- Domain Events: /domain/events/, suffix `Event`, pattern: `{Object}{Action}Event`, immutable

## RULES:
- MUST: Controllers → Services → Repositories → DB. No sideways calls.
- MUST NOT: Business logic in controllers or repositories
- MUST: Validate at edge (DTOs), re-validate invariants in domain
- MUST: Idempotency-Key on mutating endpoints
- MUST: Propagate correlation/request IDs

---

# Project Structure (MANDATORY)

```
/src/
  /api/
    /controllers/      # Controller implementations (no /impl/ - no contracts)
      /infra/          # Base controllers, abstractions
    /dto/              # DTO root
      /requests/       # Request DTOs
      /responses/      # Response DTOs
      /infra/          # BaseRequest, BaseResponse, common DTO abstractions
    /middleware/       # Security, UnitOfWork, auth, logging, errors
  /application/
    /services/         # Service interfaces (I{Feature}Service)
      /impl/           # Service implementations ({Feature}Service)
    /mappers/          # Mapper implementations (no /impl/ - no autowiring contracts)
      /infra/          # Infrastructure abstractions (IMapper interface, BaseMapper)
    /policies/         # Authorization, domain policies
    /errors/           # Service-scoped errors
      /infra/          # ServiceException base class
  /domain/
    /models/           # BMOs with behavior (NO DB ATTRIBUTES)
      /infra/          # BaseModel, common domain abstractions
    /events/           # Domain events
  /infrastructure/
    /repositories/     # Repository interfaces (ICommandRepository, IQueryRepository)
      /impl/           # Repository implementations (concrete repos)
      /infra/          # Infrastructure abstractions (BaseRepository)
    /persistence/      # Entities, contexts, migrations
      /write/          # WriteEntities for commands
        /infra/        # BaseWriteEntity
      /read/           # ReadEntities for queries
        /infra/        # BaseReadEntity
      /infra/          # BaseEntity, DbContext
    /queues/           # Queue implementations (no /impl/ - no contracts)
      /infra/          # IEventPublisher, IEventSubscriber interfaces
      /middleware/     # Queue UnitOfWork
      /subscribers/    # Event subscribers
    /integrations/     # External HTTP clients
/tests/
  /unit/, /e2e/
/docs/
  /openapi/, /adrs/
```

**Namespace MUST follow folder structure.**

## Interface/Implementation/Abstraction Separation (MANDATORY):

### For Services & Repositories (with autowiring contracts):
- **Interfaces**: Root directory (e.g., `/application/services/I{Feature}Service`)
- **Implementations**: `/impl/` subdirectory (e.g., `/application/services/impl/{Feature}Service`)
- **Infrastructure**: `/infra/` subdirectory for base classes
- **MUST**: Interface names start with `I`

### For Objects WITHOUT Autowiring Contracts:
- **Implementations**: Root directory (NO `/impl/` subdirectory)
- **Applies to**: Mappers, Queues, Controllers, DTOs
- **Examples**: 
  - `/application/mappers/{Feature}Mapper` - Mapper implementation in root
  - `/infrastructure/queues/EventBus` - Queue implementation in root
  - `/api/controllers/{Feature}Controller` - Controller in root
  - `/api/dto/requests/{Feature}Request` - Request DTO in root
  - `/api/dto/responses/{Feature}Response` - Response DTO in root
- **Reason**: No autowiring contracts means no interface/implementation split needed

### For Infrastructure Abstractions (MANDATORY in ALL folders):
- **Base Classes/Interfaces**: `/infra/` subdirectory in EVERY folder
- **MUST**: Every folder type needs `/infra/` for abstractions
- **Examples**: 
  - `/application/mappers/infra/IMapper` - Mapper interface
  - `/application/errors/infra/ServiceException` - Base exception class
  - `/infrastructure/repositories/infra/BaseRepository` - Base repository
  - `/infrastructure/persistence/infra/BaseEntity` - Base entity
  - `/infrastructure/persistence/write/infra/BaseWriteEntity` - Base write entity
  - `/infrastructure/persistence/read/infra/BaseReadEntity` - Base read entity
  - `/infrastructure/queues/infra/IEventPublisher` - Queue interface
  - `/api/controllers/infra/BaseController` - Base controller
  - `/api/dto/infra/BaseRequest` - Base request DTO
  - `/api/dto/infra/BaseResponse` - Base response DTO
  - `/domain/models/infra/BaseModel` - Base domain model
- **Purpose**: Centralize ALL generic abstractions, base classes, and shared interfaces

---

# Naming Conventions (MANDATORY - override defaults)

- Controllers: `Controller` suffix
- Services: `Service` suffix
- Repositories: `Repository` suffix
- Write entities: `WriteEntity` suffix in /persistence/write/
- Read entities: `ReadEntity` suffix in /persistence/read/
- Business models: `Model` or `BMO` suffix
- DTOs: `Request`|`Response`|`Dto` suffix
- Domain events: `Event` suffix, pattern: `{Object}{Action}Event` (e.g., `{Object}CreatedEvent`)
- Middleware: `Middleware` suffix
- Async functions: `Async` suffix
- Member fields: `_variable` (underscore prefix) or `m_variable` (if underscore disallowed)
- Parameters: `p_variable` (p_ prefix)
- Local variables: camelCase

**Example:**
```csharp
// /domain/models/{Feature}Model.cs - NO DB attributes
public class {Feature}Model {
    private string _id;
    public void ValidateBusinessRule(string p_param) { }
}

// /infrastructure/persistence/write/{Feature}WriteEntity.cs - Commands
[BsonCollection("{features}")]
public class {Feature}WriteEntity {
    [BsonId] public string Id { get; set; }
    [BsonElement("field")] public string Field { get; set; }
}

// /infrastructure/persistence/read/{Feature}ReadEntity.cs - Queries
[BsonCollection("{features}_view")]
public class {Feature}ReadEntity {
    [BsonId] public string Id { get; set; }
    [BsonElement("field")] public string Field { get; set; }
    [BsonElement("computed_field")] public string ComputedField { get; set; }
}

// /application/mappers/infra/IMapper.cs - Infrastructure abstraction
public interface IMapper<TDto, TModel, TWriteEntity, TReadEntity> {
    TModel ToModel(TWriteEntity p_entity);
    TWriteEntity ToWriteEntity(TModel p_model);
    TDto ToResponse(TReadEntity p_entity);
}

// /application/mappers/{Feature}Mapper.cs - Implementation in root (no /impl/)
public class {Feature}Mapper : IMapper<{Feature}Response, {Feature}Model, {Feature}WriteEntity, {Feature}ReadEntity> {
    public {Feature}Model ToModel({Feature}WriteEntity p_entity) { }
    public {Feature}WriteEntity ToWriteEntity({Feature}Model p_model) { }
    public {Feature}Response ToResponse({Feature}ReadEntity p_entity) { }
}

// /api/dto/infra/BaseRequest.cs - Infrastructure abstraction
public abstract class BaseRequest {
    public string RequestId { get; set; }
}

// /api/dto/infra/BaseResponse.cs - Infrastructure abstraction
public abstract class BaseResponse {
    public string RequestId { get; set; }
    public DateTime Timestamp { get; set; }
}

// /api/dto/requests/Create{Feature}Request.cs - Request in /requests/ folder
public class Create{Feature}Request : BaseRequest {
    public string Name { get; set; }
    public string Description { get; set; }
}

// /api/dto/responses/{Feature}Response.cs - Response in /responses/ folder
public class {Feature}Response : BaseResponse {
    public string Id { get; set; }
    public string Name { get; set; }
}

// /api/controllers/infra/BaseController.cs - Infrastructure abstraction
public abstract class BaseController {
    protected void ValidateRequest(BaseRequest p_request) { }
}

// /api/controllers/{Feature}Controller.cs - Controller in root (no /impl/)
public class {Feature}Controller : BaseController {
    public async Task<{Feature}Response> CreateAsync(Create{Feature}Request p_request) { }
}

// /infrastructure/queues/infra/IEventPublisher.cs - Infrastructure abstraction
public interface IEventPublisher {
    Task PublishAsync<TEvent>(TEvent p_event) where TEvent : class;
}

// /infrastructure/queues/EventBus.cs - Queue implementation in root (no /impl/)
public class EventBus : IEventPublisher {
    public async Task PublishAsync<TEvent>(TEvent p_event) where TEvent : class { }
}

// /application/errors/infra/ServiceException.cs - Infrastructure abstraction
public abstract class ServiceException : Exception {
    public abstract Enum ErrorCode { get; }
}

// /domain/models/infra/BaseModel.cs - Infrastructure abstraction
public abstract class BaseModel {
    protected string _id;
    public string Id => _id;
}

// /infrastructure/persistence/infra/BaseEntity.cs - Infrastructure abstraction
public abstract class BaseEntity {
    public string Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

// /infrastructure/persistence/write/infra/BaseWriteEntity.cs - Infrastructure abstraction
public abstract class BaseWriteEntity : BaseEntity {
    public int Version { get; set; }
}

// /infrastructure/persistence/read/infra/BaseReadEntity.cs - Infrastructure abstraction
public abstract class BaseReadEntity : BaseEntity {
    // Optimized for queries
}
```

---

# Abstract Patterns (MANDATORY)

### WriteEntity Pattern:
```typescript
// /infrastructure/persistence/write/ - For commands
abstract class BaseWriteEntity {
  id: Id
  version?: number
  createdAt: Date
  updatedAt: Date
}
```

### ReadEntity Pattern:
```typescript
// /infrastructure/persistence/read/ - For queries
abstract class BaseReadEntity {
  id: Id
  // Optimized fields for query patterns
}
```

### Repository Pattern (CQRS):
```typescript
interface ICommandRepository<TModel, TId> {
  SaveAsync(model: TModel): Promise<TId>      // Maps BMO → WriteEntity
  UpdateAsync(model: TModel): Promise<void>
  DeleteAsync(id: TId): Promise<void>
}

interface IQueryRepository<TId> {
  FindByIdAsync(id: TId): Promise<ReadEntity|null>
  ListByFilterAsync(filter): Promise<ReadEntity[]>
}
```

### Mapper Pattern:
```typescript
interface IMapper<TDto, TModel, TWriteEntity, TReadEntity> {
  ToModelFromRequest(dto: TDto): TModel
  ToWriteEntity(model: TModel): TWriteEntity
  ToResponseFromReadEntity(entity: TReadEntity): BaseResponseDto
  ToResponseFromModel(model: TModel): BaseResponseDto
}
```

---

# Middleware Patterns (MANDATORY)

**MUST apply in this order:**
1. Correlation ID → 2. Logging → 3. Authentication → 4. Authorization/Ownership → 5. UnitOfWork → 6. Controller → 7. UnitOfWork commit/rollback → 8. Error Handling

## 1. Ownership Middleware (MANDATORY):
```typescript
// /api/middleware/OwnershipMiddleware.ts
export class OwnershipMiddleware {
  async execute(request: Request, next: Next) {
    const userId = extractUserId(request);
    const resourceId = request.params.id;
    
    if (await isPublicResource(resourceId)) return next();
    if (!await verifyOwnership(userId, resourceId)) 
      throw new ForbiddenException('Access denied');
    
    return next();
  }
}
```

## 2. UnitOfWork Middleware (MANDATORY):
```typescript
// /api/middleware/UnitOfWorkMiddleware.ts
export class UnitOfWorkMiddleware {
  async execute(request: Request, response: Response, next: Next) {
    try {
      await this._unitOfWork.beginTransaction();
      await next();
      
      if (response.statusCode < 400) {
        await this._unitOfWork.commit();
      } else {
        await this._unitOfWork.rollback();
      }
    } catch (error) {
      await this._unitOfWork.rollback();
      throw error;
    }
  }
}
```

**UnitOfWork Interface:**
```typescript
export interface IUnitOfWork {
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  saveChanges(): Promise<void>;
}
```

---

# Domain Events & Queue (MANDATORY)

## Domain Event Rules:
- MUST: Suffix with `Event`, pattern: `{Object}{Action}Event`
- MUST: Be immutable (readonly fields)
- MUST: Live in `/domain/events/`
- MUST: Include timestamp, correlationId

**Pattern:**
```typescript
// /domain/events/{Object}CreatedEvent.ts
export class {Object}CreatedEvent {
  readonly eventId: string;
  readonly objectId: string;
  readonly timestamp: Date;
  readonly correlationId: string;
  
  constructor(data: {Object}CreatedEventData) {
    this.eventId = generateId();
    this.objectId = data.objectId;
    this.timestamp = new Date();
    this.correlationId = data.correlationId;
    Object.freeze(this);
  }
}
```

## Queue Abstraction:
```typescript
// /infrastructure/queues/
export interface IEventPublisher {
  publish<TEvent>(event: TEvent, topic: string): Promise<void>;
}

export interface IEventSubscriber {
  subscribe<TEvent>(topic: string, handler: (event: TEvent) => Promise<void>): Promise<void>;
}
```

**Topic Naming:** `{subdomain}.{action}` (e.g., `{subdomain}.created`, `{subdomain}.processed`)

---

# Service Exception Policy (MANDATORY)

**ALL exceptions MUST follow this pattern:**
- Pattern: `{Object}ServiceException`
- Define: `{Object}ErrorCode` enum (NOT strings)
- Inherit: `ServiceException<TErrorCode>`
- Location: `/application/errors/` (NOT /services/)

**Base Template:**
```csharp
namespace Application.Errors
{
    public abstract class ServiceException : Exception {
        public abstract Enum GenericErrorCode { get; }
        public abstract Type ErrorCodeType { get; }
    }

    public abstract class ServiceException<TErrorCode> : ServiceException
        where TErrorCode : Enum
    {
        public readonly TErrorCode ErrorCode;
        public readonly IReadOnlyDictionary<string, object>? Details;
        
        protected ServiceException(
            TErrorCode p_code,
            IReadOnlyDictionary<string, string> p_messageTemplates,
            IReadOnlyDictionary<string, object>? p_details = null
        ) : base(FormatMessage(p_code, p_messageTemplates, p_details), ...) {
            ErrorCode = p_code;
            Details = p_details;
        }
    }
}
```

**Usage:**
```csharp
// /application/errors/{Feature}ServiceException.cs
public enum {Feature}ErrorCode { NotFound, ValidationFailed, Conflict }

public class {Feature}ServiceException : ServiceException<{Feature}ErrorCode> {
    private static readonly IReadOnlyDictionary<string, string> _messageTemplates = 
        new Dictionary<string, string> {
            { nameof({Feature}ErrorCode.NotFound), "{Feature} '{id}' not found" },
            { nameof({Feature}ErrorCode.ValidationFailed), "Validation failed: {reason}" }
        };
    
    public {Feature}ServiceException(
        {Feature}ErrorCode p_code, 
        IReadOnlyDictionary<string, object>? p_details = null
    ) : base(p_code, _messageTemplates, p_details) { }
}
```

---

# HTTP Error Response (MANDATORY)

**Standard Contract:**
```typescript
interface ErrorResponse {
  error: {
    code: string;        // Error code from enum
    message: string;     // Human-readable message
    details?: object;    // Optional structured details
    timestamp: string;   // ISO 8601
    path: string;        // Request path
    requestId: string;   // Correlation ID
  }
}
```

**Status Code Mapping:**
- NotFound → 404
- Conflict → 409
- ValidationFailed → 400
- Unauthorized → 401
- Forbidden → 403
- Unknown → 500

**MUST NOT leak internal details in production.**

---

# Communication Architecture (MANDATORY)

**CRITICAL: Domain vs Subdomain**
- **Domain**: Entire business domain (multi-repo)
- **Subdomain**: Individual repository/bounded context

## Rules:

### Rule 1: REST ONLY for Front-End
- MUST: REST endpoints EXCLUSIVELY for front-end (UI)
- MUST NOT: HTTP calls between backend subdomains

### Rule 2: Subdomain-to-Subdomain via Events ONLY
- MUST: Domain events via message queue for cross-subdomain communication
- MUST NOT: Synchronous calls between subdomains

**Pattern:**
```typescript
// Subdomain A Service (Publisher)
class {Feature}Service {
  async create{Feature}(p_object: {Feature}Model): Promise<string> {
    const objectId = await this._commandRepo.CreateAsync(p_object);
    
    await this._eventPublisher.Publish(
      new {Object}CreatedEvent({ objectId, ... })
    );
    
    return objectId;
  }
}

// Subdomain B Service (Subscriber - different repo)
class {Related}EventHandler implements IEventSubscriber<{Object}CreatedEvent> {
  async handle(p_event: {Object}CreatedEvent): Promise<void> {
    await this._relatedService.ProcessAsync({
      objectId: p_event.objectId,
      data: p_event.data
    });
  }
}
```

### Rule 3: Within Subdomain - Direct Calls OK
- MUST: Within same repo, direct service calls allowed
- MUST: Follow hierarchy: Controller → Service → Repository

## Anti-Patterns (FORBIDDEN):
❌ HTTP between subdomains
❌ Synchronous subdomain coupling
❌ Shared database between subdomains
❌ Front-end subscribing to queue

**Architecture:**
```
Front-End → REST API (per subdomain)
           ↓
     Subdomain Services
           ↓
     Message Queue (Events)
           ↓
     Other Subdomains (Subscribe)
```

---

# Scaffolding Plan (MANDATORY)

**MUST print plan BEFORE edits:**
1. Summary: stack + rationale
2. File tree: new/changed paths
3. Per-file intent
4. DI/wiring notes
5. Config/env additions
6. Test plan
7. Rollback plan

**Scaffold Structure (CQRS):**
```
/src/infrastructure/persistence/
  /write/ - {Feature}WriteEntity implementations
    /infra/ - BaseWriteEntity
  /read/ - {Feature}ReadEntity implementations
    /infra/ - BaseReadEntity
  /infra/ - BaseEntity, DbContext
/src/domain/models/ - {Feature}Model implementations
  /infra/ - BaseModel
/src/application/mappers/ - {Feature}Mapper implementations (in root, no /impl/)
  /infra/ - IMapper interface, BaseMapper abstractions
/src/application/services/ - I{Feature}Service interfaces
  /impl/ - {Feature}Service implementations
/src/application/errors/ - {Feature}ServiceException implementations
  /infra/ - ServiceException base class
/src/infrastructure/repositories/ - ICommandRepository, IQueryRepository interfaces
  /impl/ - CommandRepository, QueryRepository implementations
  /infra/ - BaseRepository, common abstractions
/src/api/dto/ - DTO root
  /requests/ - Create{Feature}Request, Update{Feature}Request
  /responses/ - {Feature}Response
  /infra/ - BaseRequest, BaseResponse
/src/api/controllers/ - {Feature}Controller implementations (in root, no /impl/)
  /infra/ - BaseController
/src/api/middleware/ - OwnershipMiddleware, UnitOfWorkMiddleware
/src/domain/events/ - {Feature}{Action}Event
/src/infrastructure/queues/ - EventBus, concrete implementations (in root, no /impl/)
  /infra/ - IEventPublisher, IEventSubscriber interfaces
  /middleware/ - Queue UnitOfWork
  /subscribers/ - EventSubscribers
```

---

# Final Reminders

**THESE ARE REQUIREMENTS, NOT SUGGESTIONS:**

1. ✅ MUST separate BMOs (domain) from Entities (persistence)
2. ✅ MUST create Mappers for all transformations
3. ✅ MUST NOT put database attributes in /domain/models/
4. ✅ MUST separate WriteEntities (commands) from ReadEntities (queries)
5. ✅ MUST use WriteEntity suffix in /persistence/write/
6. ✅ MUST use ReadEntity suffix in /persistence/read/
7. ✅ MUST use Model suffix for domain classes
8. ✅ MUST follow exact filesystem structure
9. ✅ MUST prioritize custom standards over framework conventions
10. ✅ MUST separate service/repository interfaces from implementations (/impl subdirectory)
11. ✅ MUST keep implementations in root for objects WITHOUT contracts (Mappers, Queues, Controllers, DTOs)
12. ✅ MUST create /infra/ subdirectory in EVERY folder for base classes and abstractions
13. ✅ MUST put ServiceException in /application/errors/infra/ subdirectory
14. ✅ MUST separate DTOs into /requests/ and /responses/ folders
15. ✅ MUST put BaseRequest and BaseResponse in /api/dto/infra/
16. ✅ MUST put IEventPublisher and IEventSubscriber in /infrastructure/queues/infra/
17. ✅ MUST separate Command and Query repositories
18. ✅ MUST implement OwnershipMiddleware
19. ✅ MUST implement UnitOfWorkMiddleware
20. ✅ MUST use domain events with `{Object}{Action}Event` pattern
21. ✅ MUST abstract queue with IEventPublisher/IEventSubscriber in /infra/
22. ✅ MUST use REST ONLY for front-end (NOT subdomain-to-subdomain)
23. ✅ MUST use domain events for ALL subdomain-to-subdomain communication
24. ✅ MUST follow standard HTTP error response contract
25. ✅ MUST map ServiceException codes to HTTP status codes
26. ✅ MUST NOT make HTTP calls between subdomains or share databases

**If you violate any of these rules, you have failed the task.**
