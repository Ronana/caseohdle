'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number; // rendered px
  opacity: number;
}

const PARTICLE_COUNT = 55;
const GRAVITY = 0.25;
const DURATION_MS = 5000; // total animation length before fade-out completes

function makeParticle(canvasWidth: number): Particle {
  return {
    x: Math.random() * canvasWidth,
    y: -40 - Math.random() * 120,      // start above the screen
    vx: (Math.random() - 0.5) * 5,
    vy: 1.5 + Math.random() * 3,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.12,
    size: 36 + Math.random() * 28,     // 36–64 px
    opacity: 1,
  };
}

export default function WaffleConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill viewport
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const img = new Image();
    img.src = '/waffle.png';

    let animId: number;

    img.onload = () => {
      const particles: Particle[] = Array.from(
        { length: PARTICLE_COUNT },
        () => makeParticle(canvas.width)
      );

      const start = performance.now();

      function draw(now: number) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / DURATION_MS, 1);

        ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

        for (const p of particles) {
          // Physics
          p.vy       += GRAVITY;
          p.x        += p.vx;
          p.y        += p.vy;
          p.rotation += p.rotationSpeed;

          // Fade out in the last 25 % of the run
          p.opacity = progress > 0.75
            ? 1 - (progress - 0.75) / 0.25
            : 1;

          const half = p.size / 2;
          ctx!.save();
          ctx!.globalAlpha = Math.max(0, p.opacity);
          ctx!.translate(p.x, p.y);
          ctx!.rotate(p.rotation);
          ctx!.drawImage(img, -half, -half, p.size, p.size);
          ctx!.restore();
        }

        if (progress < 1) {
          animId = requestAnimationFrame(draw);
        } else {
          ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-40 pointer-events-none"
    />
  );
}
