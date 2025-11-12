# Oddly Infrastructures

A collection of standardized architecture templates for building consistent, production-ready applications across multiple languages and frameworks.

## 📚 Overview

This repository contains infrastructure templates that enforce custom architectural standards across all projects in the organization. Each template provides a complete, production-ready project structure with reusable components, ensuring consistency and best practices.

## 🏗️ Available Templates

### REST-DDD (Domain-Driven Design with CQRS)

Location: `/infrastructures/rest-ddd/`

Complete DDD infrastructure templates with CQRS pattern for building REST APIs. Available in:

- **Python** (`/infrastructures/rest-ddd/python/`)
- **TypeScript** (`/infrastructures/rest-ddd/typescript/`)
- **C#** (`/infrastructures/rest-ddd/csharp/`)
- **Java** (Spring Boot) (`/infrastructures/rest-ddd/java/`)

#### Key Features

✅ **Custom Standards Override Framework Defaults**
- All templates follow identical naming conventions and architecture
- Custom standards take PRIORITY over Python/TypeScript/C#/Java/Spring Boot conventions

✅ **Complete Example Pipeline**
- Real implementation files (not comments) for every layer
- Example includes: Model, WriteEntity, ReadEntity, Mapper, Service, Repository, Controller, DomainEvent

✅ **CQRS Architecture**
- Separate WriteEntity (commands) and ReadEntity (queries)
- CommandRepository and QueryRepository with distinct responsibilities

✅ **Domain-Driven Design**
- Domain models with NO database attributes (mandatory)
- Business logic in domain layer only
- Explicit mappers for all transformations

✅ **Event-Driven Communication**
- Domain events for subdomain-to-subdomain communication
- REST endpoints ONLY for front-end
- Queue abstraction (RabbitMQ, Kafka, AWS SQS, etc.)

✅ **Production-Ready Middleware**
- UnitOfWork middleware (automated transaction management)
- Ownership middleware (resource access verification)

## 📖 Using the Templates

### For New Projects

1. Choose your language template from `/infrastructures/rest-ddd/`
2. Copy the entire template directory to your new project
3. Follow the README in the template for setup instructions
4. Use the Example* files as reference for your implementation

### For AI Agents

These templates are designed to be used by AI agents to scaffold new projects:

1. Agent reads the agent configuration: `.github/agents/oddly-ddd-rest.agent.md`
2. Agent copies the appropriate language template
3. Agent uses Example* files as patterns for generating new features
4. Agent enforces custom standards defined in the template

## 🎯 Architecture Principles

### Mandatory Rules (All Templates)

1. **Layer Separation**: Controllers → Services → Repositories → Database
2. **CQRS Pattern**: WriteEntity (commands) separate from ReadEntity (queries)
3. **No Database in Domain**: Domain models MUST NOT have database attributes
4. **Explicit Mappers**: ALL transformations require explicit mapper classes
5. **REST for Front-End Only**: Backend-to-backend uses domain events
6. **Automated Transactions**: UnitOfWork middleware handles ALL transactions

### Naming Conventions (Override Framework Defaults)

- Controllers: `Controller` suffix
- Services: `Service` suffix (interfaces with `I` prefix)
- Repositories: `Repository` suffix
- Write entities: `WriteEntity` suffix in `/persistence/write/`
- Read entities: `ReadEntity` suffix in `/persistence/read/`
- Models: `Model` suffix
- DTOs: `Request`|`Response`|`Dto` suffix
- Domain events: `Event` suffix, pattern: `{Object}{Action}Event`
- Member fields: `_variable` or `m_variable` (underscore/m_ prefix)
- Parameters: `p_variable` (p_ prefix)

### Folder Structure (All Templates)

```
/src/
  /api/              # HTTP Layer
    /controllers/    # HTTP endpoints (NO business logic)
    /dto/            # Request/Response DTOs
    /middleware/     # UnitOfWork, Ownership, etc.
  /application/      # Application Layer
    /services/       # Use-case orchestration
      /impl/         # Service implementations
    /mappers/        # DTO ↔ BMO ↔ Entity transformations
    /errors/         # Service exceptions
  /domain/           # Domain Layer
    /models/         # Business models (NO DB attributes)
    /events/         # Domain events
  /infrastructure/   # Infrastructure Layer
    /repositories/   # Data access interfaces
      /impl/         # Repository implementations
    /persistence/    
      /write/        # WriteEntities (commands)
      /read/         # ReadEntities (queries)
    /queues/         # Event publisher/subscriber
```

## 📚 Additional Resources

Each template includes:

- **README.md**: Setup and usage instructions
- **Example files**: Complete implementation pipeline
- **Configuration files**: Project/package configuration
- **Base classes**: Reusable abstractions
- **Middleware**: UnitOfWork, Ownership verification

## 🚨 Critical Reminders

### For Developers

- ❌ **NEVER** put database attributes in `/domain/models/`
- ✅ **ALWAYS** use mappers for transformations
- ✅ **ALWAYS** separate WriteEntity from ReadEntity
- ✅ **ALWAYS** follow custom naming conventions (override framework defaults)
- ✅ **ALWAYS** use domain events for backend-to-backend communication

### For AI Agents

- Read the agent configuration in `.github/agents/` for detailed rules
- Custom standards ALWAYS take priority over language/framework conventions
- Use Example* files as patterns, not as templates to modify
- Enforce CQRS separation (Write/Read entities in separate directories)
- Verify domain models have NO database/ORM annotations

## 🔄 Template Updates

When updating templates:

1. Update all 4 language templates consistently
2. Ensure Example* files reflect the changes
3. Update READMEs in each template
4. Verify custom conventions are maintained
5. Test that Example* files compile/run (where applicable)

## 📧 Support

For questions or issues with these templates, contact the infrastructure team.

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-12  
**Maintainer**: Infrastructure Team
