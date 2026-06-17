'use client';

import { useState } from 'react';
import { useT } from '@/lib/LanguageContext';

export default function AboutSection() {
  const [open, setOpen] = useState(true);
  const t = useT();

  return (
    <div className="border-t border-game-border pt-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between text-slate-300 hover:text-white transition-colors text-sm font-semibold"
      >
        <span>{t.aboutToggle}</span>
        <span className="text-slate-500 text-xs">{open ? '▲ Hide' : '▼ Show'}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-5 text-sm text-slate-300 animate-slide-in">

          <div>
            <h3 className="text-white font-semibold mb-1">{t.aboutWhatTitle}</h3>
            <p className="leading-relaxed text-slate-400">{t.aboutWhatBody}</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-1">{t.aboutHowTitle}</h3>
            <ul className="text-slate-400 space-y-1 leading-relaxed list-none">
              <li>🟩 <span className="text-white">{t.correct}</span> — exact match</li>
              <li>🟨 <span className="text-white">{t.partial}</span> — partial match (genre overlap)</li>
              <li>🔵 <span className="text-white">{t.higher} ▲ / {t.lower} ▼</span> — close but higher or lower</li>
              <li>⬜ <span className="text-white">{t.incorrect}</span> — no match</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-1">{t.aboutCreditsTitle}</h3>
            <p className="text-slate-400 leading-relaxed">
              {t.aboutCreditsBody.split('TwitchTracker').map((part, i) =>
                i === 0 ? part : (
                  <span key={i}>
                    <a href="https://twitchtracker.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">TwitchTracker</a>
                    {part.split('RAWG').map((p2, j) =>
                      j === 0 ? p2 : (
                        <span key={j}>
                          <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">RAWG</a>
                          {p2.split('Wordle').map((p3, k) =>
                            k === 0 ? p3 : (
                              <span key={k}>
                                <a href="https://wordle.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Wordle</a>
                                {p3.split('Loldle').map((p4, l) =>
                                  l === 0 ? p4 : (
                                    <span key={l}>
                                      <a href="https://loldle.net" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Loldle</a>
                                      {p4}
                                    </span>
                                  )
                                )}
                              </span>
                            )
                          )}
                        </span>
                      )
                    )}
                  </span>
                )
              )}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-1">{t.aboutFeedbackTitle}</h3>
            <p className="text-slate-400 leading-relaxed">
              {t.aboutFeedbackBody}{' '}
              <a href="mailto:ronanfrew1998@gmail.com" className="text-accent hover:underline">
                Send me a message
              </a>.
            </p>
          </div>

          <div className="pt-1">
            <p className="text-slate-400 mb-3">{t.aboutSupport}:</p>
            <a
              href="https://ko-fi.com/frewster"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#FF5E5B' }}
            >
              <img src="https://storage.ko-fi.com/cdn/cup-border.png" alt="Ko-fi" className="w-5 h-5" />
              {t.aboutSupport}
            </a>
          </div>

          <p className="text-slate-600 text-xs pt-1">{t.aboutMadeBy}</p>
        </div>
      )}
    </div>
  );
}
