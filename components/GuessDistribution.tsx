'use client';

interface Props {
  distribution: Record<string, number>; // '1'..'10+','X' → count
  myKey: string;                         // the current player's bucket, e.g. '3' or 'X'
}

const BUCKETS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+', 'X'];

export default function GuessDistribution({ distribution, myKey }: Props) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  const maxCount = Math.max(...BUCKETS.map(b => distribution[b] ?? 0), 1);

  return (
    <div className="w-full space-y-1.5">
      <p className="text-slate-400 text-xs uppercase tracking-wider text-center mb-3">
        Guess Distribution
      </p>

      {BUCKETS.map(bucket => {
        const count = distribution[bucket] ?? 0;
        if (count === 0 && bucket !== myKey) return null;

        const pct     = Math.round((count / maxCount) * 100);
        const isMe    = bucket === myKey;
        const isGaveUp = bucket === 'X';

        return (
          <div key={bucket} className="flex items-center gap-2 text-xs">
            {/* Label */}
            <span
              className={`w-7 text-right font-mono shrink-0 ${
                isMe ? 'text-white font-bold' : 'text-slate-500'
              }`}
            >
              {bucket}
            </span>

            {/* Bar */}
            <div className="flex-1 h-6 bg-game-surface rounded overflow-hidden">
              <div
                className={`h-full rounded flex items-center justify-end pr-2 transition-all duration-700 ${
                  isMe
                    ? isGaveUp
                      ? 'bg-red-500'
                      : 'bg-accent'
                    : 'bg-game-border'
                }`}
                style={{ width: count === 0 ? '0%' : `max(${pct}%, 2rem)` }}
              >
                {count > 0 && (
                  <span
                    className={`text-[11px] font-semibold ${
                      isMe ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <p className="text-slate-600 text-xs text-center pt-1">
        {total} {total === 1 ? 'player' : 'players'} today
      </p>
    </div>
  );
}
