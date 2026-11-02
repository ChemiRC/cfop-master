import React, { useState } from 'react';
import { Play } from 'lucide-react';
import {
  FUNDAMENTAL_TRIGGERS,
  NOTATION_CATEGORY_LABELS,
  NOTATION_MOVES,
  NOTATION_RULES,
  type TriggerDemo,
} from '../data/cfopData';
import type { NotationCategory, NotationMove } from '../types/cfop';

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

export const NotationModule: React.FC<NotationModuleProps> = ({
  selectedId,
  onSelectMove,
  onSelectTrigger,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | NotationCategory>('all');

  const visibleCategories =
    activeCategory === 'all' ? CATEGORY_ORDER : [activeCategory];

  return (
    <div className="space-y-4">
      {/* Encabezado Técnico + Sintaxis WCA */}
      <div className="rounded-lg border border-[#222226] bg-[#111113] p-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-base font-semibold tracking-tight text-[#FAFAFA] sm:text-lg">
              Especificación de Notación WCA
            </h1>
            <p className="mt-0.5 text-xs text-zinc-400">
              Selecciona un símbolo para inspeccionar su vector de giro en el viewport 3D.
            </p>
          </div>
          <span className="font-mono text-xs tabular-nums text-zinc-500">
            {NOTATION_MOVES.length} SÍMBOLOS · ESTÁNDAR 3×3
          </span>
        </div>

        {/* 4 Modificadores Sintácticos: ', 2, minúsculas, mayúsculas */}
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {NOTATION_RULES.map((rule) => (
            <div
              key={rule.symbol}
              className="rounded-md border border-[#222226] bg-[#09090B] p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  translate="no"
                  className="font-mono text-sm font-bold tabular-nums text-[#FAFAFA]"
                >
                  {rule.symbol}
                </span>
                <span className="rounded border border-[#222226] bg-[#111113] px-1.5 py-0.5 font-mono text-[10px] font-medium tabular-nums text-zinc-400">
                  {rule.badge}
                </span>
              </div>
              <h3 className="mt-1.5 text-xs font-semibold text-zinc-200">
                {rule.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {rule.explanation}
              </p>
              <p
                translate="no"
                className="mt-2 border-t border-[#222226] pt-1.5 font-mono text-[11px] tabular-nums text-zinc-300"
              >
                {rule.example}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filtro Segmented de Categorías */}
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[#222226] bg-[#111113] p-1">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-[#FAFAFA] text-[#09090B]'
              : 'text-zinc-400 hover:bg-[#16161A] hover:text-zinc-200'
          }`}
        >
          <span>Todos</span>
          <span className="font-mono text-[11px] tabular-nums opacity-70">
            {NOTATION_MOVES.length}
          </span>
        </button>

        {CATEGORY_ORDER.map((cat) => {
          const count = NOTATION_MOVES.filter((m) => m.category === cat).length;
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'bg-[#FAFAFA] text-[#09090B]'
                  : 'text-zinc-400 hover:bg-[#16161A] hover:text-zinc-200'
              }`}
            >
              <span>{NOTATION_CATEGORY_LABELS[cat].label.split(' (')[0]}</span>
              <span className="font-mono text-[11px] tabular-nums opacity-70">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Matrices de Movimientos */}
      <div className="space-y-4">
        {visibleCategories.map((cat) => {
          const meta = NOTATION_CATEGORY_LABELS[cat];
          const moves = NOTATION_MOVES.filter((m) => m.category === cat);

          return (
            <section
              key={cat}
              className="rounded-lg border border-[#222226] bg-[#111113] p-4"
            >
              <div className="mb-3 flex items-baseline justify-between gap-2 border-b border-[#222226] pb-2.5">
                <div>
                  <h2 className="text-sm font-semibold text-[#FAFAFA]">
                    {meta.label}
                  </h2>
                  <p className="mt-0.5 text-xs text-zinc-400">{meta.subtitle}</p>
                </div>
                <span className="font-mono text-[11px] tabular-nums text-zinc-500">
                  {moves.length} MOVS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                {moves.map((item) => {
                  const isActive = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectMove(item)}
                      className={`group flex flex-col items-start justify-between rounded-md border p-2.5 text-left transition-colors ${
                        isActive
                          ? 'border-[#FAFAFA] bg-[#16161A]'
                          : 'border-[#222226] bg-[#09090B] hover:border-zinc-700 hover:bg-[#16161A]'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span
                          translate="no"
                          className="font-mono text-lg font-bold tabular-nums tracking-tight text-[#FAFAFA]"
                        >
                          {item.move}
                        </span>
                        <Play
                          className={`h-3 w-3 ${
                            isActive
                              ? 'fill-[#FAFAFA] text-[#FAFAFA]'
                              : 'text-zinc-600 group-hover:text-zinc-300'
                          }`}
                        />
                      </div>

                      <div className="mt-2">
                        <div className="text-xs font-medium text-zinc-200">
                          {item.faceLabel}
                        </div>
                        <div className="mt-0.5 font-mono text-[11px] tabular-nums text-zinc-500">
                          {item.directionLabel}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Sub-rutinas / Triggers Fundamentales */}
      <section className="rounded-lg border border-[#222226] bg-[#111113] p-4">
        <div className="mb-3 flex items-baseline justify-between border-b border-[#222226] pb-2.5">
          <div>
            <h2 className="text-sm font-semibold text-[#FAFAFA]">
              Triggers Fundamentales (Sub-secuencias de 4 HTM)
            </h2>
            <p className="mt-0.5 text-xs text-zinc-400">
              Bloques ergonómicos recurrentes utilizados en F2L, OLL y PLL.
            </p>
          </div>
          <span className="font-mono text-[11px] tabular-nums text-zinc-500">
            4 TRIGGERS
          </span>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {FUNDAMENTAL_TRIGGERS.map((trig) => {
            const isActive = selectedId === trig.id;
            return (
              <button
                key={trig.id}
                type="button"
                onClick={() => onSelectTrigger(trig)}
                className={`flex flex-col justify-between rounded-md border p-3 text-left transition-colors ${
                  isActive
                    ? 'border-[#FAFAFA] bg-[#16161A]'
                    : 'border-[#222226] bg-[#09090B] hover:border-zinc-700 hover:bg-[#16161A]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#FAFAFA]">
                    {trig.name}
                  </span>
                  <span
                    translate="no"
                    className="rounded border border-[#2A2A30] bg-[#18181C] px-2 py-0.5 font-mono text-xs font-medium tabular-nums text-[#FAFAFA]"
                  >
                    ({trig.alg})
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  {trig.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Referencia de orientación WCA */}
      <div className="rounded-md border border-[#222226] bg-[#111113] px-3.5 py-2.5 text-xs text-zinc-400">
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          EJE WCA:{' '}
        </span>
        <span>
          Cara <strong className="font-mono text-[#FAFAFA]">U</strong> (Blanco) arriba ·{' '}
          <strong className="font-mono text-[#10B981]">F</strong> (Verde) frente ·{' '}
          <strong className="font-mono text-[#EF4444]">R</strong> (Rojo) derecha ·{' '}
          <strong className="font-mono text-[#EAB308]">D</strong> (Amarillo) base.
        </span>
      </div>
    </div>
  );
};
