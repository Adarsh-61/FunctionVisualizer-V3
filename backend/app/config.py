"""
Function Visualiser Backend - Configuration Module

Handles all environment variables and application settings using Pydantic.
"""

from functools import lru_cache
from typing import List, Literal

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # API Configuration
    app_name: str = "Function Visualiser API"
    app_version: str = "3.0.0"
    debug: bool = False

    # Server Configuration
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://localhost:3002,http://127.0.0.1:3002"

    # AI Configuration
    ai_mode: Literal["online", "offline", "auto"] = "auto"
    
    # OpenRouter (Online AI)
    openrouter_api_key: str = ""
    openrouter_model: str = "deepseek/deepseek-r1-0528:free"
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    
    # Ollama (Offline AI)
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "gemma3n:e2b"

    # Computation Settings
    max_expression_length: int = 1000
    computation_timeout: float = 30.0
    default_plot_resolution: int = 500

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
