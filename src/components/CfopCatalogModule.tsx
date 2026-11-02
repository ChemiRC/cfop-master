import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import {
  CFOP_CASES,
  CFOP_SUBCATEGORIES,
  CROSS_TIPS,
  TWO_LOOK_PLL_IDS,
} from '../data/cfopData';
import type { CfopCase, LearningStage } from '../types/cfop';
import { countAlgMoves, mirrorAlgLR } from '../utils/algHelpers';
import { triggerHaptic } from '../utils/haptics';
import { AlgNotationBadges } from './AlgNotationBadges';
import { Cube2DPreview } from './Cube2DPreview';

interface CfopCatalogModuleProps {
  stage: LearningStage;
  selectedCaseId: string;
  onSelectCase: (cfopCase: CfopCase) => void;
  isLeftyGlobal?: boolean;
}

const STAGE_META: Record<
  LearningStage,
  { name: string; description: string; dotColor: string; codeColor: string }
> = {
  Cross: {
    name: 'Cruz',
    description: 'Las 4 aristas de la base en 8 movimientos o menos.',
    dotColor: 'bg-[#F4F4F5]',
    codeColor: 'text-[#F4F4F5]',
  },
  F2L: {
    name: 'First Two Layers',
    description: 'Esquina y arista juntas en cada ranura.',
    dotColor: 'bg-[#3B82F6]',
    codeColor: 'text-[#3B82F6]',
  },
  OLL: {
    name: 'Orientación de última capa',
    description: 'Deja la cara superior de un solo color.',
    dotColor: 'bg-[#EAB308]',
    codeColor: 'text-[#EAB308]',
  },
  PLL: {
    name: 'Permutación de última capa',
    description: 'Coloca cada pieza en su lugar y termina el cubo.',
    dotColor: 'bg-[#EF4444]',
    codeColor: 'text-[#EF4444]',
  },
};

export const CfopCatalogModule: React.FC<CfopCatalogModuleProps> = ({
  stage,
  selectedCaseId,
  onSelectCase,
  isLeftyGlobal = false,
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todos');
  const [selectedTag, setSelectedTag] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCrossTips, setShowCrossTips] = useState<boolean>(false);

  useEffect(() => {
    setSelectedSubcategory('Todos');
    setSelectedTag('Todos');
    setSearchQuery('');
  }, [stage]);

  const subcategories = CFOP_SUBCATEGORIES[stage] ?? ['Todos'];
  const meta = STAGE_META[stage];

  // Extrae etiquetas de reconocimiento visual para la etapa actual (Faros, Barras, Bloques, etc.)
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    CFOP_CASES.filter((c) => c.stage === stage).forEach((c) => {
      c.tags?.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [stage]);

  const totalStageCases = useMemo(
    () => CFOP_CASES.filter((item) => item.stage === stage).length,
    [stage]
  );

  const filteredCases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return CFOP_CASES.filter((item) => {
      if (item.stage !== stage) return false;

      if (selectedSubcategory !== 'Todos') {
        if (stage === 'PLL' && selectedSubcategory === '2-Look PLL') {
          if (!TWO_LOOK_PLL_IDS.has(item.id)) return false;
        } else if (item.subcategory !== selectedSubcategory) {
          return false;
        }
      }

      if (selectedTag !== 'Todos') {
        if (!item.tags || !item.tags.includes(selectedTag)) {
          return false;
        }
      }

      if (query) {
        const haystack = [
          item.code,
          item.name,
          item.alg,
          item.altAlg ?? '',
          item.recognition,
          ...(item.triggers ?? []),
          ...(item.tags ?? []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [stage, selectedSubcategory, selectedTag, searchQuery]);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Encabezado de etapa: título + una línea */}
      <header className="flex items-end justify-between gap-3 px-0.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dotColor}`} />
            <h1 className="truncate text-lg font-semibold tracking-tight text-[#FAFAFA] sm:text-xl">
              <span translate="no">{stage}</span>
              <span className="ml-2 hidden font-normal text-zinc-500 sm:inline">
                {meta.name}
              </span>
            </h1>
          </div>
          <p className="mt-0.5 text-xs text-zinc-400 sm:text-sm">{meta.description}</p>
        </div>
        <span className="shrink-0 font-mono text-xs tabular-nums text-zinc-500">
          {filteredCases.length === totalStageCases
            ? `${totalStageCases} casos`
            : `${filteredCases.length}/${totalStageCases}`}
        </span>
      </header>

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
            <span className="text-sm font-medium text-zinc-200">Consejos clave</span>
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
                  <p className="text-xs font-semibold text-[#FAFAFA]">{tip.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-zinc-400">{tip.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Barra de búsqueda + filtros (sticky bajo el header) */}
      <div className="top-header sticky z-20 -mx-4 space-y-2 border-b border-[#222226] bg-[#09090B]/95 px-4 py-2 backdrop-blur-md sm:mx-0 sm:rounded-lg sm:border sm:bg-[#111113]/95 sm:p-2.5">
        <div className="relative">
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
            placeholder="Buscar caso, algoritmo o rasgo (ej. Faros, Sune)..."
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

        {/* Fila 1: Subcategorías principales */}
        <div className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {subcategories.map((sub) => {
            const isActive = selectedSubcategory === sub;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedSubcategory(sub);
                }}
                className={`h-8 shrink-0 whitespace-nowrap rounded-md border px-2.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'border-[#FAFAFA] bg-[#FAFAFA] text-[#09090B]'
                    : 'border-[#222226] bg-[#111113] text-zinc-400 hover:text-zinc-200 sm:border-transparent sm:bg-transparent'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* Fila 2: Reconocimiento visual rápido por características (Faros, Barras, Bloques) */}
        {availableTags.length > 0 && (
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
          <p className="text-sm text-zinc-300">Sin resultados para el filtro actual</p>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setSelectedSubcategory('Todos');
              setSelectedTag('Todos');
              setSearchQuery('');
            }}
            className="mt-3 h-9 rounded-md bg-[#FAFAFA] px-4 text-xs font-semibold text-[#09090B] hover:bg-zinc-200"
          >
            Ver todos los casos
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {filteredCases.map((item) => {
            const isSelected = item.id === selectedCaseId;
            const displayAlg = isLeftyGlobal ? mirrorAlgLR(item.alg) : item.alg;
            const moveCount = countAlgMoves(displayAlg);
            const isTwoLookPll =
              item.stage === 'PLL' && TWO_LOOK_PLL_IDS.has(item.id);

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    onSelectCase(item);
                  }}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors active:bg-[#1C1C21] sm:p-3 ${
                    isSelected
                      ? 'border-[#FAFAFA] bg-[#16161A]'
                      : 'border-[#222226] bg-[#111113] hover:border-zinc-700 hover:bg-[#16161A]'
                  }`}
                >
                  <Cube2DPreview alg={displayAlg} stage={item.stage} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span
                          translate="no"
                          className={`font-mono text-[11px] font-semibold tabular-nums ${meta.codeColor}`}
                        >
                          {item.code}
                        </span>
                        {isTwoLookPll && (
                          <span className="rounded border border-[#EF4444]/40 px-1 font-mono text-[9px] font-medium leading-4 text-[#EF4444]">
                            2-LOOK
                          </span>
                        )}
                        {isLeftyGlobal && (
                          <span className="rounded border border-[#3B82F6]/40 px-1 font-mono text-[9px] font-medium leading-4 text-[#3B82F6]">
                            ZURDO
                          </span>
                        )}
                      </div>
                      <span
                        translate="no"
                        className="shrink-0 font-mono text-[11px] tabular-nums text-zinc-500"
                      >
                        {moveCount} HTM
                      </span>
                    </div>

                    <h3 className="mt-0.5 truncate text-sm font-semibold text-[#FAFAFA]">
                      {item.name}
                    </h3>

                    {/* Etiquetas visuales del caso */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-zinc-900 px-1.5 py-0.2 font-mono text-[10px] text-zinc-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-1.5">
                      <AlgNotationBadges alg={displayAlg} compact />
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
