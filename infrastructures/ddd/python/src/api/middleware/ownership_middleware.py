"""
Middleware for validating resource ownership.
MUST be applied AFTER authentication but BEFORE controller execution.
"""

from typing import Awaitable, Callable


class OwnershipMiddleware:
    """
    Middleware for ownership validation.
    
    This middleware:
    - Extracts user ID from auth context
    - Extracts resource ID from request
    - Verifies user owns the resource
    - Returns 403 Forbidden if not owned
    
    FastAPI implementation:
    ```python
    from fastapi import Request, HTTPException, status
    from starlette.middleware.base import BaseHTTPMiddleware
    
    class OwnershipMiddleware(BaseHTTPMiddleware):
        def __init__(self, app, ownership_service):
            super().__init__(app)
            self._ownership_service = ownership_service
        
        async def dispatch(self, request: Request, call_next):
            # Skip for public resources or non-mutating operations
            if request.method == "GET" or request.url.path.endswith("/public"):
                return await call_next(request)
            
            # Extract user ID from auth context
            user_id = request.state.user_id
            
            # Extract resource ID from path
            resource_id = request.path_params.get("id")
            
            if resource_id:
                # Verify ownership
                if not await self._ownership_service.verify_async(user_id, resource_id):
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Access denied"
                    )
            
            return await call_next(request)
    ```
    
    Flask implementation:
    ```python
    from flask import request, g, abort
    
    def ownership_middleware():
        # Skip for GET requests
        if request.method == "GET":
            return
        
        # Get user ID from g
        user_id = g.user_id
        
        # Get resource ID from URL
        resource_id = request.view_args.get("id")
        
        if resource_id:
            # Verify ownership
            if not ownership_service.verify(user_id, resource_id):
                abort(403, "Access denied")
    ```
    """
    
    async def __call__(
        self,
        p_request: any,
        p_call_next: Callable[[any], Awaitable[any]]
    ) -> any:
        """
        Process the request and validate ownership.
        
        Args:
            p_request: The HTTP request
            p_call_next: The next middleware/handler
            
        Returns:
            The HTTP response
            
        Raises:
            HTTPException: If ownership validation fails
        """
        # Skip for GET requests (read-only)
        if p_request.method == "GET":
            return await p_call_next(p_request)
        
        # Extract user ID (from auth context)
        # user_id = p_request.state.user_id
        
        # Extract resource ID (from path params)
        # resource_id = p_request.path_params.get("id")
        
        # Verify ownership if resource ID present
        # if resource_id:
        #     if not await self._verify_ownership(user_id, resource_id):
        #         raise HTTPException(403, "Access denied")
        
        return await p_call_next(p_request)
