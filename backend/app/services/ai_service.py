"""
AI Service - Dual-mode AI Provider with Auto-switching.

Provides abstraction layer for online (OpenRouter) and offline (Ollama) AI.
"""

from abc import ABC, abstractmethod
from typing import AsyncGenerator, List, Optional
import asyncio
import logging

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class Message:
    """Chat message structure."""
    def __init__(self, role: str, content: str):
        self.role = role  # "user", "assistant", "system"
        self.content = content
    
    def to_dict(self):
        return {"role": self.role, "content": self.content}


class AIProvider(ABC):
    """Abstract base class for AI providers."""
    
    @abstractmethod
    async def chat(self, messages: List[Message], stream: bool = False) -> str:
        """Send chat request and get response."""
        pass
    
    @abstractmethod
    async def chat_stream(self, messages: List[Message]) -> AsyncGenerator[str, None]:
        """Stream chat response token by token."""
        pass
    
    @abstractmethod
    async def is_available(self) -> bool:
        """Check if this provider is currently available."""
        pass


class OpenRouterProvider(AIProvider):
    """OpenRouter API provider for online AI."""
    
    def __init__(self):
        self.api_key = settings.openrouter_api_key
        self.model = settings.openrouter_model
        self.base_url = settings.openrouter_base_url
        self.timeout = 60.0
    
    async def is_available(self) -> bool:
        """Check if OpenRouter is available (has API key and can connect)."""
        if not self.api_key or self.api_key == "your_openrouter_api_key_here":
            logger.warning("OpenRouter API Key is missing or default. Check .env file.")
            return False
        
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(
                    f"{self.base_url}/models",
                    headers={"Authorization": f"Bearer {self.api_key}"}
                )
                return response.status_code == 200
        except Exception as e:
            logger.warning(f"OpenRouter availability check failed: {e}")
            return False
    
    async def chat(self, messages: List[Message], stream: bool = False) -> str:
        """Send chat request to OpenRouter."""
        if not self.api_key:
            raise ValueError("OpenRouter API key not configured")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://function-visualiser.app",
            "X-Title": "Function Visualiser",
        }
        
        payload = {
            "model": self.model,
            "messages": [m.to_dict() for m in messages],
            "stream": False,
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
    
    async def chat_stream(self, messages: List[Message]) -> AsyncGenerator[str, None]:
        """Stream chat response from OpenRouter."""
        if not self.api_key:
            raise ValueError("OpenRouter API key not configured")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://function-visualiser.app",
            "X-Title": "Function Visualiser",
        }
        
        payload = {
            "model": self.model,
            "messages": [m.to_dict() for m in messages],
            "stream": True,
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
            ) as response:
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]
                        if data == "[DONE]":
                            break
                        try:
                            import json
                            chunk = json.loads(data)
                            delta = chunk.get("choices", [{}])[0].get("delta", {})
                            content = delta.get("content", "")
                            if content:
                                yield content
                        except Exception:
                            continue


class OllamaProvider(AIProvider):
    """Ollama provider for offline/local AI."""
    
    def __init__(self):
        self.base_url = settings.ollama_base_url
        self.model = settings.ollama_model
        self.timeout = 300.0  # 5 minutes for long responses
    
    async def is_available(self) -> bool:
        """Check if Ollama is running and accessible."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                return response.status_code == 200
        except Exception as e:
            logger.warning(f"Ollama availability check failed: {e}")
            return False
    
    async def chat(self, messages: List[Message], stream: bool = False) -> str:
        """Send chat request to Ollama."""
        payload = {
            "model": self.model,
            "messages": [m.to_dict() for m in messages],
            "stream": False,
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/api/chat",
                json=payload,
            )
            response.raise_for_status()
            data = response.json()
            return data.get("message", {}).get("content", "")
    
    async def chat_stream(self, messages: List[Message]) -> AsyncGenerator[str, None]:
        """Stream chat response from Ollama."""
        payload = {
            "model": self.model,
            "messages": [m.to_dict() for m in messages],
            "stream": True,
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/api/chat",
                json=payload,
            ) as response:
                async for line in response.aiter_lines():
                    if line:
                        try:
                            import json
                            chunk = json.loads(line)
                            content = chunk.get("message", {}).get("content", "")
                            if content:
                                logger.debug(f"Ollama chunk: {repr(content)}")
                                yield content
                            if chunk.get("done", False):
                                break
                        except Exception:
                            continue


class AIService:
    """
    Main AI service with dual-mode support and auto-switching.
    
    Modes:
    - "online": Always use OpenRouter
    - "offline": Always use Ollama
    - "auto": Try OpenRouter first, fallback to Ollama
    """
    
    def __init__(self):
        self.openrouter = OpenRouterProvider()
        self.ollama = OllamaProvider()
        self.mode = settings.ai_mode
        self._current_provider: Optional[str] = None
    
    async def get_active_provider(self) -> AIProvider:
        """Get the appropriate provider based on mode and availability."""
        if self.mode == "online":
            if await self.openrouter.is_available():
                self._current_provider = "openrouter"
                return self.openrouter
            raise RuntimeError("OpenRouter is not available (check API key)")
        
        elif self.mode == "offline":
            if await self.ollama.is_available():
                self._current_provider = "ollama"
                return self.ollama
            raise RuntimeError("Ollama is not available (is it running?)")
        
        else:  # auto mode
            if await self.openrouter.is_available():
                self._current_provider = "openrouter"
                return self.openrouter
            
            if await self.ollama.is_available():
                self._current_provider = "ollama"
                logger.info("Falling back to Ollama (OpenRouter unavailable)")
                return self.ollama
            
            raise RuntimeError("No AI provider available")
    
    @property
    def current_provider_name(self) -> Optional[str]:
        """Get the name of the currently active provider."""
        return self._current_provider
    
    async def chat(self, messages: List[Message]) -> str:
        """Send a chat request using the appropriate provider."""
        provider = await self.get_active_provider()
        return await provider.chat(messages)
    
    async def chat_stream(self, messages: List[Message]) -> AsyncGenerator[str, None]:
        """Stream a chat response using the appropriate provider."""
        provider = await self.get_active_provider()
        async for chunk in provider.chat_stream(messages):
            yield chunk
    
    async def get_status(self) -> dict:
        """Get current AI service status."""
        openrouter_available = await self.openrouter.is_available()
        ollama_available = await self.ollama.is_available()
        
        return {
            "mode": self.mode,
            "current_provider": self._current_provider,
            "openrouter": {
                "available": openrouter_available,
                "model": self.openrouter.model if openrouter_available else None,
            },
            "ollama": {
                "available": ollama_available,
                "model": self.ollama.model if ollama_available else None,
            },
        }


# Global AI service instance
ai_service = AIService()


def get_ai_service() -> AIService:
    """Get the global AI service instance."""
    return ai_service
