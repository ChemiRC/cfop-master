import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
} from 'lucide-react';
import type {
  ActiveSelection,
  CfopStage,
  LearningStage,
  StickeringType,
  TwistyCoarseTimelineInfo,
  TwistyCurrentMoveInfo,
  TwistyPlayerElement,
} from '../types/cfop';
import { mirrorAlgLR, splitAlgMoves } from '../utils/algHelpers';
import { triggerHaptic } from '../utils/haptics';
import { Cube2DPreview } from './Cube2DPreview';

interface CubeViewerProps {
  selection: ActiveSelection;
  isLeftyGlobal?: boolean;
}

const SPEED_SEGMENTS = [
  { value: 0.25, label: '0.25x' },
  { value: 0.5, label: '0.5x' },
  { value: 1, label: '1x' },
  { value: 2, label: '2x' },
] as const;

type CameraPreset = 'right' | 'left' | 'top';

const CAMERA_PRESETS: Record<
  CameraPreset,
  { short: string; lat: number; lon: number }
> = {
  right: { short: 'DER', lat: 32, lon: 32 },
  left: { short: 'IZQ', lat: 32, lon: -32 },
  top: { short: 'SUP', lat: 58, lon: 20 },
};

const STAGE_ACCENTS: Record<
  CfopStage,
  { label: string; dotClass: string; textClass: string }
> = {
  Notation: { label: 'WCA', dotClass: 'bg-[#FAFAFA]', textClass: 'text-[#FAFAFA]' },
  Cross: { label: 'CROSS', dotClass: 'bg-[#F4F4F5]', textClass: 'text-[#F4F4F5]' },
  F2L: { label: 'F2L', dotClass: 'bg-[#3B82F6]', textClass: 'text-[#3B82F6]' },
  OLL: { label: 'OLL', dotClass: 'bg-[#EAB308]', textClass: 'text-[#EAB308]' },
  PLL: { label: 'PLL', dotClass: 'bg-[#EF4444]', textClass: 'text-[#EF4444]' },
};

const CTRL_BTN =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-[#09090B] text-zinc-300 transition-colors hover:bg-[#16161A] hover:text-[#FAFAFA] active:bg-[#1C1C21] disabled:cursor-not-allowed disabled:opacity-35 lg:h-9 lg:w-9';

const CHIP_BTN =
  'inline-flex h-8 items-center rounded-md border px-2.5 font-mono text-[11px] font-medium transition-colors lg:h-6 lg:px-2 lg:text-[10px]';

function chipClass(active: boolean): string {
  return `${CHIP_BTN} ${
    active
      ? 'border-[#FAFAFA] bg-[#FAFAFA] text-[#09090B]'
      : 'border-[#222226] bg-[#111113]/90 text-zinc-400 hover:text-zinc-200'
  }`;
}

const IsolatedTwistyHost = React.memo(
  React.forwardRef<HTMLDivElement, { hidden?: boolean }>(({ hidden }, ref) => (
    <div
      ref={ref}
      className={`absolute inset-0 select-none ${
        hidden ? 'pointer-events-none invisible opacity-0' : 'opacity-100'
      }`}
    />
  ))
);
IsolatedTwistyHost.displayName = 'IsolatedTwistyHost';

export const CubeViewer: React.FC<CubeViewerProps> = ({ selection, isLeftyGlobal }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<TwistyPlayerElement | null>(null);
  const sequenceRef = useRef<HTMLDivElement | null>(null);
  const moveButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [cdnTimedOut, setCdnTimedOut] = useState<boolean>(false);

  const [tempoScale, setTempoScale] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('right');
  const [isMirrored, setIsMirrored] = useState<boolean>(Boolean(isLeftyGlobal));
  const [useAltAlg, setUseAltAlg] = useState<boolean>(false);
  const [forceFullStickering, setForceFullStickering] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 1024px)').matches
  );

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [atStart, setAtStart] = useState<boolean>(true);
  const [atEnd, setAtEnd] = useState<boolean>(false);
  const [activeMoveIndex, setActiveMoveIndex] = useState<number>(-1);
  const [completedMoves, setCompletedMoves] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setIsMirrored(Boolean(isLeftyGlobal));
    setUseAltAlg(false);
    setForceFullStickering(false);
  }, [selection.id, isLeftyGlobal]);

  const baseAlg = useAltAlg && selection.altAlg ? selection.altAlg : selection.alg;
  const effectiveAlg = useMemo(
    () => (isMirrored ? mirrorAlgLR(baseAlg) : baseAlg),
    [baseAlg, isMirrored]
  );

  const moves = useMemo(() => splitAlgMoves(effectiveAlg), [effectiveAlg]);

  const effectiveStickering: StickeringType = forceFullStickering
    ? 'full'
    : selection.stickering;

  const latestPropsRef = useRef({
    alg: effectiveAlg,
    setupAnchor: selection.setupAnchor,
    stickering: effectiveStickering,
    tempoScale,
  });
  latestPropsRef.current = {
    alg: effectiveAlg,
    setupAnchor: selection.setupAnchor,
    stickering: effectiveStickering,
    tempoScale,
  };

  // Montaje único del Web Component <twisty-player>
  useEffect(() => {
    let isMounted = true;
    const container = containerRef.current;
    let removeListeners: (() => void) | null = null;

    const timeoutId = window.setTimeout(() => {
      if (isMounted && !playerRef.current) {
        setCdnTimedOut(true);
      }
    }, 6000);

    const mountSinglePlayer = async () => {
      try {
        if (typeof customElements !== 'undefined') {
          await customElements.whenDefined('twisty-player');
        }
        if (!isMounted || !containerRef.current || playerRef.current) return;

        window.clearTimeout(timeoutId);
        setCdnTimedOut(false);

        const initial = latestPropsRef.current;
        const player = document.createElement(
          'twisty-player'
        ) as TwistyPlayerElement;

        player.setAttribute('puzzle', '3x3x3');
        player.visualization = '3D';
        player.background = 'none';
        player.hintFacelets = 'floating';
        player.controlPanel = 'none';
        player.experimentalSetupAnchor = initial.setupAnchor;
        player.experimentalStickering = initial.stickering;
        player.alg = initial.alg;
        player.tempoScale = initial.tempoScale;
        player.cameraLatitude = CAMERA_PRESETS.right.lat;
        player.cameraLongitude = CAMERA_PRESETS.right.lon;

        try {
          player.indexer = 'tree';
        } catch {
          // Propiedad opcional
        }

        player.style.display = 'grid';
        player.style.width = '100%';
        player.style.height = '100%';

        containerRef.current.appendChild(player);
        playerRef.current = player;

        const onCoarseTimeline = (info: TwistyCoarseTimelineInfo) => {
          if (!isMounted) return;
          setIsPlaying(Boolean(info.playing));
          setAtStart(Boolean(info.atStart));
          setAtEnd(Boolean(info.atEnd));
        };

        const onMoveInfo = (moveInfo: TwistyCurrentMoveInfo) => {
          if (!isMounted) return;
          const finishingLen = moveInfo.movesFinishing?.length ?? 0;
          const finishedLen = moveInfo.movesFinished?.length ?? 0;
          const doneCount =
            (moveInfo.patternIndex ?? 0) + finishingLen + finishedLen;

          setCompletedMoves(doneCount);
          if ((moveInfo.currentMoves?.length ?? 0) > 0) {
            setActiveMoveIndex(doneCount);
          } else if (doneCount > 0) {
            setActiveMoveIndex(doneCount - 1);
          } else {
            setActiveMoveIndex(-1);
          }
        };

        const coarseProp = player.experimentalModel?.coarseTimelineInfo;
        const moveProp = player.experimentalModel?.currentMoveInfo;

        coarseProp?.addFreshListener(onCoarseTimeline);
        moveProp?.addFreshListener(onMoveInfo);

        removeListeners = () => {
          try {
            coarseProp?.removeFreshListener(onCoarseTimeline);
            moveProp?.removeFreshListener(onMoveInfo);
          } catch {
            // Ignorar errores de limpieza
          }
        };

        if (isMounted) {
          setPlayerReady(true);
        }
      } catch (err) {
        console.error('[CubeViewer] Error inicializando twisty-player:', err);
        if (isMounted) {
          setCdnTimedOut(true);
        }
      }
    };

    mountSinglePlayer();

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
      removeListeners?.();
      try {
        const currentPlayer = playerRef.current;
        if (container && currentPlayer && currentPlayer.parentNode === container) {
          container.replaceChildren();
        }
      } catch {
        // Evita DOMException NotFoundError en Safari
      }
      playerRef.current = null;
    };
  }, []);

  // Sincronización reactiva de propiedades sin tocar el DOM
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !playerReady) return;

    try {
      player.pause?.();
      player.experimentalSetupAnchor = selection.setupAnchor;
      player.experimentalStickering = effectiveStickering;
      player.alg = effectiveAlg;
      player.jumpToStart?.({ flash: false });
      setActiveMoveIndex(-1);
      setCompletedMoves(0);

      if (selection.autoPlayNonce) {
        const timer = window.setTimeout(() => {
          try {
            playerRef.current?.jumpToStart?.({ flash: false });
            playerRef.current?.play?.();
          } catch {
            // Ignorar interrupción
          }
        }, 90);
        return () => window.clearTimeout(timer);
      }
    } catch (err) {
      console.warn('[CubeViewer] Error actualizando propiedades:', err);
    }
  }, [
    playerReady,
    effectiveAlg,
    selection.setupAnchor,
    effectiveStickering,
    selection.autoPlayNonce,
  ]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !playerReady) return;
    try {
      player.tempoScale = tempoScale;
    } catch {
      // Ignorar error transitorio
    }
  }, [playerReady, tempoScale]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !playerReady) return;
    const coords = CAMERA_PRESETS[cameraPreset];
    try {
      player.cameraLatitude = coords.lat;
      player.cameraLongitude = coords.lon;
    } catch {
      // Ignorar error transitorio
    }
  }, [playerReady, cameraPreset]);

  // Centra horizontalmente el movimiento activo en la tira de secuencia (móvil)
  useEffect(() => {
    const strip = sequenceRef.current;
    if (!strip) return;
    if (activeMoveIndex < 0) {
      strip.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    const btn = moveButtonRefs.current[activeMoveIndex];
    if (!btn || strip.scrollWidth <= strip.clientWidth) return;
    const target = btn.offsetLeft - strip.clientWidth / 2 + btn.clientWidth / 2;
    strip.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [activeMoveIndex]);

  const handleTogglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    triggerHaptic('medium');
    try {
      if (isPlaying) {
        player.pause?.();
      } else {
        if (atEnd) {
          player.jumpToStart?.({ flash: false });
        }
        player.play?.();
      }
    } catch {
      // Ignorar error de reproducción
    }
  }, [isPlaying, atEnd]);

  const handleReset = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    triggerHaptic('medium');
    try {
      player.pause?.();
      player.jumpToStart?.({ flash: false });
      setActiveMoveIndex(-1);
      setCompletedMoves(0);
    } catch {
      // Ignorar error
    }
  }, []);

  const handleJumpToEnd = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    triggerHaptic('medium');
    try {
      player.pause?.();
      player.jumpToEnd?.({ flash: false });
    } catch {
      // Ignorar error
    }
  }, []);

  const stepPlayer = useCallback((direction: 1 | -1) => {
    const player = playerRef.current;
    if (!player) return;
    triggerHaptic('light');
    try {
      player.controller?.animationController?.play?.({
        direction,
        untilBoundary: 'move',
        autoSkipToOtherEndIfStartingAtBoundary: false,
      });
    } catch {
      // Ignorar error
    }
  }, []);

  const handleStepForward = useCallback(() => {
    if (!atEnd) stepPlayer(1);
  }, [atEnd, stepPlayer]);

  const handleStepBackward = useCallback(() => {
    if (!atStart) stepPlayer(-1);
  }, [atStart, stepPlayer]);

  // Atajos de teclado: Space (Play/Pausa), ← / → (Paso a paso), R (Reiniciar)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!playerReady) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleStepBackward();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    playerReady,
    handleTogglePlay,
    handleStepForward,
    handleStepBackward,
    handleReset,
  ]);

  const handleJumpToMove = useCallback(async (index: number) => {
    const player = playerRef.current;
    if (!player) return;
    triggerHaptic('light');
    try {
      player.pause?.();
      const indexer = await player.experimentalModel?.indexer?.get();
      if (indexer) {
        player.timestamp =
          indexer.indexToMoveStartTimestamp(index) + indexer.moveDuration(index);
      }
    } catch {
      // Ignorar error transitorio
    }
  }, []);

  const handleToggleMirror = useCallback(() => {
    triggerHaptic('selection');
    setIsMirrored((prev) => {
      const next = !prev;
      setCameraPreset(next ? 'left' : 'right');
      return next;
    });
  }, []);

  const handleCopyAlg = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(effectiveAlg);
      triggerHaptic('success');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Portapapeles no disponible
    }
  }, [effectiveAlg]);

  const stageAccent = STAGE_ACCENTS[selection.stage] ?? STAGE_ACCENTS.Notation;
  const previewStageFor2D: LearningStage =
    selection.stage === 'Notation' ? 'F2L' : selection.stage;
  const isNotation = selection.stage === 'Notation';

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-[#222226] bg-[#111113]">
      {/* Cabecera del caso */}
      <div className="flex items-center gap-2.5 border-b border-[#222226] px-3 py-2.5">
        <span
          translate="no"
          className={`shrink-0 font-mono text-xs font-semibold tabular-nums ${stageAccent.textClass}`}
        >
          {selection.code}
        </span>
        <h2 className="min-w-0 flex-1 truncate text-sm font-semibold text-[#FAFAFA]">
          {selection.title}
        </h2>
        {isMirrored && (
          <span className="rounded border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#3B82F6]">
            ZURDO L↔R
          </span>
        )}
        <button
          type="button"
          onClick={handleCopyAlg}
          aria-label="Copiar algoritmo"
          className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md px-2 font-mono text-[11px] text-zinc-400 transition-colors hover:bg-[#16161A] hover:text-[#FAFAFA]"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-[#10B981]" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar'}</span>
        </button>
      </div>

      {/* Viewport 3D / 2D con etiquetas en las esquinas */}
      <div className="relative h-[clamp(210px,34dvh,270px)] border-b border-[#222226] bg-[#0C0C0E] lg:h-72">
        <IsolatedTwistyHost ref={containerRef} hidden={viewMode !== '3D'} />

        {viewMode === '2D' && (
          <div className="absolute inset-0 flex items-center justify-center [&>div]:h-40 [&>div]:w-40">
            <Cube2DPreview alg={effectiveAlg} stage={previewStageFor2D} />
          </div>
        )}

        {viewMode === '3D' && !playerReady && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs text-zinc-500">
              {cdnTimedOut ? 'Sin conexión con cdn.cubing.net' : 'Cargando 3D…'}
            </span>
          </div>
        )}

        {/* Superior izquierda: etapa + HTM */}
        <div
          translate="no"
          className="pointer-events-none absolute top-2.5 left-3 z-10 flex items-center gap-1.5 font-mono text-[11px] tabular-nums text-zinc-400"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${stageAccent.dotClass}`} />
          <span className="text-zinc-300">{stageAccent.label}</span>
          <span className="text-zinc-700">/</span>
          <span>{moves.length} HTM</span>
        </div>

        {/* Superior derecha: 3D / 2D */}
        <div
          translate="no"
          className="absolute top-2 right-2 z-10 inline-flex rounded-md border border-[#222226] bg-[#111113]/90 p-0.5"
        >
          {(['3D', '2D'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setViewMode(mode);
              }}
              className={`h-7 rounded px-2.5 font-mono text-[11px] font-medium transition-colors lg:h-6 lg:px-2 ${
                viewMode === mode
                  ? 'bg-[#FAFAFA] text-[#09090B]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Inferior izquierda: cámara */}
        {viewMode === '3D' && (
          <div
            translate="no"
            className="absolute bottom-2 left-2 z-10 inline-flex rounded-md border border-[#222226] bg-[#111113]/90 p-0.5"
          >
            {(['right', 'left', 'top'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setCameraPreset(preset);
                }}
                aria-label={`Cámara ${CAMERA_PRESETS[preset].short}`}
                className={`h-7 rounded px-2 font-mono text-[10px] font-medium transition-colors lg:h-6 ${
                  cameraPreset === preset
                    ? 'bg-zinc-800 text-[#FAFAFA]'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {CAMERA_PRESETS[preset].short}
              </button>
            ))}
          </div>
        )}

        {/* Inferior derecha: espejo / alternativo / máscara */}
        <div translate="no" className="absolute right-2 bottom-2 z-10 flex gap-1">
          <button
            type="button"
            onClick={handleToggleMirror}
            aria-pressed={isMirrored}
            title="Espejo izquierda ↔ derecha"
            className={chipClass(isMirrored)}
          >
            L↔R
          </button>
          {selection.altAlg && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setUseAltAlg((prev) => !prev);
              }}
              aria-pressed={useAltAlg}
              title="Algoritmo alternativo"
              className={chipClass(useAltAlg)}
            >
              ALT
            </button>
          )}
          {selection.stickering !== 'full' && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setForceFullStickering((prev) => !prev);
              }}
              aria-pressed={forceFullStickering}
              title="Mostrar todos los colores"
              className={chipClass(forceFullStickering)}
            >
              FULL
            </button>
          )}
        </div>
      </div>

      {/* Guía Ergonómica Técnica: Agarre Inicial y AUF */}
      {(selection.grip || selection.auf) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[#222226] bg-[#0C0C0E] px-3 py-1.5 font-mono text-[11px] tabular-nums text-zinc-400">
          {selection.grip && (
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600">AGARRE:</span>
              <span className="text-zinc-200">{selection.grip}</span>
            </div>
          )}
          {selection.auf && (
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600">AUF:</span>
              <span className="text-zinc-200">{selection.auf}</span>
            </div>
          )}
        </div>
      )}

      {/* Secuencia: scroll horizontal en móvil, multilínea en desktop */}
      <div className="border-b border-[#222226] bg-[#09090B] py-2.5">
        <div className="mb-1.5 flex items-center justify-between px-3 font-mono text-[11px] tabular-nums text-zinc-500">
          <span>Secuencia</span>
          <span translate="no" className="text-zinc-400">
            {Math.min(completedMoves, moves.length)}/{moves.length}
          </span>
        </div>

        <div
          ref={sequenceRef}
          translate="no"
          className="no-scrollbar relative flex gap-1 overflow-x-auto scroll-smooth px-3 lg:flex-wrap lg:overflow-visible"
        >
          {moves.map((move, idx) => {
            const isActive = idx === activeMoveIndex;
            const isDone = idx < completedMoves && !isActive;

            return (
              <button
                key={`${move}-${idx}`}
                ref={(el) => {
                  moveButtonRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => handleJumpToMove(idx)}
                aria-label={`Ir al paso ${idx + 1}: ${move}`}
                className={`h-9 min-w-[2.5rem] shrink-0 rounded-md border px-2 font-mono text-sm font-semibold tabular-nums transition-colors lg:h-8 lg:min-w-[2.125rem] lg:text-xs ${
                  isActive
                    ? 'border-[#FAFAFA] bg-[#FAFAFA] text-[#09090B]'
                    : isDone
                    ? 'border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981]'
                    : 'border-[#222226] bg-[#111113] text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {move}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controles de reproducción + velocidad */}
      <div className="space-y-2.5 border-b border-[#222226] px-3 py-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReset}
            disabled={!playerReady}
            aria-label="Reiniciar"
            title="Reiniciar (R)"
            className={CTRL_BTN}
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleStepBackward}
            disabled={!playerReady || atStart}
            aria-label="Paso anterior"
            title="Paso anterior (←)"
            className={CTRL_BTN}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            disabled={!playerReady}
            title="Reproducir / Pausar (Space)"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[#FAFAFA] px-3 text-sm font-semibold text-[#09090B] transition-colors hover:bg-zinc-200 active:bg-zinc-300 disabled:opacity-40 lg:h-9 lg:text-xs"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 fill-current" />
                <span>Pausa</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>{atEnd ? 'Repetir' : 'Play'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleStepForward}
            disabled={!playerReady || atEnd}
            aria-label="Paso siguiente"
            title="Paso siguiente (→)"
            className={CTRL_BTN}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={handleJumpToEnd}
            disabled={!playerReady}
            aria-label="Ir al final"
            title="Ir al final"
            className={CTRL_BTN}
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <div
          translate="no"
          role="radiogroup"
          aria-label="Velocidad"
          className="grid grid-cols-4 rounded-md border border-zinc-800 bg-[#09090B] p-0.5"
        >
          {SPEED_SEGMENTS.map((seg) => {
            const active = Math.abs(tempoScale - seg.value) < 0.03;
            return (
              <button
                key={seg.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  triggerHaptic('selection');
                  setTempoScale(seg.value);
                }}
                className={`h-8 rounded font-mono text-xs font-medium tabular-nums transition-colors lg:h-7 ${
                  active
                    ? 'bg-[#FAFAFA] font-semibold text-[#09090B]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {seg.label}
              </button>
            );
          })}
        </div>

        {/* Atajos de teclado: solo en pantallas con teclado */}
        <div className="hidden items-center justify-center gap-4 text-[11px] text-zinc-500 lg:flex">
          {[
            { keys: ['Space'], label: 'Play' },
            { keys: ['←', '→'], label: 'Paso' },
            { keys: ['R'], label: 'Reset' },
          ].map((hint) => (
            <span key={hint.label} className="inline-flex items-center gap-1">
              {hint.keys.map((k) => (
                <kbd
                  key={k}
                  className="rounded border border-zinc-800 bg-[#09090B] px-1.5 py-0.5 font-mono text-[10px] text-zinc-300"
                >
                  {k}
                </kbd>
              ))}
              <span>{hint.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Detalles colapsables (abiertos por defecto en desktop) */}
      <div>
        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            setShowDetails((prev) => !prev);
          }}
          aria-expanded={showDetails}
          className="flex h-11 w-full items-center justify-between px-3 text-left lg:h-10"
        >
          <span className="text-xs font-medium text-zinc-300">
            {isNotation ? 'Cómo se hace' : 'Reconocimiento y ejecución'}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-zinc-500 transition-transform ${
              showDetails ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showDetails && (
          <dl className="space-y-2.5 border-t border-[#222226] px-3 py-3 text-[13px] leading-relaxed lg:text-xs">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                {isNotation ? 'Movimiento' : 'Reconocer'}
              </dt>
              <dd className="mt-0.5 text-zinc-300">{selection.recognition}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                {isNotation ? 'Dedos' : 'Ejecutar'}
              </dt>
              <dd className="mt-0.5 text-zinc-300">{selection.explanation}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
};
