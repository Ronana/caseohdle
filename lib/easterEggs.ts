/**
 * Easter egg reactions for specific game guesses.
 * Keys are lowercase game names (partial match supported).
 */

interface EasterEgg {
  message: string;
  emoji: string;
}

// Exact match map (lowercase game name → reaction)
const EXACT: Record<string, EasterEgg> = {
  'minecraft': {
    message: "Bro really opened with Minecraft 💀",
    emoji: '⛏️',
  },
  'among us': {
    message: "kinda sus ngl",
    emoji: '🔴',
  },
  'getting over it with bennett foddy': {
    message: "CHAT HE'S GOING INSANE 😭",
    emoji: '🪣',
  },
  'grand theft auto v': {
    message: "He's a criminal AND he can't guess 💀",
    emoji: '🚓',
  },
  'roblox': {
    message: "IT'S LITERALLY ROBLOX BRO 😭",
    emoji: '🧱',
  },
  'fortnite': {
    message: "No shot he guessed Fortnite fr",
    emoji: '🏗️',
  },
  'fall guys': {
    message: "You fell off AND you fell guys",
    emoji: '🫘',
  },
  'the sims 4': {
    message: "Be so fr rn",
    emoji: '🏠',
  },
  'subnautica': {
    message: "CHAT THE OCEAN JUMPSCARE 😭",
    emoji: '🐟',
  },
  "five nights at freddy's": {
    message: "FNAF?? in this economy??",
    emoji: '🐻',
  },
  'friday night funkin\'': {
    message: "This ain't it chief",
    emoji: '🎵',
  },
  'doki doki literature club': {
    message: "Did NOT expect that guess bro",
    emoji: '📚',
  },
  'goat simulator': {
    message: "BAAAAAH 🐐",
    emoji: '🐐',
  },
  'goat simulator 3': {
    message: "BAAAAAH 🐐",
    emoji: '🐐',
  },
  'devour': {
    message: "bro found it 👀",
    emoji: '😈',
  },
  'phasmophobia': {
    message: "THE GHOST IS REAL 👻",
    emoji: '👻',
  },
  'lethal company': {
    message: "QUOTA NOT MET 💀",
    emoji: '🏭',
  },
  'only up!': {
    message: "chat this is the longest game ever played",
    emoji: '📈',
  },
  'stumble guys': {
    message: "bro confused stumble guys and fall guys 💀",
    emoji: '🤦',
  },
  'just chatting': {
    message: "THAT IS NOT A GAME BRO 😭",
    emoji: '💬',
  },
  'clubhouse games: 51 worldwide classics': {
    message: "...",
    emoji: '🎲',
  },
  'powerwash simulator': {
    message: "ASMR mode activated 💦",
    emoji: '🚿',
  },
  'i am fish': {
    message: "FISH MAN 🐟",
    emoji: '🐟',
  },
  'human: fall flat': {
    message: "Just like his diet plan 💀",
    emoji: '🧍',
  },
  'funny bunny': {
    message: "very funny, very bunny",
    emoji: '🐰',
  },
};

// Partial match keywords (if game name contains this → reaction)
const PARTIAL: Array<{ keyword: string; egg: EasterEgg }> = [
  { keyword: 'simulator',  egg: { message: "Another simulator. Of course.", emoji: '🎮' } },
  { keyword: 'fnaf',       egg: { message: "FNAF?? in this economy??", emoji: '🐻' } },
  { keyword: 'call of duty', egg: { message: "WHAT IS HE DOING 💀", emoji: '🔫' } },
  { keyword: 'pokemon',    egg: { message: "GOTTA GUESS EM ALL 🎮", emoji: '🔴' } },
  { keyword: 'mario',      egg: { message: "IT'S A ME, WRONG ANSWER", emoji: '🍄' } },
  { keyword: 'sonic',      egg: { message: "Gotta guess fast 💨", emoji: '💨' } },
  { keyword: 'horror',     egg: { message: "He's scared AND wrong 👻", emoji: '👻' } },
  { keyword: 'cooking',    egg: { message: "WAFFLE HOUSE MENU UNLOCKED 🧇", emoji: '🧇' } },
];

export function getEasterEgg(gameName: string): EasterEgg | null {
  const lower = gameName.toLowerCase();

  // Exact match first
  if (EXACT[lower]) return EXACT[lower];

  // Partial keyword match
  for (const { keyword, egg } of PARTIAL) {
    if (lower.includes(keyword)) return egg;
  }

  return null;
}
