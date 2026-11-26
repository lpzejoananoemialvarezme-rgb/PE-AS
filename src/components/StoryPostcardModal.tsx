import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Instagram,
  Share2,
  Shuffle,
  Sparkles,
  X
} from 'lucide-react';
import { PlayerProgress } from '../types/game';
import { PENAS_STORY_SCENES, StoryScenePhoto } from '../data/defaultStages';
import { getDominantTravelerProfile, getPlayerRank } from '../utils/rewards';
import { renderInstagramStoryBlob } from '../utils/storyPostcard';
import { AymaraAvatar } from './AymaraAvatar';
import { ChakanaLogoSvg } from './RelicIcon';
import { soundEngine } from '../utils/sound';

interface StoryPostcardModalProps {
  progress: PlayerProgress;
  totalStages: number;
  onClose: () => void;
}

function pickRandomSceneIndex(excludeIdx?: number): number {
  if (PENAS_STORY_SCENES.length <= 1) return 0;
  let idx = Math.floor(Math.random() * PENAS_STORY_SCENES.length);
  if (excludeIdx !== undefined && idx === excludeIdx) {
    idx = (idx + 1) % PENAS_STORY_SCENES.length;
  }
  return idx;
}

export const StoryPostcardModal: React.FC<StoryPostcardModalProps> = ({
  progress,
  totalStages,
  onClose
}) => {
  const [sceneIdx, setSceneIdx] = useState<number>(() => pickRandomSceneIndex());
  const [imgFallback, setImgFallback] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const avatarSvgRef = useRef<SVGSVGElement | null>(null);

  const scene: StoryScenePhoto = PENAS_STORY_SCENES[sceneIdx] || PENAS_STORY_SCENES[0];
  const activeImageUrl = imgFallback ? scene.fallbackUrl : scene.imageUrl;

  const isCompleted = progress.completedStages.length >= totalStages;
  const travelerName = progress.playerName.trim() || 'Viajero de Peñas';
  const profile = getDominantTravelerProfile(progress.traitScores);
  const { rankTitle } = isCompleted
    ? getPlayerRank(progress)
    : { rankTitle: 'Explorador en Camino' };

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return 'https://penas-la-paz.app';
    return window.location.origin;
  }, []);

  const displayShareHost = useMemo(
    () => shareUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    [shareUrl]
  );

  const inviteText = `¡Recorrí el pueblo de Peñas, La Paz jugando "Peñas: Sendero del Guardián"! Soy ${rankTitle} (${profile.title}). Juega gratis y descubre tu tipo de viajero aquí 👉 ${shareUrl}`;

  const handleRerollScene = () => {
    soundEngine.playClick();
    setImgFallback(false);
    setStatusMessage('');
    setSceneIdx((prev) => pickRandomSceneIndex(prev));
  };

  const handleCopyInvite = async () => {
    soundEngine.playClick();
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(inviteText);
      } else {
        const ta = document.createElement('textarea');
        ta.value = inviteText;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        const copiedOk = document.execCommand('copy');
        document.body.removeChild(ta);
        if (!copiedOk) throw new Error('Copy unsupported');
      }
      setCopied(true);
      setStatusMessage('¡Enlace e invitación copiados! Pégalo en tu historia de Instagram o WhatsApp.');
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      setStatusMessage(`Comparte este enlace: ${shareUrl}`);
    }
  };

  const handleDownloadStory = async () => {
    soundEngine.playRelicUnlock();
    setIsExporting(true);
    setStatusMessage('');
    try {
      const blob = await renderInstagramStoryBlob({
        scene,
        avatarSvg: avatarSvgRef.current,
        playerName: travelerName,
        rankTitle,
        travelerTypeTitle: profile.title,
        shareUrl
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `postal-penas-historia-${scene.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      setStatusMessage('¡Postal 9:16 descargada! Súbela a tu historia de Instagram y agrega el enlace del juego.');
    } catch {
      setStatusMessage('No se pudo exportar la imagen en este navegador. Intenta con otro escenario.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativeShare = async () => {
    soundEngine.playClick();
    setIsExporting(true);
    setStatusMessage('');
    try {
      const blob = await renderInstagramStoryBlob({
        scene,
        avatarSvg: avatarSvgRef.current,
        playerName: travelerName,
        rankTitle,
        travelerTypeTitle: profile.title,
        shareUrl
      });
      const file = new File([blob], `postal-penas-${scene.id}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Peñas: Sendero del Guardián — La Paz',
          text: inviteText,
          url: shareUrl,
          files: [file]
        });
        setStatusMessage('¡Postal compartida con éxito!');
      } else if (navigator.share) {
        await navigator.share({
          title: 'Peñas: Sendero del Guardián — La Paz',
          text: inviteText,
          url: shareUrl
        });
        setStatusMessage('¡Enlace compartido! También puedes descargar la postal 9:16 para tu historia.');
      } else {
        await handleDownloadStory();
        await handleCopyInvite();
      }
    } catch {
      // user cancelled share dialog or fallback needed
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050E17]/92 flex items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-postcard-title"
    >
      <div className="w-full max-w-4xl h-screen h-[100dvh] sm:h-auto sm:max-h-[92vh] flex flex-col rounded-none sm:rounded-2xl border-0 sm:border sm:border-[#F5B700]/50 bg-[#0D2134] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#081523] border-b border-white/10">
          <div className="min-w-0">
            <h2
              id="story-postcard-title"
              className="font-display text-base sm:text-xl font-bold text-[#FFF8E7] flex items-center gap-2 truncate"
            >
              <Instagram className="w-4 h-4 text-[#F5B700] shrink-0" />
              <span className="truncate">Postal para Historia de Instagram (9:16)</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-[#A3B1BF] truncate">
              Escenario animado estilo del juego en formato 9:16 con tu avatar y enlace del juego
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            aria-label="Cerrar postal para redes"
            className="w-11 h-11 rounded-xl bg-[#17334E] hover:bg-[#234B70] text-white flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
          {/* Live 9:16 Animated Game-Style Instagram Story Preview */}
          <div className="flex justify-center">
            <div className="relative w-[255px] sm:w-[285px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-[#F5B700]/75 shadow-[0_18px_45px_rgba(0,0,0,0.65)] bg-[#081523] flex flex-col justify-between select-none">
              <img
                key={scene.id}
                src={activeImageUrl}
                alt={scene.location}
                referrerPolicy="no-referrer"
                onError={() => setImgFallback(true)}
                className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
              />
              {/* Animated golden sunlight sweep + floating Andean dust motes */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-12 -bottom-12 left-1/4 w-1/2 bg-gradient-to-r from-transparent via-[#FFD166]/20 to-transparent blur-xl animate-sun-sweep"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-[26%] left-[18%] w-1.5 h-1.5 rounded-full bg-[#FFD166]/80 shadow-[0_0_8px_#F5B700] animate-mote-float"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-[38%] right-[16%] w-2 h-2 rounded-full bg-[#FFF8E7]/75 shadow-[0_0_8px_#FFD166] animate-mote-float"
                style={{ animationDelay: '2.1s' }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-[58%] left-[24%] w-1.5 h-1.5 rounded-full bg-[#F5B700]/80 shadow-[0_0_8px_#F5B700] animate-mote-float"
                style={{ animationDelay: '3.8s' }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#060F19]/85 via-transparent to-[#060F19]/95" />

              {/* Woven Aguayo Top & Bottom Borders */}
              <div className="pointer-events-none relative z-10 flex flex-col">
                <div className="h-1 bg-[#8C3B2B]" />
                <div className="h-0.5 bg-[#F5B700]" />
                <div className="h-1 bg-[#1E4D3B]" />
                <div className="h-1 bg-[#1D4E89]" />
              </div>

              {/* Story Top Lockup */}
              <div className="relative z-10 px-3 pt-2.5 text-center space-y-1">
                <ChakanaLogoSvg className="w-6 h-6 mx-auto" />
                <div className="text-[9px] font-bold tracking-wider text-[#FFD166]">
                  PEÑAS · LA PAZ, BOLIVIA · 4.000 M
                </div>
                <div className="font-display text-xs font-bold text-[#FFF8E7]">
                  SENDERO DEL GUARDIÁN
                </div>
              </div>

              {/* Center Avatar with Traveler Hat & Aura */}
              <div className="relative z-10 flex flex-col items-center justify-center px-3">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute -inset-4 rounded-full blur-md"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(245,183,0,0.5) 0%, rgba(82,183,136,0.18) 55%, rgba(8,21,35,0) 75%)'
                    }}
                  />
                  <AymaraAvatar
                    svgRef={avatarSvgRef}
                    config={progress.avatar}
                    showBackdrop={false}
                    travelerBadge={isCompleted ? profile.trait : undefined}
                    className="relative z-10 w-32 h-32 sm:w-36 sm:h-36 drop-shadow-[0_10px_20px_rgba(0,0,0,0.75)]"
                    label={`Postal de ${travelerName}`}
                  />
                </div>
              </div>

              {/* Bottom Identity + Clean Game Callout Card */}
              <div className="relative z-10 px-3 pb-3 text-center space-y-2.5">
                <div className="space-y-0.5">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#52B788]">
                    {rankTitle}
                  </div>
                  <div className="font-display text-sm sm:text-base font-bold text-[#FFF8E7] leading-tight truncate">
                    {travelerName}
                  </div>
                  <div className="text-[10px] font-bold text-[#FFD166] truncate">
                    {profile.title}
                  </div>
                </div>

                <div className="rounded-xl bg-[#0D2134]/95 border border-[#F5B700]/75 px-2.5 py-2 space-y-1">
                  <div className="text-[9px] font-bold text-[#FFD166] tracking-wide">
                    Juega gratis y aprende sobre Peñas
                  </div>
                  <div className="px-2 py-0.5 rounded bg-[#081523] border border-[#4EA8DE]/45 font-mono-num text-[9px] text-[#4EA8DE] truncate">
                    {displayShareHost}
                  </div>
                </div>
              </div>

              <div className="pointer-events-none relative z-10 flex flex-col">
                <div className="h-1 bg-[#1D4E89]" />
                <div className="h-1 bg-[#1E4D3B]" />
                <div className="h-0.5 bg-[#F5B700]" />
                <div className="h-1 bg-[#8C3B2B]" />
              </div>
            </div>
          </div>

          {/* Controls & Share Actions */}
          <div className="space-y-4">
            <div className="rounded-xl bg-[#081523] border border-[#D9A05B]/35 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5B700]">
                <Sparkles className="w-4 h-4" />
                <span>Escenario ilustrado y animado de Peñas</span>
              </div>
              <div className="text-sm font-semibold text-[#FFF8E7]">{scene.location}</div>
              <p className="text-xs text-[#A3B1BF] leading-relaxed">
                Cada vez que abres o cambias el escenario, se elige al azar una versión animada al estilo del juego de Peñas en formato vertical (1080 × 1920 px) con frase promocional.
              </p>

              <button
                type="button"
                onClick={handleRerollScene}
                className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#17334E] hover:bg-[#1D4E89] border border-[#4EA8DE]/45 text-xs sm:text-sm font-semibold text-[#FFF8E7] cursor-pointer transition-colors"
              >
                <Shuffle className="w-4 h-4 text-[#4EA8DE]" />
                <span>Otro Escenario al Azar</span>
              </button>
            </div>

            {/* Shareable Link Box */}
            <div className="rounded-xl bg-[#112A3E] border border-[#52B788]/40 p-4 space-y-2.5">
              <div className="text-xs font-bold text-[#52B788]">
                Enlace directo al juego para pegar en tu Historia
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  aria-label="Enlace del juego para compartir"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="flex-1 min-w-0 min-h-[42px] px-3 py-2 rounded-lg bg-[#081523] border border-white/15 font-mono-num text-xs text-[#4EA8DE] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyInvite}
                  className="min-h-[42px] px-3.5 py-2 rounded-lg bg-[#1E4D3B] hover:bg-[#2D6A4F] border border-[#52B788]/50 text-xs font-bold text-[#FFF8E7] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-[#74C69D]" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[#CBD5E1]">
                En Instagram Stories, sube la postal descargada y añade el sticker de <strong>«ENLACE»</strong> pegando este link para que tus amigos jueguen y conozcan Peñas.
              </p>
            </div>

            {/* Primary Download, Share & Back Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
              <button
                type="button"
                disabled={isExporting}
                onClick={handleDownloadStory}
                className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] disabled:opacity-60 text-[#1A1207] font-bold text-sm cursor-pointer transition-colors shadow-lg whitespace-nowrap"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{isExporting ? 'Generando PNG...' : 'Descargar Postal (9:16)'}</span>
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={handleNativeShare}
                className="min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2D6A4F] hover:bg-[#3A8463] disabled:opacity-60 border border-[#74C69D]/45 text-[#FFF8E7] font-bold text-sm cursor-pointer transition-colors whitespace-nowrap"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                <span>Compartir</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#17334E] hover:bg-[#234B70] border border-white/20 text-[#FFF8E7] font-semibold text-sm cursor-pointer transition-colors whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>Volver atrás</span>
              </button>
            </div>

            {statusMessage && (
              <div className="rounded-xl bg-[#122D25] border border-[#52B788]/45 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium text-[#74C69D]">{statusMessage}</p>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E4D3B] hover:bg-[#2D6A4F] border border-[#74C69D]/40 text-xs font-bold text-[#FFF8E7] cursor-pointer whitespace-nowrap"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver atrás</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
