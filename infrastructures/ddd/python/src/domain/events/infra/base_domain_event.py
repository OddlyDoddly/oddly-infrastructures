"""
Base class for all domain events.
Domain events MUST:
- Suffix with "Event"
- Follow pattern: {Object}{Action}Event
- Be immutable
- Live in /domain/events/
- Include event_id, timestamp, and correlation_id
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional
import uuid


@dataclass(frozen=True)
class BaseDomainEvent:
    """
    Base class for all domain events.
    
    Domain events are used for:
    - Asynchronous subdomain-to-subdomain communication
    - ONLY way to communicate between subdomains (NO HTTP calls)
    
    All domain events are immutable (frozen dataclass).
    """
    
    event_id: str
    timestamp: datetime
    correlation_id: str
    
    def __init__(self, p_correlation_id: str):
        """
        Initialize a domain event.
        
        Args:
            p_correlation_id: The correlation ID for tracing
        """
        # Use object.__setattr__ because dataclass is frozen
        object.__setattr__(self, 'event_id', str(uuid.uuid4()))
        object.__setattr__(self, 'timestamp', datetime.utcnow())
        object.__setattr__(self, 'correlation_id', p_correlation_id)
