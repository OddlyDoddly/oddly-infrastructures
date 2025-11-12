---
name: oddly-ddd-rest-v2.3.0
id: agent-ddd-rest-0a7f72f9
version: 2.3.0
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

## 🚨 STEP 0.5: Copy Pre-Approved Infrastructure (BEFORE ANY CODE) 🚨

**MANDATORY: COPY INFRASTRUCTURE BEFORE WRITING CODE**

When creating a NEW project, you MUST copy the pre-approved infrastructure from the oddly-infrastructures repository as the starting base. This ensures every implementation starts with consistent, production-ready infrastructure patterns.

**Process:**

1. **Detect Language**: Determine the target language for the project (C#, Java, Python, or TypeScript)
   
2. **Clone Infrastructure Repository**:
   ```bash
   git clone https://github.com/OddlyDoddly/oddly-infrastructures.git /tmp/oddly-infrastructures
   ```

3. **Copy Language-Specific Infrastructure**:
   - **C#**: Copy from `/tmp/oddly-infrastructures/infrastructures/ddd/CSharp/`
   - **Java**: Copy from `/tmp/oddly-infrastructures/infrastructures/ddd/Java/`
   - **Python**: Copy from `/tmp/oddly-infrastructures/infrastructures/ddd/Python/`
   - **TypeScript**: Copy from `/tmp/oddly-infrastructures/infrastructures/ddd/TypeScript/`

4. **Copy to Project Root**:
   ```bash
   # Example for C#
   cp -r /tmp/oddly-infrastructures/infrastructures/ddd/CSharp/* ./
   
   # Example for TypeScript
   cp -r /tmp/oddly-infrastructures/infrastructures/ddd/TypeScript/* ./
   ```

5. **Verify Infrastructure Copied**:
   - Base classes and abstractions should now exist
   - Middleware implementations should be present
   - Configuration files should be in place

**This infrastructure includes:**
- Base classes (BaseEntity, BaseModel, BaseRepository, etc.)
- Middleware implementations (UnitOfWork, Ownership, etc.)
- Standard exceptions and error handling
- Configuration templates
- Testing infrastructure
- Build and deployment scripts

**CRITICAL RULES:**

- **MUST** copy infrastructure BEFORE generating any code
- **MUST** use the copied infrastructure as the foundation
- **MUST NOT** regenerate infrastructure that already exists in the copied base
- **MUST** extend and customize the copied infrastructure, not replace it
- **MUST** verify infrastructure is present before proceeding

**Example Workflow:**

```bash
# 1. Detect language (e.g., C#)
# 2. Clone infrastructure repo
git clone https://github.com/OddlyDoddly/oddly-infrastructures.git /tmp/oddly-infrastructures

# 3. Copy C# infrastructure
cp -r /tmp/oddly-infrastructures/infrastructures/ddd/CSharp/* ./

# 4. Verify base files exist
ls -la ./src/infrastructure/persistence/infra/BaseEntity.cs
ls -la ./src/api/middleware/UnitOfWorkMiddleware.cs

# 5. Now proceed with feature-specific code generation
```

**IF YOU SKIP THIS STEP, YOU HAVE FAILED**

## Pre-flight Checklist (MANDATORY before coding)

- [ ] .gitignore exists with all patterns above
- [ ] Pre-approved infrastructure copied from oddly-infrastructures repository (for NEW projects)
- [ ] Base infrastructure files verified present (BaseEntity, BaseRepository, middleware, etc.)
- [ ] I understand: Use copied infrastructure as foundation, do NOT regenerate it
- [ ] I understand: BMOs in /domain/models/ MUST NOT have database attributes
- [ ] I understand: Entities in /infrastructure/persistence/ MUST end with "Entity" suffix
- [ ] I understand: WriteEntities (commands) vs ReadEntities (queries) separation
- [ ] I understand: Mappers REQUIRED in /application/mappers/ for all transformations
- [ ] I understand: Repositories map Entity internally, return BMO externally
- [ ] I understand: Custom standards override C#/Java/framework conventions
- [ ] I understand: Services/Repositories - interfaces in root, implementations in /impl/
- [ ] I understand: Objects without contracts (Mappers, Queues, Controllers, DTOs) - implementations in root (no /impl/)
- [ ] I understand: ALL folders need /infra/ subdirectory for abstractions (BaseRepository, IMapper, ServiceException, BaseModel, BaseEntity, etc.)
- [ ] I understand: ALL date/time fields MUST include `Utc` suffix (e.g., `createdAtUtc`, `scheduledTimeUtc`)
- [ ] I understand: ALL timestamps MUST be stored in UTC in the database
- [ ] I understand: ALL variables with units MUST include the unit in the name (e.g., `durationSeconds`, `lengthMeters`)

---

# ❌ ANTI-PATTERNS (NEVER DO THESE) ❌

**FORBIDDEN - If you do any of these, you have failed:**

❌ **Skipping infrastructure copy step** - NEW projects MUST start with pre-approved infrastructure from oddly-infrastructures
❌ **Regenerating infrastructure that exists in copied base** - Use what's provided, don't recreate
❌ **Starting new project without cloning oddly-infrastructures** - Foundation MUST come from approved repo
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
❌ **Date/time fields without `Utc` suffix** - ALL date/time properties MUST end with `Utc` (e.g., `createdAtUtc`, NOT `createdAt`)
❌ **Storing dates in non-UTC timezone** - ALL timestamps MUST be converted to UTC before database storage
❌ **Variables with units missing the unit** - Variables representing measurements MUST include unit (e.g., `durationSeconds`, NOT `duration`)
❌ **Accepting date/time without timezone offset** - API inputs MUST include timezone information

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
- **Date/Time fields (MANDATORY)**: MUST include `Utc` suffix for ALL date/time columns and properties (e.g., `CreatedAtUtc`, `UpdatedAtUtc`, `ScheduledTimeUtc`)
- **Variables with units of measurement (MANDATORY)**: MUST include the unit in the variable name (e.g., `DurationSeconds`, `DurationMinutes`, `LengthMiles`, `LengthCentimeters`, `LengthKilometers`, `WeightKilograms`, `TemperatureCelsius`)

**Example patterns (use copied infrastructure for full implementations):**
```csharp
// Domain: NO DB attributes
public class {Feature}Model { private string _id; }

// WriteEntity: Commands with ORM
[BsonCollection("{features}")]
public class {Feature}WriteEntity { [BsonId] public string Id; }

// ReadEntity: Queries with ORM
[BsonCollection("{features}_view")]
public class {Feature}ReadEntity { [BsonId] public string Id; }

// Mappers: In root (no /impl/)
public class {Feature}Mapper : IMapper<...> { }

// Controllers: In root (no /impl/)
public class {Feature}Controller : BaseController { }

// Base classes: In /infra/
public abstract class BaseEntity { 
    public DateTime CreatedAtUtc; // MUST include Utc suffix
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
  createdAtUtc: Date  // MUST include Utc suffix and store in UTC
  updatedAtUtc: Date  // MUST include Utc suffix and store in UTC
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

# Date/Time and Timezone Handling (MANDATORY)

**MUST store ALL timestamps in UTC with `Utc` suffix in names:**

✅ CORRECT: `createdAtUtc`, `updatedAtUtc`, `scheduledTimeUtc`  
❌ WRONG: `createdAt`, `created`, `timestamp`

**Unit of Measurement (MANDATORY):**

Variables with units MUST include the unit: `durationSeconds`, `lengthMeters`, `weightKilograms`, `temperatureCelsius`  
❌ WRONG: `duration`, `length`, `weight`, `temperature`

**Example:**
```typescript
interface CreateEventRequest {
  scheduledTimeUtc: string;  // ISO 8601 with timezone
  durationMinutes: number;
}
class EventWriteEntity {
  scheduledTimeUtc: Date;    // Stored in UTC
  durationMinutes: number;
  createdAtUtc: Date;
}
```

---

# Middleware Patterns (MANDATORY)

**Order:** Correlation ID → Logging → Auth → Authorization/Ownership → UnitOfWork → Controller → UnitOfWork commit/rollback → Error Handling

**OwnershipMiddleware**: Verify user owns resource. Throw ForbiddenException if not.

**UnitOfWorkMiddleware**: Begin transaction before controller, commit on success (status < 400), rollback on error or failure.

**IUnitOfWork Interface**: `beginTransaction()`, `commit()`, `rollback()`, `saveChanges()`

(Use copied infrastructure for full implementations)

---

# Domain Events & Queue (MANDATORY)

**Event Rules:** Suffix `Event`, pattern `{Object}{Action}Event`, immutable (readonly), in `/domain/events/`, include timestamp/correlationId

**Queue:** IEventPublisher/IEventSubscriber in `/infrastructure/queues/infra/`, topic naming: `{subdomain}.{action}`

(Use copied infrastructure for implementations)

---

# Service Exception Policy (MANDATORY)

**Pattern:** `{Object}ServiceException` inheriting `ServiceException<TErrorCode>` in `/application/errors/`

**Requirements:**
- Define `{Object}ErrorCode` enum (NOT strings)
- Include message templates dictionary
- Store ErrorCode and optional Details
- Use copied infrastructure for ServiceException base class

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

1. ✅ MUST copy pre-approved infrastructure from oddly-infrastructures repository for NEW projects
2. ✅ MUST verify infrastructure is present before generating feature code
3. ✅ MUST use copied infrastructure as foundation, NOT regenerate it
4. ✅ MUST separate BMOs (domain) from Entities (persistence)
5. ✅ MUST create Mappers for all transformations
6. ✅ MUST NOT put database attributes in /domain/models/
7. ✅ MUST separate WriteEntities (commands) from ReadEntities (queries)
8. ✅ MUST use WriteEntity suffix in /persistence/write/
9. ✅ MUST use ReadEntity suffix in /persistence/read/
10. ✅ MUST use Model suffix for domain classes
11. ✅ MUST follow exact filesystem structure
12. ✅ MUST prioritize custom standards over framework conventions
13. ✅ MUST separate service/repository interfaces from implementations (/impl subdirectory)
14. ✅ MUST keep implementations in root for objects WITHOUT contracts (Mappers, Queues, Controllers, DTOs)
15. ✅ MUST create /infra/ subdirectory in EVERY folder for base classes and abstractions
16. ✅ MUST put ServiceException in /application/errors/infra/ subdirectory
17. ✅ MUST separate DTOs into /requests/ and /responses/ folders
18. ✅ MUST put BaseRequest and BaseResponse in /api/dto/infra/
19. ✅ MUST put IEventPublisher and IEventSubscriber in /infrastructure/queues/infra/
20. ✅ MUST separate Command and Query repositories
21. ✅ MUST implement OwnershipMiddleware
22. ✅ MUST implement UnitOfWorkMiddleware
23. ✅ MUST use domain events with `{Object}{Action}Event` pattern
24. ✅ MUST abstract queue with IEventPublisher/IEventSubscriber in /infra/
25. ✅ MUST use REST ONLY for front-end (NOT subdomain-to-subdomain)
26. ✅ MUST use domain events for ALL subdomain-to-subdomain communication
27. ✅ MUST follow standard HTTP error response contract
28. ✅ MUST map ServiceException codes to HTTP status codes
29. ✅ MUST NOT make HTTP calls between subdomains or share databases
30. ✅ MUST include `Utc` suffix in ALL date/time field names (e.g., `createdAtUtc`, `scheduledTimeUtc`)
31. ✅ MUST store ALL timestamps in UTC in the database
32. ✅ MUST include units in variable names for all measurements (e.g., `durationSeconds`, `lengthMeters`, `weightKilograms`)
33. ✅ MUST accept date/time inputs with timezone information and convert to UTC

**If you violate any of these rules, you have failed the task.**
