namespace OddlyDdd.Api.Dto.V1.Infra
{
    /// <summary>
    /// Base class for all request DTOs.
    /// Request DTOs are used for HTTP transport only - NO business logic.
    /// They live in /Api/Dto/ and have Request|Response|Dto suffix.
    /// </summary>
    public abstract class BaseRequestDto
    {
        // Base properties that all requests might need can go here
        // Most requests will only add specific properties in derived classes
    }
}
