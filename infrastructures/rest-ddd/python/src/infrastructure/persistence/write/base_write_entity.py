"""
Base Write Entity - For Commands (CREATE, UPDATE, DELETE)
Used when business logic executes against data.
Contains all fields needed for business operations.
"""
from datetime import datetime
from typing import Optional
from abc import ABC


class BaseWriteEntity(ABC):
    """
    Abstract base class for all Write Entities (Command side).
    
    Rules:
    - MUST be in /infrastructure/persistence/write/
    - MUST suffix with 'WriteEntity'
    - Contains ORM/database attributes
    - Used for commands that modify data
    - Contains version for optimistic locking
    """
    
    def __init__(
        self,
        p_id: Optional[str] = None,
        p_version: Optional[int] = None,
        p_created_at: Optional[datetime] = None,
        p_updated_at: Optional[datetime] = None
    ):
        self._id = p_id
        self._version = p_version or 1
        self._created_at = p_created_at or datetime.utcnow()
        self._updated_at = p_updated_at or datetime.utcnow()
    
    @property
    def id(self) -> Optional[str]:
        return self._id
    
    @id.setter
    def id(self, p_value: str) -> None:
        self._id = p_value
    
    @property
    def version(self) -> int:
        return self._version
    
    @version.setter
    def version(self, p_value: int) -> None:
        self._version = p_value
    
    @property
    def created_at(self) -> datetime:
        return self._created_at
    
    @property
    def updated_at(self) -> datetime:
        return self._updated_at
    
    @updated_at.setter
    def updated_at(self, p_value: datetime) -> None:
        self._updated_at = p_value
    
    def increment_version(self) -> None:
        """Increment version for optimistic locking."""
        self._version += 1
        self._updated_at = datetime.utcnow()
