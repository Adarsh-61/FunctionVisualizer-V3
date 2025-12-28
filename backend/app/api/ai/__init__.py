"""AI API Router - Aggregates all AI-related endpoints."""

from fastapi import APIRouter

from app.api.ai.chat import router as chat_router

router = APIRouter()

# Include AI sub-routers
router.include_router(chat_router, prefix="/chat", tags=["Chat"])
