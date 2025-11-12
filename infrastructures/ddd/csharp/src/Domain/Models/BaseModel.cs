using System;

namespace OddlyDdd.Domain.Models
{
    /// <summary>
    /// Base class for all Business Model Objects (BMOs).
    /// BMOs contain business logic and invariants.
    /// CRITICAL: BMOs MUST NOT have database/ORM attributes.
    /// They live in /Domain/Models/ and have Model or BMO suffix.
    /// Separation from persistence layer is MANDATORY.
    /// </summary>
    public abstract class BaseModel
    {
        protected string _id = string.Empty;
        protected DateTime _createdAt;
        protected DateTime _updatedAt;

        public string Id
        {
            get => _id;
            protected set => _id = value;
        }

        public DateTime CreatedAt
        {
            get => _createdAt;
            protected set => _createdAt = value;
        }

        public DateTime UpdatedAt
        {
            get => _updatedAt;
            protected set => _updatedAt = value;
        }

        protected BaseModel()
        {
            _id = Guid.NewGuid().ToString();
            _createdAt = DateTime.UtcNow;
            _updatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Validates the business invariants of the model.
        /// Override this method to add specific validation logic.
        /// </summary>
        public virtual void Validate()
        {
            if (string.IsNullOrWhiteSpace(_id))
            {
                throw new InvalidOperationException("Model ID cannot be empty");
            }
        }
    }
}
