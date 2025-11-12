"""
Base Domain Event
Pattern: {Object}{Action}Event (e.g., UserCreatedEvent)
MUST be immutable.
"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict
import uuid


@dataclass(frozen=True)
class BaseDomainEvent:
    """
    Abstract base class for all domain events.
    
    Rules:
    - MUST suffix with 'Event'
    - Pattern: {Object}{Action}Event
    - MUST be immutable (frozen dataclass)
    - Location: /domain/events/
    - Include timestamp and correlation ID
    """
    
    event_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = field(default_factory=datetime.utcnow)
    correlation_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert event to dictionary for serialization.
        """
        return {
            'event_id': self.event_id,
            'timestamp': self.timestamp.isoformat(),
            'correlation_id': self.correlation_id,
            'event_type': self.__class__.__name__
        }


# Example usage template:
"""
from dataclasses import dataclass
from domain.events.base_domain_event import BaseDomainEvent

@dataclass(frozen=True)
class UserCreatedEvent(BaseDomainEvent):
    user_id: str
    email: str
    username: str
    
    def to_dict(self) -> Dict[str, Any]:
        base_dict = super().to_dict()
        base_dict.update({
            'user_id': self.user_id,
            'email': self.email,
            'username': self.username
        })
        return base_dict

@dataclass(frozen=True)
class OrderProcessedEvent(BaseDomainEvent):
    order_id: str
    total_amount: float
    status: str
    
    def to_dict(self) -> Dict[str, Any]:
        base_dict = super().to_dict()
        base_dict.update({
            'order_id': self.order_id,
            'total_amount': self.total_amount,
            'status': self.status
        })
        return base_dict
"""
