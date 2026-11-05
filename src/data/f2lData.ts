import type { CfopCase } from '../types/cfop';

export const F2L_SUBCATEGORIES: string[] = [
  'Todos',
  'Casos Básicos / Inserciones directas',
  'Esquina y arista separadas en capa U',
  'Pares conectados en capa U mal orientados',
  'Esquina en el slot, arista en capa U',
  'Arista en el slot, esquina en capa U',
  'Ambos en el slot pero mal orientados',
];

export const ESSENTIAL_F2L_IDS = new Set<string>([
  'f2l-01',
  'f2l-02',
  'f2l-03',
  'f2l-04',
  'f2l-05',
  'f2l-06',
  'f2l-15',
  'f2l-23',
  'f2l-29',
  'f2l-35',
  'f2l-40',
]);

export const F2L_CASES: CfopCase[] = [
  // ============================================================================
  // 1. CASOS BÁSICOS / INSERCIONES DIRECTAS (4 Casos: F2L 01–04)
  // ============================================================================
  {
    id: 'f2l-01',
    code: 'F2L 01',
    name: 'Par Unido — Inserción Derecha (Inverse Sexy)',
    stage: 'F2L',
    subcategory: 'Casos Básicos / Inserciones directas',
    isTwoLook: true,
    alg: "U R U' R'",
    altAlg: "R' F R F'",
    altAlgs: [
      "R' F R F'",
    ],
    recognition:
      'Par 2×1 ya unido en la capa U apuntando a la derecha (arista en UB, esquina en UFR).',
    explanation:
      'Aparta el par con U, abre el slot con R, inserta con U\' y cierra con R\'. Usa Sledgehammer (R\' F R F\') si quieres orientar aristas de U.',
    triggers: ['Inverse Sexy', 'Sledgehammer'],
    tags: ['Par unido', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina sobre slot FR, arista atrás (UB)',
  },
  {
    id: 'f2l-02',
    code: 'F2L 02',
    name: 'Par Unido — Inserción Frontal',
    stage: 'F2L',
    subcategory: 'Casos Básicos / Inserciones directas',
    isTwoLook: true,
    alg: "U' F' U F",
    altAlg: "F R' F' R",
    altAlgs: [
      "F R' F' R",
      "y' U' R' U R y",
    ],
    recognition:
      'Par 2×1 ya unido en la capa U apuntando hacia el frente (arista en UL, esquina en UFR).',
    explanation:
      'Evita rotar el cubo ejecutando U\' F\' U F con índice/pulgar o Hedgeslammer (F R\' F\' R).',
    triggers: ['Hedgeslammer'],
    tags: ['Par unido', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Par unido en cara izquierda mirando al frente',
  },
  {
    id: 'f2l-03',
    code: 'F2L 03',
    name: 'Inserción Directa Frontal (3 Movs)',
    stage: 'F2L',
    subcategory: 'Casos Básicos / Inserciones directas',
    isTwoLook: true,
    alg: "F' U' F",
    altAlg: "y' R' U' R y",
    altAlgs: [
      "y' R' U' R y",
    ],
    recognition:
      'Esquina en UFR con el color de la cruz mirando al frente y arista en UB con colores superiores opuestos.',
    explanation:
      'Al levantar F\' la esquina se une instantáneamente con la arista trasera; insértalas con U\' F.',
    tags: ['Colores opuestos', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR (blanco al frente), arista en UB',
  },
  {
    id: 'f2l-04',
    code: 'F2L 04',
    name: 'Inserción Directa Derecha (3 Movs)',
    stage: 'F2L',
    subcategory: 'Casos Básicos / Inserciones directas',
    isTwoLook: true,
    alg: "R U R'",
    altAlg: "R U R'",
    altAlgs: [],
    recognition:
      'Esquina en UFR con el color de la cruz mirando a la derecha y arista en UL con colores superiores opuestos.',
    explanation:
      'El caso más rápido de F2L: levantar R une ambas piezas atrás y U R\' las guarda en el slot.',
    triggers: ['Insert R'],
    tags: ['Colores opuestos', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR (blanco a la derecha), arista en UL',
  },

  // ============================================================================
  // 2. ESQUINA Y ARISTA SEPARADAS EN CAPA U (18 Casos: F2L 05–22)
  // ============================================================================
  {
    id: 'f2l-05',
    code: 'F2L 05',
    name: 'Separadas — Colores Iguales (Esconder Derecha)',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    isTwoLook: true,
    alg: "U' R U R' U2 R U' R'",
    altAlg: "U' R U R' U' R U2 R'",
    altAlgs: [
      "U' R U R' U' R U2 R'",
    ],
    recognition:
      'Esquina en UFR (blanco a la derecha) y arista en UB con el MISMO color en la cara superior.',
    explanation:
      'Aleja con U\', esconde la esquina con R, coloca la arista al lado con U, sube R\' y mete el par con U2 R U\' R\'.',
    triggers: ['Insert R', 'Extract R'],
    tags: ['Colores iguales', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR, arista atrás (UB)',
  },
  {
    id: 'f2l-06',
    code: 'F2L 06',
    name: 'Separadas — Colores Iguales (Esconder Frente)',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    isTwoLook: true,
    alg: "U F' U' F U2 F' U F",
    altAlg: "y' U R' U' R U2 R' U R y",
    altAlgs: [
      "y' U R' U' R U2 R' U R y",
      "U' r U' R' U R U r'",
    ],
    recognition:
      'Esquina en UFR (blanco al frente) y arista en UL con el MISMO color en la cara superior.',
    explanation:
      'La variante U\' r U\' R\' U R U r\' resuelve este caso en 2-gen wide sin rotar ni usar F.',
    tags: ['Colores iguales', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR, arista a la izquierda (UL)',
  },
  {
    id: 'f2l-07',
    code: 'F2L 07',
    name: 'Separadas — Colores Iguales Lejanos (Derecha)',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "U' R U2 R' U2 R U' R'",
    altAlg: "U' R U2 R' U R U R'",
    altAlgs: [
      "U' R U2 R' U R U R'",
    ],
    recognition:
      'Esquina en UFR (blanco a la derecha) y arista en UL con el mismo color arriba.',
    explanation:
      'Esconde la esquina con U\' R, acerca la arista con U2, sube R\' e inserta el par armado.',
    triggers: ['Extract R'],
    tags: ['Colores iguales', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR, arista en UL',
  },
  {
    id: 'f2l-08',
    code: 'F2L 08',
    name: 'Separadas — Colores Iguales Lejanos (Frente)',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "r' U2 R2 U R2 U r",
    altAlg: "U F' U2 F U2 F' U F",
    altAlgs: [
      "U F' U2 F U2 F' U F",
      "y' U R' U2 R U2 R' U R y",
    ],
    recognition:
      'Esquina en UFR (blanco al frente) y arista en UB con el mismo color arriba.',
    explanation:
      'El truco profesional r\' U2 R2 U R2 U r evita rotaciones y fluye en menos de 0.6 segundos.',
    tags: ['Colores iguales', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR, arista en UB',
  },
  {
    id: 'f2l-09',
    code: 'F2L 09',
    name: 'Separadas — Colores Opuestos (Arista en UB)',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "U' R U' R' U F' U' F",
    altAlg: "F R U R' U' F' R U' R'",
    altAlgs: [
      "F R U R' U' F' R U' R'",
    ],
    recognition:
      'Esquina en UFR (blanco a la derecha) y arista en UB con colores superiores opuestos (arista invertida respecto a R).',
    explanation:
      'Esconde la esquina atrás con U\' R U\' R\' para alinear e insertar por el frente con U F\' U\' F.',
    triggers: ['Extract R', 'Sexy Move'],
    tags: ['Colores opuestos', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR, arista en UB',
  },
  {
    id: 'f2l-10',
    code: 'F2L 10',
    name: 'Separadas — Colores Opuestos (Arista en UL)',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "U' R U R' U R U R'",
    altAlg: "U F' U F U' R U R'",
    altAlgs: [
      "U F' U F U' R U R'",
    ],
    recognition:
      'Esquina en UFR (blanco al frente) y arista en UL con colores superiores opuestos.',
    explanation:
      '100% 2-gen (R y U): U\' R U R\' prepara la inserción directa de 3 movimientos U R U R\'.',
    triggers: ['Insert R'],
    tags: ['Colores opuestos', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR, arista en UL',
  },
  {
    id: 'f2l-11',
    code: 'F2L 11',
    name: 'Separadas — Blanco Arriba + Arista en UB (Derecha)',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "R U2 R' U' R U R'",
    altAlg: "U' R U2 R' U2 R U' R'",
    altAlgs: [
      "U' R U2 R' U2 R U' R'",
    ],
    recognition:
      'Esquina en UFR con el sticker blanco mirando ARRIBA; la arista está en UB con el color frontal arriba.',
    explanation:
      'R U2 R\' voltea la esquina sobre la arista formando el caso básico de 3 movimientos (U\' R U R\').',
    triggers: ['Insert R'],
    tags: ['Blanco arriba', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR (blanco arriba), arista en UB',
  },
  {
    id: 'f2l-12',
    code: 'F2L 12',
    name: 'Separadas — Blanco Arriba + Arista en UL (Frente)',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "F' U2 F U F' U' F",
    altAlg: "R' U2 R2 U R2 U R",
    altAlgs: [
      "R' U2 R2 U R2 U R",
      "y' R' U2 R U R' U' R y",
    ],
    recognition:
      'Esquina en UFR con el sticker blanco mirando ARRIBA; la arista está en UL con el color derecho arriba.',
    explanation:
      'La variante R\' U2 R2 U R2 U R es 100% R/U sin rotar ni usar la cara F.',
    tags: ['Blanco arriba', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR (blanco arriba), arista en UL',
  },
  {
    id: 'f2l-13',
    code: 'F2L 13',
    name: 'Separadas — Blanco Arriba + Alinear Atrás (R U R\')',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "U R U2 R' U R U' R'",
    altAlg: "R U R' U2 R U' R' U R U' R'",
    altAlgs: [
      "R U R' U2 R U' R' U R U' R'",
    ],
    recognition:
      'Esquina en UFR con blanco ARRIBA y arista en UR (mismo color lateral alineado en R).',
    explanation:
      'Pon la arista sobre su centro derecho, empuja con U, une ambas piezas con R U2 R\' e inserta con Inverse Sexy.',
    triggers: ['Inverse Sexy'],
    tags: ['Blanco arriba', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR (blanco arriba), arista en UR',
  },
  {
    id: 'f2l-14',
    code: 'F2L 14',
    name: 'Separadas — Blanco Arriba + Alinear Frente',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "U' F' U2 F U' F' U F",
    altAlg: "y' U' R' U2 R U' R' U R y",
    altAlgs: [
      "y' U' R' U2 R U' R' U R y",
      "F' U' F U2 F' U F U' F' U F",
    ],
    recognition:
      'Esquina en UFR con blanco ARRIBA y arista en UF (mismo color lateral alineado en F).',
    explanation:
      'Simétrico frontal de F2L 13: empuja con U\', une con F\' U2 F e inserta en el frente.',
    tags: ['Blanco arriba', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR (blanco arriba), arista en UF',
  },
  {
    id: 'f2l-15',
    code: 'F2L 15',
    name: 'Separadas — Blanco Arriba + Arista en UL (2-Gen)',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    isTwoLook: true,
    alg: "U2 R U R' U R U' R'",
    altAlg: "R U R' U' U' R U R' U' R U R'",
    altAlgs: [
      "U R U' R' U' R U' R' U R U' R'",
    ],
    recognition:
      'Esquina en UFR con blanco ARRIBA y arista en UL con el color frontal arriba.',
    explanation:
      'Coloca la esquina atrás con U2, únelas levantando R U R\' e inserta el bloque con U R U\' R\'.',
    triggers: ['Insert R', 'Inverse Sexy'],
    tags: ['Blanco arriba', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR (blanco arriba), arista en UL',
  },
  {
    id: 'f2l-16',
    code: 'F2L 16',
    name: 'Separadas — Blanco Arriba + Arista en UB (Frontal)',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "U2 F' U' F U' F' U F",
    altAlg: "y' U2 R' U' R U' R' U R y",
    altAlgs: [
      "y' U2 R' U' R U' R' U R y",
      "U' r U' R' U R U r'",
    ],
    recognition:
      'Esquina en UFR con blanco ARRIBA y arista en UB con el color derecho arriba.',
    explanation:
      'Simétrico de F2L 15: U2 F\' U\' F une el par arriba y U\' F\' U F lo guarda.',
    tags: ['Blanco arriba', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR (blanco arriba), arista en UB',
  },
  {
    id: 'f2l-17',
    code: 'F2L 17',
    name: 'Adyacentes — Blanco a la Derecha, Arista en UF',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "R U' R' U2 F' U' F",
    altAlg: "U R U' R' U' F' U' F",
    altAlgs: [
      "U R U' R' U' F' U' F",
      "R' F R F' R U' R' U R U' R'",
    ],
    recognition:
      'Esquina en UFR (blanco a la derecha) tocando la arista en UF con colores superiores opuestos.',
    explanation:
      'Separa escondiendo la esquina con R U\' R\', alinea con U2 e inserta de frente con F\' U\' F.',
    triggers: ['Extract R'],
    tags: ['Colores opuestos', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR, arista pegada en UF',
  },
  {
    id: 'f2l-18',
    code: 'F2L 18',
    name: 'Adyacentes — Blanco al Frente, Arista en UR',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "F' U F U2 R U R'",
    altAlg: "R U' R' U R U' R' U2 R U' R'",
    altAlgs: [
      "R U' R' U R U' R' U2 R U' R'",
    ],
    recognition:
      'Esquina en UFR (blanco al frente) tocando la arista en UR con colores superiores opuestos.',
    explanation:
      'Puedes separarlas con F\' U F U2 R U R\' o resolverlo 100% 2-gen (R U\' R\' U R U\' R\' U2 R U\' R\').',
    triggers: ['Insert R', 'Extract R'],
    tags: ['Colores opuestos', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR, arista pegada en UR',
  },
  {
    id: 'f2l-19',
    code: 'F2L 19',
    name: 'Adyacentes — Colores Iguales (Arista en UR)',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "R U2 R' U' R U R' U2 R U' R'",
    altAlg: "U' R U' R' U R U R'",
    altAlgs: [
      "U' R U' R' U R U R'",
    ],
    recognition:
      'Esquina en UFR (blanco a la derecha) y arista pegada en UR con el MISMO color arriba.',
    explanation:
      'La versión corta U\' R U\' R\' U R U R\' separa las piezas atrás y las une en solo 7 movimientos.',
    triggers: ['Insert R', 'Extract R'],
    tags: ['Colores iguales', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR, arista en UR',
  },
  {
    id: 'f2l-20',
    code: 'F2L 20',
    name: 'Adyacentes — Colores Iguales (Arista en UF)',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "U F' U F U' F' U' F",
    altAlg: "y' U R' U R U' R' U' R y",
    altAlgs: [
      "y' U R' U R U' R' U' R y",
      "R' F R F' R U' R' U2 R U' R'",
    ],
    recognition:
      'Esquina en UFR (blanco al frente) y arista pegada en UF con el MISMO color arriba.',
    explanation:
      'Sepáralas escondiendo la esquina con U F\' U F y mételas directamente con U\' F\' U\' F.',
    tags: ['Colores iguales', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR, arista en UF',
  },
  {
    id: 'f2l-21',
    code: 'F2L 21',
    name: 'Adyacentes — Blanco a la Derecha, Arista en UR (Opuestos)',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "R U' R' U2 R U R'",
    altAlg: "U' R U R' U R U' R'",
    altAlgs: [
      "U' R U R' U R U' R'",
    ],
    recognition:
      'Esquina en UFR (blanco a la derecha) y arista en UR formando un par mal conectado con colores opuestos.',
    explanation:
      'Solo 7 movimientos 2-gen: R U\' R\' separa el par y U2 R U R\' lo inserta directo.',
    triggers: ['Extract R', 'Insert R'],
    tags: ['Colores opuestos', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR, arista en UR',
  },
  {
    id: 'f2l-22',
    code: 'F2L 22',
    name: 'Adyacentes — Blanco al Frente, Arista en UF (Opuestos)',
    stage: 'F2L',
    subcategory: 'Esquina y arista separadas en capa U',
    alg: "F' U F U2 F' U' F",
    altAlg: "r U' r' U2 r U r'",
    altAlgs: [
      "r U' r' U2 r U r'",
      "y' R' U R U2 R' U' R y",
    ],
    recognition:
      'Esquina en UFR (blanco al frente) y arista en UF con colores superiores opuestos.',
    explanation:
      '¡Truco pro! Ejecuta r U\' r\' U2 r U r\' para resolverlo en 7 movimientos usando solo capas derechas sin rotar.',
    tags: ['Colores opuestos', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR, arista en UF',
  },

  // ============================================================================
  // 3. PARES CONECTADOS EN CAPA U MAL ORIENTADOS (6 Casos: F2L 23–28)
  // ============================================================================
  {
    id: 'f2l-23',
    code: 'F2L 23',
    name: 'Conectados — Blanco Arriba + Par en UR (Triple Sexy)',
    stage: 'F2L',
    subcategory: 'Pares conectados en capa U mal orientados',
    isTwoLook: true,
    alg: "R U R' U2 R U R' U' R U R'",
    altAlg: "U R U' R' U' R U' R' U R U' R'",
    altAlgs: [
      "U R U' R' U' R U' R' U R U' R'",
    ],
    recognition:
      'Esquina en UFR con blanco ARRIBA pegada a la arista en UR con colores laterales invertidos.',
    explanation:
      'Separa con R U R\', gira U2 y aplica Sexy Move terminado en R U R\'.',
    triggers: ['Insert R', 'Sexy Move'],
    tags: ['Blanco arriba', 'Par unido', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Par unido en UFR + UR (blanco arriba)',
  },
  {
    id: 'f2l-24',
    code: 'F2L 24',
    name: 'Conectados — Blanco Arriba + Par en UF',
    stage: 'F2L',
    subcategory: 'Pares conectados en capa U mal orientados',
    alg: "F U R U' R' F' R U' R'",
    altAlg: "U' R U' R2 F R F' R U' R'",
    altAlgs: [
      "U' R U' R2 F R F' R U' R'",
      "y' R' U' R U2 R' U' R U R' U' R y",
    ],
    recognition:
      'Esquina en UFR con blanco ARRIBA pegada a la arista en UF con colores laterales invertidos.',
    explanation:
      'La solución F (U R U\' R\') F\' seguida de R U\' R\' resuelve este caso incómodo en solo 9 movimientos sin rotar.',
    triggers: ['Inverse Sexy', 'Extract R'],
    tags: ['Blanco arriba', 'Par unido', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Par unido en UFR + UF (blanco arriba)',
  },
  {
    id: 'f2l-25',
    code: 'F2L 25',
    name: 'Conectados — Blanco Arriba + Colores Coincidentes (UR)',
    stage: 'F2L',
    subcategory: 'Pares conectados en capa U mal orientados',
    alg: "U' R U' R' U R U R'",
    altAlg: "R U2 R' U' R U R'",
    altAlgs: [
      "R U2 R' U' R U R'",
    ],
    recognition:
      'Esquina en UFR (blanco arriba) y arista en UR cuyos colores en la cara R coinciden.',
    explanation:
      'Aparta el bloque con U\', sepáralos escondiendo la arista con R U\' R\' e inserta con U R U R\'.',
    triggers: ['Extract R', 'Insert R'],
    tags: ['Blanco arriba', 'Par unido', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Bloque en UFR + UR con colores derechos iguales',
  },
  {
    id: 'f2l-26',
    code: 'F2L 26',
    name: 'Conectados — Blanco Arriba + Colores Coincidentes (UF)',
    stage: 'F2L',
    subcategory: 'Pares conectados en capa U mal orientados',
    alg: "U F' U F U' F' U' F",
    altAlg: "U' R' F R F' R U R'",
    altAlgs: [
      "U' R' F R F' R U R'",
      "y' U R' U R U' R' U' R y",
    ],
    recognition:
      'Esquina en UFR (blanco arriba) y arista en UF cuyos colores en la cara F coinciden.',
    explanation:
      'Usa U\' + Sledgehammer (R\' F R F\') + R U R\' para resolverlo ergonómicamente desde home grip.',
    triggers: ['Sledgehammer', 'Insert R'],
    tags: ['Blanco arriba', 'Par unido', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Bloque en UFR + UF con colores frontales iguales',
  },
  {
    id: 'f2l-27',
    code: 'F2L 27',
    name: 'Conectados — Par Invertido en UF (Blanco al Frente)',
    stage: 'F2L',
    subcategory: 'Pares conectados en capa U mal orientados',
    alg: "U' R U' R' U2 R U' R'",
    altAlg: "R U R' U2 R U' R' U R U' R'",
    altAlgs: [
      "R U R' U2 R U' R' U R U' R'",
    ],
    recognition:
      'Esquina en UFR (blanco al frente) pegada a la arista en UF con el mismo color en la cara U.',
    explanation:
      '8 movimientos puros en R y U: U\' R U\' R\' separa el par formando el par básico para U2 R U\' R\'.',
    triggers: ['Extract R'],
    tags: ['Colores iguales', 'Par unido', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Par en UFR + UF (mismo color arriba)',
  },
  {
    id: 'f2l-28',
    code: 'F2L 28',
    name: 'Conectados — Par Invertido en UR (Blanco a la Derecha)',
    stage: 'F2L',
    subcategory: 'Pares conectados en capa U mal orientados',
    alg: "U R U' R' F R' F' R",
    altAlg: "U F' U F U2 F' U F",
    altAlgs: [
      "U F' U F U2 F' U F",
      "y' U R' U R U2 R' U R y",
    ],
    recognition:
      'Esquina en UFR (blanco a la derecha) pegada a la arista en UR con el mismo color en la cara U.',
    explanation:
      'La joya sin rotaciones: Inverse Sexy (U R U\' R\') seguido directamente de Hedgeslammer (F R\' F\' R).',
    triggers: ['Inverse Sexy', 'Hedgeslammer'],
    tags: ['Colores iguales', 'Par unido', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Par en UFR + UR (mismo color arriba)',
  },

  // ============================================================================
  // 4. ESQUINA EN EL SLOT, ARISTA EN CAPA U (6 Casos: F2L 29–34)
  // ============================================================================
  {
    id: 'f2l-29',
    code: 'F2L 29',
    name: 'Esquina Resuelta + Arista en U (Sexy + Sledge)',
    stage: 'F2L',
    subcategory: 'Esquina en el slot, arista en capa U',
    isTwoLook: true,
    alg: "U R U' R' U' F' U F",
    altAlg: "R' F R F' R' F R F'",
    altAlgs: [
      "R' F R F' R' F R F'",
      "U R U' R' F R' F' R",
    ],
    recognition:
      'La esquina ya está bien orientada en el slot DFR; la arista está en UF coincidiendo con el centro frontal.',
    explanation:
      'Alinea la arista con su centro F: aplica Inverse Sexy (U R U\' R\') + inserción frontal (U\' F\' U F) o Doble Sledgehammer.',
    triggers: ['Inverse Sexy', 'Sledgehammer', 'Hedgeslammer'],
    tags: ['Esquina en slot', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Arista en UF alineada con el centro F',
  },
  {
    id: 'f2l-30',
    code: 'F2L 30',
    name: 'Esquina Resuelta + Arista en UR (Inverso)',
    stage: 'F2L',
    subcategory: 'Esquina en el slot, arista en capa U',
    alg: "U' F' U F U R U' R'",
    altAlg: "F R' F' R F R' F' R",
    altAlgs: [
      "F R' F' R F R' F' R",
      "R U' R' U' R U' R' U R U' R'",
    ],
    recognition:
      'La esquina ya está resuelta en DFR; la arista está en UR coincidiendo con el centro derecho.',
    explanation:
      'Alinea la arista con el centro R: ejecuta U\' F\' U F + Inverse Sexy (U R U\' R\') o Doble Hedgeslammer.',
    triggers: ['Inverse Sexy', 'Hedgeslammer'],
    tags: ['Esquina en slot', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Arista en UR alineada con el centro R',
  },
  {
    id: 'f2l-31',
    code: 'F2L 31',
    name: 'Esquina en Slot (Blanco a la Der) + Arista Lista',
    stage: 'F2L',
    subcategory: 'Esquina en el slot, arista en capa U',
    alg: "R U R' U' R U R'",
    altAlg: "U' R U' R' U2 R U' R'",
    altAlgs: [
      "U' R U' R' U2 R U' R'",
    ],
    recognition:
      'Esquina en DFR con blanco a la derecha; la arista en UR tiene el color frontal arriba.',
    explanation:
      '7 movimientos ultrarrápidos: un Sexy Move (R U R\' U\') une el par arriba y R U R\' lo inserta.',
    triggers: ['Sexy Move', 'Insert R'],
    tags: ['Esquina en slot', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Arista en UR (color frontal arriba)',
  },
  {
    id: 'f2l-32',
    code: 'F2L 32',
    name: 'Esquina en Slot (Blanco al Frente) + Arista Lista',
    stage: 'F2L',
    subcategory: 'Esquina en el slot, arista en capa U',
    alg: "R U' R' U R U' R'",
    altAlg: "F' U' F U F' U' F",
    altAlgs: [
      "F' U' F U F' U' F",
    ],
    recognition:
      'Esquina en DFR con blanco al frente; la arista en UF tiene el color frontal arriba.',
    explanation:
      'Extrae con R U\' R\', une con U y vuelve a insertar con R U\' R\' en solo 7 movimientos.',
    triggers: ['Extract R', 'Inverse Sexy'],
    tags: ['Esquina en slot', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Arista en UF (color frontal arriba)',
  },
  {
    id: 'f2l-33',
    code: 'F2L 33',
    name: 'Esquina en Slot (Blanco a la Der) + Arista Invertida',
    stage: 'F2L',
    subcategory: 'Esquina en el slot, arista en capa U',
    alg: "R U' R' U F' U' F",
    altAlg: "R' F R F' R U R'",
    altAlgs: [
      "R' F R F' R U R'",
    ],
    recognition:
      'Esquina en DFR con blanco a la derecha; la arista en UF tiene el color derecho arriba.',
    explanation:
      'Puedes hacer R U\' R\' U F\' U\' F o el combo Sledgehammer (R\' F R F\') + R U R\'.',
    triggers: ['Extract R', 'Sledgehammer', 'Insert R'],
    tags: ['Esquina en slot', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Arista en UF (color derecho arriba)',
  },
  {
    id: 'f2l-34',
    code: 'F2L 34',
    name: 'Esquina en Slot (Blanco al Frente) + Arista Invertida',
    stage: 'F2L',
    subcategory: 'Esquina en el slot, arista en capa U',
    alg: "F' U F U' R U R'",
    altAlg: "R U R' U' R U' R' U2 F' U' F",
    altAlgs: [
      "R U R' U' R U' R' U2 F' U' F",
    ],
    recognition:
      'Esquina en DFR con blanco al frente; la arista en UR tiene el color frontal arriba.',
    explanation:
      'Saca la esquina por el frente con F\' U F y métela directamente con U\' R U R\'.',
    triggers: ['Insert R'],
    tags: ['Esquina en slot', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Arista en UR (color frontal arriba)',
  },

  // ============================================================================
  // 5. ARISTA EN EL SLOT, ESQUINA EN CAPA U (5 Casos: F2L 35–39)
  // ============================================================================
  {
    id: 'f2l-35',
    code: 'F2L 35',
    name: 'Arista en Slot + Esquina Blanco Arriba (Triple Sexy)',
    stage: 'F2L',
    subcategory: 'Arista en el slot, esquina en capa U',
    isTwoLook: true,
    alg: "R U R' U' R U R' U' R U R'",
    altAlg: "R U2 R' U R U2 R' U R U' R'",
    altAlgs: [
      "R U2 R' U R U2 R' U R U' R'",
    ],
    recognition:
      'La arista ya está bien colocada en FR y la esquina está en UFR con el sticker blanco mirando ARRIBA.',
    explanation:
      'El clásico Triple Sexy (quitando el último U\'): 3 repeticiones de R U R\' U\' a máxima velocidad.',
    triggers: ['Sexy Move', 'Insert R'],
    tags: ['Arista en slot', 'Blanco arriba', 'Sin rotación'],
    grip: 'Home grip (cero regrips)',
    auf: 'Esquina sobre el slot (UFR) con blanco arriba',
  },
  {
    id: 'f2l-36',
    code: 'F2L 36',
    name: 'Arista Invertida en Slot + Esquina Blanco Arriba',
    stage: 'F2L',
    subcategory: 'Arista en el slot, esquina en capa U',
    alg: "R U' R' U' R U R' U2 F' U' F",
    altAlg: "F' U F R U R2 F R F'",
    altAlgs: [
      "F' U F R U R2 F R F'",
      "R U' R' y' R' U2 R U2 R' U R y",
    ],
    recognition:
      'Arista invertida en FR y esquina en UFR con el sticker blanco mirando ARRIBA.',
    explanation:
      'La variante F\' U F R U R2 F R F\' resuelve la arista invertida sin necesidad de rotar.',
    triggers: ['Sledgehammer'],
    tags: ['Arista en slot', 'Blanco arriba'],
    grip: 'Home grip',
    auf: 'Esquina sobre el slot (UFR) con blanco arriba',
  },
  {
    id: 'f2l-37',
    code: 'F2L 37',
    name: 'Arista Resuelta + Esquina Blanco al Frente',
    stage: 'F2L',
    subcategory: 'Arista en el slot, esquina en capa U',
    alg: "U' R U' R' U R U R'",
    altAlg: "R U' R' U' R U R' U' R U2 R'",
    altAlgs: [
      "R U' R' U' R U R' U' R U2 R'",
    ],
    recognition:
      'Arista bien orientada en FR y esquina en UFR con blanco mirando al FRENTE.',
    explanation:
      'Aleja la esquina con U\', extrae la arista con R U\' R\' para formar el caso básico e inserta con U R U R\'.',
    triggers: ['Extract R', 'Insert R'],
    tags: ['Arista en slot', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR (blanco al frente)',
  },
  {
    id: 'f2l-38',
    code: 'F2L 38',
    name: 'Arista Resuelta + Esquina Blanco a la Derecha',
    stage: 'F2L',
    subcategory: 'Arista en el slot, esquina en capa U',
    alg: "U R U R' U2 R U R'",
    altAlg: "U F' U F U' F' U' F",
    altAlgs: [
      "U F' U F U' F' U' F",
    ],
    recognition:
      'Arista bien orientada en FR y esquina en UFR con blanco mirando a la DERECHA.',
    explanation:
      '100% 2-gen: U R U R\' empareja o prepara ambas piezas y U2 R U R\' las inserta.',
    triggers: ['Insert R'],
    tags: ['Arista en slot', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina en UFR (blanco a la derecha)',
  },
  {
    id: 'f2l-39',
    code: 'F2L 39',
    name: 'Arista Invertida en Slot + Esquina en UFR',
    stage: 'F2L',
    subcategory: 'Arista en el slot, esquina en capa U',
    alg: "U' R U' R' U F' U' F",
    altAlg: "R U' R' F R' F' R",
    altAlgs: [
      "R U' R' F R' F' R",
      "U' R U R' U F' U' F",
    ],
    recognition:
      'Arista invertida en FR y esquina en UFR (blanco a la derecha o al frente).',
    explanation:
      'Usa R U\' R\' seguido de Hedgeslammer (F R\' F\' R) o U\' R U\' R\' U F\' U\' F para voltear e insertar.',
    triggers: ['Extract R', 'Hedgeslammer'],
    tags: ['Arista en slot', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Esquina sobre el slot (UFR)',
  },

  // ============================================================================
  // 6. AMBOS EN EL SLOT PERO MAL ORIENTADOS (2 Casos: F2L 40–41)
  // ============================================================================
  {
    id: 'f2l-40',
    code: 'F2L 40',
    name: 'Ambos en Slot — Arista Invertida, Esquina Bien',
    stage: 'F2L',
    subcategory: 'Ambos en el slot pero mal orientados',
    isTwoLook: true,
    alg: "R U' R' U' R U R' U2 R U' R'",
    altAlg: "R U' R' F' U2 F U R U' R'",
    altAlgs: [
      "R U' R' F' U2 F U R U' R'",
      "R U2 R' U R U2 R' U F' U' F",
    ],
    recognition:
      'La esquina ya está bien puesta en DFR, pero la arista encima de ella está invertida en FR.',
    explanation:
      'Saca el par con R U\' R\', sepáralos con U\' R U R\' y vuelve a insertar el par unido con U2 R U\' R\'.',
    triggers: ['Extract R', 'Insert R'],
    tags: ['Ambos en slot', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Sin AUF previo (ambas piezas en el slot FR)',
  },
  {
    id: 'f2l-41',
    code: 'F2L 41',
    name: 'Ambos en Slot — Esquina Torcida y Arista en FR',
    stage: 'F2L',
    subcategory: 'Ambos en el slot pero mal orientados',
    alg: "R U' R' U R U2 R' U R U' R'",
    altAlg: "R U R' U' R U' R' U2 F' U' F",
    altAlgs: [
      "R U R' U' R U' R' U2 F' U' F",
    ],
    recognition:
      'Tanto la esquina como la arista están dentro del slot FR pero desorientadas.',
    explanation:
      '100% 2-gen (R y U): R U\' R\' extrae ambas piezas, U R U2 R\' las empareja y U R U\' R\' las inserta.',
    triggers: ['Extract R', 'Inverse Sexy'],
    tags: ['Ambos en slot', 'Sin rotación'],
    grip: 'Home grip',
    auf: 'Sin AUF previo (ambas piezas en el slot FR)',
  },
];
