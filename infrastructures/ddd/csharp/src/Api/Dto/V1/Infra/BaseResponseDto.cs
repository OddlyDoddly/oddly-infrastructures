namespace OddlyDdd.Api.Dto.V1.Infra
{
    /// <summary>
    /// Base class for all response DTOs.
    /// Response DTOs are used for HTTP transport only - NO business logic.
    /// They live in /Api/Dto/ and have Request|Response|Dto suffix.
    /// </summary>
    public abstract class BaseResponseDto
    {
        // Base properties that all responses might need can go here
        // Most responses will only add specific properties in derived classes
    }
}
