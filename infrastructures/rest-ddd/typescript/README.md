# TypeScript REST-DDD Infrastructure Template

Complete Domain-Driven Design (DDD) infrastructure with CQRS pattern for TypeScript projects.

## 🏗️ Architecture Overview

Strict layered architecture with CQRS (Command Query Responsibility Segregation):

```
/src/
  /api/              # HTTP Layer
    /controllers/    # ExampleController.ts - HTTP endpoints
    /dto/            # CreateExampleRequest.ts, ExampleResponse.ts
    /middleware/     # UnitOfWorkMiddleware.ts, OwnershipMiddleware.ts
  /application/      # Application Layer
    /services/       # IExampleService.ts
      /impl/         # ExampleService.ts
    /mappers/        # ExampleMapper.ts
    /errors/         # ExampleServiceException.ts
  /domain/           # Domain Layer
    /models/         # ExampleModel.ts (NO DB attributes)
    /events/         # ExampleCreatedEvent.ts
  /infrastructure/   # Infrastructure Layer
    /repositories/   # ICommandRepository.ts, IQueryRepository.ts
      /impl/         # ExampleCommandRepository.ts, ExampleQueryRepository.ts
    /persistence/    
      /write/        # ExampleWriteEntity.ts (commands)
      /read/         # ExampleReadEntity.ts (queries)
    /queues/         # IEventPublisher.ts, IEventSubscriber.ts
```

## 🎯 Custom Conventions (MANDATORY)

### Naming Conventions
- Controllers: `Controller` suffix
- Services: `Service` suffix (interface with `I` prefix)
- Repositories: `Repository` suffix
- Write entities: `WriteEntity` suffix in `/persistence/write/`
- Read entities: `ReadEntity` suffix in `/persistence/read/`
- Models: `Model` suffix
- DTOs: `Request`|`Response` suffix
- Domain events: `Event` suffix, pattern: `{Object}{Action}Event`
- Member fields: `_variable` (underscore prefix)
- Parameters: `p_variable` (p_ prefix)

### CQRS Pattern
- **WriteEntity**: Commands (CREATE, UPDATE, DELETE) in `/persistence/write/`
- **ReadEntity**: Queries (SELECT) in `/persistence/read/`, denormalized
- **CommandRepository**: Works with WriteEntity, receives BMO
- **QueryRepository**: Returns ReadEntity directly (no BMO mapping)

### Critical Rules
- ❌ NO database attributes in `/domain/models/`
- ✅ ALWAYS use mappers for transformations
- ✅ REST endpoints ONLY for front-end
- ✅ Domain events for subdomain-to-subdomain communication
- ✅ UnitOfWork middleware handles ALL transactions

## 📦 Installation

```bash
npm install
```

## 🚀 Usage

### Build
```bash
npm run build
```

### Development
```bash
npm run dev
```

### Testing
```bash
npm test
npm run test:coverage
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## 📝 Example Pipeline

See the complete example implementation:
- **Model**: `src/domain/models/ExampleModel.ts`
- **Write Entity**: `src/infrastructure/persistence/write/ExampleWriteEntity.ts`
- **Read Entity**: `src/infrastructure/persistence/read/ExampleReadEntity.ts`
- **Mapper**: `src/application/mappers/ExampleMapper.ts`
- **Service**: `src/application/services/impl/ExampleService.ts`
- **Repository**: `src/infrastructure/repositories/impl/ExampleCommandRepository.ts`
- **Controller**: `src/api/controllers/ExampleController.ts`
- **Domain Event**: `src/domain/events/ExampleCreatedEvent.ts`

## ⚠️ Important

These conventions OVERRIDE TypeScript/framework defaults. Always follow the custom standards defined in this template.
