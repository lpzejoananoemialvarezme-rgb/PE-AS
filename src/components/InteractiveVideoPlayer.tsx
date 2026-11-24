import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Eye, CheckCircle2 } from 'lucide-react';
import { VideoHotspot, VideoScene } from '../types/game';
import { soundEngine } from '../utils/sound';

interface InteractiveVideoPlayerProps {
  videoUrl?: string;
  scenes: VideoScene[];
  hotspots: VideoHotspot[];
  stageTitle: string;
  onWatchedEnough: () => void;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}?rel=0`;
      if (u.pathname.startsWith('/embed/')) return url;
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace('/', '');
      if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
    }
    return null;
  } catch {
    return null;
  }
}

export const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  videoUrl,
  scenes,
  hotspots,
  stageTitle,
  onWatchedEnough
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [activeFact, setActiveFact] = useState<VideoHotspot | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const ytEmbed = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;
  const isCustomDirectVideo = Boolean(videoUrl && !ytEmbed);

  useEffect(() => {
    if (videoUrl) {
      // External videos mark ready immediately so player isn't blocked
      onWatchedEnough();
    }
  }, [videoUrl, onWatchedEnough]);

  useEffect(() => {
    if (videoUrl || !isPlaying) return;
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return Math.min(100, prev + 1.25);
      });
    }, 150);
    return () => window.clearInterval(interval);
  }, [isPlaying, videoUrl]);

  useEffect(() => {
    if (progress >= 65) {
      onWatchedEnough();
    }
    if (progress >= 100 && isPlaying) {
      setIsPlaying(false);
    }
  }, [progress, isPlaying, onWatchedEnough]);

  if (ytEmbed) {
    return (
      <div className="rounded-xl overflow-hidden border border-[#D9A05B]/35 bg-[#081523]">
        <div className="aspect-video w-full">
          <iframe
            src={ytEmbed}
            title={`Video de ${stageTitle}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="px-4 py-2.5 text-xs text-[#D8D3C8] flex items-center justify-between bg-[#0E2235]">
          <span>Video personalizado vinculado a esta etapa</span>
          <span className="text-[#52B788] font-semibold">Listo para responder</span>
        </div>
      </div>
    );
  }

  if (isCustomDirectVideo && videoUrl) {
    return (
      <div className="rounded-xl overflow-hidden border border-[#D9A05B]/35 bg-[#081523]">
        <video
          src={videoUrl}
          controls
          className="w-full aspect-video bg-black"
          onPlay={() => onWatchedEnough()}
        />
      </div>
    );
  }

  // Built-in interactive animated mini-documentary with clickable hotspots
  const sceneCount = Math.max(1, scenes.length);
  const sceneIndex = Math.min(sceneCount - 1, Math.floor((progress / 100) * sceneCount));
  const currentScene = scenes[sceneIndex] || {
    title: stageTitle,
    caption: 'Explora los puntos interactivos de esta escena.',
    palette: 'adobe' as const
  };

  const paletteGradient =
    currentScene.palette === 'adobe'
      ? 'from-[#3D2817] via-[#6B4423] to-[#1D4E89]'
      : currentScene.palette === 'valley'
        ? 'from-[#0F2C4C] via-[#1E4D3B] to-[#2D6A4F]'
        : 'from-[#1D4E89] via-[#5C4033] to-[#2D6A4F]';

  const hasIllustratedScene = Boolean(currentScene.imageUrl && !imgErrors[sceneIndex]);

  const handleHotspotClick = (hs: VideoHotspot) => {
    soundEngine.playClick();
    setActiveFact(hs);
    if (!discoveredIds.includes(hs.id)) {
      const updated = [...discoveredIds, hs.id];
      setDiscoveredIds(updated);
      if (updated.length >= 1) {
        onWatchedEnough();
      }
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#D9A05B]/40 bg-[#081523] shadow-lg">
      {/* Top Scene Header Outside Video Frame */}
      <div className="px-3.5 py-2 bg-[#0B1D2E] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs sm:text-sm font-semibold text-[#F5B700] truncate">
          {currentScene.title}
        </div>
        <div className="text-xs text-[#E2DDD2] font-mono-num shrink-0">
          Puntos explorados: <strong className="text-[#52B788]">{discoveredIds.length}/{hotspots.length}</strong>
        </div>
      </div>

      {/* Interactive Visual Frame (Unobstructed except clickable landmark pins) */}
      <div className={`relative aspect-video w-full bg-gradient-to-br ${paletteGradient} overflow-hidden select-none`}>
        {hasIllustratedScene ? (
          <div className="absolute inset-0 overflow-hidden">
            {scenes.map((sc, idx) => {
              if (!sc.imageUrl || imgErrors[idx]) return null;
              const isCurrent = idx === sceneIndex;
              return (
                <img
                  key={idx}
                  src={sc.imageUrl}
                  alt={sc.title}
                  referrerPolicy="no-referrer"
                  onError={() => setImgErrors((prev) => ({ ...prev, [idx]: true }))}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 will-change-transform ${
                    isCurrent ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  style={{
                    transform: isCurrent
                      ? `scale(${1.02 + ((progress % 34) / 34) * 0.08}) translate3d(${
                          ((progress % 34) / 34 - 0.5) * -1.8
                        }%, ${((progress % 34) / 34 - 0.5) * -1.0}%, 0)`
                      : 'scale(1.02)'
                  }}
                />
              );
            })}

            {/* Subtle Sunbeam Sweep & Floating Golden Motes */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-1/2 left-0 w-1/3 h-[200%] bg-gradient-to-r from-transparent via-[#FFD166]/20 to-transparent animate-sun-sweep"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[24%] top-[44%] w-1.5 h-1.5 rounded-full bg-[#FFD166] animate-mote-float"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[64%] top-[52%] w-1.5 h-1.5 rounded-full bg-[#FFD166] animate-mote-float"
              style={{ animationDelay: '2.2s' }}
            />
          </div>
        ) : (
          <svg
            viewBox="0 0 800 450"
            className="absolute inset-0 w-full h-full transition-transform duration-700"
            style={{ transform: `scale(${1 + (progress / 100) * 0.06})` }}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <circle
              cx={160 + progress * 3.2}
              cy={110 - Math.sin((progress / 100) * Math.PI) * 30}
              r="48"
              fill="#FFD166"
              fillOpacity="0.28"
            />
            <circle
              cx={160 + progress * 3.2}
              cy={110 - Math.sin((progress / 100) * Math.PI) * 30}
              r="24"
              fill="#F5B700"
              fillOpacity="0.85"
            />
            <path
              d="M0 320 L120 190 L220 265 L350 150 L490 250 L620 135 L740 230 L800 185 L800 450 L0 450 Z"
              fill="#0B1D2E"
              fillOpacity="0.45"
            />
            <path d="M350 150 L315 190 L345 182 L370 195 Z" fill="#FFF8E7" fillOpacity="0.8" />
            <path d="M620 135 L585 180 L615 172 L645 186 Z" fill="#FFF8E7" fillOpacity="0.85" />
            <path
              d="M0 365 Q180 300 380 345 T800 315 L800 450 L0 450 Z"
              fill="#1E4D3B"
              fillOpacity="0.92"
            />
            {currentScene.palette === 'adobe' && (
              <g transform="translate(310, 248)">
                <rect x="0" y="38" width="130" height="62" fill="#C48B5A" stroke="#3D2817" strokeWidth="2" />
                <polygon points="-10,38 65,4 140,38" fill="#8C3B2B" />
                <rect x="140" y="18" width="38" height="82" fill="#B57B4C" stroke="#3D2817" strokeWidth="2" />
                <polygon points="135,18 159,-2 183,18" fill="#8C3B2B" />
                <rect x="52" y="65" width="26" height="35" rx="12" fill="#3D2817" />
              </g>
            )}
            {currentScene.palette === 'rock' && (
              <g>
                <path d="M470 360 L515 110 L565 185 L605 95 L665 360 Z" fill="#A67449" stroke="#3D2817" strokeWidth="2" />
                <path d="M515 110 L540 240 L515 355" stroke="#5C3A1E" strokeWidth="3" fill="none" />
              </g>
            )}
          </svg>
        )}

        {/* Clickable Interactive Video Hotspots */}
        {hotspots.map((hs) => {
          const seen = discoveredIds.includes(hs.id);
          return (
            <button
              key={hs.id}
              type="button"
              onClick={() => handleHotspotClick(hs)}
              style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 min-h-[38px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-transform duration-150 hover:scale-105 cursor-pointer shadow-lg ${
                seen
                  ? 'bg-[#2D6A4F]/95 text-[#FFF8E7] border border-[#52B788]'
                  : 'bg-[#F5B700] text-[#1A1207] border border-[#FFF8E7]'
              }`}
            >
              {seen ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="whitespace-nowrap">{hs.label}</span>
            </button>
          );
        })}
      </div>

      {/* Caption & Active Hotspot Fact Cleanly Below the Video */}
      <div className="bg-[#060F19] border-t border-white/10 px-4 py-3 space-y-2">
        <p className="text-xs sm:text-sm text-[#F5F1E8]">{currentScene.caption}</p>

        {activeFact && (
          <div className="bg-[#0B1D2E] border border-[#F5B700]/60 rounded-lg p-3 text-xs sm:text-sm text-[#FFF8E7] flex items-start justify-between gap-3">
            <div>
              <span className="font-bold text-[#F5B700]">{activeFact.label}: </span>
              <span>{activeFact.fact}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveFact(null)}
              className="text-xs text-[#A3B1BF] hover:text-white shrink-0 cursor-pointer px-2 py-1"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>

      {/* Video Transport Controls */}
      <div className="px-4 py-2.5 bg-[#0E2235] flex items-center gap-3 border-t border-white/10">
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            if (progress >= 100) {
              setProgress(0);
              setIsPlaying(true);
            } else {
              setIsPlaying((p) => !p);
            }
          }}
          className="w-9 h-9 rounded-lg bg-[#1D4E89] hover:bg-[#2563EB] text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(progress)}
          onChange={(e) => {
            const val = Number(e.target.value);
            setProgress(val);
            if (val >= 65) onWatchedEnough();
          }}
          aria-label="Línea de tiempo del video"
          className="flex-1 accent-[#F5B700] cursor-pointer h-2"
        />

        <span className="text-xs font-mono-num text-[#D8D3C8] w-11 text-right shrink-0">
          {Math.round(progress)}%
        </span>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setProgress(0);
            setIsPlaying(true);
          }}
          className="w-9 h-9 rounded-lg bg-[#17334E] hover:bg-[#234B70] text-[#E2DDD2] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          aria-label="Reiniciar video"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
