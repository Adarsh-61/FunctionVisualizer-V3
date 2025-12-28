"""
Function Visualiser Backend - Main Application Entry Point

FastAPI application with CORS, WebSocket support, and all API routers.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.middleware.gzip import GZipMiddleware

from app.config import get_settings
from app.api.math import router as math_router
from app.api.ai import router as ai_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan handler for startup/shutdown events."""
    # Startup
    print(f"Starting {settings.app_name} v{settings.app_version}")
    print(f"AI Mode: {settings.ai_mode}")
    if settings.ai_mode in ("online", "auto"):
        print(f"OpenRouter Model: {settings.openrouter_model}")
    if settings.ai_mode in ("offline", "auto"):
        print(f"Ollama Model: {settings.ollama_model}")
    
    yield
    
    # Shutdown
    print("Shutting down Function Visualiser API")


# Create FastAPI application
app = FastAPI(
    title=f"{settings.app_name} (Version 3)",
    version=settings.app_version,
    description="""
    Function Visualiser API (Version 3)
    
    A high-performance mathematical computation and visualization backend with 
    context-aware AI assistance and a data-driven NCERT curriculum engine.
    
    ## Educational Modules (NCERT)
    
    1. **NCERT Calculus**: Derivatives, integrals, limits, continuity
    2. **NCERT Algebra**: Polynomials, quadratic equations, progressions
    3. **NCERT Geometry**: Coordinate geometry, circles, conics, 3D
    4. **NCERT Trigonometry**: Functions, identities, equations
    
    ## Advanced & Helper Modules
    
    - **Matrices & Linear Algebra**: Determinants, eigenvalues, transformations
    - **AI Assistant**: Context-aware problem solving
    - **Dynamic Solvers**: Interactive step-by-step visualization
    
    Developed by NAS Team
    """,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable GZip Compression for large JSON responses
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - health check."""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version,
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "ai_mode": settings.ai_mode,
        "services": {
            "math_engine": "operational",
            "ai_service": "operational",
        }
    }


# Include API routers
app.include_router(
    math_router,
    prefix="/api/math",
    tags=["Mathematics"]
)

app.include_router(
    ai_router,
    prefix="/api/ai",
    tags=["AI Assistant"]
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle uncaught exceptions globally."""
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": str(exc),
            "detail": "An unexpected error occurred. Please try again.",
        }
    )
