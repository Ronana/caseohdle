/**
 * Maps exact game names to their sound clip paths in /public/SoundClips/.
 * Add new entries here as you add more clips to the folder.
 * The key must match the `game` field in caseoh_games_final.json exactly.
 */
const GAME_SOUNDS: Record<string, string> = {
  '60 Seconds! Reatomized':   '/SoundClips/caseoh-60-seconds-reatomized.mp3',
  'Contraband Police':         '/SoundClips/caseoh-contraband-police.mp3',
  'TCG Card Shop Simulator':   '/SoundClips/caseoh-tcg-card-shop-sim.mp3',
};

export function getGameSound(gameName: string): string | null {
  return GAME_SOUNDS[gameName] ?? null;
}
