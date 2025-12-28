"""
Chat API Endpoints

Provides REST and WebSocket API for AI chat functionality.
"""

import json
from typing import List, Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel, Field

from app.services.ai_service import AIService, Message, get_ai_service

router = APIRouter()


class ChatMessage(BaseModel):
    """Chat message model."""
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    """Request for chat completion."""
    messages: List[ChatMessage] = Field(..., description="Conversation messages")
    system_prompt: Optional[str] = Field(
        "You are a helpful mathematical assistant. You help students understand mathematical concepts, solve problems step by step, and explain solutions clearly. Use LaTeX notation for mathematical expressions when appropriate.",
        description="System prompt for the AI"
    )


class ChatResponse(BaseModel):
    """Response from chat completion."""
    content: str
    provider: str
    status: str = "ok"


# Math-specific system prompt
MATH_SYSTEM_PROMPT = """You are an expert mathematical tutor and problem solver. Your role is to:

1. **Explain Concepts Clearly**: Break down complex mathematical ideas into understandable parts.
2. **Solve Step by Step**: Show all work with clear, numbered steps.
3. **Use Proper Notation**: Use LaTeX for mathematical expressions (e.g., $x^2$, $\\frac{a}{b}$, $\\int_0^1 f(x)dx$).
4. **Provide Multiple Approaches**: When possible, show different methods to solve problems.
5. **Check Your Work**: Verify solutions and explain how to verify.
6. **Encourage Understanding**: Don't just give answers—help the student understand WHY.

Topics you excel in:
- Calculus (limits, derivatives, integrals, differential equations)
- Algebra (equations, inequalities, functions, polynomials)
- Geometry (coordinate geometry, shapes, transformations)
- Trigonometry (identities, equations, graphs)
- Linear Algebra (matrices, vectors, eigenvalues)
- Statistics and Probability

Always be encouraging and patient. If a question is unclear, ask for clarification.
"""


@router.post("/message", response_model=ChatResponse)
async def chat_message(request: ChatRequest):
    """
    Send a chat message and receive a response.
    
    This is a non-streaming endpoint for simple request/response chat.
    """
    try:
        ai_service = get_ai_service()
        
        # Build messages list with system prompt
        messages = [Message("system", request.system_prompt or MATH_SYSTEM_PROMPT)]
        for msg in request.messages:
            messages.append(Message(msg.role, msg.content))
        
        # Get response
        response_content = await ai_service.chat(messages)
        
        return ChatResponse(
            content=response_content,
            provider=ai_service.current_provider_name or "unknown",
            status="ok"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def get_ai_status():
    """
    Get current AI service status including available providers.
    """
    ai_service = get_ai_service()
    return await ai_service.get_status()


@router.websocket("/stream")
async def chat_stream(websocket: WebSocket):
    """
    WebSocket endpoint for streaming chat responses.
    
    Protocol:
    1. Client sends JSON: {"messages": [...], "system_prompt": "..."}
    2. Server streams response tokens as plain text
    3. Server sends "[DONE]" when complete
    4. On error, server sends JSON: {"error": "message"}
    """
    await websocket.accept()
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            
            try:
                request_data = json.loads(data)
                
                # Extract messages
                raw_messages = request_data.get("messages", [])
                system_prompt = request_data.get("system_prompt", MATH_SYSTEM_PROMPT)
                
                # Build message list
                messages = [Message("system", system_prompt)]
                for msg in raw_messages:
                    messages.append(Message(msg.get("role", "user"), msg.get("content", "")))
                
                # Get AI service and stream response
                ai_service = get_ai_service()
                
                # Send provider info
                await websocket.send_text(json.dumps({
                    "type": "info",
                    "provider": ai_service.current_provider_name or "unknown"
                }))
                
                # Stream the response
                async for chunk in ai_service.chat_stream(messages):
                    await websocket.send_text(json.dumps({
                        "type": "token",
                        "content": chunk
                    }))
                
                # Signal completion
                await websocket.send_text(json.dumps({
                    "type": "done"
                }))
                
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({"error": "Invalid JSON"}))
            except Exception as e:
                await websocket.send_text(json.dumps({"error": str(e)}))
    
    except WebSocketDisconnect:
        pass  # Client disconnected normally


@router.post("/solve")
async def solve_math_problem(problem: str = ""):
    """
    Specialized endpoint for solving math problems.
    
    Adds specific instructions for showing work and using LaTeX.
    """
    if not problem.strip():
        raise HTTPException(status_code=400, detail="Problem cannot be empty")
    
    try:
        ai_service = get_ai_service()
        
        solve_prompt = f"""Please solve the following mathematical problem step by step:

**Problem:**
{problem}

**Instructions:**
1. Show all work clearly
2. Number your steps
3. Use LaTeX notation for math (e.g., $x^2$, $\\frac{{a}}{{b}}$)
4. Explain your reasoning at each step
5. Provide the final answer clearly marked
6. If applicable, show how to verify the answer

**Solution:**"""
        
        messages = [
            Message("system", MATH_SYSTEM_PROMPT),
            Message("user", solve_prompt)
        ]
        
        response = await ai_service.chat(messages)
        
        return {
            "status": "ok",
            "problem": problem,
            "solution": response,
            "provider": ai_service.current_provider_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
