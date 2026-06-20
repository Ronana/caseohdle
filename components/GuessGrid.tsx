'use client';

import type { GuessResult } from '@/lib/types';
import GuessRow from './GuessRow';
import { useT } from '@/lib/LanguageContext';

interface Props {
  guesses: GuessResult[];
  soundEnabled: boolean;
}

export default function GuessGrid({ guesses, soundEnabled }: Props) {
  const t = useT();

  const HEADERS = [
    { label: t.colGame,      width: 'w-[200px] flex-none' },
    { label: t.colGenre,     width: 'w-[80px]  flex-none' },
    { label: t.colPlatform,  width: 'w-[80px]  flex-none' },
    { label: t.colYear,      width: 'w-[80px]  flex-none' },
    { label: t.colDeveloper, width: 'w-[80px]  flex-none' },
    { label: t.colViewers,   width: 'w-[80px]  flex-none' },
    { label: t.colHours,     width: 'w-[80px]  flex-none' },
    { label: t.colLastSeen,  width: 'w-[80px]  flex-none' },
  ];

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="inline-flex flex-col gap-1.5 min-w-max mx-auto">

        {/* Column headers */}
        <div className="flex gap-1.5 px-0.5">
          {HEADERS.map(h => (
            <div
              key={h.label}
              className={`
                ${h.width} h-7 flex items-center justify-center
                text-[10px] font-semibold tracking-wider uppercase
                text-slate-500
              `}
            >
              {h.label}
            </div>
          ))}
        </div>

        {/* Guess rows */}
        {guesses.map((result, i) => (
          <GuessRow key={`${result.game.rank}-${i}`} result={result} index={i} soundEnabled={soundEnabled} />
        ))}

        {/* Empty state */}
        {guesses.length === 0 && (
          <p className="text-slate-600 text-sm text-center py-6 italic">
            {t.startGuessing}
          </p>
        )}
      </div>
    </div>
  );
}
