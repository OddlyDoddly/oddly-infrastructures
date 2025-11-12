"""
Base Model (BMO) - Business Model Object
Pure business logic with NO database attributes.
All domain models MUST inherit from this base class.
"""
from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseModel(ABC):
    """
    Abstract base class for all Business Model Objects (BMOs).
    
    Rules:
    - NO database/persistence attributes
    - Contains business logic and invariants
    - Validates business rules
    - Immutable by default (use frozen dataclasses or properties)
    """
    
    @abstractmethod
    def validate(self) -> None:
        """
        Validate business invariants.
        Raises exception if invalid.
        """
        pass
    
    @abstractmethod
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert model to dictionary representation.
        Used by mappers for transformation.
        """
        pass
