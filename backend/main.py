import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import httpx

load_dotenv()

app = FastAPI(title="Offside AI Backend")

# Allow all CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_FOOTBALL_KEY = os.getenv("API_FOOTBALL_KEY")
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

API_FOOTBALL_BASE_URL = "https://v3.football.api-sports.io"
COHERE_BASE_URL = "https://api.cohere.com/v2"

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Offside AI Backend is running"}

@app.get("/api/football/{endpoint:path}")
async def proxy_api_football(endpoint: str, request: Request):
    """
    Transparently proxies GET requests to API-Football, injecting the API key.
    """
    if not API_FOOTBALL_KEY:
        raise HTTPException(status_code=500, detail="API_FOOTBALL_KEY not configured")

    url = f"{API_FOOTBALL_BASE_URL}/{endpoint}"
    params = dict(request.query_params)
    headers = {
        "x-apisports-key": API_FOOTBALL_KEY,
        "Accept": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

SYSTEM_PROMPTS = {
    "tactical": "You are Coach AI, an elite football tactical analyst embedded in the Offside AI app.\nYou speak with authority and insight like a top pundit — think Gary Neville meets Pep Guardiola.\nWhen analyzing matches, focus on:\n- Pressing triggers and defensive shape\n- Build-up play patterns and passing networks\n- Key player movements and positional play\n- Set piece threats and aerial dominance\n- Tactical adjustments and substitution impact\nFormat your responses with bullet points using ✓ for key insights. Keep responses concise but insightful.\nUse football terminology naturally but explain when needed.",
    "eli10": "You are a friendly football expert explaining things to a 10-year-old fan.\nUse simple language, fun analogies, and enthusiasm. Compare football concepts to playground games or video games.\nDo not use emoji characters. Keep explanations short and exciting.\nExample: \"Offside is like in tag — you can't just stand near the goal waiting! You have to be behind the last defender when your friend passes the ball.\"",
    "fantasy": "You are a Fantasy Premier League expert and data analyst.\nWhen giving FPL advice:\n- Consider form, fixtures, and expected points\n- Suggest differential picks that others might miss\n- Explain your reasoning with stats\n- Mention captain picks and transfer suggestions\n- Consider budget and value\nFormat as actionable recommendations with confidence levels.",
    "predictor": "You are a football match prediction engine.\nWhen given match context (teams, form, stats, injuries), provide:\n- Win probability for each outcome (home/draw/away)\n- Key factors influencing the prediction\n- Potential scoreline prediction\n- One \"wildcard\" factor that could change everything\nBe confident but acknowledge uncertainty. Use percentages and data points.",
    "general": "You are Coach AI, the intelligent assistant inside Offside AI — a premium football companion app.\nYou can discuss any football topic: tactics, history, transfers, rules, players, leagues.\nBe knowledgeable, engaging, and slightly opinionated like a great football pundit.\nKeep responses concise — max 3-4 short paragraphs. Use bullet points for lists.",
}

@app.post("/api/ai/chat")
async def proxy_cohere_chat(request: Request):
    """
    Handles AI chat requests from the app.
    Constructs the Cohere payload and system prompt securely on the backend.
    """
    if not COHERE_API_KEY:
        raise HTTPException(status_code=500, detail="COHERE_API_KEY not configured")

    body = await request.json()
    messages = body.get("messages", [])
    mode = body.get("mode", "general")
    match_context = body.get("matchContext", "")

    system_prompt = SYSTEM_PROMPTS.get(mode, SYSTEM_PROMPTS["general"])
    if match_context:
        system_prompt += f"\n\nCurrent match context:\n{match_context}"

    cohere_payload = {
        "model": "command-r-plus-08-2024",
        "messages": [
            {"role": "system", "content": system_prompt},
            *messages
        ]
    }

    url = f"{COHERE_BASE_URL}/chat"
    headers = {
        "Authorization": f"Bearer {COHERE_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=cohere_payload, headers=headers, timeout=30.0)
            response.raise_for_status()
            data = response.json()
            
            # Extract the actual text response to send back to the app
            text = data.get("message", {}).get("content", [{}])[0].get("text", "")
            return {"text": text}
            
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Cohere API error: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

THE_SPORTS_DB_BASE_URL = "https://www.thesportsdb.com/api/v1/json"
THE_SPORTS_DB_KEY = os.getenv("THE_SPORTS_DB_KEY", "3")

@app.get("/api/sportsdb/{endpoint:path}")
async def proxy_sportsdb(endpoint: str, request: Request):
    """Proxies GET requests to TheSportsDB"""
    url = f"{THE_SPORTS_DB_BASE_URL}/{THE_SPORTS_DB_KEY}/{endpoint}"
    params = dict(request.query_params)
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

FPL_BASE_URL = "https://fantasy.premierleague.com/api"

@app.get("/api/fpl/{endpoint:path}")
async def proxy_fpl(endpoint: str, request: Request):
    """Proxies GET requests to FPL API"""
    url = f"{FPL_BASE_URL}/{endpoint}"
    params = dict(request.query_params)
    
    async with httpx.AsyncClient() as client:
        try:
            # FPL sometimes requires a User-Agent
            headers = {"User-Agent": "Mozilla/5.0"}
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
