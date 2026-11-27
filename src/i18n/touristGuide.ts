import { PlayerProgress, TravelerProfileInfo } from '../types/game';
import { AppLanguage } from './types';

export function getPlayerRankLocalized(
  progress: PlayerProgress,
  lang: AppLanguage = 'es'
): {
  rankTitle: string;
  badgeDescription: string;
} {
  const isGuardian = progress.firstTryWins.length >= 5;

  if (lang === 'en') {
    return isGuardian
      ? {
          rankTitle: 'Guardian of Peñas',
          badgeDescription:
            'You cleared most challenges on the very first try, showing deep respect for the historical, natural, and community heritage of Peñas.'
        }
      : {
          rankTitle: 'Explorer of Peñas',
          badgeDescription:
            'You steadily walked all 7 stages of the Andean trail, discovering the cultural, natural, and human treasures of Peñas.'
        };
  }

  if (lang === 'pt') {
    return isGuardian
      ? {
          rankTitle: 'Guardião de Peñas',
          badgeDescription:
            'Você venceu a maioria dos desafios na primeira tentativa, demonstrando profundo respeito pela memória histórica, natural e comunitária de Peñas.'
        }
      : {
          rankTitle: 'Explorador de Peñas',
          badgeDescription:
            'Você percorreu com perseverança as 7 etapas da trilha andina, descobrindo os tesouros culturais, naturais e humanos de Peñas.'
        };
  }

  return isGuardian
    ? {
        rankTitle: 'Guardián de Peñas',
        badgeDescription:
          'Has superado la mayoría de los desafíos al primer intento, demostrando profundo respeto por la memoria histórica, natural y comunitaria de Peñas.'
      }
    : {
        rankTitle: 'Explorador de Peñas',
        badgeDescription:
          'Has recorrido con perseverancia las 7 etapas del sendero andino, descubriendo los tesoros culturales, naturales y humanos de Peñas.'
      };
}

export function getVoucherLabels(lang: AppLanguage) {
  if (lang === 'en') {
    return {
      defaultTraveler: 'Peñas Traveler',
      locale: 'en-US',
      issuedAt: (dateStr: string) => `Issued in Peñas, La Paz · ${dateStr}`,
      codePrefix: (code: string) => `Code: ${code}`,
      filenamePrefix: 'Peñas-Prize-Voucher'
    };
  }
  if (lang === 'pt') {
    return {
      defaultTraveler: 'Viajante de Peñas',
      locale: 'pt-BR',
      issuedAt: (dateStr: string) => `Emitido em Peñas, La Paz · ${dateStr}`,
      codePrefix: (code: string) => `Código: ${code}`,
      filenamePrefix: 'Vale-Premio-Penas'
    };
  }
  return {
    defaultTraveler: 'Viajero de Peñas',
    locale: 'es-BO',
    issuedAt: (dateStr: string) => `Emitido en Peñas, La Paz · ${dateStr}`,
    codePrefix: (code: string) => `Código: ${code}`,
    filenamePrefix: 'Vale-Premio-Penas'
  };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface BuildGuideArgs {
  travelerRaw: string;
  rankTitle: string;
  profile: TravelerProfileInfo;
  mapViewUrl: string;
  mapEmbedUrl: string;
  lang: 'en' | 'pt';
}

export function buildTranslatedTouristGuideHtml({
  travelerRaw,
  rankTitle,
  profile,
  mapViewUrl,
  mapEmbedUrl,
  lang
}: BuildGuideArgs): { filename: string; html: string } {
  const traveler = escapeHtml(travelerRaw);

  const sharedStyles = `<style>
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
  </style>`;

  if (lang === 'en') {
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Travel Guide for Visiting Peñas — La Paz, Bolivia</title>
  ${sharedStyles}
</head>
<body>
  <article class="sheet">
    <header class="header">
      <div class="kicker">Cordillera Real · La Paz Department, Bolivia · ~4,000 m a.s.l.</div>
      <h1>Travel Guide for Visiting Peñas</h1>
      <p>Practical community travel guide covering local recommendations, key landmarks, trekking routes, rock climbing, lodging, the community café, and georeferenced map.</p>
      <div class="meta-bar">
        <span class="pill-tag">Traveler: ${traveler}</span>
        <span class="pill-tag">Title: ${escapeHtml(rankTitle)}</span>
        <span class="pill-tag">Profile: ${escapeHtml(profile.title)}</span>
      </div>
    </header>

    <section class="profile-box">
      <h3>Personalized recommendation for your profile (${escapeHtml(profile.title)})</h3>
      <p>${escapeHtml(profile.description)}</p>
      <p class="small"><strong>Suggested itinerary:</strong> ${escapeHtml(profile.recommendation)}</p>
    </section>

    <nav class="toc no-print" aria-label="Guide table of contents">
      <div class="toc-title">Guide Contents</div>
      <div class="toc-links">
        <a href="#practico">1. Getting There & Tips</a>
        <a href="#mapa">2. Peñas Map</a>
        <a href="#atractivos">3. Landmarks & Trekking</a>
        <a href="#escalada">4. Climbing & High Altitude</a>
        <a href="#hospedajes">5. Lodging</a>
        <a href="#cafeteria">6. Virgen de la Natividad Café</a>
      </div>
    </nav>

    <section id="practico">
      <h2>1. Overview & Essential Travel Tips</h2>
      <p>Peñas is a welcoming Andean village nestled in the heart of the Cordillera Real between the city of La Paz and Lake Titicaca (about 60 km / 1.5 to 2 hours by road, at ~4,000 m a.s.l.).</p>

      <div class="grid-2">
        <div class="card">
          <span class="badge">Getting There</span>
          <h3>Access & Transport</h3>
          <ul>
            <li><strong>From La Paz / El Alto:</strong> Daily public minibuses run from <strong>05:00 to 18:00</strong> departing from the <strong>El Alto Interprovincial Bus Terminal</strong> (buy your ticket before boarding).</li>
            <li><strong>From Copacabana or other routes:</strong> Peñas has no terminal; get off at <strong>Palcoco</strong> and arrange a local taxi or transfer into the village.</li>
            <li><strong>Private car:</strong> Follow the international highway to <strong>“el cruce a Peñas”</strong> (other turnoffs are gravel and confusing). Hitchhiking is uncommon.</li>
          </ul>
        </div>

        <div class="card">
          <span class="badge badge-gold">Supplies</span>
          <h3>Food & Weekly Market</h3>
          <ul>
            <li>The village has a few neighborhood corner shops stocking staples (pasta, rice, cooking oil, eggs, and cheese).</li>
            <li><strong>Weekly market:</strong> Only on <strong>Saturdays from 06:00 to 12:00</strong> in the Main Plaza (the only day to buy fresh fruit, vegetables, and meat locally).</li>
            <li>If you plan to self-cater on other days, stock up beforehand in La Paz or El Alto.</li>
          </ul>
        </div>

        <div class="card">
          <span class="badge badge-rust">Health & Hydration</span>
          <h3>Water & High-Altitude Weather</h3>
          <ul>
            <li><strong>No potable tap water:</strong> Always boil water before drinking or brushing your teeth, use purification tablets, or buy bottled water at village shops.</li>
            <li>At ~4,000 m a.s.l., mornings and nights are cold: pack warm layers, a windbreaker, knit cap, sunscreen, and UV sunglasses.</li>
          </ul>
        </div>

        <div class="card">
          <span class="badge badge-green">Connectivity & Respect</span>
          <h3>Mobile Signal & Community Etiquette</h3>
          <ul>
            <li><strong>Phone & Internet:</strong> The only mobile carrier with coverage is <strong>ENTEL</strong> (signal can drop, especially during rain). Nearly all lodgings have Wi-Fi, weather permitting.</li>
            <li><strong>Respectful visit:</strong> Greet locals warmly, ask permission before taking photos, <strong>stay off cultivated fields</strong>, and pack out all trash (there is no municipal waste collection).</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="mapa">
      <h2>2. Peñas Map & Points of Interest</h2>
      <p>Official community map showing attractions, Huellas Andinas trekking trails, sport-climbing crags, boulder problems, shops, and the 22-mural walking gallery.</p>

      <div class="map-wrap">
        <div class="map-bar">
          <div>
            <strong>Interactive Map of Peñas (Google My Maps)</strong>
            <div style="font-size:12px;color:#cbd5e1;">Approximate center: -16.2396, -68.5015 · Elevation ~4,000 m a.s.l.</div>
          </div>
          <a class="map-btn" href="${mapViewUrl}" target="_blank" rel="noopener noreferrer">
            Open Full Map in Google Maps ↗
          </a>
        </div>
        <iframe
          class="map-iframe"
          src="${mapEmbedUrl}"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Interactive tourist map of Peñas, La Paz"
        ></iframe>
      </div>

      <div class="svg-map-card">
        <h3 style="margin-bottom:8px;">Offline Schematic Map (based on official trail coordinates)</h3>
        <p class="small" style="margin-bottom:10px;">Handy when you lose mobile coverage on the trail. Shows the village core, marked hiking circuits, and main landmarks.</p>
        <svg viewBox="0 0 760 520" role="img" aria-label="Schematic map of Peñas attractions and trekking trails">
          <rect width="760" height="520" fill="#efe8d8" />
          <path d="M0,120 Q220,75 430,135 T760,110 L760,520 L0,520 Z" fill="#e6decb" />
          <path d="M0,260 Q260,210 470,295 T760,255 L760,520 L0,520 Z" fill="#ddd3bc" />
          <path d="M180,520 Q360,340 530,385 T760,460 L760,520 Z" fill="#d3c7ad" />
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
          <ellipse cx="145" cy="95" rx="68" ry="40" fill="#d99b26" fill-opacity="0.16" stroke="#b37812" stroke-dasharray="5 3" />
          <text x="145" y="48" text-anchor="middle" font-size="11" font-weight="700" fill="#7a4921">Village · 22 Murals & Shops</text>
          <ellipse cx="235" cy="212" rx="74" ry="42" fill="#164875" fill-opacity="0.13" stroke="#164875" stroke-dasharray="5 3" />
          <text x="235" y="216" text-anchor="middle" font-size="11" font-weight="700" fill="#164875">Climbing Sectors</text>
          <text x="235" y="230" text-anchor="middle" font-size="10" fill="#164875">&amp; Bouldering (17 sectors)</text>
          <polyline fill="none" stroke="#8a5a44" stroke-width="3.2" stroke-dasharray="7 5" stroke-linecap="round" stroke-linejoin="round"
            points="113.9,108.1 82.1,117.6 84.5,133.2 77.4,147.8 55.2,155.0 56.8,182.2 85.0,207.8 110.2,245.1 175.8,334.6 337.9,419.8 428.6,430.8 416.4,429.7 395.7,425.6 387.6,408.3 374.1,389.5 344.0,344.2 375.1,303.2 351.7,249.8 348.4,190.2 348.6,181.9" />
          <polyline fill="none" stroke="#1f5c43" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"
            points="434.7,425.8 427.1,428.9 413.6,432.1 408.3,437.6 386.7,447.7 394.0,424.7 393.8,412.0 383.7,412.7 375.3,409.6 363.2,393.7 311.5,378.4 312.1,365.0 379.3,358.1 340.5,343.9 355.2,327.8 369.9,317.8 375.1,303.0 366.8,283.6 364.8,268.8 354.3,249.7 369.2,232.4 371.3,213.4 354.6,195.7 348.2,186.8 346.7,181.7" />
          <polyline fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
            points="346.7,181.7 343.7,190.9 352.0,195.7 369.5,216.6 371.8,225.9 357.2,248.8 369.5,296.3 367.1,313.7 354.4,327.1 343.2,343.1 373.1,353.4 390.5,363.2 403.0,365.6" />
          <polyline fill="none" stroke="#9b3d28" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
            points="190.5,112.1 174.3,120.7 160.4,124.0 152.3,140.8 147.6,158.5 140.2,174.1 140.2,186.5 152.5,187.2 153.8,179.1" />
          <path d="M693,339 Q565,240 430,175 T200,98" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="3 4" />
          <g font-family="Segoe UI, sans-serif" font-size="11" font-weight="700" fill="#1e2421">
            <circle cx="142.6" cy="84.2" r="7" fill="#d99b26" stroke="#2f1d0e" stroke-width="2" />
            <text x="154" y="81">Main Plaza</text>
            <circle cx="134.9" cy="93.5" r="5.5" fill="#164875" stroke="#fff" stroke-width="1.5" />
            <text x="122" y="109" text-anchor="end">Church &amp; Café</text>
            <circle cx="93.1" cy="142.5" r="5.5" fill="#164875" stroke="#fff" stroke-width="1.5" />
            <text x="82" y="144" text-anchor="end">Grotto</text>
            <circle cx="153.8" cy="179.1" r="6" fill="#9b3d28" stroke="#fff" stroke-width="1.5" />
            <text x="142" y="200" text-anchor="end">Calvario Viewpoint</text>
            <circle cx="337.2" cy="173.1" r="7" fill="#1f5c43" stroke="#fff" stroke-width="2" />
            <text x="348" y="169">B. Bonaldi Adventure Park</text>
            <circle cx="362.4" cy="216.1" r="5.5" fill="#164875" stroke="#fff" stroke-width="1.5" />
            <text x="380" y="220">Saca Cuellos</text>
            <circle cx="363.9" cy="314.6" r="5.5" fill="#7a4921" stroke="#fff" stroke-width="1.5" />
            <text x="382" y="317">Cave</text>
            <circle cx="403.0" cy="368.6" r="6.5" fill="#d97706" stroke="#fff" stroke-width="1.8" />
            <text x="415" y="372">Rock Art (Qillqantiji shelter)</text>
            <circle cx="441.2" cy="423.6" r="7" fill="#9b3d28" stroke="#fff" stroke-width="2" />
            <text x="453" y="427">Carmenpata Ruins (4,300 m)</text>
            <circle cx="693.3" cy="339.3" r="6.5" fill="#164875" stroke="#fff" stroke-width="1.8" />
            <text x="682" y="357" text-anchor="end">Welcome to Peñas Arch</text>
          </g>
          <g transform="translate(22, 405)">
            <rect x="0" y="0" width="290" height="96" rx="8" fill="#fffdf8" fill-opacity="0.92" stroke="#c9bea7" />
            <text x="12" y="19" font-size="11" font-weight="700" fill="#2f1d0e">Trails &amp; Zones Legend</text>
            <line x1="12" y1="35" x2="36" y2="35" stroke="#9b3d28" stroke-width="3" />
            <text x="44" y="39" font-size="10.5" fill="#1e2421">Calvario Hike (20–40 min)</text>
            <line x1="12" y1="53" x2="36" y2="53" stroke="#d97706" stroke-width="3" />
            <text x="44" y="57" font-size="10.5" fill="#1e2421">Rock Art Circuit (1–2 h)</text>
            <line x1="12" y1="71" x2="36" y2="71" stroke="#1f5c43" stroke-width="3" />
            <text x="44" y="75" font-size="10.5" fill="#1e2421">Carmenpata Ruins Trail (~3 h)</text>
            <line x1="12" y1="87" x2="36" y2="87" stroke="#8a5a44" stroke-width="3" stroke-dasharray="6 4" />
            <text x="44" y="90" font-size="10.5" fill="#1e2421">Full Huellas Andinas Loop (~5 h)</text>
          </g>
        </svg>
      </div>

      <table>
        <thead>
          <tr>
            <th>Map Category</th>
            <th>Featured Georeferenced Points</th>
            <th>Reference Coordinates</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Main Landmarks</strong></td>
            <td>Main Plaza, Our Lady of the Nativity Church, Grotto, Calvario, Adventure Park, Saca Cuellos, Rock Art, Carmenpata Ruins</td>
            <td>Plaza: -16.23187, -68.50382<br/>Carmenpata: -16.24853, -68.49631</td>
          </tr>
          <tr>
            <td><strong>Trekking Trails</strong></td>
            <td>Calvario Hike, Rock Art Trek, Ruins Church Trek, Complete Huellas Andinas Loop</td>
            <td>Village trailhead: -16.2332, -68.5026<br/>Adventure Park: -16.2362, -68.4989</td>
          </tr>
          <tr>
            <td><strong>Climbing & Bouldering</strong></td>
            <td>19 climbing sectors (Torre Teresa, Techo del Topio, La Mamacha, Mujer Montaña, Pachamama, Placa del Águila...) and 26 boulder problems</td>
            <td>Central valley: -16.2375, -68.5010</td>
          </tr>
          <tr>
            <td><strong>Shops & Murals</strong></td>
            <td>Peñas Café, restaurants, grocery shops (Sra. Úrsula, Maritza, Marcela, Don Víctor) & 22-mural village trail</td>
            <td>Café: -16.23241, -68.50379</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section id="atractivos">
      <h2>3. Tourist Attractions & Hiking Trails</h2>
      <div class="grid-2">
        <div class="card">
          <span class="badge">Heritage & Architecture</span>
          <h3>1. Church of Our Lady of the Nativity</h3>
          <p>Colonial stone-and-adobe church beside the Main Plaza, known for its exterior bell tower, gold-leaf Baroque altarpiece, and folk paintings. Ask locally for opening hours and be respectful inside.</p>
        </div>

        <div class="card">
          <span class="badge badge-gold">Archaeology · Guide required</span>
          <h3>2. Rock Paintings (Qillqantiji Archaeological Park)</h3>
          <p>Rock shelters bearing ancient white and red rock art depicting human and animal figures set into the cliffside. <strong>Entry is allowed only with a certified local guide</strong> and payment of the community fee.</p>
        </div>

        <div class="card">
          <span class="badge badge-green">Community Adventure</span>
          <h3>3. Battistino Bonaldi Adventure Park</h3>
          <p>Adventure park featuring three ziplines (over 100 m each), a via ferrata, suspension bridges, rappelling, and rock climbing. Proceeds directly fund local community social projects.</p>
        </div>

        <div class="card">
          <span class="badge badge-rust">360° Viewpoint · 4,300 m</span>
          <h3>4. Carmenpata Ruins (Condor’s Nest Viewpoint)</h3>
          <p>Historic ruined hilltop chapel overlooking Peñas (2–3 hours walk from the plaza). Delivers sweeping 360° views of the Cordillera Real, the Altiplano, and Lake Titicaca.</p>
        </div>

        <div class="card">
          <span class="badge">Street Art</span>
          <h3>5. Peñas Mural Gallery</h3>
          <p>Free self-guided walk past <strong>22 murals</strong> painted across village facades celebrating Andean textiles, native wildlife, village life, and snowy peaks.</p>
        </div>

        <div class="card">
          <span class="badge badge-gold">Local Flavors</span>
          <h3>6. Farmstead Cheese & K’oa Herbal Liqueur</h3>
          <p><strong>Artisan cheese:</strong> Experiential visit to see additive-free cheese made with fresh highland cow’s milk (ask at your guesthouse). <strong>K’oa liqueur:</strong> Handcrafted digestive herbal maceration made with sacred Andean k’oa.</p>
        </div>
      </div>

      <div class="card-accent" style="margin-top:14px;">
        <h3>7. Recommended Trekking Routes</h3>
        <ul>
          <li><strong>Calvario Viewpoint (20–40 min from plaza · Easy–Moderate):</strong> Short acclimatization walk ideal for Day 1, rewarding you with 360° views over the village.</li>
          <li><strong>Rock Art Circuit (1–2 h · Easy):</strong> Walk among rock formations near the Adventure Park; book a local guide in the village beforehand.</li>
          <li><strong>Huellas Andinas Circuit (~5.4 km · 3–5 h · Moderate):</strong> High-puna traverse past grazing llamas and alpacas all the way up to the Carmenpata Ruins.</li>
        </ul>
      </div>
    </section>

    <section id="escalada">
      <h2>4. Rock Climbing & High Mountaineering</h2>
      <div class="grid-2">
        <div class="card">
          <span class="badge">Sport Climbing & Bouldering</span>
          <h3>Over 150 Routes across 17 Sectors</h3>
          <p>Peñas is famous for textured <strong>sandstone</strong> with great friction, offering 150+ bolted routes, 17 sectors (including a multi-pitch area), boulders, and direct views of the Cordillera Real. In winter, aim for sunny crags and pick up the local <strong>Topo Guide</strong>.</p>
          <p class="small"><strong>Safety:</strong> Requires technical training, inspected UIAA/CE-certified gear, and an attentive belayer (no phone distraction).</p>
          <p class="small"><strong>Gear rental — La Cordillera Experience:</strong> Book ahead 08:30–18:30 · Tel. <strong>+591 74018297 / +591 74907412</strong> · <em>www.lacordilleraexperience.org</em> (valid ID required; pay on return).</p>
        </div>

        <div class="card">
          <span class="badge badge-green">Acclimatization & Peaks</span>
          <h3>High Mountaineering from Peñas</h3>
          <p>Thanks to its elevation (~4,000 m) and proximity to La Paz, Peñas is an ideal acclimatization base before climbing Cordillera Real giants such as <strong>Huayna Potosí (6,088 m)</strong>, <strong>Chachacomani</strong>, or <strong>Chearoco</strong>.</p>
          <ul>
            <li>Acclimatize for 3 to 4 days before moving up to high camps.</li>
            <li>Hire <strong>UIAGM-certified mountain guides</strong> or always leave your itinerary and return time at your lodging (there is no cell signal high up).</li>
          </ul>
        </div>
      </div>

      <div class="alert-box">
        <strong>Mountain Emergencies — Socorro Andino Boliviano (SAB / AGMTB):</strong><br />
        Rescue phone lines: <strong>+591 72061471 · 73542550 · 71261910 · 72514357 · 74127742 · 73302839</strong><br />
        Radio frequencies: <strong>458.150 UHF</strong> / <strong>161.300 VHF</strong>
      </div>
    </section>

    <section id="hospedajes">
      <h2>5. Lodging in Peñas (Family-Run Stays)</h2>
      <p class="small">Reference rates in Bolivianos (Bs). Please confirm availability directly on WhatsApp before traveling.</p>
      <table>
        <thead>
          <tr>
            <th>Lodging & Contact</th>
            <th>Reference Rates (Bs)</th>
            <th>Amenities & Info</th>
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
              Single: 200 CD / 170 SD<br />
              Double/Queen: 300 CD / 250 SD<br />
              Triple: 395 CD / 320 SD<br />
              Family (4 pax): 500 CD / 400 SD<br />
              <span class="small">Kids &lt;12 yrs: 50% off</span>
            </td>
            <td>Private bathroom with hot water and linens. Offers lunch/dinner, box lunch, bakery, laundry, BBQ grill, fire pit, telescope, parking, and oxygen bottles.</td>
          </tr>
          <tr>
            <td>
              <strong>Casona Don Ranulfo</strong><br />
              Calle Natividad #449 (Main Plaza)<br />
              WhatsApp: +591 69711917<br />
              <span class="small">casonadonranulfo@gmail.com<br/>casonadonranulfo.wordpress.com</span>
            </td>
            <td>
              Shared dorm (5 pax): 70/p<br />
              Double / Twin: 150<br />
              Queen private bath: 200<br />
              Tipi (2 pax): 80 · Camping: 20/p
            </td>
            <td>Equipped kitchen, hot showers, room heater & Wi-Fi. Extras: parking, laundry, shower/kitchen day pass, luggage storage, BBQ grill, bonfires, cocktails, ATM, VISA/Mastercard accepted, tours & transfers.</td>
          </tr>
          <tr>
            <td>
              <strong>Hostal Ancohuma</strong><br />
              Main Plaza Túpac Katari<br />
              WhatsApp: +591 63258715 / +591 68775275<br />
              <span class="small">davide.vitale@hotmail.com</span>
            </td>
            <td>
              Shared w/ private bath (6 pax): 80/p<br />
              Shared (4 or 6 pax): 70/p<br />
              Double (2 pax): 70/p<br />
              Double / Queen private bath: 200<br />
              Camping: 20/p
            </td>
            <td>Equipped kitchen, hot showers & Wi-Fi. Extras: laundry, shower only 10 Bs, kitchen only 10 Bs/p, luggage storage, BBQ grill, bonfires, climbing/trekking guides & logistics, breakfast 20 Bs, lunch/dinner 30 Bs.</td>
          </tr>
          <tr>
            <td>
              <strong>Hostal Suma Utita</strong><br />
              Calle Francisca Miranda Evia (1 block from Túpac Katari Plaza)<br />
              WhatsApp: +591 77265423<br />
              <span class="small">suma.utita.bolivia@gmail.com</span>
            </td>
            <td>
              Shared (3 pax): 50/p<br />
              Single: 70<br />
              Double / Twin / Queen: 140
            </td>
            <td>Includes breakfast, hot showers & Wi-Fi. Extras: laundry, kitchen & shower access, BBQ grill, bonfire, drinks, breakfasts & lunches.</td>
          </tr>
          <tr>
            <td>
              <strong>Qala Uta – Casa de Piedra</strong><br />
              WhatsApp: +591 72741245 / +591 77481933<br />
              <span class="small">kusillito@gmail.com<br/>paolap08@hotmail.com</span>
            </td>
            <td>
              1 guest: 100<br />
              2 guests: 190<br />
              3 guests: 280<br />
              4+ guests: variable · Camping: 25/p
            </td>
            <td>Sheets, blankets, towels, hot showers, electric kitchen, cookware & mini fridge. Extras: meeting hall (80 pax), outdoor dining, BBQ & wood oven, fire pit, and telescope.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section id="cafeteria">
      <h2>6. “Virgen de la Natividad” Café</h2>
      <div class="grid-2">
        <div class="card">
          <span class="badge">Intercultural Center & Craft Shop</span>
          <h3>Hours & Reservations</h3>
          <ul>
            <li><strong>High season (May – October):</strong> Weekends & holidays <strong>08:00–19:00</strong> · Mon–Fri <strong>08:00–12:00</strong> and <strong>15:30–19:00</strong>.</li>
            <li><strong>Low season (November – April):</strong> Confirm current opening hours before visiting.</li>
            <li><strong>Reservations</strong> (breakfasts, buffet/4-course/special lunches & dinners): WhatsApp <strong>+591 72588430</strong> / <strong>+39 334 755 8911</strong>.</li>
          </ul>
        </div>

        <div class="card">
          <span class="badge badge-gold">Menu & Handicrafts</span>
          <h3>What You’ll Find</h3>
          <ul>
            <li><strong>Drinks:</strong> Hot herbal teas (coca, chamomile, muña), coffees, hot chocolate, juices, sodas, beers, and singani.</li>
            <li><strong>Food & Bakery:</strong> Sandwiches, artisan pizzas, cheese empanadas, cheese rolls, cakes, alfajores, and tiramisu.</li>
            <li><strong>Local shop:</strong> Farmstead cheeses, craft herbal liqueurs, and community textiles.</li>
          </ul>
        </div>
      </div>
    </section>

    <footer class="footer">
      Travel Guide for Visiting Peñas · Compiled with 2026 community tourism info and the official map of Peñas, La Paz, Bolivia.
    </footer>
  </article>
</body>
</html>`;
    return { filename: 'Travel-Guide-Penas-LaPaz.html', html };
  }

  // Portuguese
  const html = `<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Guia de Viagem para Visitar Peñas — La Paz, Bolívia</title>
  ${sharedStyles}
</head>
<body>
  <article class="sheet">
    <header class="header">
      <div class="kicker">Cordilheira Real · Departamento de La Paz, Bolívia · ~4.000 m de altitude</div>
      <h1>Guia de Viagem para Visitar Peñas</h1>
      <p>Guia prático comunitário com recomendações de visita, atrativos principais, trilhas de trekking, escalada, hospedagens, cafeteria e mapa georreferenciado.</p>
      <div class="meta-bar">
        <span class="pill-tag">Viajante: ${traveler}</span>
        <span class="pill-tag">Título: ${escapeHtml(rankTitle)}</span>
        <span class="pill-tag">Perfil: ${escapeHtml(profile.title)}</span>
      </div>
    </header>

    <section class="profile-box">
      <h3>Recomendação personalizada conforme o seu perfil (${escapeHtml(profile.title)})</h3>
      <p>${escapeHtml(profile.description)}</p>
      <p class="small"><strong>Sugestão de roteiro:</strong> ${escapeHtml(profile.recommendation)}</p>
    </section>

    <nav class="toc no-print" aria-label="Índice do guia">
      <div class="toc-title">Conteúdo organizado do guia</div>
      <div class="toc-links">
        <a href="#practico">1. Acesso e Recomendações</a>
        <a href="#mapa">2. Mapa de Peñas</a>
        <a href="#atractivos">3. Atrativos e Trekking</a>
        <a href="#escalada">4. Escalada e Alta Montanha</a>
        <a href="#hospedajes">5. Hospedagens</a>
        <a href="#cafeteria">6. Cafeteria Virgen de la Natividad</a>
      </div>
    </nav>

    <section id="practico">
      <h2>1. Apresentação e Recomendações Essenciais</h2>
      <p>Peñas é um acolhedor povoado andino situado no coração da Cordilheira Real, entre a cidade de La Paz e o Lago Titicaca (a cerca de 60 km / 1h30 a 2h por estrada, a ~4.000 m de altitude).</p>

      <div class="grid-2">
        <div class="card">
          <span class="badge">Como chegar</span>
          <h3>Acesso e Transporte</h3>
          <ul>
            <li><strong>De La Paz / El Alto:</strong> Transporte público diário das <strong>05:00 às 18:00</strong> saindo do <strong>Terminal Interprovincial de El Alto</strong> (compre a passagem antes de embarcar).</li>
            <li><strong>De Copacabana ou outros destinos:</strong> Peñas não possui terminal; desça em <strong>Palcoco</strong> e combine um transfer ou táxi até o povoado.</li>
            <li><strong>Veículo próprio:</strong> Siga a rodovia internacional até o <strong>“cruce a Peñas”</strong> (outros desvios são de cascalho e confusos). Não é comum pedir carona.</li>
          </ul>
        </div>

        <div class="card">
          <span class="badge badge-gold">Mantimentos</span>
          <h3>Alimentação e Feira Semanal</h3>
          <ul>
            <li>No povoado há poucas mercearias de bairro com itens básicos (macarrão, arroz, óleo, ovos e queijo).</li>
            <li><strong>Feira semanal:</strong> Somente aos <strong>sábados das 06:00 às 12:00</strong> na Praça Principal (único dia para comprar frutas, verduras e carne localmente).</li>
            <li>Se pretende cozinhar em outros dias, abasteça-se antes em La Paz ou El Alto.</li>
          </ul>
        </div>

        <div class="card">
          <span class="badge badge-rust">Saúde e Hidratação</span>
          <h3>Água e Clima de Altitude</h3>
          <ul>
            <li><strong>Não há água potável encanada:</strong> Ferva sempre a água antes de beber ou escovar os dentes, use pastilhas purificadoras ou compre água engarrafada nas lojas do povoado.</li>
            <li>A ~4.000 m de altitude as manhãs e noites são frias: leve roupas em camadas, corta-vento, gorro, protetor solar e óculos UV.</li>
          </ul>
        </div>

        <div class="card">
          <span class="badge badge-green">Conectividade e Respeito</span>
          <h3>Telefonia e Cuidado Ambiental</h3>
          <ul>
            <li><strong>Telefonia e Internet:</strong> A única operadora móvel com cobertura é a <strong>ENTEL</strong> (sinal instável, sobretudo com chuva). Quase todas as hospedagens oferecem Wi-Fi sujeito ao clima.</li>
            <li><strong>Convivência:</strong> Cumprimente com cordialidade, peça permissão antes de fotografar, <strong>não pise em plantações</strong> e leve todo o seu lixo de volta (não há coleta municipal).</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="mapa">
      <h2>2. Mapa de Peñas e Pontos de Interesse</h2>
      <p>Mapa comunitário oficial com atrativos, trilhas do Circuito Huellas Andinas, setores de escalada, blocos de boulder, comércios e galeria de murais.</p>

      <div class="map-wrap">
        <div class="map-bar">
          <div>
            <strong>Mapa Interativo de Peñas (Google My Maps)</strong>
            <div style="font-size:12px;color:#cbd5e1;">Centro aproximado: -16.2396, -68.5015 · Altitude ~4.000 m</div>
          </div>
          <a class="map-btn" href="${mapViewUrl}" target="_blank" rel="noopener noreferrer">
            Abrir Mapa Completo no Google Maps ↗
          </a>
        </div>
        <iframe
          class="map-iframe"
          src="${mapEmbedUrl}"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Mapa turístico interativo de Peñas, La Paz"
        ></iframe>
      </div>

      <div class="svg-map-card">
        <h3 style="margin-bottom:8px;">Mapa Esquemático Offline (baseado nas coordenadas oficiais)</h3>
        <p class="small" style="margin-bottom:10px;">Útil quando não houver sinal na trilha. Mostra o centro urbano, as rotas demarcadas e os principais pontos.</p>
        <svg viewBox="0 0 760 520" role="img" aria-label="Mapa esquemático de atrativos e trilhas em Peñas">
          <rect width="760" height="520" fill="#efe8d8" />
          <path d="M0,120 Q220,75 430,135 T760,110 L760,520 L0,520 Z" fill="#e6decb" />
          <path d="M0,260 Q260,210 470,295 T760,255 L760,520 L0,520 Z" fill="#ddd3bc" />
          <path d="M180,520 Q360,340 530,385 T760,460 L760,520 Z" fill="#d3c7ad" />
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
          <ellipse cx="145" cy="95" rx="68" ry="40" fill="#d99b26" fill-opacity="0.16" stroke="#b37812" stroke-dasharray="5 3" />
          <text x="145" y="48" text-anchor="middle" font-size="11" font-weight="700" fill="#7a4921">Povoado · 22 Murais e Comércio</text>
          <ellipse cx="235" cy="212" rx="74" ry="42" fill="#164875" fill-opacity="0.13" stroke="#164875" stroke-dasharray="5 3" />
          <text x="235" y="216" text-anchor="middle" font-size="11" font-weight="700" fill="#164875">Setores de Escalada</text>
          <text x="235" y="230" text-anchor="middle" font-size="10" fill="#164875">e Boulder (17 setores)</text>
          <polyline fill="none" stroke="#8a5a44" stroke-width="3.2" stroke-dasharray="7 5" stroke-linecap="round" stroke-linejoin="round"
            points="113.9,108.1 82.1,117.6 84.5,133.2 77.4,147.8 55.2,155.0 56.8,182.2 85.0,207.8 110.2,245.1 175.8,334.6 337.9,419.8 428.6,430.8 416.4,429.7 395.7,425.6 387.6,408.3 374.1,389.5 344.0,344.2 375.1,303.2 351.7,249.8 348.4,190.2 348.6,181.9" />
          <polyline fill="none" stroke="#1f5c43" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"
            points="434.7,425.8 427.1,428.9 413.6,432.1 408.3,437.6 386.7,447.7 394.0,424.7 393.8,412.0 383.7,412.7 375.3,409.6 363.2,393.7 311.5,378.4 312.1,365.0 379.3,358.1 340.5,343.9 355.2,327.8 369.9,317.8 375.1,303.0 366.8,283.6 364.8,268.8 354.3,249.7 369.2,232.4 371.3,213.4 354.6,195.7 348.2,186.8 346.7,181.7" />
          <polyline fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
            points="346.7,181.7 343.7,190.9 352.0,195.7 369.5,216.6 371.8,225.9 357.2,248.8 369.5,296.3 367.1,313.7 354.4,327.1 343.2,343.1 373.1,353.4 390.5,363.2 403.0,365.6" />
          <polyline fill="none" stroke="#9b3d28" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
            points="190.5,112.1 174.3,120.7 160.4,124.0 152.3,140.8 147.6,158.5 140.2,174.1 140.2,186.5 152.5,187.2 153.8,179.1" />
          <path d="M693,339 Q565,240 430,175 T200,98" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="3 4" />
          <g font-family="Segoe UI, sans-serif" font-size="11" font-weight="700" fill="#1e2421">
            <circle cx="142.6" cy="84.2" r="7" fill="#d99b26" stroke="#2f1d0e" stroke-width="2" />
            <text x="154" y="81">Praça Principal</text>
            <circle cx="134.9" cy="93.5" r="5.5" fill="#164875" stroke="#fff" stroke-width="1.5" />
            <text x="122" y="109" text-anchor="end">Igreja e Cafeteria</text>
            <circle cx="93.1" cy="142.5" r="5.5" fill="#164875" stroke="#fff" stroke-width="1.5" />
            <text x="82" y="144" text-anchor="end">Gruta</text>
            <circle cx="153.8" cy="179.1" r="6" fill="#9b3d28" stroke="#fff" stroke-width="1.5" />
            <text x="142" y="200" text-anchor="end">Mirante Calvário</text>
            <circle cx="337.2" cy="173.1" r="7" fill="#1f5c43" stroke="#fff" stroke-width="2" />
            <text x="348" y="169">Parque Aventura B. Bonaldi</text>
            <circle cx="362.4" cy="216.1" r="5.5" fill="#164875" stroke="#fff" stroke-width="1.5" />
            <text x="380" y="220">Saca Cuellos</text>
            <circle cx="363.9" cy="314.6" r="5.5" fill="#7a4921" stroke="#fff" stroke-width="1.5" />
            <text x="382" y="317">Caverna</text>
            <circle cx="403.0" cy="368.6" r="6.5" fill="#d97706" stroke="#fff" stroke-width="1.8" />
            <text x="415" y="372">Pinturas Rupestres (Qillqantiji)</text>
            <circle cx="441.2" cy="423.6" r="7" fill="#9b3d28" stroke="#fff" stroke-width="2" />
            <text x="453" y="427">Ruínas Carmenpata (4.300 m)</text>
            <circle cx="693.3" cy="339.3" r="6.5" fill="#164875" stroke="#fff" stroke-width="1.8" />
            <text x="682" y="357" text-anchor="end">Arco Bem-vindos a Peñas</text>
          </g>
          <g transform="translate(22, 405)">
            <rect x="0" y="0" width="286" height="96" rx="8" fill="#fffdf8" fill-opacity="0.92" stroke="#c9bea7" />
            <text x="12" y="19" font-size="11" font-weight="700" fill="#2f1d0e">Legenda de Trilhas e Zonas</text>
            <line x1="12" y1="35" x2="36" y2="35" stroke="#9b3d28" stroke-width="3" />
            <text x="44" y="39" font-size="10.5" fill="#1e2421">Trekking Calvário (20–40 min)</text>
            <line x1="12" y1="53" x2="36" y2="53" stroke="#d97706" stroke-width="3" />
            <text x="44" y="57" font-size="10.5" fill="#1e2421">Circuito Pinturas Rupestres (1–2 h)</text>
            <line x1="12" y1="71" x2="36" y2="71" stroke="#1f5c43" stroke-width="3" />
            <text x="44" y="75" font-size="10.5" fill="#1e2421">Trilha Ruínas Carmenpata (~3 h)</text>
            <line x1="12" y1="87" x2="36" y2="87" stroke="#8a5a44" stroke-width="3" stroke-dasharray="6 4" />
            <text x="44" y="90" font-size="10.5" fill="#1e2421">Huellas Andinas Completo (~5 h)</text>
          </g>
        </svg>
      </div>

      <table>
        <thead>
          <tr>
            <th>Categoria do Mapa</th>
            <th>Pontos Georreferenciados em Destaque</th>
            <th>Coordenadas de Referência</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Atrativos Principais</strong></td>
            <td>Praça Principal, Igreja Ntra. Sra. da Natividade, Gruta, Calvário, Parque Aventura, Saca Cuellos, Pinturas Rupestres, Ruínas Carmenpata</td>
            <td>Praça: -16.23187, -68.50382<br/>Carmenpata: -16.24853, -68.49631</td>
          </tr>
          <tr>
            <td><strong>Rotas de Trekking</strong></td>
            <td>Trekking Calvário, Trekking Pinturas Rupestres, Trekking Igreja em Ruínas, Percurso completo Huellas Andinas</td>
            <td>Início povoado: -16.2332, -68.5026<br/>Parque Aventura: -16.2362, -68.4989</td>
          </tr>
          <tr>
            <td><strong>Escalada e Boulder</strong></td>
            <td>19 setores de escalada (Torre Teresa, Techo del Topio, La Mamacha, Mujer Montaña, Pachamama, Placa del Águila...) e 26 blocos de boulder</td>
            <td>Vale central: -16.2375, -68.5010</td>
          </tr>
          <tr>
            <td><strong>Comércio e Murais</strong></td>
            <td>Cafeteria de Peñas, restaurantes, mercearias (Sra. Úrsula, Maritza, Marcela, Don Víctor) e circuito de 22 murais no centro</td>
            <td>Cafeteria: -16.23241, -68.50379</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section id="atractivos">
      <h2>3. Atrativos Turísticos e Trilhas</h2>
      <div class="grid-2">
        <div class="card">
          <span class="badge">Patrimônio e Arquitetura</span>
          <h3>1. Igreja Nossa Senhora da Natividade</h3>
          <p>Templo colonial em pedra e adobe junto à Praça Principal, reconhecível pelo campanário externo, retábulo barroco em folha de ouro e pinturas tradicionais. Consulte os horários no povoado e mantenha respeito durante a visita.</p>
        </div>

        <div class="card">
          <span class="badge badge-gold">Arqueologia · Guia obrigatório</span>
          <h3>2. Pinturas Rupestres (Parque Arqueológico Qillqantiji)</h3>
          <p>Abrigos rochosos com antigas expressões de arte rupestre em tons branco e vermelho, com figuras humanas e animais integradas ao paredão. <strong>O acesso é permitido somente com guia local</strong> e pagamento da taxa comunitária.</p>
        </div>

        <div class="card">
          <span class="badge badge-green">Aventura Comunitária</span>
          <h3>3. Parque de Aventura Battistino Bonaldi</h3>
          <p>Espaço de aventura com três tirolesas (de mais de 100 m), via ferrata, pontes suspensas, rapel e escalada em rocha. A receita apoia diretamente obras sociais da comunidade.</p>
        </div>

        <div class="card">
          <span class="badge badge-rust">Mirante 360° · 4.300 m</span>
          <h3>4. Ruínas de Carmenpata (Mirante Ninho de Condores)</h3>
          <p>Antiga capela em ruínas no alto da colina que domina Peñas (caminhada de 2 a 3 horas desde a praça). Oferece vistas panorâmicas de 360° da Cordilheira Real, Altiplano e Lago Titicaca.</p>
        </div>

        <div class="card">
          <span class="badge">Arte Urbana</span>
          <h3>5. Galeria de Murais de Peñas</h3>
          <p>Passeio livre por <strong>22 murais</strong> pintados em fachadas do povoado retratando têxteis andinos, fauna silvestre, cenas cotidianas e picos nevados.</p>
        </div>

        <div class="card">
          <span class="badge badge-gold">Sabores Locais</span>
          <h3>6. Queijo Tradicional e Licor de K’oa</h3>
          <p><strong>Queijo crioulo:</strong> Visita vivencial para conhecer a produção artesanal com leite fresco de vaca de altitude sem conservantes (consulte sua hospedagem). <strong>Licor de k’oa:</strong> Macerado artesanal digestivo preparado com a erva aromática andina.</p>
        </div>
      </div>

      <div class="card-accent" style="margin-top:14px;">
        <h3>7. Rotas de Trekking Recomendadas</h3>
        <ul>
          <li><strong>Mirante do Calvário (20–40 min da praça · Fácil–Moderada):</strong> Trilha curta ideal para aclimatar no primeiro dia com vista 360° do povoado.</li>
          <li><strong>Circuito Pinturas Rupestres (1–2 h · Fácil):</strong> Caminhada entre formações rochosas próxima ao Parque de Aventura; agende um guia local no povoado.</li>
          <li><strong>Circuito Huellas Andinas (~5,4 km · 3 a 5 h · Moderada):</strong> Percurso de puna com presença de lhamas e alpacas pelas paisagens altas até as Ruínas de Carmenpata.</li>
        </ul>
      </div>
    </section>

    <section id="escalada">
      <h2>4. Escalada em Rocha e Alta Montanha</h2>
      <div class="grid-2">
        <div class="card">
          <span class="badge">Escalada Esportiva e Boulder</span>
          <h3>Mais de 150 Vias em 17 Setores</h3>
          <p>Peñas destaca-se pela rocha <strong>arenito</strong> de excelente aderência, com mais de 150 rotas esportivas, 17 setores (incluindo setor multi-enfiada), blocos de boulder e vista direta para a Cordilheira Real. No inverno busque os setores ensolarados e adquira o <strong>Guia de Croquis (Topos)</strong> local.</p>
          <p class="small"><strong>Segurança:</strong> Exige formação técnica, equipamento homologado UIAA/CE conferido a cada entrada e segurador atento (sem celular).</p>
          <p class="small"><strong>Aluguel de equipamentos — La Cordillera Experience:</strong> Reserva prévia das 08:30 às 18:30 · Tel. <strong>+591 74018297 / +591 74907412</strong> · <em>www.lacordilleraexperience.org</em> (requer documento válido; pagamento na devolução).</p>
        </div>

        <div class="card">
          <span class="badge badge-green">Aclimatação e Cumes</span>
          <h3>Alta Montanha a partir de Peñas</h3>
          <p>Pela altitude (~4.000 m) e proximidade de La Paz, Peñas serve como campo base de aclimatação antes de escalar picos da Cordilheira Real como <strong>Huayna Potosí (6.088 m)</strong>, <strong>Chachacomani</strong> ou <strong>Chearoco</strong>.</p>
          <ul>
            <li>Aclimate por 3 a 4 dias antes de subir aos campos altos.</li>
            <li>Contrate <strong>guias certificados UIAGM</strong> ou deixe sempre seu roteiro e horário de retorno na hospedagem (não há sinal em alta montanha).</li>
          </ul>
        </div>
      </div>

      <div class="alert-box">
        <strong>Emergências em Montanha — Socorro Andino Boliviano (SAB / AGMTB):</strong><br />
        Telefones de resgate: <strong>+591 72061471 · 73542550 · 71261910 · 72514357 · 74127742 · 73302839</strong><br />
        Frequências de rádio: <strong>458.150 UHF</strong> / <strong>161.300 VHF</strong>
      </div>
    </section>

    <section id="hospedajes">
      <h2>5. Hospedagens em Peñas (Gestão Familiar)</h2>
      <p class="small">Tarifas de referência em Bolivianos (Bs). Recomenda-se confirmar disponibilidade diretamente via WhatsApp antes de viajar.</p>
      <table>
        <thead>
          <tr>
            <th>Hospedagem e Contato</th>
            <th>Tarifas de Referência (Bs)</th>
            <th>Serviços e Informações</th>
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
              Individual: 200 CD / 170 SD<br />
              Casal/Duplo: 300 CD / 250 SD<br />
              Triplo: 395 CD / 320 SD<br />
              Familiar (4 pax): 500 CD / 400 SD<br />
              <span class="small">Crianças &lt;12 anos: 50% desc.</span>
            </td>
            <td>Banheiro privativo com água quente e roupa de cama. Oferece almoço/jantar, lanche de trilha, padaria, lavanderia, churrasqueira, fogueira, telescópio, estacionamento e cilindros de oxigênio.</td>
          </tr>
          <tr>
            <td>
              <strong>Casona Don Ranulfo</strong><br />
              Calle Natividad #449 (Praça Principal)<br />
              WhatsApp: +591 69711917<br />
              <span class="small">casonadonranulfo@gmail.com<br/>casonadonranulfo.wordpress.com</span>
            </td>
            <td>
              Compartilhado (5 pax): 70/p<br />
              Duplo / Twin: 150<br />
              Casal banheiro privativo: 200<br />
              Tipi (2 pax): 80 · Camping: 20/p
            </td>
            <td>Cozinha equipada, duchas quentes, aquecedor e Wi-Fi. Extras: estacionamento, lavanderia, apenas banho/cozinha, guarda-volumes, churrasqueira, fogueira, coquetelaria, ATM, aceita VISA/Mastercard, tours e transfers.</td>
          </tr>
          <tr>
            <td>
              <strong>Hostal Ancohuma</strong><br />
              Praça Principal Túpac Katari<br />
              WhatsApp: +591 63258715 / +591 68775275<br />
              <span class="small">davide.vitale@hotmail.com</span>
            </td>
            <td>
              Compart. banh. priv. (6 pax): 80/p<br />
              Compartilhado (4 ou 6 pax): 70/p<br />
              Duplo (2 pax): 70/p<br />
              Duplo / Casal banh. priv.: 200<br />
              Camping: 20/p
            </td>
            <td>Cozinha equipada, duchas quentes e Wi-Fi. Extras: lavanderia, apenas banho 10 Bs, apenas cozinha 10 Bs/p, guarda-volumes, churrasqueira, fogueira, guias/logística de escalada e trekking, café 20 Bs, almoço/jantar 30 Bs.</td>
          </tr>
          <tr>
            <td>
              <strong>Hostal Suma Utita</strong><br />
              Calle Francisca Miranda Evia (a 1 quadra da Praça Túpac Katari)<br />
              WhatsApp: +591 77265423<br />
              <span class="small">suma.utita.bolivia@gmail.com</span>
            </td>
            <td>
              Compartilhado (3 pax): 50/p<br />
              Individual: 70<br />
              Duplo / Twin / Casal: 140
            </td>
            <td>Inclui café da manhã, duchas quentes e Wi-Fi. Extras: lavanderia, uso de cozinha e ducha, churrasqueira, fogueira, bebidas, cafés e almoços.</td>
          </tr>
          <tr>
            <td>
              <strong>Qala Uta – Casa de Piedra</strong><br />
              WhatsApp: +591 72741245 / +591 77481933<br />
              <span class="small">kusillito@gmail.com<br/>paolap08@hotmail.com</span>
            </td>
            <td>
              1 pessoa: 100<br />
              2 pessoas: 190<br />
              3 pessoas: 280<br />
              4+ pessoas: variável · Camping: 25/p
            </td>
            <td>Lençóis, cobertores, toalhas, duchas quentes, cozinha elétrica, utensílios e frigobar. Extras: salão de reuniões (80 pax), refeição ao ar livre, churrasqueira com forno, fogueira e telescópio.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section id="cafeteria">
      <h2>6. Cafeteria “Virgen de la Natividad”</h2>
      <div class="grid-2">
        <div class="card">
          <span class="badge">Centro Intercultural e Loja Artesanal</span>
          <h3>Horários e Reservas</h3>
          <ul>
            <li><strong>Alta temporada (maio – outubro):</strong> Fins de semana e feriados <strong>08:00–19:00</strong> · Segunda a sexta <strong>08:00–12:00</strong> e <strong>15:30–19:00</strong>.</li>
            <li><strong>Baixa temporada (novembro – abril):</strong> Confirme os horários vigentes antes de ir.</li>
            <li><strong>Reservas</strong> (cafés da manhã, almoços buffet/4 passos/especiais e jantares): WhatsApp <strong>+591 72588430</strong> / <strong>+39 334 755 8911</strong>.</li>
          </ul>
        </div>

        <div class="card">
          <span class="badge badge-gold">Cardápio e Artesanato</span>
          <h3>O Que Você Vai Encontrar</h3>
          <ul>
            <li><strong>Bebidas:</strong> Chás quentes (coca, camomila, muña), cafés, chocolate quente, sucos, refrigerantes, cervejas e singani.</li>
            <li><strong>Comida e Padaria:</strong> Sanduíches, pizzas artesanais, empanadas de queijo, pães de queijo, bolos, alfajores e tiramisù.</li>
            <li><strong>Loja local:</strong> Queijos crioulos, licores artesanais e têxteis da comunidade.</li>
          </ul>
        </div>
      </div>
    </section>

    <footer class="footer">
      Guia de Viagem para Visitar Peñas · Compilado com informações turísticas comunitárias de 2026 e mapa oficial de Peñas, La Paz, Bolívia.
    </footer>
  </article>
</body>
</html>`;
  return { filename: 'Guia-de-Viagem-Penas-LaPaz.html', html };
}
