import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Pause,
  Play,
  RefreshCw,
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
import { Cube2DPreview } from './Cube2DPreview';

interface CubeViewerProps {
  selection: ActiveSelection;
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
  Notation: {
    label: 'WCA',
    dotClass: 'bg-[#FAFAFA]',
    textClass: 'text-[#FAFAFA]',
  },
  Cross: {
    label: 'CROSS',
    dotClass: 'bg-[#F4F4F5]',
    textClass: 'text-[#F4F4F5]',
  },
  F2L: {
    label: 'F2L',
    dotClass: 'bg-[#3B82F6]',
    textClass: 'text-[#3B82F6]',
  },
  OLL: {
    label: 'OLL',
    dotClass: 'bg-[#EAB308]',
    textClass: 'text-[#EAB308]',
  },
  PLL: {
    label: 'PLL',
    dotClass: 'bg-[#EF4444]',
    textClass: 'text-[#EF4444]',
  },
};

/**
 * Contenedor hoja vacío y aislado de React para <twisty-player>.
 * Usa `invisible` en vez de `display: none` en modo 2D para preservar dimensiones WebGL > 0.
 */
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

export const CubeViewer: React.FC<CubeViewerProps> = ({ selection }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<TwistyPlayerElement | null>(null);

  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [cdnTimedOut, setCdnTimedOut] = useState<boolean>(false);

  const [tempoScale, setTempoScale] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('right');
  const [isMirrored, setIsMirrored] = useState<boolean>(false);
  const [useAltAlg, setUseAltAlg] = useState<boolean>(false);
  const [forceFullStickering, setForceFullStickering] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [atStart, setAtStart] = useState<boolean>(true);
  const [atEnd, setAtEnd] = useState<boolean>(false);
  const [activeMoveIndex, setActiveMoveIndex] = useState<number>(-1);
  const [completedMoves, setCompletedMoves] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setIsMirrored(false);
    setUseAltAlg(false);
    setForceFullStickering(false);
  }, [selection.id]);

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

  const handleTogglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

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
    try {
      player.pause?.();
      player.jumpToEnd?.({ flash: false });
    } catch {
      // Ignorar error
    }
  }, []);

  const handleStepForward = useCallback(() => {
    const player = playerRef.current;
    if (!player || atEnd) return;
    try {
      const animCtrl = player.controller?.animationController;
      if (animCtrl?.play) {
        animCtrl.play({
          direction: 1,
          untilBoundary: 'move',
          autoSkipToOtherEndIfStartingAtBoundary: false,
        });
      }
    } catch {
      // Ignorar error
    }
  }, [atEnd]);

  const handleStepBackward = useCallback(() => {
    const player = playerRef.current;
    if (!player || atStart) return;
    try {
      const animCtrl = player.controller?.animationController;
      if (animCtrl?.play) {
        animCtrl.play({
          direction: -1,
          untilBoundary: 'move',
          autoSkipToOtherEndIfStartingAtBoundary: false,
        });
      }
    } catch {
      // Ignorar error
    }
  }, [atStart]);

  // Atajos de teclado reales: Space (Play/Pausa), <- / -> (Paso a paso), R (Reiniciar)
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
    try {
      player.pause?.();
      const indexer = await player.experimentalModel?.indexer?.get();
      if (indexer) {
        const targetTs =
          indexer.indexToMoveStartTimestamp(index) +
          indexer.moveDuration(index);
        player.timestamp = targetTs;
      }
    } catch {
      // Ignorar error transitorio
    }
  }, []);

  const handleToggleMirror = useCallback(() => {
    setIsMirrored((prev) => {
      const next = !prev;
      setCameraPreset(next ? 'left' : 'right');
      return next;
    });
  }, []);

  const handleCopyAlg = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(effectiveAlg);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Portapapeles no disponible
    }
  }, [effectiveAlg]);

  const stageAccent = STAGE_ACCENTS[selection.stage] ?? STAGE_ACCENTS.Notation;
  const previewStageFor2D: LearningStage =
    selection.stage === 'Notation' ? 'F2L' : selection.stage;

  return (
    <div className="flex flex-col rounded-lg border border-[#222226] bg-[#111113]">
      {/* Cabecera Técnica del Caso */}
      <div className="border-b border-[#222226] px-3.5 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <span
            translate="no"
            className={`font-mono text-xs font-semibold tabular-nums ${stageAccent.textClass}`}
          >
            {selection.code}
          </span>
          <span className="truncate font-mono text-[11px] text-zinc-500">
            {selection.subtitle}
          </span>
        </div>
        <h2 className="mt-0.5 truncate text-sm font-semibold text-[#FAFAFA]">
          {selection.title}
        </h2>
      </div>

      {/* Viewport de Estudio 3D / 2D */}
      <div className="relative flex flex-col items-center justify-center border-b border-[#222226] bg-[#0C0C0E] px-3 pt-9 pb-9">
        {/* Esquina Superior Izquierda: Etapa activa + Conteo HTM */}
        <div
          translate="no"
          className="pointer-events-none absolute top-2.5 left-3 z-10 flex items-center gap-2 font-mono text-xs tabular-nums text-zinc-400"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${stageAccent.dotClass}`} />
            <span className="text-zinc-300">{stageAccent.label}</span>
          </span>
          <span className="text-zinc-700">/</span>
          <span>{moves.length} HTM</span>
        </div>

        {/* Esquina Superior Derecha: Selector Segmented Vista 3D / 2D */}
        <div
          translate="no"
          className="absolute top-2 right-2.5 z-10 inline-flex items-center rounded-md border border-[#222226] bg-[#111113] p-0.5 font-mono text-xs tabular-nums text-zinc-400"
        >
          {(['3D', '2D'] as const).map((mode) => {
            const active = viewMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  active
                    ? 'bg-[#FAFAFA] text-[#09090B]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>

        {/* Contenedor del Cubo 3D (100% vacío en JSX) */}
        <div className="relative mx-auto h-56 w-full max-w-[330px] sm:h-60">
          <IsolatedTwistyHost ref={containerRef} hidden={viewMode !== '3D'} />

          {viewMode === '2D' && (
            <div className="absolute inset-0 flex items-center justify-center [&>div]:h-44 [&>div]:w-44">
              <Cube2DPreview alg={effectiveAlg} stage={previewStageFor2D} />
            </div>
          )}

          {viewMode === '3D' && !playerReady && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-center">
              <span className="font-mono text-xs text-zinc-500">
                {cdnTimedOut
                  ? 'ERR_CDN · Verifica conexión a cdn.cubing.net'
                  : 'INIT_WEBGL...'}
              </span>
            </div>
          )}
        </div>

        {/* Barra Inferior de Parámetros de Cámara / Espejo / Máscara dentro del Viewport */}
        <div
          translate="no"
          className="absolute right-2.5 bottom-2 left-2.5 z-10 flex items-center justify-between gap-1 font-mono text-[11px] tabular-nums"
        >
          <div className="flex items-center gap-1">
            {viewMode === '3D' && (
              <div className="inline-flex items-center rounded-md border border-[#222226] bg-[#111113] p-0.5">
                {(['right', 'left', 'top'] as const).map((preset) => {
                  const active = cameraPreset === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCameraPreset(preset)}
                      title={`Cámara: ${CAMERA_PRESETS[preset].short}`}
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                        active
                          ? 'bg-zinc-800 text-[#FAFAFA]'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {CAMERA_PRESETS[preset].short}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleToggleMirror}
              title="Reflejar algoritmo Izquierda ↔ Derecha"
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium transition-colors ${
                isMirrored
                  ? 'border-[#FAFAFA] bg-[#FAFAFA] text-[#09090B]'
                  : 'border-[#222226] bg-[#111113] text-zinc-400 hover:bg-[#16161A] hover:text-zinc-200'
              }`}
            >
              <RefreshCw className="h-2.5 w-2.5" />
              <span>L↔R</span>
            </button>

            {selection.altAlg && (
              <button
                type="button"
                onClick={() => setUseAltAlg((prev) => !prev)}
                title="Alternar algoritmo secundario"
                className={`rounded-md border px-2 py-0.5 text-[10px] font-medium transition-colors ${
                  useAltAlg
                    ? 'border-[#FAFAFA] bg-[#FAFAFA] text-[#09090B]'
                    : 'border-[#222226] bg-[#111113] text-zinc-400 hover:bg-[#16161A] hover:text-zinc-200'
                }`}
              >
                ALT
              </button>
            )}

            {selection.stickering !== 'full' && (
              <button
                type="button"
                onClick={() => setForceFullStickering((prev) => !prev)}
                title="Alternar máscara de etapa vs cubo completo"
                className={`rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase transition-colors ${
                  forceFullStickering
                    ? 'border-zinc-500 bg-zinc-800 text-[#FAFAFA]'
                    : 'border-[#222226] bg-[#111113] text-zinc-400 hover:bg-[#16161A] hover:text-zinc-200'
                }`}
              >
                {forceFullStickering ? 'FULL' : selection.stickering}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Secuencia Interactiva Paso a Paso */}
      <div className="border-b border-[#222226] bg-[#09090B] px-3.5 py-2.5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums text-zinc-400">
            <span className="uppercase tracking-wider text-zinc-500">SEQ</span>
            <span translate="no" className="text-zinc-300">
              {String(Math.min(completedMoves, moves.length)).padStart(2, '0')}/
              {String(moves.length).padStart(2, '0')} HTM
            </span>
            {isMirrored && (
              <span className="rounded border border-[#222226] bg-[#16161A] px-1.5 py-0.5 text-[10px] text-[#FAFAFA]">
                MIRROR
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopyAlg}
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[11px] text-zinc-400 transition-colors hover:bg-[#16161A] hover:text-[#FAFAFA]"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-[#10B981]" />
                <span className="text-[#10B981]">COPIADO</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>COPIAR</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1" translate="no">
          {moves.map((move, idx) => {
            const isActive = idx === activeMoveIndex;
            const isDone = idx < completedMoves && !isActive;

            return (
              <button
                key={`${move}-${idx}`}
                type="button"
                onClick={() => handleJumpToMove(idx)}
                title={`Paso ${idx + 1}: ${move}`}
                className={`min-w-[2rem] rounded-md border px-1.5 py-1 font-mono text-xs font-semibold tabular-nums transition-colors ${
                  isActive
                    ? 'border-[#FAFAFA] bg-[#FAFAFA] text-[#09090B]'
                    : isDone
                    ? 'border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981]'
                    : 'border-[#222226] bg-[#111113] text-zinc-300 hover:border-zinc-700 hover:bg-[#16161A]'
                }`}
              >
                {move}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controlador de Hardware + Velocidad Segmented + Badges <kbd> */}
      <div className="border-b border-[#222226] px-3.5 py-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReset}
            disabled={!playerReady}
            title="Reiniciar al estado inicial (R)"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-[#09090B] text-zinc-300 transition-colors hover:bg-[#16161A] hover:text-[#FAFAFA] disabled:opacity-35"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={handleStepBackward}
            disabled={!playerReady || atStart}
            title="Paso anterior (←)"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-[#09090B] text-zinc-300 transition-colors hover:bg-[#16161A] hover:text-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            disabled={!playerReady}
            title="Reproducir / Pausar (Space)"
            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md bg-[#FAFAFA] px-3 text-xs font-semibold text-[#09090B] transition-colors hover:bg-zinc-200 disabled:opacity-40"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-current" />
                <span>PAUSA</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{atEnd ? 'REPETIR' : 'PLAY'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleStepForward}
            disabled={!playerReady || atEnd}
            title="Siguiente paso (→)"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-[#09090B] text-zinc-300 transition-colors hover:bg-[#16161A] hover:text-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleJumpToEnd}
            disabled={!playerReady}
            title="Saltar al estado resuelto"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-[#09090B] text-zinc-300 transition-colors hover:bg-[#16161A] hover:text-[#FAFAFA] disabled:opacity-35"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Barra de Velocidad Segmented Control */}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            TEMPO
          </span>
          <div
            translate="no"
            className="grid flex-1 grid-cols-4 rounded-md border border-zinc-800 bg-[#09090B] p-0.5"
          >
            {SPEED_SEGMENTS.map((seg) => {
              const active = Math.abs(tempoScale - seg.value) < 0.03;
              return (
                <button
                  key={seg.value}
                  type="button"
                  onClick={() => setTempoScale(seg.value)}
                  className={`rounded py-1 font-mono text-xs font-medium tabular-nums transition-colors ${
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
        </div>

        {/* Badges <kbd> de Atajos de Teclado */}
        <div className="mt-2.5 hidden flex-wrap items-center justify-between gap-1.5 border-t border-[#222226] pt-2 text-[11px] text-zinc-500 sm:flex">
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-zinc-800 bg-[#09090B] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-zinc-300">
              Space
            </kbd>
            <span>Play</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-zinc-800 bg-[#09090B] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-zinc-300">
              ←
            </kbd>
            <kbd className="rounded border border-zinc-800 bg-[#09090B] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-zinc-300">
              →
            </kbd>
            <span>Paso</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-zinc-800 bg-[#09090B] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-zinc-300">
              R
            </kbd>
            <span>Reset</span>
          </span>
        </div>
      </div>

      {/* Ficha Técnica: Reconocimiento y Ejecución (sin íconos decorativos) */}
      <div className="divide-y divide-[#222226] text-xs leading-relaxed">
        <div className="px-3.5 py-2.5">
          <div className="font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            {selection.stage === 'Notation' ? 'VECTOR DE GIRO' : 'RECONOCIMIENTO'}
          </div>
          <p className="mt-1 text-zinc-300">{selection.recognition}</p>
        </div>

        <div className="px-3.5 py-2.5">
          <div className="font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            {selection.stage === 'Notation' ? 'ERGONOMÍA' : 'EJECUCIÓN / FINGERTRICKS'}
          </div>
          <p className="mt-1 text-zinc-300">{selection.explanation}</p>
        </div>
      </div>
    </div>
  );
};
