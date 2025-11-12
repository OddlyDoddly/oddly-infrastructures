# C# REST-DDD Infrastructure Template

Complete Domain-Driven Design (DDD) infrastructure with CQRS pattern for C# / ASP.NET Core projects.

## 🏗️ Architecture Overview

Strict layered architecture with CQRS (Command Query Responsibility Segregation):

```
/src/
  /Api/              # HTTP Layer
    /Controllers/    # ExampleController.cs - HTTP endpoints
    /Dto/            # CreateExampleRequest.cs, ExampleResponse.cs
    /Middleware/     # UnitOfWorkMiddleware.cs, OwnershipMiddleware.cs
  /Application/      # Application Layer
    /Services/       # IExampleService.cs
      /Impl/         # ExampleService.cs
    /Mappers/        # ExampleMapper.cs
    /Errors/         # ExampleServiceException.cs
  /Domain/           # Domain Layer
    /Models/         # ExampleModel.cs (NO DB attributes)
    /Events/         # ExampleCreatedEvent.cs
  /Infrastructure/   # Infrastructure Layer
    /Repositories/   # ICommandRepository.cs, IQueryRepository.cs
      /Impl/         # ExampleCommandRepository.cs, ExampleQueryRepository.cs
    /Persistence/    
      /Write/        # ExampleWriteEntity.cs (commands)
      /Read/         # ExampleReadEntity.cs (queries)
    /Queues/         # IEventPublisher.cs, IEventSubscriber.cs
```

## 🎯 Custom Conventions (MANDATORY)

### Naming Conventions (OVERRIDE C# defaults)
- Controllers: `Controller` suffix
- Services: `Service` suffix (interface with `I` prefix)
- Repositories: `Repository` suffix
- Write entities: `WriteEntity` suffix in `/Persistence/Write/`
- Read entities: `ReadEntity` suffix in `/Persistence/Read/`
- Models: `Model` suffix
- DTOs: `Request`|`Response` suffix
- Domain events: `Event` suffix, pattern: `{Object}{Action}Event`
- Member fields: `_variable` (underscore prefix)
- Parameters: `p_variable` (p_ prefix)
- Namespaces: Follow folder structure

### CQRS Pattern
- **WriteEntity**: Commands (CREATE, UPDATE, DELETE) in `/Persistence/Write/`
- **ReadEntity**: Queries (SELECT) in `/Persistence/Read/`, denormalized
- **CommandRepository**: Works with WriteEntity, receives BMO
- **QueryRepository**: Returns ReadEntity directly (no BMO mapping)

### Critical Rules
- ❌ NO database attributes in `/Domain/Models/`
- ✅ ALWAYS use mappers for transformations
- ✅ REST endpoints ONLY for front-end
- ✅ Domain events for subdomain-to-subdomain communication
- ✅ UnitOfWork middleware handles ALL transactions

## 📦 Installation

```bash
dotnet restore
```

## 🚀 Usage

### Build
```bash
dotnet build
```

### Run
```bash
dotnet run
```

### Test
```bash
dotnet test
```

## 📝 Example Pipeline

See the complete example implementation:
- **Model**: `src/Domain/Models/ExampleModel.cs`
- **Write Entity**: `src/Infrastructure/Persistence/Write/ExampleWriteEntity.cs`
- **Read Entity**: `src/Infrastructure/Persistence/Read/ExampleReadEntity.cs`
- **Mapper**: `src/Application/Mappers/ExampleMapper.cs`
- **Service**: `src/Application/Services/Impl/ExampleService.cs`
- **Repository**: `src/Infrastructure/Repositories/Impl/ExampleCommandRepository.cs`
- **Controller**: `src/Api/Controllers/ExampleController.cs`
- **Domain Event**: `src/Domain/Events/ExampleCreatedEvent.cs`

## ⚠️ Important

These conventions OVERRIDE C# / ASP.NET Core defaults. Always follow the custom standards defined in this template.

## 🔧 Configuration

Update `appsettings.json` with your database and message queue connection strings.

## 📚 Additional Resources

- See `/docs/Adrs/` for Architecture Decision Records
- See `/docs/OpenApi/` for API documentation
