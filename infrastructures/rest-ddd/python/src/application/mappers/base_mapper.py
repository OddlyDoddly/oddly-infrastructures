"""
Base Mapper Interface
ALL transformations MUST use explicit mappers.
"""
from abc import ABC, abstractmethod
from typing import TypeVar, Generic

TDto = TypeVar('TDto')
TModel = TypeVar('TModel')
TWriteEntity = TypeVar('TWriteEntity')
TReadEntity = TypeVar('TReadEntity')
TResponse = TypeVar('TResponse')


class IMapper(ABC, Generic[TDto, TModel, TWriteEntity, TReadEntity, TResponse]):
    """
    Interface for mapping between layers.
    
    Rules:
    - MANDATORY for all transformations
    - DTO ↔ BMO ↔ Entity conversions
    - Located in /application/mappers/
    """
    
    @abstractmethod
    def to_model_from_request(self, p_dto: TDto) -> TModel:
        """
        Map Request DTO → BMO (Business Model Object).
        Used by controllers when receiving requests.
        """
        pass
    
    @abstractmethod
    def to_write_entity(self, p_model: TModel) -> TWriteEntity:
        """
        Map BMO → WriteEntity.
        Used by command repositories internally.
        """
        pass
    
    @abstractmethod
    def to_model_from_write_entity(self, p_entity: TWriteEntity) -> TModel:
        """
        Map WriteEntity → BMO.
        Used by command repositories internally.
        """
        pass
    
    @abstractmethod
    def to_response_from_read_entity(self, p_entity: TReadEntity) -> TResponse:
        """
        Map ReadEntity → Response DTO.
        Used by query operations.
        """
        pass
    
    @abstractmethod
    def to_response_from_model(self, p_model: TModel) -> TResponse:
        """
        Map BMO → Response DTO.
        Used after command operations.
        """
        pass
