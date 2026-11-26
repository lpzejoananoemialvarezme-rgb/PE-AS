import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  CheckCircle2,
  Compass,
  Download,
  Dumbbell,
  Instagram,
  Map,
  Music,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
  Zap
} from 'lucide-react';
import { GameTexts, PlayerProgress, StageData, TravelerTrait } from '../types/game';
import { ASSETS, DEFAULT_GAME_TEXTS } from '../data/defaultStages';
import {
  COMMUNITY_VOUCHER_IMAGE,
  downloadCommunityVoucher,
  downloadTouristGuide,
  getDominantTravelerProfile,
  getPlayerRank
} from '../utils/rewards';
import { NarratorDock } from './NarratorDock';
import { ChakanaLogoSvg } from './RelicIcon';
import { AvatarPose, AymaraFullBodyAvatar } from './AymaraFullBodyAvatar';
import { TataCutoutCharacter } from './TataCutoutCharacter';
import { TravelGuide3DIcon } from './TravelGuide3DIcon';
import { AudioControl } from './AudioControl';
import { GoldenParticlesBurst } from './GoldenParticlesBurst';
import { soundEngine } from '../utils/sound';
import { tataVoice } from '../utils/tataVoice';

interface VictoryScreenProps {
  stages: StageData[];
  progress: PlayerProgress;
  gameTexts?: GameTexts;
  onBackToMap: () => void;
  onPlayAgain: () => void;
  onOpenStoryPostcard: () => void;
}

type CelebrationPose = Extract<AvatarPose, 'dance' | 'jump' | 'flex' | 'dab'>;

const CELEBRATION_OPTIONS: Array<{
  id: CelebrationPose;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'dance',
    label: 'Bailar',
    Icon: Music
  },
  {
    id: 'jump',
    label: 'Saltar',
    Icon: ArrowUp
  },
  {
    id: 'flex',
    label: 'Fuerza de Luchador',
    Icon: Dumbbell
  },
  {
    id: 'dab',
    label: 'Dab',
    Icon: Zap
  }
];

const TRAIT_LABELS: Record<TravelerTrait, { name: string; color: string }> = {
  cultural: { name: 'Turista Cultural', color: 'bg-[#D9A05B]' },
  aventurero: { name: 'Aventurero de Altura', color: 'bg-[#4EA8DE]' },
  naturaleza: { name: 'Explorador de Naturaleza', color: 'bg-[#52B788]' },
  comunitario: { name: 'Viajero Comunitario', color: 'bg-[#F5B700]' }
};

const TRAIT_GENERAL_DESCRIPTIONS: Record<TravelerTrait, string> = {
  cultural:
    'Disfrutas sumergirte en la historia viva, el arte, los museos y el significado profundo de cada cultura que visitas.',
  aventurero:
    'Buscas emoción, cumbres desafiantes, rutas al aire libre y miradores que despiertan tu espíritu explorador.',
  naturaleza:
    'Conectas con la calma del paisaje, la flora, la fauna y la energía pura de los entornos naturales.',
  comunitario:
    'Aprecias el encuentro cercano con la gente local, la gastronomía auténtica, las artesanías y las tradiciones vivas.'
};

const TRAIT_SHOWCASE: Record<
  TravelerTrait,
  {
    photoUrl: string;
    fallbackUrl: string;
    photoCaption: string;
  }
> = {
  cultural: {
    photoUrl: ASSETS.PLAZA_KATARI,
    fallbackUrl: ASSETS.CHURCH_INTERIOR,
    photoCaption: 'Plaza Principal de Peñas y monumento a Túpac Katari'
  },
  aventurero: {
    photoUrl: ASSETS.CASTILLO_CORDILLERA,
    fallbackUrl: ASSETS.CLIFFS_GROTTO,
    photoCaption: 'Castillo del Búho y cumbres nevadas de la Cordillera Real'
  },
  naturaleza: {
    photoUrl: ASSETS.MURAL_PACHAMAMA,
    fallbackUrl: ASSETS.TITLE_BACKDROP,
    photoCaption: 'Mural de la Pachamama (Madre Tierra), dientes de león y senderos del Altiplano'
  },
  comunitario: {
    photoUrl: ASSETS.MURALES_CAFETERIA,
    fallbackUrl: ASSETS.ADVENTURE_PARK_BUS,
    photoCaption: 'Cafetería Virgen de la Natividad, murales y artesanías de Peñas'
  }
};

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  stages,
  progress,
  gameTexts = DEFAULT_GAME_TEXTS,
  onBackToMap,
  onPlayAgain,
  onOpenStoryPostcard
}) => {
  const [revealedDiscovery, setRevealedDiscovery] = useState(false);
  const [celebrationPose, setCelebrationPose] = useState<CelebrationPose>('dance');
  const [celebrationBurstKey, setCelebrationBurstKey] = useState(1);
  const [voucherDownloaded, setVoucherDownloaded] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [plazaError, setPlazaError] = useState(false);
  const [voucherImgError, setVoucherImgError] = useState(false);
  const [closingBgError, setClosingBgError] = useState(false);
  const [isClosingSpeaking, setIsClosingSpeaking] = useState(false);
  const [trophyBurstKey, setTrophyBurstKey] = useState(0);

  // Switch exclusively to the epic victory score while on this final screen
  useEffect(() => {
    soundEngine.setVictoryMode(true);
    if (!soundEngine.isMuted() && !soundEngine.isMusicPlaying()) {
      soundEngine.startMusic();
    }
    const unsub = tataVoice.subscribe((speaking) => {
      setIsClosingSpeaking(speaking);
    });
    return () => {
      unsub();
      soundEngine.setVictoryMode(false);
      tataVoice.stop();
    };
  }, []);

  const vt = gameTexts.victoryScreen;
  const { rankTitle, badgeDescription } = getPlayerRank(progress);
  const profile = getDominantTravelerProfile(progress.traitScores, gameTexts.travelerProfiles);
  const travelerName = progress.playerName.trim() || 'Viajero de Peñas';

  const showcase = TRAIT_SHOWCASE[profile.trait];
  const backdropUrl = photoError ? showcase.fallbackUrl : showcase.photoUrl;
  const plazaBgUrl = plazaError ? ASSETS.MURALES_CAFETERIA : ASSETS.PLAZA_KATARI;
  const closingBgUrl = closingBgError ? ASSETS.TITLE_BACKDROP : ASSETS.MIRADOR_PUEBLO_CORDILLERA;
  const closingTataMessage =
    'Felicidades y gracias por resguardar la memoria de nuestro pueblo, te esperamos en Peñas para celebrar.';

  const totalTraitPoints = Math.max(
    1,
    Object.values(progress.traitScores).reduce((sum, val) => sum + val, 0)
  );

  const handleSelectCelebration = (poseId: CelebrationPose) => {
    soundEngine.playTileSwap();
    setCelebrationPose(poseId);
    setCelebrationBurstKey((k) => k + 1);
  };

  const handleRevealDiscovery = () => {
    soundEngine.playRelicUnlock();
    tataVoice.stop();
    setRevealedDiscovery(true);
  };

  const handleDownloadVoucher = () => {
    soundEngine.playRelicUnlock();
    setTrophyBurstKey((k) => k + 1);
    void downloadCommunityVoucher(progress);
    setVoucherDownloaded(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#081523] via-[#0F2C4C] to-[#0B1D2E] text-[#F5F1E8] px-4 sm:px-8 py-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          {revealedDiscovery ? (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setRevealedDiscovery(false);
              }}
              className="inline-flex items-center gap-2 min-h-[40px] px-3.5 py-2 rounded-xl bg-[#112436]/90 hover:bg-[#19354F] border border-[#D9A05B]/40 text-xs sm:text-sm font-semibold text-[#FFD166] cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a celebrar con mi avatar</span>
            </button>
          ) : (
            <div />
          )}
          <AudioControl compact />
        </div>

        {/* ================================================================
            PAGE 1: GUARDIÁN DE PEÑAS + LARGE AVATAR CELEBRATION STAGE
            ================================================================ */}
        {!revealedDiscovery ? (
          <div className="space-y-6 animate-toast-reveal">
            {/* Hero Rank Banner */}
            <header className="relative overflow-hidden rounded-2xl border-2 border-[#F5B700] bg-gradient-to-br from-[#2C1D0E] via-[#1B3B2B] to-[#0F2C4C] p-6 sm:p-8 shadow-2xl">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-relic-shimmer"
              />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <ChakanaLogoSvg className="w-10 h-10 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold tracking-wide text-[#FFD166]">
                      {vt.headerKicker}
                    </span>
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#FFF8E7] [text-wrap:balance]">
                    {travelerName}, eres {rankTitle}
                  </h1>
                  <p className="text-base sm:text-lg text-[#E2DDD2] leading-relaxed">
                    {badgeDescription}
                  </p>
                </div>

                <div className="bg-[#081523]/80 border border-[#F5B700]/55 rounded-xl px-5 py-4 text-center shrink-0">
                  <Award className="w-9 h-9 text-[#F5B700] mx-auto mb-1" />
                  <div className="text-xs sm:text-sm text-[#A3B1BF]">Aciertos al 1er intento</div>
                  <div className="font-mono-num text-2xl font-bold text-[#FFF8E7]">
                    {progress.firstTryWins.length}/7
                  </div>
                </div>
              </div>
            </header>

            {/* LARGE CUSTOMIZED AVATAR CELEBRATION STAGE */}
            <section className="relative overflow-hidden rounded-3xl border-2 border-[#D9A05B]/60 bg-gradient-to-b from-[#0E253B] via-[#13322A] to-[#091726] px-5 py-7 sm:p-8 text-center shadow-2xl space-y-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F5B700]/15 border border-[#F5B700]/45 text-xs sm:text-sm font-bold text-[#FFD166]">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5B700]" />
                  <span>Celebración de Victoria</span>
                </div>
                <p className="text-sm sm:text-base font-medium text-[#D8D3C8]">
                  Elige cómo celebrar
                </p>
              </div>

              {/* 4 Celebration Pose Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto">
                {CELEBRATION_OPTIONS.map((opt) => {
                  const isActive = celebrationPose === opt.id;
                  const Icon = opt.Icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectCelebration(opt.id)}
                      className={`min-h-[48px] px-3 py-2.5 rounded-xl border-2 text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                        isActive
                          ? 'bg-[#F5B700] border-[#FFF8E7] text-[#1A1207] shadow-[0_6px_20px_rgba(245,183,0,0.35)]'
                          : 'bg-[#081523]/90 hover:bg-[#17334E] border-[#D9A05B]/40 text-[#FFF8E7]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Large Full-Body Avatar Showcase */}
              <div className="relative flex flex-col items-center justify-center py-2">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[radial-gradient(circle,rgba(245,183,0,0.22)_0%,transparent_68%)]"
                />
                <GoldenParticlesBurst burstKey={celebrationBurstKey} density="rich" />
                <div className="relative z-10">
                  <AymaraFullBodyAvatar
                    config={progress.avatar}
                    pose={celebrationPose}
                    className="w-40 h-60 sm:w-48 sm:h-72 drop-shadow-[0_18px_32px_rgba(0,0,0,0.75)]"
                    label={`Avatar de ${travelerName} celebrando`}
                  />
                </div>
              </div>
            </section>

            {/* Tata's Closing Voice Message */}
            <NarratorDock
              playerAvatar={progress.avatar}
              playerName={travelerName}
              speakerTitle={gameTexts.stageModal.tataSpeakerTitle}
              message={`¡Jallalla (¡Viva!), ${travelerName}! ${vt.narratorClosing}`}
            />

            {/* Bottom Callout + Continue Button */}
            <section className="relative overflow-hidden rounded-2xl border-2 border-[#F5B700]/75 bg-gradient-to-br from-[#192F45] via-[#14372B] to-[#2B1D0E] p-6 sm:p-8 text-center shadow-2xl space-y-4">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-[#FFD166]/15 to-transparent animate-relic-shimmer"
              />
              <p className="relative z-10 text-base sm:text-lg font-medium text-[#FFF8E7] max-w-2xl mx-auto leading-relaxed">
                Para completar tu victoria, descubre qué tipo de viajero eres y descarga tu guía de viaje personalizada en Peñas.
              </p>
              <div className="relative z-10 flex justify-center">
                <button
                  type="button"
                  onClick={handleRevealDiscovery}
                  className="min-h-[58px] w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F5B700] via-[#FFD166] to-[#F5B700] hover:brightness-105 text-[#1A1207] font-display font-bold text-base tracking-wide inline-flex items-center justify-center gap-3 cursor-pointer shadow-[0_12px_36px_rgba(245,183,0,0.4)] transition-transform active:scale-[0.98]"
                >
                  <span>Continuar para ser Guardián de Peñas</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </button>
              </div>
            </section>
          </div>
        ) : (
          /* ================================================================
             PAGE 2: 1) COMMUNITY TROPHY PRIZE  2) TRAVELER TYPE + INSTAGRAM POSTCARD  3) TRAVEL GUIDE
             ================================================================ */
          <div className="space-y-6 animate-toast-reveal">
            {/* 1. FIRST: LARGER COMMUNITY TROPHY PRIZE */}
            <section className="relative overflow-hidden rounded-2xl border-2 border-[#F5B700]/85 min-h-[340px] sm:min-h-[400px] flex items-center justify-center p-6 sm:p-8 shadow-2xl">
              <img
                src={plazaBgUrl}
                alt="Plaza Principal de Peñas y monumento a Túpac Katari"
                referrerPolicy="no-referrer"
                onError={() => setPlazaError(true)}
                className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
              />
              <div className="pointer-events-none absolute inset-0 bg-[#07131E]/75" />

              <div className="relative z-10 w-full max-w-xl flex flex-col items-center justify-center text-center">
                {!voucherDownloaded ? (
                  <div className="relative w-full flex flex-col items-center">
                    {trophyBurstKey > 0 && (
                      <GoldenParticlesBurst burstKey={trophyBurstKey} density="rich" />
                    )}
                    <button
                      type="button"
                      onClick={handleDownloadVoucher}
                      className="group relative overflow-hidden w-full max-w-lg flex flex-col items-center justify-center gap-3.5 px-6 sm:px-8 py-7 sm:py-8 rounded-3xl bg-[#081523]/90 hover:bg-[#0B1D2E]/96 border-2 border-[#F5B700] shadow-[0_20px_54px_rgba(245,183,0,0.48)] cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-[#FEF08A]/20 to-transparent animate-relic-shimmer"
                      />

                      <div className="relative z-10 space-y-1.5 max-w-md">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F5B700]/18 border border-[#F5B700]/55 text-xs sm:text-sm font-bold tracking-wide uppercase text-[#FFD166]">
                          <Sparkles className="w-4 h-4 text-[#F5B700]" />
                          <span>Regalo sorpresa de la comunidad</span>
                        </div>
                        <p className="text-base sm:text-lg font-semibold text-[#FFF8E7] leading-snug">
                          Toca el trofeo para descargarlo y descubrir el regalo de Peñas para ti.
                        </p>
                      </div>

                      <div className="relative z-10 flex items-center justify-center py-1">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.34)_0%,transparent_70%)] animate-pulse"
                        />
                        <AymaraFullBodyAvatar
                          config={progress.avatar}
                          pose="trophy"
                          className="w-48 h-72 sm:w-56 sm:h-84 drop-shadow-[0_14px_30px_rgba(245,183,0,0.45)] group-hover:scale-105 transition-transform"
                          label={`Avatar de ${travelerName} sosteniendo el gran trofeo brillante de Peñas`}
                        />
                      </div>

                      <span className="relative z-10 px-6 py-3 rounded-xl bg-[#F5B700] group-hover:bg-[#FFD166] text-[#1A1207] font-display text-base sm:text-lg font-bold shadow-lg inline-flex items-center gap-2">
                        <Download className="w-5 h-5 shrink-0" />
                        <span>Tocar trofeo y descargar regalo</span>
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full rounded-2xl bg-[#081523]/92 border-2 border-[#F5B700] p-4 sm:p-5 space-y-4 shadow-2xl animate-toast-reveal">
                    <GoldenParticlesBurst burstKey={trophyBurstKey} density="rich" />

                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-left">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#52B788]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>¡Sorpresa revelada y vale descargado!</span>
                        </div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-[#FFD166]">
                          Premio de Hospedaje en Peñas · Casona Don Ranulfo
                        </h3>
                      </div>

                      <span className="px-3 py-1 rounded-lg bg-[#1D4E89] border border-[#7DD3FC]/45 font-mono-num text-xs sm:text-sm font-bold text-[#FFF8E7]">
                        {progress.voucherCode}
                      </span>
                    </div>

                    {!voucherImgError ? (
                      <div className="relative z-10 overflow-hidden rounded-xl border border-[#D9A05B]/55 bg-[#4F2D19] shadow-lg">
                        <img
                          src={COMMUNITY_VOUCHER_IMAGE}
                          alt="Vale por 1 noche con 10% de descuento en habitación privada — Casona Don Ranulfo"
                          referrerPolicy="no-referrer"
                          onError={() => setVoucherImgError(true)}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    ) : (
                      <div className="relative z-10 rounded-xl bg-[#4F2D19] border border-[#D9A05B] p-5 text-center space-y-1">
                        <div className="font-display text-xl font-bold text-[#FFF8E7]">
                          VALE POR: 1 NOCHE · 10% DESCUENTO
                        </div>
                        <div className="text-base font-semibold text-[#FFD166]">
                          Habitación Privada · Casona Don Ranulfo
                        </div>
                        <div className="text-sm text-[#E2DDD2]">
                          Sujeto a disponibilidad · Confirmación anticipada: +591 69711917
                        </div>
                      </div>
                    )}

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <p className="text-sm text-[#D8D3C8] text-left">
                        Presenta el vale descargado junto a tu código{' '}
                        <strong className="text-[#FFD166]">{progress.voucherCode}</strong> y confirma tu estadía al{' '}
                        <strong className="text-[#FFF8E7]">+591 69711917</strong>.
                      </p>

                      <button
                        type="button"
                        onClick={handleDownloadVoucher}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-sm whitespace-nowrap cursor-pointer shrink-0 shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span>Descargar de nuevo</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 2. SECOND: TRAVELER TYPE + AFFINITY ON SAME PHOTO BACKDROP + INSTAGRAM SHARE */}
            <section className="rounded-2xl border border-[#4EA8DE]/45 bg-[#0D2134] overflow-hidden shadow-xl">
              {/* Real Peñas Photo Backdrop with Traveler Type (Left) + Exploration Affinity (Right) */}
              <div className="relative w-full overflow-hidden bg-[#081523] p-5 sm:p-6">
                <img
                  src={backdropUrl}
                  alt={showcase.photoCaption}
                  referrerPolicy="no-referrer"
                  onError={() => setPhotoError(true)}
                  className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D2134] via-[#081523]/65 to-[#081523]/40" />

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Left: Intro Kicker + Avatar + Large Traveler Type */}
                  <div className="md:col-span-7 flex flex-col justify-between gap-4">
                    <div>
                      <p className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#081523]/88 border border-[#F5B700]/45 text-sm sm:text-base font-semibold text-[#FFF8E7] leading-snug shadow">
                        <Compass className="w-4 h-4 text-[#F5B700] shrink-0" />
                        <span>Según tus preferencias durante la travesía, hemos descubierto que eres:</span>
                      </p>
                    </div>

                    <div className="flex items-end gap-4 pt-1">
                      <div className="relative shrink-0">
                        <GoldenParticlesBurst burstKey="traveler-reveal" density="rich" />
                        <div className="relative z-10 animate-medal-reveal drop-shadow-[0_12px_24px_rgba(0,0,0,0.75)]">
                          <AymaraFullBodyAvatar
                            config={progress.avatar}
                            pose="cheer"
                            travelerBadge={profile.trait}
                            className="w-28 h-42 sm:w-32 sm:h-48"
                            label={`Avatar en cuerpo completo de ${travelerName} como ${profile.title}`}
                          />
                        </div>
                      </div>

                      <div className="pb-2 min-w-0">
                        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FFD166] leading-tight [text-wrap:balance] drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
                          {profile.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Right (same backdrop space): Exploration Affinity */}
                  <div className="md:col-span-5">
                    <div className="space-y-3 bg-[#081523]/86 border border-white/15 rounded-xl p-4 shadow-xl">
                      <div className="text-xs sm:text-sm font-semibold text-[#D9A05B]">
                        Afinidad de Exploración
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-2.5">
                        {(Object.keys(TRAIT_LABELS) as TravelerTrait[]).map((trait) => {
                          const count = progress.traitScores[trait] || 0;
                          const pct = Math.round((count / totalTraitPoints) * 100);
                          return (
                            <div key={trait} className="space-y-1">
                              <div className="flex justify-between gap-2 text-xs sm:text-sm text-[#E2DDD2]">
                                <span className="truncate">
                                  {gameTexts.travelerProfiles[trait]?.title || TRAIT_LABELS[trait].name}
                                </span>
                                <span className="font-mono-num shrink-0">{pct}%</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-[#17334E] overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${TRAIT_LABELS[trait].color}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Strip: Short General Description + Instagram Share CTA */}
              <div className="p-5 sm:px-6 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/10">
                <p className="text-base sm:text-lg text-[#FFF8E7] leading-relaxed max-w-2xl">
                  {TRAIT_GENERAL_DESCRIPTIONS[profile.trait]}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    onOpenStoryPostcard();
                  }}
                  className="w-full md:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1D4E89] hover:bg-[#2563EB] border border-[#4EA8DE]/50 text-[#FFF8E7] font-bold text-sm sm:text-base whitespace-nowrap cursor-pointer transition-colors shadow-lg shrink-0"
                >
                  <Instagram className="w-4 h-4 text-[#FFD166] shrink-0" />
                  <span>Compartir en Instagram</span>
                </button>
              </div>
            </section>

            {/* 3. THIRD (END): INTERACTIVE 3D TRAVEL GUIDE TO VISIT PEÑAS */}
            <section className="rounded-2xl border-2 border-[#52B788]/70 bg-gradient-to-br from-[#112A3E] via-[#133A31] to-[#0D2134] p-5 sm:p-8 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  downloadTouristGuide(stages, progress, gameTexts.travelerProfiles);
                }}
                className="group relative overflow-hidden w-full flex flex-col items-center justify-center gap-3 text-center rounded-2xl bg-[#081523]/65 hover:bg-[#0B1D2E]/85 border border-[#74C69D]/45 px-5 py-6 sm:py-7 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.98] shadow-[0_14px_34px_rgba(82,183,136,0.22)]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-[#74C69D]/15 to-transparent animate-relic-shimmer"
                />

                <h3 className="relative z-10 font-display text-2xl sm:text-3xl font-bold text-[#FFF8E7] leading-snug">
                  Guía de Viaje en Peñas
                </h3>

                <div className="relative z-10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <TravelGuide3DIcon />
                </div>

                <span className="relative z-10 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2D6A4F] via-[#3A8463] to-[#2D6A4F] group-hover:brightness-110 border border-[#74C69D]/70 text-[#FFF8E7] font-display font-bold text-sm sm:text-base shadow-lg">
                  <Download className="w-5 h-5 shrink-0" />
                  <span>Toca para descargar y poder visitar Peñas</span>
                </span>
              </button>
            </section>

            {/* 4. FOURTH (VERY BOTTOM): TATA CLOSING MESSAGE OVER PEÑAS SCENIC PHOTO */}
            <section className="relative overflow-hidden rounded-2xl border-2 border-[#F5B700]/65 bg-[#081523] shadow-2xl">
              <img
                src={closingBgUrl}
                alt="Vista panorámica de Peñas y la Cordillera Real"
                referrerPolicy="no-referrer"
                onError={() => setClosingBgError(true)}
                className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06111D]/90 via-[#081523]/55 to-[#081523]/40" />

              <div className="relative z-10 p-5 sm:p-7 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                <div
                  className={`shrink-0 ${
                    isClosingSpeaking ? 'animate-tata-talk' : 'animate-tata-idle'
                  }`}
                >
                  <TataCutoutCharacter
                    talking={isClosingSpeaking}
                    className="w-28 h-32 sm:w-32 sm:h-36 drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
                    label={gameTexts.stageModal.tataSpeakerTitle}
                  />
                </div>

                <div className="flex-1 w-full rounded-2xl border border-[#F5B700]/45 bg-[#071422]/82 backdrop-blur-md p-4 sm:p-5 shadow-xl space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold tracking-wide text-[#F5B700]">
                      {gameTexts.stageModal.tataSpeakerTitle}
                    </span>
                    {tataVoice.isSupported() && (
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          if (isClosingSpeaking) {
                            tataVoice.stop();
                          } else {
                            tataVoice.speak(closingTataMessage, { forceUnmute: true });
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 min-h-[32px] text-xs font-bold transition-colors cursor-pointer ${
                          isClosingSpeaking
                            ? 'border-amber-400 bg-amber-400/25 text-amber-200'
                            : 'border-white/20 bg-slate-900/85 hover:bg-slate-800 text-amber-300'
                        }`}
                      >
                        {isClosingSpeaking ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>Detener</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Escuchar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <p className="font-display text-base sm:text-xl font-bold text-[#FFF8E7] leading-relaxed">
                    “{closingTataMessage}”
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onBackToMap();
            }}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#17334E] hover:bg-[#234B70] text-[#FFF8E7] text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors"
          >
            <Map className="w-4 h-4 text-[#4EA8DE]" />
            Volver al Mapa
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onPlayAgain();
            }}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D2134] hover:bg-[#17334E] text-[#D8D3C8] border border-white/15 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Jugar de Nuevo
          </button>
        </div>
      </div>
    </div>
  );
};
