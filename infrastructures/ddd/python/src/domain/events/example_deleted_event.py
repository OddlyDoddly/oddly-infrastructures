"""Domain event for when an example is deleted."""

from dataclasses import dataclass
from domain.events.infra import BaseDomainEvent


@dataclass(frozen=True)
class ExampleDeletedEvent(BaseDomainEvent):
    """Event raised when an example is deleted."""
    
    example_id: str
    
    def __init__(
        self,
        p_example_id: str,
        p_correlation_id: str
    ):
        """
        Initialize the ExampleDeletedEvent.
        
        Args:
            p_example_id: The ID of the deleted example
            p_correlation_id: The correlation ID for tracing
        """
        super().__init__(p_correlation_id)
        object.__setattr__(self, 'example_id', p_example_id)
