import React, { useMemo } from 'react';
import { segmentAlgWithTriggers } from '../utils/algHelpers';

interface AlgNotationBadgesProps {
  alg: string;
  compact?: boolean;
}

/**
 * Renderiza notación WCA en font-mono tabular-nums agrupando triggers entre paréntesis
 * dentro de píldoras técnicas discretas para lectura rápida de fingertricks.
 */
export const AlgNotationBadges: React.FC<AlgNotationBadgesProps> = ({
  alg,
  compact = false,
}) => {
  const segments = useMemo(() => segmentAlgWithTriggers(alg), [alg]);

  return (
    <div
      translate="no"
      className="flex flex-wrap items-center gap-1 font-mono tabular-nums leading-relaxed"
    >
      {segments.map((seg, idx) => {
        if (seg.type === 'trigger') {
          return (
            <span
              key={idx}
              title={`Trigger: ${seg.triggerName}`}
              className={`inline-flex items-center rounded border border-[#2A2A30] bg-[#18181C] px-1.5 py-0.5 font-medium tracking-tight text-[#FAFAFA] ${
                compact ? 'text-xs' : 'text-xs sm:text-[13px]'
              }`}
            >
              <span className="text-zinc-500">(</span>
              <span className="px-0.5">{seg.moves.join(' ')}</span>
              <span className="text-zinc-500">)</span>
            </span>
          );
        }

        return (
          <span
            key={idx}
            className={`inline-flex flex-wrap items-center gap-1 text-zinc-400 ${
              compact ? 'text-xs' : 'text-xs sm:text-[13px]'
            }`}
          >
            {seg.moves.map((m, mIdx) => (
              <span key={mIdx} className="px-0.5 font-normal text-zinc-300">
                {m}
              </span>
            ))}
          </span>
        );
      })}
    </div>
  );
};
