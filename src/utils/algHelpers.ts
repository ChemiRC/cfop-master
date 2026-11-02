export interface TriggerSegment {
  type: 'trigger' | 'moves';
  moves: string[];
  triggerName?: string;
}

interface TriggerPattern {
  name: string;
  sequence: string[];
}

const TRIGGER_PATTERNS: TriggerPattern[] = [
  {
    name: 'Sexy Move',
    sequence: ['R', 'U', "R'", "U'"],
  },
  {
    name: 'Wide Sexy',
    sequence: ['r', 'U', "R'", "U'"],
  },
  {
    name: 'Inverse Sexy',
    sequence: ['U', 'R', "U'", "R'"],
  },
  {
    name: 'Left Sexy',
    sequence: ["L'", "U'", 'L', 'U'],
  },
  {
    name: 'Sledgehammer',
    sequence: ["R'", 'F', 'R', "F'"],
  },
  {
    name: 'Hedgeslammer',
    sequence: ['F', "R'", "F'", 'R'],
  },
  {
    name: 'Sune',
    sequence: ['R', 'U', "R'", 'U', 'R', 'U2', "R'"],
  },
  {
    name: 'Insert R',
    sequence: ['R', 'U', "R'"],
  },
  {
    name: 'Extract R',
    sequence: ['R', "U'", "R'"],
  },
];

const SORTED_PATTERNS = [...TRIGGER_PATTERNS].sort(
  (a, b) => b.sequence.length - a.sequence.length
);

export function splitAlgMoves(alg: string): string[] {
  return alg
    .trim()
    .replace(/[()[\]]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function countAlgMoves(alg: string): number {
  return splitAlgMoves(alg).length;
}

export function segmentAlgWithTriggers(alg: string): TriggerSegment[] {
  const tokens = splitAlgMoves(alg);
  const segments: TriggerSegment[] = [];
  let i = 0;

  while (i < tokens.length) {
    let matched: TriggerPattern | null = null;

    for (const pattern of SORTED_PATTERNS) {
      if (pattern.sequence.length === 3 && tokens.length <= 2) continue;
      const len = pattern.sequence.length;
      if (i + len <= tokens.length) {
        let ok = true;
        for (let j = 0; j < len; j++) {
          if (tokens[i + j] !== pattern.sequence[j]) {
            ok = false;
            break;
          }
        }
        if (ok) {
          matched = pattern;
          break;
        }
      }
    }

    if (matched) {
      segments.push({
        type: 'trigger',
        moves: tokens.slice(i, i + matched.sequence.length),
        triggerName: matched.name,
      });
      i += matched.sequence.length;
    } else {
      const last = segments[segments.length - 1];
      if (last && last.type === 'moves') {
        last.moves.push(tokens[i]);
      } else {
        segments.push({
          type: 'moves',
          moves: [tokens[i]],
        });
      }
      i += 1;
    }
  }

  return segments;
}

/**
 * Refleja un algoritmo Izquierda <-> Derecha (R <-> L, r <-> l, invierte sentido de U/D/F/B/y/z/S/E).
 */
export function mirrorAlgLR(alg: string): string {
  const tokens = splitAlgMoves(alg);

  const swapBase: Record<string, string> = {
    R: 'L',
    L: 'R',
    r: 'l',
    l: 'r',
    U: 'U',
    u: 'u',
    D: 'D',
    d: 'd',
    F: 'F',
    f: 'f',
    B: 'B',
    b: 'b',
    M: 'M',
    E: 'E',
    S: 'S',
    x: 'x',
    y: 'y',
    z: 'z',
  };

  const sameDirectionOnMirror = new Set(['M', 'x']);

  return tokens
    .map((token) => {
      const match = token.match(/^([RLUDFBrludfbMESxyz])(2|')?$/);
      if (!match) return token;
      const [, base, mod = ''] = match;
      const mappedBase = swapBase[base] ?? base;
      if (mod === '2') {
        return `${mappedBase}2`;
      }
      if (sameDirectionOnMirror.has(base)) {
        return `${mappedBase}${mod}`;
      }
      const invertedMod = mod === "'" ? '' : "'";
      return `${mappedBase}${invertedMod}`;
    })
    .join(' ');
}
