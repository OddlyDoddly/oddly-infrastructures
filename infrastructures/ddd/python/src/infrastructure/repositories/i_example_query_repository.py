"""
Query repository interface for Example domain.
Repository interfaces:
- Live in /infrastructure/repositories/
- Start with I prefix
- Implementations go in /infrastructure/repositories/impl/
"""

from infrastructure.repositories.infra import IQueryRepository
from infrastructure.persistence.read.example_read_entity import ExampleReadEntity


class IExampleQueryRepository(IQueryRepository[ExampleReadEntity, str]):
    """
    Query repository interface for Example domain.
    
    This interface extends the base query repository with
    Example-specific query operations if needed.
    """
    pass
