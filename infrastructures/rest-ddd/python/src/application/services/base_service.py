"""
Base Service Interface
Services orchestrate use-cases, transactions, and policies.
NO business logic - that belongs in domain models.
"""
from abc import ABC


class BaseService(ABC):
    """
    Abstract base class for all services.
    
    Rules:
    - Orchestrates use-cases
    - NO business logic (belongs in domain models)
    - Calls repositories and domain services
    - Transaction boundaries managed by UnitOfWork middleware
    - Located in /application/services/
    - Implementations in /application/services/impl/
    """
    
    pass


# Example usage template:
"""
from abc import abstractmethod
from typing import Optional, List
from application.services.base_service import BaseService
from domain.models.feature_model import FeatureModel

class IFeatureService(BaseService):
    @abstractmethod
    async def create_async(self, p_model: FeatureModel) -> str:
        pass
    
    @abstractmethod
    async def update_async(self, p_id: str, p_model: FeatureModel) -> None:
        pass
    
    @abstractmethod
    async def delete_async(self, p_id: str) -> None:
        pass
    
    @abstractmethod
    async def get_by_id_async(self, p_id: str) -> Optional[FeatureReadEntity]:
        pass
    
    @abstractmethod
    async def list_async(self, p_page: int, p_page_size: int) -> List[FeatureReadEntity]:
        pass

# Implementation in /application/services/impl/
class FeatureService(IFeatureService):
    def __init__(
        self,
        p_command_repository: ICommandRepository,
        p_query_repository: IQueryRepository,
        p_event_publisher: IEventPublisher
    ):
        self._command_repository = p_command_repository
        self._query_repository = p_query_repository
        self._event_publisher = p_event_publisher
    
    async def create_async(self, p_model: FeatureModel) -> str:
        # Validate
        p_model.validate()
        
        # Save
        feature_id = await self._command_repository.save_async(p_model)
        
        # Publish event
        await self._event_publisher.publish_async(
            FeatureCreatedEvent(feature_id=feature_id),
            'feature.created'
        )
        
        return feature_id
"""
