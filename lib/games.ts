import gamesRaw from '../caseoh_games_final.json';
import type { Game } from './types';

export const GAMES = gamesRaw as Game[];

/** For autocomplete: sorted alphabetically by title */
export const GAMES_ALPHA = [...GAMES].sort((a, b) =>
  a.game.localeCompare(b.game)
);
