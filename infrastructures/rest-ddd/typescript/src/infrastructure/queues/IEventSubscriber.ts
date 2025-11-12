/**
 * Event Subscriber Interface
 * Abstraction for subscribing to domain events from message queue.
 */

import { BaseDomainEvent } from '../../domain/events/BaseDomainEvent';

export interface IEventSubscriber {
  /**
   * Interface for subscribing to domain events.
   * 
   * Rules:
   * - Abstraction over message queue (RabbitMQ, Kafka, AWS SQS, etc.)
   * - Used for receiving events from other subdomains
   * - Handler processes events asynchronously
   */

  /**
   * Subscribe to events on specified topic.
   */
  subscribeAsync<TEvent extends BaseDomainEvent>(
    p_topic: string,
    p_handler: (p_event: TEvent) => Promise<void>
  ): Promise<void>;

  /**
   * Unsubscribe from topic.
   */
  unsubscribeAsync(p_topic: string): Promise<void>;
}

// Example implementation template:
/**
 * 
 * import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib';
 * 
 * export class RabbitMQEventSubscriber implements IEventSubscriber {
 *   private _connection: Connection | null = null;
 *   private _channel: Channel | null = null;
 *   private _consumerTags: Map<string, string> = new Map();
 * 
 *   constructor(private readonly _connectionString: string) {}
 * 
 *   async connect(): Promise<void> {
 *     this._connection = await amqp.connect(this._connectionString);
 *     this._channel = await this._connection.createChannel();
 *     await this._channel.prefetch(10);
 *   }
 * 
 *   async subscribeAsync<TEvent extends BaseDomainEvent>(
 *     p_topic: string,
 *     p_handler: (p_event: TEvent) => Promise<void>
 *   ): Promise<void> {
 *     if (!this._channel) {
 *       await this.connect();
 *     }
 * 
 *     const exchange = 'domain_events';
 *     const queueName = `${p_topic}_queue`;
 * 
 *     await this._channel!.assertExchange(exchange, 'topic', { durable: true });
 *     const queue = await this._channel!.assertQueue(queueName, { durable: true });
 *     await this._channel!.bindQueue(queue.queue, exchange, p_topic);
 * 
 *     const { consumerTag } = await this._channel!.consume(
 *       queue.queue,
 *       async (msg: ConsumeMessage | null) => {
 *         if (msg) {
 *           try {
 *             const eventData = JSON.parse(msg.content.toString());
 *             await p_handler(eventData as TEvent);
 *             this._channel!.ack(msg);
 *           } catch (error) {
 *             console.error('Error processing message:', error);
 *             this._channel!.nack(msg, false, false);
 *           }
 *         }
 *       }
 *     );
 * 
 *     this._consumerTags.set(p_topic, consumerTag);
 *   }
 * 
 *   async unsubscribeAsync(p_topic: string): Promise<void> {
 *     const consumerTag = this._consumerTags.get(p_topic);
 *     if (consumerTag && this._channel) {
 *       await this._channel.cancel(consumerTag);
 *       this._consumerTags.delete(p_topic);
 *     }
 *   }
 * 
 *   async close(): Promise<void> {
 *     if (this._channel) await this._channel.close();
 *     if (this._connection) await this._connection.close();
 *   }
 * }
 */
