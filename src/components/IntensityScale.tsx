import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gauge } from 'lucide-react';

export interface IntensityScaleProps {
  intensity: number; // 1 to 5
  variant?: 'bars' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showDescription?: boolean;
  interactive?: boolean;
  className?: string;
}

export const INTENSITY_META: Record<
  number,
  { label: string; strength: string; description: string }
> = {
  1: {
    label: 'Subtle & Intimate',
    strength: 'Light Skin-Scent',
    description: 'A delicate whisper that stays close to the skin, ideal for intimate settings and subtle everyday elegance.',
  },
  2: {
    label: 'Delicate & Luminous',
    strength: 'Airy Presence',
    description: 'Fresh and radiant projection with a soft, breezy halo that floats pleasantly around you.',
  },
  3: {
    label: 'Refined & Balanced',
    strength: 'Moderate Sillage',
    description: 'A harmonious signature balance. Noticeable to those nearby with an unforgettable, sophisticated trail.',
  },
  4: {
    label: 'Rich & Radiant',
    strength: 'Pronounced Sillage',
    description: 'Deep, enveloping projection with commanding presence that turns heads and lingers in the room.',
  },
  5: {
    label: 'Intense & Opulent',
    strength: 'Profound Extrait',
    description: 'Maximum concentration and sovereign sillage. Hypnotic, deeply seductive, and enduring well past 16 hours.',
  },
};

export const IntensityScale: React.FC<IntensityScaleProps> = ({
  intensity,
  variant = 'bars',
  size = 'md',
  showLabel = true,
  showDescription = false,
  className = '',
}) => {
  const safeIntensity = Math.min(5, Math.max(1, intensity || 3));
  const meta = INTENSITY_META[safeIntensity] || INTENSITY_META[3];

  const barHeight =
    size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2.5';
  const dotSize =
    size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';

  return (
    <div className={`space-y-2 font-sans ${className}`} id="intensity-scale">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-purple-200/90 font-medium">
            <Gauge className="w-3.5 h-3.5 text-rose-300 shrink-0" />
            <span className="uppercase tracking-[0.18em] text-[10px] font-semibold text-rose-300">
              Intensity
            </span>
            <span className="text-white/30">·</span>
            <span className="text-white font-medium">{safeIntensity} of 5</span>
          </div>
          <span className="text-[11px] font-serif italic text-purple-200/90">
            {meta.label}
          </span>
        </div>
      )}

      {/* Visual Indicator: Bars or Dots */}
      {variant === 'bars' ? (
        <div className="grid grid-cols-5 gap-1.5 items-center">
          {[1, 2, 3, 4, 5].map((level) => {
            const isActive = level <= safeIntensity;
            return (
              <div
                key={level}
                className={`relative ${barHeight} rounded-full overflow-hidden bg-white/10 border border-white/5`}
              >
                {isActive && (
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: 0.5,
                      delay: level * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-400 via-rose-300 to-amber-200 shadow-[0_0_10px_rgba(244,114,182,0.5)]"
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((level) => {
            const isActive = level <= safeIntensity;
            return (
              <motion.div
                key={level}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: isActive ? 1 : 0.9,
                  opacity: isActive ? 1 : 0.4,
                }}
                transition={{
                  duration: 0.3,
                  delay: level * 0.05,
                }}
                className={`${dotSize} rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-400 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] ring-1 ring-white/40'
                    : 'bg-white/15 border border-white/10'
                }`}
              />
            );
          })}
        </div>
      )}

      {showDescription && (
        <p className="text-[11px] text-purple-200/75 leading-relaxed font-sans pt-0.5">
          <span className="font-semibold text-white">{meta.strength}: </span>
          {meta.description}
        </p>
      )}
    </div>
  );
};
