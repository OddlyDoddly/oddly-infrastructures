using System;

namespace OddlyDdd.Infrastructure.Persistence.Read
{
    /// <summary>
    /// Example Read Entity demonstrating query side of CQRS.
    /// This class:
    /// - Lives in /Infrastructure/Persistence/Read/
    /// - Has ReadEntity suffix
    /// - Pre-rendered view optimized for front-end
    /// - Denormalized for query performance
    /// - CAN have database/ORM attributes (e.g., [BsonId], [BsonElement])
    /// - MAY aggregate data from multiple write entities
    /// - Returned directly to service layer (no BMO mapping in read path)
    /// </summary>
    public class ExampleReadEntity : BaseReadEntity
    {
        /// <summary>
        /// Example name field
        /// In MongoDB: [BsonElement("name")]
        /// In EF Core: [Column("name")]
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Example description field
        /// In MongoDB: [BsonElement("description")]
        /// In EF Core: [Column("description")]
        /// </summary>
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// Owner user ID
        /// In MongoDB: [BsonElement("owner_id")]
        /// In EF Core: [Column("owner_id")]
        /// </summary>
        public string OwnerId { get; set; } = string.Empty;

        /// <summary>
        /// Owner name (denormalized for query performance)
        /// In MongoDB: [BsonElement("owner_name")]
        /// In EF Core: [Column("owner_name")]
        /// </summary>
        public string OwnerName { get; set; } = string.Empty;

        /// <summary>
        /// Active status
        /// In MongoDB: [BsonElement("is_active")]
        /// In EF Core: [Column("is_active")]
        /// </summary>
        public bool IsActive { get; set; }

        /// <summary>
        /// Computed display name (denormalized)
        /// In MongoDB: [BsonElement("display_name")]
        /// In EF Core: [Column("display_name")]
        /// </summary>
        public string DisplayName { get; set; } = string.Empty;

        /// <summary>
        /// Status text (denormalized)
        /// In MongoDB: [BsonElement("status_text")]
        /// In EF Core: [Column("status_text")]
        /// </summary>
        public string StatusText { get; set; } = string.Empty;

        public ExampleReadEntity()
        {
        }
    }
}
