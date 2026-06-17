// ─── Core game record (one row from the dataset) ─────────────────────────────

export interface Game {
  rank: number;
  game: string;
  hours_streamed: number | null;
  pct_airtime: number | null;
  avg_viewers: number | null;
  max_viewers: number | null;
  followers_per_hr: number | null;
  last_seen: string | null;          // "17/Jun/2026"

  rawg_matched: boolean;
  rawg_name: string | null;
  genres: string[] | null;           // ["Action", "Indie", …]
  platforms: string[] | null;        // ["PC", "PlayStation", …]
  platform_simple: string | null;    // "PC" | "Console" | "Mobile" | "Multi-platform"
  release_year: number | null;
  developer: string | null;
  primary_genre: string | null;
}

// ─── Comparison result for one guess ─────────────────────────────────────────

export type CellStatus =
  | 'match'    // exact match  → green
  | 'partial'  // overlapping  → yellow  (categorical arrays only)
  | 'higher'   // answer > guess → ↑ arrow
  | 'lower'    // answer < guess → ↓ arrow
  | 'none'     // no match / unknown → grey

export interface CellResult {
  value: string | number | null;   // display value from the GUESS
  status: CellStatus;
}

export interface GuessResult {
  game: Game;                        // the full game that was guessed
  columns: {
    genre:        CellResult;
    platform:     CellResult;
    release_year: CellResult;
    developer:    CellResult;
    avg_viewers:  CellResult;
    hours_streamed: CellResult;
    last_seen:    CellResult;
  };
  correct: boolean;
}

// ─── Game mode ────────────────────────────────────────────────────────────────

export type GameMode = 'daily' | 'unlimited';
