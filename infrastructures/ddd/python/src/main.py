"""
Main entry point for the Oddly DDD Python application.

This module initializes the FastAPI application, configures middleware,
sets up dependency injection, and registers routes.

The application follows Domain-Driven Design (DDD) with CQRS pattern.
"""

import logging
from contextlib import asynccontextmanager
from datetime import datetime
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Import middleware
from api.middleware.correlation_id_middleware import CorrelationIdMiddleware
from api.middleware.error_handling_middleware import ErrorHandlingMiddleware
from api.middleware.ownership_middleware import OwnershipMiddleware
from api.middleware.unit_of_work_middleware import UnitOfWorkMiddleware

# Import controllers
from api.controllers.example_controller import ExampleController

# Import DTOs
from api.dto.requests.create_example_request import CreateExampleRequest
from api.dto.requests.update_example_request import UpdateExampleRequest
from api.dto.responses.example_response import ExampleResponse

# Import services
from application.services.i_example_service import IExampleService
from application.services.impl.example_service import ExampleService

# Import repositories
from infrastructure.repositories.i_example_command_repository import IExampleCommandRepository
from infrastructure.repositories.i_example_query_repository import IExampleQueryRepository
from infrastructure.repositories.impl.example_command_repository import ExampleCommandRepository
from infrastructure.repositories.impl.example_query_repository import ExampleQueryRepository
from infrastructure.repositories.infra.i_unit_of_work import IUnitOfWork
from infrastructure.repositories.infra.unit_of_work import UnitOfWork

# Import mappers
from application.mappers.example_mapper import ExampleMapper

# Import event bus
from infrastructure.queues.infra.i_event_publisher import IEventPublisher
from infrastructure.queues.infra.i_event_subscriber import IEventSubscriber
from infrastructure.queues.in_memory_event_bus import InMemoryEventBus

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(p_app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan manager.
    
    Handles startup and shutdown events for the application.
    Use this to initialize/cleanup resources like database connections,
    event bus connections, etc.
    
    Args:
        p_app: The FastAPI application instance
        
    Yields:
        None during application runtime
    """
    # Startup
    logger.info("Starting Oddly DDD Application...")
    logger.info("Initializing database connections...")
    # TODO: Initialize database connection pools
    
    logger.info("Initializing event bus...")
    # TODO: Initialize event bus connections
    
    logger.info("Application started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Oddly DDD Application...")
    logger.info("Closing database connections...")
    # TODO: Close database connections
    
    logger.info("Closing event bus connections...")
    # TODO: Close event bus connections
    
    logger.info("Application shutdown complete")


# Create FastAPI application
app = FastAPI(
    title="Oddly DDD Infrastructure",
    description="Domain-Driven Design infrastructure template with CQRS pattern for Python",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/swagger",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)


# ======================================
# Dependency Injection Container
# ======================================

class DependencyContainer:
    """
    Simple dependency injection container.
    
    In production, consider using a full DI framework like:
    - dependency-injector
    - injector
    - punq
    """
    
    def __init__(self):
        """Initialize the dependency container."""
        # Initialize event bus (singleton)
        self._event_bus = InMemoryEventBus()
        
        # Initialize Unit of Work
        self._unit_of_work = UnitOfWork()
        
        # Initialize repositories
        self._example_command_repository = ExampleCommandRepository(self._unit_of_work)
        self._example_query_repository = ExampleQueryRepository()
        
        # Initialize mappers
        self._example_mapper = ExampleMapper()
        
        # Initialize services
        self._example_service = ExampleService(
            self._example_command_repository,
            self._example_query_repository,
            self._example_mapper,
            self._event_bus
        )
        
        # Initialize controllers
        self._example_controller = ExampleController(self._example_service)
    
    @property
    def event_publisher(self) -> IEventPublisher:
        """Get event publisher instance."""
        return self._event_bus
    
    @property
    def event_subscriber(self) -> IEventSubscriber:
        """Get event subscriber instance."""
        return self._event_bus
    
    @property
    def unit_of_work(self) -> IUnitOfWork:
        """Get unit of work instance."""
        return self._unit_of_work
    
    @property
    def example_service(self) -> IExampleService:
        """Get example service instance."""
        return self._example_service
    
    @property
    def example_controller(self) -> ExampleController:
        """Get example controller instance."""
        return self._example_controller


# Initialize dependency container
container = DependencyContainer()


# ======================================
# Configure CORS
# ======================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Correlation-Id", "X-Request-Id"]
)


# ======================================
# Configure Custom Middleware
# ======================================
# CRITICAL: Middleware order matters! Follow the exact sequence below.
# Note: FastAPI processes middleware in reverse order of addition

# 8. Error Handling - Map exceptions to HTTP responses (added first, executes last wrapping all)
app.add_middleware(ErrorHandlingMiddleware)

# 7. (Controllers execute here)

# 6. Unit of Work - Manage database transactions
app.add_middleware(UnitOfWorkMiddleware, unit_of_work=container.unit_of_work)

# 5. (CORS is already added above)

# 4. Authorization/Ownership - Verify permissions and resource ownership
app.add_middleware(OwnershipMiddleware)

# 3. Authentication - Verify user identity
# TODO: Add authentication middleware
# app.add_middleware(AuthenticationMiddleware)

# 2. Logging - Request/response logging
# TODO: Add logging middleware if not using uvicorn's built-in logging

# 1. Correlation ID - Tracks requests across services (added last, executes first)
app.add_middleware(CorrelationIdMiddleware)


# ======================================
# Register Routes
# ======================================

@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint - provides basic application information.
    
    Returns:
        Application metadata
    """
    return {
        "application": "Oddly DDD Infrastructure",
        "version": "1.0.0",
        "description": "Domain-Driven Design infrastructure template with CQRS",
        "documentation": "/swagger",
        "health": "/health"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        Health status of the application
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


# Register example controller routes
# Note: Example controller methods need to be wrapped as FastAPI routes
# TODO: Replace with your actual controllers

from fastapi import APIRouter, status

example_router = APIRouter(prefix="/examples", tags=["Examples"])


@example_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_example_route(p_request: CreateExampleRequest):
    """Create a new example."""
    return await container.example_controller.create_example(p_request)


@example_router.get("/{p_id}", response_model=ExampleResponse)
async def get_example_route(p_id: str):
    """Get an example by ID."""
    return await container.example_controller.get_example(p_id)


@example_router.get("/", response_model=list)
async def list_examples_route(p_skip: int = 0, p_take: int = 10):
    """List examples with pagination."""
    return await container.example_controller.list_examples(p_skip, p_take)


@example_router.put("/{p_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_example_route(p_id: str, p_request: UpdateExampleRequest):
    """Update an example."""
    await container.example_controller.update_example(p_id, p_request)


@example_router.delete("/{p_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_example_route(p_id: str):
    """Delete an example."""
    await container.example_controller.delete_example(p_id)


@example_router.post("/{p_id}/activate", status_code=status.HTTP_204_NO_CONTENT)
async def activate_example_route(p_id: str):
    """Activate an example."""
    await container.example_controller.activate_example(p_id)


@example_router.post("/{p_id}/deactivate", status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_example_route(p_id: str):
    """Deactivate an example."""
    await container.example_controller.deactivate_example(p_id)


# Include the router in the app
app.include_router(example_router, prefix="/api/v1")


# ======================================
# Application Entry Point
# ======================================

if __name__ == "__main__":
    import uvicorn
    
    logger.info("Starting Oddly DDD application with uvicorn...")
    
    # Run the application
    # For production, use: uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )
