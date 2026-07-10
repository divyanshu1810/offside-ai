/**
 * API-Football Service — Offside AI
 * Wraps API-Football v3 endpoints with caching and mock fallback.
 */

import { API_FOOTBALL, CACHE_TTL } from '@/constants/api';
import { cache } from './cache';
import {
  MOCK_LIVE_FIXTURES,
  MOCK_UPCOMING_FIXTURES,
  MOCK_FT_FIXTURES,
  MOCK_PLAYERS,
  type Fixture,
  type Player,
} from '@/data/mock';

const USE_MOCK = true; // Set false when you have a valid API key

async function apiFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  if (USE_MOCK) return null;

  const url = new URL(`${API_FOOTBALL.BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const cacheKey = url.toString();
  const cached = cache.get<T>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`API-Football ${res.status}`);
    const json = await res.json();
    const data = json.response as T;
    cache.set(cacheKey, data, CACHE_TTL.FIXTURES);
    return data;
  } catch (err) {
    console.warn('[API-Football]', err);
    return null;
  }
}

// ─── Public API ─────────────────────────────────────────────────

export async function getLiveFixtures(): Promise<Fixture[]> {
  const data = await apiFetch<Fixture[]>(API_FOOTBALL.ENDPOINTS.FIXTURES_LIVE);
  return data ?? MOCK_LIVE_FIXTURES;
}

export async function getTodayFixtures(): Promise<Fixture[]> {
  const today = new Date().toISOString().split('T')[0];
  const data = await apiFetch<Fixture[]>(API_FOOTBALL.ENDPOINTS.FIXTURES, { date: today! });
  if (data) return data;
  return [...MOCK_LIVE_FIXTURES, ...MOCK_UPCOMING_FIXTURES, ...MOCK_FT_FIXTURES];
}

export async function getFixtureDetails(fixtureId: number): Promise<Fixture | null> {
  const data = await apiFetch<Fixture[]>(API_FOOTBALL.ENDPOINTS.FIXTURES, {
    id: String(fixtureId),
  });
  if (data && data.length > 0) return data[0]!;

  // Mock fallback
  const all = [...MOCK_LIVE_FIXTURES, ...MOCK_UPCOMING_FIXTURES, ...MOCK_FT_FIXTURES];
  return all.find((f) => f.id === fixtureId) ?? null;
}

export async function getPlayersList(): Promise<Player[]> {
  // For mock mode, return our curated player list
  return MOCK_PLAYERS;
}

export async function searchPlayers(query: string): Promise<Player[]> {
  const players = await getPlayersList();
  const q = query.toLowerCase();
  return players.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.team.name.toLowerCase().includes(q)
  );
}

export async function getMatchPrediction(fixtureId: number): Promise<Fixture['prediction'] | null> {
  const fixture = await getFixtureDetails(fixtureId);
  return fixture?.prediction ?? null;
}
