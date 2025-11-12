"""
Example service interface demonstrating service layer patterns.
Service interfaces:
- Live in /application/services/
- Start with I prefix
- Implementations go in /application/services/impl/
- Orchestrate use-cases, transactions, and policies
- Call repositories and domain services
- NO business logic (delegate to domain models)
"""

from abc import ABC, abstractmethod
from typing import List
from api.dto.requests.create_example_request import CreateExampleRequest
from api.dto.requests.update_example_request import UpdateExampleRequest
from api.dto.responses.example_response import ExampleResponse


class IExampleService(ABC):
    """
    Example service interface demonstrating service layer.
    
    Services orchestrate:
    - Use-case workflows
    - Transaction boundaries (via UnitOfWork middleware)
    - Policy enforcement
    - Repository coordination
    
    Services delegate business logic to domain models.
    """
    
    @abstractmethod
    async def create_example_async(
        self,
        p_request: CreateExampleRequest,
        p_user_id: str,
        p_correlation_id: str
    ) -> str:
        """
        Creates a new example.
        Transaction managed by UnitOfWork middleware.
        
        Args:
            p_request: The create request
            p_user_id: The authenticated user ID
            p_correlation_id: The correlation ID for tracing
            
        Returns:
            The ID of the created example
        """
        pass
    
    @abstractmethod
    async def update_example_async(
        self,
        p_id: str,
        p_request: UpdateExampleRequest,
        p_user_id: str
    ) -> None:
        """
        Updates an existing example.
        Transaction managed by UnitOfWork middleware.
        
        Args:
            p_id: The example ID
            p_request: The update request
            p_user_id: The authenticated user ID
        """
        pass
    
    @abstractmethod
    async def delete_example_async(
        self,
        p_id: str,
        p_user_id: str
    ) -> None:
        """
        Deletes an example.
        Transaction managed by UnitOfWork middleware.
        
        Args:
            p_id: The example ID
            p_user_id: The authenticated user ID
        """
        pass
    
    @abstractmethod
    async def get_example_async(self, p_id: str) -> ExampleResponse:
        """
        Gets an example by ID.
        Uses read entity for optimized query.
        
        Args:
            p_id: The example ID
            
        Returns:
            The example response
        """
        pass
    
    @abstractmethod
    async def list_examples_async(
        self,
        p_skip: int,
        p_take: int
    ) -> List[ExampleResponse]:
        """
        Lists all examples with pagination.
        Uses read entities for optimized queries.
        
        Args:
            p_skip: Number of records to skip
            p_take: Number of records to take
            
        Returns:
            List of example responses
        """
        pass
    
    @abstractmethod
    async def activate_example_async(
        self,
        p_id: str,
        p_user_id: str
    ) -> None:
        """
        Activates an example.
        
        Args:
            p_id: The example ID
            p_user_id: The authenticated user ID
        """
        pass
    
    @abstractmethod
    async def deactivate_example_async(
        self,
        p_id: str,
        p_user_id: str
    ) -> None:
        """
        Deactivates an example.
        
        Args:
            p_id: The example ID
            p_user_id: The authenticated user ID
        """
        pass
