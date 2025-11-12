"""
Middleware for managing database transactions using Unit of Work pattern.
MUST be applied AFTER authentication/authorization but BEFORE controller execution.
Automatically commits on success (status < 400) or rolls back on error (status >= 400).
Services should NOT manually manage transactions.
"""

from typing import Awaitable, Callable
from infrastructure.repositories.infra import IUnitOfWork


class UnitOfWorkMiddleware:
    """
    Middleware for Unit of Work transaction management.
    
    This middleware:
    - Begins transaction before controller
    - Commits on success (status < 400)
    - Rolls back on error (status >= 400 or exception)
    - Only applies to mutating operations (POST, PUT, PATCH, DELETE)
    
    FastAPI implementation:
    ```python
    from fastapi import Request
    from starlette.middleware.base import BaseHTTPMiddleware
    
    class UnitOfWorkMiddleware(BaseHTTPMiddleware):
        def __init__(self, app, unit_of_work: IUnitOfWork):
            super().__init__(app)
            self._unit_of_work = unit_of_work
        
        async def dispatch(self, request: Request, call_next):
            # Only apply UnitOfWork for mutating operations
            is_mutating = request.method in ["POST", "PUT", "PATCH", "DELETE"]
            
            if not is_mutating:
                return await call_next(request)
            
            try:
                await self._unit_of_work.begin_transaction_async()
                
                response = await call_next(request)
                
                # Commit if successful
                if response.status_code < 400:
                    await self._unit_of_work.commit_async()
                else:
                    await self._unit_of_work.rollback_async()
                
                return response
                
            except Exception as ex:
                await self._unit_of_work.rollback_async()
                raise
    ```
    
    Flask implementation:
    ```python
    from flask import request, g
    
    @app.before_request
    async def begin_transaction():
        if request.method in ["POST", "PUT", "PATCH", "DELETE"]:
            await g.unit_of_work.begin_transaction_async()
    
    @app.after_request
    async def commit_or_rollback(response):
        if hasattr(g, 'unit_of_work'):
            if response.status_code < 400:
                await g.unit_of_work.commit_async()
            else:
                await g.unit_of_work.rollback_async()
        return response
    
    @app.teardown_request
    async def rollback_on_error(error=None):
        if error and hasattr(g, 'unit_of_work'):
            await g.unit_of_work.rollback_async()
    ```
    """
    
    def __init__(self, p_unit_of_work: IUnitOfWork):
        """
        Initialize the middleware.
        
        Args:
            p_unit_of_work: The unit of work instance
        """
        self._unit_of_work = p_unit_of_work
    
    async def __call__(
        self,
        p_request: any,
        p_call_next: Callable[[any], Awaitable[any]]
    ) -> any:
        """
        Process the request with transaction management.
        
        Args:
            p_request: The HTTP request
            p_call_next: The next middleware/handler
            
        Returns:
            The HTTP response
        """
        # Only apply UnitOfWork for mutating operations
        is_mutating = p_request.method in ["POST", "PUT", "PATCH", "DELETE"]
        
        if not is_mutating:
            return await p_call_next(p_request)
        
        try:
            # Begin transaction
            await self._unit_of_work.begin_transaction_async()
            
            # Process request
            response = await p_call_next(p_request)
            
            # Commit if successful, rollback otherwise
            if response.status_code < 400:
                await self._unit_of_work.commit_async()
            else:
                await self._unit_of_work.rollback_async()
            
            return response
            
        except Exception:
            # Rollback on any exception
            await self._unit_of_work.rollback_async()
            raise
