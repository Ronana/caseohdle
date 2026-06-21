import type { Game, CellResult, CellStatus, GuessResult } from './types';

// ─── Date helpers ─────────────────────────────────────────────────────────────

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

/** Parse "17/Jun/2026" → Date */
function parseLastSeen(s: string | null): Date | null {
  if (!s) return null;
  const [day, mon, year] = s.split('/');
  const m = MONTH_MAP[mon];
  if (m === undefined) return null;
  return new Date(parseInt(year), m, parseInt(day));
}

/** Format "17/Jun/2026" → "Jun '26" for compact cell display */
export function formatLastSeen(s: string | null): string {
  if (!s) return '?';
  const parts = s.split('/');
  if (parts.length < 3) return s;
  const [, mon, year] = parts;
  return `${mon} '${year.slice(2)}`;
}

// ─── Individual cell comparisons ─────────────────────────────────────────────

function compareGenre(guess: Game, answer: Game): CellResult {
  const g = guess.primary_genre;
  const a = answer.primary_genre;
  if (!g || !a) return { value: g ?? '?', status: 'none' };
  return { value: g, status: g === a ? 'match' : 'none' };
}

function comparePlatform(guess: Game, answer: Game): CellResult {
  const g = guess.platform_simple;
  const a = answer.platform_simple;
  if (!g || !a) return { value: g ?? '?', status: 'none' };
  return { value: g, status: g === a ? 'match' : 'none' };
}

function compareNumeric(
  guessVal: number | null,
  answerVal: number | null,
  displayVal: number | null,
  threshold = 0,
): CellResult {
  if (guessVal == null || answerVal == null) {
    return { value: displayVal ?? null, status: 'none' };
  }
  if (Math.abs(guessVal - answerVal) <= threshold) {
    return { value: displayVal, status: 'match' };
  }
  return { value: displayVal, status: answerVal > guessVal ? 'higher' : 'lower' };
}

function compareReleaseYear(guess: Game, answer: Game): CellResult {
  return compareNumeric(guess.release_year, answer.release_year, guess.release_year);
}

function compareDeveloper(guess: Game, answer: Game): CellResult {
  const g = guess.developer;
  const a = answer.developer;
  if (!g || !a) return { value: g ?? '?', status: 'none' };
  // Case-insensitive exact match
  return { value: g, status: g.toLowerCase() === a.toLowerCase() ? 'match' : 'none' };
}

function compareAvgViewers(guess: Game, answer: Game): CellResult {
  const gv = guess.avg_viewers;
  const av = answer.avg_viewers;
  if (gv == null || av == null) return { value: gv ?? null, status: 'none' };
  if (gv === av) return { value: gv, status: 'match' };
  // Allow ±5% tolerance so nearby values don't feel punishing
  const tolerance = av * 0.05;
  if (Math.abs(gv - av) <= tolerance) return { value: gv, status: 'match' };
  return { value: gv, status: av > gv ? 'higher' : 'lower' };
}

function compareHoursStreamed(guess: Game, answer: Game): CellResult {
  const gh = guess.hours_streamed;
  const ah = answer.hours_streamed;
  if (gh == null || ah == null) return { value: gh ?? null, status: 'none' };
  if (gh === ah) return { value: gh, status: 'match' };
  // ±10% tolerance
  const tolerance = ah * 0.10;
  if (Math.abs(gh - ah) <= tolerance) return { value: gh, status: 'match' };
  return { value: gh, status: ah > gh ? 'higher' : 'lower' };
}

function compareLastSeen(guess: Game, answer: Game): CellResult {
  const gd = parseLastSeen(guess.last_seen);
  const ad = parseLastSeen(answer.last_seen);
  if (!gd || !ad) return { value: guess.last_seen ?? null, status: 'none' };
  // Match if same calendar month+year
  const sameMonth = gd.getFullYear() === ad.getFullYear() &&
                    gd.getMonth()    === ad.getMonth();
  if (sameMonth) return { value: guess.last_seen, status: 'match' };
  return {
    value: guess.last_seen,
    status: ad > gd ? 'higher' : 'lower',
  };
}

// ─── Main comparison function ─────────────────────────────────────────────────

export function compareGames(guess: Game, answer: Game): GuessResult {
  return {
    game: guess,
    columns: {
      genre:          compareGenre(guess, answer),
      platform:       comparePlatform(guess, answer),
      release_year:   compareReleaseYear(guess, answer),
      developer:      compareDeveloper(guess, answer),
      avg_viewers:    compareAvgViewers(guess, answer),
      hours_streamed: compareHoursStreamed(guess, answer),
      last_seen:      compareLastSeen(guess, answer),
    },
    correct: guess.game === answer.game,
  };
}

// ─── Daily seed ───────────────────────────────────────────────────────────────

/** Mulberry32 — fast, seedable PRNG (deterministic everywhere) */
function mulberry32(seed: number) {
  return function (): number {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates shuffle using a seeded PRNG — same result everywhere */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Epoch: Day 1 was 2026-06-17, so today (2026-06-18) = Day 2 */
const EPOCH_MS = new Date('2026-06-17T00:00:00Z').getTime();
const FIXED_SEED = 0xca5e0000; // "case" → consistent shuffle forever

/**
 * Returns the game for a given UTC date string ("YYYY-MM-DD").
 * Every player in every timezone gets the same game each day
 * because we anchor to UTC date, not local midnight.
 */
export function getDailyGame(games: Game[], utcDateStr: string): Game {
  const shuffled = seededShuffle(games, FIXED_SEED);
  const dayMs = new Date(utcDateStr + 'T00:00:00Z').getTime();
  const dayIndex = Math.floor((dayMs - EPOCH_MS) / 86_400_000);
  return shuffled[((dayIndex % shuffled.length) + shuffled.length) % shuffled.length];
}

/** Today's game (UTC date). */
export function getTodaysGame(games: Game[]): Game {
  const now = new Date();
  const utcDate = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
  return getDailyGame(games, utcDate);
}

/** Day number since epoch (1-indexed). Shown in the header as "Day #N". */
export function getDayNumber(): number {
  const nowMs = new Date().getTime();
  return Math.floor((nowMs - EPOCH_MS) / 86_400_000) + 1;
}

/** Random game for Unlimited/Practice mode. Excludes already-guessed IDs. */
export function getRandomGame(games: Game[], excludeRanks: number[] = []): Game {
  const pool = excludeRanks.length
    ? games.filter(g => !excludeRanks.includes(g.rank))
    : games;
  if (!pool.length) return games[Math.floor(Math.random() * games.length)];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Utility ─────────────────────────────────────────────────────────────────

/** Format a viewer count for display: 54326 → "54.3K" */
export function formatViewers(n: number | null): string {
  if (n == null) return '?';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

/** Format hours for display: 942 → "942h", 0.5 → "0.5h" */
export function formatHours(n: number | null): string {
  if (n == null) return '?';
  return n % 1 === 0 ? `${n}h` : `${n.toFixed(1)}h`;
}
