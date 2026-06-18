'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
}

const PARTICLE_COUNT  = 55;
const GRAVITY         = 0.015;   // barely any gravity
const MAX_FALL_SPEED  = 1.4;     // terminal velocity — never faster than this
const DURATION_MS     = 11000;   // 11 seconds total

function makeParticle(canvasWidth: number): Particle {
  return {
    // Spawn just above the top edge, staggered so they don't all enter at once
    x:             Math.random() * canvasWidth,
    y:             -30 - Math.random() * 350,
    vx:            (Math.random() - 0.5) * 1.8,
    vy:            0.3 + Math.random() * 0.7,   // very slow initial fall: 0.3–1.0
    rotation:      Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.05,
    size:          36 + Math.random() * 28,
    opacity:       1,
  };
}

export default function WaffleConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
          // Gravity with terminal velocity cap
          p.vy        = Math.min(p.vy + GRAVITY, MAX_FALL_SPEED);
          p.x        += p.vx;
          p.y        += p.vy;
          p.rotation += p.rotationSpeed;

          // Fade out in the last 20 % of the run
          p.opacity = progress > 0.80
            ? 1 - (progress - 0.80) / 0.20
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
