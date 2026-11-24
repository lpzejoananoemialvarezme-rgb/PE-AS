import React, { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  Download,
  Instagram,
  Map,
  RotateCcw,
  Compass,
  Sparkles,
  CheckCircle2
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
import { AymaraAvatar } from './AymaraAvatar';
import { AudioControl } from './AudioControl';
import { GoldenParticlesBurst } from './GoldenParticlesBurst';
import { soundEngine } from '../utils/sound';

interface VictoryScreenProps {
  stages: StageData[];
  progress: PlayerProgress;
  gameTexts?: GameTexts;
  onBackToMap: () => void;
  onPlayAgain: () => void;
  onOpenStoryPostcard: () => void;
}

const TRAIT_LABELS: Record<TravelerTrait, { name: string; color: string }> = {
  cultural: { name: 'Turista Cultural', color: 'bg-[#D9A05B]' },
  aventurero: { name: 'Aventurero de Altura', color: 'bg-[#4EA8DE]' },
  naturaleza: { name: 'Explorador de Naturaleza', color: 'bg-[#52B788]' },
  comunitario: { name: 'Viajero Comunitario', color: 'bg-[#F5B700]' }
};

const TRAIT_SHOWCASE: Record<
  TravelerTrait,
  {
    photoUrl: string;
    fallbackUrl: string;
    photoCaption: string;
    hatLabel: string;
  }
> = {
  cultural: {
    photoUrl: ASSETS.PLAZA_KATARI,
    fallbackUrl: ASSETS.CHURCH_INTERIOR,
    photoCaption: 'Plaza Principal de Peñas y monumento a Túpac Katari',
    hatLabel: 'Sombrero Ceremonial y Chakana de Amauta'
  },
  aventurero: {
    photoUrl: ASSETS.CASTILLO_CORDILLERA,
    fallbackUrl: ASSETS.CLIFFS_GROTTO,
    photoCaption: 'Castillo del Búho y cumbres nevadas de la Cordillera Real',
    hatLabel: 'Sombrero Explorador de Altura y Cumbres'
  },
  naturaleza: {
    photoUrl: ASSETS.MURAL_PACHAMAMA,
    fallbackUrl: ASSETS.TITLE_BACKDROP,
    photoCaption: 'Mural de la Pachamama, dientes de león y senderos del Altiplano',
    hatLabel: 'Sombrero Botánico con Hoja de Pachamama'
  },
  comunitario: {
    photoUrl: ASSETS.MURALES_CAFETERIA,
    fallbackUrl: ASSETS.ADVENTURE_PARK_BUS,
    photoCaption: 'Cafetería Virgen de la Natividad, murales y artesanías de Peñas',
    hatLabel: 'Sombrero Festivo Anfitrión con Sol Andino'
  }
};

const AymaraTrophySvg: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="aymaraGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF3B0" />
        <stop offset="45%" stopColor="#F5B700" />
        <stop offset="100%" stopColor="#9E620C" />
      </linearGradient>
      <linearGradient id="aymaraBronze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8C5A2B" />
        <stop offset="100%" stopColor="#3D2312" />
      </linearGradient>
    </defs>

    {/* Sun Rays behind Trophy */}
    <path
      d="M48 4 V11 M28 9 L32 15 M68 9 L64 15 M15 22 L21 26 M81 22 L75 26"
      stroke="#FFD166"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Left & Right Stepped Condor Handles */}
    <path
      d="M27 24 H17 V34 H21 V42 H29"
      fill="none"
      stroke="url(#aymaraGold)"
      strokeWidth="4.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <path
      d="M69 24 H79 V34 H75 V42 H67"
      fill="none"
      stroke="url(#aymaraGold)"
      strokeWidth="4.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    />

    {/* Kero Ceremonial Cup */}
    <path
      d="M25 18 H71 L64 50 Q61 60 48 61 Q35 60 32 50 Z"
      fill="url(#aymaraGold)"
      stroke="#5C3608"
      strokeWidth="2"
    />

    {/* Woven Aguayo Band across Cup */}
    <path d="M27 25 H69 L68 32 H28 Z" fill="#8C3B2B" />
    <path
      d="M29 28.5 L35 26 L41 31 L48 26 L55 31 L61 26 L67 28.5"
      fill="none"
      stroke="#FFD166"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M29 33 H67 L66 37 H30 Z" fill="#1E4D3B" />
    <path d="M30 37 H66 L65 40 H31 Z" fill="#1D4E89" />

    {/* Center Chakana Crest on Cup */}
    <path
      d="M45.5 43 H50.5 V45.5 H53 V50.5 H50.5 V53 H45.5 V50.5 H43 V45.5 H45.5 Z"
      fill="#FFF8E7"
      stroke="#7B4824"
      strokeWidth="1.2"
    />

    {/* Stem & Terraced Stepped Andean Base */}
    <rect x="43" y="60" width="10" height="11" fill="url(#aymaraGold)" stroke="#5C3608" strokeWidth="1.6" />
    <path
      d="M32 71 H64 L68 78 H28 Z"
      fill="url(#aymaraBronze)"
      stroke="#F5B700"
      strokeWidth="1.8"
    />
    <path
      d="M24 78 H72 L75 87 H21 Z"
      fill="#1E4D3B"
      stroke="#F5B700"
      strokeWidth="2"
    />
    <polygon points="48,79.5 52,82.5 48,85.5 44,82.5" fill="#FFD166" />
    <polygon points="35,80.5 38,82.5 35,84.5 32,82.5" fill="#D9A05B" />
    <polygon points="61,80.5 64,82.5 61,84.5 58,82.5" fill="#D9A05B" />
  </svg>
);

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  stages,
  progress,
  gameTexts = DEFAULT_GAME_TEXTS,
  onBackToMap,
  onPlayAgain,
  onOpenStoryPostcard
}) => {
  const [revealedDiscovery, setRevealedDiscovery] = useState(false);
  const [voucherDownloaded, setVoucherDownloaded] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [plazaError, setPlazaError] = useState(false);
  const [voucherImgError, setVoucherImgError] = useState(false);
  const [trophyBurstKey, setTrophyBurstKey] = useState(0);

  // Switch exclusively to the epic victory score while on this final screen
  useEffect(() => {
    soundEngine.setVictoryMode(true);
    if (!soundEngine.isMuted() && !soundEngine.isMusicPlaying()) {
      soundEngine.startMusic();
    }
    return () => {
      soundEngine.setVictoryMode(false);
    };
  }, []);

  const vt = gameTexts.victoryScreen;
  const { rankTitle, badgeDescription } = getPlayerRank(progress);
  const profile = getDominantTravelerProfile(progress.traitScores, gameTexts.travelerProfiles);
  const travelerName = progress.playerName.trim() || 'Viajero de Peñas';

  const showcase = TRAIT_SHOWCASE[profile.trait];
  const backdropUrl = photoError ? showcase.fallbackUrl : showcase.photoUrl;
  const plazaBgUrl = plazaError
    ? ASSETS.MURALES_CAFETERIA
    : ASSETS.PLAZA_KATARI;

  const totalTraitPoints = Math.max(
    1,
    Object.values(progress.traitScores).reduce((sum, val) => sum + val, 0)
  );

  const handleRevealDiscovery = () => {
    soundEngine.playRelicUnlock();
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
        <div className="flex justify-end">
          <AudioControl compact />
        </div>

        {/* Hero Rank Banner: "Eres Guardián de Peñas" */}
        <header className="relative overflow-hidden rounded-2xl border-2 border-[#F5B700] bg-gradient-to-br from-[#2C1D0E] via-[#1B3B2B] to-[#0F2C4C] p-6 sm:p-8 shadow-2xl">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-relic-shimmer"
          />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex items-center gap-3">
                <ChakanaLogoSvg className="w-10 h-10 shrink-0" />
                <span className="text-xs font-bold tracking-wide text-[#FFD166]">
                  {vt.headerKicker}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#FFF8E7] [text-wrap:balance]">
                {travelerName}, eres {rankTitle}
              </h1>
              <p className="text-sm sm:text-base text-[#E2DDD2] leading-relaxed">{badgeDescription}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <AymaraAvatar
                config={progress.avatar}
                className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-xl"
                label={`Avatar de ${travelerName}`}
              />
              <div className="bg-[#081523]/80 border border-[#F5B700]/55 rounded-xl px-5 py-4 text-center">
                <Award className="w-9 h-9 text-[#F5B700] mx-auto mb-1" />
                <div className="text-xs text-[#A3B1BF]">Aciertos al 1er intento</div>
                <div className="font-mono-num text-2xl font-bold text-[#FFF8E7]">
                  {progress.firstTryWins.length}/7
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Narrator Closing Message */}
        <NarratorDock
          playerAvatar={progress.avatar}
          playerName={travelerName}
          speakerTitle={gameTexts.stageModal.tataSpeakerTitle}
          message={`¡Jallalla, ${travelerName}! ${vt.narratorClosing}`}
        />

        {/* STEP 1 GATE BUTTON -> Reveals the 2 options when clicked */}
        {!revealedDiscovery ? (
          <section className="relative overflow-hidden rounded-2xl border-2 border-[#F5B700]/70 bg-gradient-to-br from-[#192F45] via-[#14372B] to-[#2B1D0E] p-6 sm:p-10 text-center shadow-2xl">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-[#FFD166]/15 to-transparent animate-relic-shimmer"
            />
            <div className="relative z-10 flex justify-center">
              <button
                type="button"
                onClick={handleRevealDiscovery}
                className="relative overflow-hidden min-h-[58px] max-w-2xl w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-[#F5B700] via-[#FFD166] to-[#F5B700] hover:brightness-105 text-[#1A1207] font-display font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-3 cursor-pointer shadow-[0_12px_36px_rgba(245,183,0,0.35)] transition-transform active:scale-[0.99]"
              >
                <Compass className="w-5 h-5 shrink-0" />
                <span className="[text-wrap:balance]">{vt.revealButtonText}</span>
                <Sparkles className="w-5 h-5 shrink-0" />
              </button>
            </div>
          </section>
        ) : (
          <div className="space-y-6 animate-toast-reveal">
            {/* THE TWO REVEALED OPTIONS */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* OPTION 1: Traveler Type + Avatar wearing Traveler Hat/Badge on Peñas Real Photo */}
              <div className="lg:col-span-7 rounded-2xl border border-[#4EA8DE]/45 bg-[#0D2134] overflow-hidden flex flex-col shadow-xl">
                {/* Real Peñas Photo Backdrop with Avatar + Traveler Hat */}
                <div className="relative min-h-[17.5rem] sm:min-h-[19rem] w-full overflow-hidden bg-[#081523] flex flex-col justify-between p-4 sm:p-6 gap-6">
                  <img
                    src={backdropUrl}
                    alt={showcase.photoCaption}
                    referrerPolicy="no-referrer"
                    onError={() => setPhotoError(true)}
                    className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D2134] via-[#081523]/55 to-[#081523]/30" />

                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#081523]/85 border border-[#F5B700]/45 text-[11px] font-bold text-[#FFD166]">
                      <Compass className="w-3.5 h-3.5" />
                      Opción 1 · Tu Tipo de Viajero
                    </span>
                    <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-[#081523]/80 text-[11px] text-[#E2DDD2] truncate max-w-[55%]">
                      {showcase.photoCaption}
                    </span>
                  </div>

                  {/* Avatar wearing signature Traveler Hat & Badge framed on the Peñas landscape */}
                  <div className="relative z-10 flex items-end gap-3 sm:gap-5 pt-4">
                    <div className="relative shrink-0">
                      <GoldenParticlesBurst burstKey="traveler-reveal" density="rich" />
                      <div className="relative z-10 animate-medal-reveal drop-shadow-[0_12px_24px_rgba(0,0,0,0.75)]">
                        <AymaraAvatar
                          config={progress.avatar}
                          showBackdrop={false}
                          travelerBadge={profile.trait}
                          className="w-24 h-24 sm:w-36 sm:h-36"
                          label={`Avatar de ${travelerName} con distintivo de ${profile.title}`}
                        />
                      </div>
                    </div>

                    <div className="pb-1 min-w-0 space-y-1">
                      <div className="text-[11px] sm:text-xs font-semibold text-[#52B788]">
                        {showcase.hatLabel}
                      </div>
                      <h2 className="font-display text-xl sm:text-3xl font-bold text-[#FFF8E7] leading-tight [text-wrap:balance]">
                        {profile.title}
                      </h2>
                      <div className="text-xs sm:text-sm font-semibold text-[#F5B700]">
                        {profile.subtitle}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traveler Details + Affinity Bars */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <p className="text-sm text-[#D8D3C8] leading-relaxed">{profile.description}</p>
                    <p className="text-sm text-[#FFF8E7] bg-[#112A3E] border border-[#2D6A4F]/50 rounded-xl p-3.5">
                      <strong className="text-[#F5B700]">Ruta sugerida en Peñas: </strong>
                      {profile.recommendation}
                    </p>
                  </div>

                  <div className="space-y-2.5 bg-[#081523] border border-white/10 rounded-xl p-4">
                    <div className="text-xs font-semibold text-[#D9A05B]">Afinidad de Exploración</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {(Object.keys(TRAIT_LABELS) as TravelerTrait[]).map((trait) => {
                        const count = progress.traitScores[trait] || 0;
                        const pct = Math.round((count / totalTraitPoints) * 100);
                        return (
                          <div key={trait} className="space-y-1">
                            <div className="flex justify-between text-xs text-[#E2DDD2]">
                              <span>{gameTexts.travelerProfiles[trait]?.title || TRAIT_LABELS[trait].name}</span>
                              <span className="font-mono-num">{pct}%</span>
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

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      onOpenStoryPostcard();
                    }}
                    className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1D4E89] hover:bg-[#2563EB] border border-[#4EA8DE]/50 text-[#FFF8E7] font-bold text-sm cursor-pointer transition-colors shadow-lg"
                  >
                    <Instagram className="w-4 h-4 text-[#FFD166] shrink-0" />
                    <span>Crear Postal para Historia de Instagram</span>
                  </button>
                </div>
              </div>

              {/* OPTION 2: Travel Guide to Explore Peñas */}
              <div className="lg:col-span-5 rounded-2xl border border-[#52B788]/50 bg-[#112A3E] p-6 flex flex-col justify-between gap-6 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#52B788]">
                    <BookOpen className="w-4 h-4" />
                    <span>{vt.guideSectionLabel}</span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#FFF8E7] leading-snug">
                    {vt.guideTitle}
                  </h3>

                  <p className="text-sm sm:text-base text-[#E2DDD2] leading-relaxed">
                    {vt.guideDescription}
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      downloadTouristGuide(stages, progress, gameTexts.travelerProfiles);
                    }}
                    className="w-full min-h-[54px] inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#2D6A4F] hover:bg-[#3A8463] border border-[#74C69D]/40 text-[#FFF8E7] font-bold text-sm sm:text-base cursor-pointer transition-colors shadow-lg"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    <span>{vt.guideButtonText}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* GRAND FINALE: Surprise Community Reward Trophy -> Reveals Community Lodging Voucher upon download */}
            <section className="relative overflow-hidden rounded-2xl border-2 border-[#F5B700]/80 min-h-[280px] sm:min-h-[340px] flex items-center justify-center p-6 shadow-2xl">
              <img
                src={plazaBgUrl}
                alt="Plaza Principal de Peñas y monumento a Túpac Katari"
                referrerPolicy="no-referrer"
                onError={() => setPlazaError(true)}
                className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
              />
              <div className="pointer-events-none absolute inset-0 bg-[#07131E]/70" />

              <div className="relative z-10 w-full max-w-xl flex flex-col items-center justify-center text-center">
                {!voucherDownloaded ? (
                  <div className="relative">
                    {trophyBurstKey > 0 && (
                      <GoldenParticlesBurst burstKey={trophyBurstKey} density="rich" />
                    )}
                    <button
                      type="button"
                      onClick={handleDownloadVoucher}
                      className="group relative flex flex-col items-center justify-center gap-3 px-7 py-6 rounded-2xl bg-[#081523]/85 hover:bg-[#0B1D2E]/95 border-2 border-[#F5B700] shadow-[0_14px_42px_rgba(245,183,0,0.4)] cursor-pointer transition-transform hover:scale-[1.03] active:scale-[0.98]"
                    >
                      <span className="text-[11px] font-bold tracking-wider uppercase text-[#52B788]">
                        {vt.surpriseBadge}
                      </span>
                      <AymaraTrophySvg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_0_24px_rgba(245,183,0,0.55)]" />
                      <span className="font-display text-sm sm:text-base font-bold text-[#FFD166]">
                        {vt.surpriseButtonText}
                      </span>
                      <span className="text-xs text-[#D8D3C8] max-w-sm">
                        {vt.surpriseHint}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full rounded-2xl bg-[#081523]/92 border-2 border-[#F5B700] p-4 sm:p-5 space-y-4 shadow-2xl animate-toast-reveal">
                    <GoldenParticlesBurst burstKey={trophyBurstKey} density="rich" />

                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-left">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#52B788]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>¡Sorpresa revelada y vale descargado!</span>
                        </div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-[#FFD166]">
                          Premio de Hospedaje en Peñas · Casona Don Ranulfo
                        </h3>
                      </div>

                      <span className="px-3 py-1 rounded-lg bg-[#1D4E89] border border-[#7DD3FC]/45 font-mono-num text-xs font-bold text-[#FFF8E7]">
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
                        <div className="text-sm font-semibold text-[#FFD166]">
                          Habitación Privada · Casona Don Ranulfo
                        </div>
                        <div className="text-xs text-[#E2DDD2]">
                          Sujeto a disponibilidad · Confirmación anticipada: +591 69711917
                        </div>
                      </div>
                    )}

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <p className="text-xs text-[#D8D3C8] text-left">
                        Presenta el vale descargado junto a tu código{' '}
                        <strong className="text-[#FFD166]">{progress.voucherCode}</strong> y confirma tu estadía al{' '}
                        <strong className="text-[#FFF8E7]">+591 69711917</strong>.
                      </p>

                      <button
                        type="button"
                        onClick={handleDownloadVoucher}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-xs sm:text-sm whitespace-nowrap cursor-pointer shrink-0 shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span>Descargar de nuevo</span>
                      </button>
                    </div>
                  </div>
                )}
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
