'use client';

import { useEffect, useRef } from 'react';
import type { Quip } from '@/lib/quips';

interface Props {
  quip: Quip | null;
  onDismiss: () => void;
}

const DISPLAY_MS = 3500; // how long the toast stays visible

export default function GuessQuip({ quip, onDismiss }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-dismiss after DISPLAY_MS
  useEffect(() => {
    if (!quip) return;
    const id = setTimeout(onDismiss, DISPLAY_MS);
    return () => clearTimeout(id);
  }, [quip, onDismiss]);

  // Play audio when quip changes
  useEffect(() => {
    if (!quip?.audio) return;
    audioRef.current?.play().catch(() => {});
  }, [quip]);

  if (!quip) return null;

  return (
    <>
      {/* Hidden audio element — pre-loaded when quip has audio */}
      {quip.audio && (
        <audio
          key={quip.audio}
          ref={audioRef}
          src={quip.audio}
          preload="auto"
          className="hidden"
        />
      )}

      {/* Toast */}
      <div
        className="
          fixed bottom-8 left-1/2 -translate-x-1/2 z-50
          animate-slide-in
          px-5 py-3 rounded-xl
          bg-black/80 border border-game-border
          backdrop-blur-sm shadow-2xl shadow-black/60
          text-white text-sm font-medium
          pointer-events-none
          max-w-xs text-center
        "
      >
        💬 {quip.text}
      </div>
    </>
  );
}
