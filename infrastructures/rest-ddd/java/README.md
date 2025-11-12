# Java REST-DDD Infrastructure Template

Complete Domain-Driven Design (DDD) infrastructure with CQRS pattern for Java / Spring Boot projects.

## 🏗️ Architecture Overview

Strict layered architecture with CQRS (Command Query Responsibility Segregation):

```
/src/main/java/com/example/restddd/
  /api/              # HTTP Layer
    /controllers/    # ExampleController.java - HTTP endpoints
    /dto/            # CreateExampleRequest.java, ExampleResponse.java
    /middleware/     # UnitOfWorkMiddleware.java, OwnershipMiddleware.java
  /application/      # Application Layer
    /services/       # IExampleService.java
      /impl/         # ExampleService.java (not yet created)
    /mappers/        # ExampleMapper.java
    /errors/         # ExampleServiceException.java
  /domain/           # Domain Layer
    /models/         # ExampleModel.java (NO DB attributes)
    /events/         # ExampleCreatedEvent.java
  /infrastructure/   # Infrastructure Layer
    /repositories/   # ICommandRepository.java, IQueryRepository.java
      /impl/         # ExampleCommandRepository.java, ExampleQueryRepository.java
    /persistence/    
      /write/        # ExampleWriteEntity.java (commands)
      /read/         # ExampleReadEntity.java (queries)
    /queues/         # IEventPublisher.java, IEventSubscriber.java
```

## 🎯 Custom Conventions (MANDATORY - OVERRIDE Spring Boot defaults)

### Naming Conventions
- Controllers: `Controller` suffix
- Services: `Service` suffix (interface with `I` prefix)
- Repositories: `Repository` suffix
- Write entities: `WriteEntity` suffix in `/persistence/write/`
- Read entities: `ReadEntity` suffix in `/persistence/read/`
- Models: `Model` suffix
- DTOs: `Request`|`Response` suffix
- Domain events: `Event` suffix, pattern: `{Object}{Action}Event`
- Member fields: `m_variable` (m_ prefix)
- Parameters: `p_variable` (p_ prefix)
- Packages: Follow folder structure

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
mvn clean install
```

## 🚀 Usage

### Build
```bash
mvn clean package
```

### Run
```bash
mvn spring-boot:run
```

### Test
```bash
mvn test
```

## 📝 Example Pipeline

See the complete example implementation:
- **Model**: `src/main/java/com/example/restddd/domain/models/ExampleModel.java`
- **Write Entity**: `src/main/java/com/example/restddd/infrastructure/persistence/write/ExampleWriteEntity.java`
- **Read Entity**: `src/main/java/com/example/restddd/infrastructure/persistence/read/ExampleReadEntity.java`
- **Mapper**: `src/main/java/com/example/restddd/application/mappers/ExampleMapper.java`
- **Service**: `src/main/java/com/example/restddd/application/services/IExampleService.java`
- **Repository**: `src/main/java/com/example/restddd/infrastructure/repositories/impl/ExampleCommandRepository.java`
- **Domain Event**: `src/main/java/com/example/restddd/domain/events/ExampleCreatedEvent.java`

## ⚠️ Important

These conventions OVERRIDE Spring Boot / Java defaults. Always follow the custom standards defined in this template.

## 🔧 Configuration

Update `src/main/resources/application.yml` with your database and message queue connection strings.

## 📚 Additional Resources

- See `/docs/adrs/` for Architecture Decision Records
- See `/docs/openapi/` for API documentation

## 🔑 Key Differences from Standard Spring Boot

1. **Custom naming conventions take priority** over Spring Boot defaults
2. **CQRS with separate WriteEntity and ReadEntity** instead of single JPA entities
3. **Explicit mappers required** for all transformations
4. **Domain models MUST NOT have database attributes** (no JPA annotations in domain layer)
5. **REST only for front-end** - use domain events for backend-to-backend communication
