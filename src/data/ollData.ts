import type { CfopCase } from '../types/cfop';

export const OLL_SUBCATEGORIES: string[] = [
  'Todos',
  'Cross / OCLL',
  'Dot Cases',
  'Square Shapes',
  'C-Shapes',
  'W-Shapes',
  'Corners Correct',
  'P-Shapes',
  'T-Shapes',
  'I-Shapes',
  'Fish Shapes',
  'Knight Move Shapes',
  'Awkward Shapes',
  'L-Shapes',
  'Lightning Bolts',
];

export const TWO_LOOK_OLL_IDS = new Set<string>([
  'oll-02',
  'oll-44',
  'oll-45',
  'oll-21',
  'oll-22',
  'oll-23',
  'oll-24',
  'oll-25',
  'oll-26',
  'oll-27',
]);

export const OLL_CASES: CfopCase[] = [
  // ============================================================================
  // 1. CROSS / OCLL (7 Casos: OLL 21–27) — Esenciales 2-Look OLL
  // ============================================================================
  {
    id: 'oll-21',
    code: 'OLL 21',
    name: 'H / Double Sune (Faros Opuestos)',
    stage: 'OLL',
    subcategory: 'Cross / OCLL',
    isTwoLook: true,
    alg: "R U2 R' U' R U R' U' R U' R'",
    altAlg: "F R U R' U' R U R' U' R U R' U' F'",
    altAlgs: [
      "F R U R' U' R U R' U' R U R' U' F'",
      "R U R' U R U' R' U R U2 R'",
    ],
    recognition:
      'Cruz amarilla armada; 0 esquinas orientadas con dos pares de faros opuestos (adelante y atrás, o izquierda y derecha).',
    explanation:
      '[2-Look OLL] Con los faros mirando a izquierda y derecha, ejecuta Antisune encadenado sin regrips (o F + Triple Sexy + F\' con faros adelante/atrás).',
    triggers: ['Sexy Move'],
    tags: ['2-Look OLL', 'Cruz', 'Faros'],
    grip: 'Home grip',
    auf: 'Faros a IZQUIERDA y DERECHA',
  },
  {
    id: 'oll-22',
    code: 'OLL 22',
    name: 'Pi / Bruno (Faros Izq + Ojos Der)',
    stage: 'OLL',
    subcategory: 'Cross / OCLL',
    isTwoLook: true,
    alg: "R U2 R2 U' R2 U' R2 U2 R",
    altAlg: "f R U R' U' f' F R U R' U' F'",
    altAlgs: [
      "f R U R' U' f' F R U R' U' F'",
    ],
    recognition:
      'Cruz amarilla armada; 0 esquinas orientadas con faros a la izquierda (L) y stickers opuestos a la derecha (R).',
    explanation:
      '[2-Look OLL] Uno de los OLLs más rápidos (2-gen puro R y U). Usa doble flick en todos los U2 y R2.',
    tags: ['2-Look OLL', 'Cruz', 'Faros'],
    grip: 'Home grip',
    auf: 'Faros a la IZQUIERDA (L)',
  },
  {
    id: 'oll-23',
    code: 'OLL 23',
    name: 'U / Headlights (Faros Frontales)',
    stage: 'OLL',
    subcategory: 'Cross / OCLL',
    isTwoLook: true,
    alg: "R2 D R' U2 R D' R' U2 R'",
    altAlg: "R2 D' R U2 R' D R U2 R",
    altAlgs: [
      "R2 D' R U2 R' D R U2 R",
      "R U R' U' R U' R' U2 R U' R' U2 R U R'",
    ],
    recognition:
      'Cruz amarilla más barra 1×3 atrás; dos faros amarillos apuntando directamente hacia el FRENTE.',
    explanation:
      '[2-Look OLL] Coloca los faros al frente. Empuja D con el anular izquierdo y D\' con el anular derecho.',
    tags: ['2-Look OLL', 'Cruz', 'Faros', 'Barra 1×3'],
    grip: 'Pulgar derecho abajo/frente para R2',
    auf: 'Faros mirando al FRENTE (F)',
  },
  {
    id: 'oll-24',
    code: 'OLL 24',
    name: 'T / Chameleon (Ojos de Camaleón)',
    stage: 'OLL',
    subcategory: 'Cross / OCLL',
    isTwoLook: true,
    alg: "r U R' U' r' F R F'",
    altAlg: "L F R' F' L' F R F'",
    altAlgs: [
      "L F R' F' L' F R F'",
    ],
    recognition:
      'Cruz amarilla con las 2 esquinas derechas resueltas; las 2 esquinas izquierdas apuntan hacia F y B (opuestas).',
    explanation:
      '[2-Look OLL] 8 movimientos: Wide Sexy inicial (r U R\' U\') seguido de r\' F R F\'.',
    triggers: ['Wide Sexy', 'Sledgehammer'],
    tags: ['2-Look OLL', 'Cruz', 'Opuestas'],
    grip: 'Home grip',
    auf: 'Esquinas desorientadas a la IZQUIERDA (L)',
  },
  {
    id: 'oll-25',
    code: 'OLL 25',
    name: 'L / Bowtie (Corbatín Diagonal)',
    stage: 'OLL',
    subcategory: 'Cross / OCLL',
    isTwoLook: true,
    alg: "F' r U R' U' r' F R",
    altAlg: "R' F R B' R' F' R B",
    altAlgs: [
      "R' F R B' R' F' R B",
      "R U2 R D R' U2 R D' R2",
    ],
    recognition:
      'Cruz amarilla con 2 esquinas diagonalmente opuestas orientadas; la esquina frontal-izquierda mira al frente.',
    explanation:
      '[2-Look OLL] Son los mismos movimientos de OLL 24 (Chameleon) pero pasando el último F\' al principio.',
    triggers: ['Wide Sexy'],
    tags: ['2-Look OLL', 'Cruz', 'Diagonal'],
    grip: 'Pulgar derecho para F\' inicial',
    auf: 'Sticker frontal-izquierdo (ULF) mirando al frente',
  },
  {
    id: 'oll-26',
    code: 'OLL 26',
    name: 'Antisune (Pez Antihorario)',
    stage: 'OLL',
    subcategory: 'Cross / OCLL',
    isTwoLook: true,
    alg: "R U2 R' U' R U' R'",
    altAlg: "R' U' R U' R' U2 R",
    altAlgs: [
      "R' U' R U' R' U2 R",
      "L' U' L U' L' U2 L",
    ],
    recognition:
      'Cruz amarilla con 1 sola esquina orientada (atrás-derecha UBR) y ningún sticker amarillo en el frente-derecha.',
    explanation:
      '[2-Look OLL] Inverso de Sune. Pon la cabeza del pez atrás-derecha (o adelante-derecha para la variante R\' U\' R).',
    triggers: ['Extract R'],
    tags: ['2-Look OLL', 'Cruz', 'Pez'],
    grip: 'Home grip',
    auf: 'Esquina orientada en UBR (atrás-derecha)',
  },
  {
    id: 'oll-27',
    code: 'OLL 27',
    name: 'Sune (Pez Horario)',
    stage: 'OLL',
    subcategory: 'Cross / OCLL',
    isTwoLook: true,
    alg: "R U R' U R U2 R'",
    altAlg: "L' U2 L U L' U L",
    altAlgs: [
      "L' U2 L U L' U L",
      "R' U2 R U R' U R",
    ],
    recognition:
      'Cruz amarilla con 1 sola esquina orientada (adelante-izquierda ULF) y sticker amarillo frontal-derecho mirándote.',
    explanation:
      '[2-Look OLL] El algoritmo fundamental de OLL: extrae el par, empújalo con U, vuelve a subir R y regresa con U2 R\'.',
    triggers: ['Sune', 'Insert R'],
    tags: ['2-Look OLL', 'Cruz', 'Pez'],
    grip: 'Home grip',
    auf: 'Esquina orientada en ULF (adelante-izquierda)',
  },

  // ============================================================================
  // 2. DOT CASES (8 Casos: OLL 1, 2, 3, 4, 17, 18, 19, 20)
  // ============================================================================
  {
    id: 'oll-01',
    code: 'OLL 01',
    name: 'Dot — Runway (Barras Laterales)',
    stage: 'OLL',
    subcategory: 'Dot Cases',
    alg: "R U2 R2 F R F' U2 R' F R F'",
    altAlg: "R U B' R B R2 U' R' F R F'",
    altAlgs: [
      "R U B' R B R2 U' R' F R F'",
    ],
    recognition:
      'Solo el centro amarillo arriba; dos barras laterales completas 1×3 en L y R.',
    explanation:
      'Coloca las barras de 3 stickers a izquierda y derecha. Combina R U2 R2 con dos Sledgehammers.',
    triggers: ['Sledgehammer'],
    tags: ['Punto central', 'Barra 1×3'],
    grip: 'Home grip',
    auf: 'Barras 1×3 a IZQUIERDA y DERECHA',
  },
  {
    id: 'oll-02',
    code: 'OLL 02',
    name: 'Dot — Zamboni (2-Look Punto a Cruz)',
    stage: 'OLL',
    subcategory: 'Dot Cases',
    isTwoLook: true,
    alg: "F R U R' U' F' f R U R' U' f'",
    altAlg: "r U r' U2 r U2 R' U2 R U' r'",
    altAlgs: [
      "r U r' U2 r U2 R' U2 R U' r'",
    ],
    recognition:
      'Solo el centro amarillo arriba; barra 1×3 a la izquierda y faros a la derecha.',
    explanation:
      '[2-Look OLL Aristas] Concatena el algoritmo de Línea (F Sexy F\') + el de L pequeña (f Sexy f\') para crear la cruz desde cualquier caso de punto.',
    triggers: ['Sexy Move'],
    tags: ['2-Look OLL', 'Punto central', 'Barra 1×3', 'Faros'],
    grip: 'Home grip',
    auf: 'Barra 1×3 a la IZQUIERDA, faros a la DERECHA',
  },
  {
    id: 'oll-03',
    code: 'OLL 03',
    name: 'Dot — Anti-Pinwheel (1 Esquina Abajo-Der)',
    stage: 'OLL',
    subcategory: 'Dot Cases',
    alg: "f R U R' U' f' U' F R U R' U' F'",
    altAlg: "r' R2 U R' U r U2 r' U M'",
    altAlgs: [
      "r' R2 U R' U r U2 r' U M'",
    ],
    recognition:
      'Punto central + 1 esquina orientada en adelante-derecha (UFR).',
    explanation:
      'Es simplemente f (R U R\' U\') f\' + U\' + F (R U R\' U\') F\'. Muy fácil si ya sabes 2-Look OLL.',
    triggers: ['Sexy Move'],
    tags: ['Punto central'],
    grip: 'Home grip',
    auf: 'Esquina orientada en UFR (adelante-derecha)',
  },
  {
    id: 'oll-04',
    code: 'OLL 04',
    name: 'Dot — Pinwheel (1 Esquina Abajo-Izq)',
    stage: 'OLL',
    subcategory: 'Dot Cases',
    alg: "f R U R' U' f' U F R U R' U' F'",
    altAlg: "M U' r U2 r' U' R U' R' M'",
    altAlgs: [
      "M U' r U2 r' U' R U' R' M'",
    ],
    recognition:
      'Punto central + 1 esquina orientada en adelante-izquierda (ULF).',
    explanation:
      'Espejo de OLL 03: cambia el U\' intermedio por un U normal entre f Sexy f\' y F Sexy F\'.',
    triggers: ['Sexy Move'],
    tags: ['Punto central'],
    grip: 'Home grip',
    auf: 'Esquina orientada en ULF (adelante-izquierda)',
  },
  {
    id: 'oll-17',
    code: 'OLL 17',
    name: 'Dot — Slash / Diagonal',
    stage: 'OLL',
    subcategory: 'Dot Cases',
    alg: "R U R' U R' F R F' U2 R' F R F'",
    altAlg: "F R' F' R2 r' U R U' R' U' M'",
    altAlgs: [
      "F R' F' R2 r' U R U' R' U' M'",
    ],
    recognition:
      'Punto central con 2 esquinas diagonalmente opuestas orientadas (barra diagonal de 3 piezas).',
    explanation:
      'Coloca las esquinas orientadas en ULF y UBR. Es R U R\' U + Sledgehammer + U2 + Sledgehammer.',
    triggers: ['Insert R', 'Sledgehammer'],
    tags: ['Punto central', 'Diagonal'],
    grip: 'Home grip',
    auf: 'Diagonal desde ULF (adelante-izq) a UBR (atrás-der)',
  },
  {
    id: 'oll-18',
    code: 'OLL 18',
    name: 'Dot — Crown (Corona tras-esquinas)',
    stage: 'OLL',
    subcategory: 'Dot Cases',
    alg: "r U R' U R U2 r2 U' R U' R' U2 r",
    altAlg: "R U2 R2 F R F' U2 M' U R U' r'",
    altAlgs: [
      "R U2 R2 F R F' U2 M' U R U' r'",
    ],
    recognition:
      'Punto central con las 2 esquinas traseras orientadas y faros frontales.',
    explanation:
      'Es un Wide Sune (r U R\' U R U2 r\') fusionado con un Wide Antisune hacia atrás.',
    triggers: ['Insert R'],
    tags: ['Punto central', 'Faros'],
    grip: 'Home grip',
    auf: '2 esquinas orientadas ATRÁS, faros al FRENTE',
  },
  {
    id: 'oll-19',
    code: 'OLL 19',
    name: 'Dot — Bunny (Orejas de Conejo)',
    stage: 'OLL',
    subcategory: 'Dot Cases',
    alg: "r' R U R U R' U' r R2 F R F'",
    altAlg: "M U R U R' U' M' R' F R F'",
    altAlgs: [
      "M U R U R' U' M' R' F R F'",
    ],
    recognition:
      'Punto central con las 2 esquinas de un lado orientadas y las otras 2 apuntando hacia afuera (sin faros).',
    explanation:
      'Inicia con M U (o r\' R U), aplica Sexy Move, regresa M\' y termina con Sledgehammer.',
    triggers: ['Sexy Move', 'Sledgehammer'],
    tags: ['Punto central'],
    grip: 'Home grip',
    auf: '2 esquinas orientadas ATRÁS, sin faros en F',
  },
  {
    id: 'oll-20',
    code: 'OLL 20',
    name: 'Dot — X-Shape / Checkers',
    stage: 'OLL',
    subcategory: 'Dot Cases',
    alg: "r U R' U' M2 U R U' R' U' M'",
    altAlg: "M U R U R' U' M2 U R U' r'",
    altAlgs: [
      "M U R U R' U' M2 U R U' r'",
    ],
    recognition:
      'Las 4 esquinas ya están orientadas formando una X amarilla; las 4 aristas están invertidas.',
    explanation:
      'Simétrico desde cualquier cara. Fluye rápido combinando r, M2 y M\'.',
    triggers: ['Wide Sexy', 'Extract R'],
    tags: ['Punto central'],
    grip: 'Home grip (cualquier cara)',
    auf: 'Cualquier cara (simétrico 4 lados)',
  },

  // ============================================================================
  // 3. SQUARE SHAPES (2 Casos: OLL 5, 6)
  // ============================================================================
  {
    id: 'oll-05',
    code: 'OLL 05',
    name: 'Square — Left Back (Cuadrado 2×2 Atrás-Izq)',
    stage: 'OLL',
    subcategory: 'Square Shapes',
    alg: "r' U2 R U R' U r",
    altAlg: "l' U2 L U L' U l",
    altAlgs: [
      "l' U2 L U L' U l",
    ],
    recognition:
      'Bloque cuadrado amarillo 2×2 en la esquina trasera-izquierda (UBL) o frontal-derecha.',
    explanation:
      '7 movimientos ultra rápidos: es un Wide Antisune desde atrás con r\'.',
    triggers: ['Insert R'],
    tags: ['Bloque 2×2'],
    grip: 'Home grip',
    auf: 'Bloque 2×2 atrás-izquierda (o adelante-der con l\')',
  },
  {
    id: 'oll-06',
    code: 'OLL 06',
    name: 'Square — Right Front (Cuadrado 2×2 Adelante-Izq)',
    stage: 'OLL',
    subcategory: 'Square Shapes',
    alg: "r U2 R' U' R U' r'",
    altAlg: "l U2 L' U' L U' l'",
    altAlgs: [
      "l U2 L' U' L U' l'",
    ],
    recognition:
      'Bloque cuadrado amarillo 2×2 en la esquina frontal-izquierda (ULF) o trasera-derecha.',
    explanation:
      'Espejo de OLL 05: es un Wide Antisune normal (r U2 R\' U\' R U\' r\').',
    triggers: ['Extract R'],
    tags: ['Bloque 2×2'],
    grip: 'Home grip',
    auf: 'Bloque 2×2 adelante-izquierda (ULF)',
  },

  // ============================================================================
  // 4. C-SHAPES (2 Casos: OLL 34, 46)
  // ============================================================================
  {
    id: 'oll-34',
    code: 'OLL 34',
    name: 'C-Shape — City (C mirando al Frente)',
    stage: 'OLL',
    subcategory: 'C-Shapes',
    alg: "R U R2 U' R' F R U R U' F'",
    altAlg: "R U R' U' B' R' F R F' B",
    altAlgs: [
      "R U R' U' B' R' F R F' B",
    ],
    recognition:
      'Forma de C amarilla con la barra horizontal en el medio y las puntas apuntando hacia adelante/atrás.',
    explanation:
      'Sujeta la C mirando hacia el frente (con la barra de 3 en el centro horizontal). Sin rotaciones.',
    tags: ['Faros'],
    grip: 'Home grip',
    auf: 'C abriendo hacia el FRENTE (F)',
  },
  {
    id: 'oll-46',
    code: 'OLL 46',
    name: 'C-Shape — Seein Headlights (C + Barra Der)',
    stage: 'OLL',
    subcategory: 'C-Shapes',
    alg: "R' U' R' F R F' U R",
    altAlg: "R' U' l' U l F' U R",
    altAlgs: [
      "R' U' l' U l F' U R",
    ],
    recognition:
      'Forma de C a la izquierda acompañada de una barra lateral 1×3 amarilla a la derecha.',
    explanation:
      '8 movimientos: R\' U\' + Sledgehammer (R\' F R F\') + U R.',
    triggers: ['Sledgehammer'],
    tags: ['Barra 1×3'],
    grip: 'Home grip',
    auf: 'C a la IZQUIERDA, barra lateral 1×3 a la DERECHA',
  },

  // ============================================================================
  // 5. W-SHAPES (2 Casos: OLL 36, 38)
  // ============================================================================
  {
    id: 'oll-36',
    code: 'OLL 36',
    name: 'W-Shape — Left W (Mario Izquierdo)',
    stage: 'OLL',
    subcategory: 'W-Shapes',
    alg: "L' U' L U' L' U L U L F' L' F",
    altAlg: "R' U' R U' R' U R U R B' R' B",
    altAlgs: [
      "R' U' R U' R' U R U R B' R' B",
      "R U R2 F' U' F U R2 U2 R'",
    ],
    recognition:
      'Escalera en forma de W con esquina superior-derecha y frontal-izquierda orientadas.',
    explanation:
      'Versión zurda fluida o variante diestra con R\' U\' R. Termina con Sledgehammer izquierdo.',
    tags: ['W-Shape'],
    grip: 'Home grip',
    auf: 'Escalera W apuntando arriba-derecha',
  },
  {
    id: 'oll-38',
    code: 'OLL 38',
    name: 'W-Shape — Right W (Mario Derecho)',
    stage: 'OLL',
    subcategory: 'W-Shapes',
    alg: "R U R' U R U' R' U' R' F R F'",
    altAlg: "R U R' U R U' R' U' R' F R F'",
    altAlgs: [],
    recognition:
      'Escalera en forma de W con esquina superior-izquierda y frontal-derecha orientadas.',
    explanation:
      'Muy rápido y ergonómico: extrae el par (R U R\' U), insértalo (R U\' R\' U\') y cierra con Sledgehammer (R\' F R F\').',
    triggers: ['Insert R', 'Extract R', 'Sledgehammer'],
    tags: ['W-Shape'],
    grip: 'Home grip',
    auf: 'Escalera W apuntando arriba-izquierda',
  },

  // ============================================================================
  // 6. CORNERS CORRECT (2 Casos: OLL 28, 57)
  // ============================================================================
  {
    id: 'oll-28',
    code: 'OLL 28',
    name: 'Corners Correct — Stealth (Flecha / 2 Aristas)',
    stage: 'OLL',
    subcategory: 'Corners Correct',
    alg: "r U R' U' r' R U R U' R'",
    altAlg: "M' U M U2 M' U M",
    altAlgs: [
      "M' U M U2 M' U M",
    ],
    recognition:
      'Las 4 esquinas y 2 aristas adyacentes ya están orientadas; solo faltan 2 aristas adyacentes.',
    explanation:
      'Pon las dos aristas desorientadas en UF y UR. Inicia con Wide Sexy (r U R\' U\') y cierra con M U R U\' R\'.',
    triggers: ['Wide Sexy', 'Extract R'],
    tags: ['Esquinas listas'],
    grip: 'Home grip',
    auf: 'Aristas desorientadas en FRENTE (UF) y DERECHA (UR)',
  },
  {
    id: 'oll-57',
    code: 'OLL 57',
    name: 'Corners Correct — H-Line / Mummy (2 Aristas Opuestas)',
    stage: 'OLL',
    subcategory: 'Corners Correct',
    alg: "R U R' U' M' U R U' r'",
    altAlg: "M' U M' U M' U2 M U M U M",
    altAlgs: [
      "M' U M' U M' U2 M U M U M",
    ],
    recognition:
      'Las 4 esquinas y 2 aristas opuestas están orientadas formando una H amarilla completa.',
    explanation:
      'Pon la línea central horizontal: es un Sexy Move (R U R\' U\') seguido de M\' U R U\' r\'.',
    triggers: ['Sexy Move'],
    tags: ['Esquinas listas', 'Barra 1×3'],
    grip: 'Home grip',
    auf: 'Aristas desorientadas en FRENTE (UF) y ATRÁS (UB)',
  },

  // ============================================================================
  // 7. P-SHAPES (4 Casos: OLL 31, 32, 43, 44)
  // ============================================================================
  {
    id: 'oll-31',
    code: 'OLL 31',
    name: 'P-Shape — Couch (P Derecha sin Barra)',
    stage: 'OLL',
    subcategory: 'P-Shapes',
    alg: "R' U' F U R U' R' F' R",
    altAlg: "S' L' U' L U L F' L' f",
    altAlgs: [
      "S' L' U' L U L F' L' f",
    ],
    recognition:
      'Forma de P con bloque 2×2 a la derecha y sticker frontal-izquierdo mirando hacia adelante.',
    explanation:
      '9 movimientos cortos sin rotaciones: R\' U\' F + Inverse Sexy (U R U\' R\') + F\' R.',
    triggers: ['Inverse Sexy'],
    tags: ['Bloque 2×2'],
    grip: 'Home grip',
    auf: 'Bloque 2×2 atrás-derecha, cola en UFL',
  },
  {
    id: 'oll-32',
    code: 'OLL 32',
    name: 'P-Shape — Anti-Couch (P Izquierda con S)',
    stage: 'OLL',
    subcategory: 'P-Shapes',
    alg: "S R U R' U' R' F R f'",
    altAlg: "L U F' U' L' U L F L'",
    altAlgs: [
      "L U F' U' L' U L F L'",
      "R U B' U' R' U R B R'",
    ],
    recognition:
      'Forma de P con bloque 2×2 a la izquierda y sticker frontal-derecho mirando hacia adelante.',
    explanation:
      'La versión moderna usa S + Sexy Move + Sledgehammer cerrando con f\'.',
    triggers: ['Sexy Move', 'Sledgehammer'],
    tags: ['Bloque 2×2'],
    grip: 'Home grip (S con índice derecho)',
    auf: 'Bloque 2×2 atrás-izquierda, cola en UFR',
  },
  {
    id: 'oll-43',
    code: 'OLL 43',
    name: 'P-Shape — Anti-P (Wide F Izquierdo)',
    stage: 'OLL',
    subcategory: 'P-Shapes',
    alg: "f' L' U' L U f",
    altAlg: "R' U' F' U F R",
    altAlgs: [
      "R' U' F' U F R",
    ],
    recognition:
      'Forma de P con bloque a la derecha y barra lateral 1×3 amarilla a la izquierda.',
    explanation:
      '6 movimientos: f\' + Left Sexy (L\' U\' L U) + f, o la alternativa diestra R\' U\' F\' U F R.',
    triggers: ['Left Sexy'],
    tags: ['Bloque 2×2', 'Barra 1×3'],
    grip: 'Home grip',
    auf: 'Barra lateral 1×3 a la IZQUIERDA (o ATRÁS en alt)',
  },
  {
    id: 'oll-44',
    code: 'OLL 44',
    name: 'P-Shape / 2-Look L-Shape (Wide F Sexy)',
    stage: 'OLL',
    subcategory: 'P-Shapes',
    isTwoLook: true,
    alg: "f R U R' U' f'",
    altAlg: "F U R U' R' F'",
    altAlgs: [
      "F U R U' R' F'",
    ],
    recognition:
      'Forma de P (o L pequeña en 2-Look) con bloque a la izquierda y barra lateral 1×3 a la derecha.',
    explanation:
      '[2-Look OLL Aristas] Con la L pequeña en atrás-izquierda (o adelante-derecha con f), ejecuta f + Sexy Move + f\' en 6 movimientos.',
    triggers: ['Sexy Move', 'Inverse Sexy'],
    tags: ['2-Look OLL', 'Bloque 2×2', 'Barra 1×3'],
    grip: 'Home grip',
    auf: 'L pequeña en abajo-derecha (con f) o atrás-izquierda (con F)',
  },

  // ============================================================================
  // 8. T-SHAPES (2 Casos: OLL 33, 45)
  // ============================================================================
  {
    id: 'oll-33',
    code: 'OLL 33',
    name: 'T-Shape — Key (Sexy + Sledge)',
    stage: 'OLL',
    subcategory: 'T-Shapes',
    alg: "R U R' U' R' F R F'",
    altAlg: "F R U' R' U' R U R' F'",
    altAlgs: [
      "F R U' R' U' R U R' F'",
    ],
    recognition:
      'Forma de T acostada con faros mirando hacia adelante y hacia atrás en el lado izquierdo.',
    explanation:
      'Uno de los OLLs más fáciles: Sexy Move (R U R\' U\') + Sledgehammer (R\' F R F\'). Es la segunda mitad del Y-Perm.',
    triggers: ['Sexy Move', 'Sledgehammer'],
    tags: ['Faros', 'Barra 1×3'],
    grip: 'Home grip',
    auf: 'Barra vertical de la T a la DERECHA (R)',
  },
  {
    id: 'oll-45',
    code: 'OLL 45',
    name: 'T-Shape / 2-Look Line (F Sexy F\')',
    stage: 'OLL',
    subcategory: 'T-Shapes',
    isTwoLook: true,
    alg: "F R U R' U' F'",
    altAlg: "f U R U' R' f'",
    altAlgs: [
      "f U R U' R' f'",
    ],
    recognition:
      'Forma de T (o Línea horizontal en 2-Look) con barra lateral 1×3 a la izquierda.',
    explanation:
      '[2-Look OLL Aristas] Con la línea horizontal de izquierda a derecha, ejecuta F + Sexy Move + F\' en 6 movimientos.',
    triggers: ['Sexy Move'],
    tags: ['2-Look OLL', 'Barra 1×3', 'Faros'],
    grip: 'Home grip (F con índice derecho)',
    auf: 'Línea horizontal (izquierda a derecha)',
  },

  // ============================================================================
  // 9. I-SHAPES / LINE (4 Casos: OLL 51, 52, 55, 56)
  // ============================================================================
  {
    id: 'oll-51',
    code: 'OLL 51',
    name: 'I-Shape — Bottlecap (Doble Wide Sexy)',
    stage: 'OLL',
    subcategory: 'I-Shapes',
    alg: "f R U R' U' R U R' U' f'",
    altAlg: "F U R U' R' U R U' R' F'",
    altAlgs: [
      "F U R U' R' U R U' R' F'",
    ],
    recognition:
      'Línea horizontal 1×3 arriba con faros a la izquierda (L) y stickers opuestos a la derecha (R).',
    explanation:
      'Pon la línea horizontal y los faros a la izquierda: es f + Doble Sexy Move + f\'.',
    triggers: ['Sexy Move'],
    tags: ['Barra 1×3', 'Faros'],
    grip: 'Home grip',
    auf: 'Línea horizontal, faros a la IZQUIERDA (L)',
  },
  {
    id: 'oll-52',
    code: 'OLL 52',
    name: 'I-Shape — Rice Cooker (Línea Vertical + Barra)',
    stage: 'OLL',
    subcategory: 'I-Shapes',
    alg: "R U R' U R U' B U' B' R'",
    altAlg: "R' F' U' F U' R U R' U R",
    altAlgs: [
      "R' F' U' F U' R U R' U R",
      "R U R' U R d' R U' R' F' y",
    ],
    recognition:
      'Línea vertical 1×3 arriba con barra lateral 1×3 a la derecha y faros a la izquierda.',
    explanation:
      'Coloca la línea vertical (de frente a atrás) y usa la variante RUF (R\' F\' U\' F U\' R U R\' U R) o R U B.',
    triggers: ['Insert R'],
    tags: ['Barra 1×3', 'Faros'],
    grip: 'Home grip',
    auf: 'Línea vertical (F a B)',
  },
  {
    id: 'oll-55',
    code: 'OLL 55',
    name: 'I-Shape — Highway (2 Barras Laterales 1×3)',
    stage: 'OLL',
    subcategory: 'I-Shapes',
    alg: "R' F R U R U' R2 F' R2 U' R' U R U R'",
    altAlg: "R U2 R2 U' R U' R' U2 F R F'",
    altAlgs: [
      "R U2 R2 U' R U' R' U2 F R F'",
    ],
    recognition:
      'Línea vertical 1×3 arriba y dos barras laterales 1×3 completas a izquierda y derecha.',
    explanation:
      'Coloca la línea vertical y las barras de 3 a izquierda y derecha. La alternativa de 11 movimientos con F R F\' es muy fácil de aprender.',
    triggers: ['Insert R'],
    tags: ['Barra 1×3'],
    grip: 'Home grip',
    auf: 'Línea vertical, barras 1×3 a IZQUIERDA y DERECHA',
  },
  {
    id: 'oll-56',
    code: 'OLL 56',
    name: 'I-Shape — Streetlights (2 Faros Laterales)',
    stage: 'OLL',
    subcategory: 'I-Shapes',
    alg: "r' U' r U' R' U R U' R' U R r' U r",
    altAlg: "F R U R' U' R F' r U R' U' r'",
    altAlgs: [
      "F R U R' U' R F' r U R' U' r'",
    ],
    recognition:
      'Línea horizontal 1×3 arriba con faros en ambos lados (izquierda y derecha).',
    explanation:
      'Sujeta la línea horizontal: r\' U\' r + dos veces (U\' R\' U R) + r\' U r.',
    triggers: ['Sexy Move', 'Wide Sexy'],
    tags: ['Barra 1×3', 'Faros'],
    grip: 'Home grip',
    auf: 'Línea horizontal, faros a IZQUIERDA y DERECHA',
  },

  // ============================================================================
  // 10. FISH SHAPES (4 Casos: OLL 9, 10, 35, 37)
  // ============================================================================
  {
    id: 'oll-09',
    code: 'OLL 09',
    name: 'Fish — Kite (Pez Derecho)',
    stage: 'OLL',
    subcategory: 'Fish Shapes',
    alg: "R U R' U' R' F R2 U R' U' F'",
    altAlg: "R' U' R U' R' U R' F R F' U R",
    altAlgs: [
      "R' U' R U' R' U R' F R F' U R",
    ],
    recognition:
      'Pez apuntando atrás-derecha sin barra 2×2; el sticker frontal mira a la derecha.',
    explanation:
      'Empieza igual que un T-Perm (R U R\' U\' R\' F R2) pero continúa con U R\' U\' F\'.',
    triggers: ['Sexy Move'],
    tags: ['Pez'],
    grip: 'Home grip',
    auf: 'Punta del pez hacia atrás-izquierda (UBL)',
  },
  {
    id: 'oll-10',
    code: 'OLL 10',
    name: 'Fish — Anti-Kite (Pez Izquierdo)',
    stage: 'OLL',
    subcategory: 'Fish Shapes',
    alg: "R U R' U R' F R F' R U2 R'",
    altAlg: "F U F' R' F R U' R' F' R",
    altAlgs: [
      "F U F' R' F R U' R' F' R",
    ],
    recognition:
      'Pez apuntando adelante-izquierda; es un Sune con un Sledgehammer insertado en medio.',
    explanation:
      '¡Súper fácil! Es un Sune normal (R U R\' U ... R U2 R\') con un Sledgehammer (R\' F R F\') en la mitad.',
    triggers: ['Insert R', 'Sledgehammer'],
    tags: ['Pez'],
    grip: 'Home grip',
    auf: 'Esquina aislada atrás-derecha (UBR)',
  },
  {
    id: 'oll-35',
    code: 'OLL 35',
    name: 'Fish — Fish Salad (Pez Diagonal Largo)',
    stage: 'OLL',
    subcategory: 'Fish Shapes',
    alg: "R U2 R2 F R F' R U2 R'",
    altAlg: "f R U R' U' f' R U R' U R U2 R'",
    altAlgs: [
      "f R U R' U' f' R U R' U R U2 R'",
    ],
    recognition:
      'Bloque 2×2 con una esquina diagonal opuesta orientada (pez con cola diagonal sin faros).',
    explanation:
      'Solo 9 movimientos: R U2 R2 + Sledgehammer (F R F\') + R U2 R\'.',
    tags: ['Pez', 'Diagonal', 'Bloque 2×2'],
    grip: 'Home grip',
    auf: 'Esquina suelta adelante-izquierda, cuerpo atrás-der',
  },
  {
    id: 'oll-37',
    code: 'OLL 37',
    name: 'Fish — Mounted Fish (Primera Mitad Y-Perm)',
    stage: 'OLL',
    subcategory: 'Fish Shapes',
    alg: "F R' F' R U R U' R'",
    altAlg: "F R U' R' U' R U R' F'",
    altAlgs: [
      "F R U' R' U' R U R' F'",
    ],
    recognition:
      'Bloque 2×2 adelante-izquierda con esquina trasera-derecha orientada (faros laterales).',
    explanation:
      '8 movimientos: Hedgeslammer (F R\' F\' R) + Inverse Sexy (U R U\' R\'), o la primera mitad del Y-Perm.',
    triggers: ['Hedgeslammer', 'Inverse Sexy'],
    tags: ['Pez', 'Bloque 2×2', 'Diagonal'],
    grip: 'Home grip',
    auf: 'Bloque 2×2 adelante-izquierda (ULF)',
  },

  // ============================================================================
  // 11. KNIGHT MOVE SHAPES (4 Casos: OLL 13, 14, 15, 16)
  // ============================================================================
  {
    id: 'oll-13',
    code: 'OLL 13',
    name: 'Knight Move — Gun (Caballo Derecho)',
    stage: 'OLL',
    subcategory: 'Knight Move Shapes',
    alg: "F U R U' R2 F' R U R U' R'",
    altAlg: "r U' r' U' r U r' F' U F",
    altAlgs: [
      "r U' r' U' r U r' F' U F",
    ],
    recognition:
      'Línea horizontal 1×3 con 1 esquina conectada abajo-izquierda y faros al frente.',
    explanation:
      'Pon la línea horizontal y el bloque 2×1 adelante: F U R U\' R2 F\' + R U R U\' R\'.',
    triggers: ['Extract R'],
    tags: ['Caballo', 'Barra 1×3'],
    grip: 'Home grip',
    auf: 'Línea horizontal, esquina en ULF',
  },
  {
    id: 'oll-14',
    code: 'OLL 14',
    name: 'Knight Move — Anti-Gun (Caballo Izquierdo)',
    stage: 'OLL',
    subcategory: 'Knight Move Shapes',
    alg: "R' F R U R' F' R F U' F'",
    altAlg: "r' U r U r' U' r y R U' R' y'",
    altAlgs: [
      "r' U r U r' U' r y R U' R' y'",
    ],
    recognition:
      'Línea horizontal 1×3 con 1 esquina conectada abajo-derecha y faros al frente.',
    explanation:
      '10 movimientos muy ergonómicos: Sledgehammer modificado (R\' F R U R\' F\' R) + F U\' F\'.',
    tags: ['Caballo', 'Barra 1×3'],
    grip: 'Home grip',
    auf: 'Línea horizontal, esquina en UFR',
  },
  {
    id: 'oll-15',
    code: 'OLL 15',
    name: 'Knight Move — Squeegee Izquierdo',
    stage: 'OLL',
    subcategory: 'Knight Move Shapes',
    alg: "r' U' r R' U' R U r' U r",
    altAlg: "l' U' l L' U' L U l' U l",
    altAlgs: [
      "l' U' l L' U' L U l' U l",
    ],
    recognition:
      'Forma de caballo (L de 4 piezas) sin faros frontales; barra 2×1 lateral a la derecha.',
    explanation:
      'Simétrico y limpio: r\' U\' r + (R\' U\' R U) + r\' U r.',
    tags: ['Caballo', 'Barra 1×3'],
    grip: 'Home grip',
    auf: 'Línea horizontal, esquina orientada atrás-derecha',
  },
  {
    id: 'oll-16',
    code: 'OLL 16',
    name: 'Knight Move — Anti-Squeegee Derecho',
    stage: 'OLL',
    subcategory: 'Knight Move Shapes',
    alg: "r U r' R U R' U' r U' r'",
    altAlg: "r U r' U R U' R' r U' r'",
    altAlgs: [
      "r U r' U R U' R' r U' r'",
    ],
    recognition:
      'Forma de caballo (L de 4 piezas) con esquina orientada atrás-izquierda y barra 2×1 a la izquierda.',
    explanation:
      '9 movimientos: r U r\' + Sexy Move (R U R\' U\') + r U\' r\'.',
    triggers: ['Sexy Move'],
    tags: ['Caballo', 'Barra 1×3'],
    grip: 'Home grip',
    auf: 'Línea horizontal, esquina orientada atrás-izquierda',
  },

  // ============================================================================
  // 12. AWKWARD SHAPES (4 Casos: OLL 29, 30, 41, 42)
  // ============================================================================
  {
    id: 'oll-29',
    code: 'OLL 29',
    name: 'Awkward — Spotted Chameleon (Derecho)',
    stage: 'OLL',
    subcategory: 'Awkward Shapes',
    alg: "R U R' U' R U' R' F' U' F R U R'",
    altAlg: "r2 D' r U r' D r2 U' r' U' r",
    altAlgs: [
      "r2 D' r U r' D r2 U' r' U' r",
    ],
    recognition:
      '4 piezas en T truncada + 1 esquina conectada sin faros en la última capa.',
    explanation:
      'Inicia con Sexy Move (R U R\' U\'), extrae con R U\' R\', inserta en F (F\' U\' F) y cierra con R U R\'.',
    triggers: ['Sexy Move', 'Extract R', 'Insert R'],
    tags: ['Awkward'],
    grip: 'Home grip',
    auf: 'Bloque 2×1 arriba-derecha, faros atrás',
  },
  {
    id: 'oll-30',
    code: 'OLL 30',
    name: 'Awkward — Anti-Spotted Chameleon (Izquierdo)',
    stage: 'OLL',
    subcategory: 'Awkward Shapes',
    alg: "F R' F R2 U' R' U' R U R' F2",
    altAlg: "r' D' r U' r' D r2 U' r' U r U r'",
    altAlgs: [
      "r' D' r U' r' D r2 U' r' U r U r'",
    ],
    recognition:
      'Espejo de OLL 29: 4 piezas en T truncada con un par de faros laterales.',
    explanation:
      'Empieza con F R\' F R2 y continúa con el final exacto de un T-Perm terminando en F2.',
    triggers: ['Insert R'],
    tags: ['Awkward', 'Faros'],
    grip: 'Home grip',
    auf: 'Faros mirando hacia el FRENTE (F)',
  },
  {
    id: 'oll-41',
    code: 'OLL 41',
    name: 'Awkward — Dalmation (Sune + F Sexy F\')',
    stage: 'OLL',
    subcategory: 'Awkward Shapes',
    alg: "R U R' U R U2 R' F R U R' U' F'",
    altAlg: "F U R2 D R' U' R D' R2 F'",
    altAlgs: [
      "F U R2 D R' U' R D' R2 F'",
    ],
    recognition:
      'Forma awkward con faros mirando hacia el frente (o atrás) en las dos esquinas desorientadas.',
    explanation:
      '¡Cero esfuerzo de memoria! Es un Sune completo (R U R\' U R U2 R\') seguido de F (R U R\' U\') F\'.',
    triggers: ['Sune', 'Sexy Move'],
    tags: ['Awkward', 'Faros'],
    grip: 'Home grip',
    auf: 'Faros mirando hacia ATRÁS (B)',
  },
  {
    id: 'oll-42',
    code: 'OLL 42',
    name: 'Awkward — Anti-Dalmation (R\' U\' R + F Sexy F\')',
    stage: 'OLL',
    subcategory: 'Awkward Shapes',
    alg: "R' U' R U' R' U2 R F R U R' U' F'",
    altAlg: "R' F R F' R' F R F' R U R' U' R U R'",
    altAlgs: [
      "R' F R F' R' F R F' R U R' U' R U R'",
    ],
    recognition:
      'Espejo de OLL 41 con faros mirando hacia el frente.',
    explanation:
      'Igual de fácil: Back-Antisune (R\' U\' R U\' R\' U2 R) seguido directamente de F (R U R\' U\') F\'.',
    triggers: ['Sexy Move'],
    tags: ['Awkward', 'Faros'],
    grip: 'Home grip',
    auf: 'Faros mirando hacia el FRENTE (F)',
  },

  // ============================================================================
  // 13. L-SHAPES / SMALL L (6 Casos: OLL 47, 48, 49, 50, 53, 54)
  // ============================================================================
  {
    id: 'oll-47',
    code: 'OLL 47',
    name: 'L-Shape — Anti-Breakneck (Doble Left Sexy)',
    stage: 'OLL',
    subcategory: 'L-Shapes',
    alg: "F' L' U' L U L' U' L U F",
    altAlg: "R' U' R' F R F' R' F R F' U R",
    altAlgs: [
      "R' U' R' F R F' R' F R F' U R",
    ],
    recognition:
      'L pequeña arriba sin esquinas orientadas; faros a la derecha y stickers opuestos al frente.',
    explanation:
      'Puedes ejecutar F\' + Doble Left Sexy + F, o la versión diestra R\' U\' + Doble Sledgehammer + U R.',
    triggers: ['Left Sexy', 'Sledgehammer'],
    tags: ['L-Shape', 'Faros'],
    grip: 'Home grip',
    auf: 'Faros a la DERECHA (o a la IZQUIERDA en alt)',
  },
  {
    id: 'oll-48',
    code: 'OLL 48',
    name: 'L-Shape — Breakneck (F + Doble Sexy + F\')',
    stage: 'OLL',
    subcategory: 'L-Shapes',
    alg: "F R U R' U' R U R' U' F'",
    altAlg: "f U R U' R' U R U' R' f'",
    altAlgs: [
      "f U R U' R' U R U' R' f'",
    ],
    recognition:
      'L pequeña atrás-izquierda sin esquinas orientadas; faros a la izquierda y opuestos al frente.',
    explanation:
      'Uno de los más fáciles de Full OLL: coloca la L pequeña atrás-izquierda y haz F + 2 Sexy Moves + F\'.',
    triggers: ['Sexy Move'],
    tags: ['L-Shape', 'Faros'],
    grip: 'Home grip',
    auf: 'L pequeña atrás-izquierda, faros a la IZQUIERDA',
  },
  {
    id: 'oll-49',
    code: 'OLL 49',
    name: 'L-Shape — Right Back Squeezy (r U\' r2)',
    stage: 'OLL',
    subcategory: 'L-Shapes',
    alg: "r U' r2 U r2 U r2 U' r",
    altAlg: "R B' R2 F R2 B R2 F' R",
    altAlgs: [
      "R B' R2 F R2 B R2 F' R",
    ],
    recognition:
      'L pequeña arriba con barra 1×3 frontal y faros a la derecha.',
    explanation:
      '9 movimientos rítmicos con doble capa derecha: r U\' r2 U r2 U r2 U\' r.',
    tags: ['L-Shape', 'Barra 1×3', 'Faros'],
    grip: 'Home grip',
    auf: 'Barra 1×3 en FRENTE (F), faros a la DERECHA (R)',
  },
  {
    id: 'oll-50',
    code: 'OLL 50',
    name: 'L-Shape — Right Front Squeezy (r\' U r2)',
    stage: 'OLL',
    subcategory: 'L-Shapes',
    alg: "r' U r2 U' r2 U' r2 U r'",
    altAlg: "R' F R2 B' R2 F' R2 B R'",
    altAlgs: [
      "R' F R2 B' R2 F' R2 B R'",
    ],
    recognition:
      'L pequeña arriba con barra 1×3 atrás y faros a la derecha.',
    explanation:
      'Inverso de OLL 49: r\' U r2 U\' r2 U\' r2 U r\'.',
    tags: ['L-Shape', 'Barra 1×3', 'Faros'],
    grip: 'Home grip',
    auf: 'Barra 1×3 ATRÁS (B), faros a la DERECHA (R)',
  },
  {
    id: 'oll-53',
    code: 'OLL 53',
    name: 'L-Shape — Frying Pan (Barra Atrás)',
    stage: 'OLL',
    subcategory: 'L-Shapes',
    alg: "r' U' R U' R' U R U' R' U2 r",
    altAlg: "l' U' L U' L' U L U' L' U2 l",
    altAlgs: [
      "l' U' L U' L' U L U' L' U2 l",
    ],
    recognition:
      'L pequeña arriba con una barra lateral 1×3 completa en la cara trasera o frontal.',
    explanation:
      'Es un doble Antisune comenzando y terminando con movimientos wide r\'.',
    tags: ['L-Shape', 'Barra 1×3'],
    grip: 'Home grip',
    auf: 'Barra 1×3 en el FRENTE (con l\') o ATRÁS (con r\')',
  },
  {
    id: 'oll-54',
    code: 'OLL 54',
    name: 'L-Shape — Anti-Frying Pan (Barra Frente)',
    stage: 'OLL',
    subcategory: 'L-Shapes',
    alg: "r U R' U R U' R' U R U2 r'",
    altAlg: "r U2 R' U' R U R' U' R U' r'",
    altAlgs: [
      "r U2 R' U' R U R' U' R U' r'",
    ],
    recognition:
      'L pequeña arriba con barra 1×3 adelante y faros atrás.',
    explanation:
      'Es un Double Sune con inicio en r y cierre en r\' (r U R\' U R U\' R\' U R U2 r\').',
    triggers: ['Insert R', 'Extract R'],
    tags: ['L-Shape', 'Barra 1×3', 'Faros'],
    grip: 'Home grip',
    auf: 'Barra 1×3 en el FRENTE (F)',
  },

  // ============================================================================
  // 14. LIGHTNING BOLTS (6 Casos: OLL 7, 8, 11, 12, 39, 40)
  // ============================================================================
  {
    id: 'oll-07',
    code: 'OLL 07',
    name: 'Lightning — Wide Sune (Rayo Derecho)',
    stage: 'OLL',
    subcategory: 'Lightning Bolts',
    alg: "r U R' U R U2 r'",
    altAlg: "L' U2 L U2 L F' L' F",
    altAlgs: [
      "L' U2 L U2 L F' L' F",
    ],
    recognition:
      'Rayo corto (z-bolt) con esquina orientada adelante-izquierda y bloque 2×1 a la derecha.',
    explanation:
      '7 movimientos: exactamente un Sune cambiando el primer R por r y el último R\' por r\'.',
    triggers: ['Insert R'],
    tags: ['Rayo'],
    grip: 'Home grip',
    auf: 'Esquina orientada en ULF (adelante-izquierda)',
  },
  {
    id: 'oll-08',
    code: 'OLL 08',
    name: 'Lightning — Left Wide Sune (Rayo Izquierdo)',
    stage: 'OLL',
    subcategory: 'Lightning Bolts',
    alg: "l' U' L U' L' U2 l",
    altAlg: "r' U' R U' R' U2 r",
    altAlgs: [
      "r' U' R U' R' U2 r",
      "R U2 R' U2 R' F R F'",
    ],
    recognition:
      'Rayo corto simétrico a OLL 07 con esquina orientada adelante-derecha (o atrás-izquierda).',
    explanation:
      'Wide Sune izquierdo (l\' U\' L U\' L\' U2 l) o con r\' desde atrás.',
    triggers: ['Sledgehammer'],
    tags: ['Rayo'],
    grip: 'Home grip',
    auf: 'Esquina orientada en UFR (con l\') o UBL (con r\')',
  },
  {
    id: 'oll-11',
    code: 'OLL 11',
    name: 'Lightning — Downstairs (Rayo con Barra Atrás)',
    stage: 'OLL',
    subcategory: 'Lightning Bolts',
    alg: "r U R' U R' F R F' R U2 r'",
    altAlg: "r' R2 U R' U R U2 R' U M'",
    altAlgs: [
      "r' R2 U R' U R U2 R' U M'",
    ],
    recognition:
      'Rayo corto con barra 2×1 lateral y esquina trasera-derecha orientada.',
    explanation:
      'Es igual que OLL 10 (Sune con Sledgehammer en medio) pero iniciando con r y terminando con r\'.',
    triggers: ['Insert R', 'Sledgehammer'],
    tags: ['Rayo'],
    grip: 'Home grip',
    auf: 'Esquina orientada atrás-derecha (UBR)',
  },
  {
    id: 'oll-12',
    code: 'OLL 12',
    name: 'Lightning — Upstairs (M\' R\' U\' R)',
    stage: 'OLL',
    subcategory: 'Lightning Bolts',
    alg: "M' R' U' R U' R' U2 R U' R r'",
    altAlg: "F R U R' U' F' U F R U R' U' F'",
    altAlgs: [
      "F R U R' U' F' U F R U R' U' F'",
    ],
    recognition:
      'Rayo corto simétrico a OLL 11 con esquina orientada atrás-izquierda.',
    explanation:
      'Puedes usar la versión rápida con M\' o la versión intuitiva: F Sexy F\' + U + F Sexy F\'.',
    triggers: ['Sexy Move'],
    tags: ['Rayo'],
    grip: 'Home grip',
    auf: 'Esquina orientada atrás-izquierda (UBL)',
  },
  {
    id: 'oll-39',
    code: 'OLL 39',
    name: 'Lightning — Big Lightning Derecho (Fung)',
    stage: 'OLL',
    subcategory: 'Lightning Bolts',
    alg: "L F' L' U' L U F U' L'",
    altAlg: "f' r U r' U' r' F r S",
    altAlgs: [
      "f' r U r' U' r' F r S",
      "R U R' F' U' F U R U2 R'",
    ],
    recognition:
      'Rayo grande (línea de 3 con dos puntas opuestas) con bloque 2×1 frontal.',
    explanation:
      '9 movimientos cortos: L F\' + Left Sexy (L\' U\' L U) + F U\' L\'.',
    triggers: ['Left Sexy'],
    tags: ['Rayo', 'Barra 1×3'],
    grip: 'Home grip',
    auf: 'Línea central horizontal, punta izq hacia atrás',
  },
  {
    id: 'oll-40',
    code: 'OLL 40',
    name: 'Lightning — Big Lightning Izquierdo (Anti-Fung)',
    stage: 'OLL',
    subcategory: 'Lightning Bolts',
    alg: "R' F R U R' U' F' U R",
    altAlg: "f R' F' R U R U' R' S'",
    altAlgs: [
      "f R' F' R U R U' R' S'",
    ],
    recognition:
      'Rayo grande simétrico a OLL 39 con punta derecha hacia atrás y punta izquierda hacia el frente.',
    explanation:
      '9 movimientos diestros súper fluidos: R\' F + Sexy Move (R U R\' U\') + F\' U R.',
    triggers: ['Sexy Move'],
    tags: ['Rayo', 'Barra 1×3'],
    grip: 'Home grip',
    auf: 'Línea central horizontal, punta der hacia atrás',
  },
];
