import { AppLanguage } from './types';
import { TravelerTrait } from '../types/game';

export interface UiDictionary {
  app: {
    loadingView: string;
    loadingStage: string;
  };
  errorBoundary: {
    title: string;
    description: string;
    retryButton: string;
  };
  routeMap: {
    ariaLabel: string;
  };
  titleScreen: {
    tataHomeIntro: string;
    headline: string;
    altBackdrop: string;
    altPortrait: string;
    newGameTitle: string;
    customAvatarBannerPrefix: string;
    nameLabel: string;
    namePlaceholder: string;
    editAvatarButton: string;
    resetToDefaultLabel: string;
    defaultTravelerName: string;
  };
  narratorDock: {
    defaultTagline: string;
    altTata: string;
    altMiniTata: string;
    muteVoice: string;
    listenVoice: string;
    stopNarration: string;
    repeatNarration: string;
    muteLabel: string;
    voiceLabel: string;
    stopLabel: string;
    listenLabel: string;
  };
  audioControl: {
    volumeDown: string;
    volumeUp: string;
    muteAudio: string;
    enableAudio: string;
    audioMutedShort: string;
    musicShort: string;
    openMixerTitle: string;
    mixerAria: string;
    mixerTitle: string;
    ambientLabel: string;
    ambientSub: string;
    ambientToggleMute: string;
    ambientTogglePlay: string;
    volumeLabel: string;
    melodyLabel: string;
    melodySub: string;
    melodyToggleOff: string;
    melodyToggleOn: string;
    ambientSceneTitles: Record<string, string>;
    trackTitles: Record<string, string>;
  };
  epicMap: {
    progressSummary: (completed: number, total: number) => string;
    profileMedalsButton: string;
    avatarButton: string;
    returnTitleAria: string;
    returnTitleShort: string;
    timeTooltip: string;
    relicsCounter: (completed: number, total: number) => string;
    openVictoryDesktop: string;
    openVictoryMobile: string;
    altMapBg: string;
    stagePrefix: string;
    completedBadge: string;
    stageCompletedTitle: (id: number, title: string) => string;
    stageAvailableTitle: (id: number, title: string) => string;
    stageLockedTitle: (id: number, title: string) => string;
    stageShortWord: string;
    completedLabel: string;
    playLabel: string;
    lockedLabel: string;
    clickToPlayHint: string;
    completePreviousHint: (id: number) => string;
    completedModalTooltip: string;
    relicTag: string;
    guardianCelebrationTooltip: string;
    openRewardButton: string;
    guardianMedalTitle: string;
    guardianSubtitle: string;
    yourProgressTitle: string;
    relicsLabel: string;
    unlockedCount: (n: number) => string;
    achievementsLabel: string;
    ofEight: string;
    viewAllMedalsButton: string;
    relicsShowcaseTitle: string;
    relicShowcasePrefix: (id: number) => string;
    relicObtained: string;
    relicLocked: string;
    allRelicsCompletedHint: string;
    nextGoalHint: (id: number, title: string) => string;
  };
  stageModal: {
    stageBadge: (id: number, elevation: string) => string;
    closeModalAria: string;
    backToCardsButton: string;
    triviaBadge: string;
    triviaInstruction: string;
    triviaWrongMessage: string;
    triviaSuccessMessage: string;
    triviaContinueButton: string;
    stepOfTwo: string;
    challengeSolvedMsg: string;
    stepTwoBadge: string;
    changeChallengeButton: string;
    minigameCompleteFallback: string;
    riddleInputLabel: string;
    riddlePlaceholder: string;
    riddleVerifyButton: string;
    riddleSuccessMsg: string;
    riddleWrongMsg: (hintText: string) => string;
    quizSuccessMsg: string;
    quizWrongMsg: string;
    traitSavedMsg: string;
    relicSecuredBadge: string;
  };
  stageIntro: {
    cardPrefix: string;
    cardOpenedBadge: string;
    tapToRead: string;
    galleryHeading: string;
    factsProgress: (opened: number, total: number) => string;
    readAllToUnlock: string;
    nextButton: string;
  };
  challengeSelector: {
    badge: string;
    title: string;
    challengeIndex: (n: number) => string;
    playChallengeButton: string;
  };
  victoryScreen: {
    closingTataMessage: string;
    backToMapAria: string;
    backToMapLabel: string;
    shareAndMedalsAria: string;
    profileMedalsBtn: string;
    editAvatarBtn: string;
    kickerText: string;
    heroNameTitle: (name: string) => string;
    heroAlt: string;
    statsLabel: string;
    firstTryStat: (n: number) => string;
    relicsLabel: string;
    timeLabel: string;
    step1Badge: string;
    step1Title: string;
    step1Desc: string;
    revealSubtext: string;
    revealCardBadge: string;
    revealCardTag: string;
    revealStatsHeading: string;
    revealRelics: string;
    revealFirstTry: (n: number) => string;
    revealTime: string;
    revealMedals: (n: number) => string;
    celebrateHeading: string;
    celebrateSub: string;
    celebrationOptions: Record<'salto' | 'aguayo' | 'chakana', string>;
    shareHeading: string;
    shareDesc: string;
    createPostcardBtn: string;
    shareLinkBtn: string;
    linkCopiedBtn: string;
    linkCopiedHint: string;
    step3Badge: string;
    step3Title: string;
    voucherLabel: string;
    guideTitlePrefix: string;
    trophyAlt: string;
    penasClosingAlt: string;
    tataClosingSpeaker: string;
    downloadCompleteGuideBtn: string;
    traitLabels: Record<TravelerTrait, string>;
    traitDescriptions: Record<TravelerTrait, string>;
    traitShowcase: Record<TravelerTrait, { badge: string; alt: string; caption: string }>;
  };
  avatarCreator: {
    title: string;
    subtitle: string;
    closeAria: string;
    nameLabel: string;
    namePlaceholder: string;
    randomBtn: string;
    previewLabel: string;
    poseLabel: string;
    poseIdle: string;
    poseWalk: string;
    poseCheer: string;
    paletteLabel: string;
    tabs: {
      rostro: string;
      vestimenta: string;
      accesorios: string;
    };
    skinToneLabel: string;
    hairColorLabel: string;
    hairStyleLabel: string;
    outfitLabel: string;
    headwearLabel: string;
    accessoryLabel: string;
    cancelBtn: string;
    saveBtn: string;
    defaultName: string;
    skinTones: Record<string, string>;
    hairColors: Record<string, string>;
    hairStyles: Record<string, string>;
    outfits: Record<string, string>;
    headwears: Record<string, string>;
    accessories: Record<string, string>;
    palettes: Record<string, string>;
  };
  profileModal: {
    title: string;
    closeAria: string;
    stageCountStat: (done: number) => string;
    firstTryStat: (n: number) => string;
    medalsStat: (n: number, total: number) => string;
    medalsHeading: string;
    unlockedPill: string;
    downloadCardBtn: string;
    resetProgressBtn: string;
    confirmResetText: string;
    confirmResetYes: string;
    cancelBtn: string;
    cardSubtitle: string;
    cardRankLabel: string;
    cardStatsLine: (done: number, firstTry: number, medals: number, totalMedals: number, time: string) => string;
  };
  storyPostcard: {
    title: string;
    subtitle: string;
    closeAria: string;
    chooseBackdropLabel: string;
    generatingPreview: string;
    previewAlt: string;
    fallbackBadge: string;
    fallbackTitle: (name: string) => string;
    fallbackAction: string;
    downloadStoryBtn: string;
    generatingBtn: string;
    nativeShareBtn: string;
    shareNote: string;
    instaTips: string;
    copiedPrefix: string;
    shareTitle: string;
    shareText: (type: string) => string;
    canvasLocationHeader: string;
    canvasTitle: string;
    canvasFooterCta: string;
    canvasRankGuardian: string;
    canvasRankExplorer: string;
  };
  achievementToast: {
    header: string;
    closeAria: string;
  };
  katariPhrase: {
    introStatus: string;
    translationHint?: string;
    builtPhraseLabel: string;
    clickToRemoveHint: string;
    clearBtn: string;
    availableStonesLabel: string;
    verifyBtn: string;
    selectAllFourMsg: string;
    successMsg: string;
    wrongMsg: string;
  };
  platoPaceno: {
    introStatus: string;
    progressLabel: string;
    mistakesLabel: string;
    recipeLabel: string;
    moveLeftBtn: string;
    moveRightBtn: string;
    controlsHint: string;
    plateLabel: string;
    neededTag: string;
    stoneLabel: string;
    wrongIngredientFeedback: (label: string) => string;
    stoneHitFeedback: string;
    allCollectedFeedback: string;
    caughtIngredientFeedback: (label: string) => string;
    items: Record<string, string>;
  };
  magicBrush: {
    introStatus: string;
    restoredLabel: string;
    resetBtn: string;
    swipeHint: string;
    doneMsg: string;
    altAltarpiece: string;
  };
  totoraBasket: {
    introStatus: string;
    stepLabel: string;
    wovenPercent: (pct: number) => string;
    resetBtn: string;
    barterProductsHeading: string;
    barterSub: string;
    altMuseumBasket: string;
    basketCaption: string;
    steps: {
      base: { label: string; button: string; feedback: string };
      pared: { label: string; button: string; feedback: string };
      borde: { label: string; button: string; feedback: string };
      carga: { label: string; button: string; feedback: string };
    };
    products: {
      chuno: { name: string; hint: string };
      quinua: { name: string; hint: string };
      koa: { name: string; hint: string };
      papa: { name: string; hint: string };
    };
  };
  aguayoPuzzle: {
    introStatus: string;
    solvedBadge: string;
    movesLabel: string;
    resetBtn: string;
    referenceHeading: string;
    altReference: string;
    gridAria: string;
    tileAria: (pos: number) => string;
    captionFooter: string;
    solvedMessage: (moves: number) => string;
  };
  memoryGame: {
    introStatus: string;
    pairsLabel: string;
    attemptsLabel: string;
    resetBtn: string;
    cardBackAria: string;
    allPairsMsg: (attempts: number) => string;
    pairFoundMsg: (label: string) => string;
    pairMismatchMsg: string;
    cards: Record<string, { label: string; subtitle: string }>;
  };
  rupestreSnake: {
    introStatus: string;
    nodesLabel: string;
    pigmentLabel: string;
    mineralPrefix: string;
    redColor: string;
    yellowColor: string;
    resetBtn: string;
    svgAria: string;
    nextDotAria: (n: number) => string;
    dotAria: (n: number) => string;
    needNextDotMsg: (n: number) => string;
    progressMsg: (done: number, total: number, next: number) => string;
    completedMsg: string;
    colorSwitchMsg: (colorName: string) => string;
  };
  apachetaStack: {
    introStatus: string;
    stonesLabel: string;
    resetBtn: string;
    dropBtn: (name: string) => string;
    completedBanner: string;
    steadyMsg: (name: string, remaining: number) => string;
    toppledMsg: string;
    completedMsg: string;
    stoneNames: string[];
  };
  calvarioCrosses: {
    introStatus: string;
    crossesLabel: string;
    resetBtn: string;
    svgAria: string;
    crossSpotAria: (title: string) => string;
    alreadyFoundMsg: (title: string) => string;
    allFoundMsg: string;
    foundMsg: (title: string, desc: string) => string;
    crosses: Record<string, { title: string; desc: string }>;
  };
  climbingGame: {
    introStatus: string;
    altitudeLabel: string;
    gripLabel: string;
    leaveNoTraceLabel: string;
    slipsLabel: string;
    resetBtn: string;
    windLabel: string;
    windDanger: string;
    windCalm: string;
    chalkActiveBtn: string;
    chalkApplyBtn: (charges: number) => string;
    restBtn: string;
    directHoldLabel: string;
    tagWindActive: string;
    tagWindCalm: string;
    tagIceReady: string;
    tagIceSlip: string;
    tagLoose: string;
    tagOverhang: string;
    tagEco: string;
    looseFallMsg: (name: string) => string;
    windBlockedMsg: (name: string) => string;
    iceSlipMsg: (name: string) => string;
    overhangTiredMsg: string;
    ecoPickedMsg: (name: string) => string;
    anchoredMsg: (name: string) => string;
    summitWonMsg: string;
    chalkAppliedMsg: string;
    restedMsg: string;
    holds: Record<string, { name: string; clue: string }>;
  };
  mirador3d: {
    topTitle: string;
    topSubtitle: string;
    centerTitle: string;
    centerBtn: string;
    backTo3dBtn: string;
    realPhotosBtn: string;
    webglLostMsg: string;
    viewPhotosBtn: string;
    photosTitle: string;
    photosSubtitle: string;
    inFlightTag: string;
    playerLocationPrefix: (name: string, title: string) => string;
    presets: Record<string, { label: string; infoTitle: string; infoText: string }>;
    landmarks: Record<string, { label: string; elevation: string }>;
    photoCaptions: string[];
  };
  plazaVideo: {
    speakerPrefix: (badge: string) => string;
    voiceMuteTitle: string;
    voiceEnableTitle: string;
    voiceOnLabel: string;
    voiceOffLabel: string;
    pauseAria: string;
    playAria: string;
    timelineAria: string;
    restartAria: string;
    tataLabel: string;
    avatarLabel: (name: string) => string;
    slides: Array<{
      id: string;
      shortLabel: string;
      title: string;
      narration: string;
      avatarBadge: string;
      highlightTag: string;
    }>;
  };
  interactiveVideo: {
    iframeTitle: (stageTitle: string) => string;
    linkedCaption: string;
    readyLabel: string;
    fallbackCaption: string;
    exploredPointsLabel: string;
    closeBtn: string;
    pauseAria: string;
    playAria: string;
    timelineAria: string;
    restartAria: string;
  };
  pizzaGame: {
    introFeedback: string;
    ovenReadyFeedback: string;
    stepAddedFeedback: (label: string) => string;
    wrongOrderFeedback: (expectedLabel: string) => string;
    bakedDoneFeedback: string;
    ovenRetryFeedback: string;
    svgAria: string;
    ingredientsLabel: string;
    ovenTitle: string;
    pullOutBtn: string;
    doneTitle: string;
    doneDesc: string;
    bakeAgainBtn: string;
    ingredients: Record<string, string>;
  };
}

const UI_ES: UiDictionary = {
  app: {
    loadingView: 'Cargando vista de Peñas...',
    loadingStage: 'Cargando etapa de Peñas...'
  },
  errorBoundary: {
    title: 'Ocurrió un inconveniente en esta vista',
    description: 'Puedes volver a intentarlo sin perder tu progreso guardado en Peñas.',
    retryButton: 'Reintentar'
  },
  routeMap: {
    ariaLabel: 'Mapa de ruta desde La Paz y El Alto hasta Peñas'
  },
  titleScreen: {
    tataHomeIntro:
      '¡Hola, viajero! Estás por conocer Peñas, un pueblo histórico a 60 km de La Paz y 4.000 m de altura. Para jugar, avanza por las 7 paradas del mapa superando sus desafíos para reunir las reliquias y convertirte en Guardián de la memoria de Peñas, además un premio sorpresa te espera al final. Personaliza tu avatar aquí abajo y empieza la aventura.',
    headline: 'Bienvenido a Peñas, un pueblo histórico que debes conocer',
    altBackdrop: 'Plaza Principal de Peñas colorida con la Iglesia Colonial y las montañas andinas',
    altPortrait: 'Tata, guía sabio de Peñas',
    newGameTitle: 'Empezar desde cero (mantiene tu avatar)',
    customAvatarBannerPrefix: 'Avatar personalizado:',
    nameLabel: 'Tu nombre',
    namePlaceholder: 'Tu nombre',
    editAvatarButton: 'Editar Avatar',
    resetToDefaultLabel: 'Usar aspecto por defecto',
    defaultTravelerName: 'Viajero'
  },
  narratorDock: {
    defaultTagline: 'Relato de Peñas, La Paz',
    altTata: 'Tata narrador',
    altMiniTata: 'Tata',
    muteVoice: 'Silenciar voz de Tata',
    listenVoice: 'Escuchar voz de Tata',
    stopNarration: 'Detener relato de Tata',
    repeatNarration: 'Repetir relato de Tata',
    muteLabel: 'Silenciar',
    voiceLabel: 'Voz',
    stopLabel: 'Parar',
    listenLabel: 'Escuchar'
  },
  audioControl: {
    volumeDown: 'Bajar volumen',
    volumeUp: 'Subir volumen',
    muteAudio: 'Silenciar audio',
    enableAudio: 'Activar sonido andino',
    audioMutedShort: 'Audio OFF',
    musicShort: 'Música',
    openMixerTitle: 'Abrir mezclador andino',
    mixerAria: 'Controles de música y ambiente',
    mixerTitle: 'Sonido Andino de Peñas',
    ambientLabel: 'Ambiente Natural',
    ambientSub: 'Viento andino, campana y eco de quebrada',
    ambientToggleMute: 'Silenciar ambiente',
    ambientTogglePlay: 'Activar ambiente',
    volumeLabel: 'Volumen',
    melodyLabel: 'Melodía Tradicional',
    melodySub: 'Zampoña y quena andina suave',
    melodyToggleOff: 'Apagar melodía',
    melodyToggleOn: 'Encender melodía',
    ambientSceneTitles: {
      plaza: 'Plaza y Brisa de Altura',
      templo: 'Atrio y Campanas de Peñas',
      camino: 'Viento del Camino Prehispánico',
      kunkuntiji: 'Eco en Cueva Kunkuntiji',
      qillqantiji: 'Abrigo Rocoso Qillqantiji',
      calvario: 'Cumbres del Cerro Calvario',
      mirador: 'Vuelo del Cóndor · 4.300 m'
    },
    trackTitles: {
      plaza: 'Melodía de Plaza (Pentatónica)',
      sendero: 'Quena del Sendero Alto',
      mirador: 'Zampoña de la Cordillera'
    }
  },
  epicMap: {
    progressSummary: (completed, total) => `${completed} de ${total} etapas completadas`,
    profileMedalsButton: 'Perfil y Medallas',
    avatarButton: 'Avatar',
    returnTitleAria: 'Volver a la pantalla de bienvenida',
    returnTitleShort: 'Inicio',
    timeTooltip: 'Tiempo transcurrido desde el inicio de tu travesía',
    relicsCounter: (completed, total) => `${completed}/${total} Reliquias`,
    openVictoryDesktop: 'Abrir Recompensa Final',
    openVictoryMobile: 'Recompensa Final',
    altMapBg: 'Mapa de Peñas y sus 7 etapas',
    stagePrefix: 'Etapa',
    completedBadge: 'Completada',
    stageCompletedTitle: (id, title) => `Etapa ${id} completada: ${title}`,
    stageAvailableTitle: (id, title) => `Jugar Etapa ${id}: ${title}`,
    stageLockedTitle: (id, title) => `Etapa ${id}: ${title} (Completa la anterior primero)`,
    stageShortWord: 'Etapa',
    completedLabel: 'Completada',
    playLabel: 'Jugar',
    lockedLabel: 'Bloqueada',
    clickToPlayHint: 'Click para iniciar etapa',
    completePreviousHint: (id) => `Completa primero la Etapa ${id - 1}`,
    completedModalTooltip: 'Esta etapa ya fue completada (puedes volver a verla)',
    relicTag: 'Reliquia',
    guardianCelebrationTooltip: '¡Celebración del Guardián!',
    openRewardButton: 'Abrir Recompensa',
    guardianMedalTitle: 'Medalla del Guardián',
    guardianSubtitle: 'Disponible al completar 7/7',
    yourProgressTitle: 'Tu Progreso',
    relicsLabel: 'Reliquias',
    unlockedCount: (n) => `${n} desbloqueadas`,
    achievementsLabel: 'Logros',
    ofEight: 'de 8',
    viewAllMedalsButton: 'Ver todas las medallas y logros',
    relicsShowcaseTitle: 'Reliquias Desbloqueadas',
    relicShowcasePrefix: (id) => `E${id}`,
    relicObtained: 'Reliquia obtenida',
    relicLocked: 'Aún bloqueada',
    allRelicsCompletedHint: '¡Completaste las 7 etapas! Abre tu recompensa final para tu guía y premio.',
    nextGoalHint: (id, title) => `Siguiente parada en el mapa: Etapa ${id} (${title}).`
  },
  stageModal: {
    stageBadge: (id, elevation) => `Etapa ${id} de 7 · ${elevation}`,
    closeModalAria: 'Cerrar etapa',
    backToCardsButton: '← Volver a las fichas',
    triviaBadge: 'Trivia de la etapa',
    triviaInstruction: 'Acierta la trivia y accede al desafío de este nivel:',
    triviaWrongMessage: 'Respuesta incorrecta. Revisa el dato histórico e inténtalo de nuevo.',
    triviaSuccessMessage: '¡Correcto! Ya desbloqueaste el desafío de este nivel.',
    triviaContinueButton: 'Continuar al desafío',
    stepOfTwo: 'Paso 1 de 2 · Desafío del nivel',
    challengeSolvedMsg: '¡Desafío superado! Ahora responde esta pregunta personal para descubrir tu perfil.',
    stepTwoBadge: 'Paso 2 de 2 · Descubre tu perfil',
    changeChallengeButton: '← Cambiar de desafío',
    minigameCompleteFallback: 'Completa el desafío interactivo para desbloquear tu reliquia.',
    riddleInputLabel: 'Tu respuesta:',
    riddlePlaceholder: 'Escribe aquí el nombre de la planta sagrada...',
    riddleVerifyButton: 'Verificar Respuesta',
    riddleSuccessMsg: '¡Correcto! La k’oa aromática enciende el respeto a la Pachamama (Madre Tierra).',
    riddleWrongMsg: (hintText) => `Aún no es esa palabra. ${hintText}`,
    quizSuccessMsg: '¡Respuesta correcta!',
    quizWrongMsg: 'Respuesta incorrecta. Lee con atención la cápsula educativa arriba e inténtalo de nuevo.',
    traitSavedMsg: 'Tu respuesta se ha guardado en tu perfil de viajero.',
    relicSecuredBadge: 'Reliquia asegurada'
  },
  stageIntro: {
    cardPrefix: 'Ficha',
    cardOpenedBadge: 'Leída',
    tapToRead: 'Toca para abrir',
    galleryHeading: 'Imágenes de Peñas en esta etapa',
    factsProgress: (opened, total) => `${opened} de ${total} fichas leídas`,
    readAllToUnlock: 'Lee las 3 fichas para habilitar Siguiente',
    nextButton: 'Siguiente'
  },
  challengeSelector: {
    badge: 'Desafíos disponibles',
    title: 'Elige un desafío para completar esta etapa',
    challengeIndex: (n) => `Desafío ${n}`,
    playChallengeButton: 'Jugar este desafío'
  },
  victoryScreen: {
    closingTataMessage:
      'Felicidades y gracias por resguardar la memoria de nuestro pueblo, te esperamos en Peñas para celebrar.',
    backToMapAria: 'Volver al mapa de Peñas',
    backToMapLabel: 'Mapa',
    shareAndMedalsAria: 'Compartir logros o editar avatar',
    profileMedalsBtn: 'Medallas',
    editAvatarBtn: 'Avatar',
    kickerText: 'Guardián de Peñas · Cerro Calvario y Cordillera Real',
    heroNameTitle: (name) => `${name}, completaste la travesía`,
    heroAlt: 'Escena de cierre de Peñas al atardecer con la Cordillera Real',
    statsLabel: 'Tu recorrido',
    firstTryStat: (n) => `${n}/7 al 1er intento`,
    relicsLabel: 'Reliquias',
    timeLabel: 'Tiempo',
    step1Badge: 'Paso 1 · Descubre tu Espíritu de Viajero',
    step1Title: 'Tu perfil te espera al final del sendero',
    step1Desc:
      'Respondiste con el corazón en cada una de las 7 etapas. Pulsa el botón dorado para revelar qué tipo de viajero eres, celebrar con tu avatar y abrir tu Guía de Peñas y tu premio sorpresa.',
    revealSubtext: 'Revela tu perfil y desbloquea tu guía personalizada',
    revealCardBadge: 'Tu Esencia Revelada',
    revealCardTag: 'Guardián de Peñas',
    revealStatsHeading: 'Resumen de tu travesía',
    revealRelics: '7 / 7 reliquias',
    revealFirstTry: (n) => `${n} / 7 sin errores`,
    revealTime: 'Tiempo',
    revealMedals: (n) => `${n} / 8 medallas`,
    celebrateHeading: '¡Celebra con tu avatar!',
    celebrateSub: 'Toca un gesto para verlo festejar en Peñas',
    celebrationOptions: {
      salto: '¡Celebrar!',
      aguayo: 'Aguayo (tejido andino)',
      chakana: 'Chakana (cruz andina)'
    },
    shareHeading: 'Comparte tu aventura en Instagram y con amigos',
    shareDesc:
      'Descarga una postal vertical (9:16) con una imagen real de Peñas, tu avatar y tu tipo de viajero, o copia el enlace del juego.',
    createPostcardBtn: 'Crear Postal para Story',
    shareLinkBtn: 'Compartir enlace del juego',
    linkCopiedBtn: '¡Enlace copiado!',
    linkCopiedHint: 'Enlace copiado al portapapeles. ¡Compártelo en tus redes o WhatsApp!',
    step3Badge: 'Paso 3 · Regalo Sorpresa de la Comunidad de Peñas',
    step3Title: 'Tu Premio Sorpresa por Completar el Sendero',
    voucherLabel: 'Código de verificación',
    guideTitlePrefix: 'Guía personalizada',
    trophyAlt: 'Trofeo premio sorpresa de Peñas',
    penasClosingAlt: 'Comunidad y paisaje histórico de Peñas, La Paz',
    tataClosingSpeaker: 'Tata · Guardián de Peñas',
    downloadCompleteGuideBtn: 'Descargar Guía Completa de Peñas',
    traitLabels: {
      cultural: 'Cultural',
      aventurero: 'Aventurero',
      naturaleza: 'Naturaleza',
      comunitario: 'Comunitario'
    },
    traitDescriptions: {
      cultural: 'Historia, arte rupestre, retablos y memoria aymara.',
      aventurero: 'Escalada en roca, cuevas, filos y rutas de altura.',
      naturaleza: 'Cóndores, Cordillera Real, yareta y aire puro a 4.000 m.',
      comunitario: 'Sabores locales, trueque, familias anfitrionas y oficios.'
    },
    traitShowcase: {
      cultural: {
        badge: 'Cultura y Memoria',
        alt: 'Plaza principal de Peñas e historia de Túpac Katari',
        caption: 'Plaza de Túpac Katari, retablo en pan de oro y cuevas pintadas.'
      },
      aventurero: {
        badge: 'Aventura en Altura',
        alt: 'Parque de escalada y mirador en los farallones de Peñas',
        caption: 'Escalada en granito a 4.150 m frente a la Cordillera Real.'
      },
      naturaleza: {
        badge: 'Pachamama Viva',
        alt: 'Mural de la Pachamama y flora nativa de Peñas',
        caption: 'Paisajes del Altiplano, flora nativa y vuelo de cóndores.'
      },
      comunitario: {
        badge: 'Gente y Sabores',
        alt: 'Cafetería Virgen de la Natividad y murales de Peñas',
        caption: 'Trueque tradicional, Plato Paceño y hospitalidad en Peñas.'
      }
    }
  },
  avatarCreator: {
    title: 'Personaliza tu Viajero de Peñas',
    subtitle: 'Previsualiza tu personaje en cuerpo completo y dale un estilo único',
    closeAria: 'Cerrar personalizador de avatar',
    nameLabel: 'Tu nombre en la travesía',
    namePlaceholder: 'Ej. Amaru o Nayra',
    randomBtn: 'Aleatorio',
    previewLabel: 'Vista previa en cuerpo completo',
    poseLabel: 'Pose:',
    poseIdle: 'De pie',
    poseWalk: 'Caminando',
    poseCheer: 'Festejo',
    paletteLabel: 'Paleta de colores del atuendo',
    tabs: {
      rostro: 'Rostro y Cabello',
      vestimenta: 'Atuendo Andino',
      accesorios: 'Sombrero y Extras'
    },
    skinToneLabel: 'Tono de piel',
    hairColorLabel: 'Color de cabello',
    hairStyleLabel: 'Peinado',
    outfitLabel: 'Vestimenta tradicional o viajera',
    headwearLabel: 'Prenda de cabeza',
    accessoryLabel: 'Objeto compañero',
    cancelBtn: 'Cancelar',
    saveBtn: 'Guardar Avatar',
    defaultName: 'Viajero',
    skinTones: {
      clear: 'Andino Claro',
      warm: 'Cálido Sol',
      bronze: 'Bronce Altiplano',
      earth: 'Tierra Profunda'
    },
    hairColors: {
      black: 'Negro Noche',
      brown: 'Castaño Tierra',
      silver: 'Plata Sabia',
      copper: 'Cobre Andino'
    },
    hairStyles: {
      corto: 'Clásico Corto',
      cabello_suelto: 'Melena Suelta',
      trenzas_tullmas: 'Trenzas con Tullmas (adornos colgantes)',
      trenzas_dobles: 'Trenzas Dobles'
    },
    outfits: {
      poncho_tejido: 'Poncho Tejido',
      pollera_manta: 'Pollera y Manta',
      chaleco_aguayo: 'Chaleco de Aguayo (tejido andino)',
      capa_guardian: 'Capa del Guardián'
    },
    headwears: {
      chullo: 'Chullo (gorro andino) Tejido',
      sombrero_bombin: 'Sombrero Bombín',
      vincha_chakana: 'Vincha Chakana (cruz andina)',
      ninguno: 'Sin Sombrero'
    },
    accessories: {
      ninguno: 'Sin accesorio',
      awayo: 'Mochila de Aguayo (tejido andino)',
      chuspa: 'Chuspa (bolsa ceremonial)',
      tupu: 'Tupu (prendedor ceremonial) Dorado',
      quena: 'Quena (flauta andina)'
    },
    palettes: {
      tierra: 'Tierra Roja',
      verde: 'Valle Verde',
      azul: 'Lago Sagrado',
      armonia: 'Oro del Sol'
    }
  },
  profileModal: {
    title: 'Perfil del Guardián y Logros',
    closeAria: 'Cerrar perfil',
    stageCountStat: (done) => `${done}/7 etapas`,
    firstTryStat: (n) => `${n} al 1er intento`,
    medalsStat: (n, total) => `${n}/${total} medallas`,
    medalsHeading: 'Medallas y Logros (8 totales)',
    unlockedPill: 'Obtenido',
    downloadCardBtn: 'Descargar Tarjeta de Guardián',
    resetProgressBtn: 'Reiniciar partida',
    confirmResetText: '¿Borrar todo el progreso?',
    confirmResetYes: 'Sí, reiniciar',
    cancelBtn: 'Cancelar',
    cardSubtitle: 'Tarjeta Oficial del Guardián · 4.000 m s. n. m.',
    cardRankLabel: 'Rango',
    cardStatsLine: (done, firstTry, medals, totalMedals, time) =>
      `${done}/7 Etapas  ·  ${firstTry} al 1er intento  ·  ${medals}/${totalMedals} Medallas  ·  Tiempo ${time}`
  },
  storyPostcard: {
    title: 'Tu Postal para Instagram Story (9:16)',
    subtitle: 'Comparte tu paso por Peñas con un fondo real y tu propio avatar',
    closeAria: 'Cerrar postal',
    chooseBackdropLabel: 'Elige la escena real de Peñas de fondo',
    generatingPreview: 'Generando vista previa...',
    previewAlt: 'Vista previa de tu postal de Peñas para Instagram Story',
    fallbackBadge: 'PEÑAS · LA PAZ, BOLIVIA · 4.000 M',
    fallbackTitle: (name) => `¡${name} ya completó Peñas!`,
    fallbackAction: 'Descarga directa en PNG 1080×1920',
    downloadStoryBtn: 'Descargar Story (PNG)',
    generatingBtn: 'Generando...',
    nativeShareBtn: 'Compartir',
    shareNote: 'También puedes copiar la invitación directa:',
    instaTips:
      'Consejo: en Instagram elige esta imagen desde tu galería y añade el sticker «Enlace» pegando la URL del juego.',
    copiedPrefix: 'Copiado:',
    shareTitle: 'Peñas: Sendero del Guardián',
    shareText: (type) => `¡Completé Peñas: Sendero del Guardián! Mi perfil es ${type}. Ven a conocer Peñas, La Paz:`
    ,
    canvasLocationHeader: 'PEÑAS · LA PAZ, BOLIVIA · 4.000 M',
    canvasTitle: 'SENDERO DEL GUARDIÁN',
    canvasFooterCta: 'Juega gratis y aprende sobre Peñas',
    canvasRankGuardian: 'Guardián de Peñas',
    canvasRankExplorer: 'Explorador de Peñas'
  },
  achievementToast: {
    header: '¡Nuevo Logro Desbloqueado!',
    closeAria: 'Cerrar aviso de logro'
  },
  katariPhrase: {
    introStatus:
      'Toca las piedras talladas en el orden correcto para formar la última proclama de Túpac Katari:',
    builtPhraseLabel: 'Proclama armada (toca una piedra para quitarla):',
    clickToRemoveHint: 'Haz clic en las palabras de abajo para colocarlas aquí...',
    clearBtn: 'Limpiar',
    availableStonesLabel: 'Piedras talladas disponibles (hay 2 distractores):',
    verifyBtn: 'Verificar Proclama',
    selectAllFourMsg: 'Selecciona las 4 palabras en orden antes de verificar.',
    successMsg: '¡Exacto! «¡Volveré y seré millones!» resuena hasta hoy desde Peñas.',
    wrongMsg: 'Casi... recuerda la proclama inmortal del 14 de noviembre de 1781. Intenta otro orden.'
  },
  platoPaceno: {
    introStatus:
      'Mueve el plato de barro con los botones o flechas para atrapar Choclo, Papa, Habas y Queso frito (evita las piedras):',
    progressLabel: 'Progreso:',
    mistakesLabel: 'Tropiezos:',
    recipeLabel: 'Receta:',
    moveLeftBtn: 'Izquierda',
    moveRightBtn: 'Derecha',
    controlsHint: 'Usa las flechas ← / → o arrastra sobre el lienzo',
    plateLabel: 'Plato Paceño',
    neededTag: 'Falta',
    stoneLabel: 'Piedra',
    wrongIngredientFeedback: (label) => `¡Ups! Ya tenías suficiente ${label} en tu Plato Paceño.`,
    stoneHitFeedback: '¡Cuidado con las piedras! Esquívalas para proteger el plato.',
    allCollectedFeedback: '¡Plato Paceño completo! Choclo, papa, habas y queso frito listos.',
    caughtIngredientFeedback: (label) => `¡Bien atrapado! Agregaste ${label}.`,
    items: {
      choclo: 'Choclo (maíz)',
      papa: 'Papa',
      habas: 'Habas',
      queso: 'Queso frito'
    }
  },
  magicBrush: {
    introStatus:
      'Pasa el pincel (dedo o mouse) sobre todo el cuadro para limpiar el polvo y revelar el pan de oro del templo.',
    restoredLabel: 'Retablo restaurado:',
    resetBtn: 'Volver a cubrir',
    swipeHint: 'Desliza el pincel por la escena',
    doneMsg: '¡Esplendoroso! El retablo en pan de oro y la bóveda floral vuelven a brillar.',
    altAltarpiece: 'Interior del Templo Colonial de Peñas y su retablo en pan de oro'
  },
  totoraBasket: {
    introStatus: 'Paso 1: Selecciona los juncos de totora para armar la base de tu canasta de trueque.',
    stepLabel: 'Paso',
    wovenPercent: (pct) => `${pct}% tejido`,
    resetBtn: 'Reiniciar canasta',
    barterProductsHeading: 'Productos nativos del trueque',
    barterSub: 'Toca cada alimento para guardarlo en tu canasta:',
    altMuseumBasket: 'Canasta de totora y productos tradicionales en el museo de Peñas',
    basketCaption: 'Cestería tradicional en totora (junco andino) preservada en la comunidad.',
    steps: {
      base: {
        label: '1. Armar base de totora',
        button: 'Entrelazar base',
        feedback: '¡Base firme! Ahora teje las paredes laterales de la canasta.'
      },
      pared: {
        label: '2. Tejer paredes altas',
        button: 'Subir tejido lateral',
        feedback: '¡Muy bien! Ahora remata el borde trenzado para que resista el viaje.'
      },
      borde: {
        label: '3. Trenzar borde superior',
        button: 'Rematar borde',
        feedback: '¡Canasta terminada! Ahora coloca los 4 productos nativos para hacer trueque.'
      },
      carga: {
        label: '4. Cargar productos del trueque',
        button: 'Canasta lista',
        feedback: '¡Canasta repleta para el trueque! Has completado el desafío artesanal.'
      }
    },
    products: {
      chuno: { name: 'Chuño', hint: 'Papa deshidratada ancestral' },
      quinua: { name: 'Quinua', hint: 'Grano de oro del Altiplano' },
      koa: { name: 'K’oa (hierba ceremonial)', hint: 'Planta aromática ceremonial' },
      papa: { name: 'Papa nativa', hint: 'Cultivo ancestral andino' }
    }
  },
  aguayoPuzzle: {
    introStatus: 'Toca dos cuadros cualesquiera del telar para intercambiarlos hasta completar el aguayo.',
    solvedBadge: '¡Aguayo completado!',
    movesLabel: 'Movimientos:',
    resetBtn: 'Mezclar de nuevo',
    referenceHeading: 'Modelo de referencia',
    altReference: 'Modelo completo del aguayo de Peñas',
    gridAria: 'Rompecabezas del aguayo andino',
    tileAria: (pos) => `Pieza ${pos} del aguayo`,
    captionFooter: 'Reconstruye el tejido simétrico (3×3) conectando las franjas y la Chakana (cruz andina).',
    solvedMessage: (moves) => `¡Excelente trabajo! Reconstruiste el aguayo en ${moves} movimientos.`
  },
  memoryGame: {
    introStatus:
      'Toca dos piedras talladas en la cueva Kunkuntiji para revelar y emparejar los 6 símbolos sagrados.',
    pairsLabel: 'Pares encontrados:',
    attemptsLabel: 'Intentos:',
    resetBtn: 'Reiniciar piedras',
    cardBackAria: 'Piedra oculta de la cueva Kunkuntiji',
    allPairsMsg: (attempts) =>
      `¡Magnífico! Encontraste los 6 símbolos sagrados de la cueva Kunkuntiji en ${attempts} intentos.`,
    pairFoundMsg: (label) => `¡Par encontrado: ${label}!`,
    pairMismatchMsg: 'No coinciden, observa bien la ubicación de cada símbolo.',
    cards: {
      koa: { label: 'K’oa Aromática', subtitle: 'Planta ritual sagrada' },
      chakana: { label: 'Chakana', subtitle: 'Cruz andina sagrada' },
      condor: { label: 'Cóndor', subtitle: 'Guardián del cielo' },
      llama: { label: 'Llama', subtitle: 'Compañera de caravanas' },
      aguayo: { label: 'Aguayo', subtitle: 'Tejido de memoria' },
      cerro: { label: 'Cordillera', subtitle: 'Apus nevados' }
    }
  },
  rupestreSnake: {
    introStatus: 'Usa el pigmento mineral rojo o amarillo y toca los puntos en orden (1 → 9).',
    nodesLabel: 'Nodos trazados:',
    pigmentLabel: 'Pigmento:',
    mineralPrefix: 'Mineral',
    redColor: 'Rojo Ocre',
    yellowColor: 'Amarillo',
    resetBtn: 'Reiniciar trazo',
    svgAria: 'Pintura rupestre de la Serpiente de 3 Cabezas en la cueva Qillqantiji',
    nextDotAria: (n) => `Siguiente nodo ${n} para trazar`,
    dotAria: (n) => `Nodo ${n}`,
    needNextDotMsg: (n) => `Sigue la secuencia natural de la roca: toca ahora el punto ${n}.`,
    progressMsg: (done, total, next) =>
      `¡Trazo firme! Llevas ${done} de ${total} nodos minerales. Sigue con el ${next}.`,
    completedMsg: '¡Maravilloso! Restauraste la Serpiente de 3 Cabezas del estilo Yaya-Mama.',
    colorSwitchMsg: (colorName) =>
      `Pigmento mineral ${colorName} seleccionado. Sigue uniendo los puntos en orden.`
  },
  apachetaStack: {
    introStatus:
      'Presiona «Soltar piedra» justo cuando la piedra pase centrada sobre la torre para formar tu apacheta.',
    stonesLabel: 'Piedras en equilibrio:',
    resetBtn: 'Reiniciar apacheta',
    dropBtn: (name) => `Soltar ${name}`,
    completedBanner: '¡Apacheta sagrada levantada en equilibrio perfecto!',
    steadyMsg: (name, remaining) =>
      `¡Bien equilibrada la ${name}! Faltan ${remaining} piedras.`,
    toppledMsg: '¡Se resbaló la piedra! Concéntrate en el ritmo y vuelve a intentar con calma.',
    completedMsg: '¡Apacheta coronada! Tus deseos de buen camino suben hacia las cumbres.',
    stoneNames: [
      'Piedra Base Ancha',
      'Segunda Laja Firme',
      'Tercera Piedra Andina',
      'Cuarta Piedra de Cuarzo',
      'Piedra Corona del Cóndor'
    ]
  },
  calvarioCrosses: {
    introStatus:
      'Explora el cerro Calvario y las Ruinas del Carmen: toca las 4 cruces blancas escondidas entre las rocas.',
    crossesLabel: 'Cruces halladas:',
    resetBtn: 'Volver a buscar',
    svgAria: 'Sendero del Cerro Calvario y Ruinas del Carmen con cruces procesionales',
    crossSpotAria: (title) => `Descubrir ${title}`,
    alreadyFoundMsg: (title) => `${title} ya fue registrada.`,
    allFoundMsg: '¡Excelente vista! Hallaste las 4 cruces procesionales hasta las Ruinas del Carmen.',
    foundMsg: (title, desc) => `Encontraste: ${title} — ${desc}`,
    crosses: {
      cruz1: { title: 'Primera Cruz del Ascenso', desc: 'Marca el inicio del camino rocoso.' },
      cruz2: { title: 'Cruz del Recodo Rocoso', desc: 'Vigila las apachetas de los viajeros.' },
      cruz3: { title: 'Cruz de las Ruinas', desc: 'Custodia las antiguas paredes de adobe y piedra.' },
      cruz4: { title: 'Cruz de la Cumbre', desc: 'Mira hacia el Altiplano y los nevados.' }
    }
  },
  climbingGame: {
    introStatus:
      'Observa las grietas, hielo y ráfagas en la roca. Toca un agarre accesible para escalar.',
    altitudeLabel: 'Altura:',
    gripLabel: 'Agarre:',
    leaveNoTraceLabel: 'Sin huella:',
    slipsLabel: 'Resbalones:',
    resetBtn: 'Reiniciar pared',
    windLabel: 'Viento en canaletas:',
    windDanger: 'Ráfaga activa (peligro)',
    windCalm: 'En calma (seguro)',
    chalkActiveBtn: 'Magnesio activo (listo para hielo/techo)',
    chalkApplyBtn: (charges) => `Aplicar Magnesio (${charges} restantes)`,
    restBtn: 'Respirar en repisa (+30% agarre)',
    directHoldLabel: 'O elige agarre directo:',
    tagWindActive: '¡Ráfaga activa!',
    tagWindCalm: 'En calma · Subir',
    tagIceReady: 'Hielo (Listo c/ magnesio)',
    tagIceSlip: 'Hielo resbaloso',
    tagLoose: 'Roca suelta',
    tagOverhang: 'Extraplomo (-28% fuerza)',
    tagEco: 'Limpiar residuo (+16%)',
    looseFallMsg: (name) =>
      `¡La ${name.toLowerCase()} cedió bajo tu peso! La cuerda te detuvo un nivel abajo.`,
    windBlockedMsg: (name) =>
      `¡Ráfaga y piedras cayendo en ${name}! Espera la ventana de CALMA o toma otra vía.`,
    iceSlipMsg: (name) =>
      `¡Resbalaste en la ${name.toLowerCase()}! Pulsa «Aplicar Magnesio» antes o rodéala por la fisura.`,
    overhangTiredMsg:
      'No tienes suficiente agarre para este extraplomo. Pulsa «Respirar en Repisa» o «Magnesio».',
    ecoPickedMsg: (name) =>
      `¡Escalada sin huella! Recogiste el residuo en «${name}» (+16% energía).`,
    anchoredMsg: (name) => `Aseguraste el mosquetón en «${name}». ¡Lee la roca arriba y sigue!`,
    summitWonMsg: '¡Cumbre del Cóndor alcanzada con técnica, respeto y cero huella!',
    chalkAppliedMsg: 'Magnesio aplicado: agarre firme para placas con escarcha o extraplomos.',
    restedMsg: 'Respiraste profundo a 4.100 m y recuperaste tu agarre en la repisa.',
    holds: {
      '0-1': { name: 'Base de las Peñas', clue: 'Punto de partida con cuerda asegurada.' },
      '1-0': { name: 'Fisura granítica', clue: 'Grieta seca y firme en granito sólido.' },
      '1-1': { name: 'Laja agrietada', clue: 'Roca fracturada que suelta gravilla; ¡puede ceder!' },
      '1-2': { name: 'Repisa con residuo', clue: 'Agarre firme con una botella plástica para recoger.' },
      '2-0': { name: 'Canaleta de viento', clue: 'Caen piedrillas cada pocos segundos. ¡Sube solo en calma!' },
      '2-1': { name: 'Arista soleada', clue: 'Roca firme bañada por el sol del Altiplano.' },
      '2-2': { name: 'Bloque suelto', clue: 'Piedra inestable y quebradiza.' },
      '3-0': { name: 'Techo extraplomado', clue: 'Exige fuerza (-28% agarre) o usar magnesio.' },
      '3-1': { name: 'Placa con escarcha', clue: 'Hielo andino resbaladizo: aplica Magnesio o rodéalo.' },
      '3-2': { name: 'Diedro protegido', clue: 'Esquina de granito limpio al resguardo del viento.' },
      '4-0': { name: 'Grieta con envoltura', clue: 'Repisa segura con residuo olvidado para limpiar.' },
      '4-1': { name: 'Chimenea ventosa', clue: 'Ráfagas intermitentes de altura: espera la calma.' },
      '4-2': { name: 'Cornisa helada', clue: 'Capa de escarcha fría: requiere Magnesio para adherir.' },
      '5-0': { name: 'Roca erosionada', clue: 'Arenisca floja que desprende polvo al tacto.' },
      '5-1': { name: 'Paso del Cóndor', clue: 'Extraplomo clave (-25% agarre) directo a la cima.' },
      '5-2': { name: 'Cresta firme norte', clue: 'Buen canto de granito rumbo a la cumbre.' },
      '6-1': { name: 'Cumbre del Cóndor', clue: '¡Cima sagrada a 4.150 m frente a la Cordillera Real!' }
    }
  },
  mirador3d: {
    topTitle: 'Mirador Nido de Cóndor (Wiraconi) · Atardecer',
    topSubtitle: 'Arrastra para explorar · Toca un nevado o el Cartel Wiraconi para enfocarlo',
    centerTitle: 'Centrar vista inicial',
    centerBtn: 'Centrar',
    backTo3dBtn: 'Volver al 3D',
    realPhotosBtn: 'Fotos Reales',
    webglLostMsg: 'La vista 3D está restaurando su contexto gráfico.',
    viewPhotosBtn: 'Ver Fotos Reales del Mirador',
    photosTitle: 'Fotografías Reales del Mirador Wiraconi / Nido de Cóndor',
    photosSubtitle: 'Observa la imponente cadena nevada al fondo del Altiplano.',
    inFlightTag: 'En vuelo',
    playerLocationPrefix: (name, title) => `${name} en ${title}`,
    presets: {
      mirador: {
        label: 'Mirador 360°',
        infoTitle: 'Atardecer en Mirador Wiraconi (Nido de Cóndor)',
        infoText:
          'Arrastra con el mouse o dedo para recorrer el horizonte rocoso. Toca cualquiera de los 3 nevados de la Cordillera Real o el Cartel Wiraconi para acercarte.'
      },
      cordillera: {
        label: 'Cordillera Real',
        infoTitle: 'Cordillera Real al Atardecer',
        infoText:
          'Cadena glaciar iluminada por el arrebol andino, coronada por tres gigantes: Illampu, Huayna Potosí e Illimani.'
      },
      illampu: {
        label: 'Illampu (6.485 m)',
        infoTitle: 'Nevado Illampu · 6.485 m s. n. m.',
        infoText:
          'Uno de los macizos más imponentes y altos de la Cordillera Real, visible hacia el norte desde las peñas de granito.'
      },
      huayna: {
        label: 'Huayna Potosí (6.088 m)',
        infoTitle: 'Nevado Huayna Potosí · 6.088 m s. n. m.',
        infoText:
          'Icónica pirámide glaciar de nieve eterna frente al Altiplano paceño, símbolo del andinismo boliviano.'
      },
      illimani: {
        label: 'Illimani (6.439 m)',
        infoTitle: 'Nevado Illimani · 6.439 m s. n. m.',
        infoText:
          'El guardián tutelar de La Paz, reconocible por sus tres cumbres nevadas teñidas de dorado y rosa al caer la tarde.'
      },
      pueblo: {
        label: 'Pueblo de Peñas',
        infoTitle: 'Pueblo de Peñas y Valle del Altiplano',
        infoText:
          'Al pie de los farallones rocosos descansan la plaza, el templo colonial y la recta ruta del Altiplano.'
      },
      cartel: {
        label: 'Cartel Wiraconi',
        infoTitle: 'Cartel Mirador Wiraconi',
        infoText:
          'Placa de madera tallada sobre roca con líquenes amarillos y verdes que marca la cumbre panorámica del mirador.'
      },
      condor: {
        label: 'Cóndor Andino',
        infoTitle: 'Vuelo del Cóndor al Ocaso',
        infoText:
          'Planea aprovechando las últimas corrientes térmicas sobre las quebradas rocosas de Peñas.'
      }
    },
    landmarks: {
      illampu: { label: 'Illampu', elevation: '6.485 m' },
      huayna: { label: 'Huayna Potosí', elevation: '6.088 m' },
      illimani: { label: 'Illimani', elevation: '6.439 m' },
      pueblo: { label: 'Pueblo de Peñas', elevation: '4.000 m' },
      cartel: { label: 'Cartel Wiraconi', elevation: 'Placa' }
    },
    photoCaptions: [
      'Cartel original del Mirador Wiraconi sobre roca con líquenes',
      'Vista hacia el pueblo de Peñas, la carretera del Altiplano y los nevados',
      'Farallón granítico a la izquierda y la Cordillera Real en el horizonte',
      'Panorámica completa desde el borde rocoso del Mirador Nido de Cóndor'
    ]
  },
  plazaVideo: {
    speakerPrefix: (badge) => `Tata · ${badge}`,
    voiceMuteTitle: 'Silenciar narración',
    voiceEnableTitle: 'Activar narración',
    voiceOnLabel: 'Narración',
    voiceOffLabel: 'Sin voz',
    pauseAria: 'Pausar video',
    playAria: 'Reproducir video',
    timelineAria: 'Línea de tiempo del video educativo',
    restartAria: 'Reiniciar video',
    tataLabel: 'Tata narrando',
    avatarLabel: (name) => `Avatar de ${name}`,
    slides: [
      {
        id: 'plaza',
        shortLabel: '1. La Plaza',
        title: 'Plaza Principal de Peñas · 3.970 m s. n. m.',
        narration:
          '¡Bienvenido a la Plaza Principal de Peñas, a 3.970 metros sobre el nivel del mar! Este apacible espacio fue epicentro de uno de los acontecimientos más importantes de la historia andina.',
        avatarBadge: 'Tata y Tú en la Plaza',
        highlightTag: '3.970 m s. n. m.'
      },
      {
        id: 'rebelion',
        shortLabel: '2. 1781 y Plato Paceño',
        title: '1781 · Túpac Katari, Bartolina Sisa y el Plato Paceño',
        narration:
          'En 1781, Julián Apaza, Túpac Katari, y su esposa Bartolina Sisa encabezaron la gran rebelión indígena y sitiaron La Paz. La escasez unió choclo, papa, habas y queso frito, dando origen al Plato Paceño.',
        avatarBadge: 'Katari y Bartolina Sisa',
        highlightTag: 'Choclo · Papa · Habas · Queso frito'
      },
      {
        id: 'casona',
        shortLabel: '3. La Casona',
        title: 'La Casona Histórica · 14 de noviembre de 1781',
        narration:
          'Tras ser traicionado, Katari fue juzgado en la casona de la plaza, que luego hospedó al presidente Andrés de Santa Cruz, y ejecutado por cuatro caballos proclamando: Volveré y seré millones.',
        avatarBadge: 'Memoria de 1781',
        highlightTag: '«Volveré y seré millones»'
      },
      {
        id: 'radio',
        shortLabel: '4. Radio San Gabriel',
        title: 'Radio San Gabriel · Pionera en lengua aymara',
        narration:
          'Y en esta misma plaza nació Radio San Gabriel, emisora pionera en la radiodifusión en lengua aymara.',
        avatarBadge: 'Voz viva del Altiplano',
        highlightTag: 'Idioma Aymara'
      }
    ]
  },
  interactiveVideo: {
    iframeTitle: (stageTitle) => `Video de ${stageTitle}`,
    linkedCaption: 'Video personalizado vinculado a esta etapa',
    readyLabel: 'Listo para responder',
    fallbackCaption: 'Explora los puntos interactivos de esta escena.',
    exploredPointsLabel: 'Puntos explorados:',
    closeBtn: 'Cerrar',
    pauseAria: 'Pausar video',
    playAria: 'Reproducir video',
    timelineAria: 'Línea de tiempo del video',
    restartAria: 'Reiniciar video'
  },
  pizzaGame: {
    introFeedback:
      'Sigue el orden de la receta de la cafetería de Peñas (del 1 al 5) para armar tu pizza artesanal.',
    ovenReadyFeedback:
      '¡Lista para el horno de barro! Presiona "Sacar del Horno" dentro de la zona dorada (35–65).',
    stepAddedFeedback: (label) => `¡Perfecto! Agregaste ${label}.`,
    wrongOrderFeedback: (expectedLabel) => `Ese paso va después. Primero toca: ${expectedLabel}.`,
    bakedDoneFeedback:
      '¡Pizza artesanal dorada a la perfección! Tu vale en la cafetería de Peñas te espera.',
    ovenRetryFeedback:
      'Casi: espera a que el indicador pase por el centro dorado (35–65) y vuelve a presionar.',
    svgAria: 'Pizza artesanal de Peñas',
    ingredientsLabel: 'Ingredientes:',
    ovenTitle: 'Horno de Barro de Peñas',
    pullOutBtn: '¡Sacar del Horno en Punto Dorado!',
    doneTitle: '¡Pizza del Guardián Horneada!',
    doneDesc: 'Has dominado el orden artesanal y el calor justo del horno de Peñas.',
    bakeAgainBtn: 'Volver a hornear',
    ingredients: {
      masa: '1. Masa Madre de Altura',
      salsa: '2. Salsa con Huacatay',
      queso: '3. Queso Fresco Andino',
      tomate: '4. Tomates y Aceitunas',
      quinua: '5. Quinua Crocante (grano andino)'
    }
  }
};

const UI_EN: UiDictionary = {
  app: {
    loadingView: 'Loading Peñas view...',
    loadingStage: 'Loading Peñas stage...'
  },
  errorBoundary: {
    title: 'Something went wrong on this screen',
    description: 'You can try again without losing your saved progress in Peñas.',
    retryButton: 'Try Again'
  },
  routeMap: {
    ariaLabel: 'Route map from La Paz and El Alto to Peñas'
  },
  titleScreen: {
    tataHomeIntro:
      'Hello, traveler! You are about to discover Peñas, a historic village 60 km from La Paz at 4,000 m altitude. To play, advance through all 7 map stops overcoming their challenges to gather the relics and become a Guardian of the memory of Peñas—plus a surprise prize awaits you at the end! Customize your avatar below and begin the adventure.',
    headline: 'Welcome to Peñas, a historic village you must discover',
    altBackdrop: 'Colorful Main Plaza of Peñas with its Colonial Church and Andean peaks',
    altPortrait: 'Tata, wise guide of Peñas',
    newGameTitle: 'Start fresh (keeps your avatar)',
    customAvatarBannerPrefix: 'Custom avatar:',
    nameLabel: 'Your name',
    namePlaceholder: 'Your name',
    editAvatarButton: 'Edit Avatar',
    resetToDefaultLabel: 'Use default appearance',
    defaultTravelerName: 'Traveler'
  },
  narratorDock: {
    defaultTagline: 'Story from Peñas, La Paz',
    altTata: 'Tata narrator',
    altMiniTata: 'Tata',
    muteVoice: 'Mute Tata’s voice',
    listenVoice: 'Hear Tata’s voice',
    stopNarration: 'Stop narration',
    repeatNarration: 'Replay Tata’s narration',
    muteLabel: 'Mute',
    voiceLabel: 'Voice',
    stopLabel: 'Stop',
    listenLabel: 'Listen'
  },
  audioControl: {
    volumeDown: 'Decrease volume',
    volumeUp: 'Increase volume',
    muteAudio: 'Mute audio',
    enableAudio: 'Enable Andean sound',
    audioMutedShort: 'Audio OFF',
    musicShort: 'Music',
    openMixerTitle: 'Open Andean sound mixer',
    mixerAria: 'Music and ambient sound controls',
    mixerTitle: 'Andean Sound of Peñas',
    ambientLabel: 'Natural Ambience',
    ambientSub: 'Highland wind, church bell & canyon echo',
    ambientToggleMute: 'Mute ambience',
    ambientTogglePlay: 'Enable ambience',
    volumeLabel: 'Volume',
    melodyLabel: 'Traditional Melody',
    melodySub: 'Soft Andean panpipe & quena flute',
    melodyToggleOff: 'Turn off melody',
    melodyToggleOn: 'Turn on melody',
    ambientSceneTitles: {
      plaza: 'Plaza & Highland Breeze',
      templo: 'Churchyard & Peñas Bells',
      camino: 'Wind on the Pre-Hispanic Trail',
      kunkuntiji: 'Echo inside Kunkuntiji Cave',
      qillqantiji: 'Qillqantiji Rock Shelter',
      calvario: 'Heights of Cerro Calvario',
      mirador: 'Condor’s Flight · 4,300 m'
    },
    trackTitles: {
      plaza: 'Plaza Melody (Pentatonic)',
      sendero: 'High-Trail Quena Flute',
      mirador: 'Cordillera Panpipe'
    }
  },
  epicMap: {
    progressSummary: (completed, total) => `${completed} of ${total} stages completed`,
    profileMedalsButton: 'Profile & Medals',
    avatarButton: 'Avatar',
    returnTitleAria: 'Return to welcome screen',
    returnTitleShort: 'Home',
    timeTooltip: 'Elapsed time since the start of your journey',
    relicsCounter: (completed, total) => `${completed}/${total} Relics`,
    openVictoryDesktop: 'Open Final Reward',
    openVictoryMobile: 'Final Reward',
    altMapBg: 'Map of Peñas and its 7 stages',
    stagePrefix: 'Stage',
    completedBadge: 'Completed',
    stageCompletedTitle: (id, title) => `Stage ${id} completed: ${title}`,
    stageAvailableTitle: (id, title) => `Play Stage ${id}: ${title}`,
    stageLockedTitle: (id, title) => `Stage ${id}: ${title} (Complete the previous one first)`,
    stageShortWord: 'Stage',
    completedLabel: 'Completed',
    playLabel: 'Play',
    lockedLabel: 'Locked',
    clickToPlayHint: 'Click to start stage',
    completePreviousHint: (id) => `Complete Stage ${id - 1} first`,
    completedModalTooltip: 'This stage is already completed (you can revisit it)',
    relicTag: 'Relic',
    guardianCelebrationTooltip: 'Guardian’s Celebration!',
    openRewardButton: 'Open Reward',
    guardianMedalTitle: 'Guardian Medal',
    guardianSubtitle: 'Unlocks at 7/7 completed',
    yourProgressTitle: 'Your Progress',
    relicsLabel: 'Relics',
    unlockedCount: (n) => `${n} unlocked`,
    achievementsLabel: 'Achievements',
    ofEight: 'of 8',
    viewAllMedalsButton: 'View all medals & achievements',
    relicsShowcaseTitle: 'Unlocked Relics',
    relicShowcasePrefix: (id) => `S${id}`,
    relicObtained: 'Relic obtained',
    relicLocked: 'Still locked',
    allRelicsCompletedHint: 'You finished all 7 stages! Open your final reward for your guide and prize.',
    nextGoalHint: (id, title) => `Next stop on the map: Stage ${id} (${title}).`
  },
  stageModal: {
    stageBadge: (id, elevation) => `Stage ${id} of 7 · ${elevation}`,
    closeModalAria: 'Close stage',
    backToCardsButton: '← Back to fact cards',
    triviaBadge: 'Stage Trivia',
    triviaInstruction: 'Answer the trivia correctly to unlock this level’s challenge:',
    triviaWrongMessage: 'Incorrect answer. Check the historical facts and try again.',
    triviaSuccessMessage: 'Correct! You unlocked this level’s challenge.',
    triviaContinueButton: 'Continue to challenge',
    stepOfTwo: 'Step 1 of 2 · Stage challenge',
    challengeSolvedMsg: 'Challenge complete! Now answer this personal question to shape your traveler profile.',
    stepTwoBadge: 'Step 2 of 2 · Discover your profile',
    changeChallengeButton: '← Switch challenge',
    minigameCompleteFallback: 'Complete the interactive challenge to unlock your relic.',
    riddleInputLabel: 'Your answer:',
    riddlePlaceholder: 'Type the name of the sacred herb here...',
    riddleVerifyButton: 'Verify Answer',
    riddleSuccessMsg: 'Correct! Aromatic k’oa kindles gratitude toward Pachamama (Mother Earth).',
    riddleWrongMsg: (hintText) => `Not quite that word yet. ${hintText}`,
    quizSuccessMsg: 'Correct answer!',
    quizWrongMsg: 'Incorrect answer. Review the educational facts and try again.',
    traitSavedMsg: 'Your choice has been saved to your traveler profile.',
    relicSecuredBadge: 'Relic secured'
  },
  stageIntro: {
    cardPrefix: 'Card',
    cardOpenedBadge: 'Read',
    tapToRead: 'Tap to open',
    galleryHeading: 'Photos of Peñas at this stage',
    factsProgress: (opened, total) => `${opened} of ${total} cards read`,
    readAllToUnlock: 'Read all 3 cards to unlock Next',
    nextButton: 'Next'
  },
  challengeSelector: {
    badge: 'Available challenges',
    title: 'Choose a challenge to complete this stage',
    challengeIndex: (n) => `Challenge ${n}`,
    playChallengeButton: 'Play this challenge'
  },
  victoryScreen: {
    closingTataMessage:
      'Congratulations and thank you for safeguarding our village’s memory—we await you in Peñas to celebrate!',
    backToMapAria: 'Back to Peñas map',
    backToMapLabel: 'Map',
    shareAndMedalsAria: 'Share achievements or edit avatar',
    profileMedalsBtn: 'Medals',
    editAvatarBtn: 'Avatar',
    kickerText: 'Guardian of Peñas · Cerro Calvario & Cordillera Real',
    heroNameTitle: (name) => `${name}, you completed the journey`,
    heroAlt: 'Peñas sunset closing view facing the Cordillera Real',
    statsLabel: 'Your journey',
    firstTryStat: (n) => `${n}/7 on 1st try`,
    relicsLabel: 'Relics',
    timeLabel: 'Time',
    step1Badge: 'Step 1 · Discover Your Traveler Spirit',
    step1Title: 'Your profile awaits at the end of the trail',
    step1Desc:
      'You answered from the heart at each of the 7 stages. Press the golden button to reveal your traveler type, celebrate with your avatar, and unlock your Peñas Guide and surprise prize.',
    revealSubtext: 'Reveal your profile and unlock your personalized guide',
    revealCardBadge: 'Your Spirit Revealed',
    revealCardTag: 'Guardian of Peñas',
    revealStatsHeading: 'Journey Summary',
    revealRelics: '7 / 7 relics',
    revealFirstTry: (n) => `${n} / 7 flawless`,
    revealTime: 'Time',
    revealMedals: (n) => `${n} / 8 medals`,
    celebrateHeading: 'Celebrate with your avatar!',
    celebrateSub: 'Tap a pose to celebrate in Peñas',
    celebrationOptions: {
      salto: 'Celebrate!',
      aguayo: 'Aguayo (woven textile)',
      chakana: 'Chakana (Andean cross)'
    },
    shareHeading: 'Share your adventure on Instagram & with friends',
    shareDesc:
      'Download a vertical postcard (9:16) with a real Peñas photo, your avatar, and your traveler profile, or copy the game link.',
    createPostcardBtn: 'Create Story Postcard',
    shareLinkBtn: 'Copy game link',
    linkCopiedBtn: 'Link copied!',
    linkCopiedHint: 'Link copied to clipboard. Share it on social media or WhatsApp!',
    step3Badge: 'Step 3 · Surprise Gift from the Peñas Community',
    step3Title: 'Your Surprise Prize for Completing the Trail',
    voucherLabel: 'Verification code',
    guideTitlePrefix: 'Personalized guide',
    trophyAlt: 'Peñas surprise prize trophy',
    penasClosingAlt: 'Historic village and landscape of Peñas, La Paz',
    tataClosingSpeaker: 'Tata · Guardian of Peñas',
    downloadCompleteGuideBtn: 'Download Complete Peñas Guide',
    traitLabels: {
      cultural: 'Cultural',
      aventurero: 'Adventurer',
      naturaleza: 'Nature',
      comunitario: 'Community'
    },
    traitDescriptions: {
      cultural: 'History, rock art, gilded altarpieces, and Aymara memory.',
      aventurero: 'Rock climbing, caves, mountain ridges, and high-altitude routes.',
      naturaleza: 'Condors, Cordillera Real, yareta, and crisp air at 4,000 m.',
      comunitario: 'Local flavors, barter, host families, and artisan crafts.'
    },
    traitShowcase: {
      cultural: {
        badge: 'Culture & Memory',
        alt: 'Peñas Main Plaza and Túpac Katari history',
        caption: 'Túpac Katari Plaza, gold-leaf altarpiece, and painted caves.'
      },
      aventurero: {
        badge: 'Highland Adventure',
        alt: 'Climbing park and viewpoint on the crags of Peñas',
        caption: 'Granite climbing at 4,150 m facing the Cordillera Real.'
      },
      naturaleza: {
        badge: 'Living Pachamama',
        alt: 'Pachamama mural and native flora in Peñas',
        caption: 'Altiplano vistas, native highland flora, and soaring condors.'
      },
      comunitario: {
        badge: 'People & Flavors',
        alt: 'Virgen de la Natividad Café and village murals in Peñas',
        caption: 'Traditional barter, Plato Paceño, and warm Peñas hospitality.'
      }
    }
  },
  avatarCreator: {
    title: 'Customize Your Peñas Traveler',
    subtitle: 'Preview your full-body character and give them a unique Andean style',
    closeAria: 'Close avatar customizer',
    nameLabel: 'Your traveler name',
    namePlaceholder: 'E.g. Amaru or Nayra',
    randomBtn: 'Randomize',
    previewLabel: 'Full-body preview',
    poseLabel: 'Pose:',
    poseIdle: 'Standing',
    poseWalk: 'Walking',
    poseCheer: 'Cheering',
    paletteLabel: 'Outfit color palette',
    tabs: {
      rostro: 'Face & Hair',
      vestimenta: 'Andean Attire',
      accesorios: 'Hat & Extras'
    },
    skinToneLabel: 'Skin tone',
    hairColorLabel: 'Hair color',
    hairStyleLabel: 'Hairstyle',
    outfitLabel: 'Traditional or traveler attire',
    headwearLabel: 'Headwear',
    accessoryLabel: 'Companion item',
    cancelBtn: 'Cancel',
    saveBtn: 'Save Avatar',
    defaultName: 'Traveler',
    skinTones: {
      clear: 'Light Andean',
      warm: 'Sun Warm',
      bronze: 'Altiplano Bronze',
      earth: 'Deep Earth'
    },
    hairColors: {
      black: 'Midnight Black',
      brown: 'Earth Brown',
      silver: 'Wise Silver',
      copper: 'Andean Copper'
    },
    hairStyles: {
      corto: 'Classic Short',
      cabello_suelto: 'Flowing Hair',
      trenzas_tullmas: 'Braids with Tullmas (tassels)',
      trenzas_dobles: 'Double Braids'
    },
    outfits: {
      poncho_tejido: 'Woven Poncho',
      pollera_manta: 'Pollera & Manta Shawl',
      chaleco_aguayo: 'Aguayo Vest',
      capa_guardian: 'Guardian Cloak'
    },
    headwears: {
      chullo: 'Knit Chullo (Andean hat)',
      sombrero_bombin: 'Bowler Hat (Bombín)',
      vincha_chakana: 'Chakana Headband',
      ninguno: 'No Hat'
    },
    accessories: {
      ninguno: 'No accessory',
      awayo: 'Aguayo Backpack',
      chuspa: 'Chuspa (ceremonial pouch)',
      tupu: 'Golden Tupu (ceremonial pin)',
      quena: 'Quena (Andean flute)'
    },
    palettes: {
      tierra: 'Red Earth',
      verde: 'Green Valley',
      azul: 'Sacred Lake',
      armonia: 'Sun Gold'
    }
  },
  profileModal: {
    title: 'Guardian Profile & Medals',
    closeAria: 'Close profile',
    stageCountStat: (done) => `${done}/7 stages`,
    firstTryStat: (n) => `${n} on 1st try`,
    medalsStat: (n, total) => `${n}/${total} medals`,
    medalsHeading: 'Medals & Achievements (8 total)',
    unlockedPill: 'Unlocked',
    downloadCardBtn: 'Download Guardian Card',
    resetProgressBtn: 'Reset game',
    confirmResetText: 'Erase all progress?',
    confirmResetYes: 'Yes, reset',
    cancelBtn: 'Cancel',
    cardSubtitle: 'Official Guardian Card · 4,000 m a.s.l.',
    cardRankLabel: 'Rank',
    cardStatsLine: (done, firstTry, medals, totalMedals, time) =>
      `${done}/7 Stages  ·  ${firstTry} 1st try  ·  ${medals}/${totalMedals} Medals  ·  Time ${time}`
  },
  storyPostcard: {
    title: 'Your Instagram Story Postcard (9:16)',
    subtitle: 'Share your journey through Peñas with a real landscape and your avatar',
    closeAria: 'Close postcard',
    chooseBackdropLabel: 'Choose a real Peñas backdrop',
    generatingPreview: 'Generating preview...',
    previewAlt: 'Preview of your Peñas postcard for Instagram Story',
    fallbackBadge: 'PEÑAS · LA PAZ, BOLIVIA · 4,000 M',
    fallbackTitle: (name) => `${name} completed Peñas!`,
    fallbackAction: 'Direct 1080×1920 PNG download',
    downloadStoryBtn: 'Download Story (PNG)',
    generatingBtn: 'Generating...',
    nativeShareBtn: 'Share',
    shareNote: 'You can also copy the direct invite link:',
    instaTips:
      'Tip: in Instagram choose this image from your camera roll and add a "Link" sticker with the game URL.',
    copiedPrefix: 'Copied:',
    shareTitle: 'Peñas: Path of the Guardian',
    shareText: (type) => `I completed Peñas: Path of the Guardian! My profile is ${type}. Come discover Peñas, La Paz:`,
    canvasLocationHeader: 'PEÑAS · LA PAZ, BOLIVIA · 4,000 M',
    canvasTitle: 'PATH OF THE GUARDIAN',
    canvasFooterCta: 'Play free & learn about Peñas',
    canvasRankGuardian: 'Guardian of Peñas',
    canvasRankExplorer: 'Explorer of Peñas'
  },
  achievementToast: {
    header: 'New Achievement Unlocked!',
    closeAria: 'Close achievement notification'
  },
  katariPhrase: {
    introStatus:
      'Tap the carved stones in the exact Spanish order of Túpac Katari’s final proclamation ("I will return and I will be millions!"):',
    translationHint: 'Meaning: «Volveré» = I will return · «y» = and · «seré» = I will be · «millones» = millions',
    builtPhraseLabel: 'Assembled proclamation (tap a stone to remove it):',
    clickToRemoveHint: 'Tap the stones below to place them here in order...',
    clearBtn: 'Clear',
    availableStonesLabel: 'Carved stones available (2 are decoys):',
    verifyBtn: 'Verify Proclamation',
    selectAllFourMsg: 'Select all 4 words in order before checking.',
    successMsg: 'Exact! "Volveré y seré millones" ("I will return and be millions") echoes from Peñas to this day.',
    wrongMsg: 'Almost... recall the immortal proclamation of November 14, 1781. Try another order.'
  },
  platoPaceno: {
    introStatus:
      'Move the clay plate with the buttons or arrow keys to catch Corn, Potato, Fava Beans & Fried Cheese (avoid rocks):',
    progressLabel: 'Progress:',
    mistakesLabel: 'Slips:',
    recipeLabel: 'Recipe:',
    moveLeftBtn: 'Left',
    moveRightBtn: 'Right',
    controlsHint: 'Use ← / → arrow keys or drag across the canvas',
    plateLabel: 'Plato Paceño',
    neededTag: 'Needed',
    stoneLabel: 'Rock',
    wrongIngredientFeedback: (label) => `Oops! You already have enough ${label} on your Plato Paceño.`,
    stoneHitFeedback: 'Watch out for rocks! Dodge them to protect your plate.',
    allCollectedFeedback: 'Plato Paceño complete! Corn, potato, fava beans, and fried cheese are ready.',
    caughtIngredientFeedback: (label) => `Great catch! Added ${label}.`,
    items: {
      choclo: 'Andean Corn',
      papa: 'Potato',
      habas: 'Fava Beans',
      queso: 'Fried Cheese'
    }
  },
  magicBrush: {
    introStatus:
      'Sweep the brush (finger or mouse) across the frame to dust off the centuries and reveal the gold-leaf altarpiece.',
    restoredLabel: 'Altarpiece restored:',
    resetBtn: 'Cover again',
    swipeHint: 'Swipe the brush across the scene',
    doneMsg: 'Magnificent! The gold-leaf altarpiece and painted floral vault shine once more.',
    altAltarpiece: 'Interior of the Colonial Church of Peñas and its gold-leaf altarpiece'
  },
  totoraBasket: {
    introStatus: 'Step 1: Weave totora reeds to build the sturdy base of your barter basket.',
    stepLabel: 'Step',
    wovenPercent: (pct) => `${pct}% woven`,
    resetBtn: 'Reset basket',
    barterProductsHeading: 'Native barter goods',
    barterSub: 'Tap each item to pack it inside your basket:',
    altMuseumBasket: 'Totora reed basket and traditional goods in the Peñas museum',
    basketCaption: 'Traditional totora (Andean reed) basketry preserved by the community.',
    steps: {
      base: {
        label: '1. Form totora base',
        button: 'Weave base',
        feedback: 'Solid base! Now weave the side walls of the basket.'
      },
      pared: {
        label: '2. Weave tall sides',
        button: 'Raise side walls',
        feedback: 'Great job! Now braid the top rim so it holds on the mountain trail.'
      },
      borde: {
        label: '3. Braid top rim',
        button: 'Finish rim',
        feedback: 'Basket woven! Now pack the 4 native goods for barter.'
      },
      carga: {
        label: '4. Pack barter goods',
        button: 'Basket ready',
        feedback: 'Basket packed for barter! You completed the artisan challenge.'
      }
    },
    products: {
      chuno: { name: 'Chuño', hint: 'Ancestral freeze-dried potato' },
      quinua: { name: 'Quinoa', hint: 'Golden grain of the Altiplano' },
      koa: { name: 'K’oa (ceremonial herb)', hint: 'Aromatic ceremonial herb' },
      papa: { name: 'Native potato', hint: 'Ancestral Andean crop' }
    }
  },
  aguayoPuzzle: {
    introStatus: 'Tap any two loom tiles to swap them until the ceremonial aguayo is complete.',
    solvedBadge: 'Aguayo completed!',
    movesLabel: 'Moves:',
    resetBtn: 'Shuffle again',
    referenceHeading: 'Reference pattern',
    altReference: 'Completed pattern of the Peñas aguayo',
    gridAria: 'Andean aguayo weaving puzzle',
    tileAria: (pos) => `Aguayo tile ${pos}`,
    captionFooter: 'Rebuild the symmetrical 3×3 weave connecting the stripes and the Chakana.',
    solvedMessage: (moves) => `Wonderful work! You restored the aguayo in ${moves} moves.`
  },
  memoryGame: {
    introStatus:
      'Tap two carved stones in Kunkuntiji Cave to uncover and match all 6 sacred symbols.',
    pairsLabel: 'Pairs found:',
    attemptsLabel: 'Attempts:',
    resetBtn: 'Reset stones',
    cardBackAria: 'Hidden stone in Kunkuntiji Cave',
    allPairsMsg: (attempts) =>
      `Magnificent! You matched all 6 sacred symbols of Kunkuntiji Cave in ${attempts} attempts.`,
    pairFoundMsg: (label) => `Pair matched: ${label}!`,
    pairMismatchMsg: 'Not a match yet—remember where each symbol rests.',
    cards: {
      koa: { label: 'Aromatic K’oa', subtitle: 'Sacred ritual herb' },
      chakana: { label: 'Chakana', subtitle: 'Sacred Andean cross' },
      condor: { label: 'Condor', subtitle: 'Guardian of the sky' },
      llama: { label: 'Llama', subtitle: 'Caravan companion' },
      aguayo: { label: 'Aguayo', subtitle: 'Woven memory' },
      cerro: { label: 'Cordillera', subtitle: 'Snow-capped Apus' }
    }
  },
  rupestreSnake: {
    introStatus: 'Pick red or yellow mineral pigment and tap the dots in order (1 → 9).',
    nodesLabel: 'Nodes traced:',
    pigmentLabel: 'Pigment:',
    mineralPrefix: 'Mineral',
    redColor: 'Red Ochre',
    yellowColor: 'Yellow',
    resetBtn: 'Restart trace',
    svgAria: 'Rock painting of the Three-Headed Serpent in Qillqantiji Cave',
    nextDotAria: (n) => `Next node ${n} to trace`,
    dotAria: (n) => `Node ${n}`,
    needNextDotMsg: (n) => `Follow the sequence on the stone: tap point ${n} next.`,
    progressMsg: (done, total, next) =>
      `Steady hand! ${done} of ${total} mineral nodes traced. Next up: point ${next}.`,
    completedMsg: 'Wonderful! You restored the Yaya-Mama Three-Headed Serpent.',
    colorSwitchMsg: (colorName) =>
      `${colorName} mineral pigment selected. Keep connecting the dots in order.`
  },
  apachetaStack: {
    introStatus:
      'Press "Drop stone" right when the stone passes centered above the tower to balance your apacheta.',
    stonesLabel: 'Balanced stones:',
    resetBtn: 'Reset apacheta',
    dropBtn: (name) => `Drop ${name}`,
    completedBanner: 'Sacred apacheta stacked in perfect balance!',
    steadyMsg: (name, remaining) =>
      `${name} balanced cleanly! ${remaining} stone(s) remaining.`,
    toppledMsg: 'The stone slipped! Watch the rhythm carefully and try again calmly.',
    completedMsg: 'Apacheta crowned! Your wishes for a safe journey rise toward the peaks.',
    stoneNames: [
      'Broad Base Stone',
      'Second Steady Slab',
      'Third Andean Stone',
      'Fourth Quartz Stone',
      'Condor Crown Stone'
    ]
  },
  calvarioCrosses: {
    introStatus:
      'Search Cerro Calvario and the El Carmen Ruins: tap all 4 white crosses hidden among the rocks.',
    crossesLabel: 'Crosses found:',
    resetBtn: 'Search again',
    svgAria: 'Cerro Calvario and El Carmen Ruins trail with processional crosses',
    crossSpotAria: (title) => `Uncover ${title}`,
    alreadyFoundMsg: (title) => `${title} has already been recorded.`,
    allFoundMsg: 'Sharp eyes! You found all 4 processional crosses leading to the El Carmen Ruins.',
    foundMsg: (title, desc) => `Found: ${title} — ${desc}`,
    crosses: {
      cruz1: { title: 'First Ascent Cross', desc: 'Marks the start of the rocky climb.' },
      cruz2: { title: 'Rocky Bend Cross', desc: 'Watches over travelers’ apachetas.' },
      cruz3: { title: 'Ruins Cross', desc: 'Stands beside the old stone and adobe walls.' },
      cruz4: { title: 'Summit Cross', desc: 'Looks out across the Altiplano and snowy peaks.' }
    }
  },
  climbingGame: {
    introStatus:
      'Read the cracks, ice, and wind gusts on the rock face. Tap a reachable hold to climb.',
    altitudeLabel: 'Elevation:',
    gripLabel: 'Grip:',
    leaveNoTraceLabel: 'Leave no trace:',
    slipsLabel: 'Slips:',
    resetBtn: 'Reset wall',
    windLabel: 'Gully wind:',
    windDanger: 'Active gust (danger)',
    windCalm: 'Calm window (safe)',
    chalkActiveBtn: 'Chalk active (ready for ice/roof)',
    chalkApplyBtn: (charges) => `Apply Chalk (${charges} left)`,
    restBtn: 'Rest on ledge (+30% grip)',
    directHoldLabel: 'Or choose hold directly:',
    tagWindActive: 'Active gust!',
    tagWindCalm: 'Calm · Climb',
    tagIceReady: 'Ice (Chalk ready)',
    tagIceSlip: 'Slippery ice',
    tagLoose: 'Loose rock',
    tagOverhang: 'Overhang (-28% grip)',
    tagEco: 'Pack out litter (+16%)',
    looseFallMsg: (name) =>
      `The ${name.toLowerCase()} broke loose! Your rope caught you one tier lower.`,
    windBlockedMsg: (name) =>
      `Gust & falling pebbles at ${name}! Wait for the CALM window or pick another line.`,
    iceSlipMsg: (name) =>
      `You slipped on ${name.toLowerCase()}! Tap "Apply Chalk" first or traverse around via the crack.`,
    overhangTiredMsg:
      'Not enough grip for this overhang. Tap "Rest on ledge" or "Apply Chalk".',
    ecoPickedMsg: (name) =>
      `Leave-no-trace climb! You packed out the litter at "${name}" (+16% energy).`,
    anchoredMsg: (name) => `Quickdraw clipped at "${name}". Read the wall above and keep climbing!`,
    summitWonMsg: 'Condor’s Summit reached with technique, respect, and zero trace!',
    chalkAppliedMsg: 'Chalk applied: solid friction ready for frosted slabs or steep overhangs.',
    restedMsg: 'Deep breath at 4,100 m—your grip strength is restored on the ledge.',
    holds: {
      '0-1': { name: 'Base of the Crags', clue: 'Starting anchor with belayed rope.' },
      '1-0': { name: 'Granite crack', clue: 'Dry, solid fissure in sound granite.' },
      '1-1': { name: 'Fractured flake', clue: 'Brittle rock shedding gravel; it may snap!' },
      '1-2': { name: 'Littered ledge', clue: 'Solid hold with a plastic bottle to pack out.' },
      '2-0': { name: 'Windy gully', clue: 'Pebbles fall every few seconds. Climb only when calm!' },
      '2-1': { name: 'Sunlit arête', clue: 'Warm, dependable granite bathed in Altiplano sun.' },
      '2-2': { name: 'Loose block', clue: 'Wobbly, crumbly boulder.' },
      '3-0': { name: 'Steep overhang', clue: 'Takes extra strength (-28% grip) or climbing chalk.' },
      '3-1': { name: 'Frosted slab', clue: 'Slick Andean ice: apply Chalk or go around.' },
      '3-2': { name: 'Sheltered dihedral', clue: 'Clean granite corner protected from gusts.' },
      '4-0': { name: 'Wrapper crack', clue: 'Safe ledge with a forgotten wrapper to clean up.' },
      '4-1': { name: 'Wind chimney', clue: 'Intermittent high-altitude gusts—wait for calm.' },
      '4-2': { name: 'Icy cornice', clue: 'Cold frost layer—needs Chalk for friction.' },
      '5-0': { name: 'Eroded rock', clue: 'Soft sandstone flaking dust when touched.' },
      '5-1': { name: 'Condor’s crux', clue: 'Key roof (-25% grip) leading straight to the summit.' },
      '5-2': { name: 'Firm north ridge', clue: 'Crisp granite edge heading toward the top.' },
      '6-1': { name: 'Condor’s Summit', clue: 'Sacred summit at 4,150 m facing the Cordillera Real!' }
    }
  },
  mirador3d: {
    topTitle: 'Condor’s Nest Viewpoint (Wiraconi) · Sunset',
    topSubtitle: 'Drag to explore · Tap a snow-capped peak or the Wiraconi Sign to focus',
    centerTitle: 'Reset initial camera',
    centerBtn: 'Center',
    backTo3dBtn: 'Back to 3D',
    realPhotosBtn: 'Real Photos',
    webglLostMsg: 'The 3D view is restoring its graphics context.',
    viewPhotosBtn: 'View Real Viewpoint Photos',
    photosTitle: 'Real Photographs of Wiraconi / Condor’s Nest Viewpoint',
    photosSubtitle: 'Admire the towering snow-capped range beyond the Altiplano.',
    inFlightTag: 'Soaring',
    playerLocationPrefix: (name, title) => `${name} at ${title}`,
    presets: {
      mirador: {
        label: '360° Viewpoint',
        infoTitle: 'Sunset at Wiraconi Viewpoint (Condor’s Nest)',
        infoText:
          'Drag with mouse or touch to pan the rocky horizon. Tap any of the 3 Cordillera Real peaks or the Wiraconi Sign to zoom in.'
      },
      cordillera: {
        label: 'Cordillera Real',
        infoTitle: 'Cordillera Real at Sunset',
        infoText:
          'Glacial chain bathed in Andean alpenglow, crowned by three giants: Illampu, Huayna Potosí, and Illimani.'
      },
      illampu: {
        label: 'Illampu (6,485 m)',
        infoTitle: 'Mount Illampu · 6,485 m a.s.l.',
        infoText:
          'One of the highest and most dramatic massifs in the Cordillera Real, rising to the north above the granite crags.'
      },
      huayna: {
        label: 'Huayna Potosí (6,088 m)',
        infoTitle: 'Mount Huayna Potosí · 6,088 m a.s.l.',
        infoText:
          'Iconic snow-clad glacier pyramid overlooking the La Paz Altiplano—a symbol of Bolivian mountaineering.'
      },
      illimani: {
        label: 'Illimani (6,439 m)',
        infoTitle: 'Mount Illimani · 6,439 m a.s.l.',
        infoText:
          'The guardian peak of La Paz, unmistakable for its three snowy summits glowing gold and rose at dusk.'
      },
      pueblo: {
        label: 'Peñas Village',
        infoTitle: 'Peñas Village & Altiplano Valley',
        infoText:
          'At the foot of the cliffs rest the main plaza, colonial church, and the straight Altiplano road.'
      },
      cartel: {
        label: 'Wiraconi Sign',
        infoTitle: 'Mirador Wiraconi Trail Sign',
        infoText:
          'Carved wooden plaque mounted on lichen-covered granite marking the panoramic lookout crest.'
      },
      condor: {
        label: 'Andean Condor',
        infoTitle: 'Condor Soaring at Dusk',
        infoText:
          'Glides effortlessly on evening thermals above the rocky ravines of Peñas.'
      }
    },
    landmarks: {
      illampu: { label: 'Illampu', elevation: '6,485 m' },
      huayna: { label: 'Huayna Potosí', elevation: '6,088 m' },
      illimani: { label: 'Illimani', elevation: '6,439 m' },
      pueblo: { label: 'Peñas Village', elevation: '4,000 m' },
      cartel: { label: 'Wiraconi Sign', elevation: 'Plaque' }
    },
    photoCaptions: [
      'Original Mirador Wiraconi sign mounted on lichen-covered rock',
      'View looking toward Peñas village, the Altiplano highway, and snowy peaks',
      'Granite cliff face on the left with the Cordillera Real along the horizon',
      'Full panorama from the rocky ledge of Condor’s Nest Viewpoint'
    ]
  },
  plazaVideo: {
    speakerPrefix: (badge) => `Tata · ${badge}`,
    voiceMuteTitle: 'Mute narration',
    voiceEnableTitle: 'Enable narration',
    voiceOnLabel: 'Narration',
    voiceOffLabel: 'Muted',
    pauseAria: 'Pause video',
    playAria: 'Play video',
    timelineAria: 'Educational video timeline',
    restartAria: 'Restart video',
    tataLabel: 'Tata narrating',
    avatarLabel: (name) => `${name}’s avatar`,
    slides: [
      {
        id: 'plaza',
        shortLabel: '1. The Plaza',
        title: 'Main Plaza of Peñas · 3,970 m a.s.l.',
        narration:
          'Welcome to the Main Plaza of Peñas, at 3,970 meters above sea level! This peaceful square stood at the heart of one of the defining chapters of Andean history.',
        avatarBadge: 'Tata & You in the Plaza',
        highlightTag: '3,970 m a.s.l.'
      },
      {
        id: 'rebelion',
        shortLabel: '2. 1781 & Plato Paceño',
        title: '1781 · Túpac Katari, Bartolina Sisa & Plato Paceño',
        narration:
          'In 1781, Julián Apaza—Túpac Katari—and his wife Bartolina Sisa led the great indigenous uprising and laid siege to La Paz. Food scarcity brought corn, potato, fava beans, and fried cheese together, creating Plato Paceño.',
        avatarBadge: 'Katari & Bartolina Sisa',
        highlightTag: 'Corn · Potato · Fava · Fried cheese'
      },
      {
        id: 'casona',
        shortLabel: '3. The Manor',
        title: 'Historic Manor · November 14, 1781',
        narration:
          'After being betrayed, Katari was tried inside the plaza’s manor—which later hosted President Andrés de Santa Cruz—and executed by four horses while proclaiming: I will return and I will be millions.',
        avatarBadge: 'Memory of 1781',
        highlightTag: '"Volveré y seré millones"'
      },
      {
        id: 'radio',
        shortLabel: '4. Radio San Gabriel',
        title: 'Radio San Gabriel · Pioneer in the Aymara language',
        narration:
          'And in this very plaza, Radio San Gabriel was born—a pioneering broadcaster in the Aymara language.',
        avatarBadge: 'Living Voice of the Altiplano',
        highlightTag: 'Aymara Language'
      }
    ]
  },
  interactiveVideo: {
    iframeTitle: (stageTitle) => `Video for ${stageTitle}`,
    linkedCaption: 'Custom video linked to this stage',
    readyLabel: 'Ready to answer',
    fallbackCaption: 'Explore the interactive hotspots in this scene.',
    exploredPointsLabel: 'Points explored:',
    closeBtn: 'Close',
    pauseAria: 'Pause video',
    playAria: 'Play video',
    timelineAria: 'Video timeline',
    restartAria: 'Restart video'
  },
  pizzaGame: {
    introFeedback:
      'Follow the Peñas café recipe order (1 through 5) to assemble your artisan pizza.',
    ovenReadyFeedback:
      'Ready for the clay oven! Press "Pull Out at Golden Spot" inside the amber zone (35–65).',
    stepAddedFeedback: (label) => `Nice! Added ${label}.`,
    wrongOrderFeedback: (expectedLabel) => `That step comes later. First tap: ${expectedLabel}.`,
    bakedDoneFeedback:
      'Artisan pizza baked to golden perfection! Your voucher at the Peñas café awaits.',
    ovenRetryFeedback:
      'Close! Wait until the needle enters the golden center (35–65) and press again.',
    svgAria: 'Artisan Peñas pizza',
    ingredientsLabel: 'Ingredients:',
    ovenTitle: 'Peñas Clay Oven',
    pullOutBtn: 'Pull Out at Golden Spot!',
    doneTitle: 'Guardian Pizza Baked!',
    doneDesc: 'You mastered the artisan order and the exact heat of the Peñas clay oven.',
    bakeAgainBtn: 'Bake again',
    ingredients: {
      masa: '1. Highland Sourdough Crust',
      salsa: '2. Huacatay Tomato Sauce',
      queso: '3. Fresh Andean Cheese',
      tomate: '4. Tomatoes & Olives',
      quinua: '5. Crispy Quinoa (Andean grain)'
    }
  }
};

const UI_PT: UiDictionary = {
  app: {
    loadingView: 'Carregando vista de Peñas...',
    loadingStage: 'Carregando etapa de Peñas...'
  },
  errorBoundary: {
    title: 'Ocorreu um imprevisto nesta tela',
    description: 'Você pode tentar novamente sem perder seu progresso salvo em Peñas.',
    retryButton: 'Tentar novamente'
  },
  routeMap: {
    ariaLabel: 'Mapa da rota de La Paz e El Alto até Peñas'
  },
  titleScreen: {
    tataHomeIntro:
      'Olá, viajante! Você está prestes a conhecer Peñas, um povoado histórico a 60 km de La Paz e a 4.000 m de altitude. Para jogar, avance pelas 7 paradas do mapa superando seus desafios para reunir as relíquias e se tornar Guardião da memória de Peñas—e um prêmio surpresa espera por você no final. Personalize seu avatar aqui embaixo e comece a aventura.',
    headline: 'Bem-vindo a Peñas, um povoado histórico que você precisa conhecer',
    altBackdrop: 'Praça Principal de Peñas colorida com a Igreja Colonial e os Andes',
    altPortrait: 'Tata, guia sábio de Peñas',
    newGameTitle: 'Começar do zero (mantém seu avatar)',
    customAvatarBannerPrefix: 'Avatar personalizado:',
    nameLabel: 'Seu nome',
    namePlaceholder: 'Seu nome',
    editAvatarButton: 'Editar Avatar',
    resetToDefaultLabel: 'Usar visual padrão',
    defaultTravelerName: 'Viajante'
  },
  narratorDock: {
    defaultTagline: 'Relato de Peñas, La Paz',
    altTata: 'Tata narrador',
    altMiniTata: 'Tata',
    muteVoice: 'Silenciar voz de Tata',
    listenVoice: 'Ouvir voz de Tata',
    stopNarration: 'Parar narração de Tata',
    repeatNarration: 'Repetir narração de Tata',
    muteLabel: 'Silenciar',
    voiceLabel: 'Voz',
    stopLabel: 'Parar',
    listenLabel: 'Ouvir'
  },
  audioControl: {
    volumeDown: 'Diminuir volume',
    volumeUp: 'Aumentar volume',
    muteAudio: 'Silenciar áudio',
    enableAudio: 'Ativar som andino',
    audioMutedShort: 'Áudio OFF',
    musicShort: 'Música',
    openMixerTitle: 'Abrir mixer andino',
    mixerAria: 'Controles de música e ambiente',
    mixerTitle: 'Som Andino de Peñas',
    ambientLabel: 'Ambiente Natural',
    ambientSub: 'Vento andino, sino e eco de desfiladeiro',
    ambientToggleMute: 'Silenciar ambiente',
    ambientTogglePlay: 'Ativar ambiente',
    volumeLabel: 'Volume',
    melodyLabel: 'Melodia Tradicional',
    melodySub: 'Zampoña e quena andina suave',
    melodyToggleOff: 'Desligar melodia',
    melodyToggleOn: 'Ligar melodia',
    ambientSceneTitles: {
      plaza: 'Praça e Brisa de Altitude',
      templo: 'Átrio e Sinos de Peñas',
      camino: 'Vento do Caminho Pré-Hispânico',
      kunkuntiji: 'Eco na Caverna Kunkuntiji',
      qillqantiji: 'Abrigo Rochoso Qillqantiji',
      calvario: 'Cumes do Morro do Calvário',
      mirador: 'Voo do Condor · 4.300 m'
    },
    trackTitles: {
      plaza: 'Melodia da Praça (Pentatônica)',
      sendero: 'Quena da Trilha Alta',
      mirador: 'Zampoña da Cordilheira'
    }
  },
  epicMap: {
    progressSummary: (completed, total) => `${completed} de ${total} etapas concluídas`,
    profileMedalsButton: 'Perfil e Medalhas',
    avatarButton: 'Avatar',
    returnTitleAria: 'Voltar à tela inicial',
    returnTitleShort: 'Início',
    timeTooltip: 'Tempo decorrido desde o início da sua travessia',
    relicsCounter: (completed, total) => `${completed}/${total} Relíquias`,
    openVictoryDesktop: 'Abrir Recompensa Final',
    openVictoryMobile: 'Recompensa Final',
    altMapBg: 'Mapa de Peñas e suas 7 etapas',
    stagePrefix: 'Etapa',
    completedBadge: 'Concluída',
    stageCompletedTitle: (id, title) => `Etapa ${id} concluída: ${title}`,
    stageAvailableTitle: (id, title) => `Jogar Etapa ${id}: ${title}`,
    stageLockedTitle: (id, title) => `Etapa ${id}: ${title} (Conclua a anterior primeiro)`,
    stageShortWord: 'Etapa',
    completedLabel: 'Concluída',
    playLabel: 'Jogar',
    lockedLabel: 'Bloqueada',
    clickToPlayHint: 'Clique para iniciar etapa',
    completePreviousHint: (id) => `Conclua primeiro a Etapa ${id - 1}`,
    completedModalTooltip: 'Esta etapa já foi concluída (você pode revê-la)',
    relicTag: 'Relíquia',
    guardianCelebrationTooltip: 'Celebração do Guardião!',
    openRewardButton: 'Abrir Recompensa',
    guardianMedalTitle: 'Medalha do Guardião',
    guardianSubtitle: 'Disponível ao concluir 7/7',
    yourProgressTitle: 'Seu Progresso',
    relicsLabel: 'Relíquias',
    unlockedCount: (n) => `${n} desbloqueadas`,
    achievementsLabel: 'Conquistas',
    ofEight: 'de 8',
    viewAllMedalsButton: 'Ver todas as medalhas e conquistas',
    relicsShowcaseTitle: 'Relíquias Desbloqueadas',
    relicShowcasePrefix: (id) => `E${id}`,
    relicObtained: 'Relíquia obtida',
    relicLocked: 'Ainda bloqueada',
    allRelicsCompletedHint: 'Você concluiu as 7 etapas! Abra sua recompensa final para ver seu guia e prêmio.',
    nextGoalHint: (id, title) => `Próxima parada no mapa: Etapa ${id} (${title}).`
  },
  stageModal: {
    stageBadge: (id, elevation) => `Etapa ${id} de 7 · ${elevation}`,
    closeModalAria: 'Fechar etapa',
    backToCardsButton: '← Voltar às fichas',
    triviaBadge: 'Trivia da etapa',
    triviaInstruction: 'Acerte a trivia e acesse o desafio deste nível:',
    triviaWrongMessage: 'Resposta incorreta. Confira os dados históricos e tente novamente.',
    triviaSuccessMessage: 'Correto! Você desbloqueou o desafio deste nível.',
    triviaContinueButton: 'Continuar para o desafio',
    stepOfTwo: 'Passo 1 de 2 · Desafio do nível',
    challengeSolvedMsg: 'Desafio superado! Agora responda a esta pergunta pessoal para descobrir seu perfil.',
    stepTwoBadge: 'Passo 2 de 2 · Descubra seu perfil',
    changeChallengeButton: '← Trocar desafio',
    minigameCompleteFallback: 'Complete o desafio interativo para desbloquear sua relíquia.',
    riddleInputLabel: 'Sua resposta:',
    riddlePlaceholder: 'Digite aqui o nome da planta sagrada...',
    riddleVerifyButton: 'Verificar Resposta',
    riddleSuccessMsg: 'Correto! A k’oa aromática desperta o respeito à Pachamama (Mãe Terra).',
    riddleWrongMsg: (hintText) => `Ainda não é essa palavra. ${hintText}`,
    quizSuccessMsg: 'Resposta correta!',
    quizWrongMsg: 'Resposta incorreta. Leia com atenção as informações e tente novamente.',
    traitSavedMsg: 'Sua resposta foi salva no seu perfil de viajante.',
    relicSecuredBadge: 'Relíquia garantida'
  },
  stageIntro: {
    cardPrefix: 'Ficha',
    cardOpenedBadge: 'Lida',
    tapToRead: 'Toque para abrir',
    galleryHeading: 'Imagens de Peñas nesta etapa',
    factsProgress: (opened, total) => `${opened} de ${total} fichas lidas`,
    readAllToUnlock: 'Leia as 3 fichas para habilitar Avançar',
    nextButton: 'Avançar'
  },
  challengeSelector: {
    badge: 'Desafios disponíveis',
    title: 'Escolha um desafio para concluir esta etapa',
    challengeIndex: (n) => `Desafio ${n}`,
    playChallengeButton: 'Jogar este desafio'
  },
  victoryScreen: {
    closingTataMessage:
      'Parabéns e obrigado por resguardar a memória do nosso povoado; esperamos você em Peñas para celebrar!',
    backToMapAria: 'Voltar ao mapa de Peñas',
    backToMapLabel: 'Mapa',
    shareAndMedalsAria: 'Compartilhar conquistas ou editar avatar',
    profileMedalsBtn: 'Medalhas',
    editAvatarBtn: 'Avatar',
    kickerText: 'Guardião de Peñas · Morro do Calvário e Cordilheira Real',
    heroNameTitle: (name) => `${name}, você concluiu a travessia`,
    heroAlt: 'Cena final de Peñas ao entardecer diante da Cordilheira Real',
    statsLabel: 'Seu percurso',
    firstTryStat: (n) => `${n}/7 na 1ª tentativa`,
    relicsLabel: 'Relíquias',
    timeLabel: 'Tempo',
    step1Badge: 'Passo 1 · Descubra Seu Espírito de Viajante',
    step1Title: 'Seu perfil aguarda no fim da trilha',
    step1Desc:
      'Você respondeu com o coração em cada uma das 7 etapas. Toque no botão dourado para revelar que tipo de viajante você é, celebrar com seu avatar e abrir seu Guia de Peñas e prêmio surpresa.',
    revealSubtext: 'Revele seu perfil e desbloqueie seu guia personalizado',
    revealCardBadge: 'Sua Essência Revelada',
    revealCardTag: 'Guardião de Peñas',
    revealStatsHeading: 'Resumo da sua travessia',
    revealRelics: '7 / 7 relíquias',
    revealFirstTry: (n) => `${n} / 7 sem erros`,
    revealTime: 'Tempo',
    revealMedals: (n) => `${n} / 8 medalhas`,
    celebrateHeading: 'Comemore com seu avatar!',
    celebrateSub: 'Toque em um gesto para vê-lo celebrar em Peñas',
    celebrationOptions: {
      salto: 'Comemorar!',
      aguayo: 'Aguayo (tecido andino)',
      chakana: 'Chakana (cruz andina)'
    },
    shareHeading: 'Compartilhe sua aventura no Instagram e com amigos',
    shareDesc:
      'Baixe um cartão vertical (9:16) com uma foto real de Peñas, seu avatar e seu tipo de viajante, ou copie o link do jogo.',
    createPostcardBtn: 'Criar Cartão para Story',
    shareLinkBtn: 'Compartilhar link do jogo',
    linkCopiedBtn: 'Link copiado!',
    linkCopiedHint: 'Link copiado! Compartilhe nas redes sociais ou WhatsApp!',
    step3Badge: 'Passo 3 · Presente Surpresa da Comunidade de Peñas',
    step3Title: 'Seu Prêmio Surpresa por Concluir a Trilha',
    voucherLabel: 'Código de verificação',
    guideTitlePrefix: 'Guia personalizado',
    trophyAlt: 'Troféu prêmio surpresa de Peñas',
    penasClosingAlt: 'Comunidade e paisagem histórica de Peñas, La Paz',
    tataClosingSpeaker: 'Tata · Guardião de Peñas',
    downloadCompleteGuideBtn: 'Baixar Guia Completo de Peñas',
    traitLabels: {
      cultural: 'Cultural',
      aventurero: 'Aventureiro',
      naturaleza: 'Natureza',
      comunitario: 'Comunitário'
    },
    traitDescriptions: {
      cultural: 'História, arte rupestre, retábulos dourados e memória aymara.',
      aventurero: 'Escalada em rocha, cavernas, cristas e rotas de altitude.',
      naturaleza: 'Condores, Cordilheira Real, yareta e ar puro a 4.000 m.',
      comunitario: 'Sabores locais, escambo, famílias anfitriãs e ofícios.'
    },
    traitShowcase: {
      cultural: {
        badge: 'Cultura e Memória',
        alt: 'Praça principal de Peñas e história de Túpac Katari',
        caption: 'Praça Túpac Katari, retábulo em folha de ouro e cavernas pintadas.'
      },
      aventurero: {
        badge: 'Aventura em Altitude',
        alt: 'Parque de escalada e mirante nos paredões de Peñas',
        caption: 'Escalada em granito a 4.150 m diante da Cordilheira Real.'
      },
      naturaleza: {
        badge: 'Pachamama Viva',
        alt: 'Mural da Pachamama e flora nativa de Peñas',
        caption: 'Paisagens do Altiplano, flora nativa e voo de condores.'
      },
      comunitario: {
        badge: 'Povo e Sabores',
        alt: 'Cafeteria Virgen de la Natividad e murais de Peñas',
        caption: 'Escambo tradicional, Plato Paceño e hospitalidade em Peñas.'
      }
    }
  },
  avatarCreator: {
    title: 'Personalize seu Viajante de Peñas',
    subtitle: 'Visualize seu personagem de corpo inteiro e dê a ele um estilo único',
    closeAria: 'Fechar personalizador de avatar',
    nameLabel: 'Seu nome na travessia',
    namePlaceholder: 'Ex.: Amaru ou Nayra',
    randomBtn: 'Aleatório',
    previewLabel: 'Prévia de corpo inteiro',
    poseLabel: 'Pose:',
    poseIdle: 'Em pé',
    poseWalk: 'Caminhando',
    poseCheer: 'Comemorando',
    paletteLabel: 'Paleta de cores do traje',
    tabs: {
      rostro: 'Rosto e Cabelo',
      vestimenta: 'Traje Andino',
      accesorios: 'Chapéu e Extras'
    },
    skinToneLabel: 'Tom de pele',
    hairColorLabel: 'Cor do cabelo',
    hairStyleLabel: 'Penteado',
    outfitLabel: 'Vestimenta tradicional ou viajante',
    headwearLabel: 'Acessório de cabeça',
    accessoryLabel: 'Item companheiro',
    cancelBtn: 'Cancelar',
    saveBtn: 'Salvar Avatar',
    defaultName: 'Viajante',
    skinTones: {
      clear: 'Andino Claro',
      warm: 'Sol Quente',
      bronze: 'Bronze Altiplano',
      earth: 'Terra Profunda'
    },
    hairColors: {
      black: 'Preto Noite',
      brown: 'Castanho Terra',
      silver: 'Prata Sábia',
      copper: 'Cobre Andino'
    },
    hairStyles: {
      corto: 'Clássico Curto',
      cabello_suelto: 'Cabelo Solto',
      trenzas_tullmas: 'Tranças com Tullmas (enfeites)',
      trenzas_dobles: 'Tranças Duplas'
    },
    outfits: {
      poncho_tejido: 'Poncho Tecido',
      pollera_manta: 'Pollera e Manta',
      chaleco_aguayo: 'Colete de Aguayo',
      capa_guardian: 'Capa do Guardião'
    },
    headwears: {
      chullo: 'Chullo (gorro andino) Tricotado',
      sombrero_bombin: 'Chapéu-Coco (Bombín)',
      vincha_chakana: 'Faixa Chakana',
      ninguno: 'Sem Chapéu'
    },
    accessories: {
      ninguno: 'Sem acessório',
      awayo: 'Mochila de Aguayo',
      chuspa: 'Chuspa (bolsa cerimonial)',
      tupu: 'Tupu (broche cerimonial) Dourado',
      quena: 'Quena (flauta andina)'
    },
    palettes: {
      tierra: 'Terra Vermelha',
      verde: 'Vale Verde',
      azul: 'Lago Sagrado',
      armonia: 'Ouro do Sol'
    }
  },
  profileModal: {
    title: 'Perfil do Guardião e Medalhas',
    closeAria: 'Fechar perfil',
    stageCountStat: (done) => `${done}/7 etapas`,
    firstTryStat: (n) => `${n} na 1ª tentativa`,
    medalsStat: (n, total) => `${n}/${total} medalhas`,
    medalsHeading: 'Medalhas e Conquistas (8 no total)',
    unlockedPill: 'Obtida',
    downloadCardBtn: 'Baixar Cartão do Guardião',
    resetProgressBtn: 'Reiniciar jogo',
    confirmResetText: 'Apagar todo o progresso?',
    confirmResetYes: 'Sim, reiniciar',
    cancelBtn: 'Cancelar',
    cardSubtitle: 'Cartão Oficial do Guardião · 4.000 m de altitude',
    cardRankLabel: 'Título',
    cardStatsLine: (done, firstTry, medals, totalMedals, time) =>
      `${done}/7 Etapas  ·  ${firstTry} na 1ª tentativa  ·  ${medals}/${totalMedals} Medalhas  ·  Tempo ${time}`
  },
  storyPostcard: {
    title: 'Seu Cartão para Instagram Story (9:16)',
    subtitle: 'Compartilhe sua jornada em Peñas com um fundo real e seu próprio avatar',
    closeAria: 'Fechar cartão',
    chooseBackdropLabel: 'Escolha a cena real de Peñas ao fundo',
    generatingPreview: 'Gerando prévia...',
    previewAlt: 'Prévia do seu cartão de Peñas para Instagram Story',
    fallbackBadge: 'PEÑAS · LA PAZ, BOLÍVIA · 4.000 M',
    fallbackTitle: (name) => `${name} concluiu Peñas!`,
    fallbackAction: 'Download direto em PNG 1080×1920',
    downloadStoryBtn: 'Baixar Story (PNG)',
    generatingBtn: 'Gerando...',
    nativeShareBtn: 'Compartilhar',
    shareNote: 'Você também pode copiar o convite direto:',
    instaTips:
      'Dica: no Instagram escolha esta imagem da galeria e adicione o sticker «Link» colando a URL do jogo.',
    copiedPrefix: 'Copiado:',
    shareTitle: 'Peñas: Caminho do Guardião',
    shareText: (type) => `Concluí Peñas: Caminho do Guardião! Meu perfil é ${type}. Venha conhecer Peñas, La Paz:`,
    canvasLocationHeader: 'PEÑAS · LA PAZ, BOLÍVIA · 4.000 M',
    canvasTitle: 'CAMINHO DO GUARDIÃO',
    canvasFooterCta: 'Jogue grátis e conheça Peñas',
    canvasRankGuardian: 'Guardião de Peñas',
    canvasRankExplorer: 'Explorador de Peñas'
  },
  achievementToast: {
    header: 'Nova Conquista Desbloqueada!',
    closeAria: 'Fechar aviso de conquista'
  },
  katariPhrase: {
    introStatus:
      'Toque nas pedras esculpidas na ordem exata em espanhol da última proclamação de Túpac Katari ("Voltarei e serei milhões!"):',
    translationHint: 'Significado: «Volveré» = Voltarei · «y» = e · «seré» = serei · «millones» = milhões',
    builtPhraseLabel: 'Proclamação montada (toque em uma pedra para remover):',
    clickToRemoveHint: 'Toque nas palavras abaixo para posicioná-las aqui...',
    clearBtn: 'Limpar',
    availableStonesLabel: 'Pedras esculpidas disponíveis (há 2 distratores):',
    verifyBtn: 'Verificar Proclamação',
    selectAllFourMsg: 'Selecione as 4 palavras em ordem antes de verificar.',
    successMsg: 'Exato! «Volveré y seré millones» ("Voltarei e serei milhões") ecoa até hoje em Peñas.',
    wrongMsg: 'Quase... lembre-se da proclamação imortal de 14 de novembro de 1781. Tente outra ordem.'
  },
  platoPaceno: {
    introStatus:
      'Mova o prato de barro com os botões ou setas para pegar Milho, Batata, Favas e Queijo frito (desvie das pedras):',
    progressLabel: 'Progresso:',
    mistakesLabel: 'Tropeços:',
    recipeLabel: 'Receita:',
    moveLeftBtn: 'Esquerda',
    moveRightBtn: 'Direita',
    controlsHint: 'Use as setas ← / → ou arraste sobre a tela',
    plateLabel: 'Plato Paceño',
    neededTag: 'Falta',
    stoneLabel: 'Pedra',
    wrongIngredientFeedback: (label) => `Ops! Você já pegou ${label} suficiente para o seu Plato Paceño.`,
    stoneHitFeedback: 'Cuidado com as pedras! Desvie delas para proteger o prato.',
    allCollectedFeedback: 'Plato Paceño completo! Milho, batata, favas e queijo frito prontos.',
    caughtIngredientFeedback: (label) => `Boa! Você pegou ${label}.`,
    items: {
      choclo: 'Milho (Choclo)',
      papa: 'Batata',
      habas: 'Favas',
      queso: 'Queijo frito'
    }
  },
  magicBrush: {
    introStatus:
      'Passe o pincel (dedo ou mouse) por todo o quadro para limpar a poeira dos séculos e revelar a folha de ouro do templo.',
    restoredLabel: 'Retábulo restaurado:',
    resetBtn: 'Cobrir novamente',
    swipeHint: 'Deslize o pincel pela cena',
    doneMsg: 'Esplêndido! O retábulo em folha de ouro e a abóbada floral voltam a brilhar.',
    altAltarpiece: 'Interior do Templo Colonial de Peñas e seu retábulo em folha de ouro'
  },
  totoraBasket: {
    introStatus: 'Passo 1: Selecione os juncos de totora para montar a base do seu cesto de escambo.',
    stepLabel: 'Passo',
    wovenPercent: (pct) => `${pct}% tecido`,
    resetBtn: 'Reiniciar cesto',
    barterProductsHeading: 'Produtos nativos do escambo',
    barterSub: 'Toque em cada alimento para colocá-lo no cesto:',
    altMuseumBasket: 'Cesto de totora e produtos tradicionais no museu de Peñas',
    basketCaption: 'Cestaria tradicional em totora (junco andino) preservada pela comunidade.',
    steps: {
      base: {
        label: '1. Montar base de totora',
        button: 'Entrelaçar base',
        feedback: 'Base firme! Agora teça as paredes laterais do cesto.'
      },
      pared: {
        label: '2. Tecer paredes altas',
        button: 'Subir tecido lateral',
        feedback: 'Muito bem! Agora trance a borda superior para resistir à viagem.'
      },
      borde: {
        label: '3. Trançar borda superior',
        button: 'Arrematar borda',
        feedback: 'Cesto pronto! Agora coloque os 4 produtos nativos para o escambo.'
      },
      carga: {
        label: '4. Carregar produtos do escambo',
        button: 'Cesto pronto',
        feedback: 'Cesto cheio para o escambo! Você concluiu o desafio artesanal.'
      }
    },
    products: {
      chuno: { name: 'Chuño', hint: 'Batata desidratada ancestral' },
      quinua: { name: 'Quinoa', hint: 'Grão dourado do Altiplano' },
      koa: { name: 'K’oa (erva cerimonial)', hint: 'Erva aromática cerimonial' },
      papa: { name: 'Batata nativa', hint: 'Cultivo ancestral andino' }
    }
  },
  aguayoPuzzle: {
    introStatus: 'Toque em duas peças quaisquer do tear para trocá-las até completar o aguayo.',
    solvedBadge: 'Aguayo concluído!',
    movesLabel: 'Movimentos:',
    resetBtn: 'Embaralhar novamente',
    referenceHeading: 'Modelo de referência',
    altReference: 'Modelo completo do aguayo de Peñas',
    gridAria: 'Quebra-cabeça do aguayo andino',
    tileAria: (pos) => `Peça ${pos} do aguayo`,
    captionFooter: 'Reconstrua o tecido simétrico (3×3) conectando as faixas e a Chakana.',
    solvedMessage: (moves) => `Excelente trabalho! Você reconstruiu o aguayo em ${moves} movimentos.`
  },
  memoryGame: {
    introStatus:
      'Toque em duas pedras esculpidas na caverna Kunkuntiji para revelar e formar os 6 pares sagrados.',
    pairsLabel: 'Pares encontrados:',
    attemptsLabel: 'Tentativas:',
    resetBtn: 'Reiniciar pedras',
    cardBackAria: 'Pedra oculta da caverna Kunkuntiji',
    allPairsMsg: (attempts) =>
      `Magnífico! Você encontrou os 6 símbolos sagrados da caverna Kunkuntiji em ${attempts} tentativas.`,
    pairFoundMsg: (label) => `Par encontrado: ${label}!`,
    pairMismatchMsg: 'Não combinam; observe bem onde está cada símbolo.',
    cards: {
      koa: { label: 'K’oa Aromática', subtitle: 'Erva ritual sagrada' },
      chakana: { label: 'Chakana', subtitle: 'Cruz andina sagrada' },
      condor: { label: 'Condor', subtitle: 'Guardião do céu' },
      llama: { label: 'Lhama', subtitle: 'Companheira das caravanas' },
      aguayo: { label: 'Aguayo', subtitle: 'Tecido de memória' },
      cerro: { label: 'Cordilheira', subtitle: 'Apus nevados' }
    }
  },
  rupestreSnake: {
    introStatus: 'Use o pigmento mineral vermelho ou amarelo e toque nos pontos em ordem (1 → 9).',
    nodesLabel: 'Pontos traçados:',
    pigmentLabel: 'Pigmento:',
    mineralPrefix: 'Mineral',
    redColor: 'Vermelho Ocre',
    yellowColor: 'Amarelo',
    resetBtn: 'Reiniciar traço',
    svgAria: 'Pintura rupestre da Serpente de 3 Cabeças na caverna Qillqantiji',
    nextDotAria: (n) => `Próximo ponto ${n} para traçar`,
    dotAria: (n) => `Ponto ${n}`,
    needNextDotMsg: (n) => `Siga a sequência na rocha: toque agora no ponto ${n}.`,
    progressMsg: (done, total, next) =>
      `Traço firme! ${done} de ${total} pontos minerais ligados. Próximo: ${next}.`,
    completedMsg: 'Maravilhoso! Você restaurou a Serpente de 3 Cabeças do estilo Yaya-Mama.',
    colorSwitchMsg: (colorName) =>
      `Pigmento mineral ${colorName} selecionado. Continue ligando os pontos em ordem.`
  },
  apachetaStack: {
    introStatus:
      'Pressione "Soltar pedra" bem quando a pedra passar centralizada sobre a torre para erguer sua apacheta.',
    stonesLabel: 'Pedras em equilíbrio:',
    resetBtn: 'Reiniciar apacheta',
    dropBtn: (name) => `Soltar ${name}`,
    completedBanner: 'Apacheta sagrada erguida em equilíbrio perfeito!',
    steadyMsg: (name, remaining) =>
      `${name} equilibrada com firmeza! Faltam ${remaining} pedra(s).`,
    toppledMsg: 'A pedra escorregou! Observe o ritmo com calma e tente novamente.',
    completedMsg: 'Apacheta coroada! Seus votos de bom caminho sobem rumo aos cumes.',
    stoneNames: [
      'Pedra Base Larga',
      'Segunda Laje Firme',
      'Terceira Pedra Andina',
      'Quarta Pedra de Quartzo',
      'Pedra Coroa do Condor'
    ]
  },
  calvarioCrosses: {
    introStatus:
      'Explore o morro do Calvário e as Ruínas de El Carmen: toque nas 4 cruzes brancas escondidas entre as rochas.',
    crossesLabel: 'Cruzes encontradas:',
    resetBtn: 'Buscar novamente',
    svgAria: 'Trilha do Morro do Calvário e Ruínas de El Carmen com cruzes processionais',
    crossSpotAria: (title) => `Descobrir ${title}`,
    alreadyFoundMsg: (title) => `${title} já foi registrada.`,
    allFoundMsg: 'Olhar atento! Você encontrou as 4 cruzes processionais até as Ruínas de El Carmen.',
    foundMsg: (title, desc) => `Encontrada: ${title} — ${desc}`,
    crosses: {
      cruz1: { title: 'Primeira Cruz da Subida', desc: 'Marca o início da trilha rochosa.' },
      cruz2: { title: 'Cruz da Curva Rochosa', desc: 'Protege as apachetas dos viajantes.' },
      cruz3: { title: 'Cruz das Ruínas', desc: 'Guarda as antigas paredes de adobe e pedra.' },
      cruz4: { title: 'Cruz do Cume', desc: 'Contempla o Altiplano e os picos nevados.' }
    }
  },
  climbingGame: {
    introStatus:
      'Observe as fendas, o gelo e as rajadas na rocha. Toque em uma agarra acessível para escalar.',
    altitudeLabel: 'Altitude:',
    gripLabel: 'Aderência:',
    leaveNoTraceLabel: 'Sem rastro:',
    slipsLabel: 'Escorregões:',
    resetBtn: 'Reiniciar paredão',
    windLabel: 'Vento nas canaletas:',
    windDanger: 'Rajada ativa (perigo)',
    windCalm: 'Em calma (seguro)',
    chalkActiveBtn: 'Magnésio ativo (pronto para gelo/teto)',
    chalkApplyBtn: (charges) => `Aplicar Magnésio (${charges} restantes)`,
    restBtn: 'Respirar na plataforma (+30% aderência)',
    directHoldLabel: 'Ou escolha uma agarra:',
    tagWindActive: 'Rajada ativa!',
    tagWindCalm: 'Calmo · Subir',
    tagIceReady: 'Gelo (Com magnésio)',
    tagIceSlip: 'Gelo escorregadio',
    tagLoose: 'Rocha solta',
    tagOverhang: 'Teto (-28% força)',
    tagEco: 'Recolher resíduo (+16%)',
    looseFallMsg: (name) =>
      `A ${name.toLowerCase()} cedeu sob o seu peso! A corda segurou você um nível abaixo.`,
    windBlockedMsg: (name) =>
      `Rajada e pedras caindo em ${name}! Espere a janela de CALMA ou siga outra via.`,
    iceSlipMsg: (name) =>
      `Você escorregou na ${name.toLowerCase()}! Toque em «Aplicar Magnésio» antes ou contorne pela fenda.`,
    overhangTiredMsg:
      'Falta aderência para este teto. Toque em «Respirar na plataforma» ou «Magnésio».',
    ecoPickedMsg: (name) =>
      `Escalada sem rastro! Você recolheu o resíduo em «${name}» (+16% energia).`,
    anchoredMsg: (name) => `Costura presa em «${name}». Leia a rocha acima e continue!`,
    summitWonMsg: 'Cume do Condor alcançado com técnica, respeito e rastro zero!',
    chalkAppliedMsg: 'Magnésio aplicado: aderência firme para placas com gelo ou tetos.',
    restedMsg: 'Você respirou fundo a 4.100 m e recuperou a firmeza na plataforma.',
    holds: {
      '0-1': { name: 'Base dos Paredões', clue: 'Ponto de partida com corda presa.' },
      '1-0': { name: 'Fenda granítica', clue: 'Fissura seca e firme em granito sólido.' },
      '1-1': { name: 'Laje rachada', clue: 'Rocha fraturada soltando cascalho; pode ceder!' },
      '1-2': { name: 'Plataforma com resíduo', clue: 'Agarra firme com garrafa plástica para recolher.' },
      '2-0': { name: 'Canaleta de vento', clue: 'Caem pedrinhas a cada poucos segundos. Suba só na calma!' },
      '2-1': { name: 'Aresta ensolarada', clue: 'Rocha firme aquecida pelo sol do Altiplano.' },
      '2-2': { name: 'Bloco solto', clue: 'Pedra instável e quebradiça.' },
      '3-0': { name: 'Teto negativo', clue: 'Exige força (-28% aderência) ou uso de magnésio.' },
      '3-1': { name: 'Placa com geada', clue: 'Gelo andino escorregadio: aplique Magnésio ou contorne.' },
      '3-2': { name: 'Diedro protegido', clue: 'Canto de granito limpo abrigado do vento.' },
      '4-0': { name: 'Fenda com embalagem', clue: 'Plataforma segura com embalagem esquecida para limpar.' },
      '4-1': { name: 'Chaminé ventosa', clue: 'Rajadas intermitentes de altitude: espere a calmaria.' },
      '4-2': { name: 'Cornija gelada', clue: 'Camada fria de geada: requer Magnésio para aderir.' },
      '5-0': { name: 'Rocha erodida', clue: 'Arenito frouxo que solta poeira ao toque.' },
      '5-1': { name: 'Passagem do Condor', clue: 'Teto-chave (-25% aderência) rumo ao cume.' },
      '5-2': { name: 'Crista firme norte', clue: 'Boa quina de granito em direção ao topo.' },
      '6-1': { name: 'Cume do Condor', clue: 'Topo sagrado a 4.150 m diante da Cordilheira Real!' }
    }
  },
  mirador3d: {
    topTitle: 'Mirante Ninho de Condor (Wiraconi) · Entardecer',
    topSubtitle: 'Arraste para explorar · Toque num nevado ou no Cartaz Wiraconi para focar',
    centerTitle: 'Centralizar vista inicial',
    centerBtn: 'Centralizar',
    backTo3dBtn: 'Voltar ao 3D',
    realPhotosBtn: 'Fotos Reais',
    webglLostMsg: 'A vista 3D está restaurando seu contexto gráfico.',
    viewPhotosBtn: 'Ver Fotos Reais do Mirante',
    photosTitle: 'Fotografias Reais do Mirante Wiraconi / Ninho de Condor',
    photosSubtitle: 'Observe a imponente cordilheira nevada ao fundo do Altiplano.',
    inFlightTag: 'Em voo',
    playerLocationPrefix: (name, title) => `${name} em ${title}`,
    presets: {
      mirador: {
        label: 'Mirante 360°',
        infoTitle: 'Entardecer no Mirante Wiraconi (Ninho de Condor)',
        infoText:
          'Arraste com o mouse ou dedo para percorrer o horizonte rochoso. Toque em qualquer um dos 3 nevados da Cordilheira Real ou no Cartaz Wiraconi para aproximar.'
      },
      cordillera: {
        label: 'Cordilheira Real',
        infoTitle: 'Cordilheira Real ao Entardecer',
        infoText:
          'Cadeia glacial iluminada pelo arrebol andino, coroada por três gigantes: Illampu, Huayna Potosí e Illimani.'
      },
      illampu: {
        label: 'Illampu (6.485 m)',
        infoTitle: 'Nevado Illampu · 6.485 m de altitude',
        infoText:
          'Um dos maciços mais altos e imponentes da Cordilheira Real, visível ao norte a partir dos paredões de granito.'
      },
      huayna: {
        label: 'Huayna Potosí (6.088 m)',
        infoTitle: 'Nevado Huayna Potosí · 6.088 m de altitude',
        infoText:
          'Icônica pirâmide glacial de neve eterna diante do Altiplano pacenho, símbolo do andinismo boliviano.'
      },
      illimani: {
        label: 'Illimani (6.439 m)',
        infoTitle: 'Nevado Illimani · 6.439 m de altitude',
        infoText:
          'O guardião tutelar de La Paz, reconhecível por seus três cumes nevados tingidos de dourado e rosa ao cair da tarde.'
      },
      pueblo: {
        label: 'Povoado de Peñas',
        infoTitle: 'Povoado de Peñas e Vale do Altiplano',
        infoText:
          'Ao pé dos paredões rochosos repousam a praça, a igreja colonial e a reta estrada do Altiplano.'
      },
      cartel: {
        label: 'Cartaz Wiraconi',
        infoTitle: 'Placa do Mirante Wiraconi',
        infoText:
          'Placa de madeira entalhada sobre rocha com líquens amarelos e verdes que marca o topo panorâmico do mirante.'
      },
      condor: {
        label: 'Condor Andino',
        infoTitle: 'Voo do Condor ao Ocaso',
        infoText:
          'Plana aproveitando as últimas correntes térmicas sobre os cânions rochosos de Peñas.'
      }
    },
    landmarks: {
      illampu: { label: 'Illampu', elevation: '6.485 m' },
      huayna: { label: 'Huayna Potosí', elevation: '6.088 m' },
      illimani: { label: 'Illimani', elevation: '6.439 m' },
      pueblo: { label: 'Povoado de Peñas', elevation: '4.000 m' },
      cartel: { label: 'Cartaz Wiraconi', elevation: 'Placa' }
    },
    photoCaptions: [
      'Placa original do Mirante Wiraconi sobre rocha com líquens',
      'Vista para o povoado de Peñas, a estrada do Altiplano e os nevados',
      'Paredão granítico à esquerda e a Cordilheira Real no horizonte',
      'Panorâmica completa desde a borda rochosa do Mirante Ninho de Condor'
    ]
  },
  plazaVideo: {
    speakerPrefix: (badge) => `Tata · ${badge}`,
    voiceMuteTitle: 'Silenciar narração',
    voiceEnableTitle: 'Ativar narração',
    voiceOnLabel: 'Narração',
    voiceOffLabel: 'Sem voz',
    pauseAria: 'Pausar vídeo',
    playAria: 'Reproduzir vídeo',
    timelineAria: 'Linha do tempo do vídeo educativo',
    restartAria: 'Reiniciar vídeo',
    tataLabel: 'Tata narrando',
    avatarLabel: (name) => `Avatar de ${name}`,
    slides: [
      {
        id: 'plaza',
        shortLabel: '1. A Praça',
        title: 'Praça Principal de Peñas · 3.970 m s. n. m.',
        narration:
          'Bem-vindo à Praça Principal de Peñas, a 3.970 metros acima do nível do mar! Este espaço tranquilo foi epicentro de um dos episódios mais importantes da história andina.',
        avatarBadge: 'Tata e Você na Praça',
        highlightTag: '3.970 m de altitude'
      },
      {
        id: 'rebelion',
        shortLabel: '2. 1781 e Plato Paceño',
        title: '1781 · Túpac Katari, Bartolina Sisa e o Plato Paceño',
        narration:
          'Em 1781, Julián Apaza, Túpac Katari, e sua esposa Bartolina Sisa lideraram a grande rebelião indígena e sitiaram La Paz. A escassez uniu milho, batata, favas e queijo frito, originando o Plato Paceño.',
        avatarBadge: 'Katari e Bartolina Sisa',
        highlightTag: 'Milho · Batata · Favas · Queijo frito'
      },
      {
        id: 'casona',
        shortLabel: '3. O Casarão',
        title: 'O Casarão Histórico · 14 de novembro de 1781',
        narration:
          'Após ser traído, Katari foi julgado no casarão da praça—que mais tarde hospedou o presidente Andrés de Santa Cruz—e executado por quatro cavalos proclamando: Voltaré y seré millones.',
        avatarBadge: 'Memória de 1781',
        highlightTag: '«Volveré y seré millones»'
      },
      {
        id: 'radio',
        shortLabel: '4. Rádio San Gabriel',
        title: 'Rádio San Gabriel · Pioneira em língua aymara',
        narration:
          'E nessa mesma praça nasceu a Rádio San Gabriel, emissora pioneira na radiodifusão em língua aymara.',
        avatarBadge: 'Voz viva do Altiplano',
        highlightTag: 'Língua Aymara'
      }
    ]
  },
  interactiveVideo: {
    iframeTitle: (stageTitle) => `Vídeo de ${stageTitle}`,
    linkedCaption: 'Vídeo personalizado vinculado a esta etapa',
    readyLabel: 'Pronto para responder',
    fallbackCaption: 'Explore os pontos interativos desta cena.',
    exploredPointsLabel: 'Pontos explorados:',
    closeBtn: 'Fechar',
    pauseAria: 'Pausar vídeo',
    playAria: 'Reproduzir vídeo',
    timelineAria: 'Linha do tempo do vídeo',
    restartAria: 'Reiniciar vídeo'
  },
  pizzaGame: {
    introFeedback:
      'Siga a ordem da receita da cafeteria de Peñas (de 1 a 5) para montar sua pizza artesanal.',
    ovenReadyFeedback:
      'Pronta para o forno de barro! Pressione "Tirar do Forno" dentro da faixa dourada (35–65).',
    stepAddedFeedback: (label) => `Perfeito! Você adicionou ${label}.`,
    wrongOrderFeedback: (expectedLabel) => `Esse passo vem depois. Primeiro toque em: ${expectedLabel}.`,
    bakedDoneFeedback:
      'Pizza artesanal dourada com perfeição! Seu vale na cafeteria de Peñas espera por você.',
    ovenRetryFeedback:
      'Quase: espere o ponteiro passar pelo centro dourado (35–65) e pressione novamente.',
    svgAria: 'Pizza artesanal de Peñas',
    ingredientsLabel: 'Ingredientes:',
    ovenTitle: 'Forno de Barro de Peñas',
    pullOutBtn: 'Tirar do Forno no Ponto Dourado!',
    doneTitle: 'Pizza do Guardião Assada!',
    doneDesc: 'Você dominou a ordem artesanal e o calor exato do forno de Peñas.',
    bakeAgainBtn: 'Assar novamente',
    ingredients: {
      masa: '1. Massa Madre de Altitude',
      salsa: '2. Molho com Huacatay',
      queso: '3. Queijo Fresco Andino',
      tomate: '4. Tomates e Azeitonas',
      quinua: '5. Quinoa Crocante (grão andino)'
    }
  }
};

export function getUiTexts(lang: AppLanguage): UiDictionary {
  if (lang === 'en') return UI_EN;
  if (lang === 'pt') return UI_PT;
  return UI_ES;
}
