import type { GuessResult, CellStatus } from './types';

// ─── Colours ────────────────────────────────────────────────────────────────

const C = {
  bg:      '#0b0d14',
  card:    '#141720',
  border:  '#252b3b',
  white:   '#ffffff',
  muted:   '#64748b',
  accent:  '#6366f1',
  yellow:  '#facc15',
  // Cell backgrounds
  match:   '#16a34a',
  partial: '#d97706',
  dir:     '#2563eb',
  none:    '#1e2535',
};

const TIER_HEX: Record<string, string> = {
  'LEGENDARY 👑':          '#facc15',
  'POGGERS 🎉':            '#34d399',
  'Respectable 👍':        '#60a5fa',
  'Barely Surviving 😅':   '#fbbf24',
  'Cooked 💀':             '#f97316',
  'Perma-Banned 🔨':       '#ef4444',
};

const CELL_BG: Record<CellStatus, string> = {
  match:   C.match,
  partial: C.partial,
  higher:  C.dir,
  lower:   C.dir,
  none:    C.none,
};

const EMOJI_CHAR: Record<CellStatus, string> = {
  match: '🟩', partial: '🟨', higher: '🔵', lower: '🔵', none: '⬜',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export interface ShareImageParams {
  guesses:    GuessResult[];
  won:        boolean;
  gaveUp:     boolean;
  dayNumber:  number;
  mode:       'daily' | 'unlimited';
  tierLabel:  string;
  whpEarned:  number;
}

/**
 * Renders a branded share card and returns it as a PNG Blob.
 * Must be called in a browser context (uses document.createElement).
 */
export async function generateShareImage(p: ShareImageParams): Promise<Blob | null> {
  // ── Layout constants (logical px — we render at 2× for retina) ─────────────
  const W        = 500;
  const PAD      = 28;
  const INNER_W  = W - PAD * 2;

  const CELL_SIZE = 36;
  const CELL_GAP  =  5;
  const CELLS_PER_ROW = Object.keys(p.guesses[0]?.columns ?? {}).length || 8;
  const ROW_H     = CELL_SIZE + CELL_GAP;
  const GRID_H    = p.guesses.length * ROW_H;

  const H = PAD           // top padding
    + 36                  // title
    + 8                   // title → subtitle gap
    + 20                  // subtitle
    + 24                  // subtitle → grid gap
    + GRID_H
    + 24                  // grid → stats gap
    + 56                  // stats row
    + 20                  // stats → footer gap
    + 18                  // footer
    + PAD;                // bottom padding

  // ── Canvas setup ────────────────────────────────────────────────────────────
  const canvas  = document.createElement('canvas');
  const SCALE   = 2;
  canvas.width  = W * SCALE;
  canvas.height = H * SCALE;

  const ctx = canvas.getContext('2d')!;
  ctx.scale(SCALE, SCALE);

  // ── Background ──────────────────────────────────────────────────────────────
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // Card surface
  roundRect(ctx, PAD / 2, PAD / 2, W - PAD, H - PAD, 16);
  ctx.fillStyle = C.card;
  ctx.fill();
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  ctx.stroke();

  let y = PAD + 36;

  // ── Title: "Case" + "Ohdle" ──────────────────────────────────────────────────
  ctx.textAlign = 'center';
  ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';

  // Measure both halves so we can centre them together
  const caseW  = ctx.measureText('Case').width;
  const ohW    = ctx.measureText('Ohdle').width;
  const totalW = caseW + ohW;
  const startX = W / 2 - totalW / 2;

  ctx.textAlign = 'left';
  ctx.fillStyle = C.white;
  ctx.fillText('Case', startX, y);
  ctx.fillStyle = C.accent;
  ctx.fillText('Ohdle', startX + caseW, y);

  y += 10;

  // ── Subtitle (day / mode) ────────────────────────────────────────────────────
  ctx.textAlign = 'center';
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = C.muted;
  const subtitle = p.mode === 'daily'
    ? `Daily Puzzle #${p.dayNumber} — ${p.won ? p.guesses.length : 'X'}/∞`
    : `Unlimited Mode — ${p.won ? p.guesses.length : 'X'}/∞`;
  ctx.fillText(subtitle, W / 2, y + 16);

  y += 16 + 24;

  // ── Emoji grid ───────────────────────────────────────────────────────────────
  const gridW   = CELLS_PER_ROW * (CELL_SIZE + CELL_GAP) - CELL_GAP;
  const gridX   = (W - gridW) / 2;

  for (const guess of p.guesses) {
    const statuses = Object.values(guess.columns).map(c => c.status);
    for (let ci = 0; ci < statuses.length; ci++) {
      const status = statuses[ci];
      const cx = gridX + ci * (CELL_SIZE + CELL_GAP);

      // Cell background
      roundRect(ctx, cx, y, CELL_SIZE, CELL_SIZE, 5);
      ctx.fillStyle = CELL_BG[status];
      ctx.fill();

      // Emoji character centred in cell
      ctx.font      = `${CELL_SIZE * 0.62}px serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = C.white;
      ctx.fillText(EMOJI_CHAR[status], cx + CELL_SIZE / 2, y + CELL_SIZE * 0.75);
    }
    y += ROW_H;
  }

  y += 24;

  // ── Stats row ────────────────────────────────────────────────────────────────
  const stats = [
    { label: 'GUESSES',        value: p.won ? String(p.guesses.length) : 'X', colour: C.white },
    { label: 'RATING',         value: p.tierLabel,                             colour: TIER_HEX[p.tierLabel] ?? C.white },
    { label: '🧇 WHP EARNED',  value: `+${formatWHPLocal(p.whpEarned)}`,       colour: C.yellow },
  ];

  const colW = INNER_W / stats.length;

  for (let i = 0; i < stats.length; i++) {
    const cx = PAD + colW * i + colW / 2;

    ctx.textAlign = 'center';
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = C.muted;
    ctx.fillText(stats[i].label, cx, y + 12);

    ctx.font = `bold 18px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = stats[i].colour;
    ctx.fillText(stats[i].value, cx, y + 36);
  }

  y += 56 + 20;

  // ── Footer ───────────────────────────────────────────────────────────────────
  ctx.textAlign = 'center';
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = C.muted;
  ctx.fillText('caseohdle.vercel.app', W / 2, y);

  // ── Export ───────────────────────────────────────────────────────────────────
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/png');
  });
}

function formatWHPLocal(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
