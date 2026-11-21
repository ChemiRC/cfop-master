import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronUp, Timer, X } from 'lucide-react';
import {
  CFOP_CASES,
  CFOP_REDUCIDO_CASES,
  FUNDAMENTAL_TRIGGERS,
  NOTATION_MOVES,
  type TriggerDemo,
} from './data/cfopData';
import { CfopCatalogModule } from './components/CfopCatalogModule';
import { Cube2DPreview } from './components/Cube2DPreview';
import { CubeViewer } from './components/CubeViewer';
import { NotationModule } from './components/NotationModule';
import { TimerModule } from './components/TimerModule';
import type {
  ActiveSelection,
  CfopCase,
  CfopStage,
  NotationMove,
  VisualStage,
} from './types/cfop';
import { mirrorAlgLR } from './utils/algHelpers';
import { triggerHaptic } from './utils/haptics';

const DESKTOP_QUERY = '(min-width: 1024px)';
const SWIPE_CLOSE_THRESHOLD = 90;
const REDUCIDO_LEARNED_STORAGE_KEY = 'cfop_reducido_learned';

function resolveVisualStage(c: CfopCase): VisualStage {
  if (c.visualStage) return c.visualStage;
  if (c.stage === 'Reducido') return 'OLL';
  return c.stage;
}

function caseToSelection(c: CfopCase, autoPlayNonce?: number): ActiveSelection {
  const visualStage = resolveVisualStage(c);
  return {
    id: c.id,
    code: c.code,
    title: c.name,
    subtitle: `${c.stage === 'Reducido' ? 'CFOP Reducido' : c.stage} · ${c.category}`,
    alg: c.alg,
    altAlg: c.altAlg,
    altAlgs: c.altAlgs,
    altAlgLabels: c.altAlgLabels,
    guideNote: c.guideNote,
    sectionBadge: c.sectionBadge,
    videoTimestamp: c.videoTimestamp,
    videoUrl: c.videoUrl,
    twoLook: c.twoLook,
    stage: c.stage,
    visualStage,
    stickering: visualStage,
    setupAnchor: 'end',
    recognition: c.recognition,
    explanation: c.explanation,
    tags: c.tags,
    grip: c.grip,
    auf: c.auf,
    autoPlayNonce,
  };
}

function moveToSelection(m: NotationMove, nonce: number): ActiveSelection {
  return {
    id: m.id,
    code: m.move,
    title: m.name,
    subtitle: `${m.faceLabel} · ${m.directionLabel}`,
    alg: m.move,
    altAlgs: [],
    twoLook: false,
    stage: 'Notation',
    stickering: 'full',
    setupAnchor: 'start',
    recognition: m.description,
    explanation: m.fingertrickTip,
    tags: [],
    autoPlayNonce: nonce,
  };
}

const NAV_ITEMS: Array<{
  id: CfopStage;
  label: string;
  mobileLabel: string;
  count?: number;
  dotColor?: string;
  isTimer?: boolean;
}> = [
  { id: 'Notation', label: 'Notación', mobileLabel: 'Notac.' },
  {
    id: 'Reducido',
    label: 'Reducido',
    mobileLabel: 'Reduc.',
    count: CFOP_REDUCIDO_CASES.length,
    dotColor: 'bg-[#10B981]',
  },
  { id: 'Cross', label: 'Cross', mobileLabel: 'Cross', count: 6, dotColor: 'bg-[#F4F4F5]' },
  { id: 'F2L', label: 'F2L', mobileLabel: 'F2L', count: 41, dotColor: 'bg-[#3B82F6]' },
  { id: 'OLL', label: 'OLL', mobileLabel: 'OLL', count: 57, dotColor: 'bg-[#EAB308]' },
  { id: 'PLL', label: 'PLL', mobileLabel: 'PLL', count: 21, dotColor: 'bg-[#EF4444]' },
  { id: 'Timer', label: 'Timer', mobileLabel: 'Timer', isTimer: true },
];

function isDesktop(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches
  );
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CfopStage>('F2L');
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const dragStartY = useRef<number | null>(null);

  // Modo Zurdo Global persistente
  const [isLeftyMode, setIsLeftyMode] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem('cfop_lefty') === 'true';
      }
    } catch {
      // Ignore
    }
    return false;
  });

  // Progreso local de CFOP Reducido persistido en localStorage
  const [reducidoLearnedIds, setReducidoLearnedIds] = useState<Set<string>>(
    () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const raw = window.localStorage.getItem(REDUCIDO_LEARNED_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              return new Set(
                parsed.filter((item): item is string => typeof item === 'string')
              );
            }
          }
        }
      } catch {
        // Ignore corrupted storage
      }
      return new Set();
    }
  );

  const toggleReducidoLearned = useCallback((caseId: string) => {
    setReducidoLearnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(caseId)) {
        next.delete(caseId);
      } else {
        next.add(caseId);
      }
      try {
        window.localStorage.setItem(
          REDUCIDO_LEARNED_STORAGE_KEY,
          JSON.stringify(Array.from(next))
        );
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const toggleLeftyMode = useCallback(() => {
    setIsLeftyMode((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem('cfop_lefty', String(next));
      } catch {
        // Ignore
      }
      triggerHaptic('medium');
      return next;
    });
  }, []);

  const [selection, setSelection] = useState<ActiveSelection>(() => {
    const initialCase =
      CFOP_CASES.find((c) => c.stage === 'F2L') ?? CFOP_CASES[0];
    return caseToSelection(initialCase);
  });

  const openSheetOnMobile = useCallback(() => {
    if (!isDesktop()) setIsSheetOpen(true);
  }, []);

  const handleTabChange = useCallback((stage: CfopStage) => {
    triggerHaptic('selection');
    setActiveTab(stage);
    setIsSheetOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (stage === 'Timer') return;
    if (stage === 'Notation') {
      setSelection(moveToSelection(NOTATION_MOVES[0], 0));
    } else {
      const firstStageCase = CFOP_CASES.find((c) => c.stage === stage);
      if (firstStageCase) setSelection(caseToSelection(firstStageCase));
    }
  }, []);

  const handleSelectMove = useCallback(
    (move: NotationMove) => {
      triggerHaptic('light');
      setSelection(moveToSelection(move, Date.now()));
      openSheetOnMobile();
    },
    [openSheetOnMobile]
  );

  const handleSelectTrigger = useCallback(
    (trig: TriggerDemo) => {
      triggerHaptic('light');
      setSelection({
        id: trig.id,
        code: 'TRIGGER',
        title: trig.name,
        subtitle: 'Secuencia base',
        alg: trig.alg,
        altAlgs: [],
        twoLook: false,
        stage: 'Notation',
        stickering: 'full',
        setupAnchor: 'end',
        recognition: trig.description,
        explanation:
          'Practícalo a 0.5x y sube la velocidad cuando salga sin pausas.',
        tags: [],
        autoPlayNonce: Date.now(),
      });
      openSheetOnMobile();
    },
    [openSheetOnMobile]
  );

  const handleSelectCase = useCallback(
    (cfopCase: CfopCase) => {
      triggerHaptic('light');
      setSelection(caseToSelection(cfopCase));
      openSheetOnMobile();
    },
    [openSheetOnMobile]
  );

  // Bloquea el scroll del fondo mientras el panel inferior está abierto (iOS)
  useEffect(() => {
    if (!isSheetOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSheetOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isSheetOpen]);

  // Cierra el panel móvil si la ventana pasa a tamaño desktop
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      if (mq.matches) setIsSheetOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Gesto de deslizar hacia abajo para cerrar (solo en la barra de arrastre)
  const onHandleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };
  const onHandleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    setDragOffset(Math.max(0, e.touches[0].clientY - dragStartY.current));
  };
  const onHandleTouchEnd = () => {
    if (dragOffset > SWIPE_CLOSE_THRESHOLD) setIsSheetOpen(false);
    dragStartY.current = null;
    setDragOffset(0);
  };

  const isTimerTab = activeTab === 'Timer';

  const headerMetric = useMemo(() => {
    if (activeTab === 'Timer') return 'WCA 3×3';
    if (activeTab === 'Notation') {
      const ids = [
        ...NOTATION_MOVES.map((m) => m.id),
        ...FUNDAMENTAL_TRIGGERS.map((t) => t.id),
      ];
      const idx = Math.max(0, ids.indexOf(selection.id)) + 1;
      return `${idx}/${ids.length}`;
    }
    const stageCases = CFOP_CASES.filter((c) => c.stage === activeTab);
    const idx =
      Math.max(0, stageCases.findIndex((c) => c.id === selection.id)) + 1;
    const label = activeTab === 'Reducido' ? 'RED' : activeTab;
    return `${idx}/${stageCases.length} ${label}`;
  }, [activeTab, selection.id]);

  const dockPreviewStage: VisualStage =
    selection.visualStage ??
    (selection.stage === 'Notation' ||
    selection.stage === 'Reducido' ||
    selection.stage === 'Timer'
      ? 'F2L'
      : selection.stage);
  const dockDisplayAlg = isLeftyMode
    ? mirrorAlgLR(selection.alg)
    : selection.alg;

  const isSelectionReducido = selection.stage === 'Reducido';

  return (
    <div className="relative flex min-h-[100dvh] flex-col text-zinc-100">
      {/* Header: 56px + safe area superior */}
      <header className="pt-safe sticky top-0 z-30 border-b border-[#222226] bg-[#09090B]/90 backdrop-blur-md">
        <div className="px-safe mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 sm:px-6">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex shrink-0 items-center gap-2.5"
            aria-label="CFOP Master, volver arriba"
          >
            <span
              aria-hidden="true"
              className="grid h-5 w-5 grid-cols-2 gap-[1.5px] rounded-[4px] border border-zinc-700 p-[2px]"
            >
              <span className="rounded-[1px] bg-[#FAFAFA]" />
              <span className="rounded-[1px] bg-[#3B82F6]" />
              <span className="rounded-[1px] bg-[#EAB308]" />
              <span className="rounded-[1px] bg-[#EF4444]" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-[#FAFAFA]">
              CFOP Master
            </span>
          </button>

          {/* Selector de Etapas en Desktop */}
          <nav
            aria-label="Etapas"
            className="hidden items-center rounded-lg border border-[#222226] bg-[#111113] p-1 lg:flex"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabChange(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#FAFAFA] font-semibold text-[#09090B]'
                      : 'text-zinc-400 hover:bg-[#16161A] hover:text-zinc-200'
                  }`}
                >
                  {item.isTimer ? (
                    <Timer className="h-3.5 w-3.5" />
                  ) : (
                    item.dotColor && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${item.dotColor}`}
                      />
                    )
                  )}
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={`font-mono text-[10px] tabular-nums ${
                        isActive ? 'text-zinc-700' : 'text-zinc-500'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controles rápidos de la derecha */}
          <div className="flex shrink-0 items-center gap-2">
            {!isTimerTab && (
              <button
                type="button"
                onClick={toggleLeftyMode}
                title={
                  isLeftyMode
                    ? 'Modo Zurdo activo (L↔R activado en todos los algoritmos)'
                    : 'Activar Modo Zurdo global (espejo L↔R)'
                }
                className={`inline-flex h-7 items-center gap-1 rounded-md border px-2 font-mono text-[11px] font-medium transition-colors ${
                  isLeftyMode
                    ? 'border-[#3B82F6] bg-[#3B82F6]/15 text-[#3B82F6]'
                    : 'border-[#222226] bg-[#111113] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>L↔R</span>
                <span className="hidden sm:inline">
                  {isLeftyMode ? 'ZURDO' : 'DIESTRO'}
                </span>
              </button>
            )}

            <span
              translate="no"
              className="font-mono text-xs tabular-nums text-zinc-500"
              aria-label="Indicador actual"
            >
              {headerMetric}
            </span>
          </div>
        </div>
      </header>

      {/* Contenido principal: Timer a pantalla completa o Split-Screen 12 columnas */}
      <main
        className={
          isTimerTab
            ? 'flex w-full flex-1 flex-col pb-[calc(4.25rem+env(safe-area-inset-bottom))] lg:pb-0'
            : 'px-safe pb-dock mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-5 pt-4 sm:px-6 sm:pt-5 lg:grid-cols-12 lg:items-start lg:gap-6'
        }
      >
        {isTimerTab ? (
          <TimerModule />
        ) : (
          <div className="min-w-0 lg:col-span-7">
            {activeTab === 'Notation' ? (
              <NotationModule
                selectedId={selection.id}
                onSelectMove={handleSelectMove}
                onSelectTrigger={handleSelectTrigger}
              />
            ) : (
              <CfopCatalogModule
                stage={activeTab}
                selectedCaseId={selection.id}
                onSelectCase={handleSelectCase}
                isLeftyGlobal={isLeftyMode}
                learnedIds={
                  activeTab === 'Reducido' ? reducidoLearnedIds : undefined
                }
                onToggleLearned={
                  activeTab === 'Reducido' ? toggleReducidoLearned : undefined
                }
              />
            )}
          </div>
        )}

        {/* Fondo oscuro del panel móvil */}
        {!isTimerTab && (
          <div
            onClick={() => setIsSheetOpen(false)}
            aria-hidden="true"
            className={`fixed inset-0 z-40 bg-black/75 transition-opacity duration-200 lg:hidden ${
              isSheetOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          />
        )}

        {/* Visor 3D (oculto y con atajos desactivados cuando Timer está activo) */}
        <aside
          aria-label="Visor 3D"
          aria-hidden={isTimerTab || undefined}
          style={
            dragOffset > 0
              ? { transform: `translateY(${dragOffset}px)`, transition: 'none' }
              : undefined
          }
          className={
            isTimerTab
              ? 'hidden'
              : `lg:col-span-5 lg:static lg:z-auto lg:block max-lg:max-h-sheet max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-50 max-lg:flex max-lg:flex-col max-lg:rounded-t-xl max-lg:border-t max-lg:border-[#222226] max-lg:bg-[#09090B] max-lg:transition-transform max-lg:duration-300 max-lg:ease-out ${
                  isSheetOpen
                    ? 'max-lg:translate-y-0'
                    : 'max-lg:pointer-events-none max-lg:translate-y-full'
                }`
          }
        >
          {/* Barra de arrastre (móvil) */}
          <div
            onTouchStart={onHandleTouchStart}
            onTouchMove={onHandleTouchMove}
            onTouchEnd={onHandleTouchEnd}
            className="relative flex h-9 shrink-0 touch-none items-center justify-center lg:hidden"
          >
            <span className="h-1 w-10 rounded-full bg-zinc-700" />
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setIsSheetOpen(false);
              }}
              aria-label="Minimizar visor"
              className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-zinc-500 hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="no-scrollbar max-lg:pb-safe-2 max-lg:min-h-0 max-lg:flex-1 max-lg:overflow-y-auto max-lg:overscroll-contain max-lg:px-2 lg:sticky lg:top-16 lg:max-h-[calc(100vh-4.5rem)] lg:overflow-y-auto">
            <CubeViewer
              selection={selection}
              isLeftyGlobal={isLeftyMode}
              shortcutsEnabled={!isTimerTab}
              isLearned={
                isSelectionReducido
                  ? reducidoLearnedIds.has(selection.id)
                  : undefined
              }
              onToggleLearned={
                isSelectionReducido
                  ? () => toggleReducidoLearned(selection.id)
                  : undefined
              }
            />
          </div>
        </aside>
      </main>

      {!isTimerTab && (
        <footer className="hidden border-t border-[#222226] py-4 lg:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 font-mono text-[11px] text-zinc-600">
            <span>
              CFOP Master · 17 CFOP Reducido + 125 Full CFOP (Cross, 41 F2L, 57 OLL, 21 PLL)
            </span>
            <span>Notación WCA · cubing.js · PWA</span>
          </div>
        </footer>
      )}

      {/* Sticky Bottom Dock móvil (Zona del Pulgar) */}
      <div className="pb-safe-2 fixed inset-x-0 bottom-0 z-30 border-t border-[#222226] bg-[#09090B]/95 px-2.5 pt-2 backdrop-blur-md lg:hidden">
        {!isTimerTab && (
          <div className="mb-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setIsSheetOpen(true);
              }}
              className="flex h-13 min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-[#222226] bg-[#111113] p-1.5 text-left active:bg-[#16161A]"
            >
              <div className="[&>div]:h-10 [&>div]:w-10 [&>div]:p-0.5">
                <Cube2DPreview alg={dockDisplayAlg} stage={dockPreviewStage} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span
                    translate="no"
                    className="shrink-0 font-mono text-[11px] font-semibold tabular-nums text-[#FAFAFA]"
                  >
                    {selection.code}
                  </span>
                  <span className="truncate text-xs text-zinc-400">
                    {selection.title}
                  </span>
                </div>
                <p
                  translate="no"
                  className="truncate font-mono text-[11px] tabular-nums text-zinc-400"
                >
                  {dockDisplayAlg}
                </p>
              </div>
              <span className="inline-flex h-9 shrink-0 items-center gap-1 rounded-md bg-[#FAFAFA] px-2.5 font-mono text-xs font-semibold text-[#09090B]">
                3D
                <ChevronUp className="h-3.5 w-3.5" />
              </span>
            </button>

            <button
              type="button"
              onClick={toggleLeftyMode}
              title={isLeftyMode ? 'Modo Zurdo activo' : 'Activar Modo Zurdo'}
              className={`flex h-13 w-11 shrink-0 flex-col items-center justify-center rounded-lg border font-mono text-[10px] font-medium transition-colors ${
                isLeftyMode
                  ? 'border-[#3B82F6] bg-[#3B82F6]/15 text-[#3B82F6]'
                  : 'border-[#222226] bg-[#111113] text-zinc-400'
              }`}
            >
              <span>L↔R</span>
              <span className="text-[9px]">{isLeftyMode ? 'Z' : 'D'}</span>
            </button>
          </div>
        )}

        <nav
          aria-label="Etapas"
          className="grid grid-cols-7 gap-0.5 rounded-lg border border-[#222226] bg-[#111113] p-0.5"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex h-11 flex-col items-center justify-center gap-0.5 rounded-md px-0.5 text-[10px] font-medium transition-colors sm:flex-row sm:gap-1 sm:text-[11px] ${
                  isActive
                    ? 'bg-[#FAFAFA] font-semibold text-[#09090B]'
                    : 'text-zinc-400'
                }`}
              >
                {item.isTimer ? (
                  <Timer className="h-3 w-3 shrink-0" />
                ) : item.dotColor ? (
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.dotColor}`}
                  />
                ) : (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
                )}
                <span className="truncate leading-none">{item.mobileLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default App;
