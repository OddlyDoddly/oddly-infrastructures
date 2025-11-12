# Python DDD Infrastructure Template

A complete Domain-Driven Design (DDD) infrastructure template for Python projects following CQRS patterns and clean architecture principles.

## Overview

This template provides a complete DDD infrastructure with:
- **Domain Layer**: Business models and domain events
- **Application Layer**: Services, mappers, and error handling
- **Infrastructure Layer**: Repositories, persistence, and queues
- **API Layer**: Controllers, DTOs, and middleware

## Key Patterns

### CQRS (Command Query Responsibility Segregation)
- **WriteEntity**: Command side entities in `/infrastructure/persistence/write/`
- **ReadEntity**: Query side entities in `/infrastructure/persistence/read/`
- **CommandRepository**: Handles write operations (create, update, delete)
- **QueryRepository**: Handles read operations (find, list, search)

### Layer Separation
```
Controller → Service → Repository → Database
     ↓          ↓           ↓
    DTO       BMO       Entity
```

## Project Structure

```
src/
├── api/
│   ├── controllers/          # HTTP request handlers
│   │   ├── infra/           # BaseController
│   │   └── example_controller.py
│   ├── dto/                 # Data Transfer Objects
│   │   ├── infra/          # BaseRequest, BaseResponse
│   │   ├── requests/       # Request DTOs
│   │   └── responses/      # Response DTOs
│   └── middleware/          # HTTP middleware
│       ├── correlation_id_middleware.py
│       ├── ownership_middleware.py
│       ├── unit_of_work_middleware.py
│       └── error_handling_middleware.py
├── application/
│   ├── services/           # Business orchestration
│   │   ├── impl/          # Service implementations
│   │   └── i_example_service.py
│   ├── mappers/           # DTO ↔ BMO ↔ Entity mapping
│   │   ├── infra/        # IMapper interface
│   │   └── example_mapper.py
│   └── errors/            # Service exceptions
│       ├── infra/        # ServiceException base
│       └── example_service_exception.py
├── domain/
│   ├── models/            # Business Model Objects (BMOs)
│   │   ├── infra/        # BaseModel
│   │   └── example_model.py
│   └── events/           # Domain events
│       ├── infra/       # BaseDomainEvent
│       └── example_*_event.py
└── infrastructure/
    ├── repositories/      # Data access interfaces
    │   ├── infra/        # ICommandRepository, IQueryRepository
    │   ├── impl/         # Repository implementations
    │   └── i_example_*_repository.py
    ├── persistence/       # Database entities
    │   ├── write/        # WriteEntities (commands)
    │   ├── read/         # ReadEntities (queries)
    │   └── infra/        # BaseEntity
    └── queues/           # Event bus
        ├── infra/        # IEventPublisher, IEventSubscriber
        ├── subscribers/  # Event handlers
        └── in_memory_event_bus.py
```

## Naming Conventions

### Files and Classes
- **Controllers**: `*Controller` (e.g., `ExampleController`)
- **Services**: `I*Service` (interface), `*Service` (implementation)
- **Repositories**: `I*Repository` (interface), `*Repository` (implementation)
- **Entities**: `*WriteEntity` (commands), `*ReadEntity` (queries)
- **Models**: `*Model` or `*BMO`
- **DTOs**: `*Request`, `*Response`, `*Dto`
- **Events**: `*Event` following pattern `{Object}{Action}Event`
- **Middleware**: `*Middleware`

### Variables
- **Member fields**: `_variable` (underscore prefix)
- **Parameters**: `p_variable` (p_ prefix)
- **Local variables**: `snake_case`

## Setup

### Requirements
- Python 3.9+
- Dependencies listed in `requirements.txt`

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Recommended Frameworks

#### FastAPI (Recommended)
```python
from fastapi import FastAPI
from api.controllers.example_controller import ExampleController

app = FastAPI()

# Register routes
@app.post("/api/v1/examples")
async def create_example(request: CreateExampleRequest):
    controller = ExampleController(example_service)
    return await controller.create_example(request)
```

#### Flask
```python
from flask import Flask, request
from api.controllers.example_controller import ExampleController

app = Flask(__name__)

@app.route("/api/v1/examples", methods=["POST"])
async def create_example():
    req = CreateExampleRequest(**request.json)
    controller = ExampleController(example_service)
    return await controller.create_example(req)
```

## Database Support

This template is database-agnostic. Add ORM decorators to entities:

### MongoDB (Motor)
```python
from motor.motor_asyncio import AsyncIOMotorClient

# Add to entity
from dataclasses import dataclass, field

@dataclass
class ExampleWriteEntity(BaseWriteEntity):
    name: str = field(metadata={"bson_field": "name"})
```

### PostgreSQL (SQLAlchemy + asyncpg)
```python
from sqlalchemy import Column, String, Boolean
from sqlalchemy.ext.asyncio import AsyncSession

class ExampleWriteEntity(BaseWriteEntity, Base):
    __tablename__ = "examples"
    
    name = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
```

## Message Queue Support

Replace `InMemoryEventBus` with real message queue:

### RabbitMQ (aio-pika)
```bash
pip install aio-pika
```

### Kafka (aiokafka)
```bash
pip install aiokafka
```

### AWS SQS (aioboto3)
```bash
pip install aioboto3
```

## Middleware Order

Middleware MUST be applied in this order:
1. **CorrelationIdMiddleware** - Request tracing
2. Logging
3. Authentication
4. **OwnershipMiddleware** - Authorization
5. **UnitOfWorkMiddleware** - Transaction management
6. Controller
7. UnitOfWork commit/rollback
8. **ErrorHandlingMiddleware** - Error responses

## Best Practices

### DO:
✅ Keep business logic in domain models  
✅ Use mappers for all transformations  
✅ Separate read and write entities (CQRS)  
✅ Publish domain events for subdomain communication  
✅ Use UnitOfWork for transaction management  

### DON'T:
❌ Put business logic in controllers or repositories  
❌ Add database attributes to domain models  
❌ Make HTTP calls between subdomains (use events)  
❌ Skip mapper layer  
❌ Manually manage transactions in services  

## Testing

```python
import pytest
from domain.models.example_model import ExampleModel

def test_example_model_creation():
    model = ExampleModel.create("Test", "Description", "owner-123")
    assert model.name == "Test"
    assert model.is_active is True

def test_example_model_validation():
    with pytest.raises(ValueError):
        ExampleModel.create("", "Description", "owner-123")
```

## License

This template is provided as-is for project scaffolding.
