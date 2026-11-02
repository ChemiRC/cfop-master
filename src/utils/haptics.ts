/**
 * Utilidad de feedback táctil (Web Haptics) para dispositivos compatibles.
 * Totalmente seguro: no produce errores en navegadores de escritorio ni en WebKit sin API.
 */
export type HapticType = 'light' | 'medium' | 'selection' | 'success';

export function triggerHaptic(type: HapticType = 'light'): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      switch (type) {
        case 'selection':
        case 'light':
          navigator.vibrate(6);
          break;
        case 'medium':
          navigator.vibrate(14);
          break;
        case 'success':
          navigator.vibrate([8, 30, 12]);
          break;
      }
    }
  } catch {
    // Silently ignore if permission is restricted or unsupported
  }
}
