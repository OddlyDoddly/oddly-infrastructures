"""
Example Read Entity demonstrating query side of CQRS.
This class:
- Lives in /infrastructure/persistence/read/
- Has ReadEntity suffix
- Pre-rendered view optimized for front-end
- Denormalized for query performance
- CAN have database/ORM attributes
- MAY aggregate data from multiple write entities
- Returned directly to service layer (no BMO mapping in read path)
"""

from datetime import datetime
from typing import Optional
from infrastructure.persistence.read.infra import BaseReadEntity


class ExampleReadEntity(BaseReadEntity):
    """
    Read entity for example queries.
    
    This entity is optimized for query patterns and includes
    denormalized data for better performance. It may combine
    data from multiple write entities.
    
    In a real application with MongoDB:
    ```python
    from dataclasses import dataclass, field
    
    @dataclass
    class ExampleReadEntity(BaseReadEntity):
        name: str = field(metadata={"bson_field": "name"})
        description: str = field(metadata={"bson_field": "description"})
        owner_id: str = field(metadata={"bson_field": "owner_id"})
        owner_name: str = field(metadata={"bson_field": "owner_name"})  # Denormalized
        is_active: bool = field(metadata={"bson_field": "is_active"})
        display_name: str = field(metadata={"bson_field": "display_name"})  # Computed
        status_text: str = field(metadata={"bson_field": "status_text"})  # Computed
    ```
    
    With SQLAlchemy:
    ```python
    from sqlalchemy import Column, String, Boolean
    
    class ExampleReadEntity(BaseReadEntity, Base):
        __tablename__ = "examples_view"
        
        name = Column(String(100))
        description = Column(String(500))
        owner_id = Column(String(36))
        owner_name = Column(String(100))  # Denormalized from User table
        is_active = Column(Boolean)
        display_name = Column(String(200))  # Pre-computed
        status_text = Column(String(50))  # Pre-computed
    ```
    """
    
    def __init__(self):
        """Initialize a new example read entity."""
        super().__init__()
        self.name: str = ""
        self.description: str = ""
        self.owner_id: str = ""
        self.owner_name: str = ""  # Denormalized for query performance
        self.is_active: bool = True
        self.display_name: str = ""  # Computed/denormalized field
        self.status_text: str = ""  # Computed/denormalized field
