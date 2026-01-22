# syntax=docker/dockerfile:1

# ==============================================================================
# FUNCTION VISUALIZER - FRONTEND DOCKERFILE
# ==============================================================================
#
# This Dockerfile creates a production-ready Next.js container using a
# multi-stage build pattern. Next.js "standalone" output mode produces a
# self-contained server that doesn't require node_modules at runtime.
#
# Architecture:
#   Stage 1 (Builder): Installs dependencies and builds the Next.js application
#   Stage 2 (Runtime): Minimal image with only the standalone build output
#
# Base Images:
#   Current:   node:20-alpine (Official Docker Hub)
#   DHI Ready: dhi.io/node:20-alpine3.22-dev (Docker Hardened Images)
#
# Security Features:
#   - Non-root user (appuser:10001)
#   - Read-only filesystem compatible (see docker-compose.yml)
#   - Minimal runtime (no npm, no node_modules)
#   - Health checks for orchestration
#
# Prerequisites:
#   - next.config.js must have: output: 'standalone'
#   - frontend/public folder must exist (even if empty)
#
# ==============================================================================


# ==============================================================================
# STAGE 1: BUILDER
# ==============================================================================
# Purpose: Install dependencies and build the Next.js application
# This stage is discarded after build - only the standalone output is kept
# ==============================================================================

# Base image for building (Alpine for smaller size)
# DHI Migration: Replace with dhi.io/node:20-alpine3.22-dev after authentication
FROM node:20-alpine AS builder

# OCI Labels - Standard metadata for container registries
LABEL org.opencontainers.image.title="Function Visualizer Frontend"
LABEL org.opencontainers.image.description="Next.js frontend for interactive mathematics visualization"
LABEL org.opencontainers.image.version="3.0.0"
LABEL org.opencontainers.image.authors="NAS Team"
LABEL org.opencontainers.image.source="https://github.com/Adarsh-61"

# Set working directory for build operations
WORKDIR /app

# Install system dependencies required for building
# Alpine uses apk instead of apt-get:
#   - libc6-compat: Required for Next.js SWC compiler (Rust-based)
#   - python3, make, g++: Required for node-gyp to compile native modules
# Note: These are NOT copied to the runtime stage
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files first (Docker layer caching optimization)
# Changes to source code won't invalidate the npm install cache
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
# --legacy-peer-deps: Resolves peer dependency conflicts that may occur
#   when package-lock.json was generated on Windows but built on Linux
# Note: This is a common fix for cross-platform npm issues
RUN npm install --legacy-peer-deps

# Copy all source code and configuration files
COPY . .

# Build the Next.js application in standalone mode
# This produces a self-contained server in .next/standalone
# The standalone build includes only the necessary node_modules
RUN npm run build


# ==============================================================================
# STAGE 2: RUNTIME
# ==============================================================================
# Purpose: Minimal production image with only the standalone build
# This is the final image that gets deployed
# ==============================================================================

# Base image for runtime (same as builder for compatibility)
# DHI Migration: Replace with dhi.io/node:20-alpine3.22 after authentication
# Note: When using DHI, remove the user creation steps below (DHI runs as nonroot)
FROM node:20-alpine AS runtime

# Set working directory for the application
WORKDIR /app

# Environment variables for production
# NODE_ENV=production: Enables production optimizations in Node.js
# PORT=3000: Application port (configurable)
ENV NODE_ENV=production \
    PORT=3000

# Security: Create non-privileged user
# Alpine uses addgroup/adduser instead of groupadd/useradd
# UID 10001 is commonly used for container applications
# When migrating to DHI: Remove these lines (DHI images have built-in nonroot user)
RUN addgroup -g 10001 -S appgroup && \
    adduser -S -u 10001 -g appgroup appuser

# Copy standalone build artifacts from builder stage
# Next.js standalone mode produces three important directories:
#   1. public/: Static assets (images, fonts, etc.)
#   2. .next/static/: Compiled static files (JS, CSS)
#   3. .next/standalone/: Self-contained Node.js server with bundled dependencies
# --chown ensures appuser can read the files
COPY --from=builder --chown=appuser:appgroup /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./

# Security: Switch to non-privileged user for runtime
# All subsequent commands and the final CMD run as this user
USER appuser

# Health check for container orchestration
# Docker and Kubernetes use this to determine container health
# Uses wget since it's available in Alpine (curl is not)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Document the port the application listens on
EXPOSE 3000

# Start the Next.js standalone server
# The standalone build produces a server.js file in the root
# This is a minimal Node.js server that serves the Next.js application
CMD ["node", "server.js"]
