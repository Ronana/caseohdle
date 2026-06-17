'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Game, GuessResult, GameMode } from '@/lib/types';
import { GAMES } from '@/lib/games';
import { compareGames, getTodaysGame, getRandomGame, getDayNumber } from '@/lib/gameLogic';
import GuessInput from './GuessInput';
import GuessGrid from './GuessGrid';
import WinReveal from './WinReveal';
import AboutSection from './AboutSection';
import ColorLegend from './ColorLegend';
import LanguageSelector from './LanguageSelector';
import KonamiEgg from './KonamiEgg';
import GuessQuip from './GuessQuip';
import HintPanel from './HintPanel';
import { useT } from '@/lib/LanguageContext';
import { calcRoundPoints, loadWHP, saveWHP, formatWHP, winTier, type WafflePointsState } from '@/lib/wafflePoints';
import { getRandomQuip, type Quip } from '@/lib/quips';

// ─── Streak ─────────────────────────────────────────────────────────────────

interface Streak {
  current: number;
  best: number;
  lastDate: string | null; // 'YYYY-MM-DD' UTC
}

const STREAK_KEY = 'caseohdle_streak';
const DAILY_STATE_KEY = 'caseohdle_daily';

function loadStreak(): Streak {
  if (typeof window === 'undefined') return { current: 0, best: 0, lastDate: null };
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY) ?? 'null') ?? { current: 0, best: 0, lastDate: null };
  } catch { return { current: 0, best: 0, lastDate: null }; }
}

function saveStreak(s: Streak) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(s));
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

// Persist daily game state (guesses + outcome) so refreshing mid-game restores it
interface DailyState {
  date: string;
  guesses: GuessResult[];
  won: boolean;
  gaveUp: boolean;
}

function loadDailyState(): DailyState | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = JSON.parse(localStorage.getItem(DAILY_STATE_KEY) ?? 'null') as DailyState | null;
    if (!saved) return null;
    // Only valid if it's for today
    if (saved.date !== todayUTC()) return null;
    return saved;
  } catch { return null; }
}

function saveDailyState(state: DailyState) {
  localStorage.setItem(DAILY_STATE_KEY, JSON.stringify(state));
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function GameBoard() {
  const [mode, setMode]           = useState<GameMode>('daily');
  const [answer, setAnswer]       = useState<Game>(() => getTodaysGame(GAMES));
  const [guesses, setGuesses]     = useState<GuessResult[]>([]);
  const [won, setWon]             = useState(false);
  const [gaveUp, setGaveUp]       = useState(false);
  const [streak, setStreak]       = useState<Streak>({ current: 0, best: 0, lastDate: null });
  const [hydrated, setHydrated]   = useState(false);
  const [whp, setWhp]             = useState<WafflePointsState>({ total: 0, lastEarned: 0 });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeQuip, setActiveQuip]     = useState<Quip | null>(null);
  const lastQuipText = useRef<string | undefined>(undefined);

  const dayNumber = getDayNumber();

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('caseohdle_sound', String(next));
      return next;
    });
  }, []);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const savedStreak = loadStreak();
    setStreak(savedStreak);

    const dailyState = loadDailyState();
    if (dailyState) {
      setGuesses(dailyState.guesses);
      setWon(dailyState.won);
      setGaveUp(dailyState.gaveUp);
    }

    setWhp(loadWHP());
    const savedSound = localStorage.getItem('caseohdle_sound');
    if (savedSound !== null) setSoundEnabled(savedSound !== 'false');
    setHydrated(true);
  }, []);

  // Persist daily state whenever it changes
  useEffect(() => {
    if (!hydrated || mode !== 'daily') return;
    saveDailyState({ date: todayUTC(), guesses, won, gaveUp });
  }, [guesses, won, gaveUp, mode, hydrated]);

  const guessedRanks = guesses.map(g => g.game.rank);
  const gameOver = won || gaveUp;

  const handleGuess = useCallback((game: Game) => {
    if (gameOver) return;
    const result = compareGames(game, answer);
    const nextGuesses = [...guesses, result];
    setGuesses(nextGuesses);

    if (!result.correct) {
      // Show a quip after the row finishes revealing
      // Delay = row offset + all cells revealed + small buffer
      const ROW_OFFSET_MS  = 400;
      const CELL_STAGGER_MS = 350;
      const TOTAL_CELLS    = 8;
      const revealDelay = nextGuesses.length * ROW_OFFSET_MS + TOTAL_CELLS * CELL_STAGGER_MS + 300;
      setTimeout(() => {
        const quip = getRandomQuip(lastQuipText.current);
        lastQuipText.current = quip.text;
        setActiveQuip(quip);
      }, revealDelay);
    }

    if (result.correct) {
      setWon(true);
      // Award Waffle House Points
      const earned = calcRoundPoints(nextGuesses, true, false);
      setWhp(prev => {
        const next = { total: prev.total + earned, lastEarned: earned };
        saveWHP(next);
        return next;
      });

      // Update streak (daily mode only)
      if (mode === 'daily') {
        setStreak(prev => {
          const yesterday = new Date();
          yesterday.setUTCDate(yesterday.getUTCDate() - 1);
          const yDate = yesterday.toISOString().slice(0, 10);
          const today = todayUTC();

          const wasYesterday = prev.lastDate === yDate;
          const wasToday = prev.lastDate === today;
          if (wasToday) return prev; // already counted

          const newCurrent = wasYesterday ? prev.current + 1 : 1;
          const newBest = Math.max(prev.best, newCurrent);
          const next: Streak = { current: newCurrent, best: newBest, lastDate: today };
          saveStreak(next);
          return next;
        });
      }
    }
  }, [answer, guesses, gameOver, mode]);

  const handleGiveUp = useCallback(() => {
    if (gameOver) return;
    setGaveUp(true);
    // Award (reduced) Waffle House Points for effort
    const earned = calcRoundPoints(guesses, false, true);
    setWhp(prev => {
      const next = { total: Math.max(0, prev.total + earned), lastEarned: earned };
      saveWHP(next);
      return next;
    });

    // Break streak
    if (mode === 'daily') {
      setStreak(prev => {
        const today = todayUTC();
        if (prev.lastDate === today) return prev; // already resolved today
        const next: Streak = { current: 0, best: prev.best, lastDate: today };
        saveStreak(next);
        return next;
      });
    }
  }, [gameOver, mode]);

  const handleNewGame = useCallback(() => {
    const next = getRandomGame(GAMES, []);
    setAnswer(next);
    setGuesses([]);
    setWon(false);
    setGaveUp(false);
  }, []);

  const handleModeSwitch = useCallback((newMode: GameMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setGuesses([]);
    setWon(false);
    setGaveUp(false);

    if (newMode === 'daily') {
      setAnswer(getTodaysGame(GAMES));
      // Re-load any saved daily state
      const savedState = loadDailyState();
      if (savedState) {
        setGuesses(savedState.guesses);
        setWon(savedState.won);
        setGaveUp(savedState.gaveUp);
      }
    } else {
      setAnswer(getRandomGame(GAMES, []));
    }
  }, [mode]);

  const t = useT();

  return (
    <div
      className="min-h-screen text-white relative"
      style={{
        backgroundImage: 'url(/WaffleHouse.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay so the game content stays readable */}
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />

      {/* Left side image */}
      <img
        src="/CaseohPlushie.png"
        alt="CaseOh Plushie"
        className="fixed left-4 bottom-0 object-contain pointer-events-none select-none z-10"
        style={{ width: '28rem', maxHeight: '120vh' }}
      />

      {/* Right side image */}
      <img
        src="/Caseoh_Pose1.png"
        alt="CaseOh Pose"
        className="fixed right-4 bottom-0 w-56 object-contain pointer-events-none select-none z-10"
        style={{ maxHeight: '60vh' }}
      />

      {/* Main content */}
      <div className="relative z-20">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Content panel — dark backdrop for readability */}
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-6 py-6 flex flex-col gap-6">

        {/* ── Top-right controls: sound toggle + language selector ── */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Disable sound clips' : 'Enable sound clips'}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-black/40 border border-game-border hover:bg-black/60 transition-colors text-lg"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <LanguageSelector />
        </div>

        {/* ── Header ── */}
        <header className="text-center space-y-1">
          <img
            src="/caseoh.png"
            alt="CaseOh"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-2 ring-2 ring-game-border"
          />
          <h1 className="text-4xl font-black tracking-tight text-white">
            Case<span className="text-accent">Ohdle</span>
          </h1>
          <p className="text-slate-200 text-sm">{t.subtitle}</p>
          {mode === 'daily' && (
            <p className="text-xs text-slate-400">{t.dayLabel(dayNumber)}</p>
          )}
          {/* Waffle House Points */}
          {hydrated && (
            <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
              🧇 {formatWHP(whp.total)} Waffle House Points
            </div>
          )}
        </header>

        {/* ── Streak badge (daily only) ── */}
        {mode === 'daily' && hydrated && (streak.current > 0 || streak.best > 0) && (
          <div className="flex justify-center gap-4 text-sm">
            <span className="bg-game-card border border-game-border rounded-lg px-3 py-1.5 text-slate-300">
              {t.streak}: <span className="text-white font-semibold">{streak.current}</span>
            </span>
            <span className="bg-game-card border border-game-border rounded-lg px-3 py-1.5 text-slate-300">
              {t.best}: <span className="text-white font-semibold">{streak.best}</span>
            </span>
          </div>
        )}

        {/* ── Mode toggle ── */}
        <div className="flex justify-center">
          <div className="flex rounded-lg bg-game-surface border border-game-border p-0.5 gap-0.5">
            {(['daily', 'unlimited'] as GameMode[]).map(m => (
              <button
                key={m}
                onClick={() => handleModeSwitch(m)}
                className={`
                  px-4 py-1.5 rounded text-sm font-medium transition-all
                  ${mode === m
                    ? 'bg-game-card text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'}
                `}
              >
                {m === 'daily' ? t.modeDaily : t.modeUnlimited}
              </button>
            ))}
          </div>
        </div>

        {/* ── How to play blurb ── */}
        <p className="text-center text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          {t.blurb}
        </p>

        {/* ── Input ── */}
        {!gameOver && (
          <GuessInput guessedRanks={guessedRanks} onGuess={handleGuess} />
        )}

        {/* ── Give Up button ── */}
        {!gameOver && guesses.length >= 3 && (
          <div className="flex justify-center">
            <button
              onClick={handleGiveUp}
              className="
                text-xs text-slate-600 hover:text-red-400
                border border-transparent hover:border-red-900/40
                px-3 py-1.5 rounded transition-all
              "
            >
              {t.giveUp}
            </button>
          </div>
        )}

        {/* ── Hint panel — visible after 5 guesses ── */}
        <HintPanel
          gameName={answer.game}
          guessCount={guesses.length}
          gameOver={gameOver}
        />

        {/* ── Guess grid ── */}
        <GuessGrid guesses={guesses} soundEnabled={soundEnabled} />

        {/* ── Color legend ── */}
        <ColorLegend />

        {/* ── Win / loss reveal ── */}
        {gameOver && (
          <WinReveal
            answer={answer}
            guesses={guesses}
            won={won}
            gaveUp={gaveUp}
            mode={mode}
            dayNumber={dayNumber}
            pointsEarned={whp.lastEarned}
            onNewGame={mode === 'unlimited' ? handleNewGame : undefined}
          />
        )}

        {/* ── About ── */}
        <AboutSection />

        </div>{/* end content panel */}
      </div>
      </div>

      {/* Konami Code easter egg — global key listener */}
      <KonamiEgg />

      {/* Wrong-guess quip toast */}
      <GuessQuip quip={activeQuip} onDismiss={() => setActiveQuip(null)} />
    </div>
  );
}
