"""
Base interface for command repositories (write operations in CQRS).
Command repositories work with WriteEntities and receive BMOs (Business Model Objects).
They handle the mapping from BMO to WriteEntity internally.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar


TModel = TypeVar('TModel')
TId = TypeVar('TId')


class ICommandRepository(ABC, Generic[TModel, TId]):
    """
    Base interface for command repositories (write operations).
    
    Command repositories:
    - Work with WriteEntities internally
    - Receive BMOs from service layer
    - Map BMO ↔ WriteEntity internally using mapper
    - Return void or ID
    - Handle command operations (create, update, delete)
    """
    
    @abstractmethod
    async def save_async(self, p_model: TModel) -> TId:
        """
        Saves a new entity to the database.
        Maps BMO to WriteEntity internally.
        
        Args:
            p_model: The business model to save
            
        Returns:
            The identifier of the created entity
        """
        pass
    
    @abstractmethod
    async def update_async(self, p_model: TModel) -> None:
        """
        Updates an existing entity in the database.
        Maps BMO to WriteEntity internally.
        
        Args:
            p_model: The business model to update
        """
        pass
    
    @abstractmethod
    async def delete_async(self, p_id: TId) -> None:
        """
        Deletes an entity from the database by its identifier.
        
        Args:
            p_id: The identifier of the entity to delete
        """
        pass
    
    @abstractmethod
    async def exists_async(self, p_id: TId) -> bool:
        """
        Checks if an entity exists by its identifier.
        
        Args:
            p_id: The identifier to check
            
        Returns:
            True if the entity exists, false otherwise
        """
        pass
    
    @abstractmethod
    async def find_by_id_for_command_async(self, p_id: TId) -> TModel:
        """
        Finds an entity by ID and returns it as a BMO for command operations.
        Maps WriteEntity to BMO internally.
        
        Args:
            p_id: The identifier to find
            
        Returns:
            The business model object
            
        Raises:
            Exception: If entity not found
        """
        pass
