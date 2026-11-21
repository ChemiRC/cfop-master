import type { CfopCase } from '../types/cfop';

export const PLL_SUBCATEGORIES: string[] = [
  'Todos',
  'Solo Aristas',
  'Solo Esquinas',
  'Intercambio Adyacente',
  'Intercambio Diagonal',
];

export const TWO_LOOK_PLL_IDS = new Set<string>([
  'pll-t',
  'pll-y',
  'pll-ua',
  'pll-ub',
  'pll-h',
  'pll-z',
]);

export const PLL_CASES: CfopCase[] = [
  // ============================================================================
  // 1. SOLO ARISTAS (4 Casos: Ua, Ub, H, Z)
  // ============================================================================
  {
    id: 'pll-ua',
    code: 'PLL Ua',
    name: 'Ua-Perm (Ciclo de 3 Aristas Antihorario)',
    stage: 'PLL',
    category: 'Solo Aristas',
    subcategory: 'Solo Aristas',
    twoLook: true,
    alg: "y2 M2 U M U2 M' U M2",
    altAlgs: [
      "R U R' U R' U' R2 U' R' U R' U R",
      "y R2 U' S' U2 S U' R2",
    ],
    altAlg: "R U R' U R' U' R2 U' R' U R' U R",
    setup: "M2' U' M' U2' M U' M2'",
    recognition:
      'Barra 1×3 resuelta al frente (o atrás tras y2) y faros en las otras 3 caras; las 3 aristas rotan en sentido antihorario.',
    explanation:
      '[Top 1 SpeedCubeDB · 2-Look PLL] Versión ultrarrápida <M, U> con la barra atrás tras y2. Si prefieres no usar slices M, cambia a la alternativa <R, U>.',
    triggers: [],
    tags: ['2-Look PLL', 'Barra 1×3', 'Faros'],
    grip: 'Home grip (M2 con anular + medio)',
    auf: 'Barra 1×3 al frente antes de y2 (o atrás sin y2)',
  },
  {
    id: 'pll-ub',
    code: 'PLL Ub',
    name: 'Ub-Perm (Ciclo de 3 Aristas Horario)',
    stage: 'PLL',
    category: 'Solo Aristas',
    subcategory: 'Solo Aristas',
    twoLook: true,
    alg: "y2 M2 U' M U2 M' U' M2",
    altAlgs: [
      "R' U R' U' R' U' R' U R U R2",
      "R2 U R U R' U' R' U' R' U R'",
    ],
    altAlg: "R' U R' U' R' U' R' U R U R2",
    setup: "M2' U M' U2' M U M2'",
    recognition:
      'Barra 1×3 resuelta al frente (o atrás tras y2) y faros en las otras 3 caras; las 3 aristas rotan en sentido horario.',
    explanation:
      '[Top 1 SpeedCubeDB · 2-Look PLL] Espejo exacto de Ua-Perm en <M, U>. Incluye las dos variantes clásicas 2-gen <R, U> en alternativas.',
    triggers: [],
    tags: ['2-Look PLL', 'Barra 1×3', 'Faros'],
    grip: 'Home grip (M2 con anular + medio)',
    auf: 'Barra 1×3 al frente antes de y2 (o atrás sin y2)',
  },
  {
    id: 'pll-h',
    code: 'PLL H',
    name: 'H-Perm (Intercambio de Aristas Opuestas)',
    stage: 'PLL',
    category: 'Solo Aristas',
    subcategory: 'Solo Aristas',
    twoLook: true,
    alg: 'M2 U M2 U2 M2 U M2',
    altAlgs: [
      "M2 U' M2 U2 M2 U' M2",
      "R2 S2 R2 U' R2 S2 R2",
    ],
    altAlg: "M2 U' M2 U2 M2 U' M2",
    setup: "M2' U' M2' U2' M2' U' M2'",
    recognition:
      'Faros en las 4 caras; cada arista central muestra el color opuesto al de sus esquinas.',
    explanation:
      '[Top 1 SpeedCubeDB · 2-Look PLL] Simétrico desde cualquier ángulo. Encadena M2 con doble flick anular-medio y U con índice derecho.',
    triggers: [],
    tags: ['2-Look PLL', 'Faros', 'Opuestas'],
    grip: 'Home grip (cualquier cara)',
    auf: 'Cualquier cara (simétrico 4 lados)',
  },
  {
    id: 'pll-z',
    code: 'PLL Z',
    name: 'Z-Perm (Intercambio de Aristas Adyacentes)',
    stage: 'PLL',
    category: 'Solo Aristas',
    subcategory: 'Solo Aristas',
    twoLook: true,
    alg: "M' U' M2 U' M2 U' M' U2 M2",
    altAlgs: [
      "M2 U M2 U M' U2 M2 U2 M'",
      "y M2 U' M2 U' M' U2 M2 U2 M'",
    ],
    altAlg: "M2 U M2 U M' U2 M2 U2 M'",
    setup: "M U2' M2' U2' M U' M2' U' M2'",
    recognition:
      'Faros en las 4 caras con patrón alterno de 2 colores adyacentes (frente ↔ derecha y atrás ↔ izquierda).',
    explanation:
      '[Top 1 SpeedCubeDB · 2-Look PLL] Versión moderna iniciando en M\' U\' con flujos continuos de mano izquierda (U\') y anular derecho (M\'/M2).',
    triggers: [],
    tags: ['2-Look PLL', 'Faros'],
    grip: 'Home grip',
    auf: 'Intercambio entre Frente (F) y Derecha (R)',
  },

  // ============================================================================
  // 2. SOLO ESQUINAS (3 Casos: Aa, Ab, E)
  // ============================================================================
  {
    id: 'pll-aa',
    code: 'PLL Aa',
    name: 'Aa-Perm (Ciclo de 3 Esquinas Horario)',
    stage: 'PLL',
    category: 'Solo Esquinas',
    subcategory: 'Solo Esquinas',
    twoLook: false,
    alg: "x R' U R' D2 R U' R' D2 R2 x'",
    altAlgs: [
      "l' U R' D2 R U' R' D2 R2 x'",
      "x' R2 D2 R' U' R D2 R' U R' x",
    ],
    altAlg: "l' U R' D2 R U' R' D2 R2 x'",
    setup: "x R2' D2' R U R' D2' R U' R x'",
    recognition:
      'Bloque cuadrado 2×2 resuelto adelante-izquierda y faros mirando hacia ATRÁS (cara B).',
    explanation:
      '[Top 1 SpeedCubeDB] Inclina x al comenzar R\' y dispara ambos D2 con doble flick anular + meñique izquierdo.',
    triggers: [],
    tags: ['Bloque 2×2', 'Faros'],
    grip: 'Home grip (inclinando en x)',
    auf: 'Bloque 2×2 adelante-izq, faros atrás (B)',
  },
  {
    id: 'pll-ab',
    code: 'PLL Ab',
    name: 'Ab-Perm (Ciclo de 3 Esquinas Antihorario)',
    stage: 'PLL',
    category: 'Solo Esquinas',
    subcategory: 'Solo Esquinas',
    twoLook: false,
    alg: "x R2 D2 R U R' D2 R U' R x'",
    altAlgs: [
      "y x' R U' R D2 R' U R D2 R2 x",
      "l' R' D2 R U R' D2 R U' R x'",
    ],
    altAlg: "y x' R U' R D2 R' U R D2 R2 x",
    setup: "x R' U R' D2' R U' R' D2' R2' x'",
    recognition:
      'Bloque cuadrado 2×2 resuelto atrás-izquierda y faros mirando hacia la DERECHA (cara R).',
    explanation:
      '[Top 1 SpeedCubeDB] Inverso exacto de Aa-Perm: inicia con x R2 D2 y usa R U R\' y R U\' R con doble flick en D2.',
    triggers: ['Insert (R U R\')'],
    tags: ['Bloque 2×2', 'Faros'],
    grip: 'Pulgar derecho arriba para x R2',
    auf: 'Bloque 2×2 atrás-izq, faros a la derecha (R)',
  },
  {
    id: 'pll-e',
    code: 'PLL E',
    name: 'E-Perm (Doble Intercambio de Esquinas)',
    stage: 'PLL',
    category: 'Solo Esquinas',
    subcategory: 'Solo Esquinas',
    twoLook: false,
    alg: "y x' R U' R' D R U R' D' R U R' D R U' R' D' x",
    altAlgs: [
      "y R' U' R' D' R U' R' D R U R' D' R U R' D R2",
      "R2 U F' R' U R U' R' U R U' R' U R U' F U' R2",
    ],
    altAlg: "y R' U' R' D' R U' R' D R U R' D' R U R' D R2",
    setup: "x' D R U R' D' R U' R' D R U' R' D' R U R' x y'",
    recognition:
      'Cero faros y cero bloques 2×1 en las 4 caras; todas las aristas ya están resueltas entre sí.',
    explanation:
      '[Top 1 SpeedCubeDB] Conmutador clásico tras y x\': alterna (R U\' R\' D) y (R U R\' D\') usando ambos anulares para D y D\'.',
    triggers: ['Insert (R U\' R\')', 'Insert (R U R\')'],
    tags: ['Sin faros'],
    grip: "Inclinación x' (cara U al frente)",
    auf: 'Sticker UFR del mismo color que cara L antes de y',
  },

  // ============================================================================
  // 3. INTERCAMBIO ADYACENTE (10 Casos: F, Ga, Gb, Gc, Gd, Ja, Jb, Ra, Rb, T)
  // ============================================================================
  {
    id: 'pll-f',
    code: 'PLL F',
    name: 'F-Perm (Barra 1×3 sin Faros)',
    stage: 'PLL',
    category: 'Intercambio Adyacente',
    subcategory: 'Intercambio Adyacente',
    twoLook: false,
    alg: "y R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
    altAlgs: [
      "y R' F R f' R' F R2 U R' U' R' F' R2 U R' S",
      "R' U R U' R2 F' U' F U R F R' F' R2",
    ],
    altAlg: "y R' F R f' R' F R2 U R' U' R' F' R2 U R' S",
    setup: "R' U' R U' R' U R U R2' F' R U R U' R' F U R y'",
    recognition:
      'Única barra 1×3 completamente resuelta y cero faros en las otras 3 caras.',
    explanation:
      '[Top 1 SpeedCubeDB] Setup R\' U\' F\' + T-Perm modificado (terminando en U R). Coloca la barra 1×3 al frente antes de y (queda a la izquierda).',
    triggers: ['Sexy Move', 'Insert (R U R\')'],
    tags: ['Barra 1×3', 'Sin faros'],
    grip: 'Home grip',
    auf: 'Barra 1×3 al frente (queda en L tras y)',
  },
  {
    id: 'pll-ga',
    code: 'PLL Ga',
    name: 'Ga-Perm (Faros Izq + Bloque Frontal-Der)',
    stage: 'PLL',
    category: 'Intercambio Adyacente',
    subcategory: 'Intercambio Adyacente',
    twoLook: false,
    alg: "R2 U R' U R' U' R U' R2 D U' R' U R D'",
    altAlgs: [
      "R2 u R' U R' U' R u' R2 F' U F",
      "y R U R' F' R U R' U' R' F R U' R' F R2 U' R' U' R U R' F'",
    ],
    altAlg: "R2 u R' U R' U' R u' R2 F' U F",
    setup: "R' U' R D' U R2' U R' U R U' R U' R2' D",
    recognition:
      'Único par de faros a la IZQUIERDA (L) + bloque 2×1 en el FRENTE-DERECHA.',
    explanation:
      '[Top 1 SpeedCubeDB] Versión RUD estándar sin rotaciones; ejecuta D y U\' simultáneamente tras el segundo R2.',
    triggers: [],
    tags: ['Faros', 'G-Perm'],
    grip: 'Home grip',
    auf: 'Faros a la IZQUIERDA (L), bloque adelante-der',
  },
  {
    id: 'pll-gb',
    code: 'PLL Gb',
    name: 'Gb-Perm (Faros Izq + Bloque Derecha-Atrás)',
    stage: 'PLL',
    category: 'Intercambio Adyacente',
    subcategory: 'Intercambio Adyacente',
    twoLook: false,
    alg: "D R' U' R U D' R2 U R' U R U' R U' R2",
    altAlgs: [
      "R' U' R U D' R2 U R' U R U' R U' R2 D",
      "y F' U' F R2 u R' U R U' R u' R2",
    ],
    altAlg: "R' U' R U D' R2 U R' U R U' R U' R2 D",
    setup: "R2' U R' U R' U' R U' R2' D U' R' U R D'",
    recognition:
      'Único par de faros a la IZQUIERDA (L) + bloque 2×1 en la cara DERECHA hacia atrás.',
    explanation:
      '[Top 1 SpeedCubeDB] Pasa el D final al inicio para cancelar el regrip y terminar explosivamente en R2.',
    triggers: [],
    tags: ['Faros', 'G-Perm'],
    grip: 'Home grip (anular izq para D inicial)',
    auf: 'Faros a la IZQUIERDA (L), bloque derecha-atrás',
  },
  {
    id: 'pll-gc',
    code: 'PLL Gc',
    name: 'Gc-Perm (Faros Izq + Bloque Atrás-Der)',
    stage: 'PLL',
    category: 'Intercambio Adyacente',
    subcategory: 'Intercambio Adyacente',
    twoLook: false,
    alg: "R2 U' R U' R U R' U R2 D' U R U' R' D",
    altAlgs: [
      "y2 R2 F2 R U2 R U2 R' F R U R' U' R' F R2",
      "D R2 U' R U' R U R' U R2 D' U R U' R'",
    ],
    altAlg: "y2 R2 F2 R U2 R U2 R' F R U R' U' R' F R2",
    setup: "D' R U R' U' D R2' U' R U' R' U R' U R2'",
    recognition:
      'Único par de faros a la IZQUIERDA (L) + bloque 2×1 en la cara TRASERA hacia la derecha.',
    explanation:
      '[Top 1 SpeedCubeDB] Espejo trasero de Ga-Perm con D\' y U simultáneos. También incluye la popular variante R2 F2 en alternativas.',
    triggers: ['Inverse Sexy'],
    tags: ['Faros', 'G-Perm'],
    grip: 'Home grip',
    auf: 'Faros a la IZQUIERDA (L), bloque atrás-der',
  },
  {
    id: 'pll-gd',
    code: 'PLL Gd',
    name: 'Gd-Perm (Faros Izq + Bloque Derecha-Frente)',
    stage: 'PLL',
    category: 'Intercambio Adyacente',
    subcategory: 'Intercambio Adyacente',
    twoLook: false,
    alg: "R U R' U' D R2 U' R U' R' U R' U R2 D'",
    altAlgs: [
      "D' R U R' U' D R2 U' R U' R' U R' U R2",
      "R U R' y' R2 u' R U' R' U R' u R2",
    ],
    altAlg: "D' R U R' U' D R2 U' R U' R' U R' U R2",
    setup: "R2' U' R U' R U R' U R2' D' U R U' R' D",
    recognition:
      'Único par de faros a la IZQUIERDA (L) + bloque 2×1 en la cara DERECHA hacia el frente.',
    explanation:
      '[Top 1 SpeedCubeDB] Arranca con Sexy Move combinando U\' + D al mismo tiempo, seguido de flujo R/U hasta D\'.',
    triggers: ['Sexy Move'],
    tags: ['Faros', 'G-Perm'],
    grip: 'Home grip',
    auf: 'Faros a la IZQUIERDA (L), bloque derecha-frente',
  },
  {
    id: 'pll-ja',
    code: 'PLL Ja',
    name: 'Ja-Perm (Barra 1×3 + Bloques a la Izquierda)',
    stage: 'PLL',
    category: 'Intercambio Adyacente',
    subcategory: 'Intercambio Adyacente',
    twoLook: false,
    alg: "y2 x R2 F R F' R U2 r' U r U2 x'",
    altAlgs: [
      "L' U' L F L' U' L U L F' L2 U L",
      "y R' U L' U2 R U' R' U2 R L",
    ],
    altAlg: "L' U' L F L' U' L U L F' L2 U L",
    setup: "L' R' U2' R U R' U2' L U' R y'",
    recognition:
      'Barra 1×3 resuelta con bloques 2×1 adyacentes situados a la izquierda de cada cara.',
    explanation:
      '[Top 1 SpeedCubeDB] La ejecución de élite más rápida para Ja-Perm (sub-0.6s). Alternativas zurda <L, U, F> y <R, U, L> disponibles.',
    triggers: [],
    tags: ['Barra 1×3'],
    grip: 'Pulgar derecho arriba para x R2',
    auf: 'Barra 1×3 a la DERECHA antes de y2 (o en L tras y2)',
  },
  {
    id: 'pll-jb',
    code: 'PLL Jb',
    name: 'Jb-Perm (Barra 1×3 + Bloques a la Derecha)',
    stage: 'PLL',
    category: 'Intercambio Adyacente',
    subcategory: 'Intercambio Adyacente',
    twoLook: false,
    alg: "R U R' F' R U R' U' R' F R2 U' R'",
    altAlgs: [
      "R U2 R' U' R U2 L' U R' U' L",
      "r' F R F' r U2 R' U R U2 R'",
    ],
    altAlg: "R U2 R' U' R U2 L' U R' U' L",
    setup: "R U R2' F' R U R U' R' F R U' R'",
    recognition:
      'Barra 1×3 resuelta a la IZQUIERDA (L) con bloques 2×1 pegados hacia el frente y la derecha.',
    explanation:
      '[Top 1 SpeedCubeDB] El PLL más rápido del cubo: R U R\' F\' + Sexy Move + R\' F R2 U\' R\' sin ningún regrip.',
    triggers: ['Insert (R U R\')', 'Sexy Move'],
    tags: ['Barra 1×3'],
    grip: 'Home grip (F\' con pulgar derecho)',
    auf: 'Barra 1×3 resuelta a la IZQUIERDA (L)',
  },
  {
    id: 'pll-ra',
    code: 'PLL Ra',
    name: 'Ra-Perm (Faros + Bloque Frontal-Izquierdo)',
    stage: 'PLL',
    category: 'Intercambio Adyacente',
    subcategory: 'Intercambio Adyacente',
    twoLook: false,
    alg: "y R U' R' U' R U R D R' U' R D' R' U2 R'",
    altAlgs: [
      "y R U R' F' R U2 R' U2 R' F R U R U2 R'",
      "L U2 L' U2 L F' L' U' L U L F L2",
    ],
    altAlg: "y R U R' F' R U2 R' U2 R' F R U R U2 R'",
    setup: "R U2' R D R' U R D' R' U' R' U R U R' y'",
    recognition:
      'Faros en una cara y un bloque 2×1 pegado inmediatamente a su derecha (adelante-izquierda tras y).',
    explanation:
      '[Top 1 SpeedCubeDB] Algoritmo RUD estándar sin regrips usando D (anular izq) y D\' (anular der).',
    triggers: ['Insert (R U\' R\')'],
    tags: ['Faros'],
    grip: 'Home grip',
    auf: 'Faros al FRENTE antes de y (quedan en L tras y)',
  },
  {
    id: 'pll-rb',
    code: 'PLL Rb',
    name: 'Rb-Perm (Faros Atrás + Bloque Frontal-Der)',
    stage: 'PLL',
    category: 'Intercambio Adyacente',
    subcategory: 'Intercambio Adyacente',
    twoLook: false,
    alg: "R' U2 R U2 R' F R U R' U' R' F' R2",
    altAlgs: [
      "y R2 F R U R U' R' F' R U2 R' U2 R",
      "R' U2 R' D' R U' R' D R U R U' R' U' R",
    ],
    altAlg: "y R2 F R U R U' R' F' R U2 R' U2 R",
    setup: "R' U R U R' U' R' D' R U R' D R U2' R",
    recognition:
      'Faros mirando hacia ATRÁS (B) y bloque 2×1 en el lado derecho de la cara frontal.',
    explanation:
      '[Top 1 SpeedCubeDB] Flujo continuo con doble U2, Sexy Move en el centro y cierre firme en R2.',
    triggers: ['Sexy Move'],
    tags: ['Faros'],
    grip: 'Home grip (pulgar arriba para R\')',
    auf: 'Faros ATRÁS (B), bloque 2×1 adelante-der',
  },
  {
    id: 'pll-t',
    code: 'PLL T',
    name: 'T-Perm (Faros a la Izquierda + 2 Bloques)',
    stage: 'PLL',
    category: 'Intercambio Adyacente',
    subcategory: 'Intercambio Adyacente',
    twoLook: true,
    alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
    altAlgs: [
      "R U R' U' R' F R2 U' R' U F' L' U L",
      "F R U' R' U R U R2 F' R U R U' R'",
    ],
    altAlg: "R U R' U' R' F R2 U' R' U F' L' U L",
    setup: "F R U' R' U R U R2' F' R U R U' R'",
    recognition:
      'Faros a la IZQUIERDA (L) flanqueados por dos bloques 2×1 en las caras F y B.',
    explanation:
      '[Top 1 SpeedCubeDB · 2-Look PLL] El rey de los PLLs: Sexy Move + R\' F R2 + U\' R\' U\' + R U R\' F\' sin regrips.',
    triggers: ['Sexy Move', 'Insert (R U R\')'],
    tags: ['2-Look PLL', 'Faros'],
    grip: 'Home grip (cero regrips)',
    auf: 'Faros a la IZQUIERDA (L)',
  },

  // ============================================================================
  // 4. INTERCAMBIO DIAGONAL (4 Casos: Na, Nb, V, Y)
  // ============================================================================
  {
    id: 'pll-na',
    code: 'PLL Na',
    name: 'Na-Perm (4 Bloques 2×1 a la Derecha)',
    stage: 'PLL',
    category: 'Intercambio Diagonal',
    subcategory: 'Intercambio Diagonal',
    twoLook: false,
    alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
    altAlgs: [
      "F' R U R' U' R' F R2 F U' R' U' R U F' R'",
      "R F U' R' U R U F' R2 F' R U R U' R' F",
    ],
    altAlg: "F' R U R' U' R' F R2 F U' R' U' R U F' R'",
    setup: "R U R' U2' R U R2' F' R U R U' R' F R U' R' U' R U' R'",
    recognition:
      'Simétrico en las 4 caras: bloque 2×1 a la DERECHA y esquina de color opuesto a la izquierda en cada cara.',
    explanation:
      '[Top 1 SpeedCubeDB] R U R\' U + Jb-Perm completo + U2 R U\' R\'. Memoria instantánea y ejecución muy fluida.',
    triggers: ['Insert (R U R\')', 'Sexy Move', 'Insert (R U\' R\')'],
    tags: ['Sin faros', 'Diagonal'],
    grip: 'Home grip',
    auf: 'Cualquier cara (simétrico 4 lados)',
  },
  {
    id: 'pll-nb',
    code: 'PLL Nb',
    name: 'Nb-Perm (4 Bloques 2×1 a la Izquierda)',
    stage: 'PLL',
    category: 'Intercambio Diagonal',
    subcategory: 'Intercambio Diagonal',
    twoLook: false,
    alg: "R' U R U' R' F' U' F R U R' F R' F' R U' R",
    altAlgs: [
      "r' D' F r U' r' F' D r2 U r' U' r' F r F'",
      "R' U L' U2 R U' L R' U L' U2 R U' L",
    ],
    altAlg: "r' D' F r U' r' F' D r2 U r' U' r' F r F'",
    setup: "F r' F' r U r U' r2' D' F r U r' F' D r",
    recognition:
      'Simétrico en las 4 caras: bloque 2×1 a la IZQUIERDA y esquina de color opuesto a la derecha en cada cara.',
    explanation:
      '[Top 1 SpeedCubeDB] Versión estándar RUF sin rotaciones; también incluye la rápida variante wide r\' D\' F en alternativas.',
    triggers: ['Insert (R U R\')', 'Hedgeslammer'],
    tags: ['Sin faros', 'Diagonal'],
    grip: 'Home grip',
    auf: 'Cualquier cara (simétrico 4 lados)',
  },
  {
    id: 'pll-v',
    code: 'PLL V',
    name: 'V-Perm (Bloque 2×2 + Diagonal)',
    stage: 'PLL',
    category: 'Intercambio Diagonal',
    subcategory: 'Intercambio Diagonal',
    twoLook: false,
    alg: "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2",
    altAlgs: [
      "R' U R U' R' f' U' R U2 R' U' R U' R' f R",
      "R' U R' U' y R' F' R2 U' R' U R' F R F",
    ],
    altAlg: "R' U R U' R' f' U' R U2 R' U' R U' R' f R",
    setup: "D2' R' U R D' R2' U' R' U R' U R' D' R U2' R'",
    recognition:
      'Bloque cuadrado 2×2 completo adelante-izquierda y cero faros en las otras dos caras.',
    explanation:
      '[Top 1 SpeedCubeDB] Versión moderna RUD sin rotaciones con cierre rápido en U D\' R2 U\' R2 D R2.',
    triggers: [],
    tags: ['Sin faros', 'Diagonal', 'Bloque 2×2'],
    grip: 'Home grip',
    auf: 'Bloque 2×2 adelante-izquierda (ULF)',
  },
  {
    id: 'pll-y',
    code: 'PLL Y',
    name: 'Y-Perm (Intercambio Diagonal Estándar)',
    stage: 'PLL',
    category: 'Intercambio Diagonal',
    subcategory: 'Intercambio Diagonal',
    twoLook: true,
    alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    altAlgs: [
      "F R' F R2 U' R' U' R U R' F' R U R' U' F'",
      "R2 U' R2 U' R2 U F U F' R2 F U' F'",
    ],
    altAlg: "F R' F R2 U' R' U' R U R' F' R U R' U' F'",
    setup: "F R' F' R U R U' R' F R U' R' U R U R' F'",
    recognition:
      'Cero faros; dos bloques 2×1 convergen en la esquina frontal-izquierda (ULF) dejando la esquina UFR aislada.',
    explanation:
      '[Top 1 SpeedCubeDB · 2-Look PLL] Algoritmo estándar para intercambio diagonal de esquinas: F R U\' R\' U\' R U R\' F\' + Sexy Move + Sledgehammer.',
    triggers: ['Insert (R U\' R\')', 'Insert (R U R\')', 'Sexy Move', 'Sledgehammer'],
    tags: ['2-Look PLL', 'Sin faros', 'Diagonal', 'Bloque 2×2'],
    grip: 'Home grip (F con índice derecho)',
    auf: 'Bloque 2×2 adelante-izquierda (ULF)',
  },
];
