"""
Interface for publishing domain events to a message queue.
Used for asynchronous communication between subdomains.
CRITICAL: Domain events via queue are the ONLY way to communicate between subdomains.
HTTP calls between subdomains are FORBIDDEN.
"""

from abc import ABC, abstractmethod
from typing import TypeVar


TEvent = TypeVar('TEvent')


class IEventPublisher(ABC):
    """
    Interface for publishing domain events.
    
    Topic naming convention: {subdomain}.{action}
    Examples: "example.created", "example.updated", "example.deleted"
    
    Used for:
    - Asynchronous subdomain-to-subdomain communication
    - Event-driven architecture
    - Domain event broadcasting
    """
    
    @abstractmethod
    async def publish_async(self, p_event: TEvent, p_topic: str) -> None:
        """
        Publishes a domain event to the specified topic.
        
        Args:
            p_event: The event to publish
            p_topic: The topic to publish to
        """
        pass
