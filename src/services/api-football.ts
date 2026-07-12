/**
 * API-Football Service — Offside AI
 * Wraps API-Football v3 endpoints with caching and mock fallback.
 * All calls go through the FastAPI backend proxy.
 */

import { API_FOOTBALL, CACHE_TTL, CURRENT_SEASON } from '@/constants/api';
import { cache } from './cache';
import {
  MOCK_LIVE_FIXTURES,
  MOCK_UPCOMING_FIXTURES,
  MOCK_FT_FIXTURES,
  MOCK_PLAYERS,
  type Fixture,
  type Player,
} from '@/data/mock';

const USE_MOCK = false;

// ─── Core Fetcher ───────────────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  params?: Record<string, string>,
  ttl: number = CACHE_TTL.FIXTURES
): Promise<T | null> {
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
    if (data) cache.set(cacheKey, data, ttl);
    return data;
  } catch (err) {
    console.warn('[API-Football]', err);
    return null;
  }
}

// ─── Helpers ────────────────────────────────────────────────────

function getDateString(offset: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0]!;
}

/**
 * Normalize an API-Football fixture response item into our Fixture shape.
 * The raw API returns nested objects; we flatten them.
 */
function normalizeFixture(raw: any): Fixture {
  return {
    id: raw.fixture?.id ?? raw.id,
    date: raw.fixture?.date ?? raw.date ?? '',
    timestamp: raw.fixture?.timestamp ?? raw.timestamp ?? 0,
    status: {
      short: raw.fixture?.status?.short ?? raw.status?.short ?? 'NS',
      long: raw.fixture?.status?.long ?? raw.status?.long ?? 'Not Started',
      elapsed: raw.fixture?.status?.elapsed ?? raw.status?.elapsed ?? null,
    },
    league: {
      id: raw.league?.id ?? 0,
      name: raw.league?.name ?? '',
      country: raw.league?.country ?? '',
      logo: raw.league?.logo ?? '',
      round: raw.league?.round ?? '',
    },
    teams: {
      home: {
        id: raw.teams?.home?.id ?? 0,
        name: raw.teams?.home?.name ?? '',
        shortName: raw.teams?.home?.name?.slice(0, 3)?.toUpperCase() ?? '',
        logo: raw.teams?.home?.logo ?? '',
        code: raw.teams?.home?.name?.slice(0, 3)?.toUpperCase() ?? '',
        winner: raw.teams?.home?.winner ?? null,
      },
      away: {
        id: raw.teams?.away?.id ?? 0,
        name: raw.teams?.away?.name ?? '',
        shortName: raw.teams?.away?.name?.slice(0, 3)?.toUpperCase() ?? '',
        logo: raw.teams?.away?.logo ?? '',
        code: raw.teams?.away?.name?.slice(0, 3)?.toUpperCase() ?? '',
        winner: raw.teams?.away?.winner ?? null,
      },
    },
    goals: {
      home: raw.goals?.home ?? null,
      away: raw.goals?.away ?? null,
    },
    score: {
      halftime: {
        home: raw.score?.halftime?.home ?? null,
        away: raw.score?.halftime?.away ?? null,
      },
      fulltime: {
        home: raw.score?.fulltime?.home ?? null,
        away: raw.score?.fulltime?.away ?? null,
      },
    },
  };
}

function normalizePlayer(raw: any, teamData?: any): Player {
  const stats = raw.statistics?.[0] ?? {};
  return {
    id: raw.player?.id ?? raw.id ?? 0,
    name: raw.player?.name ?? raw.name ?? '',
    firstName: raw.player?.firstname ?? raw.firstName ?? '',
    lastName: raw.player?.lastname ?? raw.lastName ?? '',
    age: raw.player?.age ?? raw.age ?? 0,
    nationality: raw.player?.nationality ?? raw.nationality ?? '',
    photo: raw.player?.photo ?? raw.photo ?? '',
    position: stats.games?.position ?? raw.position ?? '',
    number: raw.number ?? stats.games?.number ?? 0,
    team: {
      id: teamData?.team?.id ?? stats.team?.id ?? 0,
      name: teamData?.team?.name ?? stats.team?.name ?? '',
      shortName: (teamData?.team?.name ?? stats.team?.name ?? '').slice(0, 3).toUpperCase(),
      logo: teamData?.team?.logo ?? stats.team?.logo ?? '',
      code: (teamData?.team?.name ?? stats.team?.name ?? '').slice(0, 3).toUpperCase(),
    },
    stats: {
      appearances: stats.games?.appearences ?? 0,
      goals: stats.goals?.total ?? 0,
      assists: stats.goals?.assists ?? 0,
      xG: 0,
      minutes: stats.games?.minutes ?? 0,
      rating: parseFloat(stats.games?.rating ?? '0') || 0,
      pace: Math.round(Math.random() * 30 + 60),
      shooting: Math.round(Math.random() * 30 + 60),
      passing: Math.round(Math.random() * 30 + 60),
      dribbling: Math.round(Math.random() * 30 + 60),
      defending: Math.round(Math.random() * 30 + 60),
      physical: Math.round(Math.random() * 30 + 60),
    },
  };
}

const TRACKED_LEAGUES = [1, 2, 3, 39, 61, 78, 135, 140];

// ─── Public API ─────────────────────────────────────────────────

export async function getLiveFixtures(): Promise<Fixture[]> {
  const data = await apiFetch<any[]>(API_FOOTBALL.ENDPOINTS.FIXTURES_LIVE, undefined, CACHE_TTL.LIVE_SCORES);
  if (data && data.length > 0) {
    return data.map(normalizeFixture).filter(f => TRACKED_LEAGUES.includes(f.league.id));
  }
  return MOCK_LIVE_FIXTURES;
}

export async function getTodayFixtures(): Promise<Fixture[]> {
  return getFixturesByDate(0);
}

export async function getFixturesByDate(offset: number = 0): Promise<Fixture[]> {
  const date = getDateString(offset);
  const data = await apiFetch<any[]>(API_FOOTBALL.ENDPOINTS.FIXTURES, { date });
  if (data && data.length > 0) {
    return data.map(normalizeFixture).filter(f => TRACKED_LEAGUES.includes(f.league.id));
  }
  if (offset === 0) return [...MOCK_LIVE_FIXTURES, ...MOCK_UPCOMING_FIXTURES, ...MOCK_FT_FIXTURES];
  return [];
}

export async function getFixtureDetails(fixtureId: number): Promise<Fixture | null> {
  const data = await apiFetch<any[]>(API_FOOTBALL.ENDPOINTS.FIXTURES, {
    id: String(fixtureId),
  }, CACHE_TTL.MATCH_STATS);
  if (data && data.length > 0) return normalizeFixture(data[0]);

  // Mock fallback
  const all = [...MOCK_LIVE_FIXTURES, ...MOCK_UPCOMING_FIXTURES, ...MOCK_FT_FIXTURES];
  return all.find((f) => f.id === fixtureId) ?? null;
}

export async function getFixtureLineups(fixtureId: number): Promise<any | null> {
  const data = await apiFetch<any[]>(API_FOOTBALL.ENDPOINTS.LINEUPS, {
    fixture: String(fixtureId),
  }, CACHE_TTL.MATCH_STATS);
  return data ?? null;
}

export async function getFixtureEvents(fixtureId: number): Promise<any[] | null> {
  const data = await apiFetch<any[]>(API_FOOTBALL.ENDPOINTS.EVENTS, {
    fixture: String(fixtureId),
  }, CACHE_TTL.MATCH_STATS);
  return data ?? null;
}

export async function getFixtureStatistics(fixtureId: number): Promise<any[] | null> {
  const data = await apiFetch<any[]>(API_FOOTBALL.ENDPOINTS.STATISTICS, {
    fixture: String(fixtureId),
  }, CACHE_TTL.MATCH_STATS);
  return data ?? null;
}

export async function getPredictions(fixtureId: number): Promise<any | null> {
  const data = await apiFetch<any[]>(API_FOOTBALL.ENDPOINTS.PREDICTIONS, {
    fixture: String(fixtureId),
  }, CACHE_TTL.PREDICTIONS);
  if (data && data.length > 0) {
    const pred = data[0];
    return {
      homeWin: parseInt(pred.predictions?.percent?.home ?? '0'),
      draw: parseInt(pred.predictions?.percent?.draw ?? '0'),
      awayWin: parseInt(pred.predictions?.percent?.away ?? '0'),
      advice: pred.predictions?.advice ?? '',
    };
  }
  return null;
}

export async function getPlayersList(): Promise<Player[]> {
  if (!USE_MOCK) {
    const data = await apiFetch<any[]>(API_FOOTBALL.ENDPOINTS.TOP_SCORERS, {
      league: '39',
      season: '2024',
    }, CACHE_TTL.PLAYER_STATS);
    if (data && data.length > 0) {
      return data.slice(0, 10).map((item) => normalizePlayer(item));
    }
  }
  return MOCK_PLAYERS;
}

export async function searchPlayers(query: string): Promise<Player[]> {
  // Try real API first
  if (!USE_MOCK && query.length >= 3) {
    const leaguesToSearch = [
      API_FOOTBALL.LEAGUES.PREMIER_LEAGUE,
      API_FOOTBALL.LEAGUES.LA_LIGA,
      API_FOOTBALL.LEAGUES.BUNDESLIGA,
      API_FOOTBALL.LEAGUES.SERIE_A,
      API_FOOTBALL.LEAGUES.LIGUE_1,
    ];

    const promises = leaguesToSearch.map(leagueId => 
      apiFetch<any[]>(API_FOOTBALL.ENDPOINTS.PLAYERS, {
        search: query,
        league: String(leagueId),
        season: '2024',
      }, CACHE_TTL.PLAYER_STATS)
    );

    const results = await Promise.all(promises);
    
    // Flatten and normalize results from all leagues
    let allPlayers: Player[] = [];
    results.forEach(data => {
      if (data && data.length > 0) {
        allPlayers = allPlayers.concat(data.map((item) => normalizePlayer(item)));
      }
    });

    if (allPlayers.length > 0) {
      return allPlayers;
    }
  }

  // Fallback to local mock search
  const players = MOCK_PLAYERS;
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
  // Try real predictions first
  const realPred = await getPredictions(fixtureId);
  if (realPred) return realPred;

  // Fallback
  const fixture = await getFixtureDetails(fixtureId);
  return fixture?.prediction ?? null;
}
