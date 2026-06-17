'use client';

import { useT } from '@/lib/LanguageContext';

export default function ColorLegend() {
  const t = useT();

  const items = [
    { color: 'bg-cell-match',   label: t.correct,   icon: null },
    { color: 'bg-cell-partial', label: t.partial,   icon: null },
    { color: 'bg-cell-none',    label: t.incorrect, icon: null },
    { color: 'bg-cell-dir',     label: t.higher,    icon: '▲'  },
    { color: 'bg-cell-dir',     label: t.lower,     icon: '▼'  },
  ];

  return (
    <div className="flex justify-center gap-4 flex-wrap">
      {items.map(({ color, label, icon }) => (
        <div key={label} className="flex flex-col items-center gap-1.5">
          <div className={`w-12 h-12 rounded flex items-center justify-center text-white text-lg font-bold ${color}`}>
            {icon ?? ''}
          </div>
          <span className="text-xs text-slate-300">{label}</span>
        </div>
      ))}
    </div>
  );
}
