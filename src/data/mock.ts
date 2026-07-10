import { AppIcons, type AppIconName } from '@/constants/icons';

/**
 * Mock Data — Offside AI
 * Comprehensive mock data for development and API fallback.
 * Matches the API-Football response shape for easy swapping.
 */

// ─── Types ──────────────────────────────────────────────────────

export interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  code: string;
}

export interface MatchEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string };
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: 'Goal' | 'Card' | 'subst' | 'Var';
  detail: string;
  comments: string | null;
}

export interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
  offsides: [number, number];
  xG: [number, number];
  passes: [number, number];
  passAccuracy: [number, number];
}

export interface Player {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  age: number;
  nationality: string;
  photo: string;
  position: string;
  number: number;
  team: Team;
  stats: PlayerStats;
  grid?: string; // Grid position "1:1" format for lineups
}

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  xG: number;
  minutes: number;
  rating: number;
  // Extended stats for radar chart
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physical?: number;
}

export interface Fixture {
  id: number;
  date: string;
  timestamp: number;
  status: {
    short: 'LIVE' | 'FT' | 'NS' | 'HT' | '1H' | '2H' | 'ET' | 'PEN' | 'PST' | 'CANC';
    long: string;
    elapsed: number | null;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    round: string;
  };
  teams: {
    home: Team & { winner: boolean | null };
    away: Team & { winner: boolean | null };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
  };
  events?: MatchEvent[];
  statistics?: MatchStats;
  lineups?: {
    home: { formation: string; players: Player[] };
    away: { formation: string; players: Player[] };
  };
  prediction?: {
    homeWin: number;
    draw: number;
    awayWin: number;
    advice: string;
  };
}

export interface LeagueStanding {
  rank: number;
  team: Team;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  form: string; // "WWDLW"
}

// ─── Mock Teams ─────────────────────────────────────────────────

export const MOCK_TEAMS: Record<string, Team> = {
  liverpool: {
    id: 40,
    name: 'Liverpool',
    shortName: 'LIV',
    logo: 'https://media.api-sports.io/football/teams/40.png',
    code: 'LIV',
  },
  manUtd: {
    id: 33,
    name: 'Manchester United',
    shortName: 'MUN',
    logo: 'https://media.api-sports.io/football/teams/33.png',
    code: 'MUN',
  },
  manCity: {
    id: 50,
    name: 'Manchester City',
    shortName: 'MCI',
    logo: 'https://media.api-sports.io/football/teams/50.png',
    code: 'MCI',
  },
  arsenal: {
    id: 42,
    name: 'Arsenal',
    shortName: 'ARS',
    logo: 'https://media.api-sports.io/football/teams/42.png',
    code: 'ARS',
  },
  chelsea: {
    id: 49,
    name: 'Chelsea',
    shortName: 'CHE',
    logo: 'https://media.api-sports.io/football/teams/49.png',
    code: 'CHE',
  },
  realMadrid: {
    id: 541,
    name: 'Real Madrid',
    shortName: 'RMA',
    logo: 'https://media.api-sports.io/football/teams/541.png',
    code: 'RMA',
  },
  barcelona: {
    id: 529,
    name: 'Barcelona',
    shortName: 'BAR',
    logo: 'https://media.api-sports.io/football/teams/529.png',
    code: 'BAR',
  },
  bayern: {
    id: 157,
    name: 'Bayern Munich',
    shortName: 'BAY',
    logo: 'https://media.api-sports.io/football/teams/157.png',
    code: 'BAY',
  },
  dortmund: {
    id: 165,
    name: 'Borussia Dortmund',
    shortName: 'BVB',
    logo: 'https://media.api-sports.io/football/teams/165.png',
    code: 'BVB',
  },
  tottenham: {
    id: 47,
    name: 'Tottenham',
    shortName: 'TOT',
    logo: 'https://media.api-sports.io/football/teams/47.png',
    code: 'TOT',
  },
};

// ─── Mock Players ───────────────────────────────────────────────

export const MOCK_PLAYERS: Player[] = [
  {
    id: 1100,
    name: 'E. Haaland',
    firstName: 'Erling',
    lastName: 'Haaland',
    age: 25,
    nationality: 'Norway',
    photo: 'https://media.api-sports.io/football/players/1100.png',
    position: 'ST',
    number: 9,
    team: MOCK_TEAMS.manCity,
    stats: {
      appearances: 28,
      goals: 24,
      assists: 5,
      xG: 18.7,
      minutes: 2340,
      rating: 8.2,
      pace: 89,
      shooting: 94,
      passing: 72,
      dribbling: 88,
      defending: 48,
      physical: 91,
    },
  },
  {
    id: 306,
    name: 'M. Salah',
    firstName: 'Mohamed',
    lastName: 'Salah',
    age: 33,
    nationality: 'Egypt',
    photo: 'https://media.api-sports.io/football/players/306.png',
    position: 'RW',
    number: 11,
    team: MOCK_TEAMS.liverpool,
    stats: {
      appearances: 30,
      goals: 19,
      assists: 13,
      xG: 16.2,
      minutes: 2610,
      rating: 8.0,
      pace: 88,
      shooting: 90,
      passing: 81,
      dribbling: 92,
      defending: 42,
      physical: 75,
    },
  },
  {
    id: 874,
    name: 'K. Mbappé',
    firstName: 'Kylian',
    lastName: 'Mbappé',
    age: 27,
    nationality: 'France',
    photo: 'https://media.api-sports.io/football/players/874.png',
    position: 'LW',
    number: 7,
    team: MOCK_TEAMS.realMadrid,
    stats: {
      appearances: 25,
      goals: 17,
      assists: 8,
      xG: 15.1,
      minutes: 2180,
      rating: 7.9,
      pace: 97,
      shooting: 92,
      passing: 80,
      dribbling: 95,
      defending: 36,
      physical: 78,
    },
  },
  {
    id: 154,
    name: 'B. Saka',
    firstName: 'Bukayo',
    lastName: 'Saka',
    age: 23,
    nationality: 'England',
    photo: 'https://media.api-sports.io/football/players/154.png',
    position: 'RW',
    number: 7,
    team: MOCK_TEAMS.arsenal,
    stats: {
      appearances: 29,
      goals: 14,
      assists: 11,
      xG: 12.3,
      minutes: 2500,
      rating: 7.8,
      pace: 90,
      shooting: 82,
      passing: 84,
      dribbling: 91,
      defending: 55,
      physical: 70,
    },
  },
  {
    id: 2294,
    name: 'J. Bellingham',
    firstName: 'Jude',
    lastName: 'Bellingham',
    age: 22,
    nationality: 'England',
    photo: 'https://media.api-sports.io/football/players/2294.png',
    position: 'CM',
    number: 5,
    team: MOCK_TEAMS.realMadrid,
    stats: {
      appearances: 26,
      goals: 12,
      assists: 9,
      xG: 10.8,
      minutes: 2210,
      rating: 7.7,
      pace: 82,
      shooting: 80,
      passing: 85,
      dribbling: 87,
      defending: 68,
      physical: 82,
    },
  },
  {
    id: 521,
    name: 'V. van Dijk',
    firstName: 'Virgil',
    lastName: 'van Dijk',
    age: 34,
    nationality: 'Netherlands',
    photo: 'https://media.api-sports.io/football/players/521.png',
    position: 'CB',
    number: 4,
    team: MOCK_TEAMS.liverpool,
    stats: {
      appearances: 31,
      goals: 3,
      assists: 2,
      xG: 2.1,
      minutes: 2790,
      rating: 7.5,
      pace: 72,
      shooting: 55,
      passing: 75,
      dribbling: 60,
      defending: 93,
      physical: 90,
    },
  },
];

// ─── Mock Fixtures ──────────────────────────────────────────────

export const MOCK_LIVE_FIXTURES: Fixture[] = [
  {
    id: 1001,
    date: new Date().toISOString(),
    timestamp: Date.now(),
    status: { short: 'LIVE', long: 'Second Half', elapsed: 78 },
    league: {
      id: 39,
      name: 'Premier League',
      country: 'England',
      logo: 'https://media.api-sports.io/football/leagues/39.png',
      round: 'Regular Season - 25',
    },
    teams: {
      home: { ...MOCK_TEAMS.liverpool, winner: true },
      away: { ...MOCK_TEAMS.manUtd, winner: false },
    },
    goals: { home: 2, away: 1 },
    score: {
      halftime: { home: 1, away: 0 },
      fulltime: { home: null, away: null },
    },
    events: [
      {
        time: { elapsed: 23, extra: null },
        team: { id: 40, name: 'Liverpool' },
        player: { id: 306, name: 'M. Salah' },
        assist: { id: 66, name: 'T. Alexander-Arnold' },
        type: 'Goal',
        detail: 'Normal Goal',
        comments: null,
      },
      {
        time: { elapsed: 34, extra: null },
        team: { id: 33, name: 'Manchester United' },
        player: { id: 912, name: 'M. Rashford' },
        assist: { id: null, name: null },
        type: 'Card',
        detail: 'Yellow Card',
        comments: null,
      },
      {
        time: { elapsed: 56, extra: null },
        team: { id: 33, name: 'Manchester United' },
        player: { id: 740, name: 'B. Fernandes' },
        assist: { id: 912, name: 'M. Rashford' },
        type: 'Goal',
        detail: 'Normal Goal',
        comments: null,
      },
      {
        time: { elapsed: 67, extra: null },
        team: { id: 40, name: 'Liverpool' },
        player: { id: 180, name: 'D. Núñez' },
        assist: { id: 306, name: 'M. Salah' },
        type: 'Goal',
        detail: 'Normal Goal',
        comments: null,
      },
    ],
    statistics: {
      possession: [62, 38],
      shots: [14, 7],
      shotsOnTarget: [6, 3],
      corners: [6, 2],
      fouls: [8, 12],
      yellowCards: [1, 3],
      redCards: [0, 0],
      offsides: [2, 1],
      xG: [1.82, 0.74],
      passes: [487, 312],
      passAccuracy: [89, 78],
    },
    lineups: {
      home: {
        formation: '4-3-3',
        players: [
          { id: 1, name: 'Alisson', firstName: 'Alisson', lastName: 'Becker', age: 32, nationality: 'Brazil', photo: '', position: 'GK', number: 1, team: MOCK_TEAMS.liverpool, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '1:1' },
          { id: 2, name: 'Robertson', firstName: 'Andrew', lastName: 'Robertson', age: 31, nationality: 'Scotland', photo: '', position: 'LB', number: 26, team: MOCK_TEAMS.liverpool, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '2:1' },
          { id: 3, name: 'Van Dijk', firstName: 'Virgil', lastName: 'van Dijk', age: 34, nationality: 'Netherlands', photo: '', position: 'CB', number: 4, team: MOCK_TEAMS.liverpool, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '2:2' },
          { id: 4, name: 'Konaté', firstName: 'Ibrahima', lastName: 'Konaté', age: 26, nationality: 'France', photo: '', position: 'CB', number: 5, team: MOCK_TEAMS.liverpool, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '2:3' },
          { id: 5, name: 'TAA', firstName: 'Trent', lastName: 'Alexander-Arnold', age: 27, nationality: 'England', photo: '', position: 'RB', number: 66, team: MOCK_TEAMS.liverpool, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '2:4' },
          { id: 6, name: 'Mac Allister', firstName: 'Alexis', lastName: 'Mac Allister', age: 26, nationality: 'Argentina', photo: '', position: 'CM', number: 10, team: MOCK_TEAMS.liverpool, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '3:1' },
          { id: 7, name: 'Szoboszlai', firstName: 'Dominik', lastName: 'Szoboszlai', age: 25, nationality: 'Hungary', photo: '', position: 'CM', number: 8, team: MOCK_TEAMS.liverpool, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '3:2' },
          { id: 8, name: 'Jones', firstName: 'Curtis', lastName: 'Jones', age: 24, nationality: 'England', photo: '', position: 'CM', number: 17, team: MOCK_TEAMS.liverpool, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '3:3' },
          { id: 9, name: 'Salah', firstName: 'Mohamed', lastName: 'Salah', age: 33, nationality: 'Egypt', photo: '', position: 'RW', number: 11, team: MOCK_TEAMS.liverpool, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '4:3' },
          { id: 10, name: 'Núñez', firstName: 'Darwin', lastName: 'Núñez', age: 26, nationality: 'Uruguay', photo: '', position: 'ST', number: 9, team: MOCK_TEAMS.liverpool, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '4:2' },
          { id: 11, name: 'Jota', firstName: 'Diogo', lastName: 'Jota', age: 28, nationality: 'Portugal', photo: '', position: 'LW', number: 20, team: MOCK_TEAMS.liverpool, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '4:1' },
        ],
      },
      away: {
        formation: '4-2-3-1',
        players: [
          { id: 20, name: 'Onana', firstName: 'André', lastName: 'Onana', age: 29, nationality: 'Cameroon', photo: '', position: 'GK', number: 24, team: MOCK_TEAMS.manUtd, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '1:1' },
          { id: 21, name: 'Dalot', firstName: 'Diogo', lastName: 'Dalot', age: 26, nationality: 'Portugal', photo: '', position: 'RB', number: 20, team: MOCK_TEAMS.manUtd, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '2:4' },
          { id: 22, name: 'Varane', firstName: 'Raphaël', lastName: 'Varane', age: 32, nationality: 'France', photo: '', position: 'CB', number: 19, team: MOCK_TEAMS.manUtd, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '2:3' },
          { id: 23, name: 'Martínez', firstName: 'Lisandro', lastName: 'Martínez', age: 27, nationality: 'Argentina', photo: '', position: 'CB', number: 6, team: MOCK_TEAMS.manUtd, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '2:2' },
          { id: 24, name: 'Shaw', firstName: 'Luke', lastName: 'Shaw', age: 29, nationality: 'England', photo: '', position: 'LB', number: 23, team: MOCK_TEAMS.manUtd, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '2:1' },
          { id: 25, name: 'Casemiro', firstName: 'Carlos', lastName: 'Casemiro', age: 33, nationality: 'Brazil', photo: '', position: 'CDM', number: 18, team: MOCK_TEAMS.manUtd, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '3:1' },
          { id: 26, name: 'Mainoo', firstName: 'Kobbie', lastName: 'Mainoo', age: 19, nationality: 'England', photo: '', position: 'CM', number: 37, team: MOCK_TEAMS.manUtd, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '3:2' },
          { id: 27, name: 'Garnacho', firstName: 'Alejandro', lastName: 'Garnacho', age: 20, nationality: 'Argentina', photo: '', position: 'LW', number: 17, team: MOCK_TEAMS.manUtd, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '4:1' },
          { id: 28, name: 'Fernandes', firstName: 'Bruno', lastName: 'Fernandes', age: 30, nationality: 'Portugal', photo: '', position: 'CAM', number: 8, team: MOCK_TEAMS.manUtd, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '4:2' },
          { id: 29, name: 'Rashford', firstName: 'Marcus', lastName: 'Rashford', age: 27, nationality: 'England', photo: '', position: 'RW', number: 10, team: MOCK_TEAMS.manUtd, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '4:3' },
          { id: 30, name: 'Højlund', firstName: 'Rasmus', lastName: 'Højlund', age: 21, nationality: 'Denmark', photo: '', position: 'ST', number: 11, team: MOCK_TEAMS.manUtd, stats: { appearances: 0, goals: 0, assists: 0, xG: 0, minutes: 0, rating: 0 }, grid: '5:1' },
        ],
      },
    },
    prediction: {
      homeWin: 82,
      draw: 13,
      awayWin: 5,
      advice: 'Liverpool are dominating possession and creating high-quality chances. Man Utd need a tactical change.',
    },
  },
];

export const MOCK_UPCOMING_FIXTURES: Fixture[] = [
  {
    id: 2001,
    date: new Date(Date.now() + 3 * 3600000).toISOString(),
    timestamp: Date.now() + 3 * 3600000,
    status: { short: 'NS', long: 'Not Started', elapsed: null },
    league: {
      id: 39,
      name: 'Premier League',
      country: 'England',
      logo: 'https://media.api-sports.io/football/leagues/39.png',
      round: 'Regular Season - 25',
    },
    teams: {
      home: { ...MOCK_TEAMS.arsenal, winner: null },
      away: { ...MOCK_TEAMS.chelsea, winner: null },
    },
    goals: { home: null, away: null },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
    prediction: {
      homeWin: 55,
      draw: 25,
      awayWin: 20,
      advice: 'Arsenal are strong at home. Expect a tight match with Arsenal edging it.',
    },
  },
  {
    id: 2002,
    date: new Date(Date.now() + 5 * 3600000).toISOString(),
    timestamp: Date.now() + 5 * 3600000,
    status: { short: 'NS', long: 'Not Started', elapsed: null },
    league: {
      id: 140,
      name: 'La Liga',
      country: 'Spain',
      logo: 'https://media.api-sports.io/football/leagues/140.png',
      round: 'Regular Season - 22',
    },
    teams: {
      home: { ...MOCK_TEAMS.realMadrid, winner: null },
      away: { ...MOCK_TEAMS.barcelona, winner: null },
    },
    goals: { home: null, away: null },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
    prediction: {
      homeWin: 45,
      draw: 28,
      awayWin: 27,
      advice: 'El Clásico is always unpredictable. Both sides in top form.',
    },
  },
  {
    id: 2003,
    date: new Date(Date.now() + 7 * 3600000).toISOString(),
    timestamp: Date.now() + 7 * 3600000,
    status: { short: 'NS', long: 'Not Started', elapsed: null },
    league: {
      id: 78,
      name: 'Bundesliga',
      country: 'Germany',
      logo: 'https://media.api-sports.io/football/leagues/78.png',
      round: 'Regular Season - 20',
    },
    teams: {
      home: { ...MOCK_TEAMS.bayern, winner: null },
      away: { ...MOCK_TEAMS.dortmund, winner: null },
    },
    goals: { home: null, away: null },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
    prediction: {
      homeWin: 60,
      draw: 22,
      awayWin: 18,
      advice: 'Der Klassiker — Bayern are favourites at home but Dortmund are dangerous on the counter.',
    },
  },
  {
    id: 2004,
    date: new Date(Date.now() + 2 * 3600000).toISOString(),
    timestamp: Date.now() + 2 * 3600000,
    status: { short: 'NS', long: 'Not Started', elapsed: null },
    league: {
      id: 39,
      name: 'Premier League',
      country: 'England',
      logo: 'https://media.api-sports.io/football/leagues/39.png',
      round: 'Regular Season - 25',
    },
    teams: {
      home: { ...MOCK_TEAMS.manCity, winner: null },
      away: { ...MOCK_TEAMS.tottenham, winner: null },
    },
    goals: { home: null, away: null },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
    prediction: {
      homeWin: 70,
      draw: 18,
      awayWin: 12,
      advice: 'Man City dominant at the Etihad. Haaland vs Spurs is a mismatch.',
    },
  },
];

export const MOCK_FT_FIXTURES: Fixture[] = [
  {
    id: 3001,
    date: new Date(Date.now() - 6 * 3600000).toISOString(),
    timestamp: Date.now() - 6 * 3600000,
    status: { short: 'FT', long: 'Match Finished', elapsed: 90 },
    league: {
      id: 39,
      name: 'Premier League',
      country: 'England',
      logo: 'https://media.api-sports.io/football/leagues/39.png',
      round: 'Regular Season - 24',
    },
    teams: {
      home: { ...MOCK_TEAMS.chelsea, winner: false },
      away: { ...MOCK_TEAMS.manCity, winner: true },
    },
    goals: { home: 1, away: 3 },
    score: { halftime: { home: 0, away: 2 }, fulltime: { home: 1, away: 3 } },
  },
];

// ─── AI Quick Actions ───────────────────────────────────────────

export const AI_QUICK_ACTIONS = [
  { id: 'predict', label: 'Who will win this match?', icon: AppIcons.trophy },
  { id: 'struggle', label: 'Why is Arsenal struggling?', icon: AppIcons.trendDown },
  { id: 'offside', label: 'Explain offside rule', icon: AppIcons.flag },
  { id: 'compare', label: 'Compare Messi & Ronaldo', icon: AppIcons.compare },
  { id: 'fantasy', label: 'Suggest Fantasy Team', icon: AppIcons.star },
] as const;

// ─── League Metadata ────────────────────────────────────────────

export const LEAGUE_METADATA: Record<number, { name: string; icon: AppIconName; color: string }> = {
  39: { name: 'Premier League', icon: AppIcons.league, color: '#3D195B' },
  140: { name: 'La Liga', icon: AppIcons.league, color: '#EE8707' },
  78: { name: 'Bundesliga', icon: AppIcons.league, color: '#D20515' },
  135: { name: 'Serie A', icon: AppIcons.league, color: '#024494' },
  61: { name: 'Ligue 1', icon: AppIcons.league, color: '#DDE523' },
  2: { name: 'Champions League', icon: AppIcons.trophy, color: '#0D1C8B' },
  3: { name: 'Europa League', icon: AppIcons.star, color: '#F68E1E' },
};
