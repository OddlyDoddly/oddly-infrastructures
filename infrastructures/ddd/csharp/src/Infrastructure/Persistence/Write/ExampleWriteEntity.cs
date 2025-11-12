using System;
using OddlyDdd.Infrastructure.Persistence.Write.Infra;

namespace OddlyDdd.Infrastructure.Persistence.Write
{
    /// <summary>
    /// Example Write Entity demonstrating command side of CQRS.
    /// This class:
    /// - Lives in /Infrastructure/Persistence/Write/
    /// - Has WriteEntity suffix
    /// - Used for business logic execution (commands)
    /// - Contains all fields needed for business operations
    /// - CAN have database/ORM attributes (e.g., [BsonId], [BsonElement])
    /// - Mapped from/to BMO by repository using mapper
    /// </summary>
    public class ExampleWriteEntity : BaseWriteEntity
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
        /// Active status
        /// In MongoDB: [BsonElement("is_active")]
        /// In EF Core: [Column("is_active")]
        /// </summary>
        public bool IsActive { get; set; }

        public ExampleWriteEntity()
        {
        }
    }
}
