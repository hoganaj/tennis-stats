import Papa from 'papaparse';
import { Player, MatchResult, RawMatch } from '../types';
import axios from 'axios';

// Cache variables
let playersCache: Player[] | null = null;
let matchesCache: Record<string, MatchResult[]> = {};
let rawMatches: RawMatch[] | null = null;

export function clearCache() {
  playersCache = null;
  matchesCache = {};
  rawMatches = null;
}

// Parse the CSV and cache all matches
async function parseMatchesCSV() {
  if (rawMatches) return rawMatches;
  
  try {
    const response = await axios.get('/data/atp_matches_2024.csv', { responseType: 'text' });
    const { data } = Papa.parse<RawMatch>(response.data, { 
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    });
    
    rawMatches = data;
    return data;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
}

// Get all players
export async function getPlayers(): Promise<Player[]> {
  if (playersCache) return playersCache;
  
  const matches = await parseMatchesCSV();
  const playersMap = new Map<string, Player>();
  
  matches.forEach((match: RawMatch) => {
    // Skip if necessary data is missing
    if (!match.winner_id || !match.loser_id) return;
    
    // Process winner
    if (!playersMap.has(match.winner_id)) {
      playersMap.set(match.winner_id, {
        id: match.winner_id,
        name: match.winner_name || `Player ${match.winner_id}`,
        country: match.winner_ioc || 'Unknown',
        ranking: parseInt(match.winner_rank) || 9999,
        rankingChange: 0, // calculate later
        imageUrl: `/images/players/${match.winner_id}.jpg`, // add images later
        stats: {
          wins: 0,
          losses: 0,
          titles: 0
        },
        surfaceStats: {
          hard: { wins: 0, losses: 0, winPercentage: 0 },
          clay: { wins: 0, losses: 0, winPercentage: 0 },
          grass: { wins: 0, losses: 0, winPercentage: 0 }
        }
      });
    }
    
    // Process loser
    if (!playersMap.has(match.loser_id)) {
      playersMap.set(match.loser_id, {
        id: match.loser_id,
        name: match.loser_name || `Player ${match.loser_id}`,
        country: match.loser_ioc || 'Unknown',
        ranking: parseInt(match.loser_rank) || 9999,
        rankingChange: 0,
        imageUrl: `/images/players/${match.loser_id}.jpg`,
        stats: {
          wins: 0,
          losses: 0,
          titles: 0
        },
        surfaceStats: {
          hard: { wins: 0, losses: 0, winPercentage: 0 },
          clay: { wins: 0, losses: 0, winPercentage: 0 },
          grass: { wins: 0, losses: 0, winPercentage: 0 }
        }
      });
    }
    
    // Update stats
    const winner = playersMap.get(match.winner_id)!;
    const loser = playersMap.get(match.loser_id)!;
    
    winner.stats.wins += 1;
    loser.stats.losses += 1;
    
    // Update surface stats
    const surface = (match.surface || 'hard').toLowerCase();
    if (surface === 'hard' || surface === 'clay' || surface === 'grass') {
      winner.surfaceStats![surface].wins += 1;
      loser.surfaceStats![surface].losses += 1;
    }
    
    // Count titles (only if final round)
    if (match.round === 'F') {
      winner.stats.titles += 1;
    }
  });
  
  // Calculate percentages for surface stats
  playersMap.forEach(player => {
    if (player.surfaceStats) {
      type SurfaceKey = 'hard' | 'clay' | 'grass';
      (['hard', 'clay', 'grass'] as SurfaceKey[]).forEach(surface => {
        const stats = player.surfaceStats![surface];
        const total = stats.wins + stats.losses;
        if (total > 0) {
          stats.winPercentage = parseFloat(((stats.wins / total) * 100).toFixed(1));
        }
      });
    }
  });
  // Convert map to array and sort by ranking
  playersCache = Array.from(playersMap.values())
    .sort((a, b) => a.ranking - b.ranking);
  
  return playersCache;
}

// Get matches for a specific player
export async function getPlayerMatches(playerId: string): Promise<MatchResult[]> {
  // Return from cache if available
  if (matchesCache[playerId]) return matchesCache[playerId];
  
  const matches = await parseMatchesCSV();
  const playerMatches: MatchResult[] = [];
  
  matches.forEach((match: RawMatch) => {
    // Skip if match doesn't involve this player
    if (match.winner_id !== playerId && match.loser_id !== playerId) return;
    
    const isWinner = match.winner_id === playerId;
    const surface = (match.surface || '').toLowerCase();
    let mappedSurface: 'hard' | 'clay' | 'grass' | 'carpet' = 'hard';
    
    if (surface === 'clay') mappedSurface = 'clay';
    else if (surface === 'grass') mappedSurface = 'grass';
    else if (surface === 'carpet') mappedSurface = 'carpet';
    
    playerMatches.push({
      id: `${match.tourney_id || 'unknown'}-${match.match_num || playerMatches.length}`,
      tournament: match.tourney_name || 'Unknown Tournament',
      round: match.round || 'Unknown Round',
      opponent: isWinner ? (match.loser_name || 'Unknown Player') : (match.winner_name || 'Unknown Player'),
      score: match.score || 'N/A',
      date: match.tourney_date || '20240101', // Default to Jan 1, 2024 if missing
      surface: mappedSurface,
      isWin: isWinner
    });
  });
  
  // Sort by date (most recent first)
  playerMatches.sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Cache and return
  matchesCache[playerId] = playerMatches;
  return playerMatches;
}

// Helper function to parse date from ATP format (YYYYMMDD)
function parseDate(dateStr: string): Date {
  if (dateStr.length === 8) {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

// Get a specific player by ID
export async function getPlayerById(playerId: string): Promise<Player | null> {
  const allPlayers = await getPlayers();
  return allPlayers.find(player => player.id === playerId) || null;
}

// Get top ranked players
export async function getTopPlayers(count: number = 20): Promise<Player[]> {
  const allPlayers = await getPlayers();
  return allPlayers.slice(0, count);
}