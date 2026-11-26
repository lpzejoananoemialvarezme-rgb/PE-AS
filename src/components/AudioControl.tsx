import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, ChevronDown } from 'lucide-react';
import { AMBIENT_SCENES, ANDEAN_TRACKS, AndeanTrackId, soundEngine } from '../utils/sound';

interface AudioControlProps {
  compact?: boolean;
}

export const AudioControl: React.FC<AudioControlProps> = ({ compact = false }) => {
  const [, setTick] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return soundEngine.subscribe(() => setTick((t) => t + 1));
  }, []);

  useEffect(() => {
    const handleOutside = (e: Event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const eventName = typeof window !== 'undefined' && 'PointerEvent' in window ? 'pointerdown' : 'touchstart';
    if (isOpen) {
      document.addEventListener(eventName, handleOutside);
      if (eventName !== 'pointerdown') {
        document.addEventListener('mousedown', handleOutside);
      }
    }
    return () => {
      document.removeEventListener(eventName, handleOutside);
      if (eventName !== 'pointerdown') {
        document.removeEventListener('mousedown', handleOutside);
      }
    };
  }, [isOpen]);

  const isMuted = soundEngine.isMuted();
  const volume = soundEngine.getVolume();
  const isPlaying = soundEngine.isMusicPlaying();
  const isAuto = soundEngine.isAutoRotate();
  const isAmbient = soundEngine.isAmbientEnabled();
  const ambientMeta = AMBIENT_SCENES[soundEngine.getAmbientScene()];
  const trackId = soundEngine.getTrackId();
  const currentTrack = ANDEAN_TRACKS.find((t) => t.id === trackId) || ANDEAN_TRACKS[0];
  const volumePct = Math.round(volume * 100);

  return (
    <div ref={wrapperRef} className="relative flex items-center gap-1.5">
      {/* Inline Compact Control Cluster */}
      <div className="flex items-center gap-1.5 bg-[#081523]/92 border border-[#D9A05B]/40 rounded-xl px-2 py-1.5 shadow-lg">
        {/* Mute/Unmute Button */}
        <button
          type="button"
          onClick={() => soundEngine.setMuted(!isMuted)}
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          title={isMuted ? 'Activar sonido (M)' : 'Silenciar sonido (M)'}
          className="w-10 h-10 rounded-lg bg-[#112A3E] hover:bg-[#17334E] text-[#FFF8E7] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4 text-[#A3B1BF]" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#F5B700]" />
          )}
        </button>

        {/* Inline Master Volume Slider (visible on md+ or non-compact) */}
        <div className={`${compact ? 'hidden md:flex' : 'flex'} items-center gap-2 px-1`}>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volumePct}
            onChange={(e) => soundEngine.setVolume(Number(e.target.value) / 100)}
            aria-label="Control de volumen general"
            className="w-20 lg:w-24 accent-[#F5B700] cursor-pointer h-1.5"
          />
          <span className="font-mono-num text-[11px] text-[#D8D3C8] w-8 text-right shrink-0">
            {isMuted ? '0%' : `${volumePct}%`}
          </span>
        </div>

        {/* Andean Music Library Popover Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          aria-expanded={isOpen}
          aria-label="Biblioteca de música andina y volumen"
          className="inline-flex items-center gap-1.5 px-2.5 h-10 rounded-lg bg-[#1E4D3B] hover:bg-[#2D6A4F] text-[#FFF8E7] text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
        >
          <Music className="w-4 h-4 text-[#FFD166]" />
          <span className="hidden sm:inline">
            {isPlaying
              ? soundEngine.isVictoryMode()
                ? 'Victoria del Guardián'
                : currentTrack.title
              : 'Música Andina'}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Popover Panel: Track Selector + Mobile Volume */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[min(296px,calc(100vw-24px))] rounded-2xl border border-[#D9A05B]/45 bg-[#081523]/98 p-4 shadow-2xl z-50 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-[#F5B700]">Biblioteca de Audio Andino</div>
              <div className="text-[11px] text-[#A3B1BF]">Zampoñas, charangos, tarka y bombo</div>
            </div>

            <button
              type="button"
              onClick={() => soundEngine.toggleMusic()}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                isPlaying
                  ? 'bg-[#D9A05B] text-[#1A1207]'
                  : 'bg-[#2D6A4F] text-[#FFF8E7]'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pausar' : 'Sonar'}</span>
            </button>
          </div>

          {/* Volume Slider (always accessible inside popover for mobile too) */}
          <div className="space-y-1.5 bg-[#112A3E] rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between text-xs text-[#E2DDD2]">
              <span>Volumen general</span>
              <span className="font-mono-num font-bold text-[#F5B700]">
                {isMuted ? 'Silenciado' : `${volumePct}%`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volumePct}
              onChange={(e) => soundEngine.setVolume(Number(e.target.value) / 100)}
              aria-label="Volumen maestro"
              className="w-full accent-[#F5B700] cursor-pointer h-2"
            />
          </div>

          {/* Auto-Variation Toggle */}
          <button
            type="button"
            onClick={() => soundEngine.setAutoRotate(!isAuto)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs cursor-pointer transition-colors ${
              isAuto
                ? 'bg-[#1D4E89]/60 border-[#4EA8DE] text-[#FFF8E7]'
                : 'bg-[#0D2134] border-white/10 text-[#A3B1BF]'
            }`}
          >
            <span className="font-semibold">Cambio automático de melodías</span>
            <span className={`font-bold ${isAuto ? 'text-[#52B788]' : 'text-[#94A3B8]'}`}>
              {isAuto ? 'Activo' : 'Manual'}
            </span>
          </button>

          {/* Stage-Aware Ambient Soundscape Toggle */}
          <button
            type="button"
            onClick={() => soundEngine.setAmbientEnabled(!isAmbient)}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs cursor-pointer transition-colors ${
              isAmbient
                ? 'bg-[#1E4D3B]/65 border-[#52B788]/75 text-[#FFF8E7]'
                : 'bg-[#0D2134] border-white/10 text-[#A3B1BF]'
            }`}
          >
            <div className="text-left min-w-0">
              <div className="font-semibold">Ambiente según la etapa</div>
              <div className="text-[10px] text-[#CBD5E1] truncate">{ambientMeta.label}</div>
            </div>
            <span className={`font-bold shrink-0 ${isAmbient ? 'text-[#74C69D]' : 'text-[#94A3B8]'}`}>
              {isAmbient ? 'Activo' : 'Apagado'}
            </span>
          </button>

          {/* 4 Selectable Andean Tracks */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-[#D9A05B]">Pistas instrumentales</div>
            {ANDEAN_TRACKS.map((track) => {
              const selected = track.id === trackId;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    soundEngine.setTrack(track.id as AndeanTrackId);
                    if (!soundEngine.isMusicPlaying()) {
                      soundEngine.startMusic();
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl border transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#1E4D3B]/75 border-[#F5B700] text-[#FFF8E7]'
                      : 'bg-[#0D2134] hover:bg-[#17334E] border-white/10 text-[#D8D3C8]'
                  }`}
                >
                  <div className="text-xs font-semibold flex items-center justify-between">
                    <span>{track.title}</span>
                    {selected && isPlaying && (
                      <span className="text-[10px] text-[#52B788] font-bold">Sonando</span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#A3B1BF]">{track.instruments}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
