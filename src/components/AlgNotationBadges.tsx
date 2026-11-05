import React, { useEffect, useMemo, useRef } from 'react';
import {
  classifyMoveToken,
  segmentAlgWithTriggers,
} from '../utils/algHelpers';

interface AlgNotationBadgesProps {
  alg: string;
  compact?: boolean;
  /** Índice del movimiento activo durante reproducción 3D o paso a paso */
  activeMoveIndex?: number;
  /** Cantidad de movimientos ya ejecutados */
  completedMoves?: number;
  /** Callback para saltar a un movimiento específico al tocarlo */
  onMoveClick?: (index: number) => void;
  /** Activa auto-scroll horizontal en algoritmos largos (modo reproductor móvil) */
  autoScroll?: boolean;
}

function getMoveColorClasses(move: string, isActive: boolean, isDone: boolean): string {
  const style = classifyMoveToken(move);

  if (isActive) {
    return `${
      style.isWideOrRotation ? 'italic ' : ''
    }bg-[#FAFAFA] text-[#09090B] font-bold ring-2 ring-[#FAFAFA]/40 rounded px-1.5 py-0.5`;
  }

  let colorClass = 'text-[#FAFAFA]';
  if (style.isDouble) {
    colorClass = 'text-sky-400 font-semibold';
  } else if (style.isPrime) {
    colorClass = 'text-amber-300 font-medium';
  }

  if (isDone) {
    colorClass = 'text-[#10B981]';
  }

  if (style.isWideOrRotation) {
    return `italic rounded border border-zinc-700/70 bg-zinc-800/80 px-1 py-0.2 ${colorClass}`;
  }

  return `px-0.5 ${colorClass}`;
}

/**
 * Renderiza notación WCA en font-mono tabular-nums con:
 * 1) Chunking cognitivo (agrupación de triggers con borde inferior sutil)
 * 2) Codificación semántica por tipo de giro (Normal #FAFAFA, Prima ámbar, Doble 180° cian, Wide/Rotación cursiva en pill)
 * 3) Karaoke / Step Highlight sincronizado con el visor 3D y auto-scroll horizontal en móvil
 */
export const AlgNotationBadges: React.FC<AlgNotationBadgesProps> = ({
  alg,
  compact = false,
  activeMoveIndex = -1,
  completedMoves = 0,
  onMoveClick,
  autoScroll = false,
}) => {
  const segments = useMemo(() => segmentAlgWithTriggers(alg), [alg]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tokenRefs = useRef<Record<number, HTMLElement | null>>({});

  useEffect(() => {
    if (!autoScroll) return;
    const strip = containerRef.current;
    if (!strip) return;

    if (activeMoveIndex < 0) {
      strip.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    const activeEl = tokenRefs.current[activeMoveIndex];
    if (!activeEl || strip.scrollWidth <= strip.clientWidth) return;

    const stripRect = strip.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();
    const currentScroll = strip.scrollLeft;
    const targetScroll =
      currentScroll +
      (elRect.left - stripRect.left) -
      stripRect.width / 2 +
      elRect.width / 2;

    strip.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: 'smooth',
    });
  }, [activeMoveIndex, autoScroll]);

  const renderMoveToken = (move: string, globalIndex: number) => {
    const isActive = globalIndex === activeMoveIndex;
    const isDone = globalIndex < completedMoves && !isActive;
    const tokenClasses = getMoveColorClasses(move, isActive, isDone);

    if (onMoveClick) {
      return (
        <button
          key={globalIndex}
          ref={(el) => {
            tokenRefs.current[globalIndex] = el;
          }}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMoveClick(globalIndex);
          }}
          aria-label={`Ir al paso ${globalIndex + 1}: ${move}`}
          className={`inline-flex shrink-0 items-center justify-center rounded font-mono transition-all ${
            compact
              ? 'min-h-[1.5rem] text-xs'
              : 'min-h-[2.125rem] min-w-[1.85rem] px-1.5 text-sm lg:min-h-[1.85rem] lg:text-xs'
          } ${
            isActive
              ? 'border border-[#FAFAFA] bg-[#FAFAFA] font-bold text-[#09090B] ring-2 ring-[#FAFAFA]/30'
              : isDone
              ? 'border border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981]'
              : 'border border-transparent hover:border-zinc-700 hover:bg-zinc-800/60'
          }`}
        >
          <span
            className={
              isActive || isDone
                ? classifyMoveToken(move).isWideOrRotation
                  ? 'italic'
                  : ''
                : getMoveColorClasses(move, false, false)
            }
          >
            {move}
          </span>
        </button>
      );
    }

    return (
      <span
        key={globalIndex}
        ref={(el) => {
          tokenRefs.current[globalIndex] = el;
        }}
        className={`inline-flex shrink-0 items-center transition-colors ${tokenClasses}`}
      >
        {move}
      </span>
    );
  };

  return (
    <div
      ref={containerRef}
      translate="no"
      className={`font-mono tabular-nums leading-relaxed ${
        autoScroll
          ? 'no-scrollbar flex flex-nowrap items-center gap-1.5 overflow-x-auto scroll-smooth py-0.5 lg:flex-wrap lg:overflow-visible'
          : 'flex flex-wrap items-center gap-1'
      }`}
    >
      {segments.map((seg, idx) => {
        if (seg.type === 'trigger') {
          const triggerEnd = seg.startIndex + seg.moves.length - 1;
          const isTriggerActive =
            activeMoveIndex >= seg.startIndex && activeMoveIndex <= triggerEnd;

          return (
            <span
              key={idx}
              title={`Trigger: ${seg.triggerName}`}
              className={`inline-flex shrink-0 items-center gap-0.5 rounded-t border border-b-2 px-1.5 py-0.5 transition-colors ${
                isTriggerActive
                  ? 'border-[#38BDF8]/50 border-b-[#38BDF8] bg-[#181820]'
                  : 'border-[#27272D] border-b-zinc-500/80 bg-[#16161B]'
              } ${compact ? 'text-xs' : 'text-xs sm:text-[13px]'}`}
            >
              <span className="select-none text-zinc-500">(</span>
              <span className="inline-flex items-center gap-0.5">
                {seg.moves.map((m, mIdx) =>
                  renderMoveToken(m, seg.startIndex + mIdx)
                )}
              </span>
              <span className="select-none text-zinc-500">)</span>
            </span>
          );
        }

        return (
          <span
            key={idx}
            className={`inline-flex shrink-0 items-center gap-1 ${
              autoScroll ? 'flex-nowrap' : 'flex-wrap'
            } ${compact ? 'text-xs' : 'text-xs sm:text-[13px]'}`}
          >
            {seg.moves.map((m, mIdx) =>
              renderMoveToken(m, seg.startIndex + mIdx)
            )}
          </span>
        );
      })}
    </div>
  );
};
