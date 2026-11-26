import React, { useEffect, useState } from 'react';
import { MapPin, Square, Volume2 } from 'lucide-react';
import { AvatarConfig } from '../types/game';
import { AymaraAvatar } from './AymaraAvatar';
import { TataCutoutCharacter } from './TataCutoutCharacter';
import { PlazaPrincipalBackdrop } from './PlazaPrincipalBackdrop';
import { tataVoice } from '../utils/tataVoice';
import { soundEngine } from '../utils/sound';

interface NarratorDockProps {
  message: string;
  speakerTitle?: string;
  compact?: boolean;
  scene?: 'default' | 'plaza';
  playerAvatar?: AvatarConfig;
  playerName?: string;
  actionSlot?: React.ReactNode;
  autoSpeak?: boolean;
}

export const NarratorDock: React.FC<NarratorDockProps> = ({
  message,
  speakerTitle = 'Tata',
  compact = false,
  scene = 'default',
  playerAvatar,
  playerName,
  actionSlot,
  autoSpeak = false
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceSupported = tataVoice.isSupported();

  useEffect(() => {
    const unsub = tataVoice.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (autoSpeak && message && voiceSupported && !soundEngine.isMuted()) {
      tataVoice.speak(message);
    }
    return () => {
      tataVoice.stop();
    };
  }, [autoSpeak, message, voiceSupported]);

  const handleToggleVoice = () => {
    soundEngine.playClick();
    if (isSpeaking) {
      tataVoice.stop();
    } else {
      tataVoice.speak(message, { forceUnmute: true });
    }
  };

  if (scene === 'plaza') {
    return (
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#F5B700]/55 bg-[#091A2B] shadow-[0_14px_40px_rgba(0,0,0,0.48)]">
        {/* Vibrant Animated & Colorful Plaza Principal de Peñas Backdrop */}
        <PlazaPrincipalBackdrop />

        {/* Scenic Location Bubble */}
        <div className="relative z-10 px-3.5 pt-2.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#071422]/85 backdrop-blur-sm border border-[#F5B700]/55 px-2.5 py-0.5 text-[11px] font-bold text-[#FFD166] shadow-md">
            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Plaza Principal de Peñas</span>
          </span>
        </div>

        {/* Tata Standing in the Plaza + Crisp Frosted Speech Box */}
        <div className="relative z-10 px-3.5 pb-3.5 pt-2 flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-4">
          <div className={`relative shrink-0 ${isSpeaking ? 'animate-tata-talk' : 'animate-tata-idle'}`}>
            {isSpeaking && (
              <div className="absolute inset-2 rounded-full bg-amber-300/35 blur-md animate-pulse" />
            )}
            <TataCutoutCharacter
              talking={isSpeaking}
              className="w-24 h-28 sm:w-28 sm:h-32 drop-shadow-[0_10px_22px_rgba(0,0,0,0.72)]"
              label={speakerTitle}
            />
          </div>

          <div className="min-w-0 flex-1 w-full rounded-xl border border-[#F5B700]/35 bg-[#071422]/82 backdrop-blur-md p-3 sm:p-3.5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <div className="text-xs sm:text-sm font-bold tracking-wide text-[#F5B700]">
                  {speakerTitle}
                </div>
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    aria-label={isSpeaking ? 'Detener voz de Tata' : 'Escuchar a Tata'}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 min-h-[32px] text-xs font-bold transition-colors cursor-pointer ${
                      isSpeaking
                        ? 'border-amber-400 bg-amber-400/25 text-amber-200'
                        : 'border-white/20 bg-slate-900/85 hover:bg-slate-800 text-amber-300'
                    }`}
                  >
                    {isSpeaking ? (
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

              <div className="flex items-center gap-2">
                {actionSlot}
                {playerAvatar && (
                  <div className="flex items-center gap-1.5 pl-2 border-l border-white/15">
                    <AymaraAvatar
                      circular
                      config={playerAvatar}
                      className="w-8 h-8"
                      label={`Avatar de ${playerName?.trim() || 'Viajero'}`}
                    />
                    <span className="text-xs font-medium text-[#52B788] max-w-[68px] truncate">
                      {playerName?.trim() || 'Tú'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-[15px] text-[#FFF8E7] leading-relaxed">
              “{message}”
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-[#D9A05B]/35 bg-[#112436]/95 shadow-lg ${
        compact ? 'px-3 py-2.5' : 'p-4'
      }`}
    >
      {/* Unboxed Cutout Tata Figure */}
      <div className={`relative shrink-0 ${isSpeaking ? 'animate-tata-talk' : 'animate-tata-idle'}`}>
        <TataCutoutCharacter
          talking={isSpeaking}
          className={compact ? 'w-14 h-16' : 'w-16 h-20 sm:w-20 sm:h-24'}
          label={speakerTitle}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <div className="text-xs sm:text-sm font-semibold tracking-wide text-[#F5B700]">
              {speakerTitle}
            </div>
            {voiceSupported && (
              <button
                type="button"
                onClick={handleToggleVoice}
                aria-label={isSpeaking ? 'Detener voz de Tata' : 'Escuchar a Tata'}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 min-h-[34px] text-xs font-bold transition-colors cursor-pointer ${
                  isSpeaking
                    ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                    : 'border-white/15 bg-slate-900/80 hover:bg-slate-800 text-amber-300'
                }`}
              >
                {isSpeaking ? (
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
          {actionSlot}
        </div>
        <p className="text-sm sm:text-base text-[#F5F1E8] leading-relaxed">
          “{message}”
        </p>
      </div>

      {playerAvatar && (
        <div className="flex flex-col items-center shrink-0 pl-2 sm:pl-3 border-l border-white/10">
          <AymaraAvatar
            circular
            config={playerAvatar}
            className={compact ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-12 h-12 sm:w-14 sm:h-14'}
            label={`Avatar de ${playerName?.trim() || 'Viajero'}`}
          />
          <span className="text-xs font-medium text-[#52B788] mt-0.5 max-w-[60px] sm:max-w-[78px] truncate">
            {playerName?.trim() || 'Tú'}
          </span>
        </div>
      )}
    </div>
  );
};
