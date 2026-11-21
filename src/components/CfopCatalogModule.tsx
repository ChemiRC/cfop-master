import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  ExternalLink,
  Search,
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
  /** Conjunto de IDs aprendidos (persistido en localStorage) para CFOP Reducido */
  learnedIds?: Set<string>;
  onToggleLearned?: (id: string) => void;
  /** Orientación superior del cubo ('yellow' por defecto o 'white') */
  topFace?: TopFaceColor;
}

type CatalogScope = 'full' | '2look';
type LearnedFilter = 'all' | 'pending' | 'learned';

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
    name: 'CFOP Reducido · Guía JS cuber',
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
    name: 'First Two Layers (41 Casos)',
    description: 'Empareja esquina y arista e insértalas juntas en cada ranura.',
    dotColor: 'bg-[#3B82F6]',
    codeColor: 'text-[#3B82F6]',
    twoLookLabel: 'Esenciales',
  },
  OLL: {
    name: 'Orientation of the Last Layer (57 Casos)',
    description: 'Orienta toda la cara superior amarilla en 1 o 2 pasos.',
    dotColor: 'bg-[#EAB308]',
    codeColor: 'text-[#EAB308]',
    twoLookLabel: '2-Look OLL',
  },
  PLL: {
    name: 'Permutation of the Last Layer (21 Casos)',
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

export const CfopCatalogModule: React.FC<CfopCatalogModuleProps> = ({
  stage,
  selectedCaseId,
  onSelectCase,
  isLeftyGlobal = false,
  learnedIds,
  onToggleLearned,
  topFace = 'yellow',
}) => {
  const [scope, setScope] = useState<CatalogScope>('full');
  const [learnedFilter, setLearnedFilter] = useState<LearnedFilter>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todos');
  const [selectedTag, setSelectedTag] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCrossTips, setShowCrossTips] = useState<boolean>(false);

  useEffect(() => {
    setScope('full');
    setLearnedFilter('all');
    setSelectedSubcategory('Todos');
    setSelectedTag('Todos');
    setSearchQuery('');
  }, [stage]);

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

  const learnedCount = useMemo(() => {
    if (!isReducido || !learnedIds) return 0;
    return stageCases.filter((c) => learnedIds.has(c.id)).length;
  }, [isReducido, learnedIds, stageCases]);

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

      if (isReducido && learnedIds && learnedFilter !== 'all') {
        const isDone = learnedIds.has(item.id);
        if (learnedFilter === 'learned' && !isDone) return false;
        if (learnedFilter === 'pending' && isDone) return false;
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
    isReducido,
    learnedIds,
    learnedFilter,
    selectedSubcategory,
    selectedTag,
    searchQuery,
  ]);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Encabezado de etapa */}
      <header className="flex items-end justify-between gap-3 px-0.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dotColor}`} />
            <h1 className="truncate text-lg font-semibold tracking-tight text-[#FAFAFA] sm:text-xl">
              <span translate="no">
                {isReducido ? 'CFOP Reducido' : stage}
              </span>
              <span className="ml-2 hidden font-normal text-zinc-500 sm:inline">
                {isReducido ? 'JS cuber' : meta.name}
              </span>
            </h1>
          </div>
          <p className="mt-0.5 text-xs text-zinc-400 sm:text-sm">
            {meta.description}
          </p>
        </div>
        <span className="shrink-0 font-mono text-xs tabular-nums text-zinc-500">
          {filteredCases.length === stageCases.length
            ? `${stageCases.length} casos`
            : `${filteredCases.length}/${stageCases.length}`}
        </span>
      </header>

      {/* Panel técnico de guía y progreso local para CFOP Reducido */}
      {isReducido && (
        <section className="space-y-2.5 rounded-lg border border-[#222226] bg-[#111113] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-xs tabular-nums">
              <span className="text-zinc-400">Progreso local:</span>
              <span className="font-semibold text-[#10B981]">
                {learnedCount}/{stageCases.length}
              </span>
              <span className="text-zinc-600">
                ({Math.round((learnedCount / Math.max(1, stageCases.length)) * 100)}
                %)
              </span>
            </div>

            <a
              href={CFOP_REDUCIDO_VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded border border-[#222226] bg-[#09090B] px-2 py-1 font-mono text-[11px] text-zinc-300 transition-colors hover:border-zinc-700 hover:text-[#FAFAFA]"
            >
              <span>Video guía JS cuber</span>
              <ExternalLink className="h-3 w-3 text-zinc-500" />
            </a>
          </div>

          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-900">
            <div
              className="h-full bg-[#10B981] transition-all duration-300"
              style={{
                width: `${(learnedCount / Math.max(1, stageCases.length)) * 100}%`,
              }}
            />
          </div>

          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pt-0.5">
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
            className="flex h-11 w-full items-center justify-between px-3 text-left"
          >
            <span className="text-sm font-medium text-zinc-200">
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

      {/* Barra de búsqueda + filtros pegajosa (Sticky) */}
      <div className="top-header sticky z-20 -mx-4 space-y-2 border-b border-[#222226] bg-[#09090B]/95 px-4 py-2.5 backdrop-blur-md sm:mx-0 sm:rounded-lg sm:border sm:bg-[#111113]/95 sm:p-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Input de búsqueda por nombre/número/marca de tiempo */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              inputMode="search"
              enterKeyHint="search"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Buscar en ${
                isReducido ? 'CFOP Reducido' : stage
              } (ej. ${
                isReducido
                  ? 'Hongo, Sun, Aa, 04:43'
                  : stage === 'OLL'
                  ? 'OLL 21, Sune, Dot'
                  : stage === 'PLL'
                  ? 'PLL T, Ga, Faros'
                  : 'F2L 01, Sexy, Slot'
              })...`}
              aria-label={`Buscar en ${stage}`}
              className="h-10 w-full rounded-md border border-[#222226] bg-[#09090B] pr-9 pl-9 text-base text-zinc-100 placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none sm:h-9 sm:text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSearchQuery('');
                }}
                aria-label="Limpiar búsqueda"
                className="absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-zinc-500 hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* En Reducido: filtro estado local (Todos / Pendientes / Aprendidos). En OLL/PLL/F2L/Cross: Todos vs 2-Look */}
          {isReducido && learnedIds ? (
            <div
              role="group"
              aria-label="Filtrar por progreso"
              className="grid shrink-0 grid-cols-3 rounded-md border border-[#222226] bg-[#09090B] p-0.5 sm:w-auto"
            >
              {(
                [
                  { id: 'all', label: `Todos (${stageCases.length})` },
                  {
                    id: 'pending',
                    label: `Pend. (${stageCases.length - learnedCount})`,
                  },
                  { id: 'learned', label: `Listos (${learnedCount})` },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setLearnedFilter(opt.id);
                  }}
                  className={`h-8 rounded px-2 font-mono text-[11px] font-medium tabular-nums transition-colors ${
                    learnedFilter === opt.id
                      ? 'bg-[#FAFAFA] font-semibold text-[#09090B]'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : (
            twoLookCount > 0 && (
              <div
                role="group"
                aria-label="Modo de catálogo"
                className="grid shrink-0 grid-cols-2 rounded-md border border-[#222226] bg-[#09090B] p-0.5 sm:w-auto"
              >
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setScope('full');
                  }}
                  className={`h-8 rounded px-3 font-mono text-xs font-medium tabular-nums transition-colors ${
                    scope === 'full'
                      ? 'bg-[#FAFAFA] font-semibold text-[#09090B]'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Todos ({stageCases.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setScope('2look');
                  }}
                  className={`h-8 rounded px-3 font-mono text-xs font-medium tabular-nums transition-colors ${
                    scope === '2look'
                      ? 'bg-[#FAFAFA] font-semibold text-[#09090B]'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {meta.twoLookLabel} ({twoLookCount})
                </button>
              </div>
            )
          )}
        </div>

        {/* Fila 1: Subcategorías oficiales con contador */}
        <div className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
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
                className={`inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 text-xs font-medium transition-colors ${
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

        {/* Fila 2: Reconocimiento visual rápido por características */}
        {availableTags.length > 0 && !isReducido && (
          <div className="no-scrollbar -mx-4 flex items-center gap-1 overflow-x-auto border-t border-[#222226]/60 px-4 pt-1.5 sm:mx-0 sm:flex-wrap sm:px-0">
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
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
                  ? 'bg-zinc-800 text-[#FAFAFA]'
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

      {/* Lista de casos */}
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
              setLearnedFilter('all');
              setSelectedSubcategory('Todos');
              setSelectedTag('Todos');
              setSearchQuery('');
            }}
            className="mt-3 h-9 rounded-md bg-[#FAFAFA] px-4 text-xs font-semibold text-[#09090B] hover:bg-zinc-200"
          >
            Ver todos los casos ({stageCases.length})
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {filteredCases.map((item) => {
            const isSelected = item.id === selectedCaseId;
            const displayAlg = isLeftyGlobal
              ? mirrorAlgLR(item.alg)
              : item.alg;
            const moveCount = countAlgMoves(displayAlg);
            const twoLook = isTwoLookCase(item);
            const altCount = item.altAlgs.length;
            const isDone = Boolean(isReducido && learnedIds?.has(item.id));
            const previewStage = getPreviewStage(item);

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
                  className={`flex w-full cursor-pointer items-start gap-3 rounded-lg border p-2.5 text-left transition-colors active:bg-[#1C1C21] sm:p-3 ${
                    isSelected
                      ? 'border-[#FAFAFA] bg-[#16161A]'
                      : isDone
                      ? 'border-[#10B981]/35 bg-[#111113] hover:border-[#10B981]/60 hover:bg-[#16161A]'
                      : 'border-[#222226] bg-[#111113] hover:border-zinc-700 hover:bg-[#16161A]'
                  }`}
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

                      <div className="flex shrink-0 items-center gap-1.5">
                        {item.videoTimestamp && item.videoUrl && (
                          <a
                            href={item.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={`Ver en YouTube (${item.videoTimestamp})`}
                            className="inline-flex items-center gap-0.5 rounded border border-[#222226] bg-[#09090B] px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-zinc-400 transition-colors hover:border-[#10B981]/50 hover:text-[#10B981]"
                          >
                            <span>▶ {item.videoTimestamp}</span>
                          </a>
                        )}

                        {!isReducido && (
                          <span
                            translate="no"
                            className="font-mono text-[11px] tabular-nums text-zinc-500"
                          >
                            {moveCount} HTM
                          </span>
                        )}

                        {isReducido && onToggleLearned && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerHaptic('success');
                              onToggleLearned(item.id);
                            }}
                            aria-label={
                              isDone
                                ? `Desmarcar ${item.name} como aprendido`
                                : `Marcar ${item.name} como aprendido`
                            }
                            aria-pressed={isDone}
                            className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
                              isDone
                                ? 'border-[#10B981]/50 bg-[#10B981]/15 text-[#10B981]'
                                : 'border-[#222226] bg-[#09090B] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Circle className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="mt-0.5 truncate text-sm font-semibold text-[#FAFAFA]">
                      {item.name}
                    </h3>

                    <p className="mt-0.5 flex items-center gap-2 truncate text-[11px] text-zinc-500">
                      <span className="truncate">
                        {item.guideNote ?? item.subcategory}
                      </span>
                      {isReducido && (
                        <span
                          translate="no"
                          className="shrink-0 font-mono text-[10px] tabular-nums text-zinc-600"
                        >
                          · {moveCount} HTM
                        </span>
                      )}
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
