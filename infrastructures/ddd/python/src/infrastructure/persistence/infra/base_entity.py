"""
Base class for all persistence entities.
Entities are database representations and CAN have ORM attributes.
They live in /infrastructure/persistence/.
"""

from abc import ABC
from datetime import datetime
from typing import Optional


class BaseEntity(ABC):
    """
    Base class for all persistence entities.
    
    Entities are responsible for:
    - Database representation
    - ORM mappings
    - Data persistence
    
    Entities CAN:
    - Have database/ORM attributes
    - Be decorated with ORM decorators
    - Reference other entities
    
    Entities MUST NOT:
    - Contain business logic
    - Be exposed outside the infrastructure layer
    """
    
    def __init__(self):
        """Initialize a new entity with default values."""
        self.id: str = ""
        self.created_at: datetime = datetime.utcnow()
        self.updated_at: datetime = datetime.utcnow()
