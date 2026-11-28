import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Eye,
  Flame,
  Lightbulb,
  Play,
  RotateCcw,
  RotateCw,
  Shuffle,
  X,
} from 'lucide-react';
import type {
  CaseMastery,
  CfopCase,
  TopFaceColor,
  VisualStage,
} from '../types/cfop';
import { getCleanSetupAlg, mirrorAlgLR } from '../utils/algHelpers';
import { triggerHaptic } from '../utils/haptics';
import { AlgNotationBadges } from './AlgNotationBadges';
import { Cube2DPreview } from './Cube2DPreview';

interface PracticeTrainerModalProps {
  cases: CfopCase[];
  stageLabel: string;
  isLeftyGlobal: boolean;
  topFace: TopFaceColor;
  getMastery: (id: string) => CaseMastery;
  onSetMastery: (id: string, status: CaseMastery) => void;
  onOpenIn3D: (cfopCase: CfopCase) => void;
  onClose: () => void;
}

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildSmartQueue(
  cases: CfopCase[],
  getMastery: (id: string) => CaseMastery
): CfopCase[] {
  const practicing: CfopCase[] = [];
  const unlearned: CfopCase[] = [];
  const mastered: CfopCase[] = [];

  for (const c of cases) {
    const m = getMastery(c.id);
    if (m === 'practicing') practicing.push(c);
    else if (m === 'unlearned') unlearned.push(c);
    else mastered.push(c);
  }

  return [
    ...shuffleArray(practicing),
    ...shuffleArray(unlearned),
    ...shuffleArray(mastered),
  ];
}

type AufStep = 0 | 1 | 2 | 3;

const AUF_ROTATIONS: Record<
  AufStep,
  { rotateClass: string; revealedLabel: string }
> = {
  0: { rotateClass: 'rotate-0', revealedLabel: '0° (estándar)' },
  1: { rotateClass: 'rotate-90', revealedLabel: "+90° (AUF U')" },
  2: { rotateClass: 'rotate-180', revealedLabel: '180° (AUF U2)' },
  3: { rotateClass: '-rotate-90', revealedLabel: '-90° (AUF U)' },
};

function randomAufStep(): AufStep {
  return Math.floor(Math.random() * 4) as AufStep;
}

function resolvePreviewStage(item: CfopCase): VisualStage {
  if (item.visualStage) return item.visualStage;
  if (item.stage === 'Reducido') return 'OLL';
  return item.stage;
}

export const PracticeTrainerModal: React.FC<PracticeTrainerModalProps> = ({
  cases,
  stageLabel,
  isLeftyGlobal,
  topFace,
  getMastery,
  onSetMastery,
  onOpenIn3D,
  onClose,
}) => {
  const supportsLastLayerAuf = useMemo(
    () =>
      cases.some((c) => {
        const st = resolvePreviewStage(c);
        return st === 'OLL' || st === 'PLL';
      }),
    [cases]
  );

  const [queue, setQueue] = useState<CfopCase[]>(() =>
    buildSmartQueue(cases, getMastery)
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [showSetup, setShowSetup] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [randomAufEnabled, setRandomAufEnabled] = useState<boolean>(() =>
    cases.some((c) => {
      const st = resolvePreviewStage(c);
      return st === 'OLL' || st === 'PLL';
    })
  );
  const [aufStep, setAufStep] = useState<AufStep>(() => randomAufStep());
  const [copiedKey, setCopiedKey] = useState<'alg' | 'setup' | null>(null);
  const [knownCount, setKnownCount] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [missedIds, setMissedIds] = useState<Set<string>>(() => new Set());

  // Bloquea el scroll del fondo mientras el modal está abierto
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const currentCase = queue[currentIndex] ?? null;
  const isComplete = currentIndex >= queue.length;
  const totalRated = knownCount + reviewCount;
  const accuracy =
    totalRated > 0 ? Math.round((knownCount / totalRated) * 100) : null;

  const displayAlg = useMemo(() => {
    if (!currentCase) return '';
    return isLeftyGlobal ? mirrorAlgLR(currentCase.alg) : currentCase.alg;
  }, [currentCase, isLeftyGlobal]);

  const setupAlg = useMemo(() => getCleanSetupAlg(displayAlg), [displayAlg]);

  const currentPreviewStage: VisualStage = currentCase
    ? resolvePreviewStage(currentCase)
    : 'OLL';
  const applyAufToCard =
    randomAufEnabled &&
    (currentPreviewStage === 'OLL' || currentPreviewStage === 'PLL');
  const activeAufMeta = AUF_ROTATIONS[applyAufToCard ? aufStep : 0];

  const resetCardUi = useCallback(() => {
    setIsRevealed(false);
    setShowSetup(false);
    setShowHint(false);
    setCopiedKey(null);
    setAufStep(randomAufStep());
  }, []);

  const handleShuffleDeck = useCallback(() => {
    triggerHaptic('selection');
    setQueue(shuffleArray(cases));
    setCurrentIndex(0);
    setKnownCount(0);
    setReviewCount(0);
    setMissedIds(new Set());
    resetCardUi();
  }, [cases, resetCardUi]);

  const handleRestartMissed = useCallback(() => {
    const missedCases = cases.filter((c) => missedIds.has(c.id));
    if (missedCases.length === 0) {
      handleShuffleDeck();
      return;
    }
    triggerHaptic('selection');
    setQueue(shuffleArray(missedCases));
    setCurrentIndex(0);
    setKnownCount(0);
    setReviewCount(0);
    setMissedIds(new Set());
    resetCardUi();
  }, [cases, handleShuffleDeck, missedIds, resetCardUi]);

  const handleCopy = useCallback(
    async (text: string, kind: 'alg' | 'setup') => {
      try {
        await navigator.clipboard.writeText(text);
        triggerHaptic('success');
        setCopiedKey(kind);
        window.setTimeout(() => setCopiedKey(null), 1400);
      } catch {
        // Portapapeles no disponible
      }
    },
    []
  );

  const handleGradeReview = useCallback(() => {
    if (!currentCase) return;
    triggerHaptic('medium');
    onSetMastery(currentCase.id, 'practicing');
    setReviewCount((c) => c + 1);
    setMissedIds((prev) => {
      const next = new Set(prev);
      next.add(currentCase.id);
      return next;
    });

    // Re-inserta el caso ~3 tarjetas después dentro de la sesión actual (spaced repetition)
    setQueue((prev) => {
      const insertAt = Math.min(prev.length, currentIndex + 4);
      const next = [...prev];
      // Evita duplicar si ya existe más adelante en la cola
      const alreadyAhead = prev
        .slice(currentIndex + 1)
        .some((item) => item.id === currentCase.id);
      if (!alreadyAhead && prev.length < cases.length * 3) {
        next.splice(insertAt, 0, currentCase);
      }
      return next;
    });

    setCurrentIndex((i) => i + 1);
    resetCardUi();
  }, [cases.length, currentCase, currentIndex, onSetMastery, resetCardUi]);

  const handleGradeKnown = useCallback(() => {
    if (!currentCase) return;
    triggerHaptic('success');
    onSetMastery(currentCase.id, 'mastered');
    setKnownCount((c) => c + 1);
    setCurrentIndex((i) => i + 1);
    resetCardUi();
  }, [currentCase, onSetMastery, resetCardUi]);

  // Atajos de teclado completos en escritorio: Space/Enter revelar, 1/← Repasar, 2/→ Dominado, S Setup, H Pista, Esc cerrar
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
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

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (isComplete || !currentCase) return;

      if (!isRevealed) {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          triggerHaptic('light');
          setIsRevealed(true);
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          triggerHaptic('selection');
          setShowHint((prev) => !prev);
        } else if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          triggerHaptic('selection');
          setShowSetup((prev) => !prev);
        }
      } else {
        if (e.key === '1' || e.key === 'ArrowLeft') {
          e.preventDefault();
          handleGradeReview();
        } else if (e.key === '2' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleGradeKnown();
        } else if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          triggerHaptic('selection');
          setShowSetup((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    currentCase,
    handleGradeKnown,
    handleGradeReview,
    isComplete,
    isRevealed,
    onClose,
  ]);

  const progressPct =
    queue.length > 0
      ? Math.min(100, Math.round((currentIndex / queue.length) * 100))
      : 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Entrenamiento Active Recall: ${stageLabel}`}
      className="fixed inset-0 z-50 flex flex-col bg-[#09090B]/95 backdrop-blur-md sm:items-center sm:justify-center sm:p-4"
    >
      <div className="pt-safe pb-safe-2 flex h-full w-full flex-col bg-[#09090B] sm:h-auto sm:max-h-[90dvh] sm:max-w-lg sm:overflow-hidden sm:rounded-2xl sm:border sm:border-[#222226] sm:bg-[#111113] sm:pt-0 sm:pb-0">
        {/* Cabecera de sesión */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#222226] px-4 py-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#10B981]">
                Active Recall
              </span>
              <span className="text-zinc-700">·</span>
              <span className="truncate text-xs font-medium text-zinc-300">
                {stageLabel}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] tabular-nums text-zinc-400">
              <span>
                {Math.min(currentIndex + 1, queue.length)}/{queue.length}
              </span>
              {accuracy !== null && (
                <>
                  <span className="text-zinc-700">·</span>
                  <span className="text-[#10B981]">{accuracy}% aciertos</span>
                </>
              )}
              {isLeftyGlobal && (
                <span className="rounded border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-1 text-[10px] text-[#3B82F6]">
                  L↔R
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {supportsLastLayerAuf && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setRandomAufEnabled((prev) => {
                    const next = !prev;
                    if (next) setAufStep(randomAufStep());
                    return next;
                  });
                }}
                aria-pressed={randomAufEnabled}
                title="Rotar aleatoriamente 0°/90°/180°/270° cada diagrama OLL/PLL para entrenar reconocimiento multi-ángulo"
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2 font-mono text-[11px] font-medium transition-colors ${
                  randomAufEnabled
                    ? 'border-[#FAFAFA] bg-[#FAFAFA] font-semibold text-[#09090B]'
                    : 'border-[#222226] bg-[#09090B] text-zinc-400 hover:border-zinc-700 hover:text-[#FAFAFA]'
                }`}
              >
                <RotateCw className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Random AUF</span>
                <span className="sm:hidden">AUF</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleShuffleDeck}
              title="Mezclar tarjetas"
              aria-label="Mezclar tarjetas"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#222226] bg-[#09090B] px-2.5 font-mono text-[11px] text-zinc-300 transition-colors hover:border-zinc-700 hover:text-[#FAFAFA]"
            >
              <Shuffle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mezclar</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              aria-label="Cerrar entrenador"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#222226] bg-[#09090B] text-zinc-400 transition-colors hover:border-zinc-700 hover:text-[#FAFAFA]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="h-1 w-full shrink-0 bg-zinc-900">
          <div
            className="h-full bg-[#10B981] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Cuerpo principal */}
        {isComplete || !currentCase ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981]">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-[#FAFAFA]">
              Sesión completada
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              Practicaste {totalRated} {totalRated === 1 ? 'tarjeta' : 'tarjetas'} de{' '}
              {stageLabel}
            </p>

            <div className="mt-5 grid w-full max-w-xs grid-cols-3 gap-2">
              <div className="rounded-lg border border-[#222226] bg-[#111113] p-2.5 sm:bg-[#09090B]">
                <div className="font-mono text-lg font-semibold tabular-nums text-[#10B981]">
                  {knownCount}
                </div>
                <div className="font-mono text-[10px] uppercase text-zinc-500">
                  Dominados
                </div>
              </div>
              <div className="rounded-lg border border-[#222226] bg-[#111113] p-2.5 sm:bg-[#09090B]">
                <div className="font-mono text-lg font-semibold tabular-nums text-amber-400">
                  {reviewCount}
                </div>
                <div className="font-mono text-[10px] uppercase text-zinc-500">
                  A repasar
                </div>
              </div>
              <div className="rounded-lg border border-[#222226] bg-[#111113] p-2.5 sm:bg-[#09090B]">
                <div className="font-mono text-lg font-semibold tabular-nums text-[#FAFAFA]">
                  {accuracy ?? 100}%
                </div>
                <div className="font-mono text-[10px] uppercase text-zinc-500">
                  Precisión
                </div>
              </div>
            </div>

            <div className="mt-6 flex w-full max-w-xs flex-col gap-2">
              {missedIds.size > 0 && (
                <button
                  type="button"
                  onClick={handleRestartMissed}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/15 px-4 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/20"
                >
                  <Flame className="h-4 w-4" />
                  <span>Repasar los que costaron ({missedIds.size})</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleShuffleDeck}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FAFAFA] px-4 text-sm font-semibold text-[#09090B] transition-colors hover:bg-zinc-200"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Otra ronda completa</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onClose();
                }}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#222226] bg-[#09090B] px-4 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-[#FAFAFA]"
              >
                Volver al catálogo
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="no-scrollbar flex flex-1 flex-col items-center overflow-y-auto px-4 py-4">
              {/* Badges sin spoiler */}
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <span className="rounded border border-[#222226] bg-[#111113] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400 sm:bg-[#09090B]">
                  {currentCase.stage === 'Reducido'
                    ? currentCase.sectionBadge ?? 'Reducido'
                    : currentCase.stage}
                </span>
                {currentCase.twoLook && (
                  <span className="rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">
                    2-LOOK
                  </span>
                )}
                {getMastery(currentCase.id) === 'practicing' && (
                  <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] text-amber-400">
                    Practicando
                  </span>
                )}
                {getMastery(currentCase.id) === 'mastered' && (
                  <span className="rounded border border-[#10B981]/40 bg-[#10B981]/10 px-1.5 py-0.5 font-mono text-[10px] text-[#10B981]">
                    Dominado
                  </span>
                )}
              </div>

              {/* Diagrama 2D grande con rotación Random AUF opcional */}
              <div className="my-4">
                <div
                  className={`transition-transform duration-200 ${activeAufMeta.rotateClass}`}
                >
                  <Cube2DPreview
                    alg={displayAlg}
                    stage={currentPreviewStage}
                    topFace={topFace}
                    className="h-44 w-44 p-2 sm:h-48 sm:w-48"
                  />
                </div>
              </div>

              {/* Botones compactos de apoyo sin spoiler: Setup (Inverso) y Pista */}
              <div className="flex w-full max-w-md items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setShowSetup((prev) => !prev);
                  }}
                  aria-expanded={showSetup}
                  className={`inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 font-mono text-xs transition-colors ${
                    showSetup
                      ? 'border-zinc-500 bg-zinc-800 text-[#FAFAFA]'
                      : 'border-[#222226] bg-[#111113] text-zinc-300 hover:border-zinc-700 sm:bg-[#09090B]'
                  }`}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Setup (Inverso)</span>
                  <kbd className="hidden rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-[9px] text-zinc-400 lg:inline">
                    S
                  </kbd>
                </button>

                {!isRevealed && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setShowHint((prev) => !prev);
                    }}
                    aria-expanded={showHint}
                    className={`inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 font-mono text-xs transition-colors ${
                      showHint
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                        : 'border-[#222226] bg-[#111113] text-zinc-300 hover:border-zinc-700 sm:bg-[#09090B]'
                    }`}
                  >
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>Pista</span>
                    <kbd className="hidden rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-[9px] text-zinc-400 lg:inline">
                      H
                    </kbd>
                  </button>
                )}
              </div>

              {/* Bloque Setup (Inverso) */}
              {showSetup && (
                <div className="mt-2.5 flex w-full max-w-md items-center justify-between gap-2 rounded-lg border border-[#222226] bg-[#111113] px-3 py-2 sm:bg-[#09090B]">
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      Armar caso desde cubo resuelto
                    </div>
                    <p
                      translate="no"
                      className="mt-0.5 break-words font-mono text-xs tabular-nums text-zinc-200"
                    >
                      {setupAlg}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(setupAlg, 'setup')}
                    aria-label="Copiar setup inverso"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#222226] bg-[#09090B] text-zinc-400 hover:text-[#FAFAFA]"
                  >
                    {copiedKey === 'setup' ? (
                      <Check className="h-3.5 w-3.5 text-[#10B981]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              )}

              {/* Bloque Pista (sin revelar el algoritmo) */}
              {showHint && !isRevealed && (
                <div className="mt-2.5 w-full max-w-md rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 text-left">
                  {currentCase.auf && (
                    <p className="font-mono text-[11px] text-amber-300">
                      <span className="text-zinc-500">AUF: </span>
                      {currentCase.auf}
                    </p>
                  )}
                  <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                    {currentCase.recognition}
                  </p>
                </div>
              )}

              {/* Respuesta revelada */}
              {isRevealed ? (
                <div className="mt-3 w-full max-w-md space-y-2.5 rounded-xl border border-[#222226] bg-[#111113] p-3 text-left sm:bg-[#09090B]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span
                        translate="no"
                        className="font-mono text-[11px] font-semibold text-[#10B981]"
                      >
                        {currentCase.code}
                      </span>
                      <h3 className="truncate text-sm font-semibold text-[#FAFAFA]">
                        {currentCase.name}
                      </h3>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(displayAlg, 'alg')}
                        aria-label="Copiar algoritmo"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-[#222226] bg-[#09090B] text-zinc-400 hover:text-[#FAFAFA]"
                      >
                        {copiedKey === 'alg' ? (
                          <Check className="h-3.5 w-3.5 text-[#10B981]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('selection');
                          onOpenIn3D(currentCase);
                        }}
                        className="inline-flex h-8 items-center gap-1 rounded-md bg-[#FAFAFA] px-2.5 font-mono text-[11px] font-semibold text-[#09090B] transition-colors hover:bg-zinc-200"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Abrir en 3D</span>
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#222226] bg-[#09090B] p-2.5 sm:bg-[#111113]">
                    <AlgNotationBadges alg={displayAlg} />
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-zinc-400">
                    {applyAufToCard && (
                      <span>
                        <span className="text-zinc-600">ÁNGULO: </span>
                        <span className="text-sky-400">
                          {activeAufMeta.revealedLabel}
                        </span>
                      </span>
                    )}
                    {currentCase.grip && (
                      <span>
                        <span className="text-zinc-600">AGARRE: </span>
                        <span className="text-zinc-200">{currentCase.grip}</span>
                      </span>
                    )}
                    {currentCase.auf && (
                      <span>
                        <span className="text-zinc-600">AUF: </span>
                        <span className="text-zinc-200">{currentCase.auf}</span>
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="mt-4 max-w-xs text-center text-xs text-zinc-500">
                  Reconoce el patrón, ejecútalo en tu cubo físico y revela para verificar.
                </p>
              )}
            </div>

            {/* Zona de pulgar fija en la parte inferior */}
            <div className="shrink-0 border-t border-[#222226] bg-[#09090B] px-4 py-3 sm:bg-[#111113]">
              {!isRevealed ? (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setIsRevealed(true);
                  }}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FAFAFA] px-4 text-sm font-semibold text-[#09090B] transition-colors hover:bg-zinc-200 active:bg-zinc-300"
                >
                  <Eye className="h-4 w-4" />
                  <span>Mostrar algoritmo</span>
                  <kbd className="hidden rounded border border-zinc-400/50 bg-zinc-900/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-700 lg:inline">
                    Espacio
                  </kbd>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleGradeReview}
                    className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-500/15 px-3 text-sm font-semibold text-amber-300 transition-colors active:bg-amber-500/25"
                  >
                    <Flame className="h-4 w-4" />
                    <span>Repasar</span>
                    <kbd className="hidden rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] text-amber-200 lg:inline">
                      1 / ←
                    </kbd>
                  </button>
                  <button
                    type="button"
                    onClick={handleGradeKnown}
                    className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-[#10B981]/50 bg-[#10B981]/15 px-3 text-sm font-semibold text-[#10B981] transition-colors active:bg-[#10B981]/25"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>¡Lo domino!</span>
                    <kbd className="hidden rounded border border-[#10B981]/40 bg-[#10B981]/10 px-1.5 py-0.5 font-mono text-[10px] text-[#10B981] lg:inline">
                      2 / →
                    </kbd>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
