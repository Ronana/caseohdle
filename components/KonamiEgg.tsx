'use client';

import { useEffect, useState, useRef } from 'react';

const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
];

export default function KonamiEgg() {
  const [active, setActive] = useState(false);
  const inputRef = useRef<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      inputRef.current = [...inputRef.current, e.key].slice(-KONAMI.length);
      if (inputRef.current.join(',') === KONAMI.join(',')) {
        setActive(true);
        audioRef.current?.play().catch(() => {});
        setTimeout(() => setActive(false), 6000);
        inputRef.current = [];
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!active) return (
    // Pre-load the audio silently so it plays instantly on trigger
    // Drop your audio file at /public/caseoh_secret.mp3
    <audio ref={audioRef} src="/caseoh_secret.mp3" preload="auto" className="hidden" />
  );

  return (
    <>
      <audio ref={audioRef} src="/caseoh_secret.mp3" preload="auto" className="hidden" />

      {/* Full-screen overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        {/* Flash background */}
        <div className="absolute inset-0 bg-yellow-400/20 animate-pulse" />

        {/* Giant CaseOh face */}
        <div className="relative text-center animate-bounce">
          <img
            src="/caseoh.png"
            alt="CaseOh"
            className="w-96 h-96 rounded-full object-cover mx-auto ring-8 ring-yellow-400 shadow-2xl shadow-yellow-400/50"
            style={{ filter: 'drop-shadow(0 0 40px gold)' }}
          />
          <p className="text-4xl font-black text-yellow-400 mt-4 drop-shadow-lg">
            YOU FOUND THE SECRET 👀
          </p>
          <p className="text-xl text-white mt-2 drop-shadow-lg">
            ↑↑↓↓←→←→BA
          </p>
        </div>
      </div>
    </>
  );
}
