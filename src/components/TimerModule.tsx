import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

type TimerPhase = 'idle' | 'countdown' | 'ready' | 'running' | 'stopped';

const COUNTDOWN_STEP_MS = 350;

const SCRAMBLE_FACES = ['R', 'L', 'U', 'D', 'F', 'B'] as const;
const SCRAMBLE_AXIS: Record<string, number> = {
  R: 0,
  L: 0,
  U: 1,
  D: 1,
  F: 2,
  B: 2,
};
const SCRAMBLE_MODS = ['', "'", '2'] as const;

function generateWcaScramble(length = 20): string {
  const moves: string[] = [];
  let prevFace = '';
  let prevAxis = -1;
  let prevPrevAxis = -1;

  while (moves.length < length) {
    const face =
      SCRAMBLE_FACES[Math.floor(Math.random() * SCRAMBLE_FACES.length)];
    const axis = SCRAMBLE_AXIS[face];
    if (face === prevFace) continue;
    if (axis === prevAxis && axis === prevPrevAxis) continue;

    const mod = SCRAMBLE_MODS[Math.floor(Math.random() * SCRAMBLE_MODS.length)];
    moves.push(`${face}${mod}`);
    prevPrevAxis = prevAxis;
    prevAxis = axis;
    prevFace = face;
  }

  return moves.join(' ');
}

function formatTimerMs(ms: number): string {
  const safeMs = Math.max(0, ms);
  const totalCentis = Math.floor(safeMs / 10);
  const centis = totalCentis % 100;
  const totalSeconds = Math.floor(totalCentis / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  const cc = String(centis).padStart(2, '0');
  if (minutes > 0) {
    const ss = String(seconds).padStart(2, '0');
    return `${minutes}:${ss}.${cc}`;
  }
  return `${seconds}.${cc}`;
}

/**
 * Cronómetro WCA a pantalla completa (100% en memoria, cero localStorage/sessionStorage/BD).
 * Flujo exacto: Mantener presionado -> 3, 2, 1 (rojo) -> 0 (verde, fijo mientras siga presionado)
 * -> Soltar -> Corre con performance.now() + requestAnimationFrame -> Pulsar/Tocar -> Detiene.
 */
export const TimerModule: React.FC = () => {
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [countdownValue, setCountdownValue] = useState<3 | 2 | 1>(3);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [scramble, setScramble] = useState<string>(() => generateWcaScramble());

  const phaseRef = useRef<TimerPhase>('idle');
  const elapsedMsRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const countdownTimersRef = useRef<number[]>([]);
  const justStoppedRef = useRef<boolean>(false);
  const touchActiveRef = useRef<boolean>(false);
  const touchResetTimerRef = useRef<number | null>(null);
  const mouseHoldingRef = useRef<boolean>(false);

  const syncPhase = useCallback((next: TimerPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const clearCountdownTimers = useCallback(() => {
    for (const id of countdownTimersRef.current) {
      window.clearTimeout(id);
    }
    countdownTimersRef.current = [];
  }, []);

  const stopRaf = useCallback(() => {
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const startRunning = useCallback(() => {
    clearCountdownTimers();
    stopRaf();
    startTimeRef.current = performance.now();
    elapsedMsRef.current = 0;
    setElapsedMs(0);
    syncPhase('running');
    triggerHaptic('light');

    const tick = () => {
      if (phaseRef.current !== 'running') return;
      const nowElapsed = performance.now() - startTimeRef.current;
      elapsedMsRef.current = nowElapsed;
      setElapsedMs(nowElapsed);
      rafIdRef.current = window.requestAnimationFrame(tick);
    };
    rafIdRef.current = window.requestAnimationFrame(tick);
  }, [clearCountdownTimers, stopRaf, syncPhase]);

  const stopRunning = useCallback(() => {
    if (phaseRef.current !== 'running') return;
    const finalMs = performance.now() - startTimeRef.current;
    stopRaf();
    elapsedMsRef.current = finalMs;
    setElapsedMs(finalMs);
    justStoppedRef.current = true;
    syncPhase('stopped');
    setScramble(generateWcaScramble());
    triggerHaptic('success');
  }, [stopRaf, syncPhase]);

  const beginHold = useCallback(() => {
    if (phaseRef.current === 'running') {
      stopRunning();
      return;
    }
    if (justStoppedRef.current) return;
    if (phaseRef.current === 'countdown' || phaseRef.current === 'ready') return;

    clearCountdownTimers();
    setCountdownValue(3);
    syncPhase('countdown');
    triggerHaptic('light');

    const t2 = window.setTimeout(() => {
      if (phaseRef.current !== 'countdown') return;
      setCountdownValue(2);
      triggerHaptic('light');
    }, COUNTDOWN_STEP_MS);

    const t1 = window.setTimeout(() => {
      if (phaseRef.current !== 'countdown') return;
      setCountdownValue(1);
      triggerHaptic('light');
    }, COUNTDOWN_STEP_MS * 2);

    const tReady = window.setTimeout(() => {
      if (phaseRef.current !== 'countdown') return;
      clearCountdownTimers();
      syncPhase('ready');
      triggerHaptic('medium');
    }, COUNTDOWN_STEP_MS * 3);

    countdownTimersRef.current = [t2, t1, tReady];
  }, [clearCountdownTimers, stopRunning, syncPhase]);

  const endHold = useCallback(() => {
    if (justStoppedRef.current) {
      justStoppedRef.current = false;
      return;
    }

    if (phaseRef.current === 'ready') {
      startRunning();
      return;
    }

    if (phaseRef.current === 'countdown') {
      clearCountdownTimers();
      syncPhase(elapsedMsRef.current > 0 ? 'stopped' : 'idle');
    }
  }, [clearCountdownTimers, startRunning, syncPhase]);

  const handleReset = useCallback(() => {
    if (phaseRef.current === 'running') return;
    clearCountdownTimers();
    stopRaf();
    justStoppedRef.current = false;
    elapsedMsRef.current = 0;
    setElapsedMs(0);
    syncPhase('idle');
    triggerHaptic('light');
  }, [clearCountdownTimers, stopRaf, syncPhase]);

  const handleRefreshScramble = useCallback(() => {
    if (phaseRef.current === 'running') return;
    setScramble(generateWcaScramble());
    triggerHaptic('selection');
  }, []);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      clearCountdownTimers();
      stopRaf();
      if (touchResetTimerRef.current !== null) {
        window.clearTimeout(touchResetTimerRef.current);
      }
    };
  }, [clearCountdownTimers, stopRaf]);

  // Controles de teclado en PC: Espacio (mantener/soltar/parar), cualquier tecla para detener, R/Esc para reiniciar
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (phaseRef.current === 'running') {
        e.preventDefault();
        stopRunning();
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (e.repeat) return;
        beginHold();
        return;
      }

      if (
        (e.key === 'r' || e.key === 'R' || e.key === 'Escape') &&
        phaseRef.current === 'stopped' &&
        !e.repeat
      ) {
        e.preventDefault();
        handleReset();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (justStoppedRef.current) {
        justStoppedRef.current = false;
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        endHold();
      }
    };

    const onBlur = () => {
      mouseHoldingRef.current = false;
      justStoppedRef.current = false;
      if (phaseRef.current === 'countdown' || phaseRef.current === 'ready') {
        clearCountdownTimers();
        syncPhase(elapsedMsRef.current > 0 ? 'stopped' : 'idle');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [beginHold, clearCountdownTimers, endHold, handleReset, stopRunning, syncPhase]);

  // Handlers táctiles (móvil)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchActiveRef.current = true;
    if (touchResetTimerRef.current !== null) {
      window.clearTimeout(touchResetTimerRef.current);
      touchResetTimerRef.current = null;
    }

    if (phaseRef.current === 'running') {
      stopRunning();
      return;
    }

    if (e.touches.length === 1) {
      beginHold();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) {
      endHold();
      touchResetTimerRef.current = window.setTimeout(() => {
        touchActiveRef.current = false;
      }, 450);
    }
  };

  const handleTouchCancel = () => {
    justStoppedRef.current = false;
    clearCountdownTimers();
    if (phaseRef.current === 'countdown' || phaseRef.current === 'ready') {
      syncPhase(elapsedMsRef.current > 0 ? 'stopped' : 'idle');
    }
    touchResetTimerRef.current = window.setTimeout(() => {
      touchActiveRef.current = false;
    }, 450);
  };

  // Soporte opcional de clic mantenido en escritorio (ignorado en dispositivos táctiles)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (touchActiveRef.current || e.button !== 0) return;
    mouseHoldingRef.current = true;
    beginHold();
  };

  const handleMouseUp = () => {
    if (touchActiveRef.current || !mouseHoldingRef.current) return;
    mouseHoldingRef.current = false;
    endHold();
  };

  const handleMouseLeave = () => {
    if (!mouseHoldingRef.current) return;
    mouseHoldingRef.current = false;
    if (phaseRef.current === 'countdown' || phaseRef.current === 'ready') {
      clearCountdownTimers();
      syncPhase(elapsedMsRef.current > 0 ? 'stopped' : 'idle');
    }
  };

  const isRunning = phase === 'running';
  const isCountdown = phase === 'countdown';
  const isReady = phase === 'ready';
  const isStopped = phase === 'stopped';

  const mainDisplay = isCountdown
    ? String(countdownValue)
    : isReady
    ? '0'
    : formatTimerMs(elapsedMs);

  const mainColorClass = isCountdown
    ? 'text-[#EF4444]'
    : isReady
    ? 'text-[#10B981]'
    : 'text-[#FAFAFA]';

  const statusMeta = isCountdown
    ? {
        dot: 'bg-[#EF4444]',
        badge: 'CONTEO',
        caption: 'Sigue manteniendo presionado hasta llegar a 0…',
      }
    : isReady
    ? {
        dot: 'bg-[#10B981]',
        badge: 'LISTO · 0.00',
        caption: 'Suelta ahora para arrancar el cronómetro',
      }
    : isRunning
    ? {
        dot: 'bg-[#FAFAFA]',
        badge: 'CORRIENDO',
        caption: 'Presiona cualquier tecla o toca la pantalla para detener',
      }
    : isStopped
    ? {
        dot: 'bg-[#3B82F6]',
        badge: 'TIEMPO FINAL',
        caption: 'Mantén Espacio o la pantalla para el siguiente intento',
      }
    : {
        dot: 'bg-zinc-500',
        badge: 'EN ESPERA',
        caption: 'Mantén presionado Espacio o toca la pantalla',
      };

  const stopBubble = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <section
      aria-label="Cronómetro de speedcubing"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`timer-surface h-timer-viewport relative flex w-full flex-col justify-between overflow-hidden px-4 py-5 transition-colors sm:px-8 sm:py-8 ${
        isReady
          ? 'bg-[#10B981]/[0.03]'
          : isCountdown
          ? 'bg-[#EF4444]/[0.03]'
          : 'bg-transparent'
      }`}
    >
      {/* Zona superior: Scramble WCA en memoria (se desvanece durante el solve) */}
      <div
        className={`mx-auto flex w-full max-w-2xl flex-col items-center gap-2 transition-opacity duration-150 ${
          isRunning ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <div className="inline-flex items-center gap-2 rounded-md border border-[#222226] bg-[#111113] px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} />
          <span>{statusMeta.badge}</span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-500">SESIÓN EN MEMORIA</span>
        </div>

        <div
          onTouchStart={stopBubble}
          onTouchEnd={stopBubble}
          onMouseDown={stopBubble}
          onMouseUp={stopBubble}
          className="flex max-w-full items-center gap-2 rounded-lg border border-[#222226] bg-[#111113]/90 px-3 py-2"
        >
          <p
            translate="no"
            className="text-center font-mono text-xs leading-relaxed tracking-wide text-zinc-300 tabular-nums sm:text-sm"
          >
            {scramble}
          </p>
          <button
            type="button"
            onClick={handleRefreshScramble}
            aria-label="Nuevo scramble"
            title="Generar nuevo scramble WCA"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#222226] bg-[#09090B] text-zinc-400 transition-colors hover:border-zinc-700 hover:text-[#FAFAFA]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Centro: Reloj gigante de precisión con tabular-nums */}
      <div className="my-auto flex flex-col items-center justify-center py-6 text-center">
        <div
          translate="no"
          aria-live={isRunning ? 'off' : 'polite'}
          className={`font-mono text-[clamp(4.75rem,20vw,10.5rem)] font-semibold leading-none tracking-tight tabular-nums transition-colors duration-100 ${mainColorClass}`}
        >
          {mainDisplay}
        </div>

        {/* Indicador visual discreto de pasos 3 -> 2 -> 1 -> 0 */}
        <div
          aria-hidden="true"
          className={`mt-5 flex items-center gap-2 transition-opacity duration-150 ${
            isRunning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {[3, 2, 1].map((step) => {
            const passed = isReady || (isCountdown && countdownValue <= step);
            return (
              <span
                key={step}
                className={`h-1.5 w-7 rounded-full transition-colors duration-100 ${
                  isReady
                    ? 'bg-[#10B981]'
                    : passed
                    ? 'bg-[#EF4444]'
                    : 'bg-zinc-800'
                }`}
              />
            );
          })}
          <span
            className={`h-1.5 w-7 rounded-full transition-colors duration-100 ${
              isReady ? 'bg-[#10B981]' : 'bg-zinc-800'
            }`}
          />
        </div>

        <p
          className={`mt-4 font-mono text-xs sm:text-sm ${
            isReady
              ? 'font-medium text-[#10B981]'
              : isCountdown
              ? 'font-medium text-[#EF4444]'
              : 'text-zinc-500'
          }`}
        >
          {statusMeta.caption}
        </p>

        {/* Botón rápido de reinicio en memoria cuando está detenido */}
        <div
          onTouchStart={stopBubble}
          onTouchEnd={stopBubble}
          onMouseDown={stopBubble}
          onMouseUp={stopBubble}
          className={`mt-5 min-h-[2.5rem] transition-opacity duration-150 ${
            isStopped ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <button
            type="button"
            onClick={handleReset}
            tabIndex={isStopped ? 0 : -1}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#222226] bg-[#111113] px-3.5 font-mono text-xs text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-[#16161A] hover:text-[#FAFAFA]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reiniciar a 0.00</span>
            <kbd className="hidden rounded border border-zinc-800 bg-[#09090B] px-1.5 py-0.5 text-[10px] text-zinc-400 lg:inline">
              R
            </kbd>
          </button>
        </div>
      </div>

      {/* Zona inferior: Indicaciones discretas de uso (PC vs Móvil) */}
      <div
        className={`mx-auto flex w-full max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center font-mono text-[11px] text-zinc-500 transition-opacity duration-150 ${
          isRunning ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        {/* Indicaciones Desktop */}
        <div className="hidden flex-wrap items-center justify-center gap-4 lg:flex">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded border border-zinc-800 bg-[#111113] px-2 py-0.5 text-[10px] text-zinc-300">
              Espacio
            </kbd>
            <span>Mantener (3 → 2 → 1 → 0 verde)</span>
          </span>
          <span className="text-zinc-800">|</span>
          <span>Soltar en 0 verde para iniciar</span>
          <span className="text-zinc-800">|</span>
          <span>Cualquier tecla para detener</span>
        </div>

        {/* Indicaciones Móvil */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 lg:hidden">
          <span>Mantén tocada la pantalla (3 → 2 → 1 → 0)</span>
          <span className="text-zinc-700">·</span>
          <span>Suelta en verde</span>
          <span className="text-zinc-700">·</span>
          <span>Toca para parar</span>
        </div>
      </div>
    </section>
  );
};
