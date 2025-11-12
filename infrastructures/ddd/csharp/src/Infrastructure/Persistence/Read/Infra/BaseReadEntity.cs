using System;

namespace OddlyDdd.Infrastructure.Persistence.Read.Infra
{
    /// <summary>
    /// Base class for all read entities (query side of CQRS).
    /// Read entities are pre-rendered views optimized for front-end consumption.
    /// They are denormalized for query performance and may aggregate multiple write entities.
    /// </summary>
    public abstract class BaseReadEntity
    {
        /// <summary>
        /// Unique identifier for the entity
        /// </summary>
        public string Id { get; set; } = string.Empty;

        /// <summary>
        /// Timestamp when the read entity was created
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Timestamp when the read entity was last updated
        /// </summary>
        public DateTime UpdatedAt { get; set; }

        protected BaseReadEntity()
        {
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
