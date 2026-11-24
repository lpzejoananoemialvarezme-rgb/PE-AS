import React from 'react';

interface DidYouKnowIconProps {
  stageId: number;
  cardIndex: number;
}

/**
 * Custom illustrated picture-badge tailored to each "¿Sabías que...?" fact card
 * so every info card displays a clear visual icon representing its topic alongside the '?' mark.
 */
export const DidYouKnowIcon: React.FC<DidYouKnowIconProps> = ({ stageId, cardIndex }) => {
  const renderArt = () => {
    // Stage 1: Plaza de Túpac Katari
    if (stageId === 1) {
      if (cardIndex === 0) {
        // Plato Paceño (choclo, papa, habas, queso)
        return (
          <g>
            <ellipse cx="24" cy="28" rx="18" ry="11" fill="#8C3B2B" stroke="#FFD166" strokeWidth="1.5" />
            <ellipse cx="24" cy="26.5" rx="14" ry="8" fill="#5C2618" />
            {/* Choclo */}
            <rect x="12" y="18" width="11" height="6" rx="3" fill="#F5B700" stroke="#A66D00" strokeWidth="1" />
            {/* Papa */}
            <ellipse cx="28" cy="21" rx="5.5" ry="4" fill="#D9A05B" stroke="#7B4824" strokeWidth="1" />
            {/* Habas */}
            <circle cx="17" cy="27" r="2.5" fill="#52B788" />
            <circle cx="22" cy="29" r="2.5" fill="#74C69D" />
            {/* Queso frito */}
            <rect x="25" y="24" width="9" height="5.5" rx="1.5" fill="#FFF8E7" stroke="#D97706" strokeWidth="1.2" />
          </g>
        );
      }
      if (cardIndex === 1) {
        // Un grito inmortal (Katari + 1781 sun & peaks)
        return (
          <g>
            <polygon points="4,40 16,22 25,31 35,17 44,40" fill="#1D4E89" stroke="#93C5FD" strokeWidth="1.2" />
            <circle cx="24" cy="14" r="6" fill="#F5B700" />
            <path d="M24 5 V8 M16 14 H13 M35 14 H32 M18 8 L20 10 M30 8 L28 10" stroke="#FFD166" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M20 38 L24 24 L28 38 Z" fill="#C84B31" stroke="#FFF8E7" strokeWidth="1" />
          </g>
        );
      }
      // Radio San Gabriel
      return (
        <g>
          <rect x="8" y="16" width="32" height="22" rx="4" fill="#8C5A2B" stroke="#FFD166" strokeWidth="1.4" />
          <line x1="34" y1="16" x2="40" y2="7" stroke="#E2DDD2" strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="7" r="2" fill="#F5B700" />
          <circle cx="18" cy="27" r="6" fill="#231914" stroke="#D9A05B" strokeWidth="1.2" />
          <line x1="14" y1="25" x2="22" y2="25" stroke="#D9A05B" strokeWidth="1" />
          <line x1="14" y1="29" x2="22" y2="29" stroke="#D9A05B" strokeWidth="1" />
          <rect x="28" y="22" width="8" height="4" rx="1" fill="#4EA8DE" />
          <circle cx="30" cy="31" r="2" fill="#F5B700" />
          <circle cx="35" cy="31" r="2" fill="#52B788" />
        </g>
      );
    }

    // Stage 2: Templo Colonial y Pisadas de la Virgen
    if (stageId === 2) {
      if (cardIndex === 0) {
        // Milagro contra la mita (Gruta & estrella de la Virgen)
        return (
          <g>
            <path d="M6 40 Q24 8 42 40 Z" fill="#3E3B37" stroke="#D9A05B" strokeWidth="1.4" />
            <path d="M13 40 Q24 18 35 40 Z" fill="#112436" />
            <polygon points="24,13 26.5,20 34,20 28,24.5 30,31.5 24,27 18,31.5 20,24.5 14,20 21.5,20" fill="#FFD166" />
          </g>
        );
      }
      if (cardIndex === 1) {
        // Huellas en la piedra
        return (
          <g>
            <path d="M7 38 L13 12 L34 10 L42 36 Z" fill="#6A645B" stroke="#CFCAC0" strokeWidth="1.4" />
            <ellipse cx="19" cy="22" rx="3.2" ry="5.5" transform="rotate(-12 19 22)" fill="#FFD166" fillOpacity="0.88" />
            <ellipse cx="29" cy="27" rx="3.2" ry="5.5" transform="rotate(8 29 27)" fill="#FFD166" fillOpacity="0.88" />
            <circle cx="17" cy="15" r="1.2" fill="#FFF8E7" />
            <circle cx="20" cy="14.5" r="1.2" fill="#FFF8E7" />
          </g>
        );
      }
      // Retablo en pan de oro
      return (
        <g>
          <path d="M10 40 V19 Q24 6 38 19 V40 Z" fill="#5C2618" stroke="#F5B700" strokeWidth="2" />
          <rect x="15" y="21" width="18" height="17" rx="2" fill="#F5B700" />
          <path d="M19 38 V24 Q24 18 29 24 V38 Z" fill="#FFF8E7" stroke="#8C5A2B" strokeWidth="1.2" />
          <circle cx="24" cy="14" r="2.4" fill="#FFD166" />
        </g>
      );
    }

    // Stage 3: Camino Prehispánico y Saca Cuellos
    if (stageId === 3) {
      if (cardIndex === 0) {
        // Camino empedrado + terrazas + trueque
        return (
          <g>
            <path d="M4 34 H44" stroke="#52B788" strokeWidth="4" />
            <path d="M8 26 H40" stroke="#74C69D" strokeWidth="3.5" />
            <path d="M14 42 L21 14 L27 14 L34 42 Z" fill="#A89F91" stroke="#3E3B37" strokeWidth="1.2" />
            <line x1="18" y1="30" x2="30" y2="30" stroke="#3E3B37" strokeWidth="1.3" />
            <line x1="19" y1="22" x2="29" y2="22" stroke="#3E3B37" strokeWidth="1.3" />
          </g>
        );
      }
      if (cardIndex === 1) {
        // Sacacuellos grieta rocosa
        return (
          <g>
            <polygon points="4,42 4,10 19,14 17,42" fill="#524E48" stroke="#A89F91" strokeWidth="1.2" />
            <polygon points="44,42 44,10 29,14 31,42" fill="#3E3B37" stroke="#A89F91" strokeWidth="1.2" />
            <circle cx="24" cy="19" r="4" fill="#FFD166" />
            <line x1="21" y1="39" x2="21" y2="43" stroke="#FFD166" strokeWidth="2.5" />
            <line x1="27" y1="39" x2="27" y2="43" stroke="#FFD166" strokeWidth="2.5" />
          </g>
        );
      }
      // Ingeniería milenaria
      return (
        <g>
          <polygon points="8,38 15,24 27,25 22,39" fill="#9C9283" stroke="#2B2B2E" strokeWidth="1.4" />
          <polygon points="24,39 29,24 40,27 38,40" fill="#7D7468" stroke="#2B2B2E" strokeWidth="1.4" />
          <polygon points="15,22 21,11 33,13 28,23" fill="#B5AA99" stroke="#2B2B2E" strokeWidth="1.4" />
          <path d="M9 22 Q11 16 14 21" stroke="#F5B700" strokeWidth="1.8" fill="none" />
        </g>
      );
    }

    // Stage 4: Cueva Kunkuntiji
    if (stageId === 4) {
      if (cardIndex === 0) {
        // Refugio secreto en cueva con antorcha
        return (
          <g>
            <path d="M5 41 L14 11 L34 11 L43 41 Z" fill="#4A4540" stroke="#9C9283" strokeWidth="1.4" />
            <path d="M13 41 Q24 17 35 41 Z" fill="#0B131C" />
            <rect x="22.5" y="29" width="3" height="10" fill="#8C5A2B" />
            <path d="M24 21 Q28 25 24 30 Q20 25 24 21 Z" fill="#F5B700" />
          </g>
        );
      }
      if (cardIndex === 1) {
        // Significado aymara (cuello de la montaña)
        return (
          <g>
            <path d="M4 39 L17 14 L24 21 L31 13 L44 39 Z" fill="#5C4D3C" stroke="#D9A05B" strokeWidth="1.4" />
            <ellipse cx="24" cy="31" rx="6" ry="5" fill="#17191C" stroke="#F5B700" strokeWidth="1.4" />
            <circle cx="24" cy="31" r="2" fill="#4EA8DE" />
          </g>
        );
      }
      // Secreto entre rocas
      return (
        <g>
          <polygon points="5,40 16,13 29,22 41,15 44,40" fill="#3E3B37" stroke="#A89F91" strokeWidth="1.3" />
          <circle cx="32" cy="11" r="3" fill="#FFD166" />
          <path d="M16 32 Q24 27 32 32" stroke="#C84B31" strokeWidth="2" fill="none" />
        </g>
      );
    }

    // Stage 5: Cueva Qillqantiji (Arte Rupestre)
    if (stageId === 5) {
      if (cardIndex === 0) {
        // Serpiente 3 cabezas Yaya-Mama
        return (
          <g>
            <rect x="6" y="8" width="36" height="32" rx="6" fill="#2A2724" stroke="#8C8376" strokeWidth="1.4" />
            <path
              d="M11 31 L18 31 L18 23 L26 23 L26 17 L35 17"
              fill="none"
              stroke="#E63946"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="11" cy="31" r="3" fill="#F5B700" />
            <circle cx="35" cy="17" r="3" fill="#F5B700" />
            <circle cx="26" cy="14" r="2.5" fill="#FFF8E7" />
          </g>
        );
      }
      if (cardIndex === 1) {
        // Tres colores minerales (rojo, blanco, amarillo)
        return (
          <g>
            <path d="M9 32 Q24 42 39 32 L36 39 H12 Z" fill="#6A645B" stroke="#CFCAC0" strokeWidth="1.2" />
            <circle cx="16" cy="24" r="6" fill="#D62828" stroke="#FFF8E7" strokeWidth="1" />
            <circle cx="24" cy="17" r="6" fill="#F5F1E8" stroke="#8C8376" strokeWidth="1" />
            <circle cx="32" cy="24" r="6" fill="#F5B700" stroke="#FFF8E7" strokeWidth="1" />
          </g>
        );
      }
      // Tesoro protegido (cercado + escudo)
      return (
        <g>
          <path d="M24 7 L38 13 V24 C38 33 24 41 24 41 C24 41 10 33 10 24 V13 Z" fill="#1E4D3B" stroke="#52B788" strokeWidth="1.8" />
          <line x1="16" y1="20" x2="32" y2="20" stroke="#FFD166" strokeWidth="2" />
          <line x1="18" y1="15" x2="18" y2="30" stroke="#FFD166" strokeWidth="2" />
          <line x1="24" y1="14" x2="24" y2="32" stroke="#FFD166" strokeWidth="2" />
          <line x1="30" y1="15" x2="30" y2="30" stroke="#FFD166" strokeWidth="2" />
        </g>
      );
    }

    // Stage 6: Calvario y Ruinas del Carmen
    if (stageId === 6) {
      if (cardIndex === 0) {
        // Casitas / Apachetas de piedra
        return (
          <g>
            <ellipse cx="24" cy="37" rx="13" ry="4.5" fill="#7D7468" stroke="#231914" strokeWidth="1.2" />
            <ellipse cx="24" cy="30" rx="10" ry="4" fill="#9C9283" stroke="#231914" strokeWidth="1.2" />
            <ellipse cx="24" cy="23" rx="7.5" ry="3.5" fill="#B5AA99" stroke="#231914" strokeWidth="1.2" />
            <ellipse cx="24" cy="17" rx="5" ry="3" fill="#D9A05B" stroke="#231914" strokeWidth="1.2" />
            <circle cx="24" cy="12" r="2.8" fill="#FFD166" />
          </g>
        );
      }
      if (cardIndex === 1) {
        // 14 Cruces procesionales
        return (
          <g>
            <polygon points="4,40 24,14 44,40" fill="#4A4540" stroke="#8C8376" strokeWidth="1.2" />
            <path d="M24 8 V22 M19 13 H29" stroke="#FFF8E7" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M13 24 V32 M10 27 H16" stroke="#FFD166" strokeWidth="2" strokeLinecap="round" />
            <path d="M35 26 V34 M32 29 H38" stroke="#FFD166" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      }
      // Ruinas en la cima
      return (
        <g>
          <path d="M10 40 V19 L17 14 V24 H31 V14 L38 19 V40 Z" fill="#8C6A4A" stroke="#D9A05B" strokeWidth="1.4" />
          <path d="M19 40 V29 Q24 23 29 29 V40 Z" fill="#17191C" />
          <circle cx="24" cy="16" r="2.2" fill="#F5B700" />
        </g>
      );
    }

    // Stage 7: Mirador Nido de Cóndores y Escalada
    if (cardIndex === 0) {
      // Escalada en roca y mosquetón
      return (
        <g>
          <polygon points="5,41 14,10 29,16 24,41" fill="#8C3B2B" stroke="#D9A05B" strokeWidth="1.3" />
          <path d="M26 11 C34 11 38 17 36 25 C34 32 27 36 22 32 C18 28 20 18 26 11 Z" fill="none" stroke="#F5B700" strokeWidth="3.2" />
          <line x1="35" y1="16" x2="31" y2="27" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    }
    if (cardIndex === 1) {
      // Mirador 360° Cordillera Real y Lago Titicaca
      return (
        <g>
          <rect x="5" y="31" width="38" height="9" rx="3" fill="#1D4E89" />
          <polygon points="6,31 15,15 23,31" fill="#93C5FD" stroke="#FFF8E7" strokeWidth="1.2" />
          <polygon points="17,31 27,10 37,31" fill="#FFF8E7" stroke="#93C5FD" strokeWidth="1.2" />
          <polygon points="29,31 37,16 44,31" fill="#D5E4F5" stroke="#FFF8E7" strokeWidth="1.2" />
          <circle cx="11" cy="12" r="3.5" fill="#F5B700" />
        </g>
      );
    }
    // Queso criollo y k'oa artesanal
    return (
      <g>
        <ellipse cx="18" cy="30" rx="11" ry="7" fill="#FFF3C4" stroke="#F5B700" strokeWidth="1.5" />
        <path d="M18 30 L28 28 L25 36 Z" fill="#E6B800" />
        <rect x="31" y="16" width="9" height="22" rx="3" fill="#2D6A4F" stroke="#74C69D" strokeWidth="1.3" />
        <rect x="33.5" y="10" width="4" height="6" rx="1" fill="#D9A05B" />
        <path d="M35.5 23 Q39 27 35.5 31 Q32 27 35.5 23 Z" fill="#FFD166" />
      </g>
    );
  };

  return (
    <div className="relative w-12 h-12 rounded-xl bg-[#0D2134] border border-[#D9A05B]/55 flex items-center justify-center shrink-0 shadow-md">
      <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden="true">
        {renderArt()}
      </svg>
      <span
        aria-hidden="true"
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#F5B700] border border-[#1A1207] text-[#1A1207] font-display font-bold text-[11px] flex items-center justify-center shadow"
      >
        ?
      </span>
    </div>
  );
};
