"""
Example command repository implementation.
Repository implementations:
- Live in /infrastructure/repositories/impl/
- Implement repository interfaces
- Handle persistence operations
- Map BMO ↔ WriteEntity internally using mapper
"""

from typing import Optional
from application.mappers.example_mapper import ExampleMapper
from domain.models.example_model import ExampleModel
from infrastructure.repositories.i_example_command_repository import IExampleCommandRepository
from infrastructure.persistence.write.example_write_entity import ExampleWriteEntity


class ExampleCommandRepository(IExampleCommandRepository):
    """
    Command repository implementation for Example domain.
    
    This implementation:
    - Uses ExampleMapper for BMO ↔ WriteEntity conversions
    - Handles write operations (create, update, delete)
    - Works with WriteEntity internally
    - Accepts/returns BMO externally
    
    In a real application, this would use a database driver:
    - MongoDB: motor (async) or pymongo
    - PostgreSQL: asyncpg or psycopg2 with SQLAlchemy
    - MySQL: aiomysql with SQLAlchemy
    
    Example with motor (MongoDB):
    ```python
    from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
    
    class ExampleCommandRepository(IExampleCommandRepository):
        def __init__(self, p_database: AsyncIOMotorDatabase, p_mapper: ExampleMapper):
            self._collection = p_database["examples"]
            self._mapper = p_mapper
        
        async def save_async(self, p_model: ExampleModel) -> str:
            entity = self._mapper.to_write_entity(p_model)
            result = await self._collection.insert_one({
                "_id": entity.id,
                "name": entity.name,
                "description": entity.description,
                "owner_id": entity.owner_id,
                "is_active": entity.is_active,
                "created_at": entity.created_at,
                "updated_at": entity.updated_at,
                "version": entity.version
            })
            return result.inserted_id
    ```
    """
    
    def __init__(self, p_mapper: ExampleMapper):
        """
        Initialize the command repository.
        
        Args:
            p_mapper: The mapper for BMO ↔ WriteEntity conversions
        """
        self._mapper = p_mapper
        # In real implementation, inject database connection here
        self._in_memory_store: dict[str, ExampleWriteEntity] = {}
    
    async def save_async(self, p_model: ExampleModel) -> str:
        """
        Saves a new example to the database.
        
        Args:
            p_model: The business model to save
            
        Returns:
            The ID of the created entity
        """
        # Map BMO to WriteEntity
        entity = self._mapper.to_write_entity(p_model)
        
        # In real implementation, persist to database
        self._in_memory_store[entity.id] = entity
        
        return entity.id
    
    async def update_async(self, p_model: ExampleModel) -> None:
        """
        Updates an existing example in the database.
        
        Args:
            p_model: The business model to update
        """
        # Map BMO to WriteEntity
        entity = self._mapper.to_write_entity(p_model)
        
        # In real implementation, update in database
        if entity.id in self._in_memory_store:
            self._in_memory_store[entity.id] = entity
        else:
            raise ValueError(f"Example {entity.id} not found")
    
    async def delete_async(self, p_id: str) -> None:
        """
        Deletes an example from the database.
        
        Args:
            p_id: The ID of the example to delete
        """
        # In real implementation, delete from database
        if p_id in self._in_memory_store:
            del self._in_memory_store[p_id]
        else:
            raise ValueError(f"Example {p_id} not found")
    
    async def exists_async(self, p_id: str) -> bool:
        """
        Checks if an example exists.
        
        Args:
            p_id: The ID to check
            
        Returns:
            True if exists, false otherwise
        """
        # In real implementation, check database
        return p_id in self._in_memory_store
    
    async def find_by_id_for_command_async(self, p_id: str) -> ExampleModel:
        """
        Finds an example by ID for command operations.
        
        Args:
            p_id: The ID to find
            
        Returns:
            The business model object
            
        Raises:
            ValueError: If not found
        """
        # In real implementation, query database
        entity = self._in_memory_store.get(p_id)
        
        if entity is None:
            raise ValueError(f"Example {p_id} not found")
        
        # Map WriteEntity to BMO
        return self._mapper.to_model_from_write_entity(entity)
