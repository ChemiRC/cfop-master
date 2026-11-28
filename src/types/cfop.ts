export type MainSection = 'Reducido' | 'CFOP' | 'Notation' | 'Timer';

export type CfopSubStage = 'Cross' | 'F2L' | 'OLL' | 'PLL';

export type CfopStage = 'Notation' | 'Reducido' | CfopSubStage | 'Timer';

export type LearningStage = Exclude<CfopStage, 'Notation' | 'Timer'>;

export type VisualStage = CfopSubStage;

export type TopFaceColor = 'yellow' | 'white';

export type ViewerSide = 'right' | 'left';

export type CaseMastery = 'unlearned' | 'practicing' | 'mastered';

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
  /** Etapa visual/stickering real para el diagrama 2D y el visor 3D (útil en CFOP Reducido) */
  visualStage?: VisualStage;
  /** Familia/categoría oficial del caso */
  category: string;
  /** Alias de categoría para compatibilidad con filtros y UI */
  subcategory: string;
  /** Etiqueta compacta de bloque/subsección (ej. 'OLL', 'Consejos Cruz', 'PLL Esquinas') */
  sectionBadge?: string;
  /** Algoritmo principal en notación WCA limpia compatible con <twisty-player> */
  alg: string;
  /** Variantes secundarias en notación WCA limpia */
  altAlgs: string[];
  /** Opcional legacy: primera alternativa rápida */
  altAlg?: string;
  /** Etiquetas descriptivas para [principal, alt1, alt2...] (ej. '2da forma', 'SUN+ANTISUN') */
  altAlgLabels?: string[];
  /** Nota o etiqueta original de la guía (ej. 'F (Sexy)×3 F\'', '2da forma', 'SUN+ANTISUN') */
  guideNote?: string;
  /** Marca de tiempo del video guía (ej. '02:16') */
  videoTimestamp?: string;
  /** Enlace directo al video con marca de tiempo */
  videoUrl?: string;
  /** Indica si pertenece al subconjunto esencial 2-Look OLL / 2-Look PLL / F2L básico */
  twoLook: boolean;
  /** Clave de reconocimiento visual: patrones, faros, bloques, barras */
  recognition: string;
  /** Explicación en español y consejos de fingertricks */
  explanation: string;
  /** Triggers presentes en el algoritmo */
  triggers: string[];
  /** Etiquetas visuales rápidas (e.g. 'Faros', 'Barra 1×3', 'Bloque 2×2') */
  tags: string[];
  /** Agarre recomendado al iniciar */
  grip: string;
  /** Orientación / AUF recomendada antes de ejecutar */
  auf: string;
  /** Setup opcional de SpeedCubeDB */
  setup?: string;
}

export interface ActiveSelection {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  alg: string;
  altAlg?: string;
  altAlgs: string[];
  altAlgLabels?: string[];
  guideNote?: string;
  sectionBadge?: string;
  videoTimestamp?: string;
  videoUrl?: string;
  twoLook: boolean;
  stage: CfopStage;
  visualStage?: VisualStage;
  stickering: StickeringType;
  setupAnchor: 'start' | 'end';
  recognition: string;
  explanation: string;
  tags: string[];
  grip?: string;
  auf?: string;
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
  experimentalSetupAlg: string;
  experimentalSetupAnchor: 'start' | 'end';
  experimentalStickering: StickeringType;
  experimentalStickeringMaskOrbits: string | null;
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
