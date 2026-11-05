import type { CfopCase, NotationCategory, NotationMove } from '../types/cfop';
import { ESSENTIAL_F2L_IDS, F2L_CASES, F2L_SUBCATEGORIES } from './f2lData';
import { OLL_CASES, OLL_SUBCATEGORIES, TWO_LOOK_OLL_IDS } from './ollData';
import { PLL_CASES, PLL_SUBCATEGORIES, TWO_LOOK_PLL_IDS } from './pllData';

export {
  ESSENTIAL_F2L_IDS,
  F2L_CASES,
  F2L_SUBCATEGORIES,
  OLL_CASES,
  OLL_SUBCATEGORIES,
  PLL_CASES,
  PLL_SUBCATEGORIES,
  TWO_LOOK_OLL_IDS,
  TWO_LOOK_PLL_IDS,
};

export interface NotationRuleCard {
  symbol: string;
  title: string;
  badge: string;
  explanation: string;
  example: string;
}

export const NOTATION_RULES: NotationRuleCard[] = [
  {
    symbol: 'R / U / F',
    title: 'Letra Mayúscula Sola',
    badge: '90° Horario',
    explanation:
      'Gira esa cara 90 grados en el sentido de las agujas del reloj, como si estuvieras mirando esa cara directamente de frente.',
    example: 'R = Cara derecha 90° horario (hacia arriba desde el frente).',
  },
  {
    symbol: "R' (Prima)",
    title: "Apóstrofe ( ' )",
    badge: '90° Antihorario',
    explanation:
      'Se lee "prima" (ej. R prima). Indica un giro de 90 grados en sentido contrario a las agujas del reloj mirando esa cara.',
    example: "U' = Cara superior 90° antihorario (con el índice izquierdo).",
  },
  {
    symbol: 'U2 / R2',
    title: 'Número 2',
    badge: '180° Doble Giro',
    explanation:
      'Gira la cara media vuelta completa (180 grados). El resultado final es el mismo sin importar si giras horario o antihorario.',
    example: 'U2 = Doble flick índice + medio en la capa superior.',
  },
  {
    symbol: 'r / u / f',
    title: 'Letras Minúsculas (Wide)',
    badge: '2 Capas Juntas',
    explanation:
      'Mueve dos capas al mismo tiempo: la cara exterior junto con la capa media adyacente en la misma dirección que su mayúscula.',
    example: 'r = Cara R + capa media juntas hacia arriba (también escrito Rw).',
  },
];

export const NOTATION_CATEGORY_LABELS: Record<
  NotationCategory,
  { label: string; subtitle: string }
> = {
  basic: {
    label: 'Básicos de Cara (90°)',
    subtitle:
      'Las 6 caras externas del cubo: Derecha (R), Izquierda (L), Arriba (U), Abajo (D), Frente (F) y Atrás (B).',
  },
  double: {
    label: 'Giros Dobles (180°)',
    subtitle: 'Media vuelta completa (180°). Esenciales para velocidad con doble flick.',
  },
  slice: {
    label: 'Capas Medias (Slices)',
    subtitle:
      'Giran únicamente la capa central entre dos caras externas (muy usados en Roux y PLLs H, Z, U).',
  },
  wide: {
    label: 'Doble Capa (Wide Moves)',
    subtitle:
      'Letras minúsculas: giran la cara externa + la capa central contigua simultáneamente.',
  },
  rotation: {
    label: 'Rotaciones del Cubo (x, y, z)',
    subtitle: 'Inclinan el cubo entero en tus manos sin alterar las piezas entre sí.',
  },
};

export const NOTATION_MOVES: NotationMove[] = [
  // Básicos de cara
  {
    id: 'not-R',
    move: 'R',
    name: 'Right (Derecha Horario)',
    category: 'basic',
    faceLabel: 'Cara Derecha',
    directionLabel: '90° Horario (sube)',
    description: 'Gira la capa derecha alejándola de ti por el frente (hacia arriba).',
    fingertrickTip: 'Sujeta con pulgar abajo/frente y gira de muñeca derecha hacia arriba.',
  },
  {
    id: 'not-Rp',
    move: "R'",
    name: 'Right Prima (Derecha Antihorario)',
    category: 'basic',
    faceLabel: 'Cara Derecha',
    directionLabel: '90° Antihorario (baja)',
    description: 'Gira la capa derecha acercándola hacia ti por el frente (hacia abajo).',
    fingertrickTip: 'Baja la muñeca derecha suavemente sin soltar el agarre del centro.',
  },
  {
    id: 'not-L',
    move: 'L',
    name: 'Left (Izquierda Horario)',
    category: 'basic',
    faceLabel: 'Cara Izquierda',
    directionLabel: '90° Horario (baja)',
    description: 'Mirando la cara izquierda, gira horario: por el frente baja hacia ti.',
    fingertrickTip: 'Nota que L baja por el frente (opuesto visual a R que sube).',
  },
  {
    id: 'not-Lp',
    move: "L'",
    name: 'Left Prima (Izquierda Antihorario)',
    category: 'basic',
    faceLabel: 'Cara Izquierda',
    directionLabel: '90° Antihorario (sube)',
    description: 'Mirando la cara izquierda, gira antihorario: por el frente sube.',
    fingertrickTip: 'Giro de muñeca izquierda hacia arriba, simétrico a R.',
  },
  {
    id: 'not-U',
    move: 'U',
    name: 'Up (Superior Horario)',
    category: 'basic',
    faceLabel: 'Cara Superior',
    directionLabel: '90° Horario (←)',
    description: 'Vista desde arriba, gira horario (la fila frontal se mueve hacia la izquierda).',
    fingertrickTip: 'Empuja la esquina trasera-derecha (UBR) con el dedo índice derecho.',
  },
  {
    id: 'not-Up',
    move: "U'",
    name: 'Up Prima (Superior Antihorario)',
    category: 'basic',
    faceLabel: 'Cara Superior',
    directionLabel: '90° Antihorario (→)',
    description: 'Vista desde arriba, gira antihorario (la fila frontal va hacia la derecha).',
    fingertrickTip: 'Empuja la esquina trasera-izquierda (UBL) con el dedo índice izquierdo.',
  },
  {
    id: 'not-D',
    move: 'D',
    name: 'Down (Inferior Horario)',
    category: 'basic',
    faceLabel: 'Cara Inferior',
    directionLabel: '90° Horario (→)',
    description:
      'Mirando el cubo desde abajo, gira horario (por el frente va de izquierda a derecha).',
    fingertrickTip:
      'Empuja la esquina inferior trasera izquierda (DBL) con el dedo anular izquierdo.',
  },
  {
    id: 'not-Dp',
    move: "D'",
    name: 'Down Prima (Inferior Antihorario)',
    category: 'basic',
    faceLabel: 'Cara Inferior',
    directionLabel: '90° Antihorario (←)',
    description:
      'Mirando desde abajo, gira antihorario (por el frente va de derecha a izquierda).',
    fingertrickTip:
      'Empuja la esquina inferior trasera derecha (DBR) con el dedo anular derecho.',
  },
  {
    id: 'not-F',
    move: 'F',
    name: 'Front (Frontal Horario)',
    category: 'basic',
    faceLabel: 'Cara Frontal',
    directionLabel: '90° Horario (↻)',
    description: 'Gira la cara que tienes frente a ti en sentido de las agujas del reloj.',
    fingertrickTip: 'Haz un flick hacia abajo desde arriba-derecha con el índice derecho.',
  },
  {
    id: 'not-Fp',
    move: "F'",
    name: 'Front Prima (Frontal Antihorario)',
    category: 'basic',
    faceLabel: 'Cara Frontal',
    directionLabel: '90° Antihorario (↺)',
    description: 'Gira la cara frontal en sentido contrario a las agujas del reloj.',
    fingertrickTip:
      'Empuja hacia arriba con el pulgar derecho desde abajo-derecha o flick índice izquierdo.',
  },
  {
    id: 'not-B',
    move: 'B',
    name: 'Back (Trasera Horario)',
    category: 'basic',
    faceLabel: 'Cara Trasera',
    directionLabel: '90° Horario desde atrás',
    description:
      'Mirando la cara trasera desde atrás, gira horario (la parte superior cae a la izquierda).',
    fingertrickTip: 'Usa el anular o índice derecho tirando desde atrás sin rotar el cubo.',
  },
  {
    id: 'not-Bp',
    move: "B'",
    name: 'Back Prima (Trasera Antihorario)',
    category: 'basic',
    faceLabel: 'Cara Trasera',
    directionLabel: '90° Antihorario desde atrás',
    description:
      'Mirando desde atrás, gira antihorario (la parte superior cae hacia la derecha).',
    fingertrickTip: 'Empuja con el anular izquierdo o índice izquierdo por detrás.',
  },

  // Dobles (180°)
  {
    id: 'not-U2',
    move: 'U2',
    name: 'Up Doble (180°)',
    category: 'double',
    faceLabel: 'Cara Superior',
    directionLabel: '180° Media Vuelta',
    description: 'Gira la capa superior 180 grados completos.',
    fingertrickTip: 'Double flick: golpea seguido con índice + dedo medio de la misma mano.',
  },
  {
    id: 'not-R2',
    move: 'R2',
    name: 'Right Doble (180°)',
    category: 'double',
    faceLabel: 'Cara Derecha',
    directionLabel: '180° Media Vuelta',
    description: 'Gira la capa derecha 180 grados completos.',
    fingertrickTip: 'Giro completo de muñeca derecha iniciando con el pulgar abajo o arriba.',
  },
  {
    id: 'not-F2',
    move: 'F2',
    name: 'Front Doble (180°)',
    category: 'double',
    faceLabel: 'Cara Frontal',
    directionLabel: '180° Media Vuelta',
    description: 'Gira la cara frontal 180 grados completos.',
    fingertrickTip: 'Double flick con índice + medio, igual que U2 pero en la cara F.',
  },
  {
    id: 'not-L2',
    move: 'L2',
    name: 'Left Doble (180°)',
    category: 'double',
    faceLabel: 'Cara Izquierda',
    directionLabel: '180° Media Vuelta',
    description: 'Gira la cara izquierda 180 grados completos.',
    fingertrickTip: 'Giro fluido de muñeca izquierda de 180°.',
  },
  {
    id: 'not-D2',
    move: 'D2',
    name: 'Down Doble (180°)',
    category: 'double',
    faceLabel: 'Cara Inferior',
    directionLabel: '180° Media Vuelta',
    description: 'Gira la capa inferior 180 grados (clave en A-Perms y OLL 23).',
    fingertrickTip: 'Double flick inferior usando anular + meñique (o meñique + anular).',
  },
  {
    id: 'not-B2',
    move: 'B2',
    name: 'Back Doble (180°)',
    category: 'double',
    faceLabel: 'Cara Trasera',
    directionLabel: '180° Media Vuelta',
    description: 'Gira la cara trasera 180 grados completos.',
    fingertrickTip: 'Double flick trasero tras inclinar levemente o tras una rotación x.',
  },

  // Slices (Capas medias)
  {
    id: 'not-M',
    move: 'M',
    name: 'Middle Slice (Sigue a L)',
    category: 'slice',
    faceLabel: 'Capa Media Vertical',
    directionLabel: '90° Baja por el frente',
    description:
      'Gira la capa central entre L y R en la MISMA dirección que L (hacia abajo por el frente).',
    fingertrickTip:
      'Empuja la arista superior-trasera (UB) hacia abajo o tira con el anular desde UF.',
  },
  {
    id: 'not-Mp',
    move: "M'",
    name: 'Middle Prima (Sigue a R)',
    category: 'slice',
    faceLabel: 'Capa Media Vertical',
    directionLabel: '90° Sube por el frente',
    description:
      "El movimiento de slice más rápido: la capa central sube por el frente (dirección de R / L').",
    fingertrickTip: 'Empuja la arista inferior-trasera (DB) hacia adelante/arriba con el anular.',
  },
  {
    id: 'not-M2',
    move: 'M2',
    name: 'Middle Doble (180°)',
    category: 'slice',
    faceLabel: 'Capa Media Vertical',
    directionLabel: '180° Media Vuelta',
    description: 'Gira la columna central 180°. Es el motor principal de los PLLs H, Z, Ua y Ub.',
    fingertrickTip: 'Double flick en DB usando dedo anular + dedo medio por debajo/atrás del cubo.',
  },
  {
    id: 'not-E',
    move: 'E',
    name: 'Equatorial Slice (Sigue a D)',
    category: 'slice',
    faceLabel: 'Capa Media Horizontal',
    directionLabel: '90° Sigue a D (→)',
    description: 'Gira el cinturón horizontal entre U y D en la misma dirección que D.',
    fingertrickTip:
      'Empuja la arista trasera-izquierda de la capa media con el dedo anular izquierdo.',
  },
  {
    id: 'not-Ep',
    move: "E'",
    name: "Equatorial Prima (Sigue a D')",
    category: 'slice',
    faceLabel: 'Capa Media Horizontal',
    directionLabel: "90° Sigue a D' (←)",
    description: "Gira el cinturón central horizontal en la misma dirección que D'.",
    fingertrickTip:
      'Empuja la arista trasera-derecha de la capa media con el dedo anular derecho.',
  },
  {
    id: 'not-S',
    move: 'S',
    name: 'Standing Slice (Sigue a F)',
    category: 'slice',
    faceLabel: 'Capa Media Frontal',
    directionLabel: '90° Sigue a F (↻)',
    description: 'Gira la capa central paralela a F (entre F y B) en la misma dirección que F.',
    fingertrickTip:
      'Empuja la arista superior-derecha de la capa S hacia abajo con el índice derecho.',
  },
  {
    id: 'not-Sp',
    move: "S'",
    name: "Standing Prima (Sigue a F')",
    category: 'slice',
    faceLabel: 'Capa Media Frontal',
    directionLabel: "90° Sigue a F' (↺)",
    description: "Gira la capa central paralela a F en sentido antihorario (igual que F').",
    fingertrickTip:
      'Empuja hacia arriba con el pulgar derecho o hacia la izquierda con el índice izquierdo.',
  },

  // Wide moves (Doble capa)
  {
    id: 'not-r',
    move: 'r',
    name: 'Wide Right (r / Rw)',
    category: 'wide',
    faceLabel: '2 Capas Derechas',
    directionLabel: '90° Horario (sube)',
    description: 'Gira simultáneamente la cara R y la capa central M hacia arriba.',
    fingertrickTip: 'Sujeta solo la capa L con la mano izquierda y sube el bloque derecho de 2 capas.',
  },
  {
    id: 'not-rp',
    move: "r'",
    name: "Wide Right Prima (r' / Rw')",
    category: 'wide',
    faceLabel: '2 Capas Derechas',
    directionLabel: '90° Antihorario (baja)',
    description: 'Gira simultáneamente las dos capas derechas hacia abajo por el frente.',
    fingertrickTip: 'Clave en OLLs de rayos, cuadrados y el caso T (Chameleon).',
  },
  {
    id: 'not-l',
    move: 'l',
    name: 'Wide Left (l / Lw)',
    category: 'wide',
    faceLabel: '2 Capas Izquierdas',
    directionLabel: '90° Horario (baja)',
    description: 'Gira las dos capas izquierdas hacia abajo por el frente (misma dirección que L).',
    fingertrickTip: 'Sujeta la capa R fija y baja las dos capas izquierdas.',
  },
  {
    id: 'not-lp',
    move: "l'",
    name: "Wide Left Prima (l' / Lw')",
    category: 'wide',
    faceLabel: '2 Capas Izquierdas',
    directionLabel: '90° Antihorario (sube)',
    description: 'Gira las dos capas izquierdas hacia arriba por el frente.',
    fingertrickTip: 'Simétrico a r: sujeta R y sube las dos capas izquierdas.',
  },
  {
    id: 'not-u',
    move: 'u',
    name: 'Wide Up (u / Uw)',
    category: 'wide',
    faceLabel: '2 Capas Superiores',
    directionLabel: '90° Horario (←)',
    description:
      'Gira las dos capas superiores juntas en sentido horario (muy usado en G-Perms).',
    fingertrickTip:
      'Sujeta la capa D con anular/pulgar y empuja las 2 capas superiores con el índice.',
  },
  {
    id: 'not-up',
    move: "u'",
    name: "Wide Up Prima (u' / Uw')",
    category: 'wide',
    faceLabel: '2 Capas Superiores',
    directionLabel: '90° Antihorario (→)',
    description: 'Gira las dos capas superiores juntas en sentido antihorario.',
    fingertrickTip: 'Empuja las dos capas superiores con el dedo índice izquierdo.',
  },
  {
    id: 'not-f',
    move: 'f',
    name: 'Wide Front (f / Fw)',
    category: 'wide',
    faceLabel: '2 Capas Frontales',
    directionLabel: '90° Horario (↻)',
    description: 'Gira la cara frontal junto con la capa media S en sentido horario.',
    fingertrickTip:
      "Fundamental para formar la cruz en 2-Look OLL (caso L pequeña: f R U R' U' f').",
  },
  {
    id: 'not-fp',
    move: "f'",
    name: "Wide Front Prima (f' / Fw')",
    category: 'wide',
    faceLabel: '2 Capas Frontales',
    directionLabel: '90° Antihorario (↺)',
    description: 'Cierra el giro de doble capa frontal en sentido antihorario.',
    fingertrickTip:
      'Empuja hacia arriba las dos capas frontales con el pulgar derecho o índice izquierdo.',
  },

  // Rotaciones del cubo completo
  {
    id: 'not-x',
    move: 'x',
    name: 'Rotación X (Sigue a R)',
    category: 'rotation',
    faceLabel: 'Cubo Completo (Eje X)',
    directionLabel: 'Frente sube a Arriba',
    description: 'Inclina el cubo entero como un movimiento R: la cara F pasa a ser la nueva cara U.',
    fingertrickTip: 'Muy común al iniciar Aa-Perm, Ab-Perm y E-Perm.',
  },
  {
    id: 'not-xp',
    move: "x'",
    name: "Rotación X Prima (Sigue a R')",
    category: 'rotation',
    faceLabel: 'Cubo Completo (Eje X)',
    directionLabel: 'Arriba baja al Frente',
    description: "Inclina el cubo entero hacia ti (dirección de R'): la cara U baja al frente.",
    fingertrickTip: 'Útil para volver a la posición original tras algoritmos en D/B.',
  },
  {
    id: 'not-y',
    move: 'y',
    name: 'Rotación Y (Sigue a U)',
    category: 'rotation',
    faceLabel: 'Cubo Completo (Eje Y)',
    directionLabel: 'Derecha pasa al Frente',
    description: 'Gira el cubo entero horizontalmente como U: la cara R pasa al frente.',
    fingertrickTip: 'En F2L intenta minimizar rotaciones y innecesarias (máximo 1 por par).',
  },
  {
    id: 'not-yp',
    move: "y'",
    name: "Rotación Y Prima (Sigue a U')",
    category: 'rotation',
    faceLabel: 'Cubo Completo (Eje Y)',
    directionLabel: 'Izquierda pasa al Frente',
    description: "Gira el cubo entero horizontalmente como U': la cara L pasa al frente.",
    fingertrickTip: 'Permite convertir inserciones frontales F en cómodas inserciones con R y L.',
  },
  {
    id: 'not-z',
    move: 'z',
    name: 'Rotación Z (Sigue a F)',
    category: 'rotation',
    faceLabel: 'Cubo Completo (Eje Z)',
    directionLabel: 'Arriba inclina a Derecha',
    description: 'Inclina todo el cubo lateralmente como F: la cara U pasa a la derecha (R).',
    fingertrickTip: 'Usada por cubers pro para transformar movimientos U/D en rápidos R/U.',
  },
  {
    id: 'not-zp',
    move: "z'",
    name: "Rotación Z Prima (Sigue a F')",
    category: 'rotation',
    faceLabel: 'Cubo Completo (Eje Z)',
    directionLabel: 'Arriba inclina a Izquierda',
    description: "Inclina todo el cubo lateralmente como F': la cara U pasa a la izquierda (L).",
    fingertrickTip: 'Deshace una rotación z al finalizar algoritmos avanzados.',
  },
];

export interface TriggerDemo {
  id: string;
  name: string;
  alg: string;
  description: string;
}

export const FUNDAMENTAL_TRIGGERS: TriggerDemo[] = [
  {
    id: 'trig-sexy',
    name: 'Sexy Move',
    alg: "R U R' U'",
    description:
      'El trigger #1 del speedcubing. 4 movimientos ultra fluidos que aparecen en F2L, OLL y T/J/Y-Perm.',
  },
  {
    id: 'trig-sledge',
    name: 'Sledgehammer',
    alg: "R' F R F'",
    description:
      'Inserta pares F2L mientras orienta aristas de la última capa para evitar OLLs de punto.',
  },
  {
    id: 'trig-inv-sexy',
    name: 'Inverse Sexy',
    alg: "U R U' R'",
    description:
      'La inserción estándar de 4 movimientos para meter un par F2L separado en el slot frontal-derecho.',
  },
  {
    id: 'trig-hedge',
    name: 'Hedgeslammer',
    alg: "F R' F' R",
    description:
      'El inverso del Sledgehammer; ideal para insertar pares desde el ángulo frontal sin rotar el cubo.',
  },
];

export const CROSS_TIPS = [
  {
    title: '1. Resuelve SIEMPRE la Cruz abajo (Capa D)',
    body: 'Mantener la cruz en la base evita perder 1.5 segundos volteando el cubo (z2) y te permite buscar tu primer par de F2L mientras terminas la última arista.',
  },
  {
    title: '2. Regla de los 8 Movimientos o Menos',
    body: 'El 99.9% de las cruces del cubo de Rubik se pueden resolver en 8 movimientos o menos. Usa los 15 segundos de inspección WCA para planear las 4 aristas con los ojos cerrados.',
  },
  {
    title: '3. Cruz Relativa antes de Alinear Centros',
    body: "No alinees cada arista con su centro una por una. Insértalas respetando el orden relativo de colores (opuestos y adyacentes) y haz un solo ajuste D / D' / D2 al final.",
  },
  {
    title: '4. Aprovecha una Arista para Empujar Otra',
    body: 'Si una arista está mal orientada en la capa media, un giro F o R para bajar una arista puede colocar automáticamente otra en su posición ideal.',
  },
];

export const CROSS_CASES: CfopCase[] = [
  {
    id: 'cross-1',
    code: 'CROSS 01',
    name: 'Inserción Directa en 1 Giro',
    stage: 'Cross',
    subcategory: 'Inserciones Directas',
    isTwoLook: true,
    alg: 'U F2',
    recognition: 'Arista en capa U con el sticker de la cruz mirando hacia arriba.',
    explanation:
      'Alinea la arista con su centro lateral mediante U y bájala directo a la base D con F2.',
    tags: ['Directa'],
    grip: 'Home grip (cruz abajo en D)',
    auf: 'Alinear centros con D',
  },
  {
    id: 'cross-2',
    code: 'CROSS 02',
    name: 'Rescate desde Capa Media',
    stage: 'Cross',
    subcategory: 'Inserciones Directas',
    isTwoLook: true,
    alg: "R' D'",
    recognition:
      'Arista atrapada en el cinturón central (FR) lista para bajar con un giro lateral.',
    explanation:
      "Bájala con R' a una posición relativa de la base y alinea toda la cruz al final con D'. Ahorras 2 movimientos frente a subirla a U.",
    tags: ['Directa', 'Capa media'],
    grip: 'Home grip',
    auf: "Alinear cruz al final con D'",
  },
  {
    id: 'cross-3',
    code: 'CROSS 03',
    name: 'Arista Invertida en Frente (Flipped Edge)',
    stage: 'Cross',
    subcategory: 'Aristas Invertidas',
    isTwoLook: true,
    alg: "U' R' F R",
    altAlg: "F' R' D' R",
    altAlgs: ["F' R' D' R"],
    recognition: 'Arista en UF con el color de la cruz mirando hacia ti (desorientada para F2).',
    explanation:
      "Muévela a un lado con U', bájala a la capa media con R', insértala en DF con F y restaura la arista derecha con R.",
    tags: ['Invertida'],
    grip: 'Home grip',
    auf: "Despejar slot con U'",
  },
  {
    id: 'cross-4',
    code: 'CROSS 04',
    name: 'Arista Invertida en el Slot Inferior',
    stage: 'Cross',
    subcategory: 'Aristas Invertidas',
    alg: "F' D' R' D",
    altAlg: "F R' D' R",
    altAlgs: ["F R' D' R"],
    recognition:
      'La arista ya está en su lugar de la base (DF) pero volteada al revés.',
    explanation:
      "Sácala a la capa media con F', desplaza la base con D', bájala bien orientada con R' y regresa la base con D.",
    tags: ['Invertida', 'En base'],
    grip: 'Home grip',
    auf: 'Restaurar D al final',
  },
  {
    id: 'cross-5',
    code: 'CROSS 05',
    name: 'Doble Inserción Simultánea (2×1 en Cinturón)',
    stage: 'Cross',
    subcategory: 'Cruz Relativa (Avanzado)',
    alg: "R' F R",
    recognition:
      'Una arista en FR lista para ir a DF y otra en DR que debe conservarse.',
    explanation:
      "Usa R' para proteger o preparar una arista lateral, F para insertar la frontal y R para insertar la derecha en un solo flujo.",
    tags: ['Cruz relativa', 'Capa media'],
    grip: 'Home grip',
    auf: 'Sin ajuste adicional',
  },
  {
    id: 'cross-6',
    code: 'CROSS 06',
    name: 'Cruz Relativa Opuesta con Ajuste D2',
    stage: 'Cross',
    subcategory: 'Cruz Relativa (Avanzado)',
    alg: 'R2 L2 D2',
    recognition:
      'Dos aristas de la cruz en U están sobre los centros opuestos a los suyos (L en R y R en L).',
    explanation:
      'Bájalas directamente en los lados opuestos con R2 L2 y corrige toda la base al final con un solo D2.',
    tags: ['Cruz relativa'],
    grip: 'Home grip',
    auf: 'Ajuste final D2',
  },
];

export const CFOP_SUBCATEGORIES: Record<'Cross' | 'F2L' | 'OLL' | 'PLL', string[]> = {
  Cross: [
    'Todos',
    'Inserciones Directas',
    'Aristas Invertidas',
    'Cruz Relativa (Avanzado)',
  ],
  F2L: F2L_SUBCATEGORIES,
  OLL: OLL_SUBCATEGORIES,
  PLL: PLL_SUBCATEGORIES,
};

export const CFOP_CASES: CfopCase[] = [
  ...CROSS_CASES,
  ...F2L_CASES,
  ...OLL_CASES,
  ...PLL_CASES,
];
