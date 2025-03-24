
export interface Player {
  id: string;
  name: string;
  country: string;
  imageUrl?: string;
  headImageUrl?: string;
  ranking: number;
  rankingChange: number;
  stats: {
    wins: number;
    losses: number;
    titles: number;
    grandSlams?: number;
  };
  surfaceStats?: {
    hard: SurfaceRecord;
    clay: SurfaceRecord;
    grass: SurfaceRecord;
  };
}

export interface SurfaceRecord {
  wins: number;
  losses: number;
  winPercentage: number;
}

export interface MatchResult {
  id: string;
  tournament: string;
  round: string;
  opponent: string;
  score: string;
  date: string;
  surface: 'hard' | 'clay' | 'grass' | 'carpet';
  isWin: boolean;
}

export interface RawMatch {
  tourney_id: string;
  tourney_name: string;
  surface: string;
  draw_size: string;
  tourney_level: string;
  tourney_date: string;
  match_num: string;
  winner_id: string;
  winner_seed: string;
  winner_entry: string;
  winner_name: string;
  winner_hand: string;
  winner_ht: string;
  winner_ioc: string;
  winner_age: string;
  winner_rank: string;
  winner_rank_points: string;
  loser_id: string;
  loser_seed: string;
  loser_entry: string;
  loser_name: string;
  loser_hand: string;
  loser_ht: string;
  loser_ioc: string;
  loser_age: string;
  loser_rank: string;
  loser_rank_points: string;
  score: string;
  best_of: string;
  round: string;
  minutes: string;
  w_ace: string;
  w_df: string;
  w_svpt: string;
  w_1stIn: string;
  w_1stWon: string;
  w_2ndWon: string;
  w_SvGms: string;
  w_bpSaved: string;
  w_bpFaced: string;
  l_ace: string;
  l_df: string;
  l_svpt: string;
  l_1stIn: string;
  l_1stWon: string;
  l_2ndWon: string;
  l_SvGms: string;
  l_bpSaved: string;
  l_bpFaced: string;
  [key: string]: string;
}