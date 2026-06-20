'use client';

import { useState } from 'react';
import { getHints, type Hint } from '@/lib/hints';

interface Props {
  gameName:   string;  // the answer — only passed when we're allowed to hint
  guessCount: number;  // kept for potential future use
  gameOver:   boolean;
}

const MAX_HINTS = 3;

export default function HintPanel({ gameName, guessCount, gameOver }: Props) {
  const [revealed, setRevealedCount] = useState(0);

  const hints   = getHints(gameName);
  const canHint = !gameOver;
  const hasMore = revealed < MAX_HINTS;

  const shownHints: Hint[] = hints.slice(0, revealed);

  function revealNext() {
    if (revealed < MAX_HINTS) setRevealedCount(r => r + 1);
  }

  return (
    <div className="flex flex-col items-center gap-3">

      {/* Already-revealed hints */}
      {shownHints.map(hint => (
        <div
          key={hint.index}
          className="w-full max-w-sm animate-slide-in rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center"
        >
          <p className="text-amber-400/70 text-[10px] uppercase tracking-wider mb-1">
            Hint {hint.index} — {hint.label}
          </p>
          <p className="text-amber-300 font-mono text-sm font-semibold tracking-wide">
            {hint.value}
          </p>
        </div>
      ))}

      {/* Button — show while there are more hints and the game isn't over */}
      {canHint && hasMore && (
        <button
          onClick={revealNext}
          className="
            text-xs text-amber-500/70 hover:text-amber-400
            border border-transparent hover:border-amber-800/40
            px-3 py-1.5 rounded transition-all
          "
        >
          💡 {revealed === 0 ? 'Get a hint' : `Get hint ${revealed + 1} of ${MAX_HINTS}`}
        </button>
      )}

      {/* All hints used */}
      {revealed === MAX_HINTS && !gameOver && (
        <p className="text-slate-600 text-xs">No more hints available</p>
      )}
    </div>
  );
}
