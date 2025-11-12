"""
Example service implementation demonstrating service layer patterns.
Service implementations:
- Live in /application/services/impl/
- Implement service interfaces
- Orchestrate use-cases and workflows
- NO business logic (delegate to domain models)
"""

from typing import List
from api.dto.requests.create_example_request import CreateExampleRequest
from api.dto.requests.update_example_request import UpdateExampleRequest
from api.dto.responses.example_response import ExampleResponse
from application.errors.example_service_exception import ExampleErrorCode, ExampleServiceException
from application.mappers.example_mapper import ExampleMapper
from application.services.i_example_service import IExampleService
from domain.events.example_created_event import ExampleCreatedEvent
from domain.events.example_updated_event import ExampleUpdatedEvent
from domain.events.example_deleted_event import ExampleDeletedEvent
from domain.models.example_model import ExampleModel
from infrastructure.queues.infra import IEventPublisher
from infrastructure.repositories.i_example_command_repository import IExampleCommandRepository
from infrastructure.repositories.i_example_query_repository import IExampleQueryRepository


class ExampleService(IExampleService):
    """
    Example service implementation.
    
    This service:
    - Orchestrates use-cases
    - Coordinates repositories
    - Publishes domain events
    - Enforces policies
    - Delegates business logic to domain models
    
    Transaction management is handled by UnitOfWork middleware.
    """
    
    def __init__(
        self,
        p_command_repo: IExampleCommandRepository,
        p_query_repo: IExampleQueryRepository,
        p_mapper: ExampleMapper,
        p_event_publisher: IEventPublisher
    ):
        """
        Initialize the example service.
        
        Args:
            p_command_repo: The command repository
            p_query_repo: The query repository
            p_mapper: The mapper
            p_event_publisher: The event publisher
        """
        self._command_repo = p_command_repo
        self._query_repo = p_query_repo
        self._mapper = p_mapper
        self._event_publisher = p_event_publisher
    
    async def create_example_async(
        self,
        p_request: CreateExampleRequest,
        p_user_id: str,
        p_correlation_id: str
    ) -> str:
        """
        Creates a new example.
        
        Workflow:
        1. Validate request (already done at edge)
        2. Map request to domain model
        3. Domain model validates business rules
        4. Save via repository
        5. Publish domain event
        
        Args:
            p_request: The create request
            p_user_id: The authenticated user ID
            p_correlation_id: The correlation ID
            
        Returns:
            The ID of the created example
        """
        # Map request to model
        model = self._mapper.to_model_from_request(p_request)
        
        # Set owner from authenticated user
        # Note: This is a workaround since we can't modify the model after creation
        # In real implementation, pass owner_id to create factory method
        model._owner_id = p_user_id
        
        # Save to database (via command repository)
        example_id = await self._command_repo.save_async(model)
        
        # Publish domain event for other subdomains
        event = ExampleCreatedEvent(
            p_example_id=example_id,
            p_name=model.name,
            p_owner_id=p_user_id,
            p_correlation_id=p_correlation_id
        )
        await self._event_publisher.publish_async(event, "example.created")
        
        return example_id
    
    async def update_example_async(
        self,
        p_id: str,
        p_request: UpdateExampleRequest,
        p_user_id: str
    ) -> None:
        """
        Updates an existing example.
        
        Workflow:
        1. Load model from command repository
        2. Validate ownership
        3. Update model (business logic in model)
        4. Save via repository
        5. Publish domain event
        
        Args:
            p_id: The example ID
            p_request: The update request
            p_user_id: The authenticated user ID
        """
        # Load model from database
        model = await self._command_repo.find_by_id_for_command_async(p_id)
        
        if model is None:
            raise ExampleServiceException(
                ExampleErrorCode.NOT_FOUND,
                {"id": p_id}
            )
        
        # Validate ownership
        try:
            model.validate_ownership(p_user_id)
        except PermissionError:
            raise ExampleServiceException(
                ExampleErrorCode.UNAUTHORIZED,
                {"id": p_id}
            )
        
        # Update model (business logic in model)
        self._mapper.update_model_from_request(model, p_request)
        
        # Save changes
        await self._command_repo.update_async(model)
        
        # Publish domain event
        event = ExampleUpdatedEvent(
            p_example_id=p_id,
            p_name=model.name,
            p_correlation_id=""  # Get from context
        )
        await self._event_publisher.publish_async(event, "example.updated")
    
    async def delete_example_async(
        self,
        p_id: str,
        p_user_id: str
    ) -> None:
        """
        Deletes an example.
        
        Args:
            p_id: The example ID
            p_user_id: The authenticated user ID
        """
        # Load model to validate ownership
        model = await self._command_repo.find_by_id_for_command_async(p_id)
        
        if model is None:
            raise ExampleServiceException(
                ExampleErrorCode.NOT_FOUND,
                {"id": p_id}
            )
        
        # Validate ownership
        try:
            model.validate_ownership(p_user_id)
        except PermissionError:
            raise ExampleServiceException(
                ExampleErrorCode.UNAUTHORIZED,
                {"id": p_id}
            )
        
        # Delete
        await self._command_repo.delete_async(p_id)
        
        # Publish domain event
        event = ExampleDeletedEvent(
            p_example_id=p_id,
            p_correlation_id=""  # Get from context
        )
        await self._event_publisher.publish_async(event, "example.deleted")
    
    async def get_example_async(self, p_id: str) -> ExampleResponse:
        """
        Gets an example by ID (query operation).
        
        Uses read entity for optimized query.
        No BMO in read path for performance.
        
        Args:
            p_id: The example ID
            
        Returns:
            The example response
        """
        # Query from read repository
        entity = await self._query_repo.find_by_id_async(p_id)
        
        if entity is None:
            raise ExampleServiceException(
                ExampleErrorCode.NOT_FOUND,
                {"id": p_id}
            )
        
        # Map read entity directly to response (no BMO in read path)
        return self._mapper.to_response_from_read_entity(entity)
    
    async def list_examples_async(
        self,
        p_skip: int,
        p_take: int
    ) -> List[ExampleResponse]:
        """
        Lists examples with pagination (query operation).
        
        Args:
            p_skip: Number of records to skip
            p_take: Number of records to take
            
        Returns:
            List of example responses
        """
        # Query from read repository
        entities = await self._query_repo.list_by_filter_async(p_skip, p_take)
        
        # Map read entities to responses
        return [
            self._mapper.to_response_from_read_entity(entity)
            for entity in entities
        ]
    
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
        # Load model
        model = await self._command_repo.find_by_id_for_command_async(p_id)
        
        if model is None:
            raise ExampleServiceException(
                ExampleErrorCode.NOT_FOUND,
                {"id": p_id}
            )
        
        # Validate ownership
        try:
            model.validate_ownership(p_user_id)
        except PermissionError:
            raise ExampleServiceException(
                ExampleErrorCode.UNAUTHORIZED,
                {"id": p_id}
            )
        
        # Activate (business logic in model)
        model.activate()
        
        # Save changes
        await self._command_repo.update_async(model)
    
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
        # Load model
        model = await self._command_repo.find_by_id_for_command_async(p_id)
        
        if model is None:
            raise ExampleServiceException(
                ExampleErrorCode.NOT_FOUND,
                {"id": p_id}
            )
        
        # Validate ownership
        try:
            model.validate_ownership(p_user_id)
        except PermissionError:
            raise ExampleServiceException(
                ExampleErrorCode.UNAUTHORIZED,
                {"id": p_id}
            )
        
        # Deactivate (business logic in model)
        model.deactivate()
        
        # Save changes
        await self._command_repo.update_async(model)
