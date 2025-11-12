"""
Command repository interface for Example domain.
Repository interfaces:
- Live in /infrastructure/repositories/
- Start with I prefix
- Implementations go in /infrastructure/repositories/impl/
"""

from infrastructure.repositories.infra import ICommandRepository
from domain.models.example_model import ExampleModel


class IExampleCommandRepository(ICommandRepository[ExampleModel, str]):
    """
    Command repository interface for Example domain.
    
    This interface extends the base command repository with
    Example-specific command operations if needed.
    """
    pass
