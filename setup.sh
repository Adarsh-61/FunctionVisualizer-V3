#!/bin/bash

# ==============================================================================
# Function Visualizer - Automated Deployment Script
# ==============================================================================
# This script builds and deploys the application using Docker Compose.
#
# Base Images (Official):
#   - Backend:  python:3.11-slim-bookworm
#   - Frontend: node:20-alpine
#
# DHI Migration:
#   To use Docker Hardened Images, run `docker login dhi.io` first,
#   then update the FROM instructions in the Dockerfiles.
# ==============================================================================

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}   Function Visualizer | Deployment Setup v3.0${NC}"
echo -e "${BLUE}======================================================${NC}"

# 1. Check Prerequisites
echo -e "\n${YELLOW}[1/4] Checking System Prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed.${NC}"
    echo "Please install Docker Desktop or Docker Engine before proceeding."
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not available.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose detected.${NC}"

# 2. Environment Configuration
echo -e "\n${YELLOW}[2/4] Configuring Environment...${NC}"

if [ ! -f .env ]; then
    echo -e "No .env file found. Creating one from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file.${NC}"
    echo -e "${YELLOW}IMPORTANT: Edit .env and set OPENROUTER_API_KEY for Cloud AI.${NC}"
    read -p "Press Enter to continue (or Ctrl+C to stop and edit .env)..."
else
    echo -e "${GREEN}✓ Existing .env file found.${NC}"
fi

# 3. Build Information
echo -e "\n${YELLOW}[3/4] Build Configuration...${NC}"
echo "Backend:  python:3.11-slim-bookworm"
echo "Frontend: node:20-alpine"
echo "Mode:     Official Docker Images (DHI-ready)"

# 4. Building and Launching
echo -e "\n${YELLOW}[4/4] Building and Launching Containers...${NC}"

# Stop existing containers if running
docker compose down --remove-orphans || true

# Build with no cache
docker compose build --no-cache

# Start in detached mode
docker compose up -d

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}   Deployment Successful! 🚀${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "Frontend:   http://localhost:3000"
echo -e "Backend:    http://localhost:8000"
echo -e "AI Mode:    Check your .env settings"
echo -e "\nTo view logs: docker compose logs -f"
