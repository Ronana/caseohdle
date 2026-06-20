'use client';

import { useState, useEffect, useRef } from 'react';
import type { GuessResult, CellStatus } from '@/lib/types';
import { formatViewers, formatHours, formatLastSeen } from '@/lib/gameLogic';
import { getEasterEgg } from '@/lib/easterEggs';
import { getGameSound } from '@/lib/gameSounds';

const STATUS_BG: Record<CellStatus, string> = {
  match:   'bg-cell-match text-white',
  partial: 'bg-cell-partial text-white',
  higher:  'bg-cell-dir text-white',
  lower:   'bg-cell-dir text-white',
  none:    'bg-cell-none text-slate-400',
};

const ARROW: Record<CellStatus, string> = {
  higher: ' ▲',
  lower:  ' ▼',
  match: '', partial: '', none: '',
};

// ms between each cell reveal
const CELL_STAGGER = 350;
// extra ms offset per row so row 2 starts after row 1 finishes
const ROW_OFFSET = 400;

interface CellProps {
  status: CellStatus;
  primary: string;
  sub?: string;
  visible: boolean;
}

function Cell({ status, primary, sub, visible }: CellProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-0.5
        min-w-[80px] h-14 px-1 rounded text-center text-xs font-medium
        transition-all duration-300
        ${visible ? `${STATUS_BG[status]} animate-pop` : 'bg-game-surface opacity-0'}
      `}
    >
      {visible && (
        <>
          <span className="leading-tight truncate max-w-full px-1">
            {primary}{ARROW[status]}
          </span>
          {sub && (
            <span className="text-[10px] opacity-60 truncate max-w-full px-1">{sub}</span>
          )}
        </>
      )}
    </div>
  );
}

interface Props {
  result: GuessResult;
  index: number;
  soundEnabled: boolean;
}

// Total cells: 0=name, 1=genre, 2=platform, 3=year, 4=developer, 5=viewers, 6=hours, 7=last_seen
const TOTAL_CELLS = 8;

export default function GuessRow({ result, index, soundEnabled }: Props) {
  const { game, columns } = result;
  const [revealedCount, setRevealedCount] = useState(0);
  const [showEgg, setShowEgg] = useState(false);
  const [gameImageUrl, setGameImageUrl] = useState<string | null>(null);
  const egg = getEasterEgg(game.game);
  const soundSrc = getGameSound(game.game);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch Steam thumbnail for this game
  useEffect(() => {
    fetch(`/api/game-image?name=${encodeURIComponent(game.game)}`)
      .then(r => r.json())
      .then((d: { imageUrl: string | null }) => setGameImageUrl(d.imageUrl))
      .catch(() => {});
  }, [game.game]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < TOTAL_CELLS; i++) {
      timers.push(
        setTimeout(() => {
          setRevealedCount(i + 1);
        }, index * ROW_OFFSET + i * CELL_STAGGER)
      );
    }

    const afterReveal = index * ROW_OFFSET + TOTAL_CELLS * CELL_STAGGER + 200;
    const halfReveal = index * ROW_OFFSET + (TOTAL_CELLS / 2) * CELL_STAGGER;

    // Play game sound clip halfway through the reveal animation (if sound is enabled)
    if (soundSrc && soundEnabled) {
      timers.push(
        setTimeout(() => {
          audioRef.current?.play().catch(() => {});
        }, halfReveal)
      );
    }

    // Show easter egg after all cells reveal
    if (egg) {
      timers.push(
        setTimeout(() => setShowEgg(true), afterReveal)
      );
    }
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = (cell: number) => revealedCount > cell;

  return (
    <div className="flex flex-col gap-1">
      {/* Pre-load game sound so it plays instantly on trigger */}
      {soundSrc && (
        <audio ref={audioRef} src={soundSrc} preload="auto" className="hidden" />
      )}
      <div className="flex gap-1.5">
        {/* Game name — reveals first */}
        <div
          className={`
            flex items-center gap-2 w-[200px] flex-none h-14 px-2 rounded text-xs
            transition-all duration-300
            ${visible(0)
              ? 'bg-game-card border border-game-border opacity-100 animate-pop'
              : 'bg-game-surface opacity-0'}
          `}
        >
          {visible(0) && (
            <>
              {/* Game thumbnail */}
              <div className="flex-shrink-0 w-12 h-9 rounded overflow-hidden bg-game-surface">
                {gameImageUrl && (
                  <img
                    src={gameImageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
              {/* Name + rank */}
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-white truncate leading-tight">{game.game}</span>
                <span className="text-slate-500 text-[10px]">#{game.rank}</span>
              </div>
            </>
          )}
        </div>

        <Cell status={columns.genre.status}          primary={String(columns.genre.value ?? '?')}                                            visible={visible(1)} />
        <Cell status={columns.platform.status}       primary={String(columns.platform.value ?? '?')}                                         visible={visible(2)} />
        <Cell status={columns.release_year.status}   primary={columns.release_year.value != null ? String(columns.release_year.value) : '?'} visible={visible(3)} />
        <Cell status={columns.developer.status}      primary={String(columns.developer.value ?? '?')}                                        visible={visible(4)} />
        <Cell status={columns.avg_viewers.status}    primary={formatViewers(columns.avg_viewers.value as number | null)}                     visible={visible(5)} />
        <Cell status={columns.hours_streamed.status} primary={formatHours(columns.hours_streamed.value as number | null)}                    visible={visible(6)} />
        <Cell status={columns.last_seen.status}      primary={formatLastSeen(columns.last_seen.value as string | null)}                      visible={visible(7)} />
      </div>

      {/* Easter egg comment */}
      {egg && showEgg && (
        <div className="animate-slide-in text-xs text-amber-300 pl-2 py-0.5 flex items-center gap-1.5">
          <span>{egg.emoji}</span>
          <span>{egg.message}</span>
        </div>
      )}
    </div>
  );
}
