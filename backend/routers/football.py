from fastapi import APIRouter, Request, HTTPException
import httpx
from config import (
    API_FOOTBALL_BASE_URL,
    API_FOOTBALL_KEY,
    THE_SPORTS_DB_BASE_URL,
    THE_SPORTS_DB_KEY,
    FPL_BASE_URL
)

router = APIRouter()

@router.get("/api/football/{endpoint:path}")
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

@router.get("/api/sportsdb/{endpoint:path}")
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

@router.get("/api/fpl/{endpoint:path}")
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
