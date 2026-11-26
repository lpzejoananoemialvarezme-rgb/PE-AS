import { GameTexts, StageData, TravelerProfileInfo, TravelerTrait } from '../types/game';
import { assetUrl } from '../utils/assetUrl';

export const ASSETS = {
  TITLE_BACKDROP: assetUrl('/src/assets/images/penas_title_backdrop_1795230749733.jpg'),
  EPIC_MAP: assetUrl('/src/assets/images/penas_route_map_v2_1795486424762.jpg'),
  NARRATOR_PORTRAIT: assetUrl('/src/assets/images/tata_guide_portrait_1795446781980.jpg'),
  AGUAYO_PUZZLE: assetUrl('/src/assets/images/penas_aguayo_puzzle_1795230749535.jpg'),
  CHURCH_INTERIOR: assetUrl('/src/assets/images/game_templo_retablo_oro_1795489526990.jpg'),
  TEMPLO_PORTADA: assetUrl('/src/assets/images/game_templo_portada_campanario_1795489529307.jpg'),
  PLAZA_KATARI: assetUrl('/src/assets/images/game_plaza_katari_monument_1795489526189.jpg'),
  MURALES_CAFETERIA: assetUrl('/src/assets/images/game_penas_murales_cafeteria_1795489530177.jpg'),
  CASTILLO_CORDILLERA: assetUrl('/src/assets/images/game_penas_castillo_cordillera_1795489531412.jpg'),
  MURAL_PACHAMAMA: assetUrl('/src/assets/images/game_penas_mural_pachamama_1795489534183.jpg'),
  ADVENTURE_PARK_BUS: assetUrl('/src/assets/images/penas_adventure_park_bus_1795236281760.jpg'),
  MUSEUM_ARTIFACTS: assetUrl('/src/assets/images/penas_museum_artifacts_1795236281290.jpg'),
  CLIFFS_GROTTO: assetUrl('/src/assets/images/penas_cliffs_grotto_1795236283775.jpg'),
  PACHAMAMA_FLORA: assetUrl('/src/assets/images/penas_pachamama_flora_1795446781720.jpg'),
  FOGATA_CAFETERIA: assetUrl('/src/assets/images/penas_fogata_cafeteria_1795446782444.jpg'),
  KUNKUNTIJI_CAVE: assetUrl('/src/assets/images/penas_kunkuntiji_cave_1795486425998.jpg'),
  QILLQANTIJI_CAVE: assetUrl('/src/assets/images/penas_qillqantiji_cave_1795486426381.jpg'),
  QILLQANTIJI_SNAKE: assetUrl('/assets/aistudio/image_1b2dd2b5.png'),
  CALVARIO_CARMEN: assetUrl('/src/assets/images/penas_calvario_carmen_1795486425938.jpg'),
  CAMINO_PIEDRA: assetUrl('/src/assets/images/penas_camino_piedra_1795534761338.jpg'),
  MIRADOR_CORDILLERA_REAL: assetUrl('/assets/aistudio/WhatsApp_Image_2026-11-20_at_02.23.30_e3415c41.jpeg'),
  MIRADOR_PUEBLO_CORDILLERA: assetUrl('/assets/aistudio/WhatsApp_Image_2026-11-20_at_02.23.44_260fc684.jpeg'),
  VIDEO_KATARI_BARTOLINA: assetUrl('/src/assets/images/video_katari_bartolina_1781_1795477009439.jpg'),
  VIDEO_CASONA_SENTENCIA: assetUrl('/src/assets/images/video_casona_sentencia_1795477009284.jpg'),
  VIDEO_RADIO_SAN_GABRIEL: assetUrl('/src/assets/images/video_radio_san_gabriel_1795477010932.jpg')
};

export const ILLUSTRATED_GALLERY = [
  {
    id: 'plaza',
    title: 'Plaza Principal y Monumento a Túpac Katari',
    subtitle: 'Escultura de Katari, Bartolina Sisa y Gregoria Apaza al pie del farallón',
    imageUrl: ASSETS.PLAZA_KATARI
  },
  {
    id: 'iglesia',
    title: 'Templo Colonial y Retablo en Pan de Oro',
    subtitle: 'Portada tallada en piedra rosada, bóveda floral andina y retablo dorado',
    imageUrl: ASSETS.CHURCH_INTERIOR
  },
  {
    id: 'cafeteria_murales',
    title: 'Murales, Cafetería y Artesanías de Peñas',
    subtitle: 'Fachada Virgen de la Natividad, murales andinos, sombreros y aguayos',
    imageUrl: ASSETS.MURALES_CAFETERIA
  },
  {
    id: 'pachamama',
    title: 'Mural de la Pachamama y Flora Nativa',
    subtitle: 'Arte urbano andino y dientes de león floreciendo entre patios de adobe',
    imageUrl: ASSETS.MURAL_PACHAMAMA
  },
  {
    id: 'cordillera',
    title: 'Castillo del Búho y Cordillera Real',
    subtitle: 'Farallones de escalada deportiva y vista a Illampu, Chearoco e Illimani',
    imageUrl: ASSETS.CASTILLO_CORDILLERA
  }
];

export interface StoryScenePhoto {
  id: string;
  location: string;
  promoPhrase: string;
  imageUrl: string;
  fallbackUrl: string;
}

export const PENAS_STORY_SCENES: StoryScenePhoto[] = [
  {
    id: 'plaza_katari',
    location: 'Plaza de Túpac Katari · Peñas',
    promoPhrase: '¡Visita Peñas, La Paz! Donde late la historia viva de Túpac Katari.',
    imageUrl: ASSETS.PLAZA_KATARI,
    fallbackUrl: assetUrl('/src/assets/images/story_plaza_katari_1795241254458.jpg')
  },
  {
    id: 'templo_colonial',
    location: 'Templo Colonial y Pisadas de la Virgen',
    promoPhrase: '¡Visita Peñas, La Paz! Descubre joyas coloniales en pan de oro a 4.000 metros.',
    imageUrl: ASSETS.CHURCH_INTERIOR,
    fallbackUrl: ASSETS.TEMPLO_PORTADA
  },
  {
    id: 'mirador_cordillera',
    location: 'Castillo del Búho y Cordillera Real',
    promoPhrase: '¡Visita Peñas! Despierta frente a los nevados Illampu, Chearoco e Illimani.',
    imageUrl: ASSETS.CASTILLO_CORDILLERA,
    fallbackUrl: ASSETS.TITLE_BACKDROP
  },
  {
    id: 'murales_cafeteria',
    location: 'Cafetería, Murales y Artesanías de Peñas',
    promoPhrase: '¡Visita Peñas, La Paz! Arte muralista, aguayos y sabores del Altiplano.',
    imageUrl: ASSETS.MURALES_CAFETERIA,
    fallbackUrl: ASSETS.ADVENTURE_PARK_BUS
  },
  {
    id: 'pachamama_mural',
    location: 'Murales de la Pachamama y Senderos',
    promoPhrase: '¡Visita Peñas! Naturaleza viva, arte popular y aire puro a 4.000 metros.',
    imageUrl: ASSETS.MURAL_PACHAMAMA,
    fallbackUrl: ASSETS.CALVARIO_CARMEN
  },
  {
    id: 'templo_portada',
    location: 'Portada de Piedra y Campanario · Peñas',
    promoPhrase: '¡Visita Peñas, La Paz! Historia, trueque y memoria viva de nuestra tierra.',
    imageUrl: ASSETS.TEMPLO_PORTADA,
    fallbackUrl: ASSETS.MUSEUM_ARTIFACTS
  }
];

export const TRAVELER_PROFILES: Record<TravelerTrait, TravelerProfileInfo> = {
  cultural: {
    trait: 'cultural',
    title: 'Turista Cultural',
    subtitle: 'Guardián de la Memoria Aymara',
    description:
      'Viajas para escuchar las historias que guardan las piedras, las plazas, las cuevas pintadas y los tejidos. Encuentras sentido en la memoria de Túpac Katari, el arte Yaya-Mama (tradición ceremonial padre-madre) y el simbolismo del aguayo (tejido tradicional andino).',
    recommendation:
      'Recorre la Plaza de Túpac Katari, el retablo dorado del templo, las cuevas con arte rupestre y el taller textil de la comunidad.'
  },
  aventurero: {
    trait: 'aventurero',
    title: 'Aventurero de Altura',
    subtitle: 'Conquistador de las Peñas Graníticas',
    description:
      'Te mueve la adrenalina limpia de los 4.000 metros, las paredes de granito, las cuevas escondidas y los miradores que abrazan la Cordillera Real.',
    recommendation:
      'Explora las rutas de escalada deportiva en las peñas, sube al Calvario y disfruta el amanecer desde el Mirador Nido de Cóndores.'
  },
  naturaleza: {
    trait: 'naturaleza',
    title: 'Explorador de Naturaleza',
    subtitle: 'Observador de la Pachamama (Madre Tierra)',
    description:
      'Conectas con el silencio del Altiplano, el vuelo del cóndor, las plantas sagradas como la k’oa (planta aromática ceremonial) y la yareta (planta milenaria de altura), y la armonía de las apachetas (montículos sagrados de piedras) en la montaña.',
    recommendation:
      'Camina por el Camino Prehispánico al alba para avistar vizcachas (roedores andinos) y cóndores mientras contemplas los nevados del Condoriri.'
  },
  comunitario: {
    trait: 'comunitario',
    title: 'Viajero Comunitario y Gastronómico',
    subtitle: 'Amigo del Pueblo y sus Sabores',
    description:
      'Descubres cada destino a través de su gente, el trueque tradicional y los sabores históricos nacidos en el pueblo como el Plato Paceño y el pan artesanal.',
    recommendation:
      'Comparte un plato tradicional y un mate andino junto a las familias anfitrionas de Peñas tras completar tu sendero.'
  }
};

export const DEFAULT_GAME_TEXTS: GameTexts = {
  titleScreen: {
    locationTag: 'Peñas · La Paz, Bolivia · ~4.000 m s. n. m.',
    gameTitle: 'Peñas: Sendero del Guardián',
    heroSubtitle:
      'Emprende una travesía desde la ciudad de La Paz (~60 km) hasta la comunidad ancestral de Peñas. Desbloquea las 7 locaciones desde la Plaza Principal hasta el Parque de Escalada para convertirte en Guardián de Peñas.',
    tataWelcome:
      '¡Kamisaraki (¿Cómo estás?), viajero! Soy Tata. Bienvenido a Peñas, nuestro pueblo ancestral ubicado a unos 60 kilómetros (entre 1 hora y media y 2 horas por carretera) desde La Paz, a casi 4.000 metros sobre el nivel del mar.',
    startButtonLabel: '¡Empezar el Juego!',
    resumeButtonLabel: 'Continuar Travesía',
    newGameButtonLabel: 'Nueva Partida',
    footerHint:
      'Explora el mapa de ruta, personaliza tu avatar en cuerpo completo y escucha a Tata en cada etapa'
  },
  mapScreen: {
    brandTitle: 'Peñas · La Paz',
    trailTitle: 'Ruta de las 7 Etapas en Peñas',
    narratorDefaultHint:
      'Avanza por las 7 etapas mientras desbloqueas reliquias para guardar la memoria histórica de Peñas.',
    narratorAllCompleted:
      '¡Has encendido las 7 reliquias de Peñas! Ya eres Guardián de Peñas; abre tu recompensa final para descubrir lo que te espera.'
  },
  stageModal: {
    tataSpeakerTitle: 'Tata',
    introListenSubtitle: 'Relato de Tata · Lee antes de comenzar',
    capsuleHeading: '¿Sabías que...?',
    startChallengeButton: 'Comenzar Desafío',
    dualChoiceHeader: 'Elige 1 de los 2 desafíos disponibles para completar este nivel:',
    traitSectionBadge: 'Pregunta personal para descubrir tu esencia de viajero',
    relicUnlockedBadge: 'Reliquia Desbloqueada',
    finishStageButton: 'Continuar'
  },
  victoryScreen: {
    headerKicker: '7 de 7 Reliquias Completadas · Pueblo de Peñas, La Paz',
    narratorClosing:
      'Has completado las 7 etapas con corazón abierto y te consagras como Guardián. Pulsa el botón ceremonial para descubrir qué tipo de viajero eres y abrir tu Guía de Viaje para explorar Peñas.',
    revealButtonText: 'Descubre qué tipo de viajero eres y tu guía para explorar Peñas',
    guideSectionLabel: 'Opción 2 · Tu Guía Personalizada',
    guideTitle: 'Guía de Viaje para Visitar Peñas',
    guideDescription: 'Según el tipo de turista que eres, armamos tu guía de viaje ideal en Peñas.',
    guideButtonText: 'Descargar y empezar la aventura',
    surpriseBadge: 'Regalo Sorpresa de la Comunidad de Peñas',
    surpriseButtonText: 'Haz click en el trofeo para descargar tu premio sorpresa',
    surpriseHint:
      'Solo al descargarlo descubrirás el beneficio especial que la comunidad preparó para tu visita.'
  },
  travelerProfiles: TRAVELER_PROFILES
};

export const DEFAULT_STAGES: StageData[] = [
  {
    id: 1,
    title: 'Plaza de Túpac Katari',
    subtitle: 'Epicentro histórico de 1781, Plato Paceño y Radio San Gabriel',
    eraOrElevation: '3.970 m s. n. m. · Plaza Principal',
    mapPosition: { x: 17, y: 80 },
    relicName: 'Chakana (cruz andina) de Bronce',
    relicDescription: 'Símbolo andino de los cuatro puntos cardinales y la memoria inmortal de 1781.',
    relicIcon: 'chakana',
    type: 'katari_phrase',
    secondaryType: 'plato_paceno_catch',
    primaryLabel: 'Frase de Katari',
    secondaryLabel: 'Armar Plato Paceño',
    narratorIntro:
      'Empecemos la travesía, soy tata, yo te guiaré a la victoria. Ahora estamos en la Plaza principal, donde en 1781 se alzó la gesta revolucionaria de Túpac Katari. Lee las fichas, responde la trivia y supera el desafío para ganar tu primera reliquia.',
    narratorSuccess:
      '¡Waliki (Bien / Excelente)! Has honrado la memoria de la Plaza de Túpac Katari y el origen del Plato Paceño. La Chakana (cruz andina) de Bronce ilumina tu camino.',
    educationalCapsule:
      '¡Bienvenido a la Plaza Principal de Peñas (3.970 m s. n. m.)! En 1781, el líder aymara Julián Apaza (Túpac Katari) y su esposa Bartolina Sisa encabezaron la gran rebelión indígena sitiando La Paz. La falta de alimentos unió choclo, papa, habas y queso frito dando origen al Plato Paceño. Juzgado en la casona de la plaza y ejecutado el 14 de noviembre de 1781, Katari proclamó: "Volveré y seré millones". En esta misma plaza nació Radio San Gabriel en lengua aymara.',
    didYouKnowBullets: [
      {
        title: 'El Plato Paceño nació de una guerra en Peñas',
        detail:
          'Durante el cerco a La Paz liderado por Túpac Katari en 1781, la falta de alimentos obligó a combinar choclo (maíz andino), papa, habas y queso frito, dando origen a este emblemático platillo.'
      },
      {
        title: 'Un grito inmortal',
        detail:
          'Tras ser traicionado en Peñas, Katari fue juzgado en la casona de la plaza y ejecutado por cuatro caballos el 14 de noviembre de 1781, pero antes proclamó: "¡Volveré y seré millones!".'
      },
      {
        title: 'Pioneros de la radio',
        detail:
          'En esta misma plaza nació Radio San Gabriel en los años 50, la primera emisora del país en transmitir alfabetización y cultura en lengua aymara.'
      }
    ],
    questionPrompt:
      'Ordena los bloques de piedra tallada con la última proclama que pronunció Túpac Katari:',
    secondaryPrompt:
      '¡Prepara el Plato Paceño de 1781! Atrapa los ingredientes necesarios y esquiva las piedras:',
    triviaPrompt: '¿Qué año fue el cerco a La Paz?',
    triviaOptions: ['1782', '1870', '1781'],
    triviaCorrectIndex: 2,
    options: [
      'El Plato Paceño (choclo, papa, habas y queso frito) y Radio San Gabriel en lengua aymara',
      'La Salteña y una estación de ferrocarril minero',
      'El Silpancho y el primer observatorio astronómico',
      'El Majadito y un puerto lacustre colonial'
    ],
    correctIndex: 0,
    videoUrl: '',
    videoScenes: [],
    videoHotspots: [],
    riddlePrompt: '',
    riddleAnswer: '',
    riddleAcceptedVariants: [],
    riddleHints: [],
    puzzleImageUrl: ASSETS.AGUAYO_PUZZLE,
    puzzleCaption: '',
    sceneImageUrl: ASSETS.PLAZA_KATARI,
    sceneCaption: 'Monumento a Túpac Katari, Bartolina Sisa y Gregoria Apaza en la Plaza Principal de Peñas.',
    infoGallery: [
      {
        imageUrl: ASSETS.PLAZA_KATARI,
        label: 'Monumento Histórico 1781',
        caption: 'Base escalonada en wiphala (bandera multicolor andina), mural del martirio y escultura de Bartolina Sisa en piedra.'
      },
      {
        imageUrl: ASSETS.MURALES_CAFETERIA,
        label: 'Plaza Viva y Sabores',
        caption: 'Cafetería Virgen de la Natividad, murales coloridos y puestos de artesanías junto a la plaza.'
      }
    ],
    travelerPrompt: 'Al comenzar en la Plaza Principal de Peñas, ¿qué historia te cautivó más?',
    travelerChoices: [
      { label: 'La valentía y última proclama de Túpac Katari y Bartolina Sisa', trait: 'cultural' },
      { label: 'El origen comunitario del Plato Paceño en tiempos de resistencia', trait: 'comunitario' },
      { label: 'La fuerza de los Andes que rodean la plaza a casi 4.000 metros', trait: 'naturaleza' },
      { label: 'Seguir las rutas históricas que parten hacia los cerros', trait: 'aventurero' }
    ]
  },
  {
    id: 2,
    title: 'Templo y Pisadas de la Virgen',
    subtitle: 'Retablo en pan de oro y devoción en la peña',
    eraOrElevation: 'Siglo XVI–XVIII · Templo Colonial',
    mapPosition: { x: 31, y: 69 },
    relicName: 'Campana Dorada',
    relicDescription: 'Resguarda el brillo del retablo colonial y las sagradas pisadas sobre la roca.',
    relicIcon: 'bell',
    type: 'magic_brush',
    primaryLabel: 'Pincel Mágico',
    narratorIntro:
      'Ahora llegamos al Templo Colonial de Peñas y a la roca donde se conservan las Pisadas de la Virgen. En su interior brilla un retablo barroco tallado en madera y decorado con pan de oro. Lee las fichas de abajo y supera el desafío del pincel mágico para devolverle su esplendor.',
    narratorSuccess:
      '¡Jallalla (¡Viva! / ¡Que florezca!)! El pan de oro del retablo vuelve a resplandecer junto a la fe viva de Peñas.',
    educationalCapsule:
      'El Templo Colonial de Peñas guarda una bóveda pintada a mano con motivos florales andinos y un retablo barroco bañado en pan de oro. A su lado, en la roca sagrada y la Gruta del Milagro, la comunidad venera las llamadas Pisadas de la Virgen de la Natividad, símbolo de sincretismo andino.',
    didYouKnowBullets: [
      {
        title: 'Un milagro contra la mita',
        detail:
          'Alrededor del año 1600, el indígena Pedro Ticona intentó ahorcarse en la roca para no ser llevado a la mita (trabajo mortal en las minas de Potosí); al saltar, la soga se rompió y la Virgen de la Natividad se le apareció para salvarlo.'
      },
      {
        title: 'Huellas en la piedra',
        detail:
          'En la pared rocosa contigua al templo se aprecian las "Pisadas de la Virgen", cavidades en la piedra donde la tradición afirma que la Virgen caminó al bajar del cerro.'
      },
      {
        title: 'Oro en el altiplano',
        detail:
          'El templo (edificado hacia 1611) guarda en su interior un deslumbrante retablo del siglo XVIII tallado en madera y decorado íntegramente en pan de oro.'
      }
    ],
    questionPrompt:
      'Pincel Mágico: desliza el dedo o cursor sobre el retablo para limpiar el polvo de los siglos y revelar el pan de oro.',
    triviaPrompt:
      '¿De qué salvó la Virgen de la Natividad a Pedro Ticona hacia el año 1600 y con qué está decorado el retablo del templo?',
    triviaOptions: [
      'De una inundación del río; y el retablo está tallado en mármol blanco',
      'De un derrumbe en la mina de cobre; y el retablo es de hierro forjado',
      'De ser llevado a la mita en las minas de Potosí; y el retablo está decorado en pan de oro',
      'De un incendio en la plaza; y el retablo está pintado con cal azul'
    ],
    triviaCorrectIndex: 2,
    options: [],
    correctIndex: 0,
    videoUrl: '',
    videoScenes: [],
    videoHotspots: [],
    riddlePrompt: '',
    riddleAnswer: '',
    riddleAcceptedVariants: [],
    riddleHints: [],
    puzzleImageUrl: ASSETS.AGUAYO_PUZZLE,
    puzzleCaption: '',
    sceneImageUrl: ASSETS.TEMPLO_PORTADA,
    sceneCaption: 'Portada tallada en piedra rosada y campanario colonial del Templo de Peñas.',
    infoGallery: [
      {
        imageUrl: ASSETS.TEMPLO_PORTADA,
        label: 'Portada y Campanario',
        caption: 'Arco tallado en piedra rosada y torre de adobe rodeada por antiguos cipreses.'
      },
      {
        imageUrl: ASSETS.CHURCH_INTERIOR,
        label: 'Bóveda y Retablo Dorado',
        caption: 'Techo pintado con medallones y flores andinas sobre el retablo en pan de oro.'
      }
    ],
    travelerPrompt: 'Al contemplar el arte del templo y la roca sagrada, ¿qué te atrae más?',
    travelerChoices: [
      { label: 'Descifrar el sincretismo entre el barroco dorado y la espiritualidad andina', trait: 'cultural' },
      { label: 'Conversar con los comunarios que cuidan el templo y organizan las fiestas', trait: 'comunitario' },
      { label: 'Caminar hacia los farallones donde reposa la gruta natural', trait: 'aventurero' },
      { label: 'Apreciar cómo la piedra natural se integra con el santuario', trait: 'naturaleza' }
    ]
  },
  {
    id: 3,
    title: 'Camino Prehispánico y Saca Cuellos',
    subtitle: 'Canasta de totora, trueque andino y telar sagrado',
    eraOrElevation: 'Ruta Milenaria · Terrazas y Saca Cuellos',
    mapPosition: { x: 27, y: 39 },
    relicName: 'Hilo del Trueque',
    relicDescription: 'Enlaza los caminos prehispánicos, la cestería en totora (junco andino) y el aguayo (tejido tradicional andino) comunitario.',
    relicIcon: 'loom',
    type: 'totora_basket',
    secondaryType: 'puzzle',
    primaryLabel: 'Canasta y Trueque',
    secondaryLabel: 'Telar del Aguayo (tejido andino)',
    narratorIntro:
      'Seguimos el antiguo Camino Prehispánico empedrado y el paso rocoso de Saca Cuellos. Por estas sendas caminaron caravanas durante siglos para hacer trueque entre el Altiplano y los valles. Lee las fichas y elige un desafío para completar esta etapa.',
    narratorSuccess:
      '¡Manos sabias! Con tu canasta lista para el trueque y el aguayo (tejido tradicional andino) en orden, honras los antiguos senderos andinos.',
    educationalCapsule:
      'El Camino Prehispánico que atraviesa Peñas y el sector de Saca Cuellos conectaba el Altiplano con los valles interandinos mediante caravanas de trueque. En canastas tejidas en totora (junco andino) y aguayos (tejidos multicolores) se intercambiaban chuño (papa deshidratada por helada), quinua (grano sagrado andino), k’oa (planta aromática ceremonial) y papa nativa según la reciprocidad del ayni (trabajo y ayuda mutua).',
    didYouKnowBullets: [
      {
        title: 'El internet del pasado',
        detail:
          'El camino empedrado y las terrazas agrícolas llamadas tacanas (andenes de cultivo) forman parte de la red vial prehispánica que conectaba el altiplano con los valles para intercambiar papa, tarwi (leguminosa andina o chocho) y carne de llama.'
      },
      {
        title: 'El paso donde pierdes el cuello',
        detail:
          'La formación rocosa "Sacacuellos" es una grieta natural con una ilusión óptica única: al cruzarla, las rocas ocultan tu cuerpo y desde afuera solo se te ven la cabeza y los pies.'
      },
      {
        title: 'Ingeniería milenaria',
        detail:
          'Las piedras del sendero han resistido el tránsito de caminantes, recuas de llamas y comerciantes desde hace más de 500 años.'
      }
    ],
    questionPrompt:
      'Teje tu canasta de totora (junco andino) paso a paso y llénala con chuño (papa deshidratada), quinua (grano andino), k’oa (planta ceremonial) y papa para el trueque:',
    secondaryPrompt:
      'Reconstruye el Aguayo (tejido sagrado andino) intercambiando las piezas del telar (3×3):',
    triviaPrompt: '¿Qué ilusión óptica ocurre en Saca Cuellos?',
    triviaOptions: [
      'Las rocas ocultan tu cuerpo y solo se ve la cabeza',
      'Las grietas crean una sombra grande',
      'No se te ve la cabeza ni los pies',
      'Solo se ven las manos'
    ],
    triviaCorrectIndex: 0,
    options: [],
    correctIndex: 0,
    videoUrl: '',
    videoScenes: [],
    videoHotspots: [],
    riddlePrompt: '',
    riddleAnswer: '',
    riddleAcceptedVariants: [],
    riddleHints: [],
    puzzleImageUrl: ASSETS.AGUAYO_PUZZLE,
    puzzleCaption: 'Aguayo (tejido andino) ceremonial con Chakana (cruz andina), cóndores andinos y picos de la Cordillera Real',
    sceneImageUrl: ASSETS.CAMINO_PIEDRA,
    sceneCaption: 'Camino Prehispánico empedrado y terrazas agrícolas ancestrales entre los cerros de Peñas.',
    infoGallery: [
      {
        imageUrl: ASSETS.MUSEUM_ARTIFACTS,
        label: 'Cestería y Museo',
        caption: 'Canastas de totora (junco andino) y productos nativos empleados para el trueque andino.'
      },
      {
        imageUrl: ASSETS.MURALES_CAFETERIA,
        label: 'Artesanía Local',
        caption: 'Sombreros artesanales, estuches de aguayo (tejido andino) y murales culturales en el pueblo.'
      }
    ],
    travelerPrompt: 'Si participaras en un trueque ancestral por el Camino Prehispánico, ¿qué llevarías?',
    travelerChoices: [
      { label: 'Chuño (papa deshidratada), quinua (grano andino) y papas nativas para compartir con otras familias', trait: 'comunitario' },
      { label: 'Aguayos (tejidos andinos) con iconografía simbólica de Peñas', trait: 'cultural' },
      { label: 'K’oa (planta aromática ceremonial) recolectada en las laderas del Altiplano', trait: 'naturaleza' },
      { label: 'Un buen par de botas para cruzar el paso de Saca Cuellos', trait: 'aventurero' }
    ]
  },
  {
    id: 4,
    title: 'Cueva Kunkuntiji (gruta en el cuello de la montaña)',
    subtitle: 'Piedras de memoria y ofrendas sagradas',
    eraOrElevation: '4.080 m s. n. m. · Cueva Natural',
    mapPosition: { x: 45, y: 29 },
    relicName: 'Piedra de K’oa (planta aromática ceremonial)',
    relicDescription: 'Guarda la fragancia ceremonial y el eco milenario de la Cueva Kunkuntiji (gruta en el cuello de la montaña).',
    relicIcon: 'quinoa',
    type: 'memory_game',
    secondaryType: 'riddle',
    primaryLabel: 'Piedras de la Cueva',
    secondaryLabel: 'Acertijo del Eco',
    narratorIntro:
      'Subimos hasta la Cueva Kunkuntiji (gruta en el cuello de la montaña), una gruta natural escondida entre los peñascos de Peñas. En noviembre de 1781 sirvió como último refugio secreto de Túpac Katari y espacio de ofrendas con k’oa (planta aromática ceremonial). Lee las fichas de abajo y elige un desafío para revelar sus pares sagrados o descifrar el acertijo del eco.',
    narratorSuccess:
      '¡Excelente memoria! Las piedras de la Cueva Kunkuntiji (gruta en el cuello de la montaña) reconocen el respeto de quien escucha a la Pachamama (Madre Tierra).',
    educationalCapsule:
      'La Cueva Kunkuntiji (gruta en el cuello de la montaña) es una cavidad granítica natural en las laderas altas de Peñas utilizada tradicionalmente como espacio de recogimiento y ofrendas con k’oa (planta aromática ceremonial). En sus grietas cercanas habitan vizcachas (roedores andinos de las rocas), y desde sus alrededores se observa el vuelo del cóndor sobre matas de yareta (planta milenaria de altura).',
    didYouKnowBullets: [
      {
        title: 'El último refugio',
        detail:
          'En noviembre de 1781, tras el repliegue de las tropas rebeldes, Túpac Katari usó la cueva Kunkuntiji (gruta en el cuello de la montaña) como su centro de operaciones secreto.'
      },
      {
        title: 'Significado en aymara',
        detail:
          'En lengua aymara, el nombre Kunkuntiji (cavidad o gruta en el cuello de la montaña) evoca el refugio natural resguardado entre las rocas.'
      },
      {
        title: 'El secreto entre las rocas',
        detail:
          'Las autoridades realistas españolas descubrieron a Katari en esta cueva tras una delación en los alrededores antes de trasladarlo a la plaza.'
      }
    ],
    questionPrompt:
      'Memorama en la Cueva Kunkuntiji: voltea las piedras y encuentra los 6 pares sagrados (con k’oa, planta aromática andina):',
    secondaryPrompt:
      'Escucha el eco dentro de la Cueva Kunkuntiji y descifra el acertijo de Tata:',
    triviaPrompt:
      'Según las fichas de «¿Sabías que...?», ¿para qué utilizó Túpac Katari la Cueva Kunkuntiji en noviembre de 1781?',
    triviaOptions: [
      'Como depósito colonial para guardar las campanas del templo',
      'Como su centro de operaciones secreto entre las rocas',
      'Como mirador astronómico para observar el Lago Titicaca',
      'Como taller textil donde se tejían los primeros aguayos'
    ],
    triviaCorrectIndex: 1,
    options: [],
    correctIndex: 0,
    videoUrl: '',
    videoScenes: [],
    videoHotspots: [],
    riddlePrompt:
      'Soy una planta aromática de ramitas resinosas que crece en el Altiplano; se me enciende con respeto en mesas rituales y cuevas sagradas para agradecer a la Pachamama (Madre Tierra), y reemplazo a la quinua en las piedras de esta cueva. ¿Cómo me llamo?',
    riddleAnswer: 'koa',
    riddleAcceptedVariants: ['koa', "k'oa", 'k oa', 'qoa', "q'oa", 'la koa'],
    riddleHints: [
      'Pista 1: Su nombre es muy corto, de solo tres letras (a veces escrita con apóstrofo).',
      'Pista 2: Empieza con "K" y termina con "A".',
      'Pista 3: También la colocaste dentro de tu canasta de totora (junco andino) para el trueque en la etapa anterior.'
    ],
    puzzleImageUrl: ASSETS.AGUAYO_PUZZLE,
    puzzleCaption: '',
    sceneImageUrl: ASSETS.KUNKUNTIJI_CAVE,
    sceneCaption: 'Cueva Kunkuntiji (gruta en el cuello de la montaña) · Bóveda natural de granito iluminada por el silencio andino.',
    infoGallery: [
      {
        imageUrl: ASSETS.KUNKUNTIJI_CAVE,
        label: 'Caverna Granítica Kunkuntiji',
        caption: 'Abrigo de roca en las laderas altas donde se recuerda la memoria y espiritualidad aymara.'
      }
    ],
    travelerPrompt: 'Dentro de una cueva ancestral como Kunkuntiji, ¿qué te conecta más con el lugar?',
    travelerChoices: [
      { label: 'La energía ceremonial de la k’oa (planta aromática) y las ofrendas a la Pachamama (Madre Tierra)', trait: 'cultural' },
      { label: 'Explorar cada recoveco de roca granítica con linterna en mano', trait: 'aventurero' },
      { label: 'Observar el refugio que brinda a la fauna de altura como la vizcacha (roedor andino)', trait: 'naturaleza' },
      { label: 'Compartir las leyendas orales que cuentan los abuelos del pueblo', trait: 'comunitario' }
    ]
  },
  {
    id: 5,
    title: 'Cueva Qillqantiji (abrigo rocoso con arte pintado)',
    subtitle: 'Serpiente de 3 cabezas y estilo Yaya-Mama (tradición padre-madre)',
    eraOrElevation: 'Patrimonio Prehispánico · Abrigo Rocoso',
    mapPosition: { x: 59, y: 47 },
    relicName: 'Pincel de Ocre Yaya-Mama (tradición padre-madre)',
    relicDescription: 'Restaura los pigmentos rojos y amarillos trazados hace milenios sobre la roca.',
    relicIcon: 'wiphala',
    type: 'rupestre_snake',
    primaryLabel: 'Serpiente 3 Cabezas',
    narratorIntro:
      'Llegamos a la Cueva Qillqantiji (abrigo rocoso con arte pintado), cuyo farallón guarda pinturas rupestres milenarias. Aquí destacan serpientes míticas de tres cabezas trazadas con pigmentos minerales del estilo Yaya-Mama (tradición ceremonial padre-madre). Lee las fichas de abajo, acierta la trivia y restaura la pintura ancestral.',
    narratorSuccess:
      '¡Obra milenaria restaurada! La Serpiente de 3 Cabezas del estilo Yaya-Mama (tradición padre-madre) vuelve a latir sobre la roca de Qillqantiji (abrigo rocoso pintado).',
    educationalCapsule:
      'La Cueva Qillqantiji (abrigo rocoso con arte pintado) conserva valiosas pinturas rupestres ejecutadas con pigmentos minerales rojos y amarillos vinculados a la tradición religiosa formativa del Lago Titicaca: el estilo Yaya-Mama (tradición ceremonial padre-madre). Destaca la figura mítica de la serpiente de tres cabezas, símbolo del agua, la fertilidad y la dualidad andina.',
    didYouKnowBullets: [
      {
        title: 'Serpientes de dos y tres cabezas',
        detail:
          'En las pinturas de Qillqantiji (abrigo rocoso pintado) existen representaciones únicas en la región de serpientes bi y tricéfalas (anfisbenas) y máscaras ancestrales del período Formativo, llamado estilo Yaya-Mama (tradición padre-madre).'
      },
      {
        title: 'Tres colores minerales',
        detail:
          'Los antiguos artistas utilizaron pigmentos minerales para trazar motivos en tres colores: rojo ocre, blanco y amarillo.'
      },
      {
        title: 'Tesoro protegido',
        detail:
          'Para evitar el deterioro y el vandalismo por grafiti, la SIARB y la comunidad instalaron un cercado perimétrico de protección que solo se abre con guías locales.'
      }
    ],
    questionPrompt:
      'Elige pigmento mineral (Rojo o Amarillo) y une los puntos sobre la roca para restaurar la Serpiente de 3 Cabezas:',
    triviaPrompt:
      '¿A qué estilo arqueológico prehispánico pertenecen las pinturas rupestres de la Cueva Qillqantiji y qué colores minerales utilizaron?',
    triviaOptions: [
      'Estilo Barroco Mestizo, con tintes verdes y dorados',
      'Estilo Neoclásico Europeo, con pintura azul y plateada',
      'Estilo Yaya-Mama (tradición padre-madre), con pigmentos rojo ocre, blanco y amarillo',
      'Estilo Minimalista Contemporáneo, con carbón negro únicamente'
    ],
    triviaCorrectIndex: 2,
    options: [],
    correctIndex: 0,
    videoUrl: '',
    videoScenes: [],
    videoHotspots: [],
    riddlePrompt: '',
    riddleAnswer: '',
    riddleAcceptedVariants: [],
    riddleHints: [],
    puzzleImageUrl: ASSETS.AGUAYO_PUZZLE,
    puzzleCaption: '',
    sceneImageUrl: ASSETS.QILLQANTIJI_CAVE,
    sceneCaption: 'Cueva Qillqantiji (abrigo rocoso con arte pintado) · Arte rupestre en pigmentos minerales.',
    infoGallery: [
      {
        imageUrl: ASSETS.QILLQANTIJI_SNAKE,
        label: 'Pintura Rupestre Original',
        caption: 'Registro fotográfico sobre roca con la mítica serpiente escalonada de tres cabezas.'
      },
      {
        imageUrl: ASSETS.QILLQANTIJI_CAVE,
        label: 'Abrigo Rocoso Qillqantiji',
        caption: 'Pared granítica que resguarda trazos prehispánicos de la tradición Yaya-Mama (padre-madre).'
      }
    ],
    travelerPrompt: 'Frente a pinturas rupestres de hace miles de años, ¿qué te emociona pensar?',
    travelerChoices: [
      { label: 'Descifrar la simbología Yaya-Mama (padre-madre) de la serpiente de tres cabezas', trait: 'cultural' },
      { label: 'Entender cómo extraían pigmentos minerales de la propia tierra', trait: 'naturaleza' },
      { label: 'Llegar por senderos escondidos hasta los abrigos rocosos', trait: 'aventurero' },
      { label: 'Cuidar el sitio junto a la comunidad para que no sea dañado', trait: 'comunitario' }
    ]
  },
  {
    id: 6,
    title: 'Calvario y Ruinas del Carmen',
    subtitle: 'Apachetas (montículos de piedra) y cruces procesionales',
    eraOrElevation: '4.180 m s. n. m. · Cerro Calvario',
    mapPosition: { x: 78, y: 61 },
    relicName: 'Cruz de Piedra del Calvario',
    relicDescription: 'Símbolo de fe, equilibrio espiritual y buen augurio en las cumbres de Peñas.',
    relicIcon: 'key',
    type: 'apacheta_stack',
    secondaryType: 'calvario_crosses',
    primaryLabel: 'Apilar Piedras',
    secondaryLabel: 'Buscar Cruces',
    narratorIntro:
      'Ascendemos por las 14 cruces del cerro calvario hasta las antiguas ruinas de Carmen Pata, aquí el sincretismo religioso se vive cada día, lee las fichas, responde a la trivia y elige tu desafío para continuar tu camino.',
    narratorSuccess:
      '¡Equilibrio y vista aguda! Tu apacheta (montículo sagrado de piedras) y las cruces del Calvario bendicen el último tramo de tu expedición.',
    educationalCapsule:
      'En el cerro Calvario y junto a las históricas Ruinas del Carmen, los caminantes practican dos tradiciones vivas: levantar apachetas (montículos sagrados de piedras) en equilibrio para pedir salud y prosperidad a la Pachamama (Madre Tierra), y recorrer las estaciones señaladas por cruces procesionales sobre las laderas rocosas.',
    didYouKnowBullets: [
      {
        title: 'Casitas para tus sueños',
        detail:
          "Los visitantes arman pequeñas construcciones de piedra llamadas ch'akras (casitas simbólicas en miniatura) en la cumbre como ofrendas a la Pachamama (Madre Tierra) para pedir vivienda, auto o prosperidad."
      },
      {
        title: '14 Cruces procesionales',
        detail:
          'El ascenso por el cerro está marcado por 14 cruces blancas que son visibles desde la plaza principal del pueblo.'
      },
      {
        title: 'Ruinas en la cima',
        detail:
          'En lo más alto yacen los restos de la Capilla del Carmen, construida durante la Colonia sobre un antiguo centro ritual de las culturas Pacajes e Inka.'
      }
    ],
    questionPrompt:
      'Apacheta (montículo sagrado) de buen augurio: apila 5 piedras en equilibrio sin que se caigan para agradecer a la Pachamama (Madre Tierra):',
    secondaryPrompt:
      'Camino Procesional: busca y marca las 4 cruces ocultas entre el cerro rocoso y las Ruinas del Carmen:',
    triviaPrompt:
      '¿Cuántas cruces blancas marcan el ascenso del Calvario y cómo se llaman las casitas simbólicas de piedra que arman los visitantes?',
    triviaOptions: [
      '7 cruces doradas, y las casitas simbólicas se llaman tacanas',
      '14 cruces blancas, y las casitas simbólicas de piedra se llaman ch’akras',
      '12 cruces de madera, y las casitas simbólicas se llaman tambos',
      '20 cruces de granito, y las casitas simbólicas se llaman qullqas'
    ],
    triviaCorrectIndex: 1,
    options: [],
    correctIndex: 0,
    videoUrl: '',
    videoScenes: [],
    videoHotspots: [],
    riddlePrompt: '',
    riddleAnswer: '',
    riddleAcceptedVariants: [],
    riddleHints: [],
    puzzleImageUrl: ASSETS.AGUAYO_PUZZLE,
    puzzleCaption: '',
    sceneImageUrl: ASSETS.CALVARIO_CARMEN,
    sceneCaption: 'Cerro Calvario y Ruinas del Carmen · Piedras en equilibrio y cruces en la cima.',
    infoGallery: [
      {
        imageUrl: ASSETS.CALVARIO_CARMEN,
        label: 'Cerro Calvario',
        caption: 'Apachetas (montículos sagrados de piedras) de buen augurio y cruces devocionales sobre los peñascos.'
      },
      {
        imageUrl: ASSETS.CASTILLO_CORDILLERA,
        label: 'Rutas y Señalética',
        caption: 'Senderos señalizados hacia la Gruta del Milagro, Calvario y cumbres nevadas.'
      }
    ],
    travelerPrompt: 'Al alcanzar el Calvario y las Ruinas del Carmen, ¿qué gesto harías primero?',
    travelerChoices: [
      { label: 'Apilar piedras en silencio agradeciendo a la Pachamama (Madre Tierra)', trait: 'naturaleza' },
      { label: 'Recorrer cada estación observando la arquitectura de las ruinas', trait: 'cultural' },
      { label: 'Seguir ascendiendo hacia el filo más alto del cerro rocoso', trait: 'aventurero' },
      { label: 'Compartir deseos de bienestar para mi familia y comunidad', trait: 'comunitario' }
    ]
  },
  {
    id: 7,
    title: 'Mirador Nido de Cóndores y Escalada',
    subtitle: 'Panorámica 360° a la Cordillera Real y muro granítico',
    eraOrElevation: '4.300 m s. n. m. · Cumbre y Farallones',
    mapPosition: { x: 89, y: 31 },
    relicName: 'Mosquetón del Cóndor',
    relicDescription: 'Sello supremo de quien coronó los farallones y contempló la Cordillera Real.',
    relicIcon: 'carabiner',
    type: 'climbing_game',
    primaryLabel: 'Escalar el Muro',
    narratorIntro:
      '¡Has llegado a la séptima y última etapa, el Mirador Nido de Cóndores! Desde estos farallones rocosos se abre el atardecer hacia la Cordillera Real y esperan las rutas de escalada en roca. Lee las fichas de abajo, acierta la trivia y supera la escalada para graduarte como Guardián de Peñas.',
    narratorSuccess:
      '¡Jallalla (¡Viva!), Guardián de Peñas! Las 7 reliquias brillan juntas en la cima. Es momento de descubrir tu perfil de viajero y tu guía secreta para explorar Peñas.',
    educationalCapsule:
      'A 4.300 m s. n. m., el Mirador Nido de Cóndores o Wiraconi (mirador sagrado del cóndor) regala una panorámica de 360 grados del Altiplano y los glaciares de la Cordillera Real (Condoriri, Huayna Potosí e Illampu). Junto a sus farallones de granito firme se ubica el Parque de Escalada de Peñas, referente nacional de escalada responsable sin dejar huella.',
    didYouKnowBullets: [
      {
        title: 'Capital de la escalada',
        detail:
          'Peñas es la meca de la escalada en roca de Bolivia con más de 150 vías en farallones de conglomerado rojo, tirolesa y vía ferrata, impulsadas por el Padre Antonio Zavatarelli ("el cura escalador").'
      },
      {
        title: 'Mirador panorámico a 360°',
        detail:
          'Desde el Nido de Cóndores se aprecia simultáneamente el Lago Titicaca y los colosos nevados de la Cordillera Real, como el Chachacomani, el Huayna Potosí y el Illampu.'
      },
      {
        title: "Queso y k'oa (planta ceremonial) artesanal",
        detail:
          "Peñas destaca por su gastronomía local, ofreciendo queso criollo de vaca de alta montaña y un exclusivo licor artesanal elaborado con k'oa (planta aromática ceremonial)."
      }
    ],
    questionPrompt:
      'Escala el muro granítico de Peñas eligiendo agarres firmes, recogiendo residuos y alcanzando la Cumbre del Cóndor:',
    triviaPrompt:
      'Desde el Mirador Nido de Cóndores se aprecia el Lago Titicaca junto a ¿qué imponente cadena de nevados (como el Huayna Potosí e Illampu)?',
    triviaOptions: [
      'Cordillera Occidental',
      'Serranía del Aguaragüe',
      'Cordillera de Sama',
      'Cordillera Real'
    ],
    triviaCorrectIndex: 3,
    options: [],
    correctIndex: 0,
    videoUrl: '',
    videoScenes: [],
    videoHotspots: [],
    riddlePrompt: '',
    riddleAnswer: '',
    riddleAcceptedVariants: [],
    riddleHints: [],
    puzzleImageUrl: ASSETS.AGUAYO_PUZZLE,
    puzzleCaption: '',
    sceneImageUrl: ASSETS.MIRADOR_CORDILLERA_REAL,
    sceneCaption: 'Vista panorámica desde el Mirador Nido de Cóndores hacia el Altiplano y la Cordillera Real.',
    infoGallery: [
      {
        imageUrl: ASSETS.MIRADOR_PUEBLO_CORDILLERA,
        label: 'Mirador Nido de Cóndores',
        caption: 'Panorámica de 360° hacia el pueblo de Peñas, el Altiplano y los glaciares de la Cordillera Real.'
      }
    ],
    travelerPrompt: 'En la cima de Peñas, con las 7 reliquias reunidas, ¿cómo coronas tu travesía?',
    travelerChoices: [
      { label: 'Contemplando el vuelo del cóndor frente a la Cordillera Real', trait: 'naturaleza' },
      { label: 'Celebrando el ascenso por las paredes de granito del parque', trait: 'aventurero' },
      { label: 'Guardando cada relato y símbolo ancestral en mi memoria', trait: 'cultural' },
      { label: 'Bajando al pueblo para celebrar con los guías y vecinos', trait: 'comunitario' }
    ]
  }
];
