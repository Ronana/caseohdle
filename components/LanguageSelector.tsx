'use client';

import { useState, useRef, useEffect } from 'react';
import { LANGUAGES } from '@/lib/translations';
import { useLang } from '@/lib/LanguageContext';

export default function LanguageSelector() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Current flag button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-game-border hover:bg-black/60 transition-colors text-sm"
        title="Select language"
      >
        <span className="text-xl leading-none">{current.flag}</span>
        <span className="text-slate-300 text-xs hidden sm:inline">{current.name}</span>
        <span className="text-slate-500 text-[10px]">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-1 w-40 rounded-lg border border-game-border bg-game-card shadow-2xl shadow-black/60 overflow-hidden animate-slide-in">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left
                ${l.code === lang
                  ? 'bg-game-border text-white'
                  : 'text-slate-300 hover:bg-game-surface hover:text-white'}
              `}
            >
              <span className="text-xl leading-none">{l.flag}</span>
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
