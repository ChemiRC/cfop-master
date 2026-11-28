import { useCallback, useState } from 'react';
import type { CaseMastery } from '../types/cfop';
import { triggerHaptic } from '../utils/haptics';

const MASTERY_STORAGE_KEY = 'cfop_case_mastery_v1';
const LEGACY_REDUCIDO_KEY = 'cfop_reducido_learned';

function isValidMastery(value: unknown): value is CaseMastery {
  return value === 'unlearned' || value === 'practicing' || value === 'mastered';
}

function loadInitialMastery(): Record<string, CaseMastery> {
  if (typeof window === 'undefined' || !window.localStorage) return {};

  const map: Record<string, CaseMastery> = {};
  let migrated = false;

  try {
    const raw = window.localStorage.getItem(MASTERY_STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof k === 'string' && isValidMastery(v) && v !== 'unlearned') {
            map[k] = v;
          }
        }
      }
    }
  } catch {
    // Ignore corrupted storage
  }

  // Migración no destructiva desde la clave previa de CFOP Reducido
  try {
    const legacyRaw = window.localStorage.getItem(LEGACY_REDUCIDO_KEY);
    if (legacyRaw) {
      const parsed: unknown = JSON.parse(legacyRaw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (typeof item === 'string' && !(item in map)) {
            map[item] = 'mastered';
            migrated = true;
          }
        }
      }
    }
  } catch {
    // Ignore corrupted legacy storage
  }

  if (migrated) {
    try {
      window.localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // Ignore storage quota errors
    }
  }

  return map;
}

function persistMastery(map: Record<string, CaseMastery>): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(map));
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function getNextMasteryState(current: CaseMastery): CaseMastery {
  if (current === 'unlearned') return 'practicing';
  if (current === 'practicing') return 'mastered';
  return 'unlearned';
}

export function useCaseMastery() {
  const [masteryMap, setMasteryMap] =
    useState<Record<string, CaseMastery>>(loadInitialMastery);

  const getMastery = useCallback(
    (id: string): CaseMastery => masteryMap[id] ?? 'unlearned',
    [masteryMap]
  );

  const setMastery = useCallback((id: string, status: CaseMastery) => {
    setMasteryMap((prev) => {
      const current = prev[id] ?? 'unlearned';
      if (current === status) return prev;
      const next = { ...prev };
      if (status === 'unlearned') {
        delete next[id];
      } else {
        next[id] = status;
      }
      persistMastery(next);
      return next;
    });
  }, []);

  const cycleMastery = useCallback(
    (id: string): CaseMastery => {
      const current = masteryMap[id] ?? 'unlearned';
      const nextStatus = getNextMasteryState(current);
      if (nextStatus === 'mastered') {
        triggerHaptic('success');
      } else if (nextStatus === 'practicing') {
        triggerHaptic('selection');
      } else {
        triggerHaptic('light');
      }
      setMastery(id, nextStatus);
      return nextStatus;
    },
    [masteryMap, setMastery]
  );

  return {
    masteryMap,
    getMastery,
    setMastery,
    cycleMastery,
  };
}
