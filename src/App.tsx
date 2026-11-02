import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronUp, X } from 'lucide-react';
import {
  CFOP_CASES,
  FUNDAMENTAL_TRIGGERS,
  NOTATION_MOVES,
  type TriggerDemo,
} from './data/cfopData';
import { CfopCatalogModule } from './components/CfopCatalogModule';
import { CubeViewer } from './components/CubeViewer';
import { NotationModule } from './components/NotationModule';
import type {
  ActiveSelection,
  CfopCase,
  CfopStage,
  NotationMove,
} from './types/cfop';
import { triggerHaptic } from './utils/haptics';

const DESKTOP_QUERY = '(min-width: 1024px)';
const SWIPE_CLOSE_THRESHOLD = 90;

function caseToSelection(c: CfopCase, autoPlayNonce?: number): ActiveSelection {
  return {
    id: c.id,
    code: c.code,
    title: c.name,
    subtitle: `${c.stage} · ${c.subcategory}`,
    alg: c.alg,
    altAlg: c.altAlg,
    stage: c.stage,
    stickering: c.stage,
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
    stage: 'Notation',
    stickering: 'full',
    setupAnchor: 'start',
    recognition: m.description,
    explanation: m.fingertrickTip,
    autoPlayNonce: nonce,
  };
}

const NAV_ITEMS: Array<{ id: CfopStage; label: string; dotColor?: string }> = [
  { id: 'Notation', label: 'Notación' },
  { id: 'Cross', label: 'Cross', dotColor: 'bg-[#F4F4F5]' },
  { id: 'F2L', label: 'F2L', dotColor: 'bg-[#3B82F6]' },
  { id: 'OLL', label: 'OLL', dotColor: 'bg-[#EAB308]' },
  { id: 'PLL', label: 'PLL', dotColor: 'bg-[#EF4444]' },
];

function isDesktop(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;
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
    const initialCase = CFOP_CASES.find((c) => c.stage === 'F2L') ?? CFOP_CASES[0];
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
        stage: 'Notation',
        stickering: 'full',
        setupAnchor: 'end',
        recognition: trig.description,
        explanation: 'Practícalo a 0.5x y sube la velocidad cuando salga sin pausas.',
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

  const headerMetric = useMemo(() => {
    if (activeTab === 'Notation') {
      const ids = [
        ...NOTATION_MOVES.map((m) => m.id),
        ...FUNDAMENTAL_TRIGGERS.map((t) => t.id),
      ];
      const idx = Math.max(0, ids.indexOf(selection.id)) + 1;
      return `${idx}/${ids.length}`;
    }
    const stageCases = CFOP_CASES.filter((c) => c.stage === activeTab);
    const idx = Math.max(0, stageCases.findIndex((c) => c.id === selection.id)) + 1;
    return `${idx}/${stageCases.length}`;
  }, [activeTab, selection.id]);

  return (
    <div className="relative flex min-h-[100dvh] flex-col text-zinc-100">
      {/* Header: 56px + safe area superior */}
      <header className="pt-safe sticky top-0 z-30 border-b border-[#222226] bg-[#09090B]/90 backdrop-blur-md">
        <div className="px-safe mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 sm:px-6">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5"
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
                  className={`inline-flex h-7 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#FAFAFA] font-semibold text-[#09090B]'
                      : 'text-zinc-400 hover:bg-[#16161A] hover:text-zinc-200'
                  }`}
                >
                  {item.dotColor && (
                    <span className={`h-1.5 w-1.5 rounded-full ${item.dotColor}`} />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controles rápidos de la derecha: Modo Zurdo + Métrica */}
          <div className="flex items-center gap-2">
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

            <span
              translate="no"
              className="font-mono text-xs tabular-nums text-zinc-500"
              aria-label="Posición del caso actual"
            >
              {headerMetric}
            </span>
          </div>
        </div>
      </header>

      <main className="px-safe pb-dock mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 pt-4 sm:px-6 sm:pt-5 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
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
            />
          )}
        </div>

        {/* Fondo oscuro del panel móvil */}
        <div
          onClick={() => setIsSheetOpen(false)}
          aria-hidden="true"
          className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-200 lg:hidden ${
            isSheetOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />

        {/* Única instancia WebGL: sidebar en desktop / panel inferior en móvil */}
        <aside
          aria-label="Visor 3D"
          style={
            dragOffset > 0
              ? { transform: `translateY(${dragOffset}px)`, transition: 'none' }
              : undefined
          }
          className={`lg:static lg:z-auto lg:block lg:w-[380px] lg:shrink-0 xl:w-[400px] max-lg:max-h-sheet max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-50 max-lg:flex max-lg:flex-col max-lg:rounded-t-xl max-lg:border-t max-lg:border-[#222226] max-lg:bg-[#09090B] max-lg:transition-transform max-lg:duration-300 max-lg:ease-out ${
            isSheetOpen
              ? 'max-lg:translate-y-0'
              : 'max-lg:pointer-events-none max-lg:translate-y-full'
          }`}
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
              aria-label="Cerrar visor"
              className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-zinc-500 hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-lg:pb-safe-2 max-lg:min-h-0 max-lg:flex-1 max-lg:overflow-y-auto max-lg:overscroll-contain max-lg:px-2 lg:sticky lg:top-[72px]">
            <CubeViewer selection={selection} isLeftyGlobal={isLeftyMode} />
          </div>
        </aside>
      </main>

      <footer className="hidden border-t border-[#222226] py-4 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 font-mono text-[11px] text-zinc-600">
          <span>CFOP Master</span>
          <span>Notación WCA · cubing.js · PWA</span>
        </div>
      </footer>

      {/* Dock inferior móvil: mini reproductor + selector de etapas */}
      <div className="pb-safe-2 fixed inset-x-0 bottom-0 z-30 border-t border-[#222226] bg-[#09090B]/95 px-3 pt-2 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsSheetOpen(true);
            }}
            className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-lg border border-[#222226] bg-[#111113] pr-1.5 pl-3 text-left active:bg-[#16161A]"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
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
                className="truncate font-mono text-[11px] tabular-nums text-zinc-500"
              >
                {selection.alg}
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
            className={`flex h-12 w-11 shrink-0 flex-col items-center justify-center rounded-lg border font-mono text-[10px] font-medium transition-colors ${
              isLeftyMode
                ? 'border-[#3B82F6] bg-[#3B82F6]/15 text-[#3B82F6]'
                : 'border-[#222226] bg-[#111113] text-zinc-400'
            }`}
          >
            <span>L↔R</span>
            <span className="text-[9px]">{isLeftyMode ? 'Z' : 'D'}</span>
          </button>
        </div>

        <nav
          aria-label="Etapas"
          className="mt-2 grid grid-cols-5 gap-0.5 rounded-lg border border-[#222226] bg-[#111113] p-0.5"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex h-10 items-center justify-center gap-1 rounded-md text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#FAFAFA] font-semibold text-[#09090B]'
                    : 'text-zinc-400'
                }`}
              >
                {item.dotColor && (
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.dotColor}`}
                  />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default App;
