"""
Interface for Unit of Work pattern.
UnitOfWork manages transactions across multiple repositories.
Transaction management is handled by UnitOfWork middleware automatically.
"""

from abc import ABC, abstractmethod


class IUnitOfWork(ABC):
    """
    Interface for Unit of Work pattern.
    
    UnitOfWork:
    - Manages database transactions
    - Coordinates multiple repository operations
    - Ensures atomicity of business operations
    - Called by UnitOfWorkMiddleware automatically
    - Services MUST NOT manually manage transactions
    """
    
    @abstractmethod
    async def begin_transaction_async(self) -> None:
        """Begins a new database transaction."""
        pass
    
    @abstractmethod
    async def commit_async(self) -> None:
        """Commits the current transaction."""
        pass
    
    @abstractmethod
    async def rollback_async(self) -> None:
        """Rolls back the current transaction."""
        pass
    
    @abstractmethod
    async def save_changes_async(self) -> None:
        """Saves all pending changes to the database."""
        pass
