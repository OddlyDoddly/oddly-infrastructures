"""
Base Read Entity - For Queries (SELECT)
Pre-rendered views optimized for front-end.
Denormalized for query performance.
"""
from abc import ABC
from typing import Optional


class BaseReadEntity(ABC):
    """
    Abstract base class for all Read Entities (Query side).
    
    Rules:
    - MUST be in /infrastructure/persistence/read/
    - MUST suffix with 'ReadEntity'
    - Pre-rendered views optimized for queries
    - Denormalized data (may aggregate from multiple WriteEntities)
    - NO version tracking needed (read-only)
    """
    
    def __init__(self, p_id: Optional[str] = None):
        self._id = p_id
    
    @property
    def id(self) -> Optional[str]:
        return self._id
    
    @id.setter
    def id(self, p_value: str) -> None:
        self._id = p_value
