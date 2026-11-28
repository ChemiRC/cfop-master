import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Layers, Play, Timer, X, Zap } from 'lucide-react';
import {
  CFOP_CASES,
  CFOP_REDUCIDO_CASES,
  FUNDAMENTAL_TRIGGERS,
  NOTATION_MOVES,
  type TriggerDemo,
} from './data/cfopData';
import { CfopCatalogModule } from './components/CfopCatalogModule';
import { Cube2DPreview } from './components/Cube2DPreview';
import {
  CubeViewer,
  type CubeViewerNavigation,
} from './components/CubeViewer';
import { NotationModule } from './components/NotationModule';
import { PracticeTrainerModal } from './components/PracticeTrainerModal';
import { TimerModule } from './components/TimerModule';
import { useCaseMastery } from './hooks/useCaseMastery';
import type {
  ActiveSelection,
  CfopCase,
  CfopSubStage,
  LearningStage,
  MainSection,
  NotationMove,
  TopFaceColor,
  VisualStage,
} from './types/cfop';
import { mirrorAlgLR } from './utils/algHelpers';
import { triggerHaptic } from './utils/haptics';

const DESKTOP_QUERY = '(min-width: 1024px)';
const SWIPE_CLOSE_THRESHOLD = 90;

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

function triggerToSelection(trig: TriggerDemo, nonce: number): ActiveSelection {
  return {
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
    autoPlayNonce: nonce,
  };
}

interface MainNavConfig {
  id: MainSection;
  label: string;
  count?: number;
}

const FULL_CFOP_COUNT = CFOP_CASES.length - CFOP_REDUCIDO_CASES.length;

const MAIN_NAV_ITEMS: MainNavConfig[] = [
  {
    id: 'Reducido',
    label: 'Reducido',
    count: CFOP_REDUCIDO_CASES.length,
  },
  {
    id: 'CFOP',
    label: 'CFOP',
    count: FULL_CFOP_COUNT,
  },
  { id: 'Notation', label: 'Notación' },
  { id: 'Timer', label: 'Timer' },
];

interface CfopSubStageConfig {
  id: CfopSubStage;
  label: string;
  count: number;
  dotClass: string;
  activeDotClass: string;
}

const CFOP_SUB_STAGE_ITEMS: CfopSubStageConfig[] = [
  {
    id: 'Cross',
    label: 'Cross',
    count: CFOP_CASES.filter((c) => c.stage === 'Cross').length,
    dotClass: 'bg-[#FAFAFA] ring-1 ring-zinc-500/80',
    activeDotClass: 'bg-zinc-900 ring-1 ring-zinc-400',
  },
  {
    id: 'F2L',
    label: 'F2L',
    count: CFOP_CASES.filter((c) => c.stage === 'F2L').length,
    dotClass: 'bg-[#3B82F6]',
    activeDotClass: 'bg-[#3B82F6]',
  },
  {
    id: 'OLL',
    label: 'OLL',
    count: CFOP_CASES.filter((c) => c.stage === 'OLL').length,
    dotClass: 'bg-[#EAB308]',
    activeDotClass: 'bg-[#EAB308]',
  },
  {
    id: 'PLL',
    label: 'PLL',
    count: CFOP_CASES.filter((c) => c.stage === 'PLL').length,
    dotClass: 'bg-[#EF4444]',
    activeDotClass: 'bg-[#EF4444]',
  },
];

function isDesktop(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches
  );
}

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<MainSection>('CFOP');
  const [activeCfopStage, setActiveCfopStage] = useState<CfopSubStage>('F2L');
  const [topFace, setTopFace] = useState<TopFaceColor>('yellow');
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const dragStartY = useRef<number | null>(null);
  const lastCfopCaseIdsRef = useRef<Partial<Record<CfopSubStage, string>>>({});

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

  const [filteredCatalogCases, setFilteredCatalogCases] = useState<CfopCase[]>(
    () => CFOP_CASES.filter((c) => c.stage === 'F2L')
  );
  const [practiceSession, setPracticeSession] = useState<{
    cases: CfopCase[];
    label: string;
  } | null>(null);

  // Sistema universal de dominio (Nuevo / Practicando / Dominado) para los 142 casos
  const { getMastery, setMastery, cycleMastery } = useCaseMastery();

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

  const toggleTopFace = useCallback(() => {
    setTopFace((prev) => (prev === 'yellow' ? 'white' : 'yellow'));
  }, []);

  const [selection, setSelection] = useState<ActiveSelection>(() => {
    const initialCase =
      CFOP_CASES.find((c) => c.stage === 'F2L') ?? CFOP_CASES[0];
    if (initialCase.stage !== 'Reducido') {
      lastCfopCaseIdsRef.current[initialCase.stage] = initialCase.id;
    }
    return caseToSelection(initialCase);
  });

  const openSheetOnMobile = useCallback(() => {
    if (!isDesktop()) setIsSheetOpen(true);
  }, []);

  const handleMainSectionChange = useCallback(
    (section: MainSection) => {
      triggerHaptic('selection');
      setActiveSection(section);
      setIsSheetOpen(false);
      window.scrollTo({
        top: 0,
        behavior: section === 'Timer' ? 'auto' : 'smooth',
      });

      if (section === 'Timer') return;
      if (section === 'Notation') {
        setSelection(moveToSelection(NOTATION_MOVES[0], 0));
        return;
      }
      if (section === 'Reducido') {
        const firstReducido = CFOP_CASES.find((c) => c.stage === 'Reducido');
        if (firstReducido) setSelection(caseToSelection(firstReducido));
        return;
      }

      // Al volver a CFOP, restaurar el último caso de la etapa recordada (o el primero)
      const rememberedId = lastCfopCaseIdsRef.current[activeCfopStage];
      const targetCase =
        (rememberedId &&
          CFOP_CASES.find(
            (c) => c.stage === activeCfopStage && c.id === rememberedId
          )) ||
        CFOP_CASES.find((c) => c.stage === activeCfopStage);
      if (targetCase) {
        setSelection(caseToSelection(targetCase));
      }
    },
    [activeCfopStage]
  );

  const handleCfopStageChange = useCallback((stage: CfopSubStage) => {
    triggerHaptic('selection');
    setActiveCfopStage(stage);
    setIsSheetOpen(false);
    const firstStageCase = CFOP_CASES.find((c) => c.stage === stage);
    if (firstStageCase) {
      lastCfopCaseIdsRef.current[stage] = firstStageCase.id;
      setSelection(caseToSelection(firstStageCase));
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
      setSelection(triggerToSelection(trig, Date.now()));
      openSheetOnMobile();
    },
    [openSheetOnMobile]
  );

  const handleSelectCase = useCallback(
    (cfopCase: CfopCase) => {
      triggerHaptic('light');
      if (cfopCase.stage !== 'Reducido') {
        lastCfopCaseIdsRef.current[cfopCase.stage] = cfopCase.id;
      }
      setSelection(caseToSelection(cfopCase));
      openSheetOnMobile();
    },
    [openSheetOnMobile]
  );

  const handleStartPractice = useCallback(
    (cases: CfopCase[], label: string) => {
      if (cases.length === 0) return;
      setIsSheetOpen(false);
      setPracticeSession({ cases, label });
    },
    []
  );

  const handleOpenPracticeCaseIn3D = useCallback(
    (cfopCase: CfopCase) => {
      setPracticeSession(null);
      if (cfopCase.stage !== 'Reducido') {
        lastCfopCaseIdsRef.current[cfopCase.stage] = cfopCase.id;
      }
      setSelection(caseToSelection(cfopCase, Date.now()));
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

  const isTimerTab = activeSection === 'Timer';
  const activeCatalogStage: LearningStage =
    activeSection === 'Reducido' ? 'Reducido' : activeCfopStage;

  const headerMetric = useMemo(() => {
    if (activeSection === 'Timer') return 'WCA 3×3';
    if (activeSection === 'Notation') {
      const ids = [
        ...NOTATION_MOVES.map((m) => m.id),
        ...FUNDAMENTAL_TRIGGERS.map((t) => t.id),
      ];
      const idx = Math.max(0, ids.indexOf(selection.id)) + 1;
      return `${idx}/${ids.length}`;
    }
    const stageCases = CFOP_CASES.filter((c) => c.stage === activeCatalogStage);
    const idx =
      Math.max(0, stageCases.findIndex((c) => c.id === selection.id)) + 1;
    const label = activeCatalogStage === 'Reducido' ? 'RED' : activeCatalogStage;
    return `${idx}/${stageCases.length} ${label}`;
  }, [activeCatalogStage, activeSection, selection.id]);

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

  const isSelectionLearningCase =
    selection.stage !== 'Notation' && selection.stage !== 'Timer';

  const notationDeck = useMemo(
    () => [
      ...NOTATION_MOVES.map((m) => ({
        kind: 'move' as const,
        id: m.id,
        label: m.move,
        item: m,
      })),
      ...FUNDAMENTAL_TRIGGERS.map((t) => ({
        kind: 'trigger' as const,
        id: t.id,
        label: t.name,
        item: t,
      })),
    ],
    []
  );

  const viewerNavigation = useMemo<CubeViewerNavigation | undefined>(() => {
    if (isTimerTab) return undefined;

    if (activeSection === 'Notation') {
      const total = notationDeck.length;
      if (total <= 1) return undefined;
      const rawIdx = notationDeck.findIndex((entry) => entry.id === selection.id);
      const currentIndex = rawIdx >= 0 ? rawIdx : 0;
      const prevEntry = notationDeck[(currentIndex - 1 + total) % total];
      const nextEntry = notationDeck[(currentIndex + 1) % total];

      const selectNotationEntry = (entry: (typeof notationDeck)[number]) => {
        triggerHaptic('selection');
        if (entry.kind === 'move') {
          setSelection(moveToSelection(entry.item, Date.now()));
        } else {
          setSelection(triggerToSelection(entry.item, Date.now()));
        }
      };

      return {
        currentIndex,
        total,
        prevLabel: prevEntry.label,
        nextLabel: nextEntry.label,
        onPrev: () => selectNotationEntry(prevEntry),
        onNext: () => selectNotationEntry(nextEntry),
      };
    }

    const deckCases =
      filteredCatalogCases.length > 0 &&
      filteredCatalogCases[0]?.stage === activeCatalogStage
        ? filteredCatalogCases
        : CFOP_CASES.filter((c) => c.stage === activeCatalogStage);
    const total = deckCases.length;
    if (total <= 1) return undefined;

    const rawIdx = deckCases.findIndex((c) => c.id === selection.id);
    const currentIndex = rawIdx >= 0 ? rawIdx : 0;
    const prevCase = deckCases[(currentIndex - 1 + total) % total];
    const nextCase = deckCases[(currentIndex + 1) % total];

    const selectDeckCase = (target: CfopCase) => {
      triggerHaptic('selection');
      if (target.stage !== 'Reducido') {
        lastCfopCaseIdsRef.current[target.stage] = target.id;
      }
      setSelection(caseToSelection(target));
    };

    return {
      currentIndex,
      total,
      prevLabel: prevCase.code,
      nextLabel: nextCase.code,
      onPrev: () => selectDeckCase(prevCase),
      onNext: () => selectDeckCase(nextCase),
    };
  }, [
    activeCatalogStage,
    activeSection,
    filteredCatalogCases,
    isTimerTab,
    notationDeck,
    selection.id,
  ]);

  const renderMainNavIcon = (
    id: MainSection,
    isActive: boolean,
    sizeClass = 'h-3.5 w-3.5'
  ) => {
    switch (id) {
      case 'Reducido':
        return (
          <Zap
            className={`${sizeClass} shrink-0 ${
              isActive ? 'text-[#09090B]' : 'text-[#10B981]'
            }`}
          />
        );
      case 'CFOP':
        return (
          <Layers
            className={`${sizeClass} shrink-0 ${
              isActive ? 'text-[#09090B]' : 'text-[#3B82F6]'
            }`}
          />
        );
      case 'Notation':
        return (
          <BookOpen
            className={`${sizeClass} shrink-0 ${
              isActive ? 'text-[#09090B]' : 'text-zinc-400'
            }`}
          />
        );
      case 'Timer':
        return (
          <Timer
            className={`${sizeClass} shrink-0 ${
              isActive ? 'text-[#09090B]' : 'text-sky-400'
            }`}
          />
        );
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col text-zinc-100">
      {/* Header: 56px + safe area superior */}
      <header className="pt-safe sticky top-0 z-30 border-b border-zinc-800/80 bg-[#09090B]/95 backdrop-blur-md">
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

          {/* Barra de navegación Desktop: 4 secciones principales con alto contraste */}
          <nav
            aria-label="Secciones principales"
            className="hidden items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 p-1 lg:flex"
          >
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleMainSectionChange(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex h-8 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3.5 text-xs transition-colors ${
                    isActive
                      ? 'bg-[#FAFAFA] font-semibold text-[#09090B]'
                      : 'font-medium text-zinc-300 hover:bg-zinc-800 hover:text-[#FAFAFA]'
                  }`}
                >
                  {renderMainNavIcon(item.id, isActive)}
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums leading-none ${
                        isActive
                          ? 'bg-zinc-900/10 font-semibold text-zinc-800'
                          : 'bg-zinc-800 text-zinc-400'
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
                    : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-[#FAFAFA]'
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
              className="font-mono text-xs tabular-nums text-zinc-400"
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
            ? 'flex w-full flex-1 flex-col pb-[calc(4.625rem+env(safe-area-inset-bottom))] lg:pb-0'
            : 'px-safe pb-dock mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-5 pt-4 sm:px-6 sm:pt-5 lg:grid-cols-12 lg:items-start lg:gap-6'
        }
      >
        {isTimerTab ? (
          <TimerModule />
        ) : (
          <div className="min-w-0 lg:col-span-7">
            {activeSection === 'Notation' ? (
              <NotationModule
                selectedId={selection.id}
                onSelectMove={handleSelectMove}
                onSelectTrigger={handleSelectTrigger}
              />
            ) : (
              <>
                {activeSection === 'CFOP' && (
                  <nav
                    aria-label="Etapas CFOP"
                    className="mb-3 grid grid-cols-4 gap-1 rounded-xl border border-zinc-800 bg-zinc-900 p-1"
                  >
                    {CFOP_SUB_STAGE_ITEMS.map((sub) => {
                      const isActive = activeCfopStage === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleCfopStageChange(sub.id)}
                          aria-current={isActive ? 'page' : undefined}
                          className={`inline-flex h-9 items-center justify-center gap-1 rounded-lg px-0.5 text-[11px] transition-colors sm:gap-1.5 sm:px-2.5 sm:text-xs ${
                            isActive
                              ? 'bg-[#FAFAFA] font-semibold text-[#09090B]'
                              : 'font-medium text-zinc-300 hover:bg-zinc-800 hover:text-[#FAFAFA]'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 shrink-0 rounded-full sm:h-2 sm:w-2 ${
                              isActive ? sub.activeDotClass : sub.dotClass
                            }`}
                          />
                          <span className="whitespace-nowrap">{sub.label}</span>
                          <span
                            className={`rounded px-0.5 py-0.5 font-mono text-[9px] tabular-nums leading-none sm:px-1.5 sm:text-[10px] ${
                              isActive
                                ? 'bg-zinc-900/10 font-semibold text-zinc-800'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {sub.count}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                )}

                <CfopCatalogModule
                  stage={activeCatalogStage}
                  selectedCaseId={selection.id}
                  onSelectCase={handleSelectCase}
                  isLeftyGlobal={isLeftyMode}
                  topFace={topFace}
                  getMastery={getMastery}
                  onCycleMastery={cycleMastery}
                  onStartPractice={handleStartPractice}
                  onFilteredCasesChange={setFilteredCatalogCases}
                />
              </>
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
              shortcutsEnabled={!isTimerTab && practiceSession === null}
              topFace={topFace}
              onToggleTopFace={toggleTopFace}
              navigation={viewerNavigation}
              mastery={
                isSelectionLearningCase ? getMastery(selection.id) : undefined
              }
              onCycleMastery={
                isSelectionLearningCase
                  ? () => cycleMastery(selection.id)
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

      {/* Sticky Bottom Dock móvil (Zona del Pulgar optimizada, sin controles duplicados) */}
      <div className="pb-safe-2 fixed inset-x-0 bottom-0 z-30 border-t border-zinc-800/80 bg-[#09090B]/95 px-2.5 pt-1.5 backdrop-blur-md lg:hidden">
        {!isTimerTab && (
          <div className="mb-1.5 flex h-12 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 p-1.5">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setIsSheetOpen(true);
              }}
              aria-label={`Abrir visor 3D de ${selection.code} ${selection.title}`}
              className="flex min-w-0 flex-1 items-center gap-2 text-left active:opacity-80"
            >
              <Cube2DPreview
                alg={dockDisplayAlg}
                stage={dockPreviewStage}
                topFace={topFace}
                className="h-9 w-9 p-0.5"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span
                    translate="no"
                    className="shrink-0 font-mono text-[11px] font-semibold tabular-nums text-[#FAFAFA]"
                  >
                    {selection.code}
                  </span>
                  <span className="truncate text-xs text-zinc-300">
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
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                setSelection((prev) => ({
                  ...prev,
                  autoPlayNonce: Date.now(),
                }));
                setIsSheetOpen(true);
              }}
              aria-label="Abrir y reproducir en 3D"
              className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg bg-[#FAFAFA] px-2.5 font-mono text-xs font-semibold text-[#09090B] active:bg-zinc-200"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>3D</span>
            </button>
          </div>
        )}

        {/* Barra de navegación móvil fija en 4 columnas sin scroll */}
        <nav
          aria-label="Secciones móviles"
          className="grid grid-cols-4 gap-1 rounded-xl border border-zinc-800 bg-zinc-900 p-1"
        >
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleMainSectionChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex h-12 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] leading-none transition-colors ${
                  isActive
                    ? 'bg-[#FAFAFA] font-semibold text-[#09090B]'
                    : 'font-medium text-zinc-300 active:bg-zinc-800'
                }`}
              >
                {renderMainNavIcon(item.id, isActive, 'h-4 w-4')}
                <span className="max-w-full truncate whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Entrenador Active Recall en 1 toque */}
      {practiceSession && (
        <PracticeTrainerModal
          cases={practiceSession.cases}
          stageLabel={practiceSession.label}
          isLeftyGlobal={isLeftyMode}
          topFace={topFace}
          getMastery={getMastery}
          onSetMastery={setMastery}
          onOpenIn3D={handleOpenPracticeCaseIn3D}
          onClose={() => setPracticeSession(null)}
        />
      )}
    </div>
  );
};

export default App;
