"""Domain event for when an example is updated."""

from dataclasses import dataclass
from domain.events.infra import BaseDomainEvent


@dataclass(frozen=True)
class ExampleUpdatedEvent(BaseDomainEvent):
    """Event raised when an example is updated."""
    
    example_id: str
    name: str
    
    def __init__(
        self,
        p_example_id: str,
        p_name: str,
        p_correlation_id: str
    ):
        """
        Initialize the ExampleUpdatedEvent.
        
        Args:
            p_example_id: The ID of the updated example
            p_name: The updated name
            p_correlation_id: The correlation ID for tracing
        """
        super().__init__(p_correlation_id)
        object.__setattr__(self, 'example_id', p_example_id)
        object.__setattr__(self, 'name', p_name)
