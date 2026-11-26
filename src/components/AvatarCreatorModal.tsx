import React, { useState } from 'react';
import { X, Shuffle, Check, Sparkles } from 'lucide-react';
import {
  AvatarAccessory,
  AvatarConfig,
  AvatarHairStyle,
  AvatarHeadwear,
  AvatarOutfit,
  AvatarPalette
} from '../types/game';
import { AymaraFullBodyAvatar, AvatarPose } from './AymaraFullBodyAvatar';
import { soundEngine } from '../utils/sound';

interface AvatarCreatorModalProps {
  initialConfig: AvatarConfig;
  playerName: string;
  onSave: (config: AvatarConfig, updatedName: string) => void;
  onClose: () => void;
}

type EditorTab = 'rostro' | 'vestimenta' | 'sombrero' | 'accesorios';

const SKIN_TONES = [
  { id: '#E6B89C', label: 'Claro cálido' },
  { id: '#C8926E', label: 'Trigueño andino' },
  { id: '#A56B46', label: 'Cobre altiplánico' },
  { id: '#7B4B2E', label: 'Tierra profunda' }
];

const HAIR_COLORS = [
  { id: '#1B1817', label: 'Negro azabache' },
  { id: '#4A3222', label: 'Castaño tierra' },
  { id: '#9CA3AF', label: 'Plata sabio' }
];

const HAIR_STYLES: { id: AvatarHairStyle; label: string; desc: string }[] = [
  { id: 'trenzas_tullmas', label: 'Trenzas con Tullmas (borlas tejidas)', desc: 'Trenzas tradicionales con borlas tejidas' },
  { id: 'trenzas_dobles', label: 'Trenzas Clásicas', desc: 'Dos trenzas largas sobre los hombros' },
  { id: 'cabello_suelto', label: 'Cabello Largo', desc: 'Melena suelta al viento de la cordillera' },
  { id: 'corto_andino', label: 'Corte Corto', desc: 'Estilo práctico de caminante andino' }
];

const OUTFITS: { id: AvatarOutfit; label: string; desc: string }[] = [
  { id: 'poncho_tejido', label: 'Poncho Tejido', desc: 'Poncho aymara con franjas y flecos' },
  { id: 'pollera_manta', label: 'Pollera, Manta y Tupu (prendedor tradicional)', desc: 'Pollera y manta tradicional sujeta con prendedor tupu' },
  { id: 'chaleco_aguayo', label: 'Chaleco de Aguayo (tejido andino)', desc: 'Chaleco explorador con detalles tejidos' },
  { id: 'capa_guardian', label: 'Capa Chakana (cruz andina)', desc: 'Capa ceremonial del Guardián con emblema Chakana' }
];

const HEADWEAR_OPTIONS: { id: AvatarHeadwear; label: string; desc: string }[] = [
  { id: 'chullo', label: 'Chullo (gorro tejido con orejeras)', desc: 'Gorro tejido tradicional con orejeras y borlas' },
  { id: 'sombrero_bombin', label: 'Sombrero Bombín', desc: 'Clásico sombrero paceño con cinta' },
  { id: 'vincha_chakana', label: 'Vincha Chakana (cruz andina)', desc: 'Cinta tejida con símbolo escalonado' },
  { id: 'ninguno', label: 'Sin Sombrero', desc: 'Deja lucir tu peinado libremente' }
];

const ACCESSORIES: { id: AvatarAccessory; label: string; desc: string }[] = [
  { id: 'chuspa', label: 'Chuspa (bolsa tradicional tejida)', desc: 'Bolsa tradicional andina cruzada' },
  { id: 'bufanda_alpaca', label: 'Bufanda de Alpaca', desc: 'Abrigo tejido para los 4.000 m s. n. m.' },
  { id: 'collar_plata', label: 'Collar Ceremonial', desc: 'Pectoral andino de plata y oro' },
  { id: 'ninguno', label: 'Sin Accesorio', desc: 'Vestimenta limpia sin complementos' }
];

const PALETTES: { id: AvatarPalette; label: string; swatches: string[] }[] = [
  { id: 'armonia', label: 'Armonía Peñas', swatches: ['#1E4D3B', '#1D4E89', '#D9A05B'] },
  { id: 'tierra', label: 'Terroso Ocre', swatches: ['#7B4824', '#B8743B', '#E3B065'] },
  { id: 'verde', label: 'Verde Pajonal', swatches: ['#1E4D3B', '#2D6A4F', '#74C69D'] },
  { id: 'azul', label: 'Azul Altiplano', swatches: ['#133A63', '#1D4E89', '#5DB7DE'] }
];

const TABS: { id: EditorTab; label: string }[] = [
  { id: 'rostro', label: 'Rostro y Peinado' },
  { id: 'vestimenta', label: 'Vestimenta' },
  { id: 'sombrero', label: 'Sombrero' },
  { id: 'accesorios', label: 'Accesorios' }
];

export const AvatarCreatorModal: React.FC<AvatarCreatorModalProps> = ({
  initialConfig,
  playerName,
  onSave,
  onClose
}) => {
  const [draft, setDraft] = useState<AvatarConfig>({ ...initialConfig });
  const [nameDraft, setNameDraft] = useState(playerName);
  const [activeTab, setActiveTab] = useState<EditorTab>('rostro');
  const [previewPose, setPreviewPose] = useState<AvatarPose>('idle');

  const handleRandomize = () => {
    soundEngine.playTileSwap();
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    setDraft({
      skinTone: pick(SKIN_TONES).id,
      hairColor: pick(HAIR_COLORS).id,
      hairStyle: pick(HAIR_STYLES).id,
      outfit: pick(OUTFITS).id,
      headwear: pick(HEADWEAR_OPTIONS).id,
      accessory: pick(ACCESSORIES).id,
      palette: pick(PALETTES).id
    });
  };

  const handleSave = () => {
    soundEngine.playRelicUnlock();
    onSave(draft, nameDraft);
  };

  const renderTabBar = (compactMobile: boolean) => (
    <div
      className={`grid grid-cols-2 sm:flex gap-1.5 p-1 bg-[#081523] border border-white/10 ${
        compactMobile ? 'rounded-xl' : 'rounded-xl'
      }`}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setActiveTab(tab.id);
          }}
          className={`flex-1 min-h-[42px] px-2.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === tab.id
              ? 'bg-[#1E4D3B] text-[#FFF8E7] border border-[#52B788]/60'
              : 'text-[#A3B1BF] hover:text-[#FFF8E7]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050E17]/92 flex items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-creator-title"
    >
      <div className="w-full max-w-4xl h-screen h-[100dvh] sm:h-auto sm:max-h-[92vh] flex flex-col rounded-none sm:rounded-2xl border-0 sm:border sm:border-[#D9A05B]/45 bg-[#0D2134] shadow-2xl overflow-hidden">
        {/* Top Modal Header (Fixed / Shrink-0) */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#081523] border-b border-white/10">
          <div className="min-w-0">
            <h2 id="avatar-creator-title" className="font-display text-base sm:text-xl font-bold text-[#FFF8E7] truncate">
              Creador de Avatar Aymara
            </h2>
            <p className="text-[11px] sm:text-xs text-[#A3B1BF] truncate hidden sm:block">
              Personaliza vestimenta, peinado y accesorios andinos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            aria-label="Cerrar creador de avatar"
            className="w-11 h-11 rounded-xl bg-[#17334E] hover:bg-[#234B70] text-white flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Pinned Compact Live Full-Body Preview + Fixed Tabs */}
        <div className="md:hidden shrink-0 bg-[#081523]/95 border-b border-white/10 px-3.5 py-3 space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#0D2134] border border-white/10 p-1 shrink-0">
              <AymaraFullBodyAvatar
                config={draft}
                pose={previewPose}
                walking={previewPose === 'walk'}
                className="w-16 h-24 shrink-0 drop-shadow-xl"
                label="Vista previa en cuerpo completo de tu avatar aymara"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="avatar-name-input-mobile"
                  type="text"
                  maxLength={40}
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder="Nombre de tu viajero..."
                  aria-label="Nombre de tu viajero"
                  className="flex-1 min-w-0 min-h-[40px] px-3 py-1.5 rounded-lg bg-[#0D2134] border border-white/20 text-sm text-[#FFF8E7] focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                />
                <button
                  type="button"
                  onClick={handleRandomize}
                  aria-label="Combinación aleatoria"
                  title="Combinación aleatoria"
                  className="w-10 h-10 rounded-lg bg-[#17334E] hover:bg-[#1D4E89] text-[#F5B700] flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                {(['idle', 'walk', 'cheer'] as AvatarPose[]).map((poseKey) => (
                  <button
                    key={poseKey}
                    type="button"
                    onClick={() => setPreviewPose(poseKey)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border cursor-pointer ${
                      previewPose === poseKey
                        ? 'bg-[#F5B700] text-[#1A1207] border-[#FFD166]'
                        : 'bg-[#0D2134] text-[#D8D3C8] border-white/15'
                    }`}
                  >
                    {poseKey === 'idle' ? 'Quietud' : poseKey === 'walk' ? 'Caminar' : 'Celebrar'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {renderTabBar(true)}
        </div>

        {/* Main Body Split */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[270px_1fr]">
          {/* Desktop Left Live Full-Body Preview Column */}
          <div className="hidden md:flex bg-[#081523]/75 border-r border-white/10 p-5 flex-col items-center justify-between gap-4">
            <div className="w-full flex flex-col items-center space-y-3">
              <div className="w-full rounded-2xl bg-gradient-to-b from-[#0E243B] to-[#081523] border border-[#D9A05B]/30 py-3 flex flex-col items-center">
                <AymaraFullBodyAvatar
                  config={draft}
                  pose={previewPose}
                  walking={previewPose === 'walk'}
                  className="w-36 h-52 drop-shadow-2xl"
                  label="Vista previa en cuerpo completo de tu avatar aymara"
                />
                <div className="mt-1 flex items-center gap-1.5">
                  {(['idle', 'walk', 'cheer'] as AvatarPose[]).map((poseKey) => (
                    <button
                      key={poseKey}
                      type="button"
                      onClick={() => setPreviewPose(poseKey)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                        previewPose === poseKey
                          ? 'bg-[#F5B700] text-[#1A1207] border-[#FFD166]'
                          : 'bg-[#0D2134] text-[#D8D3C8] border-white/15 hover:border-white/30'
                      }`}
                    >
                      {poseKey === 'idle' ? 'Normal' : poseKey === 'walk' ? 'Caminar' : 'Celebrar'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="avatar-name-input" className="block text-xs font-semibold text-[#D9A05B] mb-1">
                  Nombre de tu Viajero
                </label>
                <input
                  id="avatar-name-input"
                  type="text"
                  maxLength={40}
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder="Ej. Wayra Quispe"
                  className="w-full px-3 py-2 rounded-lg bg-[#0D2134] border border-white/20 text-sm text-[#FFF8E7] focus:outline-none focus:ring-2 focus:ring-[#F5B700]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleRandomize}
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#17334E] hover:bg-[#1D4E89] text-xs font-semibold text-[#E2DDD2] cursor-pointer transition-colors"
            >
              <Shuffle className="w-4 h-4 text-[#F5B700]" />
              Combinación Aleatoria
            </button>
          </div>

          {/* Independently Scrollable Customization Options Panel */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 space-y-4">
            <div className="hidden md:block">{renderTabBar(false)}</div>

            {activeTab === 'rostro' && (
              <div className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#D9A05B]">Tono de piel</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SKIN_TONES.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setDraft((d) => ({ ...d, skinTone: st.id }));
                        }}
                        className={`min-h-[48px] flex items-center gap-2.5 p-2.5 rounded-xl border text-xs text-left cursor-pointer transition-colors ${
                          draft.skinTone === st.id
                            ? 'bg-[#17334E] border-[#F5B700] text-[#FFF8E7] font-semibold'
                            : 'bg-[#081523] border-white/10 text-[#D8D3C8] hover:border-white/30'
                        }`}
                      >
                        <span
                          className="w-6 h-6 rounded-full border border-white/30 shrink-0"
                          style={{ backgroundColor: st.id }}
                        />
                        <span className="truncate">{st.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#D9A05B]">Color de cabello</div>
                  <div className="grid grid-cols-3 gap-2">
                    {HAIR_COLORS.map((hc) => (
                      <button
                        key={hc.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setDraft((d) => ({ ...d, hairColor: hc.id }));
                        }}
                        className={`min-h-[48px] flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          draft.hairColor === hc.id
                            ? 'bg-[#17334E] border-[#F5B700] text-[#FFF8E7] font-semibold'
                            : 'bg-[#081523] border-white/10 text-[#D8D3C8] hover:border-white/30'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-white/30 shrink-0"
                          style={{ backgroundColor: hc.id }}
                        />
                        <span className="truncate">{hc.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#D9A05B]">Peinado Aymara</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {HAIR_STYLES.map((hs) => (
                      <button
                        key={hs.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setDraft((d) => ({ ...d, hairStyle: hs.id }));
                        }}
                        className={`min-h-[54px] p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                          draft.hairStyle === hs.id
                            ? 'bg-[#1E4D3B]/65 border-[#F5B700] text-[#FFF8E7]'
                            : 'bg-[#081523] border-white/10 text-[#D8D3C8] hover:border-white/30'
                        }`}
                      >
                        <div className="text-sm font-semibold flex items-center justify-between gap-2">
                          <span>{hs.label}</span>
                          {draft.hairStyle === hs.id && <Check className="w-4 h-4 text-[#F5B700] shrink-0" />}
                        </div>
                        <div className="text-xs text-[#A3B1BF] mt-0.5">{hs.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vestimenta' && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[#D9A05B]">Prenda Tradicional</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {OUTFITS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setDraft((d) => ({ ...d, outfit: item.id }));
                      }}
                      className={`min-h-[58px] p-3.5 rounded-xl border text-left cursor-pointer transition-colors ${
                        draft.outfit === item.id
                          ? 'bg-[#1E4D3B]/65 border-[#F5B700] text-[#FFF8E7]'
                          : 'bg-[#081523] border-white/10 text-[#D8D3C8] hover:border-white/30'
                      }`}
                    >
                      <div className="text-sm font-semibold flex items-center justify-between gap-2">
                        <span>{item.label}</span>
                        {draft.outfit === item.id && <Check className="w-4 h-4 text-[#F5B700] shrink-0" />}
                      </div>
                      <div className="text-xs text-[#A3B1BF] mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'sombrero' && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[#D9A05B]">Gorro o Sombrero Andino</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {HEADWEAR_OPTIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setDraft((d) => ({ ...d, headwear: item.id }));
                      }}
                      className={`min-h-[58px] p-3.5 rounded-xl border text-left cursor-pointer transition-colors ${
                        draft.headwear === item.id
                          ? 'bg-[#1D4E89]/65 border-[#F5B700] text-[#FFF8E7]'
                          : 'bg-[#081523] border-white/10 text-[#D8D3C8] hover:border-white/30'
                      }`}
                    >
                      <div className="text-sm font-semibold flex items-center justify-between gap-2">
                        <span>{item.label}</span>
                        {draft.headwear === item.id && <Check className="w-4 h-4 text-[#F5B700] shrink-0" />}
                      </div>
                      <div className="text-xs text-[#A3B1BF] mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'accesorios' && (
              <div className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#D9A05B]">
                    Paleta de Tejido (Terrosos, Verdes y Azules)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PALETTES.map((pal) => (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setDraft((d) => ({ ...d, palette: pal.id }));
                        }}
                        className={`min-h-[48px] flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                          draft.palette === pal.id
                            ? 'bg-[#17334E] border-[#F5B700] text-[#FFF8E7] font-semibold'
                            : 'bg-[#081523] border-white/10 text-[#D8D3C8] hover:border-white/30'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{pal.label}</span>
                        <div className="flex items-center gap-1">
                          {pal.swatches.map((hex, idx) => (
                            <span
                              key={idx}
                              className="w-4 h-4 rounded-full border border-white/30"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#D9A05B]">Accesorios Culturales</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ACCESSORIES.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setDraft((d) => ({ ...d, accessory: item.id }));
                        }}
                        className={`min-h-[54px] p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                          draft.accessory === item.id
                            ? 'bg-[#1E4D3B]/65 border-[#F5B700] text-[#FFF8E7]'
                            : 'bg-[#081523] border-white/10 text-[#D8D3C8] hover:border-white/30'
                        }`}
                      >
                        <div className="text-sm font-semibold flex items-center justify-between gap-2">
                          <span>{item.label}</span>
                          {draft.accessory === item.id && <Check className="w-4 h-4 text-[#F5B700] shrink-0" />}
                        </div>
                        <div className="text-xs text-[#A3B1BF] mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Thumb Action Bar */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#081523] border-t border-white/10">
          <span className="text-xs text-[#A3B1BF] hidden md:inline">
            Tu avatar aparecerá sobre el mapa de Peñas y dialogando con Tata.
          </span>
          <div className="flex items-center gap-2.5 w-full md:w-auto md:ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 md:flex-none min-h-[44px] px-4 py-2 rounded-xl bg-[#17334E] hover:bg-[#234B70] text-xs sm:text-sm text-[#E2DDD2] font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-[1.5] md:flex-none min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] text-xs sm:text-sm font-bold cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              Guardar Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
