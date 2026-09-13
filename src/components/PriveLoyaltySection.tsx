import React from 'react';
import { ArrowRight, Gem } from 'lucide-react';
import { usePriveLoyalty } from '../context/PriveLoyaltyContext';

export const PriveLoyaltySection: React.FC = () => {
  const {
    points,
    tierName,
    nextTierPointsNeeded,
    tierProgressPercent,
    rewards,
    openPriveModal,
  } = usePriveLoyalty();

  return (
    <div
      id="elora-prive-loyalty"
      className="bg-[#0A0A0C] text-[#FAF9F6] border-b border-[#24232C] relative overflow-hidden"
    >
      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center justify-between">
          {/* Left Column: Brand & Points Counter */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-sans font-medium">
              <Gem className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Elora Privé · Private Client Allocation</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-4">
              <h3 className="font-serif text-fluid-h3 tracking-[0.06em] uppercase font-normal text-[#FFFFFF]">
                THE CELLAR VAULT
              </h3>
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#D4AF37] px-2.5 py-0.5 border border-[#D4AF37]/40">
                {tierName}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#D4D4D8] font-sans font-light leading-relaxed max-w-xl">
              Patrons receive 1 Privé Point per ₹10 invested in fine flacons. Privé Points are redeemable for unreleased cellar extractions, rare attars, and bespoke batch allocations.
            </p>

            {/* Points & Progress Meter */}
            <div className="pt-2 space-y-2 max-w-md">
              <div className="flex items-baseline justify-between text-xs font-sans">
                <div className="flex items-baseline space-x-2">
                  <span className="font-serif text-2xl font-bold text-[#FFFFFF]">
                    {points.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1AA]">
                    Available Privé Points
                  </span>
                </div>
                {nextTierPointsNeeded > 0 && (
                  <span className="text-[10px] text-[#D4AF37] tracking-wider">
                    {nextTierPointsNeeded} pts to next tier
                  </span>
                )}
              </div>

              <div className="w-full h-[2px] bg-[#24232C] overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] transition-all duration-700"
                  style={{ width: `${tierProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Active Privileges */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4">
            <div className="p-5 border border-[#24232C] bg-[#14141B] flex-1">
              <span className="text-[9.5px] uppercase tracking-[0.22em] text-[#D4AF37] font-sans block mb-1">
                Cellar Privilege
              </span>
              <p className="font-serif text-sm text-[#FAF9F6] tracking-wide">
                Complimentary 10ml Extrait with Next Commission
              </p>
            </div>

            <button
              onClick={openPriveModal}
              className="px-6 py-4 bg-[#D4AF37] text-[#0A0A0C] hover:bg-[#E5C378] text-xs uppercase tracking-[0.22em] font-sans transition-colors shrink-0 flex items-center justify-center space-x-2 font-semibold shadow-[0_4px_20px_rgba(212,175,55,0.2)]"
            >
              <span>Cellar Vault</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
