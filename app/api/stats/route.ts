import { NextRequest, NextResponse } from 'next/server';

// Uses Vercel KV (Upstash) in production (KV_REST_API_URL + KV_REST_API_TOKEN env vars).
// Falls back to in-memory Map for local dev.

const KV_AVAILABLE = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// ─── KV helpers ──────────────────────────────────────────────────────────────

async function kvIncrBy(key: string, field: string, by: number): Promise<number> {
  const { kv } = await import('@vercel/kv');
  return kv.hincrby(key, field, by);
}

async function kvGetAll(key: string): Promise<Record<string, number>> {
  const { kv } = await import('@vercel/kv');
  const raw = await kv.hgetall<Record<string, string>>(key);
  if (!raw) return {};
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Number(v)]));
}

async function kvIncr(key: string): Promise<number> {
  const { kv } = await import('@vercel/kv');
  return kv.incr(key);
}

async function kvExpire(key: string, seconds: number): Promise<void> {
  const { kv } = await import('@vercel/kv');
  await kv.expire(key, seconds);
}

// ─── Rate limiter ─────────────────────────────────────────────────────────────
// Fixed-window: max LIMIT POST requests per IP per UTC day, tracked in KV.
// Skipped in local dev (KV not available).

const RATE_LIMIT = 5; // generous — handles edge cases like replaying state

async function isRateLimited(ip: string, date: string): Promise<boolean> {
  if (!KV_AVAILABLE) return false;
  try {
    const key = `rl:${ip}:${date}`;
    const count = await kvIncr(key);
    if (count === 1) await kvExpire(key, 86_400); // expire after 24 h
    return count > RATE_LIMIT;
  } catch {
    // If KV is down, fail open (don't block real users)
    return false;
  }
}

// ─── In-memory fallback (local dev only) ─────────────────────────────────────

interface DayStats { count: number; distribution: Record<string, number> }
const memStore = new Map<string, DayStats>();
function memGet(date: string): DayStats {
  if (!memStore.has(date)) memStore.set(date, { count: 0, distribution: {} });
  return memStore.get(date)!;
}

// ─── Validation helpers ───────────────────────────────────────────────────────

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_BUCKETS = new Set(['1','2','3','4','5','6','7','8','9','10+','X']);

// ─── POST /api/stats ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { date?: unknown; guessCount?: unknown };
    const date = typeof body.date === 'string' ? body.date : '';
    const guessCount = body.guessCount;

    if (!DATE_RE.test(date)) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    // Validate guessCount is one of the known buckets
    const bucket =
      guessCount === 'X'                                    ? 'X'
      : typeof guessCount === 'number' && guessCount >= 10 ? '10+'
      : typeof guessCount === 'number' && guessCount >= 1  ? String(Math.floor(guessCount))
      : null;

    if (bucket !== null && !VALID_BUCKETS.has(bucket)) {
      return NextResponse.json({ error: 'Invalid guessCount' }, { status: 400 });
    }

    // Rate limit by IP (max RATE_LIMIT submissions per IP per day)
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown';

    if (await isRateLimited(ip, date)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    let count: number;
    let distribution: Record<string, number>;

    if (KV_AVAILABLE) {
      const statsKey = 'stats:' + date;
      const distKey  = 'dist:'  + date;
      count = await kvIncrBy(statsKey, 'count', 1);
      if (bucket) await kvIncrBy(distKey, bucket, 1);
      distribution = await kvGetAll(distKey);
    } else {
      const day = memGet(date);
      day.count += 1;
      if (bucket) day.distribution[bucket] = (day.distribution[bucket] ?? 0) + 1;
      count        = day.count;
      distribution = day.distribution;
    }

    return NextResponse.json({ count, distribution });
  } catch (err) {
    console.error('[stats POST]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// ─── GET /api/stats ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date') ?? '';

  // Validate date format before using it as a KV key
  if (!DATE_RE.test(date)) {
    return NextResponse.json({ count: 0, distribution: {} });
  }

  if (KV_AVAILABLE) {
    try {
      const countRaw     = await kvGetAll('stats:' + date);
      const count        = countRaw['count'] ?? 0;
      const distribution = await kvGetAll('dist:' + date);
      return NextResponse.json({ count, distribution });
    } catch (err) {
      console.error('[stats GET]', err);
      return NextResponse.json({ count: 0, distribution: {} });
    }
  }
  const day = memStore.get(date) ?? { count: 0, distribution: {} };
  return NextResponse.json({ count: day.count, distribution: day.distribution });
}
