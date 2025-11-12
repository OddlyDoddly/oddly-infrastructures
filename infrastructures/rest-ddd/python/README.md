# Python REST-DDD Infrastructure Template

This template provides a complete Domain-Driven Design (DDD) infrastructure with CQRS pattern for Python projects.

## 🏗️ Architecture Overview

This template follows a strict layered architecture with CQRS (Command Query Responsibility Segregation):

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
    /policies/       # Authorization policies
    /errors/         # Service exceptions
  /domain/           # Domain Layer
    /models/         # Business Model Objects (NO DB attributes)
    /events/         # Domain events
  /infrastructure/   # Infrastructure Layer
    /repositories/   # Data access interfaces
      /impl/         # Repository implementations
    /persistence/    # Database entities
      /write/        # WriteEntities (commands)
      /read/         # ReadEntities (queries)
    /queues/         # Event publisher/subscriber
      /impl/         # Queue implementations
      /subscribers/  # Event handlers
    /integrations/   # External API clients
```

## 🎯 Key Principles

### MANDATORY Rules

1. **Layer Separation**
   - Controllers → Services → Repositories → Database
   - NO sideways calls between layers

2. **CQRS Pattern**
   - **WriteEntity**: In `/persistence/write/`, suffix `WriteEntity`, for commands
   - **ReadEntity**: In `/persistence/read/`, suffix `ReadEntity`, for queries
   - Separate CommandRepository and QueryRepository

3. **No Database Attributes in Domain**
   - Domain models (`/domain/models/`) MUST be pure business logic
   - Database attributes ONLY in Entity classes

4. **Explicit Mappers Required**
   - ALL transformations use mappers in `/application/mappers/`
   - DTO ↔ BMO ↔ Entity conversions

5. **Naming Conventions**
   - Controllers: `Controller` suffix
   - Services: `Service` suffix  
   - Repositories: `Repository` suffix
   - Write entities: `WriteEntity` suffix
   - Read entities: `ReadEntity` suffix
   - Models: `Model` or `BMO` suffix
   - DTOs: `Request`|`Response`|`Dto` suffix
   - Domain events: `Event` suffix, pattern: `{Object}{Action}Event`
   - Member fields: `_variable` (underscore prefix)
   - Parameters: `p_variable` (p_ prefix)

6. **Communication Rules**
   - REST endpoints ONLY for front-end
   - Subdomain-to-subdomain via domain events (message queue)
   - NO HTTP calls between backend subdomains

## 📦 Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## 🚀 Usage

### 1. Create a Feature (Example: User Management)

#### Domain Model (NO DB attributes)
```python
# src/domain/models/user_model.py
from dataclasses import dataclass
from domain.models.base_model import BaseModel

@dataclass
class UserModel(BaseModel):
    _id: str
    _username: str
    _email: str
    
    def validate(self) -> None:
        if not self._email or '@' not in self._email:
            raise ValueError("Invalid email")
        if len(self._username) < 3:
            raise ValueError("Username too short")
    
    def to_dict(self) -> dict:
        return {
            'id': self._id,
            'username': self._username,
            'email': self._email
        }
```

#### Write Entity (Commands)
```python
# src/infrastructure/persistence/write/user_write_entity.py
from infrastructure.persistence.write.base_write_entity import BaseWriteEntity

class UserWriteEntity(BaseWriteEntity):
    def __init__(self, p_username: str, p_email: str, **kwargs):
        super().__init__(**kwargs)
        self._username = p_username
        self._email = p_email
    
    @property
    def username(self) -> str:
        return self._username
    
    @property
    def email(self) -> str:
        return self._email
```

#### Read Entity (Queries)
```python
# src/infrastructure/persistence/read/user_read_entity.py
from infrastructure.persistence.read.base_read_entity import BaseReadEntity

class UserReadEntity(BaseReadEntity):
    def __init__(self, p_username: str, p_email: str, p_created_at: str, **kwargs):
        super().__init__(**kwargs)
        self._username = p_username
        self._email = p_email
        self._created_at = p_created_at
    
    @property
    def username(self) -> str:
        return self._username
    
    @property
    def email(self) -> str:
        return self._email
    
    @property
    def created_at(self) -> str:
        return self._created_at
```

#### Mapper (MANDATORY)
```python
# src/application/mappers/user_mapper.py
from application.mappers.base_mapper import IMapper
from api.dto.user_request import CreateUserRequest
from api.dto.user_response import UserResponse
from domain.models.user_model import UserModel
from infrastructure.persistence.write.user_write_entity import UserWriteEntity
from infrastructure.persistence.read.user_read_entity import UserReadEntity

class UserMapper(IMapper):
    def to_model_from_request(self, p_dto: CreateUserRequest) -> UserModel:
        return UserModel(
            _id=None,
            _username=p_dto.username,
            _email=p_dto.email
        )
    
    def to_write_entity(self, p_model: UserModel) -> UserWriteEntity:
        return UserWriteEntity(
            p_id=p_model._id,
            p_username=p_model._username,
            p_email=p_model._email
        )
    
    def to_model_from_write_entity(self, p_entity: UserWriteEntity) -> UserModel:
        return UserModel(
            _id=p_entity.id,
            _username=p_entity.username,
            _email=p_entity.email
        )
    
    def to_response_from_read_entity(self, p_entity: UserReadEntity) -> UserResponse:
        return UserResponse(
            id=p_entity.id,
            username=p_entity.username,
            email=p_entity.email,
            created_at=p_entity.created_at
        )
    
    def to_response_from_model(self, p_model: UserModel) -> UserResponse:
        return UserResponse(
            id=p_model._id,
            username=p_model._username,
            email=p_model._email
        )
```

### 2. Service Layer

```python
# src/application/services/i_user_service.py
from abc import abstractmethod
from application.services.base_service import BaseService

class IUserService(BaseService):
    @abstractmethod
    async def create_async(self, p_model: UserModel) -> str:
        pass

# src/application/services/impl/user_service.py
class UserService(IUserService):
    def __init__(
        self,
        p_command_repository: ICommandRepository,
        p_query_repository: IQueryRepository,
        p_event_publisher: IEventPublisher
    ):
        self._command_repository = p_command_repository
        self._query_repository = p_query_repository
        self._event_publisher = p_event_publisher
    
    async def create_async(self, p_model: UserModel) -> str:
        p_model.validate()
        user_id = await self._command_repository.save_async(p_model)
        
        await self._event_publisher.publish_async(
            UserCreatedEvent(user_id=user_id, email=p_model._email),
            'user.created'
        )
        
        return user_id
```

### 3. Domain Events

```python
# src/domain/events/user_created_event.py
from dataclasses import dataclass
from domain.events.base_domain_event import BaseDomainEvent

@dataclass(frozen=True)
class UserCreatedEvent(BaseDomainEvent):
    user_id: str
    email: str
```

## 🔒 Security & Middleware

### Middleware Order (MANDATORY)
1. Correlation ID
2. Logging
3. Authentication
4. Authorization/Ownership
5. **UnitOfWork** (transaction management)
6. Controller
7. UnitOfWork commit/rollback
8. Error Handling

## 📝 Exception Handling

```python
# src/application/errors/user_service_exception.py
from enum import Enum
from application.errors.service_exception import ServiceExceptionGeneric

class UserErrorCode(Enum):
    NOT_FOUND = "NOT_FOUND"
    DUPLICATE_EMAIL = "DUPLICATE_EMAIL"

class UserServiceException(ServiceExceptionGeneric):
    _MESSAGE_TEMPLATES = {
        "NOT_FOUND": "User '{id}' not found",
        "DUPLICATE_EMAIL": "Email '{email}' already exists"
    }
    
    def __init__(self, p_error_code: UserErrorCode, p_details=None):
        super().__init__(p_error_code, self._MESSAGE_TEMPLATES, p_details)
```

## 🧪 Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=src tests/

# Run specific test
pytest tests/unit/test_user_service.py
```

## 📚 Additional Resources

- See `/docs/adrs/` for Architecture Decision Records
- See `/docs/openapi/` for API documentation
- Review base classes in `/src/` for implementation patterns

## ⚠️ Important Notes

- **NEVER** put database attributes in `/domain/models/`
- **ALWAYS** use mappers for transformations
- **ALWAYS** separate WriteEntity (commands) from ReadEntity (queries)
- **REST is for front-end ONLY** - use domain events for backend-to-backend
- UnitOfWork middleware handles ALL transactions automatically
