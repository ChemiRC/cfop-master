import type { LearningStage } from '../types/cfop';
import { splitAlgMoves } from './algHelpers';

export type FaceCode = 'U' | 'D' | 'F' | 'B' | 'R' | 'L';

export interface StickerCell {
  face: FaceCode;
  /** Hex color ready to render in SVG */
  color: string;
  /** True if dimmed/masked out for the current CFOP stage */
  masked: boolean;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface StickerState {
  normal: Vec3;
  homeFace: FaceCode;
  isPrimaryU: boolean;
}

interface CubieState {
  pos: Vec3;
  homePos: Vec3;
  stickers: StickerState[];
}

const FACE_COLORS: Record<FaceCode, string> = {
  U: '#FAFAFA', // Blanco WCA
  D: '#EAB308', // Amarillo Speedcube
  F: '#10B981', // Verde Speedcube
  B: '#3B82F6', // Azul Speedcube
  R: '#EF4444', // Rojo Speedcube
  L: '#F97316', // Naranja Speedcube
};

const DIM_FACE_COLORS: Record<FaceCode, string> = {
  U: '#71717A',
  D: '#854D0E',
  F: '#065F46',
  B: '#1E3A8A',
  R: '#7F1D1D',
  L: '#7C2D12',
};

const IGNORED_COLOR = '#222226';

function createSolvedCube(): CubieState[] {
  const cubies: CubieState[] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        const stickers: StickerState[] = [];
        if (y === 1) {
          stickers.push({
            normal: { x: 0, y: 1, z: 0 },
            homeFace: 'U',
            isPrimaryU: true,
          });
        }
        if (y === -1) {
          stickers.push({
            normal: { x: 0, y: -1, z: 0 },
            homeFace: 'D',
            isPrimaryU: false,
          });
        }
        if (z === 1) {
          stickers.push({
            normal: { x: 0, y: 0, z: 1 },
            homeFace: 'F',
            isPrimaryU: false,
          });
        }
        if (z === -1) {
          stickers.push({
            normal: { x: 0, y: 0, z: -1 },
            homeFace: 'B',
            isPrimaryU: false,
          });
        }
        if (x === 1) {
          stickers.push({
            normal: { x: 1, y: 0, z: 0 },
            homeFace: 'R',
            isPrimaryU: false,
          });
        }
        if (x === -1) {
          stickers.push({
            normal: { x: -1, y: 0, z: 0 },
            homeFace: 'L',
            isPrimaryU: false,
          });
        }
        cubies.push({
          pos: { x, y, z },
          homePos: { x, y, z },
          stickers,
        });
      }
    }
  }
  return cubies;
}

function rotateVec(
  v: Vec3,
  axis: 'x' | 'y' | 'z',
  dir: 1 | -1
): Vec3 {
  if (axis === 'x') {
    // dir = 1 matches R: (y, z) -> (z, -y)
    return dir === 1
      ? { x: v.x, y: v.z, z: -v.y }
      : { x: v.x, y: -v.z, z: v.y };
  }
  if (axis === 'y') {
    // dir = 1 matches U: (x, z) -> (-z, x)
    return dir === 1
      ? { x: -v.z, y: v.y, z: v.x }
      : { x: v.z, y: v.y, z: -v.x };
  }
  // axis === 'z': dir = 1 matches F: (x, y) -> (y, -x)
  return dir === 1
    ? { x: v.y, y: -v.x, z: v.z }
    : { x: -v.y, y: v.x, z: v.z };
}

function applySingleQuantumMove(
  cubies: CubieState[],
  base: string,
  prime: boolean
): void {
  let axis: 'x' | 'y' | 'z' = 'x';
  let baseDir: 1 | -1 = 1;
  let matchLayer: (p: Vec3) => boolean = () => false;

  switch (base) {
    case 'R':
      axis = 'x';
      baseDir = 1;
      matchLayer = (p) => p.x === 1;
      break;
    case 'r':
      axis = 'x';
      baseDir = 1;
      matchLayer = (p) => p.x >= 0;
      break;
    case 'L':
      axis = 'x';
      baseDir = -1;
      matchLayer = (p) => p.x === -1;
      break;
    case 'l':
      axis = 'x';
      baseDir = -1;
      matchLayer = (p) => p.x <= 0;
      break;
    case 'M':
      axis = 'x';
      baseDir = -1;
      matchLayer = (p) => p.x === 0;
      break;
    case 'x':
      axis = 'x';
      baseDir = 1;
      matchLayer = () => true;
      break;

    case 'U':
      axis = 'y';
      baseDir = 1;
      matchLayer = (p) => p.y === 1;
      break;
    case 'u':
      axis = 'y';
      baseDir = 1;
      matchLayer = (p) => p.y >= 0;
      break;
    case 'D':
      axis = 'y';
      baseDir = -1;
      matchLayer = (p) => p.y === -1;
      break;
    case 'd':
      axis = 'y';
      baseDir = -1;
      matchLayer = (p) => p.y <= 0;
      break;
    case 'E':
      axis = 'y';
      baseDir = -1;
      matchLayer = (p) => p.y === 0;
      break;
    case 'y':
      axis = 'y';
      baseDir = 1;
      matchLayer = () => true;
      break;

    case 'F':
      axis = 'z';
      baseDir = 1;
      matchLayer = (p) => p.z === 1;
      break;
    case 'f':
      axis = 'z';
      baseDir = 1;
      matchLayer = (p) => p.z >= 0;
      break;
    case 'B':
      axis = 'z';
      baseDir = -1;
      matchLayer = (p) => p.z === -1;
      break;
    case 'b':
      axis = 'z';
      baseDir = -1;
      matchLayer = (p) => p.z <= 0;
      break;
    case 'S':
      axis = 'z';
      baseDir = 1;
      matchLayer = (p) => p.z === 0;
      break;
    case 'z':
      axis = 'z';
      baseDir = 1;
      matchLayer = () => true;
      break;
    default:
      return;
  }

  const dir: 1 | -1 = prime ? (baseDir === 1 ? -1 : 1) : baseDir;

  for (const cubie of cubies) {
    if (matchLayer(cubie.pos)) {
      cubie.pos = rotateVec(cubie.pos, axis, dir);
      for (const st of cubie.stickers) {
        st.normal = rotateVec(st.normal, axis, dir);
      }
    }
  }
}

function invertToken(token: string): string {
  const m = token.match(/^([RLUDFBrludfbMESxyz])(2|')?$/);
  if (!m) return token;
  const [, base, mod = ''] = m;
  if (mod === '2') return `${base}2`;
  return mod === "'" ? base : `${base}'`;
}

function getStickerColorForStage(
  cubie: CubieState,
  sticker: StickerState,
  stage: LearningStage
): StickerCell {
  const { homePos } = cubie;
  const isUPiece = homePos.y === 1;
  const isCrossPiece =
    homePos.y === -1 && (homePos.x === 0 || homePos.z === 0);
  const isF2LPiece = homePos.y <= 0;

  if (stage === 'OLL') {
    if (isUPiece) {
      if (sticker.isPrimaryU) {
        return {
          face: sticker.homeFace,
          color: FACE_COLORS[sticker.homeFace],
          masked: false,
        };
      }
      return { face: sticker.homeFace, color: IGNORED_COLOR, masked: true };
    }
    return {
      face: sticker.homeFace,
      color: DIM_FACE_COLORS[sticker.homeFace],
      masked: true,
    };
  }

  if (stage === 'PLL') {
    if (isUPiece) {
      if (sticker.isPrimaryU) {
        return {
          face: sticker.homeFace,
          color: '#CBD5E1',
          masked: false,
        };
      }
      return {
        face: sticker.homeFace,
        color: FACE_COLORS[sticker.homeFace],
        masked: false,
      };
    }
    return {
      face: sticker.homeFace,
      color: DIM_FACE_COLORS[sticker.homeFace],
      masked: true,
    };
  }

  if (stage === 'F2L') {
    if (isF2LPiece) {
      return {
        face: sticker.homeFace,
        color: FACE_COLORS[sticker.homeFace],
        masked: false,
      };
    }
    return { face: sticker.homeFace, color: IGNORED_COLOR, masked: true };
  }

  // stage === 'Cross'
  if (isCrossPiece) {
    return {
      face: sticker.homeFace,
      color: FACE_COLORS[sticker.homeFace],
      masked: false,
    };
  }
  const isCenter =
    Math.abs(homePos.x) + Math.abs(homePos.y) + Math.abs(homePos.z) === 1;
  if (isCenter) {
    return {
      face: sticker.homeFace,
      color: DIM_FACE_COLORS[sticker.homeFace],
      masked: true,
    };
  }
  return { face: sticker.homeFace, color: IGNORED_COLOR, masked: true };
}

export interface SimulatedCaseView {
  /** 3x3 top face U: rows z = -1..1 (back to front), cols x = -1..1 (left to right) */
  topGrid: StickerCell[][];
  /** Top row of B (x = -1..1) viewed from top */
  backTopRow: StickerCell[];
  /** Top row of F (x = -1..1) viewed from top */
  frontTopRow: StickerCell[];
  /** Top row of L (z = -1..1) viewed from top */
  leftTopRow: StickerCell[];
  /** Top row of R (z = -1..1) viewed from top */
  rightTopRow: StickerCell[];
  /** Full 3x3 front face F: rows y = 1..-1 (top to bottom), cols x = -1..1 (left to right) */
  frontGrid: StickerCell[][];
  /** Full 3x3 right face R: rows y = 1..-1 (top to bottom), cols z = 1..-1 (front to back) */
  rightGrid: StickerCell[][];
}

/**
 * Simula en 0ms el estado inicial previo a resolver `alg` (equivalente a experimentalSetupAnchor="end")
 * en TypeScript puro, sin WebGL ni custom elements.
 */
export function simulateCasePreState(
  alg: string,
  stage: LearningStage
): SimulatedCaseView {
  const cubies = createSolvedCube();
  const tokens = splitAlgMoves(alg);
  const inverseTokens = [...tokens].reverse().map(invertToken);

  for (const tok of inverseTokens) {
    const m = tok.match(/^([RLUDFBrludfbMESxyz])(2|')?$/);
    if (!m) continue;
    const [, base, mod = ''] = m;
    if (mod === '2') {
      applySingleQuantumMove(cubies, base, false);
      applySingleQuantumMove(cubies, base, false);
    } else {
      applySingleQuantumMove(cubies, base, mod === "'");
    }
  }

  const fallbackCell: StickerCell = {
    face: 'U',
    color: IGNORED_COLOR,
    masked: true,
  };

  const findSticker = (
    x: number,
    y: number,
    z: number,
    nx: number,
    ny: number,
    nz: number
  ): StickerCell => {
    const cubie = cubies.find(
      (c) => c.pos.x === x && c.pos.y === y && c.pos.z === z
    );
    if (!cubie) return fallbackCell;
    const st = cubie.stickers.find(
      (s) => s.normal.x === nx && s.normal.y === ny && s.normal.z === nz
    );
    if (!st) return fallbackCell;
    return getStickerColorForStage(cubie, st, stage);
  };

  const topGrid: StickerCell[][] = [-1, 0, 1].map((z) =>
    [-1, 0, 1].map((x) => findSticker(x, 1, z, 0, 1, 0))
  );

  const backTopRow: StickerCell[] = [-1, 0, 1].map((x) =>
    findSticker(x, 1, -1, 0, 0, -1)
  );
  const frontTopRow: StickerCell[] = [-1, 0, 1].map((x) =>
    findSticker(x, 1, 1, 0, 0, 1)
  );
  const leftTopRow: StickerCell[] = [-1, 0, 1].map((z) =>
    findSticker(-1, 1, z, -1, 0, 0)
  );
  const rightTopRow: StickerCell[] = [-1, 0, 1].map((z) =>
    findSticker(1, 1, z, 1, 0, 0)
  );

  const frontGrid: StickerCell[][] = [1, 0, -1].map((y) =>
    [-1, 0, 1].map((x) => findSticker(x, y, 1, 0, 0, 1))
  );

  const rightGrid: StickerCell[][] = [1, 0, -1].map((y) =>
    [1, 0, -1].map((z) => findSticker(1, y, z, 1, 0, 0))
  );

  return {
    topGrid,
    backTopRow,
    frontTopRow,
    leftTopRow,
    rightTopRow,
    frontGrid,
    rightGrid,
  };
}
