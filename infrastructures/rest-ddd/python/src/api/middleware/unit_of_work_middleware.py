"""
UnitOfWork Middleware (MANDATORY)
Handles ALL transactions automatically.
"""
from abc import ABC, abstractmethod
from typing import Callable, Awaitable, Any


class IUnitOfWork(ABC):
    """
    UnitOfWork interface for transaction management.
    
    Rules:
    - Middleware handles ALL transactions
    - NO manual transaction management in services
    - Auto-commit on success (status < 400)
    - Auto-rollback on failure (status >= 400 or exception)
    """
    
    @abstractmethod
    async def begin_transaction(self) -> None:
        """Begin a new transaction."""
        pass
    
    @abstractmethod
    async def commit(self) -> None:
        """Commit the current transaction."""
        pass
    
    @abstractmethod
    async def rollback(self) -> None:
        """Rollback the current transaction."""
        pass
    
    @abstractmethod
    async def save_changes(self) -> None:
        """Save changes without committing (for batching)."""
        pass


class UnitOfWorkMiddleware:
    """
    Middleware to automatically manage transactions.
    
    Order: After authentication/authorization, before controller
    """
    
    def __init__(self, p_unit_of_work: IUnitOfWork):
        self._unit_of_work = p_unit_of_work
    
    async def __call__(
        self,
        p_request: Any,
        p_call_next: Callable[[Any], Awaitable[Any]]
    ) -> Any:
        """
        Execute request within transaction boundary.
        
        Flow:
        1. Begin transaction
        2. Execute request
        3. Commit if successful (status < 400)
        4. Rollback if error (status >= 400 or exception)
        """
        try:
            await self._unit_of_work.begin_transaction()
            
            # Execute the request
            response = await p_call_next(p_request)
            
            # Check response status
            status_code = getattr(response, 'status_code', 200)
            
            if status_code < 400:
                await self._unit_of_work.commit()
            else:
                await self._unit_of_work.rollback()
            
            return response
            
        except Exception as e:
            # Rollback on any exception
            await self._unit_of_work.rollback()
            raise e


# Example implementation for specific database:
"""
from motor.motor_asyncio import AsyncIOMotorClient

class MongoUnitOfWork(IUnitOfWork):
    def __init__(self, p_client: AsyncIOMotorClient):
        self._client = p_client
        self._session = None
    
    async def begin_transaction(self) -> None:
        self._session = await self._client.start_session()
        self._session.start_transaction()
    
    async def commit(self) -> None:
        if self._session:
            await self._session.commit_transaction()
            self._session.end_session()
            self._session = None
    
    async def rollback(self) -> None:
        if self._session:
            await self._session.abort_transaction()
            self._session.end_session()
            self._session = None
    
    async def save_changes(self) -> None:
        # For MongoDB, changes are auto-saved within transaction
        pass
"""
