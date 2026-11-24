import React, { useEffect, useState } from 'react';
import { Play, MapPin, Award, ShieldCheck, UserCog, Compass } from 'lucide-react';
import { ASSETS, DEFAULT_GAME_TEXTS } from '../data/defaultStages';
import { AvatarConfig, GameTexts } from '../types/game';
import { ChakanaLogoSvg } from './RelicIcon';
import { NarratorDock } from './NarratorDock';
import { AymaraAvatar } from './AymaraAvatar';
import { AudioControl } from './AudioControl';

interface TitleScreenProps {
  playerName: string;
  avatarConfig: AvatarConfig;
  gameTexts?: GameTexts;
  onChangeName: (name: string) => void;
  hasSavedProgress: boolean;
  completedCount: number;
  unlockedMedalsCount: number;
  onStart: () => void;
  onResume: () => void;
  onOpenAvatarCreator: () => void;
  onOpenProfile: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  playerName,
  avatarConfig,
  gameTexts = DEFAULT_GAME_TEXTS,
  onChangeName,
  hasSavedProgress,
  completedCount,
  unlockedMedalsCount,
  onStart,
  onResume,
  onOpenAvatarCreator,
  onOpenProfile
}) => {
  const [bgError, setBgError] = useState(false);
  const t = gameTexts.titleScreen;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (hasSavedProgress) onResume();
          else onStart();
        }
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (hasSavedProgress) onResume();
        else onStart();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [hasSavedProgress, onResume, onStart]);

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full overflow-x-hidden bg-[#0B1D2E] flex flex-col">
      {/* Key-Art Backdrop */}
      {!bgError ? (
        <img
          src={ASSETS.TITLE_BACKDROP}
          alt="Paisaje de Peñas al amanecer en La Paz, Bolivia"
          decoding="async"
          fetchPriority="high"
          referrerPolicy="no-referrer"
          onError={() => setBgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1D2E] via-[#1E4D3B] to-[#6B4423]" />
      )}

      {/* Measured Scrim keeping text legible while letting the Andes backdrop breathe */}
      <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#06111D]/95 via-[#0B1D2E]/82 to-[#0B1D2E]/35" />

      {/* Clean Non-Overlapping Top Bar */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-10 pt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <ChakanaLogoSvg className="w-9 h-9 sm:w-11 sm:h-11 shrink-0" />
          <div className="text-xs sm:text-sm font-medium text-[#D9A05B] tracking-wide truncate">
            {t.locationTag}
          </div>
        </div>

        <AudioControl compact />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 flex-1 flex items-center w-full max-w-6xl mx-auto px-4 sm:px-10 py-6 sm:py-10">
        <div className="max-w-2xl w-full space-y-5">
          <div className="space-y-3">
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[52px] font-bold leading-[1.08] text-[#FFF8E7] [text-wrap:balance]">
              {t.gameTitle}
            </h1>

            <p className="text-sm sm:text-base text-[#E2DDD2] leading-relaxed max-w-xl">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Tata's Welcome */}
          <NarratorDock
            playerAvatar={avatarConfig}
            playerName={playerName}
            speakerTitle={gameTexts.stageModal.tataSpeakerTitle}
            message={t.tataWelcome}
          />

          {/* Player Name & Avatar */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <button
                type="button"
                onClick={onOpenAvatarCreator}
                className="group flex items-center gap-3 p-2 pr-4 rounded-xl bg-[#112436]/95 hover:bg-[#19354F] border border-[#D9A05B]/45 cursor-pointer transition-colors shrink-0 w-full sm:w-auto min-h-[52px]"
                title="Personalizar tu avatar aymara"
              >
                <AymaraAvatar config={avatarConfig} className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-[#F5B700] flex items-center gap-1">
                    <UserCog className="w-3.5 h-3.5" />
                    <span>Tu Avatar Aymara</span>
                  </div>
                  <div className="text-xs text-[#E2DDD2] group-hover:text-white">Toca para personalizar</div>
                </div>
              </button>

              <div className="flex-1 min-w-0">
                <label htmlFor="traveler-name" className="block text-xs font-semibold text-[#D9A05B] mb-1.5">
                  Tu nombre de viajero (opcional)
                </label>
                <input
                  id="traveler-name"
                  type="text"
                  maxLength={40}
                  value={playerName}
                  onChange={(e) => onChangeName(e.target.value)}
                  placeholder="Ej. Wayra Quispe"
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#081523]/90 border border-[#D9A05B]/45 text-[#FFF8E7] placeholder:text-[#8E9BA8] focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                />
              </div>
            </div>

            {/* Clean inline trail metadata (no reward spoilers) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-[#D8D3C8]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#52B788]" />7 Etapas en Peñas
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#4EA8DE]" />
                Historias y Mini-juegos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#F5B700]" />
                7 Reliquias del Guardián
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 pt-1">
              {hasSavedProgress ? (
                <>
                  <button
                    type="button"
                    onClick={onResume}
                    className="inline-flex items-center justify-center gap-2 px-6 min-h-[48px] rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-sm sm:text-base transition-transform duration-150 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {t.resumeButtonLabel} ({completedCount}/7)
                  </button>
                  <button
                    type="button"
                    onClick={onStart}
                    className="inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl bg-[#1E4D3B] hover:bg-[#2D6A4F] text-[#FFF8E7] font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer border border-[#52B788]/40"
                  >
                    {t.newGameButtonLabel}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onStart}
                  className="inline-flex items-center justify-center gap-2 px-7 min-h-[48px] rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-base transition-transform duration-150 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer shadow-lg"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {t.startButtonLabel}
                </button>
              )}

              <button
                type="button"
                onClick={onOpenProfile}
                className="inline-flex items-center justify-center gap-2 px-4 min-h-[44px] rounded-xl bg-[#112436]/90 hover:bg-[#19354F] text-[#FFF8E7] font-medium text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer border border-[#F5B700]/40"
              >
                <Award className="w-4 h-4 text-[#F5B700]" />
                <span>Perfil · {unlockedMedalsCount}/8</span>
              </button>
            </div>
          </div>

          <p className="hidden sm:block text-xs text-[#A3B1BF] pt-1">
            {t.footerHint}
          </p>
        </div>
      </div>
    </div>
  );
};
