/**
 * Wrong-guess quips — shown after each incorrect guess.
 *
 * To attach an audio clip to a quip:
 *  1. Drop the file in /public/quips/  (e.g. caseoh-noway.mp3)
 *  2. Set  audio: '/quips/caseoh-noway.mp3'  on the quip object.
 *
 * Audio files play alongside the quip toast automatically.
 * Quips without an `audio` field are text-only.
 */

export interface Quip {
  text: string;
  audio?: string; // path relative to /public, e.g. '/quips/caseoh-noway.mp3'
}

export const QUIPS: Quip[] = [
  { text: 'bro really thought he had it 💀' },
  { text: 'the delusion is REAL' },
  { text: 'not even close, buddy' },
  { text: 'CaseOh has never heard of that game in his life' },
  { text: 'my brother in Christ that is not it' },
  { text: 'WRONG. try again.' },
  { text: 'chat is crying rn' },
  { text: 'the confidence was there, the answer was not' },
  { text: 'bro is cooked 💀' },
  { text: 'he is NOT gonna get this' },
  { text: 'skill issue' },
  { text: 'that one hurt to watch ngl' },
  { text: 'imagine guessing that 💀' },
  { text: 'literally anyone else would have got that right' },
  { text: 'OMEGALUL' },
  { text: "you're built different (not in a good way)" },
  { text: 'bro needs a hint' },
  { text: 'this is going to take a while...' },
  { text: 'CaseOh is watching and he is disappointed' },
  { text: 'chat is typing "skill issue" rn' },
  { text: 'I believe in you. Actually no I don\'t.' },
  { text: 'you have no idea do you' },
  { text: 'LMAOOO how' },
  { text: 'we are so cooked' },
  { text: 'at least you tried' },
];

/** Returns a random quip, optionally excluding the last shown one */
export function getRandomQuip(lastText?: string): Quip {
  const pool = lastText
    ? QUIPS.filter(q => q.text !== lastText)
    : QUIPS;
  return pool[Math.floor(Math.random() * pool.length)];
}
