import { NextRequest, NextResponse } from 'next/server';

// In-memory cache — survives for the lifetime of the server process.
// Keys are lowercased game names; values are Steam capsule URLs (or null = not found).
const cache = new Map<string, string | null>();

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name') ?? '';
  if (!name) return NextResponse.json({ imageUrl: null });

  const key = name.toLowerCase();
  if (cache.has(key)) {
    return NextResponse.json({ imageUrl: cache.get(key) });
  }

  try {
    const res = await fetch(
      `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(name)}&l=english&cc=US`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json() as { items?: { id: number; name: string }[] };
    const item = data.items?.[0] ?? null;
    const imageUrl = item
      ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${item.id}/capsule_sm_120.jpg`
      : null;
    cache.set(key, imageUrl);
    return NextResponse.json({ imageUrl });
  } catch {
    cache.set(key, null);
    return NextResponse.json({ imageUrl: null });
  }
}
