/**
 * API Configuration — Offside AI
 * All external API endpoints, keys, and cache TTL values.
 */

import { Platform } from 'react-native';

const LOCAL_BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

// ─── API-Football (Proxied) ────────────────────────────────────
export const API_FOOTBALL = {
  BASE_URL: `${LOCAL_BACKEND_URL}/api/football`,
  ENDPOINTS: {
    FIXTURES: '/fixtures',
    FIXTURES_LIVE: '/fixtures?live=all',
    LINEUPS: '/fixtures/lineups',
    EVENTS: '/fixtures/events',
    STATISTICS: '/fixtures/statistics',
    PREDICTIONS: '/predictions',
    PLAYERS: '/players',
    PLAYER_STATS: '/players/statistics',
    TEAMS: '/teams',
    TEAM_STATS: '/teams/statistics',
    STANDINGS: '/standings',
    LEAGUES: '/leagues',
  },
  // Top leagues IDs
  LEAGUES: {
    PREMIER_LEAGUE: 39,
    LA_LIGA: 140,
    BUNDESLIGA: 78,
    SERIE_A: 135,
    LIGUE_1: 61,
    CHAMPIONS_LEAGUE: 2,
    EUROPA_LEAGUE: 3,
    WORLD_CUP: 1,
  },
} as const;

// ─── Cohere AI (Proxied) ──────────────────────────────────────────────────
export const COHERE_API = {
  BASE_URL: `${LOCAL_BACKEND_URL}/api/ai`,
  MODEL: 'command-r-plus-08-2024',
  ENDPOINTS: {
    CHAT: '/chat',
  },
} as const;

// ─── TheSportsDB (Proxied) ────────────────────────────────────────────────
export const THE_SPORTS_DB = {
  BASE_URL: `${LOCAL_BACKEND_URL}/api/sportsdb`,
} as const;

// ─── FPL API (Proxied) ────────────────────────────────────────────────────
export const FPL_API = {
  BASE_URL: `${LOCAL_BACKEND_URL}/api/fpl`,
  ENDPOINTS: {
    BOOTSTRAP: '/bootstrap-static/',
    ELEMENT_SUMMARY: '/element-summary/',
    FIXTURES: '/fixtures/',
    GAMEWEEK_LIVE: '/event/{gw}/live/',
  },
} as const;

// ─── Cache TTL (milliseconds) ───────────────────────────────────
export const CACHE_TTL = {
  LIVE_SCORES: 30 * 1000,       // 30 seconds
  FIXTURES: 5 * 60 * 1000,      // 5 minutes
  MATCH_STATS: 60 * 1000,       // 1 minute
  PLAYER_STATS: 60 * 60 * 1000, // 1 hour
  STANDINGS: 30 * 60 * 1000,    // 30 minutes
  PREDICTIONS: 60 * 60 * 1000,  // 1 hour
  TEAM_INFO: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// ─── Current Season ─────────────────────────────────────────────
export const CURRENT_SEASON = 2025;
