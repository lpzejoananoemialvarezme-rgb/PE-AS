import React from 'react';
import { AvatarConfig } from '../types/game';
import { AymaraAvatar } from './AymaraAvatar';
import { TataCutoutCharacter } from './TataCutoutCharacter';

interface NarratorDockProps {
  message: string;
  speakerTitle?: string;
  compact?: boolean;
  playerAvatar?: AvatarConfig;
  playerName?: string;
  actionSlot?: React.ReactNode;
}

export const NarratorDock: React.FC<NarratorDockProps> = ({
  message,
  speakerTitle = 'Tata',
  compact = false,
  playerAvatar,
  playerName,
  actionSlot
}) => {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-[#D9A05B]/35 bg-[#112436]/95 shadow-lg ${
        compact ? 'px-3 py-2.5' : 'p-4'
      }`}
    >
      {/* Unboxed Cutout Tata Figure */}
      <div className="relative shrink-0">
        <TataCutoutCharacter
          className={compact ? 'w-14 h-16' : 'w-16 h-20 sm:w-20 sm:h-24'}
          label={speakerTitle}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <div className="text-xs font-semibold tracking-wide text-[#F5B700]">
            {speakerTitle}
          </div>
          {actionSlot}
        </div>
        <p className={`${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'} text-[#F5F1E8] leading-relaxed`}>
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
          <span className="text-[10px] font-medium text-[#52B788] mt-0.5 max-w-[56px] sm:max-w-[74px] truncate">
            {playerName?.trim() || 'Tú'}
          </span>
        </div>
      )}
    </div>
  );
};
