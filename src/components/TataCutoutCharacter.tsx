import React, { useId } from 'react';

interface TataCutoutCharacterProps {
  talking?: boolean;
  className?: string;
  label?: string;
}

/**
 * Transparent-background cutout character of Tata, the ancestral Aymara guide of Peñas.
 * Designed with no box or square frame so he stands directly on top of any stage backdrop.
 */
export const TataCutoutCharacter: React.FC<TataCutoutCharacterProps> = ({
  talking = false,
  className = 'w-32 h-36',
  label = 'Tata'
}) => {
  const uid = useId().replace(/:/g, '');
  const ponchoGradId = `tata-poncho-${uid}`;
  const skinGradId = `tata-skin-${uid}`;

  return (
    <svg
      viewBox="0 0 180 210"
      className={`${className} overflow-visible drop-shadow-[0_10px_18px_rgba(0,0,0,0.68)]`}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={ponchoGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B85627" />
          <stop offset="45%" stopColor="#8C3B2B" />
          <stop offset="100%" stopColor="#5C2618" />
        </linearGradient>
        <linearGradient id={skinGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CE8C5E" />
          <stop offset="100%" stopColor="#A5643D" />
        </linearGradient>
      </defs>

      {/* Soft ground shadow beneath Tata */}
      <ellipse cx="90" cy="203" rx="64" ry="7" fill="#000000" fillOpacity="0.4" />

      {/* Traditional Woven Poncho Body (No background box — pure silhouette) */}
      <g>
        {/* Back collar / shoulder mantle */}
        <path
          d="M24 202 L42 132 Q62 114 90 116 Q118 114 138 132 L156 202 Z"
          fill={`url(#${ponchoGradId})`}
          stroke="#2C130B"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Cream inner shirt collar peeking beneath scarf */}
        <path
          d="M72 118 L90 144 L108 118 Z"
          fill="#EFE5D0"
          stroke="#6A482A"
          strokeWidth="1.4"
        />
        <path d="M84 136 L90 152 L96 136" fill="none" stroke="#8C5A2B" strokeWidth="2" />

        {/* Aguayo diagonal & chevron stripes on poncho */}
        <path
          d="M36 168 L90 194 L144 168"
          fill="none"
          stroke="#1D4E89"
          strokeWidth="9"
          strokeLinejoin="round"
        />
        <path
          d="M39 156 L90 181 L141 156"
          fill="none"
          stroke="#F5B700"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <path
          d="M44 143 L90 167 L136 143"
          fill="none"
          stroke="#52B788"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Woven center vertical band */}
        <path
          d="M84 144 L90 198 L96 144"
          fill="#D9A05B"
          fillOpacity="0.88"
          stroke="#3D1F0B"
          strokeWidth="1.2"
        />
        {/* Poncho fringe along bottom */}
        <path
          d="M28 198 L26 205 M38 198 L37 205 M48 198 L47 205 M60 199 L60 205 M74 200 L74 205 M106 200 L106 205 M120 199 L120 205 M132 198 L133 205 M142 198 L143 205 M152 198 L154 205"
          stroke="#FFD166"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>

      {/* Colorful Striped Andean Neck Scarf */}
      <g>
        <path
          d="M55 113 Q90 132 125 113 Q131 124 123 132 Q90 148 57 132 Q49 124 55 113 Z"
          fill="#1D4E89"
          stroke="#1E140E"
          strokeWidth="2"
        />
        <path d="M58 121 Q90 138 122 121" fill="none" stroke="#F5B700" strokeWidth="4" />
        <path d="M60 127 Q90 142 120 127" fill="none" stroke="#C84B31" strokeWidth="3" />
        {/* Scarf hanging tail */}
        <path
          d="M102 132 L114 176 L98 179 L89 136 Z"
          fill="#1D4E89"
          stroke="#1E140E"
          strokeWidth="1.8"
        />
        <line x1="100" y1="146" x2="110" y2="144" stroke="#F5B700" strokeWidth="3.2" />
        <line x1="102" y1="158" x2="112" y2="156" stroke="#C84B31" strokeWidth="3.2" />
        <line x1="104" y1="170" x2="113" y2="168" stroke="#52B788" strokeWidth="2.8" />
      </g>

      {/* Expressive Gesture Hand (Tata welcoming / pointing toward story) */}
      <g>
        <path
          d="M134 150 Q152 142 155 130 Q158 122 151 121 Q146 121 143 128 L138 122 Q134 119 131 124 L132 136 Q126 142 129 150 Z"
          fill={`url(#${skinGradId})`}
          stroke="#3B2012"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </g>

      {/* Neck & Ears */}
      <path d="M77 104 L103 104 L105 122 Q90 129 75 122 Z" fill="#9E5E39" />
      <ellipse cx="56" cy="80" rx="5.5" ry="8.5" fill="#9E5E39" stroke="#3B2012" strokeWidth="1.5" />
      <ellipse cx="124" cy="80" rx="5.5" ry="8.5" fill="#9E5E39" stroke="#3B2012" strokeWidth="1.5" />

      {/* Elder Face Contour */}
      <path
        d="M57 70 C57 48, 69 40, 90 40 C111 40, 123 48, 123 70 C123 92, 111 111, 90 113 C69 111, 57 92, 57 70 Z"
        fill={`url(#${skinGradId})`}
        stroke="#3B2012"
        strokeWidth="2"
      />

      {/* Silver-White Hair Peeking Beneath Chullo */}
      <path
        d="M57 68 C58 56, 65 50, 74 52 C68 57, 62 63, 59 73 Z"
        fill="#ECEAE4"
      />
      <path
        d="M123 68 C122 56, 115 50, 106 52 C112 57, 118 63, 121 73 Z"
        fill="#ECEAE4"
      />
      <path
        d="M66 54 Q79 47 96 52 Q84 55 71 57 Z"
        fill="#F3F1EC"
      />

      {/* Wise Forehead Lines & Warm Cheeks */}
      <path d="M72 60 Q90 58 108 60" fill="none" stroke="#854D2E" strokeWidth="1.2" strokeOpacity="0.55" />
      <ellipse cx="69" cy="83" rx="6" ry="3.5" fill="#D96B43" fillOpacity="0.3" />
      <ellipse cx="111" cy="83" rx="6" ry="3.5" fill="#D96B43" fillOpacity="0.3" />

      {/* Bushy White Eyebrows & Kind Eyes */}
      <path
        d="M64 67 Q73 62 82 67"
        fill="none"
        stroke="#F4F2EC"
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <path
        d="M98 67 Q107 62 116 67"
        fill="none"
        stroke="#F4F2EC"
        strokeWidth="3.8"
        strokeLinecap="round"
      />

      <ellipse cx="73.5" cy="74" rx="5.2" ry="3.8" fill="#FFFDF9" />
      <ellipse cx="106.5" cy="74" rx="5.2" ry="3.8" fill="#FFFDF9" />
      <circle cx="74" cy="74" r="2.8" fill="#231914" />
      <circle cx="107" cy="74" r="2.8" fill="#231914" />
      <circle cx="75" cy="72.8" r="1" fill="#FFFFFF" />
      <circle cx="108" cy="72.8" r="1" fill="#FFFFFF" />

      {/* Gentle Nose */}
      <path
        d="M90 72 L87 84 Q90 87 93 84"
        fill="none"
        stroke="#784225"
        strokeWidth="2.1"
        strokeLinecap="round"
      />

      {/* Full White Beard & Mustache Framing Animated Mouth */}
      <path
        d="M57 80 C56 105, 71 122, 90 123 C109 122, 124 105, 123 80 C120 92, 110 99, 90 99 C70 99, 60 92, 57 80 Z"
        fill="#EDEBE4"
        stroke="#BDB8AE"
        strokeWidth="1.4"
      />
      {/* Beard texture strokes */}
      <path
        d="M72 106 L74 117 M83 108 L84 120 M97 108 L96 120 M108 106 L106 117"
        stroke="#CFCBC0"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* Animated Talking Mouth */}
      {talking ? (
        <ellipse
          cx="90"
          cy="97"
          rx="7.5"
          ry="4.2"
          fill="#4A1D1A"
          stroke="#9E5E39"
          strokeWidth="1.1"
          className="animate-tata-mouth"
        />
      ) : (
        <path
          d="M80 96 Q90 101 100 96"
          fill="none"
          stroke="#6E3B26"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
      )}

      {/* White Mustache */}
      <path
        d="M90 89 C81 87, 71 91, 69 97 C77 96, 84 95, 90 93 C96 95, 103 96, 111 97 C109 91, 99 87, 90 89 Z"
        fill="#F7F6F2"
        stroke="#CBC6BA"
        strokeWidth="1.1"
      />

      {/* Signature Patterned Andean Chullo with Earflaps & Tassels */}
      <g>
        {/* Left & Right Earflaps */}
        <path
          d="M54 58 L48 93 Q54 101 60 92 L61 62 Z"
          fill="#8C3B2B"
          stroke="#2C130B"
          strokeWidth="1.8"
        />
        <path
          d="M126 58 L132 93 Q126 101 120 92 L119 62 Z"
          fill="#8C3B2B"
          stroke="#2C130B"
          strokeWidth="1.8"
        />
        {/* Braided cords + colorful tassels */}
        <line x1="53" y1="95" x2="51" y2="114" stroke="#B85627" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="127" y1="95" x2="129" y2="114" stroke="#B85627" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M46 124 L51 112 L56 124 Z" fill="#F5B700" stroke="#2C130B" strokeWidth="1.2" />
        <path d="M124 124 L129 112 L134 124 Z" fill="#F5B700" stroke="#2C130B" strokeWidth="1.2" />

        {/* Chullo Crown Dome */}
        <path
          d="M53 60 C53 26, 74 14, 96 14 C114 14, 128 28, 127 60 Q90 48 53 60 Z"
          fill="#8C3B2B"
          stroke="#2C130B"
          strokeWidth="2"
        />
        {/* Patterned Stripes on Chullo */}
        <path d="M55 51 Q90 41 125 51" fill="none" stroke="#1D4E89" strokeWidth="6" />
        <path d="M57 49 Q90 39 123 49" fill="none" stroke="#FFD166" strokeWidth="2.2" strokeDasharray="4 4" />
        <path d="M60 36 Q90 28 121 36" fill="none" stroke="#52B788" strokeWidth="4.5" />
        <path d="M67 24 Q90 19 114 24" fill="none" stroke="#F5B700" strokeWidth="3.5" />

        {/* Hanging Chullo Top Tassel */}
        <path d="M107 17 Q122 22 126 30" fill="none" stroke="#2C130B" strokeWidth="2" />
        <path d="M121 38 L126 27 L134 36 Z" fill="#D9A05B" stroke="#2C130B" strokeWidth="1.4" />
      </g>
    </svg>
  );
};
