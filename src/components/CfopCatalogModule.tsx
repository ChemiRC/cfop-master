import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Copy,
  ExternalLink,
  Flame,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  CFOP_CASES,
  CFOP_REDUCIDO_CHAPTERS,
  CFOP_REDUCIDO_CORE_IDS,
  CFOP_REDUCIDO_VIDEO_URL,
  CFOP_SUBCATEGORIES,
  CROSS_TIPS,
  ESSENTIAL_F2L_IDS,
  TWO_LOOK_OLL_IDS,
  TWO_LOOK_PLL_IDS,
} from '../data/cfopData';
import type {
  CaseMastery,
  CfopCase,
  LearningStage,
  TopFaceColor,
  VisualStage,
} from '../types/cfop';
import { countAlgMoves, mirrorAlgLR } from '../utils/algHelpers';
import { triggerHaptic } from '../utils/haptics';
import { AlgNotationBadges } from './AlgNotationBadges';
import { Cube2DPreview } from './Cube2DPreview';

interface CfopCatalogModuleProps {
  stage: LearningStage;
  selectedCaseId: string;
  onSelectCase: (cfopCase: CfopCase) => void;
  isLeftyGlobal?: boolean;
  /** Orientación superior del cubo ('yellow' por defecto o 'white') */
  topFace?: TopFaceColor;
  /** Estado universal de dominio (Nuevo / Practicando / Dominado) */
  getMastery: (id: string) => CaseMastery;
  onCycleMastery: (id: string) => void;
  /** Abre el entrenador Active Recall sobre los casos filtrados actuales */
  onStartPractice: (cases: CfopCase[], label: string) => void;
  /** Reporta los casos filtrados activos para habilitar Anterior/Siguiente en CubeViewer */
  onFilteredCasesChange?: (cases: CfopCase[]) => void;
}

type CatalogScope = 'full' | '2look';
type MasteryFilter = 'all' | CaseMastery;
type CatalogViewMode = 'visual' | 'list';

const CATALOG_VIEW_STORAGE_KEY = 'cfop_catalog_view';

const STAGE_META: Record<
  LearningStage,
  {
    name: string;
    description: string;
    dotColor: string;
    codeColor: string;
    twoLookLabel: string;
  }
> = {
  Reducido: {
    name: 'Guía JS cuber',
    description:
      '7 OLL + 2 consejos de cruz + 8 PLL con notación WCA y marcas de tiempo.',
    dotColor: 'bg-[#10B981]',
    codeColor: 'text-[#10B981]',
    twoLookLabel: 'Base',
  },
  Cross: {
    name: 'Cruz Eficiente',
    description: 'Las 4 aristas de la base en 8 movimientos o menos.',
    dotColor: 'bg-[#F4F4F5]',
    codeColor: 'text-[#F4F4F5]',
    twoLookLabel: 'Básicos',
  },
  F2L: {
    name: 'First Two Layers',
    description: 'Empareja esquina y arista e insértalas juntas en cada ranura.',
    dotColor: 'bg-[#3B82F6]',
    codeColor: 'text-[#3B82F6]',
    twoLookLabel: 'Esenciales',
  },
  OLL: {
    name: 'Orientation of Last Layer',
    description: 'Orienta toda la cara superior amarilla en 1 o 2 pasos.',
    dotColor: 'bg-[#EAB308]',
    codeColor: 'text-[#EAB308]',
    twoLookLabel: '2-Look OLL',
  },
  PLL: {
    name: 'Permutation of Last Layer',
    description: 'Permuta las piezas de la capa superior para terminar el cubo.',
    dotColor: 'bg-[#EF4444]',
    codeColor: 'text-[#EF4444]',
    twoLookLabel: '2-Look PLL',
  },
};

function isTwoLookCase(item: CfopCase): boolean {
  if (item.twoLook) return true;
  if (item.stage === 'Reducido') return CFOP_REDUCIDO_CORE_IDS.has(item.id);
  if (item.stage === 'OLL') return TWO_LOOK_OLL_IDS.has(item.id);
  if (item.stage === 'PLL') return TWO_LOOK_PLL_IDS.has(item.id);
  if (item.stage === 'F2L') return ESSENTIAL_F2L_IDS.has(item.id);
  return false;
}

function getPreviewStage(item: CfopCase): VisualStage {
  if (item.visualStage) return item.visualStage;
  if (item.stage === 'Reducido') return 'OLL';
  return item.stage;
}

function getSectionBadgeClass(badge?: string): string {
  if (!badge) return 'border-zinc-700 bg-zinc-900 text-zinc-300';
  if (badge === 'OLL' || badge === 'Consejos Cruz') {
    return 'border-[#EAB308]/40 bg-[#EAB308]/10 text-[#EAB308]';
  }
  if (badge.startsWith('PLL')) {
    return 'border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]';
  }
  return 'border-zinc-700 bg-zinc-900 text-zinc-300';
}

function loadInitialViewMode(): CatalogViewMode {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(CATALOG_VIEW_STORAGE_KEY);
      if (saved === 'visual' || saved === 'list') return saved;
    }
  } catch {
    // Ignore storage errors
  }
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 639px)').matches
  ) {
    return 'visual';
  }
  return 'list';
}

export const CfopCatalogModule: React.FC<CfopCatalogModuleProps> = ({
  stage,
  selectedCaseId,
  onSelectCase,
  isLeftyGlobal = false,
  topFace = 'yellow',
  getMastery,
  onCycleMastery,
  onStartPractice,
  onFilteredCasesChange,
}) => {
  const [scope, setScope] = useState<CatalogScope>('full');
  const [masteryFilter, setMasteryFilter] = useState<MasteryFilter>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todos');
  const [selectedTag, setSelectedTag] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCrossTips, setShowCrossTips] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [copiedCaseId, setCopiedCaseId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<CatalogViewMode>(loadInitialViewMode);

  useEffect(() => {
    setScope('full');
    setMasteryFilter('all');
    setSelectedSubcategory('Todos');
    setSelectedTag('Todos');
    setSearchQuery('');
    setShowFilters(false);
  }, [stage]);

  const handleToggleViewMode = useCallback(() => {
    triggerHaptic('selection');
    setViewMode((prev) => {
      const next: CatalogViewMode = prev === 'visual' ? 'list' : 'visual';
      try {
        window.localStorage.setItem(CATALOG_VIEW_STORAGE_KEY, next);
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const handleQuickCopy = useCallback(
    async (e: React.MouseEvent, caseId: string, algText: string) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(algText);
        triggerHaptic('success');
        setCopiedCaseId(caseId);
        window.setTimeout(() => {
          setCopiedCaseId((prev) => (prev === caseId ? null : prev));
        }, 1400);
      } catch {
        // Portapapeles no disponible
      }
    },
    []
  );

  const isReducido = stage === 'Reducido';
  const subcategories = CFOP_SUBCATEGORIES[stage] ?? ['Todos'];
  const meta = STAGE_META[stage];

  const stageCases = useMemo(
    () => CFOP_CASES.filter((item) => item.stage === stage),
    [stage]
  );

  const twoLookCount = useMemo(
    () => stageCases.filter(isTwoLookCase).length,
    [stageCases]
  );

  const masteryCounts = useMemo(() => {
    let mastered = 0;
    let practicing = 0;
    let unlearned = 0;
    for (const c of stageCases) {
      const status = getMastery(c.id);
      if (status === 'mastered') mastered += 1;
      else if (status === 'practicing') practicing += 1;
      else unlearned += 1;
    }
    return { mastered, practicing, unlearned };
  }, [getMastery, stageCases]);

  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: stageCases.length };
    for (const c of stageCases) {
      counts[c.subcategory] = (counts[c.subcategory] ?? 0) + 1;
    }
    return counts;
  }, [stageCases]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    stageCases.forEach((c) => {
      c.tags?.forEach((t) => {
        if (t !== '2-Look OLL' && t !== '2-Look PLL') {
          set.add(t);
        }
      });
    });
    return Array.from(set);
  }, [stageCases]);

  const filteredCases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return stageCases.filter((item) => {
      if (scope === '2look' && !isTwoLookCase(item)) {
        return false;
      }

      if (masteryFilter !== 'all' && getMastery(item.id) !== masteryFilter) {
        return false;
      }

      if (
        selectedSubcategory !== 'Todos' &&
        item.subcategory !== selectedSubcategory
      ) {
        return false;
      }

      if (selectedTag !== 'Todos') {
        if (!item.tags || !item.tags.includes(selectedTag)) {
          return false;
        }
      }

      if (query) {
        const unpaddedCode = item.code.replace(/\b0+(\d)/g, '$1');
        const haystack = [
          item.code,
          item.code.replace(/\s+/g, ''),
          unpaddedCode,
          unpaddedCode.replace(/\s+/g, ''),
          item.name,
          item.category,
          item.subcategory,
          item.sectionBadge ?? '',
          item.guideNote ?? '',
          item.videoTimestamp ?? '',
          item.alg,
          item.altAlg ?? '',
          ...item.altAlgs,
          ...(item.altAlgLabels ?? []),
          item.recognition,
          ...item.triggers,
          ...item.tags,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [
    stageCases,
    scope,
    masteryFilter,
    getMastery,
    selectedSubcategory,
    selectedTag,
    searchQuery,
  ]);

  useEffect(() => {
    onFilteredCasesChange?.(filteredCases);
  }, [filteredCases, onFilteredCasesChange]);

  const activeFilterCount =
    (masteryFilter !== 'all' ? 1 : 0) + (selectedTag !== 'Todos' ? 1 : 0);

  const totalCount = Math.max(1, stageCases.length);
  const masteredPct = (masteryCounts.mastered / totalCount) * 100;
  const practicingPct = (masteryCounts.practicing / totalCount) * 100;

  const practiceLabel = useMemo(() => {
    const base = isReducido ? 'CFOP Reducido' : stage;
    const parts: string[] = [base];
    if (scope === '2look') parts.push(meta.twoLookLabel);
    if (selectedSubcategory !== 'Todos') parts.push(selectedSubcategory);
    if (masteryFilter === 'practicing') parts.push('Practicando');
    else if (masteryFilter === 'unlearned') parts.push('Por aprender');
    else if (masteryFilter === 'mastered') parts.push('Dominados');
    return parts.join(' · ');
  }, [
    isReducido,
    masteryFilter,
    meta.twoLookLabel,
    scope,
    selectedSubcategory,
    stage,
  ]);

  return (
    <div className="space-y-2.5 sm:space-y-3.5">
      {/* Encabezado compacto de etapa + barra universal de dominio (2 segmentos) */}
      <header className="space-y-1.5 px-0.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dotColor}`} />
            <h1 className="truncate text-base font-semibold tracking-tight text-[#FAFAFA] sm:text-lg">
              <span translate="no">
                {isReducido ? 'CFOP Reducido' : stage}
              </span>
              <span className="ml-2 hidden font-normal text-zinc-500 sm:inline">
                {meta.name}
              </span>
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] tabular-nums">
            {masteryCounts.practicing > 0 && (
              <span className="text-amber-400" title="En práctica">
                {masteryCounts.practicing} práct.
              </span>
            )}
            <span className="text-[#10B981]" title="Casos dominados">
              {masteryCounts.mastered}/{stageCases.length}
            </span>
          </div>
        </div>

        {/* Barra de progreso dual: Dominados (esmeralda) + Practicando (ámbar) */}
        <div
          role="progressbar"
          aria-label={`Progreso de ${stage}: ${masteryCounts.mastered} dominados, ${masteryCounts.practicing} practicando de ${stageCases.length}`}
          aria-valuenow={masteryCounts.mastered}
          aria-valuemin={0}
          aria-valuemax={stageCases.length}
          className="flex h-1 w-full overflow-hidden rounded-full bg-zinc-900"
        >
          <div
            className="h-full bg-[#10B981] transition-all duration-300"
            style={{ width: `${masteredPct}%` }}
          />
          <div
            className="h-full bg-amber-400 transition-all duration-300"
            style={{ width: `${practicingPct}%` }}
          />
        </div>
      </header>

      {/* Panel compacto de capítulos de video para CFOP Reducido */}
      {isReducido && (
        <section className="space-y-2 rounded-lg border border-[#222226] bg-[#111113] p-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs text-zinc-400">{meta.description}</p>
            <a
              href={CFOP_REDUCIDO_VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 rounded border border-[#222226] bg-[#09090B] px-2 py-1 font-mono text-[10px] text-zinc-300 transition-colors hover:border-zinc-700 hover:text-[#FAFAFA]"
            >
              <span>Video JS cuber</span>
              <ExternalLink className="h-3 w-3 text-zinc-500" />
            </a>
          </div>

          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
            {CFOP_REDUCIDO_CHAPTERS.map((chap) => (
              <a
                key={chap.timestamp}
                href={chap.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded border border-[#222226] bg-[#09090B] px-2 font-mono text-[11px] text-zinc-400 transition-colors hover:border-[#10B981]/50 hover:text-zinc-200"
              >
                <span className="text-[#10B981]">▶ {chap.timestamp}</span>
                <span>{chap.label}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Consejos de Cross: colapsados por defecto */}
      {stage === 'Cross' && (
        <section className="rounded-lg border border-[#222226] bg-[#111113]">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setShowCrossTips((prev) => !prev);
            }}
            aria-expanded={showCrossTips}
            className="flex h-10 w-full items-center justify-between px-3 text-left"
          >
            <span className="text-xs font-medium text-zinc-200 sm:text-sm">
              Consejos clave de inspección y cruz
            </span>
            <ChevronDown
              className={`h-4 w-4 text-zinc-500 transition-transform ${
                showCrossTips ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showCrossTips && (
            <ul className="grid gap-px border-t border-[#222226] bg-[#222226] sm:grid-cols-2">
              {CROSS_TIPS.map((tip) => (
                <li key={tip.title} className="bg-[#111113] px-3 py-2.5">
                  <p className="text-xs font-semibold text-[#FAFAFA]">
                    {tip.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-zinc-400">
                    {tip.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Barra Sticky ultra-compacta de 2 filas (~82px en móvil) */}
      <div className="top-header sticky z-20 -mx-4 space-y-1.5 border-b border-[#222226] bg-[#09090B]/95 px-4 py-2 backdrop-blur-md sm:mx-0 sm:rounded-lg sm:border sm:bg-[#111113]/95 sm:p-2.5">
        {/* Fila 1: Buscador + Filtros (con badge) + Vista Visual/Lista + Practicar */}
        <div className="flex items-center gap-1.5">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              inputMode="search"
              enterKeyHint="search"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Buscar ${
                isReducido
                  ? 'Reducido...'
                  : stage === 'OLL'
                  ? 'OLL 21, Sune...'
                  : stage === 'PLL'
                  ? 'PLL T, Ga...'
                  : `${stage}...`
              }`}
              aria-label={`Buscar en ${stage}`}
              className="h-9 w-full rounded-md border border-[#222226] bg-[#09090B] pr-8 pl-8 text-base text-zinc-100 placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none sm:text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSearchQuery('');
                }}
                aria-label="Limpiar búsqueda"
                className="absolute top-1/2 right-0.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-zinc-500 hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setShowFilters((prev) => !prev);
            }}
            aria-expanded={showFilters}
            aria-label={
              activeFilterCount > 0
                ? `Filtros (${activeFilterCount} activos)`
                : 'Mostrar filtros de estado y rasgo'
            }
            title="Filtrar por estado de dominio y rasgo visual"
            className={`relative inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border px-2.5 font-mono text-xs font-medium transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'border-[#FAFAFA] bg-[#FAFAFA] font-semibold text-[#09090B]'
                : 'border-[#222226] bg-[#09090B] text-zinc-300 hover:border-zinc-700 hover:text-[#FAFAFA]'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Filtros</span>
            {activeFilterCount > 0 && (
              <span
                className={`inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 font-mono text-[10px] font-bold leading-none ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-[#09090B] text-[#FAFAFA]'
                    : 'bg-[#3B82F6] text-white'
                }`}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleToggleViewMode}
            aria-label={
              viewMode === 'visual'
                ? 'Cambiar a vista de lista detallada'
                : 'Cambiar a cuadrícula visual 2D'
            }
            title={
              viewMode === 'visual'
                ? 'Vista actual: Cuadrícula Visual 2D · Toca para Lista'
                : 'Vista actual: Lista · Toca para Cuadrícula Visual 2D'
            }
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center gap-1.5 rounded-md border border-[#222226] bg-[#09090B] text-zinc-300 transition-colors hover:border-zinc-700 hover:text-[#FAFAFA] sm:w-auto sm:px-2.5"
          >
            {viewMode === 'visual' ? (
              <>
                <List className="h-4 w-4 shrink-0" />
                <span className="hidden font-mono text-xs sm:inline">Lista</span>
              </>
            ) : (
              <>
                <LayoutGrid className="h-4 w-4 shrink-0" />
                <span className="hidden font-mono text-xs sm:inline">Visual</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={filteredCases.length === 0}
            onClick={() => {
              triggerHaptic('medium');
              onStartPractice(filteredCases, practiceLabel);
            }}
            title={`Entrenar ${filteredCases.length} casos filtrados (Active Recall)`}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-[#10B981]/50 bg-[#10B981]/15 px-2.5 font-mono text-xs font-semibold text-[#10B981] transition-colors hover:bg-[#10B981]/25 active:bg-[#10B981]/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Brain className="h-3.5 w-3.5 shrink-0" />
            <span>Practicar</span>
          </button>
        </div>

        {/* Fila 2: Riel único horizontal con 2-Look rápido + Subcategorías oficiales */}
        <div className="no-scrollbar -mx-4 flex items-center gap-1 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {twoLookCount > 0 && !isReducido && (
            <>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setScope((prev) => (prev === '2look' ? 'full' : '2look'));
                }}
                aria-pressed={scope === '2look'}
                className={`inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-2 font-mono text-[11px] font-medium transition-colors ${
                  scope === '2look'
                    ? 'border-[#FAFAFA] bg-[#FAFAFA] font-semibold text-[#09090B]'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-500'
                }`}
              >
                <span>{meta.twoLookLabel}</span>
                <span
                  className={`text-[10px] tabular-nums ${
                    scope === '2look' ? 'text-zinc-800' : 'text-zinc-400'
                  }`}
                >
                  {twoLookCount}
                </span>
              </button>
              <span
                aria-hidden="true"
                className="mx-0.5 h-4 w-px shrink-0 bg-zinc-800"
              />
            </>
          )}

          {subcategories.map((sub) => {
            const isActive = selectedSubcategory === sub;
            const count = subcategoryCounts[sub] ?? 0;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedSubcategory(sub);
                }}
                className={`inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'border-[#FAFAFA] bg-[#FAFAFA] text-[#09090B]'
                    : 'border-[#222226] bg-[#09090B] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span>{sub}</span>
                <span
                  className={`font-mono text-[10px] tabular-nums ${
                    isActive ? 'text-zinc-800' : 'text-zinc-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel colapsable: Estado de dominio + Rasgos visuales */}
        {showFilters && (
          <div className="space-y-1.5 border-t border-[#222226]/70 pt-1.5">
            <div className="no-scrollbar -mx-4 flex items-center gap-1 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                ESTADO:
              </span>
              {(
                [
                  {
                    id: 'all',
                    label: 'Todos',
                    count: stageCases.length,
                    activeClass: 'bg-zinc-200 text-[#09090B] font-semibold',
                  },
                  {
                    id: 'unlearned',
                    label: 'Por aprender',
                    count: masteryCounts.unlearned,
                    activeClass: 'bg-zinc-700 text-[#FAFAFA] font-semibold',
                  },
                  {
                    id: 'practicing',
                    label: 'Practicando',
                    count: masteryCounts.practicing,
                    activeClass:
                      'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/50 font-semibold',
                  },
                  {
                    id: 'mastered',
                    label: 'Dominados',
                    count: masteryCounts.mastered,
                    activeClass:
                      'bg-[#10B981]/20 text-[#10B981] ring-1 ring-[#10B981]/50 font-semibold',
                  },
                ] as const
              ).map((opt) => {
                const isActive = masteryFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setMasteryFilter(opt.id);
                    }}
                    className={`inline-flex h-6 shrink-0 items-center gap-1 rounded px-2 font-mono text-[11px] tabular-nums transition-colors ${
                      isActive
                        ? opt.activeClass
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="opacity-70">{opt.count}</span>
                  </button>
                );
              })}
            </div>

            {availableTags.length > 0 && !isReducido && (
              <div className="no-scrollbar -mx-4 flex items-center gap-1 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  RASGO:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setSelectedTag('Todos');
                  }}
                  className={`h-6 shrink-0 rounded px-2 font-mono text-[11px] transition-colors ${
                    selectedTag === 'Todos'
                      ? 'bg-zinc-800 font-semibold text-[#FAFAFA]'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Todos
                </button>
                {availableTags.map((tag) => {
                  const isActive = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        triggerHaptic('selection');
                        setSelectedTag(tag);
                      }}
                      className={`h-6 shrink-0 rounded px-2 font-mono text-[11px] transition-colors ${
                        isActive
                          ? 'bg-zinc-800 font-semibold text-[#FAFAFA]'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Catálogo: Vacío / Cuadrícula Visual 2D / Lista Detallada */}
      {filteredCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[#222226] bg-[#111113] px-6 py-10 text-center">
          <p className="text-sm text-zinc-300">
            Sin resultados para el filtro actual
          </p>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setScope('full');
              setMasteryFilter('all');
              setSelectedSubcategory('Todos');
              setSelectedTag('Todos');
              setSearchQuery('');
            }}
            className="mt-3 h-9 rounded-md bg-[#FAFAFA] px-4 text-xs font-semibold text-[#09090B] hover:bg-zinc-200"
          >
            Ver todos los casos ({stageCases.length})
          </button>
        </div>
      ) : viewMode === 'visual' ? (
        /* MODO CUADRÍCULA VISUAL 2D: 9–12 patrones escaneables en 1 pantalla móvil */
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCases.map((item) => {
            const isSelected = item.id === selectedCaseId;
            const displayAlg = isLeftyGlobal
              ? mirrorAlgLR(item.alg)
              : item.alg;
            const moveCount = countAlgMoves(displayAlg);
            const twoLook = isTwoLookCase(item);
            const mastery = getMastery(item.id);
            const previewStage = getPreviewStage(item);

            const tileBorderClass = isSelected
              ? 'border-[#FAFAFA] bg-[#16161A]'
              : mastery === 'mastered'
              ? 'border-[#10B981]/45 bg-[#111113] hover:border-[#10B981]/75'
              : mastery === 'practicing'
              ? 'border-amber-500/45 bg-[#111113] hover:border-amber-500/75'
              : 'border-[#222226] bg-[#111113] hover:border-zinc-700 hover:bg-[#16161A]';

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    onSelectCase(item);
                  }}
                  aria-pressed={isSelected}
                  className={`flex w-full flex-col gap-1.5 rounded-lg border p-1.5 text-left transition-colors active:bg-[#1C1C21] ${tileBorderClass}`}
                >
                  {/* Meta superior fuera de los stickers */}
                  <div className="flex w-full items-center justify-between gap-1 px-0.5">
                    <span
                      translate="no"
                      className={`truncate font-mono text-[10px] font-semibold tabular-nums leading-none ${meta.codeColor}`}
                    >
                      {item.code}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      {twoLook && !isReducido && (
                        <span className="rounded bg-zinc-800 px-1 font-mono text-[8px] font-semibold leading-[14px] text-zinc-300">
                          2L
                        </span>
                      )}
                      {mastery !== 'unlearned' && (
                        <span
                          aria-label={
                            mastery === 'mastered' ? 'Dominado' : 'Practicando'
                          }
                          className={`h-2 w-2 rounded-full ${
                            mastery === 'mastered'
                              ? 'bg-[#10B981]'
                              : 'bg-amber-400'
                          }`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Diagrama 2D 100% visible */}
                  <Cube2DPreview
                    alg={displayAlg}
                    stage={previewStage}
                    topFace={topFace}
                    fluid
                  />

                  {/* Nombre corto + HTM */}
                  <div className="flex w-full items-center justify-between gap-1 px-0.5">
                    <span className="truncate text-[10px] leading-tight text-zinc-400">
                      {item.name}
                    </span>
                    <span
                      translate="no"
                      className="shrink-0 font-mono text-[9px] tabular-nums text-zinc-600"
                    >
                      {moveCount}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        /* MODO LISTA DETALLADA: algoritmo chunked + acciones 1-tap (Copiar y Dominio) */
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {filteredCases.map((item) => {
            const isSelected = item.id === selectedCaseId;
            const displayAlg = isLeftyGlobal
              ? mirrorAlgLR(item.alg)
              : item.alg;
            const moveCount = countAlgMoves(displayAlg);
            const twoLook = isTwoLookCase(item);
            const altCount = item.altAlgs.length;
            const mastery = getMastery(item.id);
            const previewStage = getPreviewStage(item);
            const isCopied = copiedCaseId === item.id;

            const cardBorderClass = isSelected
              ? 'border-[#FAFAFA] bg-[#16161A]'
              : mastery === 'mastered'
              ? 'border-[#10B981]/35 bg-[#111113] hover:border-[#10B981]/60 hover:bg-[#16161A]'
              : mastery === 'practicing'
              ? 'border-amber-500/35 bg-[#111113] hover:border-amber-500/60 hover:bg-[#16161A]'
              : 'border-[#222226] bg-[#111113] hover:border-zinc-700 hover:bg-[#16161A]';

            const masteryBtnClass =
              mastery === 'mastered'
                ? 'border-[#10B981]/50 bg-[#10B981]/15 text-[#10B981]'
                : mastery === 'practicing'
                ? 'border-amber-500/50 bg-amber-500/15 text-amber-400'
                : 'border-[#222226] bg-[#09090B] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300';

            const masteryLabel =
              mastery === 'mastered'
                ? 'Dominado'
                : mastery === 'practicing'
                ? 'Practicando'
                : 'Por aprender';

            return (
              <li key={item.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    triggerHaptic('light');
                    onSelectCase(item);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      triggerHaptic('light');
                      onSelectCase(item);
                    }
                  }}
                  aria-pressed={isSelected}
                  className={`flex w-full cursor-pointer items-start gap-3 rounded-lg border p-2.5 text-left transition-colors active:bg-[#1C1C21] sm:p-3 ${cardBorderClass}`}
                >
                  <Cube2DPreview
                    alg={displayAlg}
                    stage={previewStage}
                    topFace={topFace}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                        <span
                          translate="no"
                          className={`font-mono text-[11px] font-semibold tabular-nums ${meta.codeColor}`}
                        >
                          {item.code}
                        </span>

                        {item.sectionBadge ? (
                          <span
                            className={`rounded border px-1.5 font-mono text-[9px] font-medium leading-4 ${getSectionBadgeClass(
                              item.sectionBadge
                            )}`}
                          >
                            {item.sectionBadge}
                          </span>
                        ) : (
                          twoLook && (
                            <span className="rounded border border-zinc-700 bg-zinc-900 px-1 font-mono text-[9px] font-medium leading-4 text-zinc-300">
                              2-LOOK
                            </span>
                          )
                        )}

                        {altCount > 0 && (
                          <span className="rounded border border-zinc-800 bg-[#09090B] px-1 font-mono text-[9px] leading-4 text-zinc-400">
                            +{altCount} ALT
                          </span>
                        )}

                        {isLeftyGlobal && (
                          <span className="rounded border border-[#3B82F6]/40 px-1 font-mono text-[9px] font-medium leading-4 text-[#3B82F6]">
                            ZURDO
                          </span>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        {item.videoTimestamp && item.videoUrl && (
                          <a
                            href={item.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={`Ver en YouTube (${item.videoTimestamp})`}
                            className="inline-flex h-7 items-center gap-0.5 rounded border border-[#222226] bg-[#09090B] px-1.5 font-mono text-[10px] tabular-nums text-zinc-400 transition-colors hover:border-[#10B981]/50 hover:text-[#10B981]"
                          >
                            <span>▶ {item.videoTimestamp}</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleQuickCopy(e, item.id, displayAlg)}
                          aria-label={`Copiar algoritmo de ${item.name}`}
                          title="Copiar algoritmo"
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#222226] bg-[#09090B] text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-200"
                        >
                          {isCopied ? (
                            <Check className="h-3.5 w-3.5 text-[#10B981]" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCycleMastery(item.id);
                          }}
                          aria-label={`${item.name}: ${masteryLabel}. Toca para cambiar estado`}
                          title={`Estado: ${masteryLabel} · Toca para cambiar`}
                          className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${masteryBtnClass}`}
                        >
                          {mastery === 'mastered' ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : mastery === 'practicing' ? (
                            <Flame className="h-3.5 w-3.5" />
                          ) : (
                            <Circle className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <h3 className="mt-0.5 truncate text-sm font-semibold text-[#FAFAFA]">
                      {item.name}
                    </h3>

                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-zinc-500">
                      <span className="truncate">
                        {item.guideNote ?? item.subcategory}
                      </span>
                      <span
                        translate="no"
                        className="shrink-0 font-mono text-[10px] tabular-nums text-zinc-600"
                      >
                        · {moveCount} HTM
                      </span>
                    </p>

                    <div className="mt-1.5">
                      <AlgNotationBadges alg={displayAlg} compact />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
