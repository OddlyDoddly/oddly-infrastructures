"""
Base interface for query repositories (read operations in CQRS).
Query repositories work with ReadEntities and return them directly to service.
No BMO mapping in read path for performance.
"""

from abc import ABC, abstractmethod
from typing import Generic, List, Optional, TypeVar


TReadEntity = TypeVar('TReadEntity')
TId = TypeVar('TId')


class IQueryRepository(ABC, Generic[TReadEntity, TId]):
    """
    Base interface for query repositories (read operations).
    
    Query repositories:
    - Work with ReadEntities
    - Return ReadEntity directly to service (no BMO mapping)
    - Handle query operations (find, list, search)
    - Optimized for read performance
    """
    
    @abstractmethod
    async def find_by_id_async(self, p_id: TId) -> Optional[TReadEntity]:
        """
        Finds an entity by ID.
        Returns ReadEntity directly (no BMO in read path).
        
        Args:
            p_id: The identifier to find
            
        Returns:
            The read entity or None if not found
        """
        pass
    
    @abstractmethod
    async def list_by_filter_async(
        self,
        p_skip: int = 0,
        p_take: int = 10
    ) -> List[TReadEntity]:
        """
        Lists entities with pagination.
        Returns ReadEntities directly.
        
        Args:
            p_skip: Number of records to skip
            p_take: Number of records to take
            
        Returns:
            List of read entities
        """
        pass
