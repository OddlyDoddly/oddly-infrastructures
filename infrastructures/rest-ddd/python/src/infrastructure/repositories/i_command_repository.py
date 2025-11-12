"""
Command Repository Interface (Write Operations)
Works with WriteEntity, receives BMO, returns void/ID.
"""
from abc import ABC, abstractmethod
from typing import TypeVar, Generic, Optional

TModel = TypeVar('TModel')
TId = TypeVar('TId')


class ICommandRepository(ABC, Generic[TModel, TId]):
    """
    Interface for Command Repository (CQRS Write side).
    
    Rules:
    - Receives BMO (Business Model Object)
    - Maps BMO → WriteEntity internally
    - Returns void or ID
    - Handles CREATE, UPDATE, DELETE operations
    """
    
    @abstractmethod
    async def save_async(self, p_model: TModel) -> TId:
        """
        Save a new entity.
        Maps BMO → WriteEntity internally.
        Returns the generated ID.
        """
        pass
    
    @abstractmethod
    async def update_async(self, p_model: TModel) -> None:
        """
        Update an existing entity.
        Maps BMO → WriteEntity internally.
        """
        pass
    
    @abstractmethod
    async def delete_async(self, p_id: TId) -> None:
        """
        Delete an entity by ID.
        """
        pass
    
    @abstractmethod
    async def exists_async(self, p_id: TId) -> bool:
        """
        Check if entity exists by ID.
        """
        pass
