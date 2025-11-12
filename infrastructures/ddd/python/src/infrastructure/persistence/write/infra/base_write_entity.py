"""
Base class for all write entities (command side of CQRS).
Write entities are used when business logic executes against data.
They contain all fields needed for business operations.
"""

from infrastructure.persistence.infra import BaseEntity


class BaseWriteEntity(BaseEntity):
    """
    Base class for write entities (command side).
    
    Write entities:
    - Live in /infrastructure/persistence/write/
    - Have WriteEntity suffix
    - Used for commands (create, update, delete)
    - Contain all fields needed for business operations
    - May have optimistic concurrency control (version field)
    """
    
    def __init__(self):
        """Initialize a new write entity."""
        super().__init__()
        self.version: int = 0  # For optimistic concurrency control
