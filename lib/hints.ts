/**
 * Generates up to 3 progressive title hints for a given game name.
 *
 * Hint 1 — First letter:     "The title starts with 'M'"
 * Hint 2 — Word count:       "The title has 2 words"
 * Hint 3 — Title pattern:    "G_______ O___ I_"
 *                             (first letter of each word visible, rest = underscores,
 *                              numbers + punctuation shown as-is)
 */

export interface Hint {
  index:   number;  // 1, 2, or 3
  label:   string;  // short heading shown above the value
  value:   string;  // the revealed info
}

/** Build the masked title pattern for hint 3.
 *  e.g. "Getting Over It"  →  "G_______ O___ I_"
 *       "60 Seconds!"      →  "60 S_______!"
 */
function titlePattern(name: string): string {
  const words = name.split(' ');
  return words
    .map(word => {
      let result   = '';
      let firstLetter = true;
      for (const ch of word) {
        if (/[a-zA-Z]/.test(ch)) {
          result     += firstLetter ? ch : '_';
          firstLetter = false;
        } else {
          // Numbers, punctuation — show as-is, don't count as "first letter"
          result += ch;
        }
      }
      return result;
    })
    .join(' ');
}

/** Returns the array of all 3 hints for a game name. */
export function getHints(gameName: string): Hint[] {
  const wordCount = gameName.trim().split(/\s+/).length;

  return [
    {
      index: 1,
      label: 'First letter',
      value: `The title starts with "${gameName.trim()[0].toUpperCase()}"`,
    },
    {
      index: 2,
      label: 'Word count',
      value: `The title has ${wordCount} ${wordCount === 1 ? 'word' : 'words'}`,
    },
    {
      index: 3,
      label: 'Title pattern',
      value: titlePattern(gameName),
    },
  ];
}
