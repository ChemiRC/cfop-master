import React, { useState } from 'react';
import {
  FUNDAMENTAL_TRIGGERS,
  NOTATION_CATEGORY_LABELS,
  NOTATION_MOVES,
  NOTATION_RULES,
  type TriggerDemo,
} from '../data/cfopData';
import type { NotationCategory, NotationMove } from '../types/cfop';
import { triggerHaptic } from '../utils/haptics';

interface NotationModuleProps {
  selectedId: string;
  onSelectMove: (move: NotationMove) => void;
  onSelectTrigger: (trigger: TriggerDemo) => void;
}

const CATEGORY_ORDER: NotationCategory[] = [
  'basic',
  'double',
  'slice',
  'wide',
  'rotation',
];

/** Etiqueta compacta e independiente del idioma: sentido + grados */
function compactDirection(move: string): string {
  if (move.includes('2')) return '180°';
  return move.includes("'") ? '↺ 90°' : '↻ 90°';
}

const WCA_LEGEND = [
  { face: 'U', color: 'bg-[#FAFAFA]', label: 'Arriba' },
  { face: 'F', color: 'bg-[#10B981]', label: 'Frente' },
  { face: 'R', color: 'bg-[#EF4444]', label: 'Derecha' },
  { face: 'D', color: 'bg-[#EAB308]', label: 'Abajo' },
];

export const NotationModule: React.FC<NotationModuleProps> = ({
  selectedId,
  onSelectMove,
  onSelectTrigger,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | NotationCategory>('all');

  const visibleCategories =
    activeCategory === 'all' ? CATEGORY_ORDER : [activeCategory];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Encabezado + Reglas de sintaxis */}
      <section className="rounded-lg border border-[#222226] bg-[#111113] p-3 sm:p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h1 className="text-base font-semibold tracking-tight text-[#FAFAFA] sm:text-lg">
            Notación
          </h1>
          <span className="font-mono text-[11px] tabular-nums text-zinc-500">
            {NOTATION_MOVES.length} movs
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {NOTATION_RULES.map((rule) => (
            <div
              key={rule.symbol}
              className="rounded-md border border-[#222226] bg-[#09090B] p-2.5"
            >
              <div className="flex items-center justify-between gap-1.5">
                <span
                  translate="no"
                  className="font-mono text-lg font-bold leading-none tabular-nums text-[#FAFAFA]"
                >
                  {rule.symbol}
                </span>
                <span className="font-mono text-[10px] tabular-nums text-zinc-500">
                  {rule.badge}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-zinc-400 sm:text-xs">
                {rule.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Filtro de categorías: scroll horizontal en móvil */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-lg border border-[#222226] bg-[#111113] p-1">
          {(['all', ...CATEGORY_ORDER] as const).map((cat) => {
            const active = activeCategory === cat;
            const label = cat === 'all' ? 'Todos' : NOTATION_CATEGORY_LABELS[cat].label;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setActiveCategory(cat);
                }}
                className={`h-8 shrink-0 whitespace-nowrap rounded-md px-3 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[#FAFAFA] text-[#09090B]'
                    : 'text-zinc-400 hover:bg-[#16161A] hover:text-zinc-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Matrices de movimientos */}
      {visibleCategories.map((cat) => {
        const meta = NOTATION_CATEGORY_LABELS[cat];
        const moves = NOTATION_MOVES.filter((m) => m.category === cat);

        return (
          <section
            key={cat}
            className="rounded-lg border border-[#222226] bg-[#111113] p-3 sm:p-4"
          >
            <div className="mb-2.5 flex items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold text-[#FAFAFA]">{meta.label}</h2>
              <span className="truncate font-mono text-[11px] text-zinc-500">
                {meta.subtitle}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 sm:gap-2">
              {moves.map((item) => {
                const isActive = selectedId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      onSelectMove(item);
                    }}
                    aria-label={`${item.move}: ${item.name}`}
                    className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-md border transition-colors active:bg-[#1C1C21] ${
                      isActive
                        ? 'border-[#FAFAFA] bg-[#16161A]'
                        : 'border-[#222226] bg-[#09090B] hover:border-zinc-700 hover:bg-[#16161A]'
                    }`}
                  >
                    <span
                      translate="no"
                      className="font-mono text-lg font-bold leading-none tabular-nums text-[#FAFAFA]"
                    >
                      {item.move}
                    </span>
                    <span
                      translate="no"
                      className="font-mono text-[10px] tabular-nums text-zinc-500"
                    >
                      {compactDirection(item.move)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Triggers fundamentales */}
      <section className="rounded-lg border border-[#222226] bg-[#111113] p-3 sm:p-4">
        <div className="mb-2.5 flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-[#FAFAFA]">Triggers</h2>
          <span className="font-mono text-[11px] text-zinc-500">
            Secuencias base
          </span>
        </div>

        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
          {FUNDAMENTAL_TRIGGERS.map((trig) => {
            const isActive = selectedId === trig.id;
            return (
              <button
                key={trig.id}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onSelectTrigger(trig);
                }}
                className={`flex min-h-[48px] items-center justify-between gap-2 rounded-md border px-3 py-2 text-left transition-colors active:bg-[#1C1C21] ${
                  isActive
                    ? 'border-[#FAFAFA] bg-[#16161A]'
                    : 'border-[#222226] bg-[#09090B] hover:border-zinc-700 hover:bg-[#16161A]'
                }`}
              >
                <span className="text-sm font-medium text-[#FAFAFA]">
                  {trig.name}
                </span>
                <span
                  translate="no"
                  className="font-mono text-xs tabular-nums text-zinc-300"
                >
                  {trig.alg}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Leyenda de orientación WCA */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-md border border-[#222226] bg-[#111113] px-3 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          Orientación
        </span>
        {WCA_LEGEND.map((item) => (
          <span key={item.face} className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
            <span className={`h-2.5 w-2.5 rounded-sm ${item.color}`} />
            <span translate="no" className="font-mono font-semibold text-zinc-200">
              {item.face}
            </span>
            <span>{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
