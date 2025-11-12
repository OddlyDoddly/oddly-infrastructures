"""
Base class for all read entities (query side of CQRS).
Read entities are pre-rendered views optimized for front-end.
They are denormalized for query performance.
"""

from infrastructure.persistence.infra import BaseEntity


class BaseReadEntity(BaseEntity):
    """
    Base class for read entities (query side).
    
    Read entities:
    - Live in /infrastructure/persistence/read/
    - Have ReadEntity suffix
    - Pre-rendered views optimized for queries
    - Denormalized for performance
    - MAY aggregate data from multiple write entities
    - Returned directly to service layer (no BMO mapping in read path)
    """
    
    def __init__(self):
        """Initialize a new read entity."""
        super().__init__()
