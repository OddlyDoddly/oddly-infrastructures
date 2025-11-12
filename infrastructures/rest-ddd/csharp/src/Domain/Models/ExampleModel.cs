/**
 * Example Model (BMO) - Business Model Object
 * NO database attributes - pure business logic only.
 */

using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public class ExampleModel : BaseModel
    {
        /**
         * Example domain model demonstrating DDD principles.
         * 
         * Rules:
         * - Member fields prefixed with underscore: _variable or m_variable
         * - NO database/ORM attributes
         * - Contains business logic and validation
         * - Located in /Domain/Models/
         */

        private string? _id;
        private string _name;
        private string _description;
        private ExampleStatus _status;
        private string _ownerId;

        public ExampleModel(
            string p_name,
            string p_description,
            ExampleStatus p_status,
            string p_ownerId,
            string? p_id = null
        )
        {
            _id = p_id;
            _name = p_name;
            _description = p_description;
            _status = p_status;
            _ownerId = p_ownerId;
        }

        // Properties
        public string? Id => _id;
        public string Name => _name;
        public string Description => _description;
        public ExampleStatus Status => _status;
        public string OwnerId => _ownerId;

        // Business logic methods
        public override void Validate()
        {
            if (string.IsNullOrWhiteSpace(_name))
            {
                throw new ArgumentException("Name is required");
            }

            if (_name.Length < 3)
            {
                throw new ArgumentException("Name must be at least 3 characters");
            }

            if (_name.Length > 100)
            {
                throw new ArgumentException("Name must not exceed 100 characters");
            }

            if (string.IsNullOrWhiteSpace(_ownerId))
            {
                throw new ArgumentException("Owner ID is required");
            }
        }

        public void Activate()
        {
            if (_status == ExampleStatus.Active)
            {
                throw new InvalidOperationException("Example is already active");
            }
            _status = ExampleStatus.Active;
        }

        public void Deactivate()
        {
            if (_status == ExampleStatus.Inactive)
            {
                throw new InvalidOperationException("Example is already inactive");
            }
            _status = ExampleStatus.Inactive;
        }

        public void UpdateDescription(string p_description)
        {
            if (p_description.Length > 500)
            {
                throw new ArgumentException("Description must not exceed 500 characters");
            }
            _description = p_description;
        }

        public override Dictionary<string, object> ToDictionary()
        {
            return new Dictionary<string, object>
            {
                { "id", _id ?? string.Empty },
                { "name", _name },
                { "description", _description },
                { "status", _status.ToString() },
                { "ownerId", _ownerId }
            };
        }
    }

    public enum ExampleStatus
    {
        Active,
        Inactive,
        Pending
    }
}
