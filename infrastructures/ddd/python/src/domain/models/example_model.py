"""
Example Business Model Object (BMO) demonstrating domain layer patterns.
This class:
- Lives in /domain/models/
- Has Model or BMO suffix
- Contains business logic and invariants
- MUST NOT have database/ORM attributes
- Uses member field naming convention: _variable
"""

from datetime import datetime
from typing import Optional
from domain.models.infra import BaseModel


class ExampleModel(BaseModel):
    """
    Example domain model demonstrating DDD patterns.
    
    This model:
    - Encapsulates business rules
    - Enforces invariants through methods
    - Uses factory methods for creation
    - Provides hydration for persistence layer
    """
    
    def __init__(self):
        """Private constructor. Use factory methods instead."""
        super().__init__()
        self._name: str = ""
        self._description: str = ""
        self._owner_id: str = ""
        self._is_active: bool = True
    
    @property
    def name(self) -> str:
        """Get the example name."""
        return self._name
    
    @property
    def description(self) -> str:
        """Get the example description."""
        return self._description
    
    @property
    def owner_id(self) -> str:
        """Get the owner user ID."""
        return self._owner_id
    
    @property
    def is_active(self) -> bool:
        """Get the active status."""
        return self._is_active
    
    @staticmethod
    def create(p_name: str, p_description: str, p_owner_id: str) -> 'ExampleModel':
        """
        Factory method for creating new instances.
        
        Args:
            p_name: The name of the example
            p_description: The description of the example
            p_owner_id: The ID of the owner user
            
        Returns:
            A validated ExampleModel instance
            
        Raises:
            ValueError: If validation fails
        """
        model = ExampleModel()
        model._name = p_name
        model._description = p_description
        model._owner_id = p_owner_id
        model._is_active = True
        
        model.validate()
        return model
    
    @staticmethod
    def hydrate(
        p_id: str,
        p_name: str,
        p_description: str,
        p_owner_id: str,
        p_is_active: bool,
        p_created_at: datetime,
        p_updated_at: datetime
    ) -> 'ExampleModel':
        """
        Factory method for hydration from persistence layer.
        
        Args:
            p_id: The unique identifier
            p_name: The name
            p_description: The description
            p_owner_id: The owner ID
            p_is_active: The active status
            p_created_at: The creation timestamp
            p_updated_at: The update timestamp
            
        Returns:
            A hydrated ExampleModel instance
        """
        model = ExampleModel()
        model._id = p_id
        model._name = p_name
        model._description = p_description
        model._owner_id = p_owner_id
        model._is_active = p_is_active
        model._created_at = p_created_at
        model._updated_at = p_updated_at
        
        return model
    
    def update_details(self, p_name: str, p_description: str) -> None:
        """
        Updates the example details.
        
        Args:
            p_name: The new name
            p_description: The new description
            
        Raises:
            ValueError: If validation fails
        """
        if not p_name or not p_name.strip():
            raise ValueError("Name cannot be empty")
        
        self._name = p_name
        self._description = p_description
        self._updated_at = datetime.utcnow()
        
        self.validate()
    
    def activate(self) -> None:
        """Activates the example."""
        self._is_active = True
        self._updated_at = datetime.utcnow()
    
    def deactivate(self) -> None:
        """Deactivates the example."""
        self._is_active = False
        self._updated_at = datetime.utcnow()
    
    def validate_ownership(self, p_user_id: str) -> None:
        """
        Validates that the user owns this resource.
        
        Args:
            p_user_id: The user ID to validate
            
        Raises:
            PermissionError: If the user does not own the resource
        """
        if self._owner_id != p_user_id:
            raise PermissionError("User does not own this resource")
    
    def validate(self) -> None:
        """
        Validates business invariants.
        
        Raises:
            ValueError: If validation fails
        """
        super().validate()
        
        if not self._name or not self._name.strip():
            raise ValueError("Example name cannot be empty")
        
        if len(self._name) > 100:
            raise ValueError("Example name cannot exceed 100 characters")
        
        if not self._owner_id or not self._owner_id.strip():
            raise ValueError("Example must have an owner")
