export type CfopStage = 'Notation' | 'Cross' | 'F2L' | 'OLL' | 'PLL';

export type LearningStage = Exclude<CfopStage, 'Notation'>;

export type StickeringType = 'full' | 'Cross' | 'F2L' | 'OLL' | 'PLL';

export type NotationCategory = 'basic' | 'double' | 'slice' | 'wide' | 'rotation';

export interface NotationMove {
  id: string;
  move: string;
  name: string;
  category: NotationCategory;
  faceLabel: string;
  directionLabel: string;
  description: string;
  fingertrickTip: string;
}

export interface CfopCase {
  id: string;
  code: string;
  name: string;
  stage: LearningStage;
  subcategory: string;
  /** Clean WCA algorithm string passed directly to <twisty-player> */
  alg: string;
  /** Optional alternative or mirror algorithm */
  altAlg?: string;
  /** Recognition cue: patterns, headlights, blocks, bars */
  recognition: string;
  /** Clear Spanish explanation & fingertrick advice */
  explanation: string;
  /** Named triggers present in this algorithm */
  triggers?: string[];
}

export interface ActiveSelection {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  alg: string;
  altAlg?: string;
  stage: CfopStage;
  stickering: StickeringType;
  setupAnchor: 'start' | 'end';
  recognition: string;
  explanation: string;
  autoPlayNonce?: number;
}

/**
 * Tipado seguro para el Web Component nativo <twisty-player> cargado vía CDN,
 * evitando importar `cubing/twisty` desde node_modules en Vite.
 */
export interface TwistyCoarseTimelineInfo {
  playing: boolean;
  atStart: boolean;
  atEnd: boolean;
}

export interface TwistyCurrentMoveInfo {
  patternIndex: number;
  currentMoves: unknown[];
  movesFinishing?: unknown[];
  movesFinished?: unknown[];
}

export interface TwistyIndexer {
  indexToMoveStartTimestamp: (index: number) => number;
  moveDuration: (index: number) => number;
}

export interface TwistyPlayerElement extends HTMLElement {
  alg: string;
  tempoScale: number;
  experimentalSetupAnchor: 'start' | 'end';
  experimentalStickering: StickeringType;
  background: 'none' | 'checkered' | 'auto';
  hintFacelets: 'floating' | 'none' | 'auto';
  controlPanel: 'none' | 'bottom-row' | 'auto';
  visualization: '3D' | '2D' | 'experimental-2D-LL' | 'auto';
  cameraLatitude: number;
  cameraLongitude: number;
  indexer: 'auto' | 'tree' | 'simple' | 'simultaneous';
  timestamp: number | 'start' | 'end';
  play?: () => void;
  pause?: () => void;
  togglePlay?: (play?: boolean) => void;
  jumpToStart?: (options?: { flash: boolean }) => void;
  jumpToEnd?: (options?: { flash: boolean }) => void;
  controller?: {
    animationController?: {
      play?: (options?: {
        direction?: 1 | -1;
        untilBoundary?: 'move' | 'entire-timeline';
        autoSkipToOtherEndIfStartingAtBoundary?: boolean;
      }) => Promise<void>;
    };
  };
  experimentalModel?: {
    coarseTimelineInfo?: {
      addFreshListener: (cb: (info: TwistyCoarseTimelineInfo) => void) => void;
      removeFreshListener: (cb: (info: TwistyCoarseTimelineInfo) => void) => void;
    };
    currentMoveInfo?: {
      addFreshListener: (cb: (info: TwistyCurrentMoveInfo) => void) => void;
      removeFreshListener: (cb: (info: TwistyCurrentMoveInfo) => void) => void;
    };
    indexer?: {
      get: () => Promise<TwistyIndexer>;
    };
  };
}
