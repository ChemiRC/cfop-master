import React, { useCallback, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
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
    autoPlayNonce,
  };
}

function moveToSelection(m: NotationMove, nonce: number): ActiveSelection {
  return {
    id: m.id,
    code: `WCA · ${m.move}`,
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

const NAV_ITEMS: Array<{
  id: CfopStage;
  label: string;
  dotColor?: string;
}> = [
  { id: 'Notation', label: 'Notación' },
  { id: 'Cross', label: 'Cross', dotColor: 'bg-[#F4F4F5]' },
  { id: 'F2L', label: 'F2L', dotColor: 'bg-[#3B82F6]' },
  { id: 'OLL', label: 'OLL', dotColor: 'bg-[#EAB308]' },
  { id: 'PLL', label: 'PLL', dotColor: 'bg-[#EF4444]' },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CfopStage>('F2L');
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState<boolean>(false);

  const [selection, setSelection] = useState<ActiveSelection>(() => {
    const initialCase =
      CFOP_CASES.find((c) => c.stage === 'F2L') ?? CFOP_CASES[0];
    return caseToSelection(initialCase);
  });

  const handleTabChange = useCallback((stage: CfopStage) => {
    setActiveTab(stage);
    if (stage === 'Notation') {
      const firstMove = NOTATION_MOVES[0];
      setSelection(moveToSelection(firstMove, 0));
    } else {
      const firstStageCase = CFOP_CASES.find((c) => c.stage === stage);
      if (firstStageCase) {
        setSelection(caseToSelection(firstStageCase));
      }
    }
  }, []);

  const handleSelectMove = useCallback((move: NotationMove) => {
    setSelection(moveToSelection(move, Date.now()));
    if (window.innerWidth < 1024) {
      setIsMobileSheetOpen(true);
    }
  }, []);

  const handleSelectTrigger = useCallback((trig: TriggerDemo) => {
    setSelection({
      id: trig.id,
      code: 'TRIGGER',
      title: trig.name,
      subtitle: 'Sub-secuencia 4 HTM',
      alg: trig.alg,
      stage: 'Notation',
      stickering: 'full',
      setupAnchor: 'end',
      recognition: trig.description,
      explanation:
        'Inspecciona el ciclo a 0.5x para verificar el retorno ergonómico de ambos índices y aumenta gradualmente a 1x–2x.',
      autoPlayNonce: Date.now(),
    });
    if (window.innerWidth < 1024) {
      setIsMobileSheetOpen(true);
    }
  }, []);

  const handleSelectCase = useCallback((cfopCase: CfopCase) => {
    setSelection(caseToSelection(cfopCase));
    if (window.innerWidth < 1024) {
      setIsMobileSheetOpen(true);
    }
  }, []);

  // Lectura numérica compacta de la posición activa dentro de la etapa actual
  const headerMetric = useMemo(() => {
    if (activeTab === 'Notation') {
      const allNotationIds = [
        ...NOTATION_MOVES.map((m) => m.id),
        ...FUNDAMENTAL_TRIGGERS.map((t) => t.id),
      ];
      const idx = Math.max(0, allNotationIds.indexOf(selection.id)) + 1;
      return `${String(idx).padStart(2, '0')}/${allNotationIds.length} WCA`;
    }

    const stageCases = CFOP_CASES.filter((c) => c.stage === activeTab);
    const idx = Math.max(
      0,
      stageCases.findIndex((c) => c.id === selection.id)
    ) + 1;
    return `${String(idx).padStart(2, '0')}/${stageCases.length} ${activeTab}`;
  }, [activeTab, selection.id]);

  return (
    <div className="relative flex min-h-screen flex-col pb-24 text-zinc-100 lg:pb-0">
      {/* Barra de Herramientas Compacta de 56px (h-14) */}
      <header className="sticky top-0 z-30 h-14 border-b border-[#222226] bg-[#09090B]/95 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo Tipográfico Sobrio */}
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid h-4 w-4 grid-cols-2 gap-[1.5px] rounded-[3px] border border-zinc-700 bg-[#09090B] p-[2px]"
            >
              <span className="bg-[#FAFAFA]" />
              <span className="bg-[#3B82F6]" />
              <span className="bg-[#EAB308]" />
              <span className="bg-[#EF4444]" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-[#FAFAFA]">
              CFOP Master
            </span>
            <span className="hidden font-mono text-xs text-zinc-600 sm:inline">
              / 3×3
            </span>
          </div>

          {/* Selector de Etapas tipo Segmented Control (Desktop) */}
          <nav
            aria-label="Selector de etapas CFOP"
            className="hidden items-center rounded-lg border border-[#222226] bg-[#111113] p-1 lg:flex"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabChange(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#FAFAFA] font-semibold text-[#09090B]'
                      : 'text-zinc-400 hover:bg-[#16161A] hover:text-zinc-200'
                  }`}
                >
                  {item.dotColor && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${item.dotColor}`}
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Indicador Numérico Técnico */}
          <div
            translate="no"
            className="rounded-md border border-[#222226] bg-[#111113] px-2.5 py-1 font-mono text-xs tabular-nums text-zinc-400"
          >
            {headerMetric}
          </div>
        </div>
      </header>

      {/* Workspace Principal */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 pt-5 pb-10 sm:px-6 lg:flex-row lg:items-start">
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
            />
          )}
        </div>

        {/* Backdrop Móvil */}
        {isMobileSheetOpen && (
          <div
            onClick={() => setIsMobileSheetOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/80 transition-opacity lg:hidden"
          />
        )}

        {/* Única instancia WebGL 3D (Sidebar fijo en Desktop / Panel deslizable en Móvil) */}
        <aside
          aria-label="Viewport de estudio 3D"
          className={`lg:static lg:z-auto lg:block lg:w-[390px] lg:shrink-0 xl:w-[410px] max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-50 max-lg:max-h-[88dvh] max-lg:overflow-y-auto max-lg:rounded-t-lg max-lg:border-t max-lg:border-[#222226] max-lg:bg-[#09090B] max-lg:p-3 max-lg:transition-transform max-lg:duration-200 ${
            isMobileSheetOpen
              ? 'max-lg:translate-y-0'
              : 'max-lg:pointer-events-none max-lg:translate-y-[110%]'
          }`}
        >
          <div className="mb-2 flex items-center justify-between px-0.5 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileSheetOpen(false)}
              className="inline-flex items-center gap-1 font-mono text-xs text-zinc-400 hover:text-[#FAFAFA]"
            >
              <ChevronDown className="h-3.5 w-3.5" />
              <span>OCULTAR VIEWPORT</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMobileSheetOpen(false)}
              aria-label="Cerrar viewport"
              className="rounded-md border border-[#222226] bg-[#111113] p-1 text-zinc-400 hover:text-[#FAFAFA]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="lg:sticky lg:top-[72px]">
            <CubeViewer selection={selection} />
          </div>
        </aside>
      </main>

      {/* Pie de Página Minimalista */}
      <footer className="border-t border-[#222226] bg-[#09090B] py-4 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6">
          <span className="font-mono text-[11px]">
            CFOP MASTER · CROSS / F2L / OLL / PLL
          </span>
          <span className="font-mono text-[11px]">
            ESTÁNDAR WCA · MOTOR 3D CUBING.JS
          </span>
        </div>
      </footer>

      {/* Barra Flotante del Viewport en Móvil */}
      {!isMobileSheetOpen && (
        <div className="fixed inset-x-3 bottom-[3.6rem] z-30 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileSheetOpen(true)}
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#222226] bg-[#111113] px-3 py-2 text-left"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  translate="no"
                  className="font-mono text-[11px] font-semibold tabular-nums text-[#FAFAFA]"
                >
                  {selection.code}
                </span>
                <span className="truncate text-xs font-medium text-zinc-300">
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

            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#FAFAFA] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#09090B]">
              <span>3D</span>
              <ChevronUp className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>
      )}

      {/* Segmented Control Inferior en Móvil */}
      <nav
        aria-label="Selector móvil de etapas"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[#222226] bg-[#09090B]/95 px-2 py-1.5 backdrop-blur-md lg:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-lg border border-[#222226] bg-[#111113] p-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  handleTabChange(item.id);
                  setIsMobileSheetOpen(false);
                }}
                className={`flex items-center justify-center gap-1 rounded-md py-1.5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#FAFAFA] font-semibold text-[#09090B]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.dotColor && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${item.dotColor}`}
                  />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default App;
