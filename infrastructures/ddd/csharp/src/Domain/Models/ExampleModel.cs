using System;

namespace OddlyDdd.Domain.Models
{
    /// <summary>
    /// Example Business Model Object (BMO) demonstrating domain layer patterns.
    /// This class:
    /// - Lives in /Domain/Models/
    /// - Has Model or BMO suffix
    /// - Contains business logic and invariants
    /// - MUST NOT have database/ORM attributes
    /// - Uses member field naming convention: _variable
    /// </summary>
    public class ExampleModel : BaseModel
    {
        private string _name = string.Empty;
        private string _description = string.Empty;
        private string _ownerId = string.Empty;
        private bool _isActive;

        public string Name
        {
            get => _name;
            private set => _name = value;
        }

        public string Description
        {
            get => _description;
            private set => _description = value;
        }

        public string OwnerId
        {
            get => _ownerId;
            private set => _ownerId = value;
        }

        public bool IsActive
        {
            get => _isActive;
            private set => _isActive = value;
        }

        // Private constructor for hydration from database
        private ExampleModel()
        {
        }

        // Public factory method for creating new instances
        public static ExampleModel Create(string p_name, string p_description, string p_ownerId)
        {
            var model = new ExampleModel
            {
                _name = p_name,
                _description = p_description,
                _ownerId = p_ownerId,
                _isActive = true
            };

            model.Validate();
            return model;
        }

        // Factory method for hydration from persistence layer
        public static ExampleModel Hydrate(
            string p_id,
            string p_name,
            string p_description,
            string p_ownerId,
            bool p_isActive,
            DateTime p_createdAt,
            DateTime p_updatedAt)
        {
            return new ExampleModel
            {
                _id = p_id,
                _name = p_name,
                _description = p_description,
                _ownerId = p_ownerId,
                _isActive = p_isActive,
                _createdAt = p_createdAt,
                _updatedAt = p_updatedAt
            };
        }

        // Business logic methods
        public void UpdateDetails(string p_name, string p_description)
        {
            if (string.IsNullOrWhiteSpace(p_name))
            {
                throw new ArgumentException("Name cannot be empty", nameof(p_name));
            }

            _name = p_name;
            _description = p_description;
            _updatedAt = DateTime.UtcNow;
            
            Validate();
        }

        public void Activate()
        {
            _isActive = true;
            _updatedAt = DateTime.UtcNow;
        }

        public void Deactivate()
        {
            _isActive = false;
            _updatedAt = DateTime.UtcNow;
        }

        public void ValidateOwnership(string p_userId)
        {
            if (_ownerId != p_userId)
            {
                throw new UnauthorizedAccessException("User does not own this resource");
            }
        }

        // Validate business invariants
        public override void Validate()
        {
            base.Validate();

            if (string.IsNullOrWhiteSpace(_name))
            {
                throw new InvalidOperationException("Example name cannot be empty");
            }

            if (_name.Length > 100)
            {
                throw new InvalidOperationException("Example name cannot exceed 100 characters");
            }

            if (string.IsNullOrWhiteSpace(_ownerId))
            {
                throw new InvalidOperationException("Example must have an owner");
            }
        }
    }
}
