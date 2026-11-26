import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { ASSETS, DEFAULT_GAME_TEXTS } from '../data/defaultStages';
import { AvatarConfig, GameTexts } from '../types/game';
import { ChakanaLogoSvg } from './RelicIcon';
import { NarratorDock } from './NarratorDock';
import { AymaraFullBodyAvatar } from './AymaraFullBodyAvatar';
import { LaPazPenasRouteMap } from './LaPazPenasRouteMap';
import { AudioControl } from './AudioControl';
import { tataVoice } from '../utils/tataVoice';

interface TitleScreenProps {
  playerName: string;
  avatarConfig: AvatarConfig;
  gameTexts?: GameTexts;
  onChangeName: (name: string) => void;
  onStart: () => void;
  onOpenAvatarCreator: () => void;
}

const TATA_HOME_INTRO =
  '¡Hola, viajero! Estás por conocer Peñas, un pueblo histórico a 60 km de La Paz y 4.000 m de altura. Para jugar, avanza por las 7 paradas del mapa superando sus desafíos para reunir las reliquias y convertirte en Guardián de la memoria de Peñas, además un premio sorpresa te espera al final. Personaliza tu avatar aquí abajo y empieza la aventura.';

export const TitleScreen: React.FC<TitleScreenProps> = ({
  playerName,
  avatarConfig,
  gameTexts = DEFAULT_GAME_TEXTS,
  onChangeName,
  onStart,
  onOpenAvatarCreator
}) => {
  const [bgError, setBgError] = useState(false);
  const t = gameTexts.titleScreen;

  useEffect(() => {
    return () => {
      tataVoice.stop();
    };
  }, []);

  const handleStartGame = () => {
    tataVoice.stop();
    onStart();
  };

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
      <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#06111D]/96 via-[#0B1D2E]/88 to-[#0B1D2E]/60" />

      {/* Clean Top Bar */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-10 pt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <ChakanaLogoSvg className="w-9 h-9 sm:w-11 sm:h-11 shrink-0" />
          <div className="text-xs sm:text-sm font-medium text-[#D9A05B] tracking-wide truncate">
            {t.locationTag}
          </div>
        </div>

        <AudioControl compact />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center w-full max-w-6xl mx-auto px-4 sm:px-10 py-4 sm:py-6">
        <div className="w-full space-y-4 sm:space-y-5">
          {/* Upper Row: Welcome Headline on Left + Small Location Map on Upper Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <h1 className="lg:col-span-7 xl:col-span-8 font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.1] text-[#FFF8E7] [text-wrap:balance]">
              Bienvenido a Peñas, un pueblo histórico que debes conocer
            </h1>

            <div className="lg:col-span-5 xl:col-span-4">
              <LaPazPenasRouteMap compact />
            </div>
          </div>

          {/* Tata Standing in the Animated Colorful Plaza Principal de Peñas */}
          <NarratorDock
            scene="plaza"
            playerAvatar={avatarConfig}
            playerName={playerName}
            speakerTitle={gameTexts.stageModal.tataSpeakerTitle}
            message={TATA_HOME_INTRO}
          />

          {/* Large Avatar Customize Button + Traveler Name Input */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            <button
              type="button"
              onClick={onOpenAvatarCreator}
              className="md:col-span-7 group flex items-center justify-center sm:justify-start gap-5 px-6 py-4 min-h-[126px] rounded-2xl bg-[#112436]/95 hover:bg-[#19354F] border-2 border-[#F5B700]/55 hover:border-[#FFD166] cursor-pointer transition-all duration-150 active:scale-[0.99] shadow-xl"
            >
              <div className="relative flex items-center justify-center shrink-0">
                <div className="absolute -bottom-1 w-16 h-3.5 rounded-full bg-amber-400/20 blur-sm" />
                <AymaraFullBodyAvatar
                  config={avatarConfig}
                  pose="idle"
                  className="w-20 h-28 sm:w-24 sm:h-32 drop-shadow-[0_10px_18px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-left text-lg sm:text-xl font-bold text-[#F5B700] group-hover:text-[#FFD166] leading-snug">
                Toca aquí para personalizar tu avatar
              </span>
            </button>

            <div className="md:col-span-5 flex flex-col justify-center rounded-2xl bg-[#081523]/88 border border-[#D9A05B]/40 p-5 shadow-lg">
              <label
                htmlFor="traveler-name"
                className="block text-sm sm:text-base font-semibold text-[#D9A05B] mb-2"
              >
                Escribe tu nombre de viajero
              </label>
              <input
                id="traveler-name"
                type="text"
                maxLength={40}
                value={playerName}
                onChange={(e) => onChangeName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleStartGame();
                  }
                }}
                placeholder="Ej. Wayra Quispe"
                className="w-full min-h-[50px] px-4 py-2.5 rounded-xl bg-[#0B1D2E]/95 border border-[#D9A05B]/50 text-[#FFF8E7] text-base placeholder:text-[#8E9BA8] focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
              />
            </div>
          </div>

          {/* Single Bottom Action Button */}
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={handleStartGame}
              className="inline-flex items-center justify-center gap-2.5 px-9 min-h-[54px] rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-base sm:text-lg transition-transform duration-150 active:scale-[0.98] whitespace-nowrap cursor-pointer shadow-[0_10px_30px_rgba(245,183,0,0.35)]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Empezar la travesía</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
