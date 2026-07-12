from fastapi import APIRouter, Request, HTTPException
from langchain_cohere import ChatCohere
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from config import COHERE_API_KEY, SYSTEM_PROMPTS

router = APIRouter()

@router.post("/api/ai/chat")
async def proxy_cohere_chat(request: Request):
    """
    Handles AI chat requests from the app.
    Constructs the Cohere payload and system prompt securely on the backend using LangChain.
    """
    if not COHERE_API_KEY:
        raise HTTPException(status_code=500, detail="COHERE_API_KEY not configured")

    body = await request.json()
    messages_in = body.get("messages", [])
    mode = body.get("mode", "general")
    match_context = body.get("matchContext", "")

    system_prompt = SYSTEM_PROMPTS.get(mode, SYSTEM_PROMPTS["general"])
    if match_context:
        system_prompt += f"\n\nCurrent match context:\n{match_context}"

    # Convert frontend messages to LangChain message types
    langchain_messages = [SystemMessage(content=system_prompt)]
    for msg in messages_in:
        role = msg.get("role")
        content = msg.get("content", "")
        if role == "user":
            langchain_messages.append(HumanMessage(content=content))
        elif role == "assistant":
            langchain_messages.append(AIMessage(content=content))
        elif role == "system":
            langchain_messages.append(SystemMessage(content=content))
            
    try:
        # Initialize LangChain ChatCohere with the model
        chat = ChatCohere(
            model="command-r-plus-08-2024", 
            cohere_api_key=COHERE_API_KEY
        )
        
        # Invoke the model asynchronously
        response = await chat.ainvoke(langchain_messages)
        content = response.content
        
        # LangChain Cohere sometimes returns a list of content blocks
        if isinstance(content, list):
            text_parts = []
            for block in content:
                if isinstance(block, dict) and "text" in block:
                    text_parts.append(block["text"])
                elif isinstance(block, str):
                    text_parts.append(block)
            content = "\n".join(text_parts)
        elif isinstance(content, dict):
            content = content.get("text", str(content))
            
        return {"text": content}
        
    except Exception as e:
        if "422" in str(e) or "NO_VALID_RESPONSE" in str(e):
            return {"text": "Coach AI here! I don't have enough data to generate tactical insights for this specific match yet. Check back during or after the game."}
        raise HTTPException(status_code=500, detail=str(e))
