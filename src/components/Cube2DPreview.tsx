import React, { useMemo } from 'react';
import type { LearningStage } from '../types/cfop';
import {
  simulateCasePreState,
  type StickerCell,
} from '../utils/cubeSimulator';

interface Cube2DPreviewProps {
  alg: string;
  stage: LearningStage;
}

function quadPoints(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  inset = 0.1
): string {
  const cx = (p0[0] + p1[0] + p2[0] + p3[0]) / 4;
  const cy = (p0[1] + p1[1] + p2[1] + p3[1]) / 4;
  const shrink = ([x, y]: [number, number]) =>
    `${(x + (cx - x) * inset).toFixed(1)},${(y + (cy - y) * inset).toFixed(1)}`;
  return `${shrink(p0)} ${shrink(p1)} ${shrink(p2)} ${shrink(p3)}`;
}

/**
 * Diagrama técnico 100% SVG nativo de React (CERO <twisty-player>, CERO WebGL).
 */
export const Cube2DPreview: React.FC<Cube2DPreviewProps> = React.memo(
  ({ alg, stage }) => {
    const sim = useMemo(() => simulateCasePreState(alg, stage), [alg, stage]);
    const isLastLayer = stage === 'OLL' || stage === 'PLL';

    if (isLastLayer) {
      const cellSize = 18;
      const gap = 2.5;
      const gridStart = 20;
      const barThick = 5.5;
      const barInset = 1.5;

      const renderTopCell = (cell: StickerCell, r: number, c: number) => {
        const x = gridStart + c * (cellSize + gap);
        const y = gridStart + r * (cellSize + gap);
        return (
          <rect
            key={`u-${r}-${c}`}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            rx={2}
            fill={cell.color}
            stroke="#09090B"
            strokeWidth={1.1}
          />
        );
      };

      return (
        <div
          aria-hidden="true"
          className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#222226] bg-[#09090B] p-1.5 sm:h-20 sm:w-20"
        >
          <svg
            viewBox="0 0 98 98"
            className="h-full w-full select-none"
            role="img"
          >
            <rect
              x={16}
              y={16}
              width={66}
              height={66}
              rx={4}
              fill="#111113"
              stroke="#222226"
              strokeWidth={1}
            />

            {sim.backTopRow.map((cell, c) => (
              <rect
                key={`b-${c}`}
                x={gridStart + c * (cellSize + gap) + barInset}
                y={gridStart - barThick - 3.5}
                width={cellSize - barInset * 2}
                height={barThick}
                rx={1.5}
                fill={cell.color}
              />
            ))}

            {sim.frontTopRow.map((cell, c) => (
              <rect
                key={`f-${c}`}
                x={gridStart + c * (cellSize + gap) + barInset}
                y={gridStart + 3 * cellSize + 2 * gap + 3.5}
                width={cellSize - barInset * 2}
                height={barThick}
                rx={1.5}
                fill={cell.color}
              />
            ))}

            {sim.leftTopRow.map((cell, r) => (
              <rect
                key={`l-${r}`}
                x={gridStart - barThick - 3.5}
                y={gridStart + r * (cellSize + gap) + barInset}
                width={barThick}
                height={cellSize - barInset * 2}
                rx={1.5}
                fill={cell.color}
              />
            ))}

            {sim.rightTopRow.map((cell, r) => (
              <rect
                key={`r-${r}`}
                x={gridStart + 3 * cellSize + 2 * gap + 3.5}
                y={gridStart + r * (cellSize + gap) + barInset}
                width={barThick}
                height={cellSize - barInset * 2}
                rx={1.5}
                fill={cell.color}
              />
            ))}

            {sim.topGrid.map((row, r) =>
              row.map((cell, c) => renderTopCell(cell, r, c))
            )}
          </svg>
        </div>
      );
    }

    const eR: [number, number] = [12.5, 7.2];
    const eB: [number, number] = [12.5, -7.2];
    const eD: [number, number] = [0, 14.2];

    const ubl: [number, number] = [50, 7.5];
    const ulf: [number, number] = [
      ubl[0] - 3 * eB[0],
      ubl[1] - 3 * eB[1],
    ];
    const ufr: [number, number] = [50, 50.7];

    const ptU = (r: number, c: number): [number, number] => [
      ubl[0] + c * eR[0] - r * eB[0],
      ubl[1] + c * eR[1] - r * eB[1],
    ];

    const ptF = (r: number, c: number): [number, number] => [
      ulf[0] + c * eR[0] + r * eD[0],
      ulf[1] + c * eR[1] + r * eD[1],
    ];

    const ptR = (r: number, c: number): [number, number] => [
      ufr[0] + c * eB[0] + r * eD[0],
      ufr[1] + c * eB[1] + r * eD[1],
    ];

    return (
      <div
        aria-hidden="true"
        className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#222226] bg-[#09090B] p-1 sm:h-20 sm:w-20"
      >
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full select-none"
          role="img"
        >
          <polygon
            points={`${ubl[0]},${ubl[1]} ${ubl[0] + 3 * eR[0]},${ubl[1] + 3 * eR[1]} ${ubl[0] + 3 * eR[0]},${ubl[1] + 3 * eR[1] + 3 * eD[1]} ${ufr[0]},${ufr[1] + 3 * eD[1]} ${ulf[0]},${ulf[1] + 3 * eD[1]} ${ulf[0]},${ulf[1]}`}
            fill="#09090B"
            stroke="#222226"
            strokeWidth={1.4}
            strokeLinejoin="round"
          />

          {sim.topGrid.map((row, r) =>
            row.map((cell, c) => (
              <polygon
                key={`iso-u-${r}-${c}`}
                points={quadPoints(
                  ptU(r, c),
                  ptU(r, c + 1),
                  ptU(r + 1, c + 1),
                  ptU(r + 1, c),
                  0.12
                )}
                fill={cell.color}
                stroke="#09090B"
                strokeWidth={0.8}
                strokeLinejoin="round"
              />
            ))
          )}

          {sim.frontGrid.map((row, r) =>
            row.map((cell, c) => (
              <polygon
                key={`iso-f-${r}-${c}`}
                points={quadPoints(
                  ptF(r, c),
                  ptF(r, c + 1),
                  ptF(r + 1, c + 1),
                  ptF(r + 1, c),
                  0.12
                )}
                fill={cell.color}
                stroke="#09090B"
                strokeWidth={0.8}
                strokeLinejoin="round"
              />
            ))
          )}

          {sim.rightGrid.map((row, r) =>
            row.map((cell, c) => (
              <polygon
                key={`iso-r-${r}-${c}`}
                points={quadPoints(
                  ptR(r, c),
                  ptR(r, c + 1),
                  ptR(r + 1, c + 1),
                  ptR(r + 1, c),
                  0.12
                )}
                fill={cell.color}
                stroke="#09090B"
                strokeWidth={0.8}
                strokeLinejoin="round"
              />
            ))
          )}
        </svg>
      </div>
    );
  }
);

Cube2DPreview.displayName = 'Cube2DPreview';
