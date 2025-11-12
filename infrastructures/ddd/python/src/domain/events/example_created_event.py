"""
Domain event for when an example is created.
Domain events MUST:
- Suffix with "Event"
- Follow pattern: {Object}{Action}Event
- Be immutable (frozen dataclass)
- Live in /domain/events/
- Include event_id, timestamp, and correlation_id (from base)

Used for:
- Asynchronous subdomain-to-subdomain communication
- ONLY way to communicate between subdomains (NO HTTP calls)

Topic naming: {subdomain}.created (e.g., "example.created")
"""

from dataclasses import dataclass
from domain.events.infra import BaseDomainEvent


@dataclass(frozen=True)
class ExampleCreatedEvent(BaseDomainEvent):
    """
    Event raised when an example is created.
    
    This event contains all information needed for other subdomains
    to react to the creation of an example.
    """
    
    example_id: str
    name: str
    owner_id: str
    
    def __init__(
        self,
        p_example_id: str,
        p_name: str,
        p_owner_id: str,
        p_correlation_id: str
    ):
        """
        Initialize the ExampleCreatedEvent.
        
        Args:
            p_example_id: The ID of the created example
            p_name: The name of the created example
            p_owner_id: The owner ID of the created example
            p_correlation_id: The correlation ID for tracing
        """
        super().__init__(p_correlation_id)
        object.__setattr__(self, 'example_id', p_example_id)
        object.__setattr__(self, 'name', p_name)
        object.__setattr__(self, 'owner_id', p_owner_id)
