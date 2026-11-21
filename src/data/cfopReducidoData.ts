import type { CfopCase } from '../types/cfop';

export const CFOP_REDUCIDO_VIDEO_URL =
  'https://www.youtube.com/watch?v=-5i7z_PJWy4';

export function buildYoutubeTimestampUrl(mmss: string): string {
  const [mStr, sStr] = mmss.split(':');
  const seconds = (Number(mStr) || 0) * 60 + (Number(sStr) || 0);
  return `${CFOP_REDUCIDO_VIDEO_URL}&t=${seconds}s`;
}

/**
 * Normaliza notación de guías informales (´, X/Y mayúsculas, espacios múltiples)
 * a notación WCA limpia 100% compatible con <twisty-player>.
 */
export function normalizeWcaAlg(raw: string): string {
  return raw
    .replace(/[´’`]/g, "'")
    .replace(/\bX('?|2?)\b/g, 'x$1')
    .replace(/\bY('?|2?)\b/g, 'y$1')
    .replace(/\bZ('?|2?)\b/g, 'z$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export const CFOP_REDUCIDO_CHAPTERS = [
  {
    label: 'OLL Reducido (7 casos)',
    timestamp: '01:36',
    url: buildYoutubeTimestampUrl('01:36'),
  },
  {
    label: 'Consejos Cruz (OLL)',
    timestamp: '06:41',
    url: buildYoutubeTimestampUrl('06:41'),
  },
  {
    label: 'PLL Reducido (8 casos)',
    timestamp: '08:34',
    url: buildYoutubeTimestampUrl('08:34'),
  },
] as const;

export const CFOP_REDUCIDO_SUBCATEGORIES: string[] = [
  'Todos',
  'OLL Reducido',
  'Consejos de Cruz (OLL)',
  'PLL Reducido - Esquinas',
  'PLL Reducido - Aristas',
  'PLL Reducido - Extra',
];

export const CFOP_REDUCIDO_CORE_IDS = new Set<string>([
  'red-oll-01',
  'red-oll-02',
  'red-oll-03',
  'red-oll-04',
  'red-oll-05',
  'red-oll-06',
  'red-oll-07',
  'red-cruz-01',
  'red-cruz-02',
  'red-pll-e1',
  'red-pll-e2',
  'red-pll-a1',
  'red-pll-a2',
  'red-pll-a3',
  'red-pll-a4',
]);

export const CFOP_REDUCIDO_CASES: CfopCase[] = [
  // ============================================================================
  // A. OLL REDUCIDO — 7 CASOS (01:36)
  // ============================================================================
  {
    id: 'red-oll-01',
    code: 'OLL #1',
    name: 'Sun (Sune)',
    stage: 'Reducido',
    visualStage: 'OLL',
    category: 'OLL Reducido',
    subcategory: 'OLL Reducido',
    sectionBadge: 'OLL',
    twoLook: true,
    alg: normalizeWcaAlg("R U R' U R U2 R'"),
    altAlgs: [],
    altAlgLabels: ['Sun (Sune)'],
    guideNote: 'OLL 27 · Base de orientación',
    videoTimestamp: '02:16',
    videoUrl: buildYoutubeTimestampUrl('02:16'),
    recognition:
      'Cruz amarilla armada + 1 esquina amarilla orientada adelante-izquierda (ULF) y el sticker frontal-derecho mirándote.',
    explanation:
      'El primer caso de OLL Reducido: saca el par (R U R\'), empuja U, vuelve a subir R y regresa con U2 R\'.',
    triggers: ['Sune'],
    tags: ['Cruz', 'Pez', 'OLL'],
    grip: 'Home grip',
    auf: 'Esquina orientada en adelante-izquierda (ULF)',
  },
  {
    id: 'red-oll-02',
    code: 'OLL #2',
    name: 'AntiSun (Antisune)',
    stage: 'Reducido',
    visualStage: 'OLL',
    category: 'OLL Reducido',
    subcategory: 'OLL Reducido',
    sectionBadge: 'OLL',
    twoLook: true,
    alg: normalizeWcaAlg("R U2 R' U' R U' R'"),
    altAlgs: [],
    altAlgLabels: ['AntiSun'],
    guideNote: 'OLL 26 · Inverso del Sun',
    videoTimestamp: '02:49',
    videoUrl: buildYoutubeTimestampUrl('02:49'),
    recognition:
      'Cruz amarilla armada + 1 esquina orientada atrás-derecha (UBR) con sticker amarillo en frente-izquierda (ULF).',
    explanation:
      'Inverso exacto del Sun: coloca la esquina orientada en atrás-derecha y ejecuta R U2 R\' U\' R U\' R\'.',
    triggers: ['Antisune'],
    tags: ['Cruz', 'Pez', 'OLL'],
    grip: 'Home grip',
    auf: 'Esquina orientada en atrás-derecha (UBR)',
  },
  {
    id: 'red-oll-03',
    code: 'OLL #3',
    name: 'Cruz con 4 esquinas en una dirección (H)',
    stage: 'Reducido',
    visualStage: 'OLL',
    category: 'OLL Reducido',
    subcategory: 'OLL Reducido',
    sectionBadge: 'OLL',
    twoLook: true,
    alg: normalizeWcaAlg("F R U R' U' R U R' U' R U R' U' F'"),
    altAlgs: ["R U R' U R U' R' U R U2 R'"],
    altAlg: "R U R' U R U' R' U R U2 R'",
    altAlgLabels: ["F (R U R' U')×3 F'", 'Alternativa 2-Gen'],
    guideNote: "F (R U R' U') ×3 F'",
    videoTimestamp: '03:28',
    videoUrl: buildYoutubeTimestampUrl('03:28'),
    recognition:
      'Cruz amarilla sin esquinas orientadas; dos pares de faros opuestos apuntando adelante y atrás.',
    explanation:
      'Súper fácil de memorizar: abre con F, repite 3 veces el Sexy Move (R U R\' U\') y cierra con F\'.',
    triggers: ['Sexy Move'],
    tags: ['Cruz', 'Faros', 'OLL'],
    grip: 'Home grip (faros al frente y atrás)',
    auf: 'Faros mirando al FRENTE (F) y ATRÁS (B)',
  },
  {
    id: 'red-oll-04',
    code: 'OLL #4',
    name: 'Cruz con 2 esquinas en una dirección y 2 en otra (Pi)',
    stage: 'Reducido',
    visualStage: 'OLL',
    category: 'OLL Reducido',
    subcategory: 'OLL Reducido',
    sectionBadge: 'OLL',
    twoLook: true,
    alg: normalizeWcaAlg("R U2 R2 U' R2 U' R2 U2 R"),
    altAlgs: [],
    altAlgLabels: ['Pi (2-Gen)'],
    guideNote: 'OLL 22 · Puro R y U',
    videoTimestamp: '04:05',
    videoUrl: buildYoutubeTimestampUrl('04:05'),
    recognition:
      'Cruz amarilla sin esquinas orientadas; dos faros a la IZQUIERDA (L) y dos stickers separados mirando hacia adelante y atrás a la derecha.',
    explanation:
      'Pon los faros a tu izquierda y fluye rápido en 2-gen alternando R2 y U\' entre los dos U2.',
    triggers: [],
    tags: ['Cruz', 'Faros', 'OLL'],
    grip: 'Home grip',
    auf: 'Faros a la IZQUIERDA (L)',
  },
  {
    id: 'red-oll-05',
    code: 'OLL #5',
    name: 'Hongo con patas (U / Headlights)',
    stage: 'Reducido',
    visualStage: 'OLL',
    category: 'OLL Reducido',
    subcategory: 'OLL Reducido',
    sectionBadge: 'OLL',
    twoLook: true,
    alg: normalizeWcaAlg("R2 D R' U2 R D' R' U2 R'"),
    altAlgs: [normalizeWcaAlg("R U R' U R U2 R' y R U2 R' U' R U' R'")],
    altAlg: normalizeWcaAlg("R U R' U R U2 R' y R U2 R' U' R U' R'"),
    altAlgLabels: ['2da forma (óptima)', 'SUN + ANTISUN'],
    guideNote: '2da forma (alt: SUN+ANTISUN)',
    videoTimestamp: '04:43',
    videoUrl: buildYoutubeTimestampUrl('04:43'),
    recognition:
      'Cruz amarilla + barra 1×3 atrás; las dos esquinas frontales forman faros mirando hacia ti ("patas del hongo").',
    explanation:
      'Algoritmo óptimo del video (2da forma) de 9 movimientos con D y D\'. Si estás empezando, en Alt 1 tienes la combinación SUN + y + ANTISUN.',
    triggers: ['Sune', 'Antisune'],
    tags: ['Cruz', 'Faros', 'OLL'],
    grip: 'Pulgar derecho abajo para R2',
    auf: 'Faros ("patas") mirando al FRENTE (F)',
  },
  {
    id: 'red-oll-06',
    code: 'OLL #6',
    name: 'Hongo sentado (T / Chameleon)',
    stage: 'Reducido',
    visualStage: 'OLL',
    category: 'OLL Reducido',
    subcategory: 'OLL Reducido',
    sectionBadge: 'OLL',
    twoLook: true,
    alg: normalizeWcaAlg("r U R' U' r' F R F'"),
    altAlgs: [],
    altAlgLabels: ['Hongo sentado'],
    guideNote: 'OLL 24 · Wide Sexy + r\' F R F\'',
    videoTimestamp: '05:44',
    videoUrl: buildYoutubeTimestampUrl('05:44'),
    recognition:
      'Cruz amarilla con las 2 esquinas derechas resueltas y las 2 izquierdas apuntando en sentidos opuestos (adelante y atrás).',
    explanation:
      '8 movimientos muy cómodos: haz el primer giro doble capa (r) en un Sexy Move y remata con r\' F R F\'.',
    triggers: ['Wide Sexy'],
    tags: ['Cruz', 'Opuestas', 'OLL'],
    grip: 'Home grip',
    auf: 'Esquinas desorientadas a la IZQUIERDA (L)',
  },
  {
    id: 'red-oll-07',
    code: 'OLL #7',
    name: 'Rombo / 8 (L / Bowtie)',
    stage: 'Reducido',
    visualStage: 'OLL',
    category: 'OLL Reducido',
    subcategory: 'OLL Reducido',
    sectionBadge: 'OLL',
    twoLook: true,
    alg: normalizeWcaAlg("F R' F' r U R U' r'"),
    altAlgs: ["F' r U R' U' r' F R"],
    altAlg: "F' r U R' U' r' F R",
    altAlgLabels: ['Rombo / 8 (Video)', 'Inverso desde ULF'],
    guideNote: 'OLL 25 · Hedgeslammer wide',
    videoTimestamp: '06:10',
    videoUrl: buildYoutubeTimestampUrl('06:10'),
    recognition:
      'Cruz amarilla con 2 esquinas orientadas en diagonal formando un 8 o rombo; sticker frontal-derecho mirándote.',
    explanation:
      '8 movimientos fluidos: inicia con F R\' F\', gira doble capa r y termina con U R U\' r\'.',
    triggers: [],
    tags: ['Cruz', 'Diagonal', 'OLL'],
    grip: 'Home grip',
    auf: 'Esquina orientada atrás-izquierda (UBL) y adelante-derecha (UFR)',
  },

  // ============================================================================
  // CONSEJOS PREVIOS PARA ARMAR LA CRUZ AMARILLA (OLL)
  // ============================================================================
  {
    id: 'red-cruz-01',
    code: 'CRUZ #1',
    name: 'Consejo para la "L" chiquita',
    stage: 'Reducido',
    visualStage: 'OLL',
    category: 'Consejos de Cruz (OLL)',
    subcategory: 'Consejos de Cruz (OLL)',
    sectionBadge: 'Consejos Cruz',
    twoLook: true,
    alg: normalizeWcaAlg("f R U R' U' f'"),
    altAlgs: [],
    altAlgLabels: ['L chiquita (f Sexy f\')'],
    guideNote: 'Wide f + Sexy Move + f\'',
    videoTimestamp: '06:41',
    videoUrl: buildYoutubeTimestampUrl('06:41'),
    recognition:
      'Solo 2 aristas adyacentes amarillas arriba formando una "L" pequeña (colócala adelante y a la derecha).',
    explanation:
      'En lugar de hacer 2 veces el algoritmo de la línea, gira las 2 capas frontales (f), haz un Sexy Move (R U R\' U\') y regresa f\'. Arma la cruz en 1 solo paso.',
    triggers: ['Sexy Move'],
    tags: ['Consejos Cruz', 'L-Shape'],
    grip: 'Home grip',
    auf: 'Aristas de la "L" apuntando al FRENTE y DERECHA',
  },
  {
    id: 'red-cruz-02',
    code: 'CRUZ #2',
    name: 'Consejo para el punto (Línea + L chiquita)',
    stage: 'Reducido',
    visualStage: 'OLL',
    category: 'Consejos de Cruz (OLL)',
    subcategory: 'Consejos de Cruz (OLL)',
    sectionBadge: 'Consejos Cruz',
    twoLook: true,
    alg: normalizeWcaAlg("F R U R' U' F' f R U R' U' f'"),
    altAlgs: ["F R U R' U' S R U R' U' f'"],
    altAlg: "F R U R' U' S R U R' U' f'",
    altAlgLabels: ['Línea + L chiquita', 'Atajo cancelado (S)'],
    guideNote: 'Línea (F Sexy F\') + L (f Sexy f\')',
    videoTimestamp: '07:40',
    videoUrl: buildYoutubeTimestampUrl('07:40'),
    recognition:
      'Ninguna arista amarilla arriba (solo el centro amarillo formando un punto).',
    explanation:
      'Encadena sin pausa el algoritmo de la línea (F R U R\' U\' F\') seguido del de la L chiquita (f R U R\' U\' f\') para obtener la cruz amarilla desde cualquier orientación.',
    triggers: ['Sexy Move'],
    tags: ['Consejos Cruz', 'Punto central'],
    grip: 'Home grip',
    auf: 'Cualquier orientación para armar la cruz',
  },

  // ============================================================================
  // B. PLL REDUCIDO — ESQUINAS (08:34)
  // ============================================================================
  {
    id: 'red-pll-e1',
    code: 'PLL E1',
    name: 'Esquinas sentido horario (Aa)',
    stage: 'Reducido',
    visualStage: 'PLL',
    category: 'PLL Reducido - Esquinas',
    subcategory: 'PLL Reducido - Esquinas',
    sectionBadge: 'PLL Esquinas',
    twoLook: true,
    alg: normalizeWcaAlg("x R' U R' D2 R U' R' D2 R2 x'"),
    altAlgs: [],
    altAlgLabels: ['Aa-Perm (Esquinas)'],
    guideNote: "x R' U R' D2 R U' R' D2 R2",
    videoTimestamp: '09:24',
    videoUrl: buildYoutubeTimestampUrl('09:24'),
    recognition:
      'Un par de faros (2 esquinas iguales) mirando hacia ATRÁS (cara B) y bloque 2×2 adelante-izquierda.',
    explanation:
      'Coloca los faros atrás, inclina el cubo con x (la cara blanca pasa al frente) y ejecuta R\' U R\' D2 R U\' R\' D2 R2 para resolver todas las esquinas.',
    triggers: [],
    tags: ['PLL Esquinas', 'Faros', 'Bloque 2×2'],
    grip: 'Inclinación x (amarillo queda atrás)',
    auf: 'Faros mirando hacia ATRÁS (B)',
  },
  {
    id: 'red-pll-e2',
    code: 'PLL E2',
    name: 'Cambio de esquinas horizontal / diagonal (E)',
    stage: 'Reducido',
    visualStage: 'PLL',
    category: 'PLL Reducido - Esquinas',
    subcategory: 'PLL Reducido - Esquinas',
    sectionBadge: 'PLL Esquinas',
    twoLook: true,
    alg: normalizeWcaAlg("x' R U' R' D R U R' D' R U R' D R U' R' D' x"),
    altAlgs: ["F R U' R' U' R U R' F' R U R' U' R' F R F'"],
    altAlg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    altAlgLabels: ['E-Perm (Video)', 'Alternativa Y-Perm'],
    guideNote: "x' (R U' R' D R U R' D') (R U R' D R U' R' D')",
    videoTimestamp: '10:16',
    videoUrl: buildYoutubeTimestampUrl('10:16'),
    recognition:
      'Cero faros en ninguna cara lateral (esquinas en intercambio diagonal/doble).',
    explanation:
      'Inclina x\' (la cara amarilla baja al frente) y alterna los bloques (R U\' R\' D) y (R U R\' D\'). Ideal cuando no encuentras ningún par de faros.',
    triggers: ['Insert (R U\' R\')', 'Insert (R U R\')'],
    tags: ['PLL Esquinas', 'Sin faros'],
    grip: "Inclinación x' (amarillo al frente)",
    auf: 'Cero faros; esquinas frontales opuestas',
  },

  // ============================================================================
  // B. PLL REDUCIDO — ARISTAS
  // ============================================================================
  {
    id: 'red-pll-a1',
    code: 'PLL A1',
    name: 'Aristas antihorario (Ua)',
    stage: 'Reducido',
    visualStage: 'PLL',
    category: 'PLL Reducido - Aristas',
    subcategory: 'PLL Reducido - Aristas',
    sectionBadge: 'PLL Aristas',
    twoLook: true,
    alg: normalizeWcaAlg("R2 U' R' U' R U R U R U' R"),
    altAlgs: ["M2 U M U2 M' U M2"],
    altAlg: "M2 U M U2 M' U M2",
    altAlgLabels: ['Ua-Perm <R, U> (Video)', 'Variante <M, U>'],
    guideNote: 'Barra resuelta atrás · 2-Gen',
    videoTimestamp: '11:25',
    videoUrl: buildYoutubeTimestampUrl('11:25'),
    recognition:
      'Una cara completamente resuelta (barra 1×3) atrás; las 3 aristas restantes rotan en sentido antihorario.',
    explanation:
      'Pon la cara resuelta ATRÁS (B) y ejecuta el algoritmo 100% <R, U> de JS cuber para ciclar las 3 aristas.',
    triggers: [],
    tags: ['PLL Aristas', 'Barra 1×3', 'Faros'],
    grip: 'Home grip',
    auf: 'Cara resuelta (barra 1×3) ATRÁS (B)',
  },
  {
    id: 'red-pll-a2',
    code: 'PLL A2',
    name: 'Aristas horario (Ub)',
    stage: 'Reducido',
    visualStage: 'PLL',
    category: 'PLL Reducido - Aristas',
    subcategory: 'PLL Reducido - Aristas',
    sectionBadge: 'PLL Aristas',
    twoLook: true,
    alg: normalizeWcaAlg("R' U R' U' R' U' R' U R U R2"),
    altAlgs: ["M2 U' M U2 M' U' M2"],
    altAlg: "M2 U' M U2 M' U' M2",
    altAlgLabels: ['Ub-Perm <R, U> (Video)', 'Variante <M, U>'],
    guideNote: 'Barra resuelta atrás · 2-Gen',
    videoTimestamp: '11:56',
    videoUrl: buildYoutubeTimestampUrl('11:56'),
    recognition:
      'Una cara completamente resuelta (barra 1×3) atrás; las 3 aristas restantes rotan en sentido horario.',
    explanation:
      'Inverso de Ua: pon la cara resuelta ATRÁS (B) y dispara R\' U R\' U\' R\' U\' R\' U R U R2.',
    triggers: [],
    tags: ['PLL Aristas', 'Barra 1×3', 'Faros'],
    grip: 'Home grip',
    auf: 'Cara resuelta (barra 1×3) ATRÁS (B)',
  },
  {
    id: 'red-pll-a3',
    code: 'PLL A3',
    name: 'Aristas opuestas (H)',
    stage: 'Reducido',
    visualStage: 'PLL',
    category: 'PLL Reducido - Aristas',
    subcategory: 'PLL Reducido - Aristas',
    sectionBadge: 'PLL Aristas',
    twoLook: true,
    alg: normalizeWcaAlg('M2 U M2 U2 M2 U M2'),
    altAlgs: ["M2 U' M2 U2 M2 U' M2"],
    altAlg: "M2 U' M2 U2 M2 U' M2",
    altAlgLabels: ['H-Perm (M2 U)', "Variante M2 U'"],
    guideNote: 'Simétrico · 7 movimientos',
    videoTimestamp: '12:27',
    videoUrl: buildYoutubeTimestampUrl('12:27'),
    recognition:
      'Las 4 esquinas resueltas (faros en los 4 lados) y cada arista tiene el color opuesto al de su cara.',
    explanation:
      'Intercambia frente ↔ atrás e izquierda ↔ derecha en 7 movimientos usando la capa central M2.',
    triggers: [],
    tags: ['PLL Aristas', 'Faros', 'Opuestas'],
    grip: 'Home grip (cualquier cara)',
    auf: 'Cualquier cara (simétrico 4 lados)',
  },
  {
    id: 'red-pll-a4',
    code: 'PLL A4',
    name: 'Cambio adyacente de aristas (Z)',
    stage: 'Reducido',
    visualStage: 'PLL',
    category: 'PLL Reducido - Aristas',
    subcategory: 'PLL Reducido - Aristas',
    sectionBadge: 'PLL Aristas',
    twoLook: true,
    alg: normalizeWcaAlg("M2 U M2 U M' U2 M2 U2 M'"),
    altAlgs: ["M' U' M2 U' M2 U' M' U2 M2"],
    altAlg: "M' U' M2 U' M2 U' M' U2 M2",
    altAlgLabels: ['Z-Perm (Video)', "Variante M' inicial"],
    guideNote: 'Frente ↔ Izquierda',
    videoTimestamp: '13:15',
    videoUrl: buildYoutubeTimestampUrl('13:15'),
    recognition:
      'Esquinas resueltas en las 4 caras; las aristas intercambian en pares adyacentes (frente ↔ izquierda y derecha ↔ atrás).',
    explanation:
      'Coloca un par de aristas a intercambiar entre FRENTE y la IZQUIERDA (o derecha en Alt 1) y ejecuta M2 U M2 U M\' U2 M2 U2 M\'.',
    triggers: [],
    tags: ['PLL Aristas', 'Faros'],
    grip: 'Home grip',
    auf: 'Intercambio entre FRENTE (F) e IZQUIERDA (L)',
  },

  // ============================================================================
  // B. PLL REDUCIDO — EXTRA (ESQUINAS + ARISTAS)
  // ============================================================================
  {
    id: 'red-pll-x1',
    code: 'PLL X1',
    name: 'Esquinas derecha y aristas horizontal (T-Perm)',
    stage: 'Reducido',
    visualStage: 'PLL',
    category: 'PLL Reducido - Extra',
    subcategory: 'PLL Reducido - Extra',
    sectionBadge: 'PLL Extra',
    twoLook: false,
    alg: normalizeWcaAlg("R U R' U' R' F R2 U' R' U' R U R' F'"),
    altAlgs: [],
    altAlgLabels: ['T-Perm (Bonus)'],
    guideNote: 'Extra · Resuelve esquinas en 1 paso',
    videoTimestamp: '14:11',
    videoUrl: buildYoutubeTimestampUrl('14:11'),
    recognition:
      'Faros a la izquierda (L) con bloques 2×1 en F y B; intercambia las 2 esquinas derechas y las aristas izquierda ↔ derecha.',
    explanation:
      'Algoritmo bonus del video: Sexy Move + R\' F R2 U\' R\' U\' + R U R\' F\'. Además sirve como reemplazo sin rotaciones de Aa para esquinas en 2-Look PLL.',
    triggers: ['Sexy Move', 'Insert (R U R\')'],
    tags: ['PLL Extra', 'Faros'],
    grip: 'Home grip',
    auf: 'Faros a la IZQUIERDA (L)',
  },
  {
    id: 'red-pll-x2',
    code: 'PLL X2',
    name: 'Cruz / permutación tipo Y (Y-Perm)',
    stage: 'Reducido',
    visualStage: 'PLL',
    category: 'PLL Reducido - Extra',
    subcategory: 'PLL Reducido - Extra',
    sectionBadge: 'PLL Extra',
    twoLook: false,
    alg: normalizeWcaAlg("F R U' R' U' R U R' F' R U R' U' R' F R F'"),
    altAlgs: [],
    altAlgLabels: ['Y-Perm (Bonus)'],
    guideNote: 'Extra · Sin rotaciones (alt a E)',
    videoTimestamp: '14:33',
    videoUrl: buildYoutubeTimestampUrl('14:33'),
    recognition:
      'Cero faros; dos bloques 2×1 convergen adelante-izquierda (ULF) e intercambia esquinas en diagonal.',
    explanation:
      'Algoritmo bonus del video: (F R U\' R\' U\' R U R\' F\') + Sexy Move + Sledgehammer. Reemplaza a E-Perm sin necesidad de inclinar el cubo.',
    triggers: ['Insert (R U\' R\')', 'Insert (R U R\')', 'Sexy Move', 'Sledgehammer'],
    tags: ['PLL Extra', 'Sin faros', 'Diagonal'],
    grip: 'Home grip',
    auf: 'Bloque 2×2 adelante-izquierda (ULF)',
  },
];
