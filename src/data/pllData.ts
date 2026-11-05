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
    subcategory: 'Solo Aristas',
    isTwoLook: true,
    alg: "R U' R U R U R U' R' U' R2",
    altAlg: "M2 U M U2 M' U M2",
    altAlgs: [
      "M2 U M U2 M' U M2",
      "R2 U' R' U' R U R U R U' R",
    ],
    recognition:
      'Barra 1×3 resuelta atrás (cara B) y faros en las otras 3 caras; la arista frontal (UF) va hacia la derecha.',
    explanation:
      '[2-Look PLL] Coloca la barra resuelta ATRÁS. La versión <R, U> evita regrips desde home grip; la variante <M, U> es letal si dominas M2 con anular-medio.',
    tags: ['2-Look PLL', 'Barra 1×3', 'Faros'],
    grip: 'Home grip (pulgares en F)',
    auf: 'Barra 1×3 resuelta ATRÁS (B)',
  },
  {
    id: 'pll-ub',
    code: 'PLL Ub',
    name: 'Ub-Perm (Ciclo de 3 Aristas Horario)',
    stage: 'PLL',
    subcategory: 'Solo Aristas',
    isTwoLook: true,
    alg: "R2 U R U R' U' R' U' R' U R'",
    altAlg: "M2 U' M U2 M' U' M2",
    altAlgs: [
      "M2 U' M U2 M' U' M2",
      "R' U R' U' R' U' R' U R U R2",
    ],
    recognition:
      'Barra 1×3 resuelta atrás (cara B) y faros en las otras 3 caras; la arista frontal (UF) va hacia la izquierda.',
    explanation:
      '[2-Look PLL] Coloca la barra resuelta ATRÁS. Inverso exacto de Ua-Perm; alterna entre la versión <R, U> o el rápido slice <M, U>.',
    tags: ['2-Look PLL', 'Barra 1×3', 'Faros'],
    grip: 'Home grip (o pulgar der. abajo en R2)',
    auf: 'Barra 1×3 resuelta ATRÁS (B)',
  },
  {
    id: 'pll-h',
    code: 'PLL H',
    name: 'H-Perm (Intercambio de Aristas Opuestas)',
    stage: 'PLL',
    subcategory: 'Solo Aristas',
    isTwoLook: true,
    alg: "M2 U M2 U2 M2 U M2",
    altAlg: "R2 U2 R U2 R2 U2 R2 U2 R U2 R2",
    altAlgs: [
      "M2 U' M2 U2 M2 U' M2",
      "R2 U2 R U2 R2 U2 R2 U2 R U2 R2",
    ],
    recognition:
      'Faros en las 4 caras; cada arista central tiene el color opuesto al de sus esquinas.',
    explanation:
      '[2-Look PLL] Simétrico desde cualquier ángulo. Ejecuta los M2 con doble flick anular + medio y U con el índice.',
    tags: ['2-Look PLL', 'Faros', 'Opuestas'],
    grip: 'Home grip (cualquier cara)',
    auf: 'Cualquier cara (simétrico 4 lados)',
  },
  {
    id: 'pll-z',
    code: 'PLL Z',
    name: 'Z-Perm (Intercambio de Aristas Adyacentes)',
    stage: 'PLL',
    subcategory: 'Solo Aristas',
    isTwoLook: true,
    alg: "M' U M2 U M2 U M' U2 M2",
    altAlg: "M2 U M2 U M' U2 M2 U2 M'",
    altAlgs: [
      "M2 U M2 U M' U2 M2 U2 M'",
      "R' U' R U' R U R U' R' U R U R2 U' R'",
    ],
    recognition:
      'Faros en las 4 caras con patrón damero (2 colores por cara) entre caras adyacentes.',
    explanation:
      '[2-Look PLL] Sujeta el cubo de modo que el intercambio adyacente sea entre FRENTE y DERECHA (o Frente e Izquierda en la variante M2 inicial).',
    tags: ['2-Look PLL', 'Faros'],
    grip: 'Home grip',
    auf: 'Ciclo entre Frente (F) e Izquierda (L)',
  },

  // ============================================================================
  // 2. SOLO ESQUINAS (3 Casos: Aa, Ab, E)
  // ============================================================================
  {
    id: 'pll-aa',
    code: 'PLL Aa',
    name: 'Aa-Perm (Ciclo de 3 Esquinas Horario)',
    stage: 'PLL',
    subcategory: 'Solo Esquinas',
    alg: "x R' U R' D2 R U' R' D2 R2 x'",
    altAlg: "x' R2 D2 R' U' R D2 R' U R' x",
    altAlgs: [
      "x' R2 D2 R' U' R D2 R' U R' x",
      "l' U R' D2 R U' R' D2 R2 x'",
    ],
    recognition:
      'Bloque 2×2 resuelto adelante-izquierda y faros mirando hacia ATRÁS (cara B).',
    explanation:
      'Inclina con x al iniciar el primer R\' y ejecuta los D2 con doble flick anular + meñique izquierdo.',
    tags: ['Bloque 2×2', 'Faros'],
    grip: 'Home grip (inclinando en x)',
    auf: 'Bloque 2×2 adelante-izq, faros atrás',
  },
  {
    id: 'pll-ab',
    code: 'PLL Ab',
    name: 'Ab-Perm (Ciclo de 3 Esquinas Antihorario)',
    stage: 'PLL',
    subcategory: 'Solo Esquinas',
    alg: "x R2 D2 R U R' D2 R U' R x'",
    altAlg: "x' R U' R D2 R' U R D2 R2 x",
    altAlgs: [
      "x' R U' R D2 R' U R D2 R2 x",
      "l' R' D2 R U R' D2 R U' R x'",
    ],
    recognition:
      'Bloque 2×2 resuelto atrás-izquierda y faros mirando hacia la DERECHA (cara R).',
    explanation:
      'Inverso de Aa-Perm. Pon los faros a la derecha (o el bloque 2×2 atrás-izquierda) y encadena R2 D2 fluido.',
    tags: ['Bloque 2×2', 'Faros'],
    grip: 'Pulgar derecho arriba para R2 inicial',
    auf: 'Bloque 2×2 atrás-izq, faros a la derecha',
  },
  {
    id: 'pll-e',
    code: 'PLL E',
    name: 'E-Perm (Doble Intercambio de Esquinas)',
    stage: 'PLL',
    subcategory: 'Solo Esquinas',
    alg: "x' R U' R' D R U R' D' R U R' D R U' R' D' x",
    altAlg: "x' L' U L D' L' U' L D L' U' L D' L' U L D x",
    altAlgs: [
      "x' L' U L D' L' U' L D L' U' L D' L' U L D x",
      "R2 U R' U' y R U R' U' R U R' U' R U R' y' R U' R2",
    ],
    recognition:
      'Cero faros y cero bloques en las 4 caras; las 4 aristas ya coinciden con sus centros.',
    explanation:
      'Alinea las aristas laterales y asegúrate de que el sticker frontal-derecho coincida con el color superior antes de inclinar x\'. Alterna D (anular izq) y D\' (anular der).',
    tags: ['Sin faros'],
    grip: "Inclinación x' (cara U pasa al frente)",
    auf: 'Sticker esquina UFR del mismo color que cara R',
  },

  // ============================================================================
  // 3. INTERCAMBIO ADYACENTE (10 Casos: T, F, Ja, Jb, Ra, Rb, Ga, Gb, Gc, Gd)
  // ============================================================================
  {
    id: 'pll-t',
    code: 'PLL T',
    name: 'T-Perm (Faros a la Izquierda)',
    stage: 'PLL',
    subcategory: 'Intercambio Adyacente',
    isTwoLook: true,
    alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
    altAlg: "R U R' U' R' F R2 U' R' U F' L' U L",
    altAlgs: [
      "R U R' U' R' F R2 U' R' U F' L' U L",
      "F R U' R' U R U R2 F' R U R U' R'",
    ],
    recognition:
      'Faros a la izquierda (L) con bloques 2×1 enfrentados en F y B; la cara derecha tiene colores opuestos.',
    explanation:
      '[2-Look PLL Esquinas] El algoritmo más famoso de CFOP: Sexy Move + R\' F R2 + U\' R\' U\' + R U R\' F\'. Cero regrips.',
    triggers: ['Sexy Move', 'Insert R'],
    tags: ['2-Look PLL', 'Faros', 'Bloque 2×2'],
    grip: 'Home grip (cero regrips)',
    auf: 'Faros a la IZQUIERDA (L)',
  },
  {
    id: 'pll-f',
    code: 'PLL F',
    name: 'F-Perm (Barra 1×3 a la Izquierda)',
    stage: 'PLL',
    subcategory: 'Intercambio Adyacente',
    alg: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
    altAlg: "R' U R U' R2 F' U' F U R F R' F' R2",
    altAlgs: [
      "R' U R U' R2 F' U' F U R F R' F' R2",
    ],
    recognition:
      'Única barra 1×3 completamente resuelta (a la izquierda) y cero faros en las otras 3 caras.',
    explanation:
      'Es simplemente R\' U\' F\' + un T-Perm (cambiando el último F\' por U R). Muy fácil de recordar si ya dominas T-Perm.',
    triggers: ['Sexy Move', 'Insert R'],
    tags: ['Barra 1×3', 'Sin faros'],
    grip: 'Home grip',
    auf: 'Barra 1×3 resuelta a la IZQUIERDA (L)',
  },
  {
    id: 'pll-ja',
    code: 'PLL Ja',
    name: 'Ja-Perm (Barra 1×3 Izquierda / Atrás)',
    stage: 'PLL',
    subcategory: 'Intercambio Adyacente',
    alg: "x R2 F R F' R U2 r' U r U2 x'",
    altAlg: "R' U L' U2 R U' R' U2 R L",
    altAlgs: [
      "R' U L' U2 R U' R' U2 R L",
      "L' U' L F L' U' L U L F' L2 U L",
    ],
    recognition:
      'Barra 1×3 resuelta a la izquierda (L) y bloques 2×1 situados a la izquierda de sus caras.',
    explanation:
      'La versión profesional con x R2 F R F\' R U2 r\' U r U2 x\' es ultrarrápida; puedes usar la variante R\' U L\' o zurda L U F sin rotaciones.',
    tags: ['Barra 1×3'],
    grip: 'Pulgar derecho arriba para x R2',
    auf: 'Barra 1×3 a la IZQUIERDA (o ATRÁS en alt)',
  },
  {
    id: 'pll-jb',
    code: 'PLL Jb',
    name: 'Jb-Perm (Barra 1×3 a la Izquierda + Bloques Der)',
    stage: 'PLL',
    subcategory: 'Intercambio Adyacente',
    alg: "R U R' F' R U R' U' R' F R2 U' R'",
    altAlg: "R U2 R' U' R U2 L' U R' U' L",
    altAlgs: [
      "R U2 R' U' R U2 L' U R' U' L",
    ],
    recognition:
      'Barra 1×3 resuelta a la izquierda (L) y bloques 2×1 pegados a ella (en la parte frontal-izquierda y derecha).',
    explanation:
      'Uno de los PLLs más rápidos del mundo (sub-0.7s). Son los mismos movimientos del T-Perm pero moviendo R U R\' F\' al principio.',
    triggers: ['Sexy Move', 'Insert R'],
    tags: ['Barra 1×3'],
    grip: 'Home grip (F\' con pulgar derecho)',
    auf: 'Barra 1×3 resuelta a la IZQUIERDA (L)',
  },
  {
    id: 'pll-ra',
    code: 'PLL Ra',
    name: 'Ra-Perm (Faros Izquierda + Bloque 2×1 Frontal-Izq)',
    stage: 'PLL',
    subcategory: 'Intercambio Adyacente',
    alg: "R U' R' U' R U R D R' U' R D' R' U2 R'",
    altAlg: "R U R' F' R U2 R' U2 R' F R U R U2 R'",
    altAlgs: [
      "R U R' F' R U2 R' U2 R' F R U R U2 R'",
      "L U2 L' U2 L F' L' U' L U L F L2",
    ],
    recognition:
      'Faros a la izquierda (L) con un bloque 2×1 pegado adelante-izquierda (en la cara F).',
    explanation:
      'La versión RUD moderna fluye sin regrips usando el anular izquierdo para D y anular derecho para D\'. Incluye la alternativa RUF clásica.',
    tags: ['Faros'],
    grip: 'Home grip',
    auf: 'Faros a la IZQUIERDA, bloque 2×1 adelante-izq',
  },
  {
    id: 'pll-rb',
    code: 'PLL Rb',
    name: 'Rb-Perm (Faros Atrás + Bloque 2×1 Frontal-Der)',
    stage: 'PLL',
    subcategory: 'Intercambio Adyacente',
    alg: "R' U2 R U2 R' F R U R' U' R' F' R2",
    altAlg: "R2 F R U R U' R' F' R U2 R' U2 R",
    altAlgs: [
      "R2 F R U R U' R' F' R U2 R' U2 R",
      "R' U2 R' D' R U' R' D R U R U' R' U' R",
    ],
    recognition:
      'Faros mirando hacia ATRÁS (B) con un bloque 2×1 en la parte derecha de la cara frontal.',
    explanation:
      'Fluye con doble flick en U2, un Sexy Move central entre F y F\', y cierre en R2.',
    triggers: ['Sexy Move'],
    tags: ['Faros'],
    grip: 'Home grip (pulgar arriba para R\')',
    auf: 'Faros ATRÁS (B), bloque 2×1 adelante-der',
  },
  {
    id: 'pll-ga',
    code: 'PLL Ga',
    name: 'Ga-Perm (Faros Izquierda + Bloque Frontal-Der)',
    stage: 'PLL',
    subcategory: 'Intercambio Adyacente',
    alg: "R2 U R' U R' U' R U' R2 U' D R' U R D'",
    altAlg: "R2 u R' U R' U' R u' R2 y' R' U R y",
    altAlgs: [
      "R2 u R' U R' U' R u' R2 y' R' U R y",
      "R2 U R' U R' U' R U' R2 D U' R' U R D'",
    ],
    recognition:
      'Único par de faros a la izquierda (L) + bloque 2×1 en el frente-derecha (opuesto a los faros).',
    explanation:
      'En los 4 G-Perms pon SIEMPRE los faros a la izquierda y mira dónde está el bloque 2×1. Combina U\' y D simultáneos al final.',
    tags: ['Faros', 'G-Perm'],
    grip: 'Home grip',
    auf: 'Faros a la IZQUIERDA, bloque adelante-der',
  },
  {
    id: 'pll-gb',
    code: 'PLL Gb',
    name: 'Gb-Perm (Faros Izquierda + Bloque Derecha-Atrás)',
    stage: 'PLL',
    subcategory: 'Intercambio Adyacente',
    alg: "R' U' R U D' R2 U R' U R U' R U' R2 D",
    altAlg: "R' U' R y R2 u R' U R U' R u' R2 y'",
    altAlgs: [
      "R' U' R y R2 u R' U R U' R u' R2 y'",
      "D R' U' R U D' R2 U R' U R U' R U' R2",
    ],
    recognition:
      'Único par de faros a la izquierda (L) + bloque 2×1 en la cara derecha pegado hacia atrás.',
    explanation:
      'Inverso de Ga-Perm: pon los faros a la izquierda; el bloque 2×1 está en la cara R hacia el fondo.',
    tags: ['Faros', 'G-Perm'],
    grip: 'Home grip',
    auf: 'Faros a la IZQUIERDA, bloque derecha-atrás',
  },
  {
    id: 'pll-gc',
    code: 'PLL Gc',
    name: 'Gc-Perm (Faros Izquierda + Bloque Atrás-Der)',
    stage: 'PLL',
    subcategory: 'Intercambio Adyacente',
    alg: "R2 U' R U' R U R' U R2 U D' R U' R' D",
    altAlg: "R2 F2 R U2 R U2 R' F R U R' U' R' F R2",
    altAlgs: [
      "R2 F2 R U2 R U2 R' F R U R' U' R' F R2",
      "R2 u' R U' R U R' u R2 y R U' R' y'",
    ],
    recognition:
      'Único par de faros a la izquierda (L) + bloque 2×1 en la cara trasera (B) hacia la derecha.',
    explanation:
      'Espejo trasero de Ga-Perm. Incluye como alternativa favorita la variante R2 F2 sin movimientos D.',
    triggers: ['Sexy Move'],
    tags: ['Faros', 'G-Perm'],
    grip: 'Home grip',
    auf: 'Faros a la IZQUIERDA, bloque atrás-der',
  },
  {
    id: 'pll-gd',
    code: 'PLL Gd',
    name: 'Gd-Perm (Faros Izquierda + Bloque Derecha-Frente)',
    stage: 'PLL',
    subcategory: 'Intercambio Adyacente',
    alg: "R U R' U' D R2 U' R U' R' U R' U R2 D'",
    altAlg: "R U R' y' R2 u' R U' R' U R' u R2 y",
    altAlgs: [
      "R U R' y' R2 u' R U' R' U R' u R2 y",
      "D' R U R' U' D R2 U' R U' R' U R' U R2",
    ],
    recognition:
      'Único par de faros a la izquierda (L) + bloque 2×1 en la cara derecha pegado hacia el frente.',
    explanation:
      'Inverso de Gc-Perm: pon los faros a la izquierda; inicia con R U R\' y ejecuta U\' + D en paralelo.',
    triggers: ['Insert R'],
    tags: ['Faros', 'G-Perm'],
    grip: 'Home grip',
    auf: 'Faros a la IZQUIERDA, bloque derecha-frente',
  },

  // ============================================================================
  // 4. INTERCAMBIO DIAGONAL (4 Casos: V, Y, Na, Nb)
  // ============================================================================
  {
    id: 'pll-y',
    code: 'PLL Y',
    name: 'Y-Perm (Intercambio Diagonal Estándar)',
    stage: 'PLL',
    subcategory: 'Intercambio Diagonal',
    isTwoLook: true,
    alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    altAlg: "F R' F R2 U' R' U' R U R' F' R U R' U' F'",
    altAlgs: [
      "F R' F R2 U' R' U' R U R' F' R U R' U' F'",
    ],
    recognition:
      'Cero faros, con dos bloques 2×1 unidos en la esquina frontal-izquierda (ULF) y la esquina UFR aislada.',
    explanation:
      '[2-Look PLL Esquinas] Si no hay faros en ninguna cara, aplica Y-Perm para permutar las esquinas diagonalmente. Son dos OLLs cortos: OLL 37 + OLL 33 (Sexy + Sledge).',
    triggers: ['Extract R', 'Insert R', 'Sexy Move', 'Sledgehammer'],
    tags: ['2-Look PLL', 'Sin faros', 'Diagonal', 'Bloque 2×2'],
    grip: 'Home grip (F con índice derecho)',
    auf: 'Bloque 2×2 adelante-izquierda (ULF)',
  },
  {
    id: 'pll-v',
    code: 'PLL V',
    name: 'V-Perm (Bloque 2×2 + Diagonal)',
    stage: 'PLL',
    subcategory: 'Intercambio Diagonal',
    alg: "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2",
    altAlg: "R' U R' U' y R' F' R2 U' R' U R' F R F y'",
    altAlgs: [
      "R' U R' U' y R' F' R2 U' R' U R' F R F y'",
      "R U' R U R' D R D' R U' D R2 U R2 D' R2",
    ],
    recognition:
      'Bloque cuadrado 2×2 completo adelante-izquierda y cero faros en las otras dos caras.',
    explanation:
      'La versión moderna RUD evita la rotación y permite un cierre explosivo en R2 U\' R2 D R2.',
    tags: ['Sin faros', 'Diagonal', 'Bloque 2×2'],
    grip: 'Home grip',
    auf: 'Bloque 2×2 adelante-izquierda',
  },
  {
    id: 'pll-na',
    code: 'PLL Na',
    name: 'Na-Perm (4 Bloques 2×1 a la Derecha)',
    stage: 'PLL',
    subcategory: 'Intercambio Diagonal',
    alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
    altAlg: "L U' R U2 L' U R' L U' R U2 L' U R'",
    altAlgs: [
      "L U' R U2 L' U R' L U' R U2 L' U R'",
    ],
    recognition:
      'Simétrico en las 4 caras: cada cara tiene un bloque 2×1 a la DERECHA y una esquina de color opuesto a la izquierda.',
    explanation:
      'Truco de memoria: inicia con R U R\' U, ejecuta un Jb-Perm completo en el centro, y cierra con U2 R U\' R\'.',
    triggers: ['Insert R', 'Sexy Move', 'Extract R'],
    tags: ['Sin faros', 'Diagonal'],
    grip: 'Home grip',
    auf: 'Cualquier cara (simétrico 4 lados)',
  },
  {
    id: 'pll-nb',
    code: 'PLL Nb',
    name: 'Nb-Perm (4 Bloques 2×1 a la Izquierda)',
    stage: 'PLL',
    subcategory: 'Intercambio Diagonal',
    alg: "R' U R U' R' F' U' F R U R' F R' F' R U' R",
    altAlg: "R' U L' U2 R U' L R' U L' U2 R U' L",
    altAlgs: [
      "R' U L' U2 R U' L R' U L' U2 R U' L",
      "r' D' F r U' r' F' D r2 U r' U' r' F r F'",
    ],
    recognition:
      'Simétrico en las 4 caras: cada cara tiene un bloque 2×1 a la IZQUIERDA y una esquina de color opuesto a la derecha.',
    explanation:
      'Simétrico en las 4 caras. Puedes usar la variante RUF estándar, el conmutador R\' U L\' o la versión wide r\' D\' F.',
    triggers: ['Insert R', 'Hedgeslammer'],
    tags: ['Sin faros', 'Diagonal'],
    grip: 'Home grip',
    auf: 'Cualquier cara (simétrico 4 lados)',
  },
];
