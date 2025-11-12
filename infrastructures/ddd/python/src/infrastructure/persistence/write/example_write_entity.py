"""
Example Write Entity demonstrating command side of CQRS.
This class:
- Lives in /infrastructure/persistence/write/
- Has WriteEntity suffix
- Used for business logic execution (commands)
- Contains all fields needed for business operations
- CAN have database/ORM attributes (e.g., MongoDB decorators, SQLAlchemy columns)
- Mapped from/to BMO by repository using mapper
"""

from datetime import datetime
from typing import Optional
from infrastructure.persistence.write.infra import BaseWriteEntity


class ExampleWriteEntity(BaseWriteEntity):
    """
    Write entity for example domain object.
    
    In a real application, this would be decorated with ORM attributes:
    - MongoDB: @dataclass with field metadata
    - SQLAlchemy: Column definitions
    - Django ORM: Model field definitions
    
    Example with MongoDB (pymongo/motor):
    ```python
    from dataclasses import dataclass, field
    
    @dataclass
    class ExampleWriteEntity(BaseWriteEntity):
        name: str = field(metadata={"bson_field": "name"})
        description: str = field(metadata={"bson_field": "description"})
        owner_id: str = field(metadata={"bson_field": "owner_id"})
        is_active: bool = field(metadata={"bson_field": "is_active"})
    ```
    
    Example with SQLAlchemy:
    ```python
    from sqlalchemy import Column, String, Boolean
    
    class ExampleWriteEntity(BaseWriteEntity, Base):
        __tablename__ = "examples"
        
        name = Column(String(100), nullable=False)
        description = Column(String(500))
        owner_id = Column(String(36), nullable=False)
        is_active = Column(Boolean, default=True)
    ```
    """
    
    def __init__(self):
        """Initialize a new example write entity."""
        super().__init__()
        self.name: str = ""
        self.description: str = ""
        self.owner_id: str = ""
        self.is_active: bool = True
