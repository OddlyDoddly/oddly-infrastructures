"""
Example controller demonstrating controller layer patterns.
Controllers:
- Live in /api/controllers/
- Have Controller suffix
- Handle HTTP only: bind, validate, authorize, map DTOs
- NO business logic (delegate to services)
- Use BaseController for common functionality

Middleware order (automatically applied):
1. Correlation ID → 2. Logging → 3. Authentication → 
4. Authorization/Ownership → 5. UnitOfWork → 6. Controller →
7. UnitOfWork commit/rollback → 8. Error Handling
"""

from typing import List
from api.controllers.infra import BaseController
from api.dto.requests.create_example_request import CreateExampleRequest
from api.dto.requests.update_example_request import UpdateExampleRequest
from api.dto.responses.example_response import ExampleResponse
from application.services.i_example_service import IExampleService


class ExampleController(BaseController):
    """
    Example controller demonstrating REST API patterns.
    
    This controller would be decorated with framework-specific
    route decorators in a real application:
    
    FastAPI:
    ```python
    from fastapi import APIRouter, Depends, HTTPException, status
    
    router = APIRouter(prefix="/api/v1/examples", tags=["examples"])
    
    @router.post("/", status_code=status.HTTP_201_CREATED)
    async def create_example(
        request: CreateExampleRequest,
        service: IExampleService = Depends()
    ) -> str:
        controller = ExampleController(service)
        return await controller.create_example(request)
    ```
    
    Flask:
    ```python
    from flask import Blueprint, request, jsonify
    
    bp = Blueprint('examples', __name__, url_prefix='/api/v1/examples')
    
    @bp.route('/', methods=['POST'])
    async def create_example():
        req = CreateExampleRequest(**request.json)
        controller = ExampleController(example_service)
        example_id = await controller.create_example(req)
        return jsonify(example_id), 201
    ```
    """
    
    def __init__(self, p_example_service: IExampleService):
        """
        Initialize the example controller.
        
        Args:
            p_example_service: The example service
        """
        super().__init__()
        self._example_service = p_example_service
    
    async def create_example(
        self,
        p_request: CreateExampleRequest
    ) -> str:
        """
        Creates a new example.
        POST /api/v1/examples
        
        Args:
            p_request: The create request
            
        Returns:
            The ID of the created example
        """
        # Validate request (edge validation)
        self.validate_request(p_request)
        
        # Get user ID from auth context
        user_id = self.get_user_id()
        correlation_id = self.get_correlation_id()
        
        # Delegate to service (business logic happens here)
        example_id = await self._example_service.create_example_async(
            p_request,
            user_id,
            correlation_id
        )
        
        return example_id
    
    async def get_example(self, p_id: str) -> ExampleResponse:
        """
        Gets an example by ID.
        GET /api/v1/examples/{id}
        
        Args:
            p_id: The example ID
            
        Returns:
            The example response
        """
        return await self._example_service.get_example_async(p_id)
    
    async def list_examples(
        self,
        p_skip: int = 0,
        p_take: int = 10
    ) -> List[ExampleResponse]:
        """
        Lists examples with pagination.
        GET /api/v1/examples?skip=0&take=10
        
        Args:
            p_skip: Number of records to skip
            p_take: Number of records to take
            
        Returns:
            List of example responses
        """
        return await self._example_service.list_examples_async(p_skip, p_take)
    
    async def update_example(
        self,
        p_id: str,
        p_request: UpdateExampleRequest
    ) -> None:
        """
        Updates an example.
        PUT /api/v1/examples/{id}
        
        Args:
            p_id: The example ID
            p_request: The update request
        """
        # Validate request
        self.validate_request(p_request)
        
        # Get user ID
        user_id = self.get_user_id()
        
        # Delegate to service
        await self._example_service.update_example_async(
            p_id,
            p_request,
            user_id
        )
    
    async def delete_example(self, p_id: str) -> None:
        """
        Deletes an example.
        DELETE /api/v1/examples/{id}
        
        Args:
            p_id: The example ID
        """
        user_id = self.get_user_id()
        await self._example_service.delete_example_async(p_id, user_id)
    
    async def activate_example(self, p_id: str) -> None:
        """
        Activates an example.
        POST /api/v1/examples/{id}/activate
        
        Args:
            p_id: The example ID
        """
        user_id = self.get_user_id()
        await self._example_service.activate_example_async(p_id, user_id)
    
    async def deactivate_example(self, p_id: str) -> None:
        """
        Deactivates an example.
        POST /api/v1/examples/{id}/deactivate
        
        Args:
            p_id: The example ID
        """
        user_id = self.get_user_id()
        await self._example_service.deactivate_example_async(p_id, user_id)
