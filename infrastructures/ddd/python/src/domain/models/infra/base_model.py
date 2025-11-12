"""
Base class for all Business Model Objects (BMOs).
BMOs contain business logic and invariants.
CRITICAL: BMOs MUST NOT have database/ORM attributes.
They live in /domain/models/ and have Model or BMO suffix.
Separation from persistence layer is MANDATORY.
"""

from abc import ABC
from datetime import datetime
from typing import Optional
import uuid


class BaseModel(ABC):
    """
    Base class for all domain model objects (BMOs).
    
    BMOs are responsible for:
    - Encapsulating business logic
    - Enforcing business invariants
    - Maintaining state consistency
    
    BMOs MUST NOT:
    - Have database/ORM attributes
    - Contain persistence logic
    - Reference entities or data access layer
    """
    
    def __init__(self):
        """Initialize a new BMO with generated ID and timestamps."""
        self._id: str = str(uuid.uuid4())
        self._created_at: datetime = datetime.utcnow()
        self._updated_at: datetime = datetime.utcnow()
    
    @property
    def id(self) -> str:
        """Get the unique identifier of the model."""
        return self._id
    
    @property
    def created_at(self) -> datetime:
        """Get the creation timestamp."""
        return self._created_at
    
    @property
    def updated_at(self) -> datetime:
        """Get the last update timestamp."""
        return self._updated_at
    
    def validate(self) -> None:
        """
        Validates the business invariants of the model.
        Override this method to add specific validation logic.
        
        Raises:
            ValueError: If validation fails
        """
        if not self._id:
            raise ValueError("Model ID cannot be empty")
