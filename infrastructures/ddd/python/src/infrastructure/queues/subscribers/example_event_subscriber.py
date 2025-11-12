"""
Example event subscriber demonstrating event handling patterns.
Subscribers:
- Live in /infrastructure/queues/subscribers/
- Handle domain events from other subdomains
- Trigger side effects in their subdomain
"""

from domain.events.example_created_event import ExampleCreatedEvent


class ExampleEventSubscriber:
    """
    Example event subscriber for handling Example domain events.
    
    This subscriber would be registered at application startup:
    ```python
    event_bus = InMemoryEventBus()
    subscriber = ExampleEventSubscriber()
    
    await event_bus.subscribe_async(
        "example.created",
        subscriber.handle_example_created
    )
    ```
    
    In a real application, this might:
    - Update a read model (CQRS)
    - Send notifications
    - Trigger workflows in another subdomain
    - Update analytics
    """
    
    async def handle_example_created(self, p_event: ExampleCreatedEvent) -> None:
        """
        Handles the ExampleCreatedEvent.
        
        Args:
            p_event: The event that was raised
        """
        # In a real application, this would:
        # 1. Update read models
        # 2. Send notifications
        # 3. Trigger side effects in this subdomain
        
        print(f"Example created: {p_event.example_id}")
        print(f"Name: {p_event.name}")
        print(f"Owner: {p_event.owner_id}")
        print(f"Correlation ID: {p_event.correlation_id}")
        
        # Example: Update a read model
        # await self._query_repo.update_read_model_async(p_event)
        
        # Example: Send a notification
        # await self._notification_service.send_async(
        #     p_to=p_event.owner_id,
        #     p_message=f"Example '{p_event.name}' was created"
        # )
