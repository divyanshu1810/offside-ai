/**
 * News Service — Offside AI
 * Fetches latest football news from the backend (BBC Sport RSS).
 */

import { API_FOOTBALL } from '@/constants/api';
import { LOCAL_BACKEND_URL } from '@/constants/api';

const BACKEND_URL = LOCAL_BACKEND_URL;

export interface NewsArticle {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  image: string | null;
  source: string;
}

export async function getFootballNews(): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/news`);
    if (!res.ok) throw new Error(`News API ${res.status}`);
    const json = await res.json();
    return json.articles ?? [];
  } catch (err) {
    console.warn('[News]', err);
    return [];
  }
}
