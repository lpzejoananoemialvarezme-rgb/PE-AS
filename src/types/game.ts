export type GameScreen = 'TITLE_MENU' | 'MAP_VIEW' | 'STAGE_MODAL' | 'VICTORY_SCREEN';

export type ChallengeType =
  | 'multiple_choice'
  | 'video_quiz'
  | 'riddle'
  | 'puzzle'
  | 'climbing_game'
  | 'memory_game'
  | 'pizza_craft'
  | 'mirador_3d'
  | 'totora_basket'
  | 'katari_phrase'
  | 'plato_paceno_catch'
  | 'magic_brush'
  | 'rupestre_snake'
  | 'apacheta_stack'
  | 'calvario_crosses';

export type TravelerTrait = 'cultural' | 'aventurero' | 'naturaleza' | 'comunitario';

export interface VideoHotspot {
  id: string;
  timePercent: number;
  x: number;
  y: number;
  label: string;
  fact: string;
}

export interface VideoScene {
  title: string;
  caption: string;
  palette: 'adobe' | 'rock' | 'valley';
  imageUrl?: string;
}

export interface TravelerChoice {
  label: string;
  trait: TravelerTrait;
}

export interface StageGalleryItem {
  imageUrl: string;
  label: string;
  caption: string;
}

export interface DidYouKnowBullet {
  title: string;
  detail: string;
}

export interface StageData {
  id: number;
  title: string;
  subtitle: string;
  eraOrElevation: string;
  mapPosition: { x: number; y: number };
  relicName: string;
  relicDescription: string;
  relicIcon: 'chakana' | 'bell' | 'wiphala' | 'loom' | 'carabiner' | 'quinoa' | 'key';
  type: ChallengeType;
  secondaryType?: ChallengeType;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryPrompt?: string;
  narratorIntro: string;
  narratorSuccess: string;
  educationalCapsule: string;
  didYouKnowBullets?: DidYouKnowBullet[];
  questionPrompt: string;
  // Multiple choice & video quiz fields
  options: string[];
  correctIndex: number;
  // Video quiz fields
  videoUrl: string;
  videoScenes: VideoScene[];
  videoHotspots: VideoHotspot[];
  // Riddle fields
  riddlePrompt: string;
  riddleAnswer: string;
  riddleAcceptedVariants: string[];
  riddleHints: string[];
  // Puzzle fields
  puzzleImageUrl: string;
  puzzleCaption: string;
  // Optional illustrated scenic banner & info gallery for the stage
  sceneImageUrl?: string;
  sceneCaption?: string;
  infoGallery?: StageGalleryItem[];
  // Traveler discovery question on completion
  travelerPrompt: string;
  travelerChoices: TravelerChoice[];
}

export interface TravelerProfileInfo {
  trait: TravelerTrait;
  title: string;
  subtitle: string;
  description: string;
  recommendation: string;
}

export interface GameTexts {
  titleScreen: {
    locationTag: string;
    gameTitle: string;
    heroSubtitle: string;
    tataWelcome: string;
    startButtonLabel: string;
    resumeButtonLabel: string;
    newGameButtonLabel: string;
    footerHint: string;
  };
  mapScreen: {
    brandTitle: string;
    trailTitle: string;
    narratorDefaultHint: string;
    narratorAllCompleted: string;
  };
  stageModal: {
    tataSpeakerTitle: string;
    introListenSubtitle: string;
    capsuleHeading: string;
    startChallengeButton: string;
    dualChoiceHeader: string;
    traitSectionBadge: string;
    relicUnlockedBadge: string;
    finishStageButton: string;
  };
  victoryScreen: {
    headerKicker: string;
    narratorClosing: string;
    revealButtonText: string;
    guideSectionLabel: string;
    guideTitle: string;
    guideDescription: string;
    guideButtonText: string;
    surpriseBadge: string;
    surpriseButtonText: string;
    surpriseHint: string;
  };
  travelerProfiles: Record<TravelerTrait, TravelerProfileInfo>;
}

export type AvatarHairStyle = 'trenzas_tullmas' | 'trenzas_dobles' | 'cabello_suelto' | 'corto_andino';
export type AvatarOutfit = 'poncho_tejido' | 'pollera_manta' | 'chaleco_aguayo' | 'capa_guardian';
export type AvatarHeadwear = 'chullo' | 'sombrero_bombin' | 'vincha_chakana' | 'ninguno';
export type AvatarAccessory = 'chuspa' | 'bufanda_alpaca' | 'collar_plata' | 'ninguno';
export type AvatarPalette = 'tierra' | 'verde' | 'azul' | 'armonia';

export interface AvatarConfig {
  skinTone: string;
  hairStyle: AvatarHairStyle;
  hairColor: string;
  outfit: AvatarOutfit;
  headwear: AvatarHeadwear;
  accessory: AvatarAccessory;
  palette: AvatarPalette;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: '#C8926E',
  hairStyle: 'trenzas_tullmas',
  hairColor: '#1B1817',
  outfit: 'poncho_tejido',
  headwear: 'chullo',
  accessory: 'chuspa',
  palette: 'armonia'
};

export interface PlayerProgress {
  playerName: string;
  avatar: AvatarConfig;
  unlockedStage: number;
  completedStages: number[];
  firstTryWins: number[];
  traitScores: Record<TravelerTrait, number>;
  voucherCode: string;
  startedAt?: string;
  completedAt?: string;
  unlockedAchievements?: string[];
}

export type MedalTier = 'bronce' | 'plata' | 'oro' | 'esmeralda';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  criterion: string;
  tier: MedalTier;
  icon: 'compass' | 'star' | 'mountain' | 'flame' | 'loom' | 'leaf' | 'crown' | 'clock';
}

