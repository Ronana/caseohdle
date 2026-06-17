import { NextRequest, NextResponse } from 'next/server';

/**
 * Daily stats: total player count + guess distribution.
 *
 * POST body: { date: string, guessCount: number | 'X' }
 *   guessCount = number of guesses to win, or 'X' if the player gave up.
 *   Returns { count, distribution }
 *
 * GET ?date=YYYY-MM-DD
 *   Returns { count, distribution }
 *
 * In-memory only — resets on server restart.
 * To persist across deployments, swap for Vercel KV:
 *   npm i @vercel/kv
 *   import { kv } from '@vercel/kv';
 *   await kv.hincrby(`dist:${date}`, String(guessCount), 1);
 */

interface DayStats {
  count:        number;
  distribution: Record<string, number>; // '1','2',...,'10+','X' → count
}

const stats = new Map<string, DayStats>();

function getOrCreate(date: string): DayStats {
  if (!stats.has(date)) stats.set(date, { count: 0, distribution: {} });
  return stats.get(date)!;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { date?: string; guessCount?: number | string };
    const { date, guessCount } = body;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const day  = getOrCreate(date);
    day.count += 1;

    // Bucket the guess count
    if (guessCount !== undefined && guessCount !== null) {
      const key =
        guessCount === 'X'                       ? 'X'
        : typeof guessCount === 'number' && guessCount >= 10 ? '10+'
        : String(guessCount);
      day.distribution[key] = (day.distribution[key] ?? 0) + 1;
    }

    return NextResponse.json({ count: day.count, distribution: day.distribution });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date') ?? '';
  const day  = stats.get(date) ?? { count: 0, distribution: {} };
  return NextResponse.json({ count: day.count, distribution: day.distribution });
}
