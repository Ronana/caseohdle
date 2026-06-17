import type { GuessResult } from './types';

export interface WafflePointsState {
  total: number;
  lastEarned: number;
}

const STORAGE_KEY = 'caseohdle_whp';

// Points per cell status
const CELL_POINTS: Record<string, number> = {
  match:   150,
  partial:  75,
  higher:   25,
  lower:    25,
  none:      0,
};

// Win bonus by guess count
function winBonus(guessCount: number): number {
  if (guessCount === 1) return 5000;
  if (guessCount <= 3)  return 2000;
  if (guessCount <= 5)  return 1000;
  return 250;
}

export function calcRoundPoints(guesses: GuessResult[], won: boolean, gaveUp: boolean): number {
  let pts = 0;
  for (const g of guesses) {
    for (const cell of Object.values(g.columns)) {
      pts += CELL_POINTS[cell.status] ?? 0;
    }
  }
  if (won)    pts += winBonus(guesses.length);
  if (gaveUp) pts = Math.max(0, pts - 500);
  return pts;
}

export function winTier(guessCount: number, gaveUp: boolean): { label: string; colour: string } {
  if (gaveUp)          return { label: 'Perma-Banned 🔨',      colour: 'text-red-500' };
  if (guessCount === 1) return { label: 'LEGENDARY 👑',         colour: 'text-yellow-400' };
  if (guessCount <= 3)  return { label: 'POGGERS 🎉',           colour: 'text-emerald-400' };
  if (guessCount <= 5)  return { label: 'Respectable 👍',       colour: 'text-blue-400' };
  if (guessCount <= 8)  return { label: 'Barely Surviving 😅',  colour: 'text-amber-400' };
  return                       { label: 'Cooked 💀',            colour: 'text-orange-500' };
}

export function loadWHP(): WafflePointsState {
  if (typeof window === 'undefined') return { total: 0, lastEarned: 0 };
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') ?? { total: 0, lastEarned: 0 };
  } catch { return { total: 0, lastEarned: 0 }; }
}

export function saveWHP(state: WafflePointsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function formatWHP(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
