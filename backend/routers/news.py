from fastapi import APIRouter, HTTPException
import httpx
import feedparser
from bs4 import BeautifulSoup
from config import BBC_FOOTBALL_RSS

router = APIRouter()

@router.get("/api/news")
async def get_football_news():
    """Fetches latest football news from BBC Sport Football RSS feed."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(BBC_FOOTBALL_RSS, timeout=10.0)
            response.raise_for_status()

        feed = feedparser.parse(response.text)
        articles = []

        for entry in feed.entries[:25]:
            # Extract image from media:thumbnail if available
            image = None
            if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
                image = entry.media_thumbnail[0].get('url', None)
            elif hasattr(entry, 'media_content') and entry.media_content:
                image = entry.media_content[0].get('url', None)

            # Clean HTML from description
            description = ""
            if hasattr(entry, 'summary') and entry.summary:
                soup = BeautifulSoup(entry.summary, 'html.parser')
                description = soup.get_text(strip=True)

            articles.append({
                "title": entry.get("title", ""),
                "description": description,
                "link": entry.get("link", ""),
                "pubDate": entry.get("published", ""),
                "image": image,
                "source": "BBC Sport",
            })

        return {"articles": articles}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
