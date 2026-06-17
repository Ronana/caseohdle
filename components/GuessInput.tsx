'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Game } from '@/lib/types';
import { GAMES_ALPHA } from '@/lib/games';
import { useT } from '@/lib/LanguageContext';

interface Props {
  guessedRanks: number[];
  onGuess: (game: Game) => void;
}

export default function GuessInput({ guessedRanks, onGuess }: Props) {
  const t = useT();
  const [query, setQuery]       = useState('');
  const [open, setOpen]         = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);
  const inputRef  = useRef<HTMLInputElement>(null);
  const listRef   = useRef<HTMLUListElement>(null);

  const filtered = query.length < 1
    ? []
    : GAMES_ALPHA
        .filter(g => !guessedRanks.includes(g.rank))
        .filter(g => g.game.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10);

  useEffect(() => { setFocusIdx(0); }, [query]);

  const select = useCallback((game: Game) => {
    onGuess(game);
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  }, [onGuess]);

  function handleKey(e: React.KeyboardEvent) {
    if (!open || !filtered.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[focusIdx]) select(filtered[focusIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  // Scroll focused item into view
  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.children[focusIdx] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [focusIdx]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Input */}
      <div className={`
        flex items-center gap-2 rounded-lg border px-3 py-2.5
        bg-game-surface transition-all
        ${open && filtered.length
          ? 'border-accent glow-accent'
          : 'border-game-border focus-within:border-slate-500'}
      `}>
        <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={t.searchPlaceholder}
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKey}
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus(); }}
            className="text-slate-500 hover:text-white transition-colors text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="
            absolute z-50 mt-1 w-full max-h-64 overflow-y-auto
            rounded-lg border border-game-border bg-game-card
            shadow-2xl shadow-black/60
            animate-slide-in
          "
        >
          {filtered.map((game, i) => (
            <li key={game.rank}>
              <button
                className={`
                  w-full text-left px-4 py-2.5 flex items-center gap-3
                  transition-colors text-sm
                  ${i === focusIdx
                    ? 'bg-game-border text-white'
                    : 'text-slate-300 hover:bg-game-surface hover:text-white'}
                `}
                onMouseDown={() => select(game)}
                onMouseEnter={() => setFocusIdx(i)}
              >
                <span className="text-slate-500 text-xs w-8 shrink-0">#{game.rank}</span>
                <span className="truncate">{game.game}</span>
                {game.primary_genre && (
                  <span className="ml-auto text-[10px] text-slate-500 shrink-0">
                    {game.primary_genre}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {open && query.length > 0 && filtered.length === 0 && (
        <div className="
          absolute z-50 mt-1 w-full rounded-lg border border-game-border
          bg-game-card px-4 py-3 text-sm text-slate-500 animate-slide-in
        ">
          No matching games found
        </div>
      )}
    </div>
  );
}
