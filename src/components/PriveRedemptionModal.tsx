import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Gift, Shield, ArrowRight, Award, Lock, ExternalLink } from 'lucide-react';
import { PriveRewardItem } from '../types';
import { usePriveLoyalty } from '../context/PriveLoyaltyContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export const PriveRedemptionModal: React.FC = () => {
  const {
    points,
    tierName,
    tierProgressPercent,
    rewards,
    isPriveModalOpen,
    selectedRewardForRedeem,
    closePriveModal,
    redeemReward,
    redeemedRewardIds,
  } = usePriveLoyalty();

  const { addToCart } = useCart();
  const [activeItem, setActiveItem] = useState<PriveRewardItem>(
    selectedRewardForRedeem || rewards[0]
  );
  const [redeemedResult, setRedeemedResult] = useState<{
    success: boolean;
    voucherCode?: string;
    message: string;
    item?: PriveRewardItem;
  } | null>(null);

  React.useEffect(() => {
    if (selectedRewardForRedeem) {
      setActiveItem(selectedRewardForRedeem);
    }
  }, [selectedRewardForRedeem]);

  if (!isPriveModalOpen) return null;

  const handleRedeem = (item: PriveRewardItem) => {
    const res = redeemReward(item);
    if (res.success) {
      setRedeemedResult({ ...res, item });
    } else {
      alert(res.message);
    }
  };

  const handleClaimAndAddToBag = (item: PriveRewardItem, voucherCode: string) => {
    // Add complimentary item to bag
    const priveProductMock = {
      id: item.id,
      name: item.title,
      subtitle: item.editionSubtitle,
      category: item.category,
      price: 0,
      description: item.description,
      size: item.size,
      slug: 'prive-exclusive',
      notes: {
        top: item.notes.slice(0, 2),
        heart: item.notes.slice(2, 3),
        base: item.notes.slice(3, 4),
      },
      accordTags: item.notes,
      intensity: 5,
      isBestSeller: false,
      isNewArrival: true,
      tagline: item.editionSubtitle,
      bottleTheme: {
        accentColor: item.flaconColor,
        secondaryColor: '#FFD700',
        capColor: '#C0A060',
        glassOpacity: 0.88,
        liquidColor: item.flaconColor,
        silhouette: 'classic' as const,
      },
    };
    addToCart(priveProductMock, 1);
    closePriveModal();
    setRedeemedResult(null);
  };

  return (
    <div
      id="prive-redemption-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Dark frosted overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closePriveModal}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Main Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="relative w-full max-w-4xl bg-[#130E1F] border border-amber-400/30 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden z-10 text-white my-auto"
      >
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #DAA520 0%, #8A2BE2 50%, transparent 70%)' }}
        />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/10 relative z-10 bg-[#161024]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-[#120E1A] flex items-center justify-center shadow-md">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display text-sm sm:text-base tracking-[0.2em] uppercase font-bold text-white">
                  ELORA PRIVÉ
                </h3>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-sans tracking-widest font-semibold border border-amber-400/30">
                  {tierName}
                </span>
              </div>
              <p className="text-[11px] text-purple-200/60 font-sans">
                Private Cellar Allocation & Limited-Run Distillations
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Points pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#201733] border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-mono text-xs font-bold text-amber-200">
                {points.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-purple-200/70 uppercase tracking-wider font-sans">
                Privé Points
              </span>
            </div>

            <button
              onClick={closePriveModal}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white flex items-center justify-center transition-all border border-white/10"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 relative z-10">
          {redeemedResult && redeemedResult.item ? (
            /* Redemption Success View */
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-300 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-[#120E1A] flex items-center justify-center mx-auto shadow-xl shadow-amber-400/30">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-300 font-sans font-bold block mb-1">
                  Private Allocation Certificate Dispatched
                </span>
                <h4 className="font-display text-2xl sm:text-3xl text-white tracking-[0.14em] uppercase font-bold">
                  {redeemedResult.item.title}
                </h4>
                <p className="text-xs text-purple-200/80 mt-1 font-sans">
                  {redeemedResult.item.editionSubtitle} · {redeemedResult.item.size}
                </p>
              </div>

              {/* Certificate Box */}
              <div className="bg-[#1A1328] border border-amber-400/40 rounded-2xl p-5 space-y-2 text-left shadow-lg">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-purple-300 font-sans">
                    Allocation Seal Number
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-amber-300 font-sans font-bold">
                    Official Reserve
                  </span>
                </div>
                <div className="font-mono text-lg sm:text-xl font-bold text-amber-300 tracking-[0.18em] text-center py-1">
                  {redeemedResult.voucherCode}
                </div>
                <p className="text-[11px] text-purple-200/70 font-sans leading-relaxed text-center">
                  This allocation has been deducted from your Privé points balance. You may claim this complimentary flacon directly to your active bag for dispatch.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleClaimAndAddToBag(redeemedResult.item!, redeemedResult.voucherCode!)
                  }
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-200 text-[#120E1A] font-sans font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:opacity-95 transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>ADD TO BAG FOR COMPLIMENTARY DISPATCH</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRedeemedResult(null)}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-sans text-xs uppercase tracking-[0.2em] rounded-full transition-all border border-white/15"
                >
                  Inspect Other Vault Scents
                </button>
              </div>
            </div>
          ) : (
            /* Catalog & Detail Grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Left Column: Reward Cards List (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-purple-300 font-sans font-semibold">
                    Exclusive Vault Cellar
                  </span>
                  <span className="text-[10px] text-purple-300/60 font-sans">
                    {rewards.length} Reserves Available
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {rewards.map((item) => {
                    const isSelected = activeItem.id === item.id;
                    const canAfford = points >= item.pointsRequired;
                    const isAlreadyRedeemed = redeemedRewardIds.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveItem(item)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                          isSelected
                            ? 'bg-[#221835] border-amber-400/60 shadow-lg shadow-amber-950/40'
                            : 'bg-[#181124] border-white/10 hover:border-white/20 hover:bg-[#1E142C]'
                        }`}
                      >
                        {/* Selected indicator line */}
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />
                        )}

                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[8.5px] uppercase tracking-[0.18em] text-amber-300/90 font-sans font-semibold block">
                              {item.rarityBadge}
                            </span>
                            <h5 className="font-serif text-sm font-semibold text-white mt-0.5">
                              {item.title}
                            </h5>
                            <p className="text-[10.5px] text-purple-200/60 font-sans truncate">
                              {item.size} · {item.concentration}
                            </p>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="font-mono text-xs font-bold text-amber-300 block">
                              {item.pointsRequired} pts
                            </span>
                            {isAlreadyRedeemed ? (
                              <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-sans">
                                Redeemed
                              </span>
                            ) : canAfford ? (
                              <span className="text-[9px] uppercase tracking-wider text-amber-200 font-sans">
                                Unlocked
                              </span>
                            ) : (
                              <span className="text-[9px] uppercase tracking-wider text-purple-300/50 font-sans">
                                Locked
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Reward Detailed Dossier (7 cols) */}
              <div className="lg:col-span-7 bg-[#1A1328] border border-white/10 rounded-2xl p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-4">
                  {/* Flacon Glow Emblem */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: activeItem.flaconColor }}
                      />
                      <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-amber-300">
                        {activeItem.editionSubtitle}
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-300/70 uppercase tracking-widest font-sans">
                      {activeItem.availableQuantity} of 100 remaining
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display text-2xl sm:text-3xl text-white tracking-[0.14em] uppercase font-bold">
                      {activeItem.title}
                    </h4>
                    <p className="text-xs text-rose-300/90 font-sans font-light mt-0.5">
                      {activeItem.category}
                    </p>
                  </div>

                  {/* Specification pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-sans text-purple-200">
                      Volume: {activeItem.size}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-sans text-purple-200">
                      Strength: {activeItem.concentration}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-sans text-amber-200 font-medium">
                      Private Flacon Allocation
                    </span>
                  </div>

                  <p className="text-xs sm:text-[13px] text-purple-200/80 font-sans font-light leading-relaxed">
                    {activeItem.description}
                  </p>

                  {/* Rare Key Notes */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[9.5px] uppercase tracking-[0.2em] text-purple-300/70 font-sans font-semibold block">
                      Rare Botanical Extractions
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeItem.notes.map((note) => (
                        <span
                          key={note}
                          className="px-2.5 py-1 rounded-lg bg-[#241A35] border border-white/10 text-[10.5px] text-amber-100 font-sans"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action / Redemption Bar */}
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-purple-300/70 font-sans block">
                      Privé Points Required
                    </span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="font-mono text-xl font-bold text-amber-300">
                        {activeItem.pointsRequired.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-purple-300/70 font-sans">
                        / {points.toLocaleString('en-IN')} available
                      </span>
                    </div>
                  </div>

                  {redeemedRewardIds.includes(activeItem.id) ? (
                    <div className="px-5 py-2.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-sans font-medium flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ALLOCATION CLAIMED</span>
                    </div>
                  ) : points >= activeItem.pointsRequired ? (
                    <button
                      type="button"
                      onClick={() => handleRedeem(activeItem)}
                      className="w-full sm:w-auto px-7 py-3 min-h-[44px] bg-gradient-to-r from-amber-400 to-amber-200 text-[#120E1A] font-sans font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:opacity-95 transition-all shadow-lg flex items-center justify-center space-x-2 active:scale-95"
                    >
                      <Gift className="w-4 h-4" />
                      <span>REDEEM ALLOCATION</span>
                    </button>
                  ) : (
                    <div className="w-full sm:w-auto text-center sm:text-right">
                      <button
                        type="button"
                        disabled
                        className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] bg-white/10 text-purple-300/50 font-sans text-xs uppercase tracking-[0.16em] rounded-full cursor-not-allowed border border-white/10 flex items-center justify-center space-x-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>REQUIRES {activeItem.pointsRequired - points} MORE PTS</span>
                      </button>
                      <span className="text-[9.5px] text-purple-300/50 font-sans block mt-1">
                        Earn 1 pt per ₹10 on flacon orders
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
