"""
Query Repository Interface (Read Operations)
Returns ReadEntity directly to service (no BMO in read path).
"""
from abc import ABC, abstractmethod
from typing import TypeVar, Generic, Optional, List, Dict, Any

TReadEntity = TypeVar('TReadEntity')
TId = TypeVar('TId')


class IQueryRepository(ABC, Generic[TReadEntity, TId]):
    """
    Interface for Query Repository (CQRS Read side).
    
    Rules:
    - Returns ReadEntity directly (no BMO mapping)
    - Optimized for query performance
    - Handles SELECT operations only
    - Uses denormalized ReadEntity views
    """
    
    @abstractmethod
    async def find_by_id_async(self, p_id: TId) -> Optional[TReadEntity]:
        """
        Find entity by ID.
        Returns ReadEntity or None.
        """
        pass
    
    @abstractmethod
    async def list_by_filter_async(
        self,
        p_filter: Dict[str, Any],
        p_page: int = 1,
        p_page_size: int = 50
    ) -> List[TReadEntity]:
        """
        List entities by filter criteria with pagination.
        Returns list of ReadEntity.
        """
        pass
    
    @abstractmethod
    async def count_by_filter_async(
        self,
        p_filter: Dict[str, Any]
    ) -> int:
        """
        Count entities matching filter criteria.
        """
        pass
