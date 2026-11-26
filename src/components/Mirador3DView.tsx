import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Camera,
  Compass,
  Eye,
  Info,
  MapPin,
  Mountain,
  RotateCcw
} from 'lucide-react';
import { AvatarConfig, DEFAULT_AVATAR } from '../types/game';
import { observeElementResize } from '../utils/canvasHelpers';
import { assetUrl } from '../utils/assetUrl';
import { soundEngine } from '../utils/sound';
import { AymaraFullBodyAvatar } from './AymaraFullBodyAvatar';

interface Mirador3DViewProps {
  playerAvatar?: AvatarConfig;
  playerName?: string;
}

type CameraPresetId =
  | 'mirador'
  | 'cordillera'
  | 'illampu'
  | 'huayna'
  | 'illimani'
  | 'pueblo'
  | 'cartel'
  | 'condor';

interface CameraPreset {
  id: CameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
  infoTitle: string;
  infoText: string;
}

const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'mirador',
    label: 'Mirador 360°',
    position: [0.35, 2.85, 6.75],
    target: [0.4, 1.55, -8.0],
    infoTitle: 'Atardecer en Mirador Wiraconi (Nido de Cóndor)',
    infoText:
      'Arrastra con el mouse o dedo para recorrer el horizonte rocoso. Toca cualquiera de los 3 nevados de la Cordillera Real o el Cartel Wiraconi para acercarte.'
  },
  {
    id: 'cordillera',
    label: 'Cordillera Real',
    position: [0.0, 4.8, 3.2],
    target: [2.0, 12.0, -165.0],
    infoTitle: 'Cordillera Real al Atardecer',
    infoText:
      'Cadena glaciar iluminada por el arrebol andino, coronada por tres gigantes: Illampu, Huayna Potosí e Illimani.'
  },
  {
    id: 'illampu',
    label: 'Illampu (6.485 m)',
    position: [-8.0, 6.2, 2.0],
    target: [-68.0, 20.0, -168.0],
    infoTitle: 'Nevado Illampu · 6.485 m s. n. m.',
    infoText:
      'Uno de los macizos más imponentes y altos de la Cordillera Real, visible hacia el norte desde las peñas de granito.'
  },
  {
    id: 'huayna',
    label: 'Huayna Potosí (6.088 m)',
    position: [0.5, 5.4, 2.2],
    target: [2.0, 19.0, -165.0],
    infoTitle: 'Nevado Huayna Potosí · 6.088 m s. n. m.',
    infoText:
      'Icónica pirámide glaciar de nieve eterna frente al Altiplano paceño, símbolo del andinismo boliviano.'
  },
  {
    id: 'illimani',
    label: 'Illimani (6.439 m)',
    position: [7.5, 6.0, 2.2],
    target: [72.0, 19.5, -170.0],
    infoTitle: 'Nevado Illimani · 6.439 m s. n. m.',
    infoText:
      'El guardián tutelar de La Paz, reconocible por sus tres cumbres nevadas teñidas de dorado y rosa al caer la tarde.'
  },
  {
    id: 'pueblo',
    label: 'Pueblo de Peñas',
    position: [-2.0, 5.6, 1.2],
    target: [-3.5, -16.5, -40.0],
    infoTitle: 'Pueblo de Peñas y Valle del Altiplano',
    infoText:
      'Al pie de los farallones rocosos descansan la plaza, el templo colonial y la recta ruta del Altiplano.'
  },
  {
    id: 'cartel',
    label: 'Cartel Wiraconi',
    position: [3.2, 2.05, 3.85],
    target: [2.05, 1.5, 0.95],
    infoTitle: 'Cartel Mirador Wiraconi',
    infoText:
      'Placa de madera tallada sobre roca con líquenes amarillos y verdes que marca la cumbre panorámica del mirador.'
  },
  {
    id: 'condor',
    label: 'Cóndor Andino',
    position: [1.5, 4.8, 5.4],
    target: [0, 6.2, -22],
    infoTitle: 'Vuelo del Cóndor al Ocaso',
    infoText:
      'Planea aprovechando las últimas corrientes térmicas sobre las quebradas rocosas de Peñas.'
  }
];

interface LandmarkHotspot {
  id: CameraPresetId;
  label: string;
  elevation: string;
  worldPos: THREE.Vector3;
  isMountainPeak?: boolean;
}

const STATIC_LANDMARKS: LandmarkHotspot[] = [
  {
    id: 'illampu',
    label: 'Illampu',
    elevation: '6.485 m',
    worldPos: new THREE.Vector3(-68, 27.5, -168),
    isMountainPeak: true
  },
  {
    id: 'huayna',
    label: 'Huayna Potosí',
    elevation: '6.088 m',
    worldPos: new THREE.Vector3(2, 25.5, -165),
    isMountainPeak: true
  },
  {
    id: 'illimani',
    label: 'Illimani',
    elevation: '6.439 m',
    worldPos: new THREE.Vector3(74, 26.8, -170),
    isMountainPeak: true
  },
  {
    id: 'pueblo',
    label: 'Pueblo de Peñas',
    elevation: '4.000 m',
    worldPos: new THREE.Vector3(-3.5, -15.0, -39)
  },
  {
    id: 'cartel',
    label: 'Cartel Wiraconi',
    elevation: 'Placa',
    worldPos: new THREE.Vector3(2.05, 2.45, 0.95)
  }
];

const REFERENCE_PHOTOS = [
  {
    src: assetUrl('/assets/aistudio/WhatsApp_Image_2026-11-20_at_02.22.58_97537be3.jpeg'),
    caption: 'Cartel original del Mirador Wiraconi sobre roca con líquenes'
  },
  {
    src: assetUrl('/assets/aistudio/WhatsApp_Image_2026-11-20_at_02.23.53_4ace7535.jpeg'),
    caption: 'Vista hacia el pueblo de Peñas, la carretera del Altiplano y los nevados'
  },
  {
    src: assetUrl('/assets/aistudio/WhatsApp_Image_2026-11-20_at_02.23.17_2f36fcc8.jpeg'),
    caption: 'Farallón granítico a la izquierda y la Cordillera Real en el horizonte'
  },
  {
    src: assetUrl('/assets/aistudio/WhatsApp_Image_2026-11-20_at_02.23.44_260fc684.jpeg'),
    caption: 'Panorámica completa desde el borde rocoso del Mirador Nido de Cóndor'
  }
];

// Pre-allocated math helpers (zero per-frame GC)
const _camGoal = new THREE.Vector3();
const _targetGoal = new THREE.Vector3();
const _projVec = new THREE.Vector3();
const _condorWorldPos = new THREE.Vector3();
const _dummy = new THREE.Object3D();
const _tintColor = new THREE.Color();

function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function valueNoise2D(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm2D(x: number, y: number, octaves = 4): number {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    value += amp * valueNoise2D(x * freq, y * freq);
    freq *= 2.07;
    amp *= 0.5;
  }
  return value;
}

function ridgedNoise2D(x: number, y: number, octaves = 4): number {
  let sum = 0;
  let amp = 0.55;
  let freq = 1;
  let weight = 1;
  for (let i = 0; i < octaves; i++) {
    let n = 1 - Math.abs(valueNoise2D(x * freq, y * freq) * 2 - 1);
    n = n * n * weight;
    weight = Math.min(1, Math.max(0.18, n * 1.65));
    sum += n * amp;
    freq *= 2.14;
    amp *= 0.5;
  }
  return sum;
}

function altiplanoHeight(x: number, z: number): number {
  const n1 = fbm2D(x * 0.015 + 4.1, z * 0.015 + 9.2, 3);
  const gentleRoll = (n1 - 0.45) * 4.4;
  const farFoothillRise = z < -112 ? Math.pow((-112 - z) / 28, 1.45) * 4.5 : 0;
  const rightRidge = x > 62 ? Math.pow((x - 62) / 60, 1.3) * 6.5 * fbm2D(x * 0.03, z * 0.03, 2) : 0;
  return -18 + gentleRoll + farFoothillRise + rightRidge;
}

/**
 * Angular, craggy rock boulder geometry with fracture planes & sharp granite facets
 */
function createCraggyRockGeo(
  radius: number,
  detail = 3,
  seed = 1.7,
  roughnessAmp = 0.42
): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const vz = pos.getZ(i);
    const len = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
    const nx = vx / len;
    const ny = vy / len;
    const nz = vz / len;

    const strata = Math.sin(ny * 7.5 + nx * 2.2 + seed) * 0.09;
    const ridge = ridgedNoise2D(nx * 2.3 + seed, nz * 2.3 + ny * 1.4, 3);
    const crack = Math.abs(fbm2D(nx * 3.5 + seed, nz * 3.5 - ny, 3) - 0.5) * 2;
    const disp = 1 + (ridge - 0.55) * roughnessAmp - crack * (roughnessAmp * 0.38) + strata;
    pos.setXYZ(i, vx * disp, vy * disp, vz * disp);
  }
  geo.computeVertexNormals();
  return geo;
}

function createGraniteLichenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#6f5f54';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 2400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 1.5 + Math.random() * 11;
    const shades = ['#4e423a', '#857263', '#605248', '#9e8874', '#39312c', '#7a543f'];
    ctx.fillStyle = shades[Math.floor(Math.random() * shades.length)];
    ctx.globalAlpha = 0.3 + Math.random() * 0.4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Deep fractured rock fissures
  ctx.strokeStyle = 'rgba(26, 18, 14, 0.55)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 56; i++) {
    const sx = Math.random() * 512;
    const sy = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    const mx = sx + (Math.random() - 0.5) * 45;
    const my = sy + (Math.random() - 0.5) * 32;
    ctx.lineTo(mx, my);
    ctx.lineTo(mx + (Math.random() - 0.5) * 45, my + (Math.random() - 0.5) * 32);
    ctx.stroke();
  }

  // Highland golden-yellow and moss-green lichens
  for (let i = 0; i < 240; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const rx = 3 + Math.random() * 13;
    const ry = 2 + Math.random() * 9;
    const lichenColors = ['#a9c23f', '#789c2e', '#d6a432', '#2f342d', '#8fb384'];
    ctx.fillStyle = lichenColors[Math.floor(Math.random() * lichenColors.length)];
    ctx.globalAlpha = 0.5 + Math.random() * 0.35;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

function createAltiplanoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#a47e50';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 180; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const w = 14 + Math.random() * 54;
    const h = 8 + Math.random() * 34;
    const tones = ['#977046', '#b88f5b', '#7f6441', '#8b6a46', '#6c563a'];
    ctx.fillStyle = tones[Math.floor(Math.random() * tones.length)];
    ctx.globalAlpha = 0.36 + Math.random() * 0.3;
    ctx.fillRect(x, y, w, h);
  }

  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#c8a36d' : '#5e4c34';
    ctx.globalAlpha = 0.25;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 10);
  return tex;
}

function createPlaqueTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 768, 512);
  grad.addColorStop(0, '#dfa567');
  grad.addColorStop(0.5, '#c8894c');
  grad.addColorStop(1, '#a96b34');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 768, 512);

  // Authentic wood grain lines
  ctx.strokeStyle = 'rgba(72, 36, 12, 0.24)';
  ctx.lineWidth = 4;
  for (let y = 16; y < 512; y += 18) {
    ctx.beginPath();
    ctx.moveTo(0, y + (Math.random() - 0.5) * 6);
    ctx.bezierCurveTo(250, y + 8, 510, y - 8, 768, y + (Math.random() - 0.5) * 6);
    ctx.stroke();
  }

  // Subtle carved wooden border bevel
  ctx.strokeStyle = 'rgba(42, 20, 8, 0.55)';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 748, 492);

  ctx.fillStyle = '#120e0b';
  ctx.textAlign = 'center';
  ctx.font = 'bold 94px Georgia, serif';
  ctx.fillText('MIRADOR', 384, 165);
  ctx.font = 'bold 92px Georgia, serif';
  ctx.fillText('WIRACONI', 384, 286);
  ctx.font = 'bold 74px Georgia, serif';
  ctx.fillText('4.300 MSNM', 384, 402);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createSunsetSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Rich Andean golden-hour sunset gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#0f1733');
  grad.addColorStop(0.26, '#2e274b');
  grad.addColorStop(0.46, '#6f3854');
  grad.addColorStop(0.62, '#c25742');
  grad.addColorStop(0.75, '#ef924c');
  grad.addColorStop(0.87, '#fbcb7a');
  grad.addColorStop(1, '#ffe3a8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Glowing sunset sun orb glow near western-left horizon
  const sunGlow = ctx.createRadialGradient(340, 355, 8, 340, 355, 290);
  sunGlow.addColorStop(0, 'rgba(255, 252, 224, 1)');
  sunGlow.addColorStop(0.14, 'rgba(255, 214, 128, 0.85)');
  sunGlow.addColorStop(0.42, 'rgba(244, 128, 66, 0.38)');
  sunGlow.addColorStop(1, 'rgba(244, 128, 66, 0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, 1024, 512);

  // Lit sunset altocumulus cloud streaks catching pink & amber light
  for (let i = 0; i < 72; i++) {
    const cx = Math.random() * 1024;
    const cy = 195 + Math.random() * 135;
    const rx = 45 + Math.random() * 115;
    const ry = 6 + Math.random() * 14;
    const cGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, rx);
    const warmCloud = cy > 265 ? 'rgba(255, 198, 128, 0.58)' : 'rgba(240, 144, 132, 0.42)';
    cGrad.addColorStop(0, warmCloud);
    cGrad.addColorStop(0.55, 'rgba(186, 94, 104, 0.22)');
    cGrad.addColorStop(1, 'rgba(186, 94, 104, 0)');
    ctx.fillStyle = cGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const Mirador3DView: React.FC<Mirador3DViewProps> = ({
  playerAvatar = DEFAULT_AVATAR,
  playerName = 'Viajero'
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const hotspotRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [activePreset, setActivePreset] = useState<CameraPresetId>('mirador');
  const [showPhotos, setShowPhotos] = useState(false);
  const [webglLost, setWebglLost] = useState(false);

  const presetRequestRef = useRef<{
    active: boolean;
    followCondor: boolean;
    position: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    followCondor: false,
    position: new THREE.Vector3(...CAMERA_PRESETS[0].position),
    target: new THREE.Vector3(...CAMERA_PRESETS[0].target)
  });

  const handleSelectPreset = (presetId: CameraPresetId) => {
    const preset = CAMERA_PRESETS.find((p) => p.id === presetId) || CAMERA_PRESETS[0];
    soundEngine.playClick();
    setActivePreset(preset.id);
    presetRequestRef.current = {
      active: true,
      followCondor: preset.id === 'condor',
      position: new THREE.Vector3(...preset.position),
      target: new THREE.Vector3(...preset.target)
    };
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = Math.max(container.clientWidth, 300);
    const height = Math.max(container.clientHeight, 260);

    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: isSoftwareGl ? 'default' : 'high-performance'
      });
    } catch {
      setWebglLost(true);
      return;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglLost(true);
    };
    const onContextRestored = () => {
      setWebglLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x9a594d);
    // Warm golden-rose sunset haze blending distant Altiplano into the Cordillera Real
    scene.fog = new THREE.FogExp2(0x9f5d4e, 0.00145);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.15, 560);
    camera.position.set(...CAMERA_PRESETS[0].position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS[0].target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.enablePan = true;
    controls.screenSpacePanning = false;
    controls.minDistance = 1.8;
    controls.maxDistance = 185;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.maxPolarAngle = Math.PI * 0.56;
    controls.rotateSpeed = 0.72;
    controls.zoomSpeed = 0.85;
    controls.update();

    const cancelPresetOnUserInput = () => {
      presetRequestRef.current.active = false;
      presetRequestRef.current.followCondor = false;
    };
    controls.addEventListener('start', cancelPresetOnUserInput);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };
    const trackTex = <T extends THREE.Texture>(t: T): T => {
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      textures.push(t);
      return t;
    };

    // SUNSET LIGHTING RIG: Low golden-amber key light + twilight violet/terracotta hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0x8e80b8, 0x6b3e26, 0.92);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffa45e, 2.75);
    sunLight.position.set(-55, 22, -48);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 110;
    const sd = 15;
    sunLight.shadow.camera.left = -sd;
    sunLight.shadow.camera.right = sd;
    sunLight.shadow.camera.top = sd;
    sunLight.shadow.camera.bottom = -sd;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    // Subtle twilight cool-blue front-right fill so rocks & Cartel Wiraconi face read crisply
    const rimLight = new THREE.DirectionalLight(0x8ba2db, 0.65);
    rimLight.position.set(24, 18, 28);
    scene.add(rimLight);

    // Warm sunset bounce point light near the Cartel Wiraconi board face
    const signWarmFill = new THREE.PointLight(0xffcf96, 1.45, 7.5, 1.4);
    signWarmFill.position.set(1.25, 2.25, 3.1);
    scene.add(signWarmFill);

    // Sunset Sky Dome
    const skyTex = trackTex(createSunsetSkyTexture());
    const skyDome = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(340, 32, 20)),
      trackMat(
        new THREE.MeshBasicMaterial({
          map: skyTex,
          side: THREE.BackSide,
          fog: false
        })
      )
    );
    scene.add(skyDome);

    // Glowing setting sun orb hovering just above the Cordillera horizon
    const sunOrb = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(9.5, 20, 16)),
      trackMat(
        new THREE.MeshBasicMaterial({
          color: 0xffdf99,
          fog: false
        })
      )
    );
    sunOrb.position.set(-108, 36, -245);
    scene.add(sunOrb);

    // Procedural rock & soil materials
    const graniteTex = trackTex(createGraniteLichenTexture());
    const graniteMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: graniteTex,
        color: 0xbda794,
        roughness: 0.92,
        metalness: 0.03
      })
    );
    const darkCliffMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: graniteTex,
        color: 0x5c4a40,
        roughness: 0.95,
        metalness: 0.02
      })
    );
    const rustRockMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: graniteTex,
        color: 0x8a5b44,
        roughness: 0.93,
        metalness: 0.02
      })
    );

    // 1. RUGGED, CRAGGY GRANITE PROMONTORY SUMMIT (Much rockier multi-slab terrain)
    const promontoryGroup = new THREE.Group();
    const ledgeSpecs: Array<{
      pos: [number, number, number];
      scale: [number, number, number];
      rotY?: number;
      seed: number;
      matType?: 'granite' | 'dark' | 'rust';
    }> = [
      // Core rocky summit base slabs
      { pos: [0, -1.35, 3.1], scale: [10.8, 2.5, 9.6], seed: 1.2, matType: 'granite' },
      { pos: [-2.8, -0.55, 1.4], scale: [4.2, 1.45, 4.4], seed: 2.3, matType: 'dark' },
      { pos: [2.7, -0.6, 1.8], scale: [4.4, 1.5, 4.3], seed: 3.1, matType: 'rust' },
      { pos: [-0.2, -0.32, 3.6], scale: [5.4, 0.95, 4.8], seed: 4.5, matType: 'granite' },
      // Jagged cliff under-buttresses dropping to the valley
      { pos: [-4.6, -2.1, 0.6], scale: [5.2, 3.6, 5.4], seed: 5.2, matType: 'dark' },
      { pos: [4.4, -2.0, 1.1], scale: [4.8, 3.4, 4.9], seed: 6.4, matType: 'dark' },
      { pos: [0.3, -6.0, -0.5], scale: [15.0, 7.6, 11.5], seed: 7.1, matType: 'dark' },
      // Foreground jagged rock edge boulders framing the lookout terrace
      { pos: [-2.1, 0.15, -0.1], scale: [2.1, 0.95, 1.65], rotY: 0.4, seed: 8.3, matType: 'rust' },
      { pos: [-0.3, -0.05, -0.35], scale: [1.8, 0.72, 1.5], rotY: -0.3, seed: 9.2, matType: 'granite' },
      { pos: [1.45, 0.08, -0.2], scale: [1.9, 0.85, 1.6], rotY: 0.7, seed: 10.1, matType: 'dark' },
      { pos: [-3.9, 0.45, 2.7], scale: [1.75, 1.25, 2.2], rotY: 0.2, seed: 11.4, matType: 'rust' },
      { pos: [4.1, 0.35, 3.2], scale: [1.85, 1.15, 2.0], rotY: -0.5, seed: 12.6, matType: 'granite' }
    ];

    ledgeSpecs.forEach((spec) => {
      const geo = trackGeo(createCraggyRockGeo(1, 3, spec.seed, 0.42));
      const mat =
        spec.matType === 'dark'
          ? darkCliffMat
          : spec.matType === 'rust'
            ? rustRockMat
            : graniteMat;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...spec.pos);
      if (spec.rotY) mesh.rotation.y = spec.rotY;
      mesh.scale.set(...spec.scale);
      mesh.receiveShadow = true;
      mesh.castShadow = !isSoftwareGl;
      promontoryGroup.add(mesh);
    });

    // Scattered angular granite stones & scree across the rocky terrace (InstancedMesh)
    const screeCount = 54;
    const screeGeo = trackGeo(createCraggyRockGeo(0.24, 1, 17.3, 0.45));
    const screeMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: graniteTex,
        roughness: 0.94,
        metalness: 0.02
      })
    );
    const screeMesh = new THREE.InstancedMesh(screeGeo, screeMat, screeCount);
    screeMesh.castShadow = !isSoftwareGl;
    screeMesh.receiveShadow = true;

    for (let i = 0; i < screeCount; i++) {
      const angle = i * 2.399;
      const rad = 1.25 + ((i * 0.618) % 1) * 3.9;
      const rx = Math.cos(angle) * rad;
      const rz = 2.6 + Math.sin(angle) * rad * 0.72;
      const ry = 0.26 + hash2(i, 4.1) * 0.14;
      const s = 0.55 + hash2(i, 9.2) * 1.15;

      _dummy.position.set(rx, ry, rz);
      _dummy.rotation.set(
        hash2(i, 1.3) * Math.PI,
        hash2(i, 2.7) * Math.PI * 2,
        hash2(i, 5.1) * Math.PI
      );
      _dummy.scale.set(s * 1.25, s * 0.72, s);
      _dummy.updateMatrix();
      screeMesh.setMatrixAt(i, _dummy.matrix);

      _tintColor.setHSL(0.06 + hash2(i, 7.7) * 0.04, 0.18, 0.42 + hash2(i, 8.8) * 0.22);
      screeMesh.setColorAt(i, _tintColor);
    }
    screeMesh.instanceMatrix.needsUpdate = true;
    if (screeMesh.instanceColor) screeMesh.instanceColor.needsUpdate = true;
    screeMesh.computeBoundingSphere();
    promontoryGroup.add(screeMesh);
    scene.add(promontoryGroup);

    // 2. PROMINENT CARTEL WIRACONI BOULDER & WEATHERED WOODEN PLAQUE (Front-right & clearly legible)
    const signGroup = new THREE.Group();
    signGroup.position.set(2.05, 0.25, 0.95);
    signGroup.rotation.y = -0.44;

    const boulderBase = new THREE.Mesh(
      trackGeo(createCraggyRockGeo(1.22, 3, 11.4, 0.36)),
      graniteMat
    );
    boulderBase.scale.set(1.25, 1.32, 0.92);
    boulderBase.position.set(0, 0.84, 0);
    boulderBase.castShadow = !isSoftwareGl;
    boulderBase.receiveShadow = true;
    signGroup.add(boulderBase);

    const boulderShoulder = new THREE.Mesh(
      trackGeo(createCraggyRockGeo(0.74, 2, 14.2, 0.38)),
      rustRockMat
    );
    boulderShoulder.position.set(0.82, 0.46, 0.14);
    boulderShoulder.castShadow = !isSoftwareGl;
    signGroup.add(boulderShoulder);

    const plaqueTex = trackTex(createPlaqueTexture());
    const plaqueFaceMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: plaqueTex,
        roughness: 0.74,
        metalness: 0.04
      })
    );
    const woodEdgeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x6f4320,
        roughness: 0.88,
        metalness: 0.02
      })
    );

    const plaqueBoard = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.72, 1.16, 0.09)),
      [woodEdgeMat, woodEdgeMat, woodEdgeMat, woodEdgeMat, plaqueFaceMat, woodEdgeMat]
    );
    plaqueBoard.position.set(0, 1.38, 0.74);
    plaqueBoard.rotation.set(-0.07, 0, -0.03);
    plaqueBoard.castShadow = !isSoftwareGl;
    plaqueBoard.receiveShadow = true;
    signGroup.add(plaqueBoard);

    const screwMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd8dee9,
        roughness: 0.28,
        metalness: 0.88
      })
    );
    [
      [0, 1.82, 0.81],
      [0, 1.36, 0.79]
    ].forEach(([sx, sy, sz]) => {
      const screw = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.036, 0.036, 0.03, 10)),
        screwMat
      );
      screw.rotation.x = Math.PI / 2;
      screw.position.set(sx, sy, sz);
      signGroup.add(screw);
    });
    scene.add(signGroup);

    // 3. FAITHFUL TRAIL DOG ON ROCK LEDGE OVERLOOKING THE SUNSET VALLEY
    const dogGroup = new THREE.Group();
    dogGroup.position.set(0.45, 0.42, 1.05);
    dogGroup.rotation.y = 0.25;

    const dogCoatMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x261a14, roughness: 0.86, metalness: 0.02 })
    );
    const dogTanMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x7a4b2a, roughness: 0.82, metalness: 0.02 })
    );

    const dogHaunches = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.24, 12, 10)), dogCoatMat);
    dogHaunches.scale.set(0.95, 1.05, 1.2);
    dogHaunches.position.set(0, 0.24, 0.14);
    dogHaunches.castShadow = !isSoftwareGl;
    dogGroup.add(dogHaunches);

    const dogChest = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.17, 0.22, 0.44, 10)),
      dogCoatMat
    );
    dogChest.rotation.x = -0.32;
    dogChest.position.set(0, 0.41, -0.05);
    dogChest.castShadow = !isSoftwareGl;
    dogGroup.add(dogChest);

    const dogNeck = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.12, 0.15, 0.21, 10)),
      dogTanMat
    );
    dogNeck.position.set(0, 0.62, -0.14);
    dogGroup.add(dogNeck);

    const dogHead = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.15, 12, 10)), dogTanMat);
    dogHead.position.set(0, 0.76, -0.18);
    dogHead.castShadow = !isSoftwareGl;
    dogGroup.add(dogHead);

    const dogSnout = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.1, 0.085, 0.15)), dogCoatMat);
    dogSnout.position.set(0, 0.72, -0.31);
    dogGroup.add(dogSnout);

    [-1, 1].forEach((side) => {
      const ear = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.05, 0.13, 0.085)), dogCoatMat);
      ear.position.set(side * 0.14, 0.73, -0.15);
      ear.rotation.z = side * 0.35;
      dogGroup.add(ear);

      const paw = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.042, 0.048, 0.35, 8)),
        dogCoatMat
      );
      paw.position.set(side * 0.11, 0.18, -0.14);
      dogGroup.add(paw);
    });

    const dogTail = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.028, 0.042, 0.3, 8)),
      dogCoatMat
    );
    dogTail.position.set(0.08, 0.18, 0.35);
    dogTail.rotation.x = 1.15;
    dogTail.rotation.z = -0.3;
    dogGroup.add(dogTail);
    scene.add(dogGroup);

    // 4. PAJA BRAVA (ICHU) GRASS TUFTS NESTLED BETWEEN ROCKS
    const grassCount = 120;
    const bladeGeo = trackGeo(new THREE.ConeGeometry(0.052, 0.52, 4));
    bladeGeo.translate(0, 0.26, 0);
    const grassMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd6a65a,
        roughness: 0.9,
        metalness: 0.0
      })
    );
    const grassMesh = new THREE.InstancedMesh(bladeGeo, grassMat, grassCount);
    grassMesh.castShadow = !isSoftwareGl;
    grassMesh.receiveShadow = true;

    for (let i = 0; i < grassCount; i++) {
      const clumpIdx = Math.floor(i / 3);
      const angle = clumpIdx * 2.399;
      const rad = 1.8 + ((clumpIdx * 0.618) % 1) * 3.8;
      const gx = Math.cos(angle) * rad + (Math.random() - 0.5) * 0.16;
      const gz = 3.0 + Math.sin(angle) * rad * 0.7 + (Math.random() - 0.5) * 0.16;
      const gy = 0.26 + (gz > 4.1 ? 0.12 : 0);
      const scaleFactor = 0.72 + Math.random() * 0.5;

      _dummy.position.set(gx, gy, gz);
      _dummy.rotation.set(
        (Math.random() - 0.5) * 0.55,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.55
      );
      _dummy.scale.set(scaleFactor, scaleFactor * (0.8 + Math.random() * 0.45), scaleFactor);
      _dummy.updateMatrix();
      grassMesh.setMatrixAt(i, _dummy.matrix);

      _tintColor.setHSL(0.09 + (Math.random() - 0.5) * 0.04, 0.5, 0.46 + (Math.random() - 0.5) * 0.14);
      grassMesh.setColorAt(i, _tintColor);
    }
    grassMesh.instanceMatrix.needsUpdate = true;
    if (grassMesh.instanceColor) grassMesh.instanceColor.needsUpdate = true;
    grassMesh.computeBoundingSphere();
    scene.add(grassMesh);

    // 5. RUGGED FLANKING GRANITE CLIFF ESCARPMENTS (Positioned so Illampu remains unobstructed!)
    const cliffGroup = new THREE.Group();
    const cliffSpecs: Array<[number, number, number, number, number, number, number, 'dark' | 'rust']> = [
      [-17, -4.5, -14, 7.5, 12, 10, 2.1, 'dark'],
      [-23, -1.5, -24, 9.5, 13, 12, 3.4, 'rust'],
      [-14, -10.0, -34, 8.0, 10, 10, 4.7, 'dark'],
      [-26, -3.5, -46, 11.0, 13, 13, 6.2, 'dark'],
      [15, -5.5, -10, 7.5, 9.5, 8.0, 9.1, 'rust'],
      [21, -8.5, -24, 9.0, 11.0, 10.5, 10.7, 'dark']
    ];
    cliffSpecs.forEach(([x, y, z, sx, sy, sz, seed, matChoice]) => {
      const m = new THREE.Mesh(
        trackGeo(createCraggyRockGeo(1, 3, seed, 0.44)),
        matChoice === 'rust' ? rustRockMat : darkCliffMat
      );
      m.position.set(x, y, z);
      m.scale.set(sx, sy, sz);
      m.receiveShadow = true;
      cliffGroup.add(m);
    });
    scene.add(cliffGroup);

    // 6. VAST TEXTURED ALTIPLANO PLAIN, STRAIGHT HIGHWAY & PEÑAS VILLAGE
    const valleyGroup = new THREE.Group();
    const plainGeo = trackGeo(new THREE.PlaneGeometry(420, 240, 110, 72));
    plainGeo.rotateX(-Math.PI / 2);
    const plainPos = plainGeo.attributes.position;
    for (let i = 0; i < plainPos.count; i++) {
      const px = plainPos.getX(i);
      const pz = plainPos.getZ(i) - 85;
      plainPos.setY(i, altiplanoHeight(px, pz) + 18);
    }
    plainGeo.computeVertexNormals();

    const altiplanoTex = trackTex(createAltiplanoTexture());
    const plainMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: altiplanoTex,
        roughness: 0.94,
        metalness: 0.01
      })
    );
    const altiplano = new THREE.Mesh(plainGeo, plainMat);
    altiplano.position.set(0, -18, -85);
    altiplano.receiveShadow = true;
    valleyGroup.add(altiplano);

    // Long straight Altiplano highway hugging the terrain height
    const roadMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x3b3d46,
        roughness: 0.85,
        metalness: 0.04,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
      })
    );
    const roadGeo = trackGeo(new THREE.PlaneGeometry(1.15, 130, 1, 48));
    roadGeo.rotateX(-Math.PI / 2);
    roadGeo.rotateY(-0.22);
    roadGeo.translate(4, 0, -76);
    const roadPos = roadGeo.attributes.position;
    for (let i = 0; i < roadPos.count; i++) {
      const rx = roadPos.getX(i);
      const rz = roadPos.getZ(i);
      roadPos.setY(i, altiplanoHeight(rx, rz) + 0.14);
    }
    roadGeo.computeVertexNormals();
    const highway = new THREE.Mesh(roadGeo, roadMat);
    valleyGroup.add(highway);

    // Peñas village nestled at cliff foot
    const wallMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xe6d3bc, roughness: 0.85 }));
    const roofMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x9e4726, roughness: 0.78 }));
    for (let i = 0; i < 20; i++) {
      const hx = -9 + (i % 6) * 2.2 + ((i * 7) % 5) * 0.18;
      const hz = -34 - Math.floor(i / 6) * 2.6 + ((i * 3) % 4) * 0.2;
      const hy = altiplanoHeight(hx, hz);
      const house = new THREE.Group();
      house.position.set(hx, hy, hz);
      house.rotation.y = (i % 3) * 0.12;
      const body = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.05, 0.62, 0.8)), wallMat);
      body.position.y = 0.31;
      const roof = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.8, 0.38, 4)), roofMat);
      roof.position.y = 0.8;
      roof.rotation.y = Math.PI / 4;
      house.add(body, roof);
      valleyGroup.add(house);
    }

    // Colonial Church Spire standing out in Peñas plaza
    const churchX = -3.8;
    const churchZ = -38.5;
    const churchY = altiplanoHeight(churchX, churchZ);
    const churchGroup = new THREE.Group();
    churchGroup.position.set(churchX, churchY, churchZ);
    const nave = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.3, 0.9, 2.1)), wallMat);
    nave.position.y = 0.45;
    const naveRoof = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(1.35, 0.55, 4)), roofMat);
    naveRoof.position.y = 1.15;
    naveRoof.rotation.y = Math.PI / 4;
    const bellTower = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.58, 1.7, 0.58)), wallMat);
    bellTower.position.set(0.42, 0.85, 0.78);
    const towerCap = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.45, 0.5, 4)), roofMat);
    towerCap.position.set(0.42, 1.95, 0.78);
    towerCap.rotation.y = Math.PI / 4;
    churchGroup.add(nave, naveRoof, bellTower, towerCap);
    valleyGroup.add(churchGroup);

    // Eucalyptus trees around Peñas village
    const treeCount = 24;
    const treeGeo = trackGeo(new THREE.DodecahedronGeometry(0.42, 1));
    const treeMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x334d35, roughness: 0.9, metalness: 0.0 })
    );
    const treeMesh = new THREE.InstancedMesh(treeGeo, treeMat, treeCount);
    for (let i = 0; i < treeCount; i++) {
      const tx = -11 + (i % 8) * 2.5 + (Math.random() - 0.5);
      const tz = -33 - Math.floor(i / 8) * 3.8 + (Math.random() - 0.5);
      const ty = altiplanoHeight(tx, tz) + 0.55;
      _dummy.position.set(tx, ty, tz);
      _dummy.scale.set(0.8 + Math.random() * 0.4, 1.25 + Math.random() * 0.55, 0.8 + Math.random() * 0.4);
      _dummy.rotation.y = Math.random() * Math.PI;
      _dummy.updateMatrix();
      treeMesh.setMatrixAt(i, _dummy.matrix);
    }
    treeMesh.instanceMatrix.needsUpdate = true;
    treeMesh.computeBoundingSphere();
    valleyGroup.add(treeMesh);
    scene.add(valleyGroup);

    // 7. HIGH-RESOLUTION ALPINE CORDILLERA REAL WITH ILLAMPU, HUAYNA POTOSÍ & ILLIMANI
    const cordilleraWidth = 520;
    const cordilleraDepth = 120;
    const segW = 240;
    const segD = 64;
    const cordGeo = trackGeo(new THREE.PlaneGeometry(cordilleraWidth, cordilleraDepth, segW, segD));
    cordGeo.rotateX(-Math.PI / 2);

    const cordPos = cordGeo.attributes.position;
    for (let i = 0; i < cordPos.count; i++) {
      const vx = cordPos.getX(i);
      const vz = cordPos.getZ(i); // -60 .. +60

      const zNorm = (vz + cordilleraDepth * 0.5) / cordilleraDepth;
      const spineEnv = Math.pow(Math.sin(Math.pow(zNorm, 0.9) * Math.PI), 0.85);
      const sideEnv = Math.max(0.05, 1 - Math.pow(Math.abs(vx) / (cordilleraWidth * 0.52), 2.4));

      // Three majestic Cordillera Real glacier massifs: Illampu (left), Huayna Potosi (center), Illimani (right)
      const dxIllampu = (vx + 68) / 28;
      const dzIllampu = (vz - 2) / 24;
      const illampuPyramid =
        Math.max(0, 1 - Math.sqrt(dxIllampu * dxIllampu + dzIllampu * dzIllampu) * 0.72) * 38.5;

      const dxHuayna = (vx - 2) / 24;
      const dzHuayna = (vz - 4) / 21;
      const huaynaPyramid =
        Math.max(0, 1 - Math.sqrt(dxHuayna * dxHuayna + dzHuayna * dzHuayna) * 0.78) * 36.0;

      const dxIllimani = (vx - 74) / 30;
      const dzIllimani = (vz + 1) / 24;
      const illimaniPyramid =
        Math.max(0, 1 - Math.sqrt(dxIllimani * dxIllimani + dzIllimani * dzIllimani) * 0.72) * 37.5;

      // Secondary serrated connecting peaks (Condoriri, Chachacomani, Mururata)
      const dxCondoriri = (vx + 32) / 22;
      const condoririPeak = Math.exp(-dxCondoriri * dxCondoriri) * 18.5;
      const dxMururata = (vx - 38) / 24;
      const mururataPeak = Math.exp(-dxMururata * dxMururata) * 19.5;
      const dxFarLeft = (vx + 132) / 36;
      const farLeftPeak = Math.exp(-dxFarLeft * dxFarLeft) * 20.0;
      const dxFarRight = (vx - 138) / 38;
      const farRightPeak = Math.exp(-dxFarRight * dxFarRight) * 19.0;

      // Sharp alpine ridged multifractal ribs & glacial arêtes
      const ridgeMajor = Math.pow(ridgedNoise2D(vx * 0.025 + 4.3, vz * 0.036 + 7.9, 4), 1.25);
      const ridgeFine = ridgedNoise2D(vx * 0.085 + 1.2, vz * 0.095 + 2.4, 3);
      const baseChain = (9.5 + ridgeMajor * 19.0 + ridgeFine * 6.5) * spineEnv;

      const mainPeaks =
        Math.max(illampuPyramid, huaynaPyramid, illimaniPyramid) +
        Math.max(condoririPeak, mururataPeak, farLeftPeak, farRightPeak) * 0.45;

      const sculptedPeak = mainPeaks * (0.76 + ridgeMajor * 0.34) * Math.pow(spineEnv, 0.55);
      const height = Math.max(0, (baseChain * 0.65 + sculptedPeak) * sideEnv);

      cordPos.setY(i, height);
    }
    cordGeo.computeVertexNormals();

    // Sunset alpenglow elevation + slope vertex coloring
    const cordNorm = cordGeo.attributes.normal;
    const cordColors = new Float32Array(cordPos.count * 3);
    const cAlpenglowSnow = new THREE.Color(0xffdfc9);
    const cWarmSnow = new THREE.Color(0xf7c5b2);
    const cGlacierBlue = new THREE.Color(0x98a8cc);
    const cRockShadow = new THREE.Color(0x3a3245);
    const cScreeWarm = new THREE.Color(0x7d5846);
    const cFoothill = new THREE.Color(0x8e6644);
    const cTmp = new THREE.Color();

    for (let i = 0; i < cordPos.count; i++) {
      const py = cordPos.getY(i);
      const nx = cordNorm.getX(i);
      const ny = cordNorm.getY(i);
      const px = cordPos.getX(i);

      const snowLine = 15.5 + (fbm2D(px * 0.04, 1.7, 2) - 0.5) * 4.5;
      // Sun comes from left (-x): slopes facing -x get golden-pink alpenglow; east faces hold cool glacier blue
      const sunFacing = THREE.MathUtils.clamp(-nx * 0.75 + 0.45, 0, 1);

      if (py > snowLine && ny > 0.48) {
        const snowMix = THREE.MathUtils.clamp((py - snowLine) / 8.5, 0, 1);
        cTmp.copy(cGlacierBlue).lerp(cWarmSnow, snowMix * 0.7 + sunFacing * 0.3);
        cTmp.lerp(cAlpenglowSnow, sunFacing * snowMix * 0.85);
      } else if (py > 8.0) {
        const rockMix = THREE.MathUtils.clamp((py - 8.0) / 11.0, 0, 1);
        cTmp.copy(cScreeWarm).lerp(cRockShadow, rockMix);
        if (py > snowLine - 1.5 && ny > 0.38) {
          cTmp.lerp(sunFacing > 0.5 ? cWarmSnow : cGlacierBlue, 0.42);
        }
      } else {
        const lowMix = THREE.MathUtils.clamp(py / 8.0, 0, 1);
        cTmp.copy(cFoothill).lerp(cScreeWarm, lowMix);
      }

      cordColors[i * 3] = cTmp.r;
      cordColors[i * 3 + 1] = cTmp.g;
      cordColors[i * 3 + 2] = cTmp.b;
    }
    cordGeo.setAttribute('color', new THREE.BufferAttribute(cordColors, 3));

    const cordilleraMat = trackMat(
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.82,
        metalness: 0.02
      })
    );
    const cordilleraMesh = new THREE.Mesh(cordGeo, cordilleraMat);
    cordilleraMesh.position.set(0, -18.5, -172);
    scene.add(cordilleraMesh);

    // Dusk ochre Andean foothills ridge sitting in front of the snow range (z = -124)
    const foothillGeo = trackGeo(new THREE.PlaneGeometry(460, 48, 128, 22));
    foothillGeo.rotateX(-Math.PI / 2);
    const fPos = foothillGeo.attributes.position;
    for (let i = 0; i < fPos.count; i++) {
      const fx = fPos.getX(i);
      const fz = fPos.getZ(i);
      const fEnv = Math.sin(((fz + 24) / 48) * Math.PI);
      const fH = ridgedNoise2D(fx * 0.03 + 11.4, fz * 0.04 + 2.2, 3) * 11.0 * fEnv;
      fPos.setY(i, fH);
    }
    foothillGeo.computeVertexNormals();
    const foothillMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x7e5a40,
        roughness: 0.92,
        metalness: 0.01
      })
    );
    const foothillMesh = new THREE.Mesh(foothillGeo, foothillMat);
    foothillMesh.position.set(0, -18.2, -124);
    scene.add(foothillMesh);

    // 8. SOARING ANDEAN CONDOR OVER THE SUNSET VALLEY
    const condorGroup = new THREE.Group();
    const condorDarkMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x1a191b, roughness: 0.7, metalness: 0.05 })
    );
    const condorWhiteMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xf4ece1, roughness: 0.6, metalness: 0.02 })
    );
    const beakMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x9b7256, roughness: 0.5 }));

    const condorBody = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.14, 0.55, 6, 10)),
      condorDarkMat
    );
    condorBody.rotation.x = Math.PI / 2;
    condorGroup.add(condorBody);

    const ruffCollar = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.15, 0.045, 8, 14)),
      condorWhiteMat
    );
    ruffCollar.position.set(0, 0.02, -0.28);
    condorGroup.add(ruffCollar);

    const condorHead = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.09, 10, 8)), beakMat);
    condorHead.position.set(0, 0.03, -0.4);
    condorGroup.add(condorHead);

    const condorTail = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.32, 0.03, 0.42)), condorDarkMat);
    condorTail.position.set(0, 0, 0.46);
    condorGroup.add(condorTail);

    const leftWingPivot = new THREE.Group();
    leftWingPivot.position.set(-0.14, 0.02, -0.05);
    const leftInnerWing = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.15, 0.04, 0.46)),
      condorDarkMat
    );
    leftInnerWing.position.set(-0.57, 0, 0);
    const leftWhiteCovert = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.75, 0.045, 0.16)),
      condorWhiteMat
    );
    leftWhiteCovert.position.set(-0.52, 0.01, -0.05);
    leftWingPivot.add(leftInnerWing, leftWhiteCovert);

    const rightWingPivot = new THREE.Group();
    rightWingPivot.position.set(0.14, 0.02, -0.05);
    const rightInnerWing = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.15, 0.04, 0.46)),
      condorDarkMat
    );
    rightInnerWing.position.set(0.57, 0, 0);
    const rightWhiteCovert = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.75, 0.045, 0.16)),
      condorWhiteMat
    );
    rightWhiteCovert.position.set(0.52, 0.01, -0.05);
    rightWingPivot.add(rightInnerWing, rightWhiteCovert);

    condorGroup.add(leftWingPivot, rightWingPivot);
    scene.add(condorGroup);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = Math.max(mountRef.current.clientWidth, 240);
      const h = Math.max(mountRef.current.clientHeight, 220);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const stopResizeObserver = observeElementResize(container, handleResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext | null;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const status = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const updateHotspotPin = (id: string, worldPos: THREE.Vector3, vw: number, vh: number) => {
      const el = hotspotRefs.current[id];
      if (!el) return;
      _projVec.copy(worldPos).project(camera);
      const inFront = _projVec.z < 1 && _projVec.z > -1;
      const sx = (_projVec.x * 0.5 + 0.5) * vw;
      const sy = (-_projVec.y * 0.5 + 0.5) * vh;

      if (!inFront || sx < 32 || sx > vw - 32 || sy < 24 || sy > vh - 36) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      } else {
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
        el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -100%)`;
      }
    };

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Condor soaring thermal orbit
      const orbitAngle = elapsed * 0.28;
      const cx = Math.cos(orbitAngle) * 14;
      const cz = -22 + Math.sin(orbitAngle) * 11;
      const cy = 6.3 + Math.sin(elapsed * 0.6) * 0.9;
      condorGroup.position.set(cx, cy, cz);
      condorGroup.rotation.y = -orbitAngle + Math.PI;
      condorGroup.rotation.z = 0.22;
      const wingFlap = Math.sin(elapsed * 2.4) * 0.14;
      leftWingPivot.rotation.z = wingFlap;
      rightWingPivot.rotation.z = -wingFlap;

      const presetReq = presetRequestRef.current;
      if (presetReq.active) {
        if (presetReq.followCondor) {
          _targetGoal.set(cx, cy, cz);
          _camGoal.set(cx * 0.45 + 3.0, cy + 1.8, cz + 11.5);
        } else {
          _camGoal.copy(presetReq.position);
          _targetGoal.copy(presetReq.target);
        }

        camera.position.x = THREE.MathUtils.damp(camera.position.x, _camGoal.x, 5.2, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _camGoal.y, 5.2, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _camGoal.z, 5.2, delta);

        controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetGoal.x, 5.2, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetGoal.y, 5.2, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetGoal.z, 5.2, delta);

        if (
          !presetReq.followCondor &&
          camera.position.distanceTo(_camGoal) < 0.08 &&
          controls.target.distanceTo(_targetGoal) < 0.15
        ) {
          presetReq.active = false;
        }
      }

      controls.update();
      if (camera.position.z > -6 && camera.position.y < 1.25) {
        camera.position.y = 1.25;
      }

      renderer.render(scene, camera);

      const vw = container.clientWidth || width;
      const vh = container.clientHeight || height;
      STATIC_LANDMARKS.forEach((lm) => updateHotspotPin(lm.id, lm.worldPos, vw, vh));
      _condorWorldPos.set(cx, cy + 0.65, cz);
      updateHotspotPin('condor', _condorWorldPos, vw, vh);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    if (isSoftwareGl) {
      renderer.render(scene, camera);
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      stopResizeObserver();
      controls.removeEventListener('start', cancelPresetOnUserInput);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();
      envTarget.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const currentInfo = CAMERA_PRESETS.find((p) => p.id === activePreset) || CAMERA_PRESETS[0];

  return (
    <div className="rounded-2xl overflow-hidden border border-[#D9A05B]/50 bg-[#081523] shadow-xl select-none">
      {/* Top Bar Outside 3D Canvas */}
      <div className="px-3.5 py-2.5 bg-[#0B1D2E] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FFF8E7]">
            <Compass className="w-4 h-4 text-[#F5B700] shrink-0" />
            <span className="truncate">Mirador Nido de Cóndor (Wiraconi) · Atardecer</span>
          </div>
          <div className="text-[11px] text-[#CBD5E1]">
            Arrastra para explorar · Toca un nevado o el Cartel Wiraconi para enfocarlo
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!showPhotos && (
            <button
              type="button"
              onClick={() => handleSelectPreset('mirador')}
              title="Centrar vista inicial"
              className="inline-flex items-center gap-1 px-2.5 min-h-[36px] rounded-lg bg-[#17334E] hover:bg-[#1D4E89] border border-white/15 text-[11px] font-medium text-[#E2DDD2] hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#F5B700]" />
              <span className="hidden sm:inline">Centrar</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setShowPhotos((v) => !v);
            }}
            className="inline-flex items-center gap-1.5 px-3 min-h-[36px] rounded-lg bg-[#17334E] hover:bg-[#1D4E89] border border-[#4EA8DE]/45 text-[11px] sm:text-xs font-semibold text-[#E2DDD2] hover:text-white cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-[#4EA8DE]" />
            <span>{showPhotos ? 'Volver al 3D' : 'Fotos Reales'}</span>
          </button>
        </div>
      </div>

      {/* Unobstructed 3D Viewport */}
      <div className="relative w-full h-[320px] sm:h-[390px] bg-[#081523]">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {webglLost && (
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 p-6 text-center"
            style={{ backgroundColor: 'rgba(8, 21, 35, 0.94)' }}
          >
            <Compass className="w-8 h-8 text-[#F5B700]" />
            <p className="text-sm font-semibold text-[#FFF8E7]">
              La vista 3D está restaurando su contexto gráfico.
            </p>
            <button
              type="button"
              onClick={() => setShowPhotos(true)}
              className="px-4 py-2 rounded-lg bg-[#F5B700] text-[#1A1207] text-xs font-bold cursor-pointer"
            >
              Ver Fotos Reales del Mirador
            </button>
          </div>
        )}

        {/* Projected Clickable 3D Peak & Landmark Pins */}
        {!showPhotos &&
          !webglLost &&
          [
            ...STATIC_LANDMARKS.map((l) => ({
              id: l.id,
              label: l.label,
              sub: l.elevation,
              isMountainPeak: l.isMountainPeak
            })),
            { id: 'condor' as CameraPresetId, label: 'Cóndor Andino', sub: 'En vuelo', isMountainPeak: false }
          ].map((pin) => {
            const isFocused = activePreset === pin.id;
            return (
              <button
                key={pin.id}
                ref={(el) => {
                  hotspotRefs.current[pin.id] = el;
                }}
                type="button"
                onClick={() => handleSelectPreset(pin.id)}
                style={{
                  opacity: 0,
                  backgroundColor: isFocused ? '#F5B700' : 'rgba(14, 18, 32, 0.84)'
                }}
                className={`absolute top-0 left-0 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] sm:text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors shadow-lg ${
                  isFocused
                    ? 'border-[#FFF8E7] text-[#1A1207]'
                    : pin.isMountainPeak
                      ? 'border-[#FFD166]/80 text-[#FFF8E7] hover:border-[#F5B700]'
                      : 'border-[#F5B700]/65 text-[#FFF8E7] hover:border-[#FFD166]'
                }`}
              >
                {pin.isMountainPeak ? (
                  <Mountain className={`w-3 h-3 shrink-0 ${isFocused ? 'text-[#1A1207]' : 'text-[#FFD166]'}`} />
                ) : (
                  <MapPin className={`w-3 h-3 shrink-0 ${isFocused ? 'text-[#1A1207]' : 'text-[#F5B700]'}`} />
                )}
                <span>{pin.label}</span>
                <span className={`font-mono-num text-[9px] sm:text-[10px] ${isFocused ? 'text-[#3A280B]' : 'text-[#FBC48A]'}`}>
                  {pin.sub}
                </span>
              </button>
            );
          })}

        {showPhotos && (
          <div
            style={{ backgroundColor: 'rgba(8, 21, 35, 0.98)' }}
            className="absolute inset-0 z-20 p-3 sm:p-4 flex flex-col gap-3 overflow-y-auto"
          >
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#F5B700]">
                Fotografías Reales del Mirador Wiraconi / Nido de Cóndor
              </h4>
              <p className="text-[11px] text-[#CBD5E1]">
                Observa la imponente cadena nevada al fondo del Altiplano.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-2">
              {REFERENCE_PHOTOS.map((photo, idx) => (
                <figure
                  key={idx}
                  className="rounded-xl overflow-hidden border border-white/15 bg-[#0D2134] flex flex-col"
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-36 object-cover"
                  />
                  <figcaption className="p-2 text-[11px] text-[#E2DDD2] leading-snug">
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Camera Presets & Active Landmark Info Cleanly Below 3D Canvas */}
      {!showPhotos && (
        <div className="bg-[#0B1D2E] border-t border-white/10 p-3 space-y-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {CAMERA_PRESETS.map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`min-h-[34px] px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap inline-flex items-center gap-1 cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#F5B700] text-[#1A1207]'
                      : 'bg-[#17334E] hover:bg-[#1D4E89] text-[#E2DDD2]'
                  }`}
                >
                  <Eye className="w-3 h-3 shrink-0" />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl bg-[#081523] border border-[#4EA8DE]/30 px-3.5 py-2 flex items-center gap-3 text-xs">
            <AymaraFullBodyAvatar
              config={playerAvatar}
              pose="cheer"
              heldItem="compass"
              className="w-11 h-[68px] shrink-0"
              showGroundShadow={false}
            />
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-[#FFD166]">
                <Info className="w-3.5 h-3.5 text-[#F5B700] shrink-0" />
                <span className="truncate">
                  {playerName} en {currentInfo.infoTitle}
                </span>
              </div>
              <p className="text-[#E2DDD2] leading-snug">{currentInfo.infoText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
