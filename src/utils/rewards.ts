import { PlayerProgress, StageData, TravelerProfileInfo, TravelerTrait } from '../types/game';
import { TRAVELER_PROFILES } from '../data/defaultStages';

export function generateVoucherCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `PENAS-PZ-${suffix}`;
}

export function getDominantTravelerProfile(
  scores: Record<TravelerTrait, number>,
  profiles: Record<TravelerTrait, TravelerProfileInfo> = TRAVELER_PROFILES
): TravelerProfileInfo {
  const entries = Object.entries(scores) as [TravelerTrait, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const topTrait = entries[0]?.[0] || 'cultural';
  return profiles[topTrait] || TRAVELER_PROFILES[topTrait];
}

export function getPlayerRank(progress: PlayerProgress): {
  rankTitle: 'Guardián de Peñas' | 'Explorador de Peñas';
  badgeDescription: string;
} {
  if (progress.firstTryWins.length >= 5) {
    return {
      rankTitle: 'Guardián de Peñas',
      badgeDescription:
        'Has superado la mayoría de los desafíos al primer intento, demostrando profundo respeto por la memoria histórica, natural y comunitaria de Peñas.'
    };
  }
  return {
    rankTitle: 'Explorador de Peñas',
    badgeDescription:
      'Has recorrido con perseverancia las 7 etapas del sendero andino, descubriendo los tesoros culturales, naturales y humanos de Peñas.'
  };
}

function triggerHtmlDownload(filename: string, htmlContent: string) {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export const PENAS_GOOGLE_MAP_VIEW_URL =
  'https://www.google.com/maps/d/u/0/viewer?mid=11jZF6ya_2XSWbk7nVLS-2_BJDKA&femb=1&ll=-16.23958595699942%2C-68.50145103096618&z=13';

export const PENAS_GOOGLE_MAP_EMBED_URL =
  'https://www.google.com/maps/d/u/0/embed?mid=11jZF6ya_2XSWbk7nVLS-2_BJDKA&ll=-16.23958595699942%2C-68.50145103096618&z=13';

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function downloadTouristGuide(
  _stages: StageData[],
  progress: PlayerProgress,
  profiles: Record<TravelerTrait, TravelerProfileInfo> = TRAVELER_PROFILES
) {
  const profile = getDominantTravelerProfile(progress.traitScores, profiles);
  const { rankTitle } = getPlayerRank(progress);
  const traveler = escapeHtml(progress.playerName.trim() || 'Viajero de Peñas');

  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Guía de Viaje para Visitar Peñas — La Paz, Bolivia</title>
  <style>
    :root {
      --ink: #1e2421;
      --muted: #555e58;
      --paper: #fffdf8;
      --sand: #f4efe4;
      --earth: #7a4921;
      --gold: #d99b26;
      --pine: #1f5c43;
      --sky: #164875;
      --rust: #9b3d28;
      --line: #dfd5c2;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: var(--ink);
      background: var(--sand);
      margin: 0;
      padding: 24px 16px 48px;
      line-height: 1.58;
    }
    .sheet {
      max-width: 960px;
      margin: 0 auto;
      background: var(--paper);
      border: 2px solid var(--earth);
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 18px 44px rgba(30, 36, 33, 0.1);
    }
    .header {
      border-bottom: 3px solid var(--pine);
      padding-bottom: 18px;
      margin-bottom: 22px;
    }
    .kicker {
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--sky);
      font-weight: 700;
    }
    h1 {
      font-family: Georgia, 'Times New Roman', serif;
      color: #2f1d0e;
      margin: 6px 0 8px;
      font-size: 32px;
      line-height: 1.18;
    }
    h2 {
      font-family: Georgia, 'Times New Roman', serif;
      color: var(--sky);
      font-size: 22px;
      margin: 30px 0 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid var(--line);
    }
    h3 {
      color: #2f1d0e;
      font-size: 16px;
      margin: 0 0 6px;
    }
    p { margin: 0 0 10px; }
    ul { margin: 6px 0 10px; padding-left: 20px; }
    li { margin-bottom: 4px; }
    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
      font-size: 13px;
    }
    .pill-tag {
      background: #eef5f1;
      border: 1px solid #b9d9c8;
      color: var(--pine);
      border-radius: 999px;
      padding: 4px 12px;
      font-weight: 600;
    }
    .toc {
      background: #f9f5ec;
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 14px 18px;
      margin-bottom: 22px;
    }
    .toc-title {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--earth);
      font-weight: 700;
      margin-bottom: 8px;
    }
    .toc-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 14px;
      font-size: 13px;
    }
    .toc-links a {
      color: var(--sky);
      text-decoration: none;
      font-weight: 600;
    }
    .toc-links a:hover { text-decoration: underline; }
    .profile-box {
      background: linear-gradient(135deg, #eef6f1 0%, #f5f8fc 100%);
      border: 1.5px solid var(--pine);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 22px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 14px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
    }
    .card {
      background: #fcfaf4;
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 15px 16px;
    }
    .card-accent {
      background: #fff9eb;
      border: 1px solid #e2bc72;
      border-radius: 12px;
      padding: 15px 16px;
    }
    .alert-box {
      background: #fdf2ee;
      border: 1.5px solid #d4826e;
      border-radius: 12px;
      padding: 15px 18px;
      margin-top: 14px;
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 8px;
      border-radius: 6px;
      background: #e8eff7;
      color: var(--sky);
      margin-bottom: 6px;
    }
    .badge-green { background: #e3f2ea; color: var(--pine); }
    .badge-gold { background: #faefd4; color: #87550a; }
    .badge-rust { background: #fae7e2; color: var(--rust); }
    .map-wrap {
      border: 1.5px solid var(--sky);
      border-radius: 14px;
      overflow: hidden;
      background: #eef4fa;
      margin-bottom: 14px;
    }
    .map-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px 16px;
      background: #102a43;
      color: #fff8e7;
    }
    .map-btn {
      display: inline-block;
      background: #f5b700;
      color: #1c1306;
      text-decoration: none;
      font-weight: 700;
      font-size: 13px;
      padding: 8px 14px;
      border-radius: 8px;
    }
    .map-iframe {
      width: 100%;
      height: 430px;
      border: 0;
      display: block;
      background: #dbe6f0;
    }
    .svg-map-card {
      background: #f7f4eb;
      border: 1.5px solid #c9bea7;
      border-radius: 14px;
      padding: 14px;
      margin: 14px 0;
    }
    .svg-map-card svg {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 10px;
      background: #efe8d8;
      border: 1px solid #d6cbb3;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 8px;
    }
    th, td {
      text-align: left;
      padding: 9px 10px;
      border-bottom: 1px solid var(--line);
      vertical-align: top;
    }
    th {
      background: #f3ece0;
      color: #3b2714;
      font-weight: 700;
    }
    .small { font-size: 12.5px; color: var(--muted); }
    .footer {
      margin-top: 30px;
      padding-top: 16px;
      border-top: 1px solid var(--line);
      font-size: 12px;
      color: var(--muted);
      text-align: center;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .sheet { border: none; box-shadow: none; padding: 12px; }
      .map-wrap iframe { display: none; }
      .no-print { display: none; }
      h2 { page-break-after: avoid; }
      .card, .card-accent, .alert-box, .svg-map-card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <article class="sheet">
    <header class="header">
      <div class="kicker">Cordillera Real · Departamento de La Paz, Bolivia · ~4.000 m s. n. m.</div>
      <h1>Guía de Viaje para Visitar Peñas</h1>
      <p>Guía práctica comunitaria con recomendaciones de visita, atractivos generales, rutas de trekking, escalada, hospedajes, cafetería y mapa georreferenciado.</p>
      <div class="meta-bar">
        <span class="pill-tag">Viajero: ${traveler}</span>
        <span class="pill-tag">Título: ${escapeHtml(rankTitle)}</span>
        <span class="pill-tag">Perfil: ${escapeHtml(profile.title)}</span>
      </div>
    </header>

    <section class="profile-box">
      <h3>Recomendación personalizada según tu perfil (${escapeHtml(profile.title)})</h3>
      <p>${escapeHtml(profile.description)}</p>
      <p class="small"><strong>Sugerencia de recorrido:</strong> ${escapeHtml(profile.recommendation)}</p>
    </section>

    <nav class="toc no-print" aria-label="Índice de la guía">
      <div class="toc-title">Contenido ordenado de la guía</div>
      <div class="toc-links">
        <a href="#practico">1. Acceso y Recomendaciones</a>
        <a href="#mapa">2. Mapa de Peñas</a>
        <a href="#atractivos">3. Atractivos y Trekking</a>
        <a href="#escalada">4. Escalada y Alta Montaña</a>
        <a href="#hospedajes">5. Hospedajes</a>
        <a href="#cafeteria">6. Cafetería Virgen de la Natividad</a>
      </div>
    </nav>

    <section id="practico">
      <h2>1. Presentación y Recomendaciones Clave</h2>
      <p>Peñas es un acogedor pueblo andino situado en el corazón de la Cordillera Real, entre la ciudad de La Paz y el Lago Titicaca (a unos 60 km / 1 h 30 min a 2 horas por carretera, a ~4.000 m s. n. m.).</p>

      <div class="grid-2">
        <div class="card">
          <span class="badge">Cómo llegar</span>
          <h3>Acceso y Transporte</h3>
          <ul>
            <li><strong>Desde La Paz / El Alto:</strong> Transporte público diario de <strong>05:00 a 18:00</strong> desde la <strong>Terminal Interprovincial de El Alto</strong> (compra el boleto antes de subir).</li>
            <li><strong>Desde Copacabana u otros destinos:</strong> Peñas no cuenta con terminal; baja en <strong>Palcoco</strong> y coordina un transfer o taxi hasta el pueblo.</li>
            <li><strong>Vehículo propio:</strong> Sigue la carretera internacional hasta <strong>“el cruce a Peñas”</strong> (otros desvíos son de ripio y confusos). No es habitual hacer dedo.</li>
          </ul>
        </div>

        <div class="card">
          <span class="badge badge-gold">Provisiones</span>
          <h3>Alimentación y Feria Semanal</h3>
          <ul>
            <li>En el pueblo hay pocas tiendas de barrio con productos básicos (fideos, arroz, aceite, huevos y queso).</li>
            <li><strong>Feria semanal:</strong> Únicamente los <strong>sábados de 06:00 a 12:00</strong> en la Plaza Principal (único día para comprar frutas, verduras y carne).</li>
            <li>Si planeas cocinar por tu cuenta otros días, abastécete antes en La Paz o El Alto.</li>
          </ul>
        </div>

        <div class="card">
          <span class="badge badge-rust">Salud e Hidratación</span>
          <h3>Agua y Clima de Altura</h3>
          <ul>
            <li><strong>No hay agua potable:</strong> Hierve siempre el agua antes de beber o cepillarte los dientes, usa pastillas potabilizadoras o compra agua embotellada en las tiendas del pueblo.</li>
            <li>A ~4.000 m s. n. m. las mañanas y noches son frías: lleva ropa abrigada en capas, cortaviento, gorro, protector solar y lentes UV.</li>
          </ul>
        </div>

        <div class="card">
          <span class="badge badge-green">Conectividad y Respeto</span>
          <h3>Telefonía y Áreas de Cuidado</h3>
          <ul>
            <li><strong>Telefonía e Internet:</strong> La única operadora móvil con cobertura es <strong>ENTEL</strong> (señal inestable, especialmente con lluvias). Casi todos los hospedajes tienen Wi-Fi sujeto al clima.</li>
            <li><strong>Convivencia:</strong> Saluda con cordialidad, pide permiso antes de tomar fotografías, <strong>no pises terrenos de cultivo</strong> y llévate todos tus residuos (no hay recolección de basura).</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="mapa">
      <h2>2. Mapa de Peñas y Puntos de Interés</h2>
      <p>Mapa comunitario oficial con atractivos, senderos del Circuito Huellas Andinas, zonas de escalada, bloques de boulder, comercios y galería de murales.</p>

      <div class="map-wrap">
        <div class="map-bar">
          <div>
            <strong>Mapa Interactivo de Peñas (Google My Maps)</strong>
            <div style="font-size:12px;color:#cbd5e1;">Centro aproximado: -16.2396, -68.5015 · Altitud ~4.000 m s. n. m.</div>
          </div>
          <a class="map-btn" href="${PENAS_GOOGLE_MAP_VIEW_URL}" target="_blank" rel="noopener noreferrer">
            Abrir Mapa Completo en Google Maps ↗
          </a>
        </div>
        <iframe
          class="map-iframe"
          src="${PENAS_GOOGLE_MAP_EMBED_URL}"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Mapa turístico interactivo de Peñas, La Paz"
        ></iframe>
      </div>

      <div class="svg-map-card">
        <h3 style="margin-bottom:8px;">Plano Esquemático Offline (basado en coordenadas del mapa oficial)</h3>
        <p class="small" style="margin-bottom:10px;">Útil cuando no tengas cobertura móvil en el sendero. Muestra el casco urbano, las rutas trazadas y los principales atractivos.</p>
        <svg viewBox="0 0 760 520" role="img" aria-label="Plano esquemático de atractivos y rutas de trekking en Peñas">
          <!-- Fondo topográfico suave -->
          <rect width="760" height="520" fill="#efe8d8" />
          <path d="M0,120 Q220,75 430,135 T760,110 L760,520 L0,520 Z" fill="#e6decb" />
          <path d="M0,260 Q260,210 470,295 T760,255 L760,520 L0,520 Z" fill="#ddd3bc" />
          <path d="M180,520 Q360,340 530,385 T760,460 L760,520 Z" fill="#d3c7ad" />

          <!-- Cuadrícula sutil y brújula -->
          <g stroke="#c7bba2" stroke-width="1" stroke-dasharray="4 4" opacity="0.7">
            <line x1="190" y1="0" x2="190" y2="520" />
            <line x1="380" y1="0" x2="380" y2="520" />
            <line x1="570" y1="0" x2="570" y2="520" />
            <line x1="0" y1="173" x2="760" y2="173" />
            <line x1="0" y1="346" x2="760" y2="346" />
          </g>
          <g transform="translate(705,46)">
            <circle cx="0" cy="0" r="22" fill="#fffdf8" stroke="#7a4921" stroke-width="1.5" />
            <polygon points="0,-16 5,0 0,-4 -5,0" fill="#9b3d28" />
            <polygon points="0,16 5,0 0,4 -5,0" fill="#555e58" />
            <text x="0" y="-25" text-anchor="middle" font-size="10" font-weight="700" fill="#2f1d0e">N</text>
          </g>

          <!-- Zona de Pueblo y Murales -->
          <ellipse cx="145" cy="95" rx="68" ry="40" fill="#d99b26" fill-opacity="0.16" stroke="#b37812" stroke-dasharray="5 3" />
          <text x="145" y="48" text-anchor="middle" font-size="11" font-weight="700" fill="#7a4921">Pueblo · 22 Murales y Comercios</text>

          <!-- Zona de Escalada Deportiva y Boulder -->
          <ellipse cx="235" cy="212" rx="74" ry="42" fill="#164875" fill-opacity="0.13" stroke="#164875" stroke-dasharray="5 3" />
          <text x="235" y="216" text-anchor="middle" font-size="11" font-weight="700" fill="#164875">Sectores de Escalada</text>
          <text x="235" y="230" text-anchor="middle" font-size="10" fill="#164875">y Boulder (17 sectores)</text>

          <!-- Rutas de Trekking exactas del KML -->
          <polyline fill="none" stroke="#8a5a44" stroke-width="3.2" stroke-dasharray="7 5" stroke-linecap="round" stroke-linejoin="round"
            points="113.9,108.1 82.1,117.6 84.5,133.2 77.4,147.8 55.2,155.0 56.8,182.2 85.0,207.8 110.2,245.1 175.8,334.6 337.9,419.8 428.6,430.8 416.4,429.7 395.7,425.6 387.6,408.3 374.1,389.5 344.0,344.2 375.1,303.2 351.7,249.8 348.4,190.2 348.6,181.9" />
          <polyline fill="none" stroke="#1f5c43" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"
            points="434.7,425.8 427.1,428.9 413.6,432.1 408.3,437.6 386.7,447.7 394.0,424.7 393.8,412.0 383.7,412.7 375.3,409.6 363.2,393.7 311.5,378.4 312.1,365.0 379.3,358.1 340.5,343.9 355.2,327.8 369.9,317.8 375.1,303.0 366.8,283.6 364.8,268.8 354.3,249.7 369.2,232.4 371.3,213.4 354.6,195.7 348.2,186.8 346.7,181.7" />
          <polyline fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
            points="346.7,181.7 343.7,190.9 352.0,195.7 369.5,216.6 371.8,225.9 357.2,248.8 369.5,296.3 367.1,313.7 354.4,327.1 343.2,343.1 373.1,353.4 390.5,363.2 403.0,365.6" />
          <polyline fill="none" stroke="#9b3d28" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
            points="190.5,112.1 174.3,120.7 160.4,124.0 152.3,140.8 147.6,158.5 140.2,174.1 140.2,186.5 152.5,187.2 153.8,179.1" />

          <!-- Camino de ingreso desde carretera / Arco -->
          <path d="M693,339 Q565,240 430,175 T200,98" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="3 4" />

          <!-- Marcadores principales -->
          <g font-family="Segoe UI, sans-serif" font-size="11" font-weight="700" fill="#1e2421">
            <!-- Plaza Principal -->
            <circle cx="142.6" cy="84.2" r="7" fill="#d99b26" stroke="#2f1d0e" stroke-width="2" />
            <text x="154" y="81">Plaza Principal</text>

            <!-- Iglesia + Cafetería -->
            <circle cx="134.9" cy="93.5" r="5.5" fill="#164875" stroke="#fff" stroke-width="1.5" />
            <text x="122" y="109" text-anchor="end">Iglesia y Cafetería</text>

            <!-- Gruta -->
            <circle cx="93.1" cy="142.5" r="5.5" fill="#164875" stroke="#fff" stroke-width="1.5" />
            <text x="82" y="144" text-anchor="end">Gruta</text>

            <!-- Calvario -->
            <circle cx="153.8" cy="179.1" r="6" fill="#9b3d28" stroke="#fff" stroke-width="1.5" />
            <text x="142" y="200" text-anchor="end">Mirador Calvario</text>

            <!-- Parque Aventura -->
            <circle cx="337.2" cy="173.1" r="7" fill="#1f5c43" stroke="#fff" stroke-width="2" />
            <text x="348" y="169">Parque Aventura B. Bonaldi</text>

            <!-- Saca Cuello -->
            <circle cx="362.4" cy="216.1" r="5.5" fill="#164875" stroke="#fff" stroke-width="1.5" />
            <text x="380" y="220">Saca Cuello</text>

            <!-- Cueva -->
            <circle cx="363.9" cy="314.6" r="5.5" fill="#7a4921" stroke="#fff" stroke-width="1.5" />
            <text x="382" y="317">Cueva</text>

            <!-- Pinturas Rupestres -->
            <circle cx="403.0" cy="368.6" r="6.5" fill="#d97706" stroke="#fff" stroke-width="1.8" />
            <text x="415" y="372">Pinturas Rupestres (Qillqantiji)</text>

            <!-- Ruinas Carmenpata -->
            <circle cx="441.2" cy="423.6" r="7" fill="#9b3d28" stroke="#fff" stroke-width="2" />
            <text x="453" y="427">Ruinas Carmenpata (4.300 m)</text>

            <!-- Arco Bienvenidos -->
            <circle cx="693.3" cy="339.3" r="6.5" fill="#164875" stroke="#fff" stroke-width="1.8" />
            <text x="682" y="357" text-anchor="end">Arco Bienvenidos a Peñas</text>
          </g>

          <!-- Leyenda -->
          <g transform="translate(22, 405)">
            <rect x="0" y="0" width="278" height="96" rx="8" fill="#fffdf8" fill-opacity="0.92" stroke="#c9bea7" />
            <text x="12" y="19" font-size="11" font-weight="700" fill="#2f1d0e">Leyenda de Senderos y Zonas</text>
            <line x1="12" y1="35" x2="36" y2="35" stroke="#9b3d28" stroke-width="3" />
            <text x="44" y="39" font-size="10.5" fill="#1e2421">Trekking Calvario (20–40 min)</text>
            <line x1="12" y1="53" x2="36" y2="53" stroke="#d97706" stroke-width="3" />
            <text x="44" y="57" font-size="10.5" fill="#1e2421">Circuito Pinturas Rupestres (1–2 h)</text>
            <line x1="12" y1="71" x2="36" y2="71" stroke="#1f5c43" stroke-width="3" />
            <text x="44" y="75" font-size="10.5" fill="#1e2421">Sendero a Ruinas Carmenpata (~3 h)</text>
            <line x1="12" y1="87" x2="36" y2="87" stroke="#8a5a44" stroke-width="3" stroke-dasharray="6 4" />
            <text x="44" y="90" font-size="10.5" fill="#1e2421">Huellas Andinas Completo (~5 h)</text>
          </g>
        </svg>
      </div>

      <table>
        <thead>
          <tr>
            <th>Categoría del Mapa</th>
            <th>Puntos Georreferenciados Destacados</th>
            <th>Coordenadas de Referencia</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Atractivos Principales</strong></td>
            <td>Plaza Principal, Iglesia Ntra. Sra. de la Natividad, Gruta, Calvario, Parque Aventura, Saca Cuello, Pinturas Rupestres, Ruinas Carmenpata</td>
            <td>Plaza: -16.23187, -68.50382<br/>Carmenpata: -16.24853, -68.49631</td>
          </tr>
          <tr>
            <td><strong>Rutas de Trekking</strong></td>
            <td>Trekking Calvario, Trekking Pinturas Rupestres, Trekking Iglesia en Ruinas, Recorrido completo Huellas Andinas</td>
            <td>Inicio pueblo: -16.2332, -68.5026<br/>Parque Aventura: -16.2362, -68.4989</td>
          </tr>
          <tr>
            <td><strong>Escalada y Boulder</strong></td>
            <td>19 sectores de escalada (Torre Teresa, Techo del Topio, La Mamacha, Mujer Montaña, Pachamama, Placa del Águila...) y 26 bloques de boulder</td>
            <td>Valle central: -16.2375, -68.5010</td>
          </tr>
          <tr>
            <td><strong>Comercios y Murales</strong></td>
            <td>Cafetería de Peñas, restaurantes, tiendas de abarrotes (Sra. Úrsula, Maritza, Marcela, Don Víctor) y circuito de 22 murales en el centro</td>
            <td>Cafetería: -16.23241, -68.50379</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section id="atractivos">
      <h2>3. Atractivos Turísticos y Senderos (Descripción General)</h2>
      <div class="grid-2">
        <div class="card">
          <span class="badge">Patrimonio y Arquitectura</span>
          <h3>1. Iglesia Nuestra Señora de la Natividad</h3>
          <p>Templo colonial en piedra y adobe ubicado junto a la Plaza Principal, reconocible por su campanario exterior, su retablo barroco en pan de oro y sus pinturas tradicionales. Consulta los horarios de apertura en el pueblo y mantén respeto durante la visita.</p>
        </div>

        <div class="card">
          <span class="badge badge-gold">Arqueología · Guía obligatorio</span>
          <h3>2. Pinturas Rupestres (Parque Arqueológico Qillqantiji)</h3>
          <p>Abrigos rocosos con antiguas expresiones de arte rupestre en tonos blanco y rojo, con figuras humanas y de animales integradas al paisaje de peñascos. <strong>El acceso se realiza únicamente acompañado de un guía local</strong> y pagando el ingreso comunitario.</p>
        </div>

        <div class="card">
          <span class="badge badge-green">Aventura Comunitaria</span>
          <h3>3. Parque de Aventura Battistino Bonaldi</h3>
          <p>Espacio de turismo de aventura con circuitos de tres tirolesas (de más de 100 m), vía ferrata, puentes colgantes, rapel y escalada en roca. Los ingresos apoyan directamente obras sociales de la comunidad.</p>
        </div>

        <div class="card">
          <span class="badge badge-rust">Mirador 360° · 4.300 m</span>
          <h3>4. Ruinas de Carmenpata (Mirador Nido de Cóndores)</h3>
          <p>Antigua capilla en ruinas ubicada en la cima de la colina que domina Peñas (caminata de 2 a 3 horas desde la plaza). Ofrece amplias vistas panorámicas de 360° hacia la Cordillera Real, el Altiplano y el Lago Titicaca.</p>
        </div>

        <div class="card">
          <span class="badge">Arte Urbano</span>
          <h3>5. Galería de Murales de Peñas</h3>
          <p>Recorrido libre por <strong>22 murales</strong> pintados en fachadas del pueblo que retratan textiles andinos, fauna silvestre, escenas cotidianas y cumbres nevadas.</p>
        </div>

        <div class="card">
          <span class="badge badge-gold">Sabores Locales</span>
          <h3>6. Queso Tradicional y Licor de K’oa</h3>
          <p><strong>Queso criollo:</strong> Visita vivencial para conocer la elaboración artesanal con leche fresca de vaca de altura sin conservantes (consulta en tu hospedaje). <strong>Licor de k’oa:</strong> Macerado artesanal de hierba andina de aroma herbal fresco y uso digestivo.</p>
        </div>
      </div>

      <div class="card-accent" style="margin-top:14px;">
        <h3>7. Rutas de Trekking Recomendadas</h3>
        <ul>
          <li><strong>Mirador del Calvario (20–40 min desde la plaza · Fácil–Moderada):</strong> Sendero corto ideal para aclimatarse en el primer día y disfrutar vistas de 360° del pueblo.</li>
          <li><strong>Circuito Pinturas Rupestres (1–2 h · Fácil):</strong> Caminata entre formaciones rocosas cercana al Parque de Aventura; coordinar guía local en el pueblo.</li>
          <li><strong>Circuito Huellas Andinas (~5,4 km · 3 a 5 h · Moderada):</strong> Trayecto de puna con presencia de llamas y alpacas que conecta los paisajes altos hasta las Ruinas de Carmenpata.</li>
        </ul>
      </div>
    </section>

    <section id="escalada">
      <h2>4. Escalada en Roca y Alta Montaña</h2>
      <div class="grid-2">
        <div class="card">
          <span class="badge">Escalada Deportiva y Boulder</span>
          <h3>Más de 150 Rutas en 17 Sectores</h3>
          <p>Peñas destaca por su roca <strong>arenisca</strong> de excelente agarre, con más de 150 rutas deportivas, 17 sectores (incluido un sector multi-largo), bloques de boulder y vistas directas a la Cordillera Real. En invierno conviene buscar los sectores soleados y adquirir la <strong>Guía de Topos</strong> local.</p>
          <p class="small"><strong>Seguridad:</strong> Requiere formación técnica, equipo homologado UIAA/CE revisado en cada pegue y asegurador atento (sin uso de celular).</p>
          <p class="small"><strong>Alquiler de equipo — La Cordillera Experience:</strong> Reserva previa de 08:30 a 18:30 · Tel. <strong>+591 74018297 / +591 74907412</strong> · <em>www.lacordilleraexperience.org</em> (requiere documento vigente; pago al devolver).</p>
        </div>

        <div class="card">
          <span class="badge badge-green">Aclimatación y Cumbres</span>
          <h3>Alta Montaña desde Peñas</h3>
          <p>Por su altitud (~4.000 m) y cercanía a La Paz, Peñas funciona como campo base de aclimatación previo a cumbres de la Cordillera Real como el <strong>Huayna Potosí (6.088 m)</strong>, <strong>Chachacomani</strong> o <strong>Chearoco</strong>.</p>
          <ul>
            <li>Aclimata de 3 a 4 días antes de subir a campos altos.</li>
            <li>Contrata <strong>guías certificados UIAGM</strong> o deja siempre tu itinerario y hora de retorno en tu hospedaje (no hay señal en alta montaña).</li>
          </ul>
        </div>
      </div>

      <div class="alert-box">
        <strong>Emergencias en Montaña — Socorro Andino Boliviano (SAB / AGMTB):</strong><br />
        Teléfonos de rescate: <strong>+591 72061471 · 73542550 · 71261910 · 72514357 · 74127742 · 73302839</strong><br />
        Frecuencias de radio: <strong>458.150 UHF</strong> / <strong>161.300 VHF</strong>
      </div>
    </section>

    <section id="hospedajes">
      <h2>5. Hospedajes en Peñas (Gestión Familiar)</h2>
      <p class="small">Tarifas de referencia en Bolivianos (Bs). Se recomienda confirmar disponibilidad directamente por WhatsApp antes de viajar.</p>
      <table>
        <thead>
          <tr>
            <th>Hospedaje y Contacto</th>
            <th>Tarifas de Referencia (Bs)</th>
            <th>Servicios e Información</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Hotel Qalapanqara</strong><br />
              Av. La Paz 777<br />
              WhatsApp: +591 72058708<br />
              <span class="small">qalapanqarahotel@gmail.com<br/>www.qalapanqarahotel.com</span>
            </td>
            <td>
              Simple: 200 CD / 170 SD<br />
              Matrimonial/Doble: 300 CD / 250 SD<br />
              Triple: 395 CD / 320 SD<br />
              Familiar (4 pax): 500 CD / 400 SD<br />
              <span class="small">Niños &lt;12 años: 50% desc.</span>
            </td>
            <td>Baño privado con agua caliente y ropa de cama. Ofrece almuerzo/cena, box lunch, panadería, lavandería, asador, fogatero, telescopio, parqueo y botellas de oxígeno.</td>
          </tr>
          <tr>
            <td>
              <strong>Casona Don Ranulfo</strong><br />
              Calle Natividad #449 (Plaza Principal)<br />
              WhatsApp: +591 69711917<br />
              <span class="small">casonadonranulfo@gmail.com<br/>casonadonranulfo.wordpress.com</span>
            </td>
            <td>
              Compartida (5 pax): 70/p<br />
              Doble / Twin: 150<br />
              Matrimonial baño privado: 200<br />
              Tipi (2 pax): 80 · Camping: 20/p
            </td>
            <td>Cocina equipada, duchas calientes, calentador y Wi-Fi. Extras: parqueo, lavandería, solo ducha/cocina, guarda equipaje, parrillero, fogatas, coctelería, ATM, acepta VISA/Mastercard, tours y transfers.</td>
          </tr>
          <tr>
            <td>
              <strong>Hostal Ancohuma</strong><br />
              Plaza Principal Túpac Katari<br />
              WhatsApp: +591 63258715 / +591 68775275<br />
              <span class="small">davide.vitale@hotmail.com</span>
            </td>
            <td>
              Compartida baño priv. (6 pax): 80/p<br />
              Compartida (4 o 6 pax): 70/p<br />
              Doble (2 pax): 70/p<br />
              Doble / Matrimonial baño priv.: 200<br />
              Camping: 20/p
            </td>
            <td>Cocina equipada, duchas calientes y Wi-Fi. Extras: lavandería, solo ducha 10 Bs, solo cocina 10 Bs/p, guarda equipaje, parrillero, fogatas, guías/logística de escalada y trekking, desayuno 20 Bs, almuerzo/cena 30 Bs.</td>
          </tr>
          <tr>
            <td>
              <strong>Hostal Suma Utita</strong><br />
              Calle Francisca Miranda Evia (a 1 cuadra de Plaza Túpac Katari)<br />
              WhatsApp: +591 77265423<br />
              <span class="small">suma.utita.bolivia@gmail.com</span>
            </td>
            <td>
              Compartida (3 pax): 50/p<br />
              Individual: 70<br />
              Doble / Twin / Matrimonial: 140
            </td>
            <td>Incluye desayuno, duchas calientes y Wi-Fi. Extras: lavandería, uso de cocina y ducha, parrillero, fogata, bebidas, desayunos y almuerzos.</td>
          </tr>
          <tr>
            <td>
              <strong>Qala Uta – Casa de Piedra</strong><br />
              WhatsApp: +591 72741245 / +591 77481933<br />
              <span class="small">kusillito@gmail.com<br/>paolap08@hotmail.com</span>
            </td>
            <td>
              1 persona: 100<br />
              2 personas: 190<br />
              3 personas: 280<br />
              4+ personas: variable · Camping: 25/p
            </td>
            <td>Sábanas, mantas, toallas, duchas calientes, cocina eléctrica, utensilios y mini nevera. Extras: sala de reuniones (80 pax), comida al aire libre, parrillero con horno, fogatero y telescopio.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section id="cafeteria">
      <h2>6. Cafetería “Virgen de la Natividad”</h2>
      <div class="grid-2">
        <div class="card">
          <span class="badge">Centro Intercultural y Tienda Artesanal</span>
          <h3>Horarios y Reservas</h3>
          <ul>
            <li><strong>Temporada alta (mayo – octubre):</strong> Fines de semana y feriados <strong>08:00–19:00</strong> · Lunes a viernes <strong>08:00–12:00</strong> y <strong>15:30–19:00</strong>.</li>
            <li><strong>Temporada baja (noviembre – abril):</strong> Confirmar horarios vigentes antes de asistir.</li>
            <li><strong>Reservas</strong> (desayunos, almuerzos buffet/4 pasos/especiales y cenas): WhatsApp <strong>+591 72588430</strong> / <strong>+39 334 755 8911</strong>.</li>
          </ul>
        </div>

        <div class="card">
          <span class="badge badge-gold">Carta y Artesanías</span>
          <h3>Qué Encontrarás</h3>
          <ul>
            <li><strong>Bebidas:</strong> Mates calientes (coca, manzanilla, muña), cafés, chocolate caliente, jugos, gaseosas, cervezas y singani.</li>
            <li><strong>Comida y Panadería:</strong> Sándwiches, pizzas artesanales, empanadas de queso, rollos de queso, queques, alfajores y tiramisú.</li>
            <li><strong>Tienda local:</strong> Quesos criollos, licores artesanales y textiles de la comunidad.</li>
          </ul>
        </div>
      </div>
    </section>

    <footer class="footer">
      Guía de Viaje para Visitar Peñas · Compilada con información turística comunitaria 2026 y mapa oficial de Peñas, La Paz, Bolivia.
    </footer>
  </article>
</body>
</html>`;

  triggerHtmlDownload('Guia-de-Viaje-Penas-LaPaz.html', html);
}

export const COMMUNITY_VOUCHER_IMAGE =
  '/assets/aistudio/WhatsApp_Image_2026-11-23_at_21.41.29_ba509f74.jpeg';

export async function downloadCommunityVoucher(progress: PlayerProgress): Promise<void> {
  const traveler = progress.playerName.trim() || 'Viajero de Peñas';
  const { rankTitle } = getPlayerRank(progress);
  const dateStr = new Date().toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      let settled = false;
      const timer = window.setTimeout(() => {
        if (settled) return;
        settled = true;
        reject(new Error('Tiempo de espera agotado al cargar el vale'));
      }, 8000);
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        resolve(image);
      };
      image.onerror = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        reject(new Error('No se pudo cargar la imagen del vale'));
      };
      image.src = COMMUNITY_VOUCHER_IMAGE;
    });

    const footerHeight = 96;
    const canvas = document.createElement('canvas');
    const targetW = img.naturalWidth || 1200;
    const targetH = (img.naturalHeight || 900) + footerHeight;
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Sin contexto 2D');

    ctx.drawImage(img, 0, 0, targetW, img.naturalHeight || 900);

    // Subtle matching personalization footer bar preserving 100% of the community voucher above
    const barY = img.naturalHeight || 900;
    ctx.fillStyle = '#3D2212';
    ctx.fillRect(0, barY, targetW, footerHeight);
    ctx.fillStyle = '#D9A05B';
    ctx.fillRect(0, barY, targetW, 3);

    const pad = Math.round(targetW * 0.04);
    ctx.fillStyle = '#FFF8E7';
    ctx.font = `bold ${Math.max(18, Math.round(targetW * 0.022))}px Georgia, serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${traveler} · ${rankTitle}`, pad, barY + footerHeight * 0.36);

    ctx.fillStyle = '#E2DDD2';
    ctx.font = `${Math.max(14, Math.round(targetW * 0.016))}px sans-serif`;
    ctx.fillText(`Emitido en Peñas, La Paz · ${dateStr}`, pad, barY + footerHeight * 0.72);

    ctx.fillStyle = '#FFD166';
    ctx.font = `bold ${Math.max(16, Math.round(targetW * 0.02))}px monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(`Código: ${progress.voucherCode}`, targetW - pad, barY + footerHeight * 0.52);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Error generando PNG');

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vale-Premio-Penas-${progress.voucherCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch {
    // Direct image fallback
    const link = document.createElement('a');
    link.href = COMMUNITY_VOUCHER_IMAGE;
    link.download = `Vale-Premio-Penas-${progress.voucherCode}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
