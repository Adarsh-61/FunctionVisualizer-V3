# Function Visualizer - Deployment Guide

This guide provides instructions for hosting and deploying **Function Visualizer v3**, utilizing **Docker Hardened Images (DHI)** for maximum security and performance.

---

## 📋 Prerequisites

Before you begin, ensure your hosting environment has:

1.  **Docker Engine** (v24.0+) or Docker Desktop being installed.
2.  **Git** installed.
3.  **2GB+ RAM** (Recommended for building and running both services).

---

## 🚀 Quick Start (Automated)

We have provided a unified setup script to automate the process.

### Linux / macOS
```bash
chmod +x setup.sh
./setup.sh
```

### Windows (PowerShell)
Manual steps are recommended for Windows unless using WSL2.
```powershell
# 1. Copy environment file
Copy-Item .env.example .env

# 2. Build and Run
docker compose build --no-cache
docker compose up -d
```

---

## 🛠️ Docker Hardened Images (DHI)

This deployment is configured to use **Docker Hardened Images** as the foundation.

| Service | Base Image | Features |
|:---|:---|:---|
| **Backend** | `dhi/python:3.11-slim-bookworm` | Minimal Debian base, Python 3.11 optimized |
| **Frontend** | `dhi/node:20-alpine` | Ultra-lightweight Alpine Linux, Node.js 20 |

**Security Benefits:**
*   Minimised attack surface (distroless principles).
*   Verified provenance.
*   Non-root user execution enforced (`appuser`).
*   Read-only filesystem configuration.

---

## ⚙️ Configuration

Check the `.env` file to configure your deployment:

```ini
# AI Mode (offline, online, auto)
AI_MODE=auto

# Keys (Required for 'online' or 'auto' mode)
OPENROUTER_API_KEY=sk-or-v1-...

# Host Settings
PORT=3000
```

---

## ☁️ Hosting on Common Providers

### DigitalOcean / Vultr / Linode (VPS)
1.  Create a Droplet/Instance (Ubuntu 22.04 LTS or Docker image).
2.  SSH into the server.
3.  Git clone this repository.
4.  Run `./setup.sh`.

### AWS EC2
1.  Launch an Amazon Linux 2023 or Ubuntu instance.
2.  Install Docker (`sudo yum install docker` or `sudo apt install docker.io`).
3.  Start Docker service.
4.  Git clone and run `./setup.sh`.

### Render / Railway (PaaS)
*   **Warning**: DHI images require a Docker runtime key. Ensure your PaaS supports pulling from the configured public usage of DHI.
*   Connect your GitHub repository.
*   Set Environment Variables in the PaaS dashboard.
*   Command: `docker compose up` (or configure services individually).

---

## 🔍 Troubleshooting

**"Pull access denied for dhi/python..."**
*   Ensure you have internet access. DHI images are now public.
*   If you are behind a corporate proxy, check your firewall.

**"Ollama connection failed"**
*   If running in `offline` mode, ensure Ollama is running on the host.
*   In Docker, you may need to set `OLLAMA_HOST=http://host.docker.internal:11434` (Windows/Mac) or `http://172.17.0.1:11434` (Linux).

---

**Function Visualizer Team**
*Secure, Fast, and Open Source.*
