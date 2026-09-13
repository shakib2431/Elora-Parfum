import React, { useState } from 'react';
import { Product } from '../types';

interface BottleVisualizerProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showPedestal?: boolean;
  interactive?: boolean;
}

export const EloraBottleVisualizer: React.FC<BottleVisualizerProps> = ({
  product,
  size = 'md',
  className = '',
  showPedestal = true,
  interactive = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isSignatureSet = product.slug === 'elora-signature-set';
  const { capFinish, accentColor } = product.bottleTheme;

  // Sizing dimensions for SVG canvas & bottle proportions
  const dimensions = {
    sm: { w: 140, h: 160, bottleW: 76, bottleH: 116 },
    md: { w: 280, h: 350, bottleW: 150, bottleH: 228 },
    lg: { w: 380, h: 480, bottleW: 200, bottleH: 304 },
    xl: { w: 500, h: 630, bottleW: 260, bottleH: 395 },
    hero: { w: 580, h: 720, bottleW: 300, bottleH: 456 },
  }[size];

  // Specific visual styling per fragrance to guarantee photorealism
  const themeConfigs: Record<
    string,
    {
      liquidCoreGlow: string;
      liquidBaseColor: string;
      liquidAmbient: string;
      glassEdgeColor: string;
      causticColor: string;
      pedestalGlow: string;
      capBase: string;
      capHighlight: string;
      capShadow: string;
      capAccent: string;
      labelBg: string;
      labelBorder: string;
      labelInnerBorder: string;
      labelTextColor: string;
      labelSubtextColor: string;
      goldFoilGradient: [string, string, string, string];
      backlightOpacity: number;
    }
  > = {
    noir: {
      liquidCoreGlow: '#4A2A18',
      liquidBaseColor: '#1A120D',
      liquidAmbient: '#0D0907',
      glassEdgeColor: 'rgba(229, 225, 216, 0.28)',
      causticColor: 'rgba(197, 168, 128, 0.45)',
      pedestalGlow: 'rgba(197, 168, 128, 0.22)',
      capBase: 'linear-gradient(180deg, #1C1A19 0%, #2E2A27 35%, #151312 70%, #0D0C0B 100%)',
      capHighlight: '#5A534C',
      capShadow: '#080706',
      capAccent: '#C5A880',
      labelBg: '#12100E',
      labelBorder: '#C5A880',
      labelInnerBorder: 'rgba(197, 168, 128, 0.45)',
      labelTextColor: '#FDFCF9',
      labelSubtextColor: '#C5A880',
      goldFoilGradient: ['#E8D09B', '#FDF5E2', '#C5A880', '#D9BC7E'],
      backlightOpacity: 0.35,
    },
    aura: {
      liquidCoreGlow: '#F5DEB0',
      liquidBaseColor: '#ECD199',
      liquidAmbient: '#C9A96E',
      glassEdgeColor: 'rgba(255, 255, 255, 0.45)',
      causticColor: 'rgba(212, 175, 55, 0.55)',
      pedestalGlow: 'rgba(212, 175, 55, 0.28)',
      capBase: 'linear-gradient(180deg, #D4BA94 0%, #FFF3D1 30%, #B89248 70%, #947230 100%)',
      capHighlight: '#FFF6DF',
      capShadow: '#785A20',
      capAccent: '#F3DEAC',
      labelBg: '#121115',
      labelBorder: '#D4AF37',
      labelInnerBorder: 'rgba(212, 175, 55, 0.45)',
      labelTextColor: '#FFFFFF',
      labelSubtextColor: '#D4AF37',
      goldFoilGradient: ['#D4AF37', '#FFF3D1', '#AA820A', '#D4AF37'],
      backlightOpacity: 0.45,
    },
    eclat: {
      liquidCoreGlow: '#D1EAE2',
      liquidBaseColor: '#A8D6C7',
      liquidAmbient: '#7EBDA9',
      glassEdgeColor: 'rgba(255, 255, 255, 0.55)',
      causticColor: 'rgba(142, 212, 192, 0.4)',
      pedestalGlow: 'rgba(126, 189, 169, 0.22)',
      capBase: 'linear-gradient(180deg, #D4DFE3 0%, #FFFFFF 35%, #9CA9AF 70%, #768388 100%)',
      capHighlight: '#FFFFFF',
      capShadow: '#5D686D',
      capAccent: '#E2ECF0',
      labelBg: '#0F1618',
      labelBorder: '#78988C',
      labelInnerBorder: 'rgba(120, 152, 140, 0.4)',
      labelTextColor: '#FFFFFF',
      labelSubtextColor: '#A8D6C7',
      goldFoilGradient: ['#9AAFB3', '#E6EEF0', '#6F8489', '#90A3A7'],
      backlightOpacity: 0.4,
    },
    'oud-elite': {
      liquidCoreGlow: '#5C3118',
      liquidBaseColor: '#2C160B',
      liquidAmbient: '#170A04',
      glassEdgeColor: 'rgba(212, 175, 55, 0.35)',
      causticColor: 'rgba(212, 175, 55, 0.48)',
      pedestalGlow: 'rgba(212, 175, 55, 0.25)',
      capBase: 'linear-gradient(180deg, #BA8E48 0%, #F5D58C 32%, #855F20 72%, #634310 100%)',
      capHighlight: '#FAE0A6',
      capShadow: '#4D3308',
      capAccent: '#D4AF37',
      labelBg: '#12100E',
      labelBorder: '#D4AF37',
      labelInnerBorder: 'rgba(212, 175, 55, 0.45)',
      labelTextColor: '#FFFFFF',
      labelSubtextColor: '#D4AF37',
      goldFoilGradient: ['#E8D09B', '#FFF0CA', '#D4AF37', '#DBB25C'],
      backlightOpacity: 0.38,
    },
    'elora-signature-set': {
      liquidCoreGlow: '#E5D3B8',
      liquidBaseColor: '#C4AB87',
      liquidAmbient: '#8C7351',
      glassEdgeColor: 'rgba(255, 255, 255, 0.45)',
      causticColor: 'rgba(212, 175, 55, 0.45)',
      pedestalGlow: 'rgba(212, 175, 55, 0.22)',
      capBase: 'linear-gradient(180deg, #D4BA94 0%, #F5E2B9 40%, #B89358 75%, #947230 100%)',
      capHighlight: '#FFF0D4',
      capShadow: '#785A20',
      capAccent: '#D4AF37',
      labelBg: '#141318',
      labelBorder: '#D4AF37',
      labelInnerBorder: 'rgba(212, 175, 55, 0.45)',
      labelTextColor: '#FFFFFF',
      labelSubtextColor: '#D4AF37',
      goldFoilGradient: ['#D4AF37', '#FFF3D1', '#AA820A', '#D4AF37'],
      backlightOpacity: 0.4,
    },
  };

  const theme = themeConfigs[product.slug] || themeConfigs.noir;
  const uniqueId = `elora-${product.id}-${size}`;

  // Geometry calculations for photorealistic glass proportions
  const bW = dimensions.bottleW;
  const bH = dimensions.bottleH;
  const centerX = dimensions.w / 2;
  const bottleTopY = dimensions.h - bH - (showPedestal ? 34 : 16);
  const bottleLeftX = centerX - bW / 2;

  // Real glass architecture measurements
  const crystalBaseHeight = bH * 0.19; // Thick solid optical crystal base
  const neckW = bW * 0.24;
  const neckH = bH * 0.085;
  const capW = bW * 0.38;
  const capH = bH * 0.185;
  const collarW = bW * 0.28;
  const collarH = bH * 0.042;
  const shoulderRadius = bW * 0.075;

  // Label measurements
  const labelW = bW * 0.70;
  const labelH = bH * 0.43;
  const labelX = (bW - labelW) / 2;
  const labelY = bH * 0.31;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className} ${
        interactive ? 'group cursor-pointer' : ''
      }`}
      style={{
        width: '100%',
        maxWidth: dimensions.w,
        aspectRatio: `${dimensions.w}/${dimensions.h}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        viewBox={`0 0 ${dimensions.w} ${dimensions.h}`}
        className="w-full h-full overflow-visible transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Studio Backlight (Glow passing through translucent flacon juice) */}
          <radialGradient
            id={`backlight-${uniqueId}`}
            cx="50%"
            cy="52%"
            r="48%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor={theme.liquidCoreGlow} stopOpacity={theme.backlightOpacity * 1.5} />
            <stop offset="45%" stopColor={theme.liquidBaseColor} stopOpacity={theme.backlightOpacity * 0.8} />
            <stop offset="85%" stopColor={theme.liquidAmbient} stopOpacity={theme.backlightOpacity * 0.2} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Caustic light projection onto the ground surface */}
          <radialGradient
            id={`caustic-pool-${uniqueId}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor={theme.causticColor} stopOpacity="0.85" />
            <stop offset="35%" stopColor={theme.liquidBaseColor} stopOpacity="0.45" />
            <stop offset="70%" stopColor={theme.pedestalGlow} stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Ambient Ground Occlusion Contact Shadow */}
          <radialGradient
            id={`contact-shadow-${uniqueId}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#171614" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#2A2723" stopOpacity="0.2" />
            <stop offset="80%" stopColor="#68645E" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#171614" stopOpacity="0" />
          </radialGradient>

          {/* Volumetric Liquid Core Gradient (Rich 3D juice absorption) */}
          <radialGradient
            id={`liquid-volumetric-${uniqueId}`}
            cx="52%"
            cy="46%"
            r="56%"
            fx="48%"
            fy="40%"
          >
            <stop offset="0%" stopColor={theme.liquidCoreGlow} />
            <stop offset="40%" stopColor={theme.liquidBaseColor} />
            <stop offset="80%" stopColor={theme.liquidAmbient} />
            <stop offset="100%" stopColor="#0A0604" />
          </radialGradient>

          {/* Solid Heavy Crystal Base Refraction Gradient */}
          <linearGradient
            id={`crystal-base-grad-${uniqueId}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
          </linearGradient>

          {/* Studio Strip Softbox Reflection (Left Curved Shoulder & Wall) */}
          <linearGradient
            id={`softbox-left-${uniqueId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Secondary Studio Fill Light (Right Glass Rim) */}
          <linearGradient
            id={`softbox-right-${uniqueId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.04" />
            <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.55" />
          </linearGradient>

          {/* Cylindrical Metallic Cap Shader (High-Gloss / Brushed Luxury Metal) */}
          <linearGradient
            id={`cap-cylindrical-${uniqueId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={theme.capShadow} />
            <stop offset="14%" stopColor={theme.capBase} />
            <stop offset="34%" stopColor={theme.capHighlight} />
            <stop offset="46%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="58%" stopColor={theme.capHighlight} />
            <stop offset="82%" stopColor={theme.capBase} />
            <stop offset="100%" stopColor={theme.capShadow} />
          </linearGradient>

          {/* Cap Chamfer Top Face */}
          <linearGradient
            id={`cap-top-bevel-${uniqueId}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor={theme.capHighlight} />
            <stop offset="100%" stopColor={theme.capShadow} />
          </linearGradient>

          {/* Gold Foil Embossed Stamp Gradient */}
          <linearGradient
            id={`gold-foil-${uniqueId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={theme.goldFoilGradient[0]} />
            <stop offset="30%" stopColor={theme.goldFoilGradient[1]} />
            <stop offset="65%" stopColor={theme.goldFoilGradient[2]} />
            <stop offset="100%" stopColor={theme.goldFoilGradient[3]} />
          </linearGradient>

          {/* Label Tactile Shadow Filter */}
          <filter id={`label-depth-${uniqueId}`} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.45" />
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.3" />
          </filter>

          {/* Glass Base Floor Reflection Fadeout */}
          <linearGradient
            id={`mirror-fade-${uniqueId}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Mask for Floor Reflection */}
          <mask id={`mirror-mask-${uniqueId}`}>
            <rect
              x="0"
              y="0"
              width={dimensions.w}
              height={dimensions.h}
              fill={`url(#mirror-fade-${uniqueId})`}
            />
          </mask>

          {/* 4 Signature Set Travel Juices */}
          <linearGradient id="signature-juice-0" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5DEB0" />
            <stop offset="60%" stopColor="#ECD199" />
            <stop offset="100%" stopColor="#C9A96E" />
          </linearGradient>
          <linearGradient id="signature-juice-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A2A18" />
            <stop offset="60%" stopColor="#20150F" />
            <stop offset="100%" stopColor="#0D0907" />
          </linearGradient>
          <linearGradient id="signature-juice-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D1EAE2" />
            <stop offset="60%" stopColor="#A8D6C7" />
            <stop offset="100%" stopColor="#7EBDA9" />
          </linearGradient>
          <linearGradient id="signature-juice-3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C3118" />
            <stop offset="60%" stopColor="#2C160B" />
            <stop offset="100%" stopColor="#170A04" />
          </linearGradient>

          {/* Internal Liquid Density Refraction (Volumetric Core Absorption) */}
          <linearGradient id={`liquid-density-internal-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#050302" stopOpacity="0.45" />
            <stop offset="12%" stopColor={theme.liquidAmbient} stopOpacity="0.3" />
            <stop offset="48%" stopColor={theme.liquidCoreGlow} stopOpacity="0.25" />
            <stop offset="52%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="88%" stopColor={theme.liquidAmbient} stopOpacity="0.3" />
            <stop offset="100%" stopColor="#050302" stopOpacity="0.45" />
          </linearGradient>

          {/* Liquid Caustic Refraction Ribbon (Light focusing through perfume fluid) */}
          <linearGradient id={`caustic-ribbon-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="35%" stopColor={theme.liquidCoreGlow} stopOpacity="0.4" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="65%" stopColor={theme.causticColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Dual-wall Prismatic Crystal Refraction (Snell's Law Dispersion) */}
          <linearGradient id={`prism-dispersion-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="25%" stopColor="#AEE2FF" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#FFF0B0" stopOpacity="0.35" />
            <stop offset="85%" stopColor="#FFA07A" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.6" />
          </linearGradient>

          {/* Editorial Glass-morphism Specular Sheen (Diagonal Studio Light Sweep) */}
          <linearGradient id={`editorial-glassmorphism-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
            <stop offset="18%" stopColor="#FFFFFF" stopOpacity="0.15" />
            <stop offset="36%" stopColor="#FFFFFF" stopOpacity="0.02" />
            <stop offset="68%" stopColor="#FFFFFF" stopOpacity="0.0" />
            <stop offset="88%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.25" />
          </linearGradient>

          {/* Meniscus Luminous Surface Tension Refraction */}
          <linearGradient id={`meniscus-glow-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="65%" stopColor={theme.liquidCoreGlow} stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* ============================================================ */}
        {/* 1. STUDIO LIGHTING & PEDESTAL CAUSTICS                       */}
        {/* ============================================================ */}
        {showPedestal && (
          <g>
            {/* Background Studio Backlight Spotlight */}
            <ellipse
              cx={centerX}
              cy={bottleTopY + bH * 0.52}
              rx={bW * 1.05}
              ry={bH * 0.62}
              fill={`url(#backlight-${uniqueId})`}
            />

            {/* Luminous Liquid Caustic Pool on Ground */}
            <ellipse
              cx={centerX}
              cy={bottleTopY + bH + 12}
              rx={bW * 0.72}
              ry={18}
              fill={`url(#caustic-pool-${uniqueId})`}
            />

            {/* Heavy Contact Occlusion Shadow Directly Beneath Glass */}
            <ellipse
              cx={centerX}
              cy={bottleTopY + bH + 4}
              rx={bW * 0.52}
              ry={8}
              fill={`url(#contact-shadow-${uniqueId})`}
            />

            {/* Faint Mirrored Pedestal Reflection (Subtle Luxury Studio Floor Reflection) */}
            <g opacity="0.18" transform={`translate(0, ${(bottleTopY + bH) * 2 + 2}) scale(1, -1)`} mask={`url(#mirror-mask-${uniqueId})`}>
              <rect
                x={bottleLeftX + 4}
                y={bottleTopY + bH - 30}
                width={bW - 8}
                height={28}
                rx="4"
                fill={theme.liquidBaseColor}
                stroke="#FFFFFF"
                strokeWidth="0.8"
              />
            </g>
          </g>
        )}

        {/* ============================================================ */}
        {/* 2. BOTTLE RENDERING: SIGNATURE SET (4-PIECE COFFRET)         */}
        {/* ============================================================ */}
        {isSignatureSet ? (
          <g transform={`translate(${centerX - 145}, ${dimensions.h / 2 - 110})`}>
            {/* Outer Luxury Presentation Coffret (Midnight Obsidian Linen Exterior) */}
            <rect
              x="5"
              y="15"
              width="280"
              height="180"
              rx="10"
              fill="#18131E"
              stroke="#D6B27C"
              strokeWidth="1.2"
              strokeOpacity="0.4"
              filter="drop-shadow(0 20px 40px rgba(0,0,0,0.85))"
            />
            {/* Fine Gilded Inset Inlay on Box Lid */}
            <rect
              x="12"
              y="22"
              width="266"
              height="166"
              rx="6"
              fill="none"
              stroke="#D6B27C"
              strokeWidth="0.6"
              strokeOpacity="0.3"
            />

            {/* Recessed Plush Midnight Velvet Tray */}
            <rect
              x="18"
              y="28"
              width="254"
              height="154"
              rx="5"
              fill="#0E0A14"
            />

            {/* 4 Precision Flacons Displayed in Velvet Recesses */}
            {[
              {
                name: 'AURA',
                vol: '20ML',
                liquid: 'linear-gradient(180deg, #F5DEB0 0%, #ECD199 50%, #C9A96E 100%)',
                cap: '#D6B27C',
                x: 28,
              },
              {
                name: 'NOIR',
                vol: '20ML',
                liquid: 'linear-gradient(180deg, #4A2A18 0%, #20150F 50%, #0D0907 100%)',
                cap: '#2A2624',
                x: 88,
              },
              {
                name: 'ÉCLAT',
                vol: '20ML',
                liquid: 'linear-gradient(180deg, #D1EAE2 0%, #A8D6C7 50%, #7EBDA9 100%)',
                cap: '#C2CED2',
                x: 148,
              },
              {
                name: 'OUD ÉLITE',
                vol: '20ML',
                liquid: 'linear-gradient(180deg, #5C3118 0%, #2C160B 50%, #170A04 100%)',
                cap: '#BA8E48',
                x: 208,
              },
            ].map((flacon, idx) => (
              <g key={idx} transform={`translate(${flacon.x}, 38)`}>
                {/* Velvet Recess Slot Shadow */}
                <rect x="3" y="1" width="44" height="124" rx="4" fill="#06040A" />

                {/* Polished Metallic Atomizer Cap with Specular Sheen */}
                <rect x="13" y="4" width="24" height="24" rx="2" fill={flacon.cap} stroke="#000000" strokeWidth="0.5" />
                <rect x="18" y="4" width="6" height="24" fill="#FFFFFF" fillOpacity="0.35" />
                {/* Cap Collar Ring */}
                <rect x="11" y="26" width="28" height="4" rx="1" fill="#E8D0A1" stroke="#000000" strokeWidth="0.4" />

                {/* Heavy Crystal Glass Body */}
                <rect
                  x="7"
                  y="30"
                  width="36"
                  height="90"
                  rx="3"
                  fill="#FFFFFF"
                  fillOpacity="0.08"
                  stroke="#FFFFFF"
                  strokeWidth="0.8"
                  strokeOpacity="0.5"
                />

                {/* Inner Jewel-Toned Liquid Chamber */}
                <rect
                  x="10"
                  y="35"
                  width="30"
                  height="72"
                  rx="2"
                  fill={`url(#signature-juice-${idx})`}
                />

                {/* Solid Crystal Bottom Glass (Heavy Base) */}
                <rect x="7" y="107" width="36" height="13" rx="2" fill="#FFFFFF" fillOpacity="0.22" />
                <line x1="10" y1="109" x2="40" y2="109" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.7" />

                {/* Glass Left Edge Softbox Glint */}
                <rect x="9" y="32" width="4" height="84" fill="#FFFFFF" fillOpacity="0.4" />

                {/* Gilded Label Plaque on Travel Flacon */}
                <rect x="11" y="58" width="28" height="34" rx="1.5" fill="#FAF7F2" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.3))" />
                <rect x="12.5" y="59.5" width="25" height="31" rx="1" fill="none" stroke="#B89358" strokeWidth="0.4" />

                <text x="25" y="69" fill="#1C1917" fontSize="4.6" fontFamily="'Cinzel', Georgia, serif" fontWeight="700" letterSpacing="0.4" textAnchor="middle">
                  ELORA
                </text>
                <line x1="18" y1="72" x2="32" y2="72" stroke="#B89358" strokeWidth="0.4" />
                <text x="25" y="79" fill="#8B6B38" fontSize="4.2" fontFamily="'Cinzel', Georgia, serif" fontWeight="600" textAnchor="middle">
                  {flacon.name}
                </text>
                <text x="25" y="86" fill="#6B625B" fontSize="3" fontFamily="'Plus Jakarta Sans', sans-serif" textAnchor="middle">
                  {flacon.vol} EDP
                </text>
              </g>
            ))}

            {/* Embedded Gilded Coffret Plaque at the Bottom */}
            <rect
              x="50"
              y="166"
              width="190"
              height="16"
              rx="3"
              fill="#1F1728"
              stroke="#D6B27C"
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />
            <text
              x="145"
              y="177"
              fill="#F7EADB"
              fontSize="7"
              fontFamily="'Cinzel', Georgia, serif"
              fontWeight="600"
              letterSpacing="2.2"
              textAnchor="middle"
            >
              ELORA PARFUM · DISCOVERY COFFRET
            </text>
          </g>
        ) : (
          /* ============================================================ */
          /* 3. BOTTLE RENDERING: STANDALONE 100ML HAUTE FLACON           */
          /* ============================================================ */
          <g transform={`translate(${bottleLeftX}, ${bottleTopY})`}>
            {/* 3A. ATOMIZER NECK ASSEMBLY (VISIBLE THROUGH CRYSTAL) */}
            {/* Crystal Neck Base */}
            <rect
              x={(bW - neckW) / 2}
              y={capH * 0.72}
              width={neckW}
              height={neckH + 8}
              rx="3"
              fill="#FFFFFF"
              fillOpacity="0.25"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeOpacity="0.4"
            />

            {/* Machined Metallic Spray Collar */}
            <rect
              x={(bW - collarW) / 2}
              y={capH * 0.88}
              width={collarW}
              height={collarH}
              rx="2"
              fill={`url(#cap-cylindrical-${uniqueId})`}
              stroke="#000000"
              strokeWidth="0.6"
              strokeOpacity="0.6"
              filter="drop-shadow(0 2px 3px rgba(0,0,0,0.35))"
            />

            {/* 3B. THE WEIGHTED ARCHITECTURAL FLACON CAP */}
            <g filter="drop-shadow(0 8px 16px rgba(0,0,0,0.45))">
              {/* Cap Main Column */}
              <rect
                x={(bW - capW) / 2}
                y={0}
                width={capW}
                height={capH}
                rx="4"
                fill={`url(#cap-cylindrical-${uniqueId})`}
                stroke={theme.capShadow}
                strokeWidth="0.8"
              />

              {/* Cap Top Chamfer Face (Reflecting overhead light) */}
              <rect
                x={(bW - capW) / 2 + 2}
                y={1.5}
                width={capW - 4}
                height={capH * 0.12}
                rx="2"
                fill={`url(#cap-top-bevel-${uniqueId})`}
                opacity="0.85"
              />

              {/* Subtle Gold / Metallic Inset Horizon Line */}
              <line
                x1={(bW - capW) / 2 + 2}
                y1={capH * 0.78}
                x2={(bW + capW) / 2 - 2}
                y2={capH * 0.78}
                stroke={theme.capAccent}
                strokeWidth="0.9"
                strokeOpacity="0.8"
              />

              {/* Razor-sharp Specular Glint running down the cap */}
              <line
                x1={(bW - capW) / 2 + capW * 0.38}
                y1={2}
                x2={(bW - capW) / 2 + capW * 0.38}
                y2={capH - 2}
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity="0.75"
              />
            </g>

            {/* Shadow cast by Cap onto the Bottle Shoulders */}
            <ellipse
              cx={bW / 2}
              cy={capH + 3}
              rx={capW * 0.58}
              ry={3.5}
              fill="#000000"
              fillOpacity="0.45"
            />

            {/* 3C. HEAVY CRYSTAL BOTTLE BODY (DUAL-WALL ARCHITECTURE) */}
            {/* Outer Heavy Crystal Silhouette */}
            <rect
              x={0}
              y={capH + neckH * 0.4}
              width={bW}
              height={bH - (capH + neckH * 0.4)}
              rx={shoulderRadius}
              fill={product.bottleTheme.glassTint}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.2"
              filter="drop-shadow(0 16px 36px rgba(0,0,0,0.55))"
            />

            {/* Inner Volumetric Liquid Chamber (Fluid Reservoir) */}
            <rect
              x={bW * 0.08}
              y={capH + neckH + bH * 0.03}
              width={bW * 0.84}
              height={bH - (capH + neckH + crystalBaseHeight + bH * 0.04)}
              rx="4"
              fill={`url(#liquid-volumetric-${uniqueId})`}
            />

            {/* Internal Liquid Density Reflections (Edge Density Gradient & Core Luminescence) */}
            <rect
              x={bW * 0.08}
              y={capH + neckH + bH * 0.03}
              width={bW * 0.84}
              height={bH - (capH + neckH + crystalBaseHeight + bH * 0.04)}
              rx="4"
              fill={`url(#liquid-density-internal-${uniqueId})`}
              className="pointer-events-none"
            />

            {/* Internal Liquid Caustic Refraction Ribbon (Luminous focused light rays inside juice) */}
            <path
              d={`M ${bW * 0.14} ${capH + neckH + bH * 0.12} Q ${bW * 0.46} ${
                capH + neckH + bH * 0.22
              } ${bW * 0.38} ${bH - crystalBaseHeight - bH * 0.08} Q ${bW * 0.62} ${
                bH - crystalBaseHeight - bH * 0.18
              } ${bW * 0.82} ${capH + neckH + bH * 0.35}`}
              stroke={`url(#caustic-ribbon-${uniqueId})`}
              strokeWidth={bW * 0.09}
              strokeLinecap="round"
              fill="none"
              opacity="0.65"
              className="pointer-events-none"
            />

            {/* Secondary diagonal caustic glint */}
            <path
              d={`M ${bW * 0.22} ${capH + neckH + bH * 0.42} Q ${bW * 0.52} ${
                capH + neckH + bH * 0.50
              } ${bW * 0.76} ${bH - crystalBaseHeight - bH * 0.10}`}
              stroke={`url(#caustic-ribbon-${uniqueId})`}
              strokeWidth={bW * 0.05}
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
              className="pointer-events-none"
            />

            {/* Meniscus Curve at Top of Liquid (Curved Surface Tension & Luminous Meniscus Refraction) */}
            <path
              d={`M ${bW * 0.08} ${capH + neckH + bH * 0.045} Q ${bW * 0.5} ${
                capH + neckH + bH * 0.06
              } ${bW * 0.92} ${capH + neckH + bH * 0.045}`}
              stroke={`url(#meniscus-glow-${uniqueId})`}
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Subtle Meniscus shadow below fluid curve */}
            <path
              d={`M ${bW * 0.08} ${capH + neckH + bH * 0.048} Q ${bW * 0.5} ${
                capH + neckH + bH * 0.063
              } ${bW * 0.92} ${capH + neckH + bH * 0.048}`}
              stroke="#000000"
              strokeWidth="0.8"
              strokeOpacity="0.35"
              fill="none"
            />

            {/* 3D Capillary Dip Tube (Ultra-Clear Fluoropolymer with Real Fluid Refraction) */}
            {/* NEVER a dashed line - subtle, realistic refraction tube */}
            <g opacity="0.32">
              <line
                x1={bW * 0.495}
                y1={capH + neckH}
                x2={bW * 0.52}
                y2={bH - crystalBaseHeight - 6}
                stroke="#FFFFFF"
                strokeWidth="1.4"
              />
              <line
                x1={bW * 0.505}
                y1={capH + neckH}
                x2={bW * 0.53}
                y2={bH - crystalBaseHeight - 6}
                stroke="#000000"
                strokeWidth="0.6"
              />
            </g>

            {/* 3D SOLID OPTICAL CRYSTAL BASE (Massive Weighted Bottom) */}
            <g>
              {/* Solid Glass Base Block */}
              <rect
                x={bW * 0.04}
                y={bH - crystalBaseHeight}
                width={bW * 0.92}
                height={crystalBaseHeight - 3}
                rx="3"
                fill={`url(#crystal-base-grad-${uniqueId})`}
              />

              {/* Internal Refraction Prism Shelf (Horizontal Crystal Reflection Line) */}
              <line
                x1={bW * 0.08}
                y1={bH - crystalBaseHeight * 0.65}
                x2={bW * 0.92}
                y2={bH - crystalBaseHeight * 0.65}
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity="0.65"
              />

              {/* Bottom Ground Chamfer Highlight */}
              <line
                x1={bW * 0.06}
                y1={bH - 3}
                x2={bW * 0.94}
                y2={bH - 3}
                stroke="#FFFFFF"
                strokeWidth="1.4"
                strokeOpacity="0.8"
              />

              {/* Corner Facet 45-degree Refraction Bevels */}
              <line
                x1={bW * 0.04}
                y1={bH - crystalBaseHeight}
                x2={bW * 0.12}
                y2={bH - 3}
                stroke="#FFFFFF"
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
              <line
                x1={bW * 0.96}
                y1={bH - crystalBaseHeight}
                x2={bW * 0.88}
                y2={bH - 3}
                stroke="#FFFFFF"
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
            </g>

            {/* 3D. BESPOKE HAUTE PARFUMERIE PLAQUE (PHYSICAL TACTILE LABEL) */}
            <g
              transform={`translate(${labelX}, ${labelY})`}
              filter={`url(#label-depth-${uniqueId})`}
            >
              {/* Textured Paper / Satin Plaque Base */}
              <rect
                x={0}
                y={0}
                width={labelW}
                height={labelH}
                rx="3.5"
                fill={theme.labelBg}
                stroke={theme.labelBorder}
                strokeWidth="1"
              />

              {/* Outer Embossed Gold Foil Frame with 3D Bevel effect */}
              <rect
                x={2.5}
                y={2.5}
                width={labelW - 5}
                height={labelH - 5}
                rx="2"
                fill="none"
                stroke={`url(#gold-foil-${uniqueId})`}
                strokeWidth="1"
              />

              {/* Inner Delicate Hairline Border */}
              <rect
                x={5}
                y={5}
                width={labelW - 10}
                height={labelH - 10}
                rx="1"
                fill="none"
                stroke={theme.labelInnerBorder}
                strokeWidth="0.6"
              />

              {/* Corner Miter Accent Pips */}
              <rect x={4} y={4} width="2" height="2" fill={theme.labelBorder} />
              <rect x={labelW - 6} y={4} width="2" height="2" fill={theme.labelBorder} />
              <rect x={4} y={labelH - 6} width="2" height="2" fill={theme.labelBorder} />
              <rect x={labelW - 6} y={labelH - 6} width="2" height="2" fill={theme.labelBorder} />

              {/* Gilded Brand Monogram Crest Icon */}
              <g transform={`translate(${labelW / 2 - 6}, ${labelH * 0.08}) scale(0.6)`}>
                <circle cx="10" cy="10" r="9" fill="none" stroke={`url(#gold-foil-${uniqueId})`} strokeWidth="1" />
                <path
                  d="M 7 6 L 13 6 M 7 10 L 12 10 M 7 14 L 13 14 M 7 6 L 7 14"
                  stroke={`url(#gold-foil-${uniqueId})`}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </g>

              {/* BRAND: ELORA (Imperial Roman Serif with Gold Foil Luster) */}
              <text
                x={labelW / 2}
                y={labelH * 0.33}
                fill={theme.labelTextColor}
                fontSize={labelW * 0.138}
                fontFamily="'Cinzel', Georgia, serif"
                fontWeight="700"
                letterSpacing="2.8"
                textAnchor="middle"
              >
                ELORA
              </text>

              {/* BRAND: PARFUM */}
              <text
                x={labelW / 2}
                y={labelH * 0.44}
                fill={theme.labelSubtextColor}
                fontSize={labelW * 0.078}
                fontFamily="'Cinzel', Georgia, serif"
                fontWeight="600"
                letterSpacing="4"
                textAnchor="middle"
              >
                PARFUM
              </text>

              {/* Gilded Center Ornamental Divider with Diamond */}
              <g transform={`translate(${labelW / 2}, ${labelH * 0.50})`}>
                <line x1="-24" y1="0" x2="-4" y2="0" stroke={theme.labelBorder} strokeWidth="0.75" />
                <polygon points="0,-2.5 2.5,0 0,2.5 -2.5,0" fill={`url(#gold-foil-${uniqueId})`} />
                <line x1="4" y1="0" x2="24" y2="0" stroke={theme.labelBorder} strokeWidth="0.75" />
              </g>

              {/* FRAGRANCE NAME (AURA, NOIR, ÉCLAT, OUD ÉLITE) */}
              <text
                x={labelW / 2}
                y={labelH * 0.65}
                fill={theme.labelTextColor}
                fontSize={labelW * 0.125}
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontWeight="700"
                letterSpacing="2.2"
                textAnchor="middle"
              >
                {product.name}
              </text>

              {/* CONCENTRATION */}
              <text
                x={labelW / 2}
                y={labelH * 0.77}
                fill={theme.labelSubtextColor}
                fontSize={labelW * 0.062}
                fontFamily="'Plus Jakarta Sans', sans-serif"
                fontWeight="500"
                letterSpacing="1.8"
                textAnchor="middle"
              >
                EAU DE PARFUM
              </text>

              {/* VOLUME & ORIGIN */}
              <text
                x={labelW / 2}
                y={labelH * 0.88}
                fill={theme.labelSubtextColor}
                fontSize={labelW * 0.054}
                fontFamily="'Plus Jakarta Sans', sans-serif"
                letterSpacing="1.2"
                textAnchor="middle"
                opacity="0.85"
              >
                100 ML · 3.4 FL. OZ.
              </text>
            </g>

            {/* 3E. DUAL STUDIO SOFTBOX REFLECTIONS & EDITORIAL GLASS-MORPHISM OVERLAY */}
            {/* Full Flacon Glass-morphism Specular Sheen (Curved Crystal Reflection) */}
            <rect
              x={0}
              y={capH + neckH * 0.4}
              width={bW}
              height={bH - (capH + neckH * 0.4)}
              rx={shoulderRadius}
              fill={`url(#editorial-glassmorphism-${uniqueId})`}
              className="pointer-events-none"
            />

            {/* Left Softbox Vertical Highlight Strip */}
            <rect
              x={bW * 0.03}
              y={capH + neckH * 0.5}
              width={bW * 0.14}
              height={bH - (capH + neckH * 0.5) - 4}
              rx="4"
              fill={`url(#softbox-left-${uniqueId})`}
              className="pointer-events-none"
            />

            {/* Dual-wall Prismatic Refraction Boundary (Left Glass Wall) */}
            <line
              x1={bW * 0.07}
              y1={capH + neckH * 0.8}
              x2={bW * 0.07}
              y2={bH - crystalBaseHeight}
              stroke={`url(#prism-dispersion-${uniqueId})`}
              strokeWidth="1.6"
              strokeLinecap="round"
              className="pointer-events-none"
            />

            {/* Extreme Left Glass Rim Light (Razor-sharp 1.2px) */}
            <line
              x1={bW * 0.02}
              y1={capH + neckH * 0.6}
              x2={bW * 0.02}
              y2={bH - 6}
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeOpacity="0.8"
              className="pointer-events-none"
            />

            {/* Dual-wall Internal Refraction Boundary (Right Glass Wall) */}
            <line
              x1={bW * 0.93}
              y1={capH + neckH * 0.8}
              x2={bW * 0.93}
              y2={bH - crystalBaseHeight}
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeOpacity="0.35"
              strokeLinecap="round"
              className="pointer-events-none"
            />

            {/* Right Diffused Fill Light */}
            <rect
              x={bW * 0.84}
              y={capH + neckH * 0.5}
              width={bW * 0.13}
              height={bH - (capH + neckH * 0.5) - 4}
              rx="4"
              fill={`url(#softbox-right-${uniqueId})`}
              className="pointer-events-none"
            />

            {/* Top Shoulder Glass Specular Glint */}
            <path
              d={`M ${bW * 0.06} ${capH + neckH * 0.7} Q ${bW * 0.5} ${capH + neckH * 0.4} ${
                bW * 0.94
              } ${capH + neckH * 0.7}`}
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeOpacity="0.55"
              fill="none"
              className="pointer-events-none"
            />

            {/* Subtle Diagonal Studio Refraction Flare across shoulder */}
            <path
              d={`M ${bW * 0.08} ${capH + neckH * 0.9} L ${bW * 0.35} ${capH + neckH * 0.5}`}
              stroke="#FFFFFF"
              strokeWidth="1"
              strokeOpacity="0.4"
              strokeLinecap="round"
              className="pointer-events-none"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
