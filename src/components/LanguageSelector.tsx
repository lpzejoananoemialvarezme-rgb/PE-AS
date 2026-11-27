import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { AppLanguage, SUPPORTED_LANGUAGES } from '../i18n/types';
import { soundEngine } from '../utils/sound';

interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
}

const ARIA_LABELS: Record<AppLanguage, string> = {
  es: 'Cambiar idioma del juego',
  en: 'Switch game language',
  pt: 'Alterar idioma do jogo'
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  compact = false,
  className = ''
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label={ARIA_LABELS[language]}
      className={`inline-flex items-center gap-1 rounded-lg bg-[#081523]/92 border border-[#D9A05B]/45 backdrop-blur-md shadow-md ${
        compact ? 'px-1.5 py-1' : 'px-2 py-1'
      } ${className}`}
    >
      <Languages
        className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-[#D9A05B] shrink-0 mx-0.5`}
        aria-hidden="true"
      />
      {SUPPORTED_LANGUAGES.map((item) => {
        const active = language === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setLanguage(item.code);
            }}
            aria-pressed={active}
            title={item.nativeLabel}
            className={`min-h-[28px] px-2 rounded-md text-[11px] font-bold tracking-wide transition-colors cursor-pointer ${
              active
                ? 'bg-[#F5B700] text-[#1A1207] shadow-sm'
                : 'text-[#D8D3C8] hover:text-[#FFF8E7] hover:bg-[#17334E]'
            }`}
          >
            {item.shortLabel}
          </button>
        );
      })}
    </div>
  );
};
