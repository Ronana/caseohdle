'use client';

import { useState, useEffect } from 'react';
import type { GuessResult, Game, GameMode, CellStatus } from '@/lib/types';
import { useT } from '@/lib/LanguageContext';
import { winTier, formatWHP } from '@/lib/wafflePoints';
import WaffleConfetti from './WaffleConfetti';
import { generateShareImage } from '@/lib/shareImage';
import GuessDistribution from './GuessDistribution';

const EMOJI: Record<CellStatus, string> = {
  match: '🟩', partial: '🟨', higher: '🔵', lower: '🔵', none: '⬜',
};

// ─── Countdown ───────────────────────────────────────────────────────────────

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    function calc() {
      const now = new Date();
      const midnight = new Date();
      midnight.setUTCHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      if (diff <= 0) { setTimeLeft('00:00:00'); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

// ─── Daily stats (count + distribution) ─────────────────────────────────────

interface DayStats {
  count:        number | null;
  distribution: Record<string, number>;
}

function useDailyStats(
  mode:       GameMode,
  active:     boolean,
  won:        boolean,
  gaveUp:     boolean,
  guessCount: number,
): DayStats {
  const [stats, setStats] = useState<DayStats>({ count: null, distribution: {} });

  useEffect(() => {
    if (!active || mode !== 'daily') return;
    const date       = new Date().toISOString().slice(0, 10);
    const guessKey   = gaveUp ? 'X' : guessCount;
    fetch('/api/stats', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ date, guessCount: guessKey }),
    })
      .then(r => r.json())
      .then((d: { count: number; distribution: Record<string, number> }) => {
        setStats({ count: d.count, distribution: d.distribution ?? {} });
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, mode]);

  return stats;
}

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  answer: Game;
  guesses: GuessResult[];
  won: boolean;
  gaveUp: boolean;
  mode: GameMode;
  dayNumber: number;
  pointsEarned: number;
  onNewGame?: () => void;
}

export default function WinReveal({ answer, guesses, won, gaveUp, mode, dayNumber, pointsEarned, onNewGame }: Props) {
  const t = useT();
  const countdown  = useCountdown();
  const dailyStats = useDailyStats(mode, true, won, gaveUp, guesses.length);
  const playerCount    = dailyStats.count;
  const distribution   = dailyStats.distribution;
  const myDistKey      = gaveUp ? 'X' : guesses.length >= 10 ? '10+' : String(guesses.length);

  const message = won
    ? t.winMessages[guesses.length % t.winMessages.length]
    : t.banned;

  const tier = winTier(guesses.length, gaveUp);

  function buildShareText() {
    const header = mode === 'daily'
      ? `CaseOhdle #${dayNumber} — ${won ? guesses.length : 'X'}/∞`
      : `CaseOhdle Unlimited — ${won ? guesses.length : 'X'}/∞`;
    const grid = guesses.map(g =>
      Object.values(g.columns).map(c => EMOJI[c.status]).join('')
    ).join('\n');
    const footer = `${t.theGameWas}: ${answer.game}\ncaseohdle.vercel.app`;
    return `${header}\n\n${grid}\n\n${footer}`;
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(buildShareText());
      alert(t.copied);
    } catch {
      prompt('Copy this:', buildShareText());
    }
  }

  async function shareImage() {
    const blob = await generateShareImage({
      guesses,
      won,
      gaveUp,
      dayNumber,
      mode,
      tierLabel:  tier.label,
      whpEarned:  pointsEarned,
    });
    if (!blob) return;

    // Try writing to clipboard as PNG (Chrome 97+)
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      alert('Image copied to clipboard!');
      return;
    } catch { /* fallback to download */ }

    // Fallback: trigger a PNG download
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = mode === 'daily'
      ? `caseohdle-${dayNumber}.png`
      : 'caseohdle-unlimited.png';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-2 w-full animate-pop">
      {/* Waffle rain on win 🧇 */}
      {won && <WaffleConfetti />}
      <div className="border-t border-game-border pt-6 text-center space-y-5">

        {/* Headline */}
        <p className={`text-2xl font-bold ${won ? 'text-emerald-400' : 'text-red-400'}`}>
          {message}
        </p>

        {/* Answer reveal */}
        <div className="space-y-1">
          <p className="text-slate-400 text-sm">{t.theGameWas}</p>
          <p className="text-xl font-bold text-white">{answer.game}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs text-slate-400">
            {answer.primary_genre  && <span className="bg-game-border px-2 py-0.5 rounded">{answer.primary_genre}</span>}
            {answer.platform_simple && <span className="bg-game-border px-2 py-0.5 rounded">{answer.platform_simple}</span>}
            {answer.release_year   && <span className="bg-game-border px-2 py-0.5 rounded">{answer.release_year}</span>}
            {answer.developer      && <span className="bg-game-border px-2 py-0.5 rounded">{answer.developer}</span>}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex justify-center gap-6 flex-wrap text-sm">
          {/* Guess count */}
          <div className="text-center">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Guesses</p>
            <p className="text-2xl font-bold text-white">{guesses.length}</p>
          </div>

          {/* Performance tier */}
          <div className="text-center">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Rating</p>
            <p className={`text-lg font-bold ${tier.colour}`}>{tier.label}</p>
          </div>

          {/* Waffle House Points earned */}
          <div className="text-center">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">🧇 WHP Earned</p>
            <p className="text-2xl font-bold text-yellow-400">+{formatWHP(pointsEarned)}</p>
          </div>

          {/* Daily rank — only in daily mode */}
          {mode === 'daily' && playerCount !== null && (
            <div className="text-center">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Today's rank</p>
              <p className="text-2xl font-bold text-accent">{ordinal(playerCount)}</p>
            </div>
          )}
        </div>

        {/* Player count sentence */}
        {mode === 'daily' && playerCount !== null && (
          <p className="text-slate-400 text-sm">
            You are the{' '}
            <span className="text-accent font-semibold">{ordinal(playerCount)}</span>
            {' '}person to {won ? 'find' : 'play'} today's game
          </p>
        )}

        {/* Emoji grid */}
        <div className="font-mono text-base leading-5 space-y-0.5">
          {guesses.map((g, i) => (
            <div key={i} className="flex justify-center gap-px">
              {Object.values(g.columns).map((c, j) => (
                <span key={j}>{EMOJI[c.status]}</span>
              ))}
            </div>
          ))}
        </div>

        {/* Guess distribution — daily mode only */}
        {mode === 'daily' && Object.keys(distribution).length > 0 && (
          <div className="w-full max-w-xs mx-auto pt-2">
            <GuessDistribution distribution={distribution} myKey={myDistKey} />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={share}
            className="px-5 py-2 rounded-lg bg-accent/20 border border-accent/40 text-accent text-sm font-medium hover:bg-accent/30 transition-colors"
          >
            {t.share}
          </button>
          <button
            onClick={shareImage}
            className="px-5 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors"
          >
            🖼️ Share Image
          </button>
          {mode === 'unlimited' && onNewGame && (
            <button
              onClick={onNewGame}
              className="px-5 py-2 rounded-lg bg-game-border text-white text-sm font-medium hover:bg-slate-600 transition-colors"
            >
              {t.newGame}
            </button>
          )}
        </div>

        {/* Countdown — daily mode only */}
        {mode === 'daily' && (
          <div className="pt-2 border-t border-game-border/50">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Next game in</p>
            <p className="text-3xl font-mono font-bold text-white">{countdown}</p>
            <p className="text-slate-600 text-xs mt-1">Resets at UTC midnight</p>
          </div>
        )}

      </div>
    </div>
  );
}
