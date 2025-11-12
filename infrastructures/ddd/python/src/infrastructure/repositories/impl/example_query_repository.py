"""
Example query repository implementation.
Repository implementations:
- Live in /infrastructure/repositories/impl/
- Implement repository interfaces
- Handle query operations
- Return ReadEntity directly (no BMO mapping in read path)
"""

from typing import List, Optional
from infrastructure.repositories.i_example_query_repository import IExampleQueryRepository
from infrastructure.persistence.read.example_read_entity import ExampleReadEntity


class ExampleQueryRepository(IExampleQueryRepository):
    """
    Query repository implementation for Example domain.
    
    This implementation:
    - Handles read operations (find, list, search)
    - Works with ReadEntity directly
    - Returns ReadEntity to service (no BMO in read path)
    - Optimized for query performance
    
    In a real application with MongoDB:
    ```python
    from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
    
    class ExampleQueryRepository(IExampleQueryRepository):
        def __init__(self, p_database: AsyncIOMotorDatabase):
            self._collection = p_database["examples_view"]
        
        async def find_by_id_async(self, p_id: str) -> Optional[ExampleReadEntity]:
            doc = await self._collection.find_one({"_id": p_id})
            if doc is None:
                return None
            
            entity = ExampleReadEntity()
            entity.id = doc["_id"]
            entity.name = doc["name"]
            entity.description = doc["description"]
            entity.owner_id = doc["owner_id"]
            entity.owner_name = doc["owner_name"]
            entity.is_active = doc["is_active"]
            entity.display_name = doc["display_name"]
            entity.status_text = doc["status_text"]
            entity.created_at = doc["created_at"]
            entity.updated_at = doc["updated_at"]
            return entity
    ```
    """
    
    def __init__(self):
        """Initialize the query repository."""
        # In real implementation, inject database connection here
        self._in_memory_store: dict[str, ExampleReadEntity] = {}
    
    async def find_by_id_async(self, p_id: str) -> Optional[ExampleReadEntity]:
        """
        Finds an example by ID.
        
        Args:
            p_id: The ID to find
            
        Returns:
            The read entity or None if not found
        """
        # In real implementation, query database
        return self._in_memory_store.get(p_id)
    
    async def list_by_filter_async(
        self,
        p_skip: int = 0,
        p_take: int = 10
    ) -> List[ExampleReadEntity]:
        """
        Lists examples with pagination.
        
        Args:
            p_skip: Number of records to skip
            p_take: Number of records to take
            
        Returns:
            List of read entities
        """
        # In real implementation, query database with pagination
        all_entities = list(self._in_memory_store.values())
        return all_entities[p_skip:p_skip + p_take]
