import React, { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import {
  CFOP_CASES,
  CFOP_SUBCATEGORIES,
  CROSS_TIPS,
  TWO_LOOK_PLL_IDS,
} from '../data/cfopData';
import type { CfopCase, LearningStage } from '../types/cfop';
import { countAlgMoves } from '../utils/algHelpers';
import { AlgNotationBadges } from './AlgNotationBadges';
import { Cube2DPreview } from './Cube2DPreview';

interface CfopCatalogModuleProps {
  stage: LearningStage;
  selectedCaseId: string;
  onSelectCase: (cfopCase: CfopCase) => void;
}

const STAGE_META: Record<
  LearningStage,
  {
    stepCode: string;
    title: string;
    description: string;
    dotColor: string;
    codeColor: string;
  }
> = {
  Cross: {
    stepCode: 'ETAPA 01 / CROSS',
    title: 'Cross — Resolución de Aristas de Base',
    description:
      'Inserciones directas y relativas para resolver las 4 aristas inferiores en ≤ 8 HTM.',
    dotColor: 'bg-[#F4F4F5]',
    codeColor: 'text-[#F4F4F5]',
  },
  F2L: {
    stepCode: 'ETAPA 02 / F2L',
    title: 'F2L — First Two Layers (41 Casos Estándar · Selección Fundamental)',
    description:
      'Emparejamiento e inserción simultánea de esquina y arista en las 4 ranuras.',
    dotColor: 'bg-[#3B82F6]',
    codeColor: 'text-[#3B82F6]',
  },
  OLL: {
    stepCode: 'ETAPA 03 / OLL',
    title: 'OLL — Orientation of the Last Layer (2-Look + Casos Frecuentes)',
    description:
      'Orientación completa de la cara superior mediante patrones de aristas y esquinas.',
    dotColor: 'bg-[#EAB308]',
    codeColor: 'text-[#EAB308]',
  },
  PLL: {
    stepCode: 'ETAPA 04 / PLL',
    title: 'PLL — Permutation of the Last Layer (21 Algoritmos Completos)',
    description:
      'Permutación final de esquinas y aristas conservando la orientación de la capa superior.',
    dotColor: 'bg-[#EF4444]',
    codeColor: 'text-[#EF4444]',
  },
};

export const CfopCatalogModule: React.FC<CfopCatalogModuleProps> = ({
  stage,
  selectedCaseId,
  onSelectCase,
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCrossTips, setShowCrossTips] = useState<boolean>(true);

  useEffect(() => {
    setSelectedSubcategory('Todos');
  }, [stage]);

  const subcategories = CFOP_SUBCATEGORIES[stage] ?? ['Todos'];
  const meta = STAGE_META[stage];

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

      if (query) {
        const haystack = [
          item.code,
          item.name,
          item.alg,
          item.altAlg ?? '',
          item.recognition,
          item.explanation,
          ...(item.triggers ?? []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [stage, selectedSubcategory, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Encabezado Técnico Sobrio */}
      <div className="rounded-lg border border-[#222226] bg-[#111113] p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${meta.dotColor}`} />
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {meta.stepCode}
              </span>
            </div>
            <h1 className="mt-1.5 text-base font-semibold tracking-tight text-[#FAFAFA] sm:text-lg">
              {meta.title}
            </h1>
            <p className="mt-0.5 max-w-2xl text-xs text-zinc-400">
              {meta.description}
            </p>
          </div>

          <div className="shrink-0 self-start rounded-md border border-[#222226] bg-[#09090B] px-2.5 py-1 font-mono text-xs tabular-nums text-zinc-400">
            {filteredCases.length}/{totalStageCases} CASOS
          </div>
        </div>
      </div>

      {/* Notas Técnicas de Cross (sin íconos decorativos) */}
      {stage === 'Cross' && (
        <div className="rounded-lg border border-[#222226] bg-[#111113] p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-300">
              Heurísticas de Planificación (≤ 8 HTM)
            </span>
            <button
              type="button"
              onClick={() => setShowCrossTips((prev) => !prev)}
              className="font-mono text-xs text-zinc-400 transition-colors hover:text-[#FAFAFA]"
            >
              {showCrossTips ? '[Ocultar]' : '[Mostrar]'}
            </button>
          </div>

          {showCrossTips && (
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {CROSS_TIPS.map((tip) => (
                <div
                  key={tip.title}
                  className="rounded-md border border-[#222226] bg-[#09090B] p-3"
                >
                  <h3 className="text-xs font-semibold text-[#FAFAFA]">
                    {tip.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {tip.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Barra de Filtrado y Búsqueda */}
      <div className="space-y-2.5 rounded-lg border border-[#222226] bg-[#111113] p-3">
        <div className="flex flex-wrap items-center gap-1">
          {subcategories.map((sub) => {
            const isActive = selectedSubcategory === sub;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubcategory(sub)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#FAFAFA] text-[#09090B]'
                    : 'text-zinc-400 hover:bg-[#16161A] hover:text-zinc-200'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filtrar ${stage} por código, algoritmo o patrón (ej. R U R' U', Sune, Headlights)...`}
            className="w-full rounded-md border border-[#222226] bg-[#09090B] py-1.5 pr-8 pl-8 text-xs text-zinc-100 placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Limpiar filtro"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-zinc-500 hover:bg-[#16161A] hover:text-zinc-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Cuadrícula de Algoritmos */}
      {filteredCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[#222226] bg-[#111113] px-6 py-10 text-center">
          <p className="text-xs font-medium text-zinc-300">
            Sin resultados para el criterio actual.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSubcategory('Todos');
              setSearchQuery('');
            }}
            className="mt-3 rounded-md bg-[#FAFAFA] px-3 py-1.5 text-xs font-semibold text-[#09090B] hover:bg-zinc-200"
          >
            Restablecer filtro
          </button>
        </div>
      ) : (
        <div className="grid gap-2.5 md:grid-cols-2">
          {filteredCases.map((item) => {
            const isSelected = item.id === selectedCaseId;
            const moveCount = countAlgMoves(item.alg);
            const isTwoLookPll =
              item.stage === 'PLL' && TWO_LOOK_PLL_IDS.has(item.id);

            return (
              <div
                key={item.id}
                onClick={() => onSelectCase(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCase(item);
                  }
                }}
                className={`group flex cursor-pointer flex-col justify-between rounded-lg border p-3.5 transition-colors ${
                  isSelected
                    ? 'border-[#FAFAFA] bg-[#16161A]'
                    : 'border-[#222226] bg-[#111113] hover:border-zinc-700 hover:bg-[#16161A]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Cube2DPreview alg={item.alg} stage={item.stage} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          translate="no"
                          className={`font-mono text-xs font-semibold tabular-nums ${meta.codeColor}`}
                        >
                          {item.code}
                        </span>
                        {isTwoLookPll && (
                          <span className="rounded border border-[#EF4444]/40 bg-[#EF4444]/10 px-1.5 py-0.5 font-mono text-[10px] font-medium tabular-nums text-[#EF4444]">
                            2-LOOK
                          </span>
                        )}
                      </div>

                      <span
                        translate="no"
                        className="font-mono text-[11px] tabular-nums text-zinc-500"
                      >
                        {moveCount} HTM
                      </span>
                    </div>

                    <h3 className="mt-1 truncate text-sm font-semibold text-[#FAFAFA]">
                      {item.name}
                    </h3>

                    <div className="mt-2 rounded-md border border-[#222226] bg-[#09090B] px-2.5 py-1.5">
                      <AlgNotationBadges alg={item.alg} compact />
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 border-t border-[#222226] pt-2">
                  <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      ID:{' '}
                    </span>
                    {item.recognition}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
