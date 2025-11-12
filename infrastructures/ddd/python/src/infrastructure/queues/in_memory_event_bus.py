"""
In-memory event bus implementation for development and testing.
In production, replace with actual message queue (RabbitMQ, Kafka, AWS SQS, etc.).
"""

import asyncio
from typing import Any, Callable, Dict, List
from infrastructure.queues.infra import IEventPublisher, IEventSubscriber


class InMemoryEventBus(IEventPublisher, IEventSubscriber):
    """
    In-memory event bus for development/testing.
    
    This implementation:
    - Stores subscribers in memory
    - Publishes events synchronously to all subscribers
    - Suitable for single-process applications
    
    For production, use actual message queue:
    - RabbitMQ with aio-pika
    - Kafka with aiokafka
    - AWS SQS/SNS with aioboto3
    - Azure Service Bus with azure-servicebus
    - Redis Pub/Sub with aioredis
    
    Example with RabbitMQ (aio-pika):
    ```python
    import aio_pika
    import json
    
    class RabbitMQEventBus(IEventPublisher, IEventSubscriber):
        def __init__(self, p_connection_string: str):
            self._connection_string = p_connection_string
            self._connection = None
            self._channel = None
        
        async def connect_async(self):
            self._connection = await aio_pika.connect_robust(self._connection_string)
            self._channel = await self._connection.channel()
        
        async def publish_async(self, p_event: Any, p_topic: str) -> None:
            exchange = await self._channel.declare_exchange(
                p_topic,
                aio_pika.ExchangeType.FANOUT
            )
            
            message = aio_pika.Message(
                body=json.dumps(p_event.__dict__).encode()
            )
            
            await exchange.publish(message, routing_key="")
    ```
    """
    
    def __init__(self):
        """Initialize the in-memory event bus."""
        self._subscribers: Dict[str, List[Callable]] = {}
    
    async def publish_async(self, p_event: Any, p_topic: str) -> None:
        """
        Publishes an event to all subscribers of the topic.
        
        Args:
            p_event: The event to publish
            p_topic: The topic to publish to
        """
        handlers = self._subscribers.get(p_topic, [])
        
        # Call all handlers asynchronously
        tasks = [handler(p_event) for handler in handlers]
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
    
    async def subscribe_async(
        self,
        p_topic: str,
        p_handler: Callable[[Any], None]
    ) -> None:
        """
        Subscribes a handler to a topic.
        
        Args:
            p_topic: The topic to subscribe to
            p_handler: The handler function for events
        """
        if p_topic not in self._subscribers:
            self._subscribers[p_topic] = []
        
        self._subscribers[p_topic].append(p_handler)
