# syntax=docker/dockerfile:1

# ==============================================================================
# FUNCTION VISUALISER - BACKEND DOCKERFILE
# ==============================================================================
# 
# This Dockerfile creates a production-ready Python/FastAPI container using a
# multi-stage build pattern. This approach minimizes the final image size and
# attack surface by separating build-time dependencies from runtime.
#
# Architecture:
#   Stage 1 (Builder): Compiles Python packages with C extensions (NumPy, etc.)
#   Stage 2 (Runtime): Minimal image with only runtime dependencies
#
# Base Images:
#   Current:   python:3.11-slim-bookworm (Official Docker Hub)
#   DHI Ready: dhi.io/python:3.12-debian13-dev (Docker Hardened Images)
#
# Security Features:
#   - Non-root user (appuser:10001)
#   - Read-only filesystem compatible (see docker-compose.yml)
#   - No unnecessary packages in runtime
#   - Health checks for orchestration
#
# ==============================================================================


# ==============================================================================
# STAGE 1: BUILDER
# ==============================================================================
# Purpose: Install build tools and compile Python dependencies
# This stage is discarded after build - only the virtual environment is kept
# ==============================================================================

# Base image for building
# DHI Migration: Replace with dhi.io/python:3.12-debian13-dev after authentication
FROM python:3.11-slim-bookworm AS builder

# OCI Labels - Standard metadata for container registries
LABEL org.opencontainers.image.title="Function Visualiser Backend"
LABEL org.opencontainers.image.description="FastAPI backend for mathematical computation and AI tutoring"
LABEL org.opencontainers.image.version="3.0.0"
LABEL org.opencontainers.image.authors="NAS Team"
LABEL org.opencontainers.image.source="https://github.com/Adarsh-61"

# Set working directory for build operations
WORKDIR /build

# Install system build dependencies
# These are required to compile Python packages with C/Fortran extensions:
#   - build-essential: GCC compiler for C extensions
#   - gfortran: Fortran compiler for NumPy/SciPy BLAS/LAPACK bindings
#   - libblas-dev, liblapack-dev: Linear algebra libraries for NumPy
# Note: These are NOT copied to the runtime stage (multi-stage optimization)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gfortran \
    libblas-dev \
    liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

# Create isolated virtual environment
# Using /opt/venv ensures clean separation from system Python
RUN python -m venv /opt/venv

# Add virtual environment to PATH so pip installs packages there
ENV PATH="/opt/venv/bin:$PATH"

# Copy only requirements.txt first (Docker layer caching optimization)
# Changes to source code won't invalidate the dependency cache
COPY requirements.txt .

# Install Python dependencies into the virtual environment
# --no-cache-dir: Reduces image size by not caching pip downloads
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


# ==============================================================================
# STAGE 2: RUNTIME
# ==============================================================================
# Purpose: Minimal production image with only runtime dependencies
# This is the final image that gets deployed
# ==============================================================================

# Base image for runtime (same OS as builder for binary compatibility)
# DHI Migration: Replace with dhi.io/python:3.12-debian13 after authentication
# Note: When using DHI, remove the user creation steps below (DHI runs as nonroot)
FROM python:3.11-slim-bookworm AS runtime

# Set working directory for the application
WORKDIR /app

# Environment variables for Python optimization
# PYTHONUNBUFFERED=1: Ensures logs appear immediately (important for Docker)
# PYTHONDONTWRITEBYTECODE=1: Prevents .pyc files (read-only filesystem compatible)
# PATH: Include virtual environment binaries
# PORT: Application port (configurable)
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/opt/venv/bin:$PATH" \
    PORT=8000

# Install runtime libraries required by compiled Python packages
# These are the runtime counterparts to build-time libraries:
#   - libgfortran5: Fortran runtime library for NumPy
#   - libopenblas0: Optimized BLAS implementation for linear algebra
# Note: Much smaller than build-time dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgfortran5 \
    libopenblas0 \
    && rm -rf /var/lib/apt/lists/*

# Security: Create non-privileged user
# UID 10001 is commonly used for container applications
# When migrating to DHI: Remove these lines (DHI images have built-in nonroot user)
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /bin/false appuser

# Copy virtual environment from builder stage
# This contains all installed Python packages
COPY --from=builder /opt/venv /opt/venv

# Copy application source code with correct ownership
# --chown ensures appuser can read the files
COPY --chown=appuser:appgroup . .

# Security: Switch to non-privileged user for runtime
# All subsequent commands and the final CMD run as this user
USER appuser

# Health check for container orchestration
# Docker and Kubernetes use this to determine container health
# Uses Python's urllib since curl is not installed (minimal image)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Document the port the application listens on
EXPOSE 8000

# Start the FastAPI application with Uvicorn ASGI server
# --host 0.0.0.0: Listen on all interfaces (required for Docker networking)
# --port 8000: Match the EXPOSE and environment variable
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
