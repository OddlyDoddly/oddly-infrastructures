"""
Interface for mapper objects.
Mappers are MANDATORY for all transformations between DTOs, BMOs, and Entities.
They handle mapping logic explicitly (no AutoMapper magic).
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar


TRequest = TypeVar('TRequest')
TResponse = TypeVar('TResponse')
TModel = TypeVar('TModel')
TWriteEntity = TypeVar('TWriteEntity')
TReadEntity = TypeVar('TReadEntity')


class IMapper(ABC, Generic[TRequest, TResponse, TModel, TWriteEntity, TReadEntity]):
    """
    Interface for mapper objects.
    
    Mappers:
    - Live in /application/mappers/
    - Have Mapper suffix
    - MANDATORY for all transformations
    - Handle explicit mapping (no magic)
    - Implementations in root (no /impl/ subdirectory)
    
    Type parameters:
    - TRequest: Request DTO type
    - TResponse: Response DTO type
    - TModel: Business Model Object (BMO) type
    - TWriteEntity: Write Entity type (command side)
    - TReadEntity: Read Entity type (query side)
    """
    
    @abstractmethod
    def to_model_from_request(self, p_dto: TRequest) -> TModel:
        """
        Maps Request DTO → BMO.
        Used when receiving commands from API layer.
        
        Args:
            p_dto: The request DTO
            
        Returns:
            The business model object
        """
        pass
    
    @abstractmethod
    def to_write_entity(self, p_model: TModel) -> TWriteEntity:
        """
        Maps BMO → WriteEntity.
        Used when persisting data to database (command side).
        
        Args:
            p_model: The business model object
            
        Returns:
            The write entity
        """
        pass
    
    @abstractmethod
    def to_model_from_write_entity(self, p_entity: TWriteEntity) -> TModel:
        """
        Maps WriteEntity → BMO.
        Used when loading data from database for business logic.
        
        Args:
            p_entity: The write entity
            
        Returns:
            The business model object
        """
        pass
    
    @abstractmethod
    def to_response_from_read_entity(self, p_entity: TReadEntity) -> TResponse:
        """
        Maps ReadEntity → Response DTO.
        Used for query operations - bypasses BMO in read path for performance.
        
        Args:
            p_entity: The read entity
            
        Returns:
            The response DTO
        """
        pass
    
    @abstractmethod
    def to_response_from_model(self, p_model: TModel) -> TResponse:
        """
        Maps BMO → Response DTO.
        Used when returning data from command operations.
        
        Args:
            p_model: The business model object
            
        Returns:
            The response DTO
        """
        pass
