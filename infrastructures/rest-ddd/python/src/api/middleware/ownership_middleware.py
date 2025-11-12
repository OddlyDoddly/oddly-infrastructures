"""
Ownership Middleware (MANDATORY)
Verifies user owns the resource before allowing access.
"""
from abc import ABC, abstractmethod
from typing import Callable, Awaitable, Any, Optional


class IOwnershipVerifier(ABC):
    """
    Interface for verifying resource ownership.
    """
    
    @abstractmethod
    async def verify_ownership_async(
        self,
        p_user_id: str,
        p_resource_id: str,
        p_resource_type: str
    ) -> bool:
        """
        Verify that user owns the resource.
        
        Returns:
            True if user owns resource, False otherwise
        """
        pass
    
    @abstractmethod
    async def is_public_resource_async(
        self,
        p_resource_id: str,
        p_resource_type: str
    ) -> bool:
        """
        Check if resource is publicly accessible.
        
        Returns:
            True if resource is public, False otherwise
        """
        pass


class ForbiddenException(Exception):
    """Exception raised when user doesn't own resource."""
    
    def __init__(self, p_message: str = "Access denied"):
        super().__init__(p_message)
        self.status_code = 403


class OwnershipMiddleware:
    """
    Middleware to verify resource ownership.
    
    Order: After authentication, before UnitOfWork
    
    Rules:
    - Skip for public resources
    - Verify ownership for protected resources
    - Raise ForbiddenException if ownership check fails
    """
    
    def __init__(
        self,
        p_ownership_verifier: IOwnershipVerifier,
        p_resource_type: str
    ):
        self._ownership_verifier = p_ownership_verifier
        self._resource_type = p_resource_type
    
    async def __call__(
        self,
        p_request: Any,
        p_call_next: Callable[[Any], Awaitable[Any]]
    ) -> Any:
        """
        Verify ownership before proceeding.
        
        Flow:
        1. Extract user ID from request (auth token)
        2. Extract resource ID from request path
        3. Check if resource is public (skip check if true)
        4. Verify ownership
        5. Raise ForbiddenException if verification fails
        6. Proceed to next middleware if successful
        """
        user_id = self._extract_user_id(p_request)
        resource_id = self._extract_resource_id(p_request)
        
        # Skip check if no resource ID (e.g., list endpoints)
        if not resource_id:
            return await p_call_next(p_request)
        
        # Check if resource is public
        is_public = await self._ownership_verifier.is_public_resource_async(
            resource_id,
            self._resource_type
        )
        
        if is_public:
            return await p_call_next(p_request)
        
        # Verify ownership
        has_access = await self._ownership_verifier.verify_ownership_async(
            user_id,
            resource_id,
            self._resource_type
        )
        
        if not has_access:
            raise ForbiddenException(
                f"User {user_id} does not have access to {self._resource_type} {resource_id}"
            )
        
        return await p_call_next(p_request)
    
    @staticmethod
    def _extract_user_id(p_request: Any) -> str:
        """
        Extract user ID from authenticated request.
        Implementation depends on auth framework.
        """
        # Example: return p_request.state.user_id
        # Example: return p_request.user.id
        raise NotImplementedError("Must implement user ID extraction")
    
    @staticmethod
    def _extract_resource_id(p_request: Any) -> Optional[str]:
        """
        Extract resource ID from request path parameters.
        Implementation depends on web framework.
        """
        # Example: return p_request.path_params.get('id')
        # Example: return p_request.match_info.get('id')
        raise NotImplementedError("Must implement resource ID extraction")


# Example implementation:
"""
class ResourceOwnershipVerifier(IOwnershipVerifier):
    def __init__(self, p_repository: IQueryRepository):
        self._repository = p_repository
    
    async def verify_ownership_async(
        self,
        p_user_id: str,
        p_resource_id: str,
        p_resource_type: str
    ) -> bool:
        resource = await self._repository.find_by_id_async(p_resource_id)
        return resource and resource.owner_id == p_user_id
    
    async def is_public_resource_async(
        self,
        p_resource_id: str,
        p_resource_type: str
    ) -> bool:
        resource = await self._repository.find_by_id_async(p_resource_id)
        return resource and getattr(resource, 'is_public', False)
"""
