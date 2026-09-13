import React, { useState } from 'react';
import { Check, Plus, ShoppingBag, RotateCcw } from 'lucide-react';
import { PRODUCTS, BUNDLE_OPTIONS } from '../data/products';
import { Product } from '../types';
import { EloraBottleVisualizer } from './EloraBottleVisualizer';
import { useCart } from '../context/CartContext';

export const BundleBuilderSection: React.FC<{ isStandalonePage?: boolean }> = ({
  isStandalonePage = false,
}) => {
  const { addToCart } = useCart();
  const [selectedTierIdx, setSelectedTierIdx] = useState(0);
  const activeTier = BUNDLE_OPTIONS[selectedTierIdx];

  // Eligible standalone 100ml flacons
  const eligibleProducts = PRODUCTS.filter((p) => p.slug !== 'elora-signature-set');

  // Selected products array
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([
    eligibleProducts[0],
    eligibleProducts[1],
  ]);

  const handleTierChange = (idx: number) => {
    setSelectedTierIdx(idx);
    const newCount = BUNDLE_OPTIONS[idx].bottleCount;
    if (selectedProducts.length > newCount) {
      setSelectedProducts(selectedProducts.slice(0, newCount));
    } else {
      const remainingNeeded = newCount - selectedProducts.length;
      const additional: Product[] = [];
      for (let i = 0; i < remainingNeeded; i++) {
        const nextProd = eligibleProducts[(selectedProducts.length + i) % eligibleProducts.length];
        additional.push(nextProd);
      }
      setSelectedProducts([...selectedProducts, ...additional]);
    }
  };

  const toggleProduct = (prod: Product) => {
    const existingIndex = selectedProducts.findIndex((p) => p.id === prod.id);

    if (existingIndex > -1) {
      if (selectedProducts.length > 1) {
        setSelectedProducts(selectedProducts.filter((_, idx) => idx !== existingIndex));
      }
    } else {
      if (selectedProducts.length < activeTier.bottleCount) {
        setSelectedProducts([...selectedProducts, prod]);
      } else {
        const copy = [...selectedProducts];
        copy[copy.length - 1] = prod;
        setSelectedProducts(copy);
      }
    }
  };

  const isFull = selectedProducts.length === activeTier.bottleCount;

  const handleAddBundleToCart = () => {
    const bundleProduct: Product = {
      id: `bundle-${activeTier.bottleCount}-${Date.now()}`,
      slug: 'custom-bundle',
      name: `ELORA ${activeTier.title}`,
      subtitle: `${activeTier.bottleCount} × 100ML BESPOKE SET`,
      category: 'Bespoke Curated Bundle',
      size: `${activeTier.bottleCount} × 100ml`,
      type: 'Eau de Parfum Set',
      price: activeTier.fixedPrice,
      compareAtPrice: activeTier.originalPrice,
      tagline: `Curated set of ${selectedProducts.map((p) => p.name).join(', ')}`,
      editorialQuote: 'A custom olfactory wardrobing collection formulated at 25% perfume oil.',
      description: `Bespoke set containing ${selectedProducts.map((p) => p.name).join(', ')}.`,
      notes: {
        top: selectedProducts.map((p) => p.name),
        heart: ['Hand-poured 100ml Flacons'],
        base: ['Complimentary Keepsake Presentation Coffret'],
      },
      accords: ['Custom Layering', 'Haute Parfumerie'],
      intensity: 5,
      longevity: '14 Hours',
      projection: 'Exceptional',
      gender: 'Unisex',
      occasion: 'Bespoke Wardrobing',
      bottleTheme: selectedProducts[0].bottleTheme,
      inStock: true,
    };

    addToCart(bundleProduct, 1, `${activeTier.bottleCount} × 100ml`, {
      title: `ELORA ${activeTier.title}`,
      fragrances: selectedProducts.map((p) => p.name),
    });
  };

  return (
    <section
      id="bundle-builder"
      className={`bg-[#0A0A0C] border-b border-[#24232C] text-[#FFFFFF] ${
        isStandalonePage ? 'py-16 sm:py-24' : 'py-20 sm:py-28'
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-6 sm:px-8">
        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-sans font-medium block">
            Bespoke Wardrobing
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FFFFFF] tracking-[0.06em] uppercase font-normal">
            BUILD YOUR OWN BUNDLE
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto my-4" />
          <p className="text-xs sm:text-sm text-[#A1A1AA] font-sans font-light leading-relaxed">
            Curate your personal flacon collection. Select your preferred fragrances and receive exclusive atelier bundle privileges.
          </p>
        </div>

        {/* Tier Selector */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          {BUNDLE_OPTIONS.map((tier, idx) => (
            <button
              key={tier.bottleCount}
              onClick={() => handleTierChange(idx)}
              className={`px-8 py-4 border text-center transition-all duration-200 ${
                selectedTierIdx === idx
                  ? 'bg-[#14141B] text-[#D4AF37] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                  : 'bg-[#0E0E12] border-[#24232C] text-[#A1A1AA] hover:border-[#D4AF37]/50 hover:text-[#FFFFFF]'
              }`}
            >
              <span className="block font-serif text-lg tracking-[0.08em] uppercase">
                {tier.bottleCount} Fragrances
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-sans mt-1 text-[#D4AF37]">
                Save {tier.discountPercentage}% · ₹{tier.fixedPrice.toLocaleString('en-IN')}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: Flacon Selector Grid */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-[#24232C] pb-3">
              <h3 className="font-serif text-xl tracking-[0.06em] text-[#FFFFFF] uppercase">
                Choose Flacons ({selectedProducts.length} of {activeTier.bottleCount})
              </h3>
              <button
                onClick={() => setSelectedProducts([eligibleProducts[0]])}
                className="text-[11px] uppercase tracking-wider text-[#A1A1AA] hover:text-[#D4AF37] flex items-center space-x-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3 stroke-[1.5]" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eligibleProducts.map((p) => {
                const countInBundle = selectedProducts.filter((sp) => sp.id === p.id).length;
                const isSelected = countInBundle > 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => toggleProduct(p)}
                    className={`cursor-pointer p-5 bg-[#0E0E12] border transition-all duration-200 flex flex-col items-center text-center relative ${
                      isSelected
                        ? 'border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                        : 'border-[#24232C] hover:border-[#3B394A]'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 bg-[#D4AF37] text-[#0A0A0C] flex items-center justify-center text-[10px] font-sans font-bold">
                        {countInBundle > 1 ? `×${countInBundle}` : <Check className="w-3 h-3" />}
                      </span>
                    )}

                    <div className="w-24 h-32 my-2 flex items-center justify-center">
                      <EloraBottleVisualizer product={p} size="sm" showPedestal={false} />
                    </div>

                    <h4 className="font-serif text-lg tracking-[0.06em] text-[#FFFFFF]">
                      {p.name}
                    </h4>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-sans mt-0.5">
                      {p.category}
                    </p>
                    <span className="text-xs font-sans text-[#D4D4D8] mt-2">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>

                    <button
                      type="button"
                      className={`mt-4 w-full py-2 text-[10px] uppercase tracking-[0.2em] font-sans transition-colors ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#0A0A0C] font-semibold'
                          : 'bg-transparent border border-[#2B2A36] text-[#A1A1AA] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                      }`}
                    >
                      {isSelected ? 'Selected' : '+ Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Curated Set Summary */}
          <div className="lg:col-span-5 bg-[#0E0E12] border border-[#24232C] p-8 space-y-6">
            <h3 className="font-serif text-2xl tracking-[0.06em] text-[#FFFFFF] text-center uppercase border-b border-[#24232C] pb-4">
              Bespoke Coffret
            </h3>

            {/* Visual Slots */}
            <div className="p-6 bg-[#14141B] border border-[#24232C] text-center space-y-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-sans">
                {activeTier.title} ({selectedProducts.length} of {activeTier.bottleCount} selected)
              </p>

              <div className="flex items-center justify-center gap-3">
                {Array.from({ length: activeTier.bottleCount }).map((_, index) => {
                  const item = selectedProducts[index];
                  return (
                    <div
                      key={index}
                      className="flex-1 aspect-[2/3] max-w-[96px] border border-dashed border-[#2B2A36] bg-[#0A0A0C] flex flex-col items-center justify-center p-1.5"
                    >
                      {item ? (
                        <>
                          <div className="w-full h-20 flex items-center justify-center">
                            <EloraBottleVisualizer product={item} size="sm" showPedestal={false} />
                          </div>
                          <span className="text-[10px] font-serif text-[#FFFFFF] truncate w-full">
                            {item.name}
                          </span>
                        </>
                      ) : (
                        <div className="text-[#71717A] flex flex-col items-center">
                          <Plus className="w-4 h-4 mb-1 stroke-[1.5]" />
                          <span className="text-[9px] uppercase tracking-wider font-sans">
                            Slot {index + 1}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-[#A1A1AA] italic font-serif">
                Delivered in a gold-embossed Elora presentation coffret with custom atomizers.
              </p>
            </div>

            {/* Pricing Summary */}
            <div className="space-y-2.5 border-t border-[#24232C] pt-5 text-xs font-sans text-[#A1A1AA]">
              <div className="flex justify-between">
                <span>Standard Atelier Value</span>
                <span className="line-through text-[#71717A]">
                  ₹{activeTier.originalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[#D4AF37]">
                <span>Bundle Privilege ({activeTier.discountPercentage}%)</span>
                <span>-₹{(activeTier.originalPrice - activeTier.fixedPrice).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Courier Service</span>
                <span className="text-[#D4AF37] font-medium">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-[#24232C] font-serif text-2xl text-[#FFFFFF]">
                <span>Total Set Commission</span>
                <span className="text-[#D4AF37]">₹{activeTier.fixedPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleAddBundleToCart}
              disabled={!isFull}
              className={`w-full py-4 text-xs uppercase tracking-[0.24em] font-sans transition-all duration-200 flex items-center justify-center space-x-2 ${
                isFull
                  ? 'bg-[#D4AF37] text-[#0A0A0C] font-bold hover:bg-[#F3E5AB]'
                  : 'bg-[#1C1C24] border border-[#2B2A36] text-[#71717A] cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              <span>
                {isFull
                  ? `Add Coffret to Bag · ₹${activeTier.fixedPrice.toLocaleString('en-IN')}`
                  : `Select ${activeTier.bottleCount - selectedProducts.length} more flacon`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
