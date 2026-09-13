import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

export const ShopCollectionGrid: React.FC<{ limit?: number; showFilters?: boolean }> = ({
  limit,
  showFilters = false,
}) => {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filters = [
    { id: 'ALL', label: 'All Fragrances' },
    { id: 'FLORAL', label: 'Floral & Musk' },
    { id: 'WOODY', label: 'Woody & Amber' },
    { id: 'CITRUS', label: 'Citrus & Aromatic' },
    { id: 'OUD', label: 'Oud & Smoky' },
    { id: 'SETS', label: 'Discovery Sets' },
  ];

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'FLORAL') return p.category.includes('Floral') || p.category.includes('Musky');
    if (activeFilter === 'WOODY') return p.category.includes('Woody') || p.category.includes('Amber');
    if (activeFilter === 'CITRUS') return p.category.includes('Citrus');
    if (activeFilter === 'OUD') return p.category.includes('Oud') || p.category.includes('Smoky');
    if (activeFilter === 'SETS') return p.category.includes('Gift') || p.category.includes('Discovery');
    return true;
  });

  const displayList = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  return (
    <section id="shop-collection-section" className="py-20 sm:py-28 bg-[#0A0A0C] border-b border-[#24232C]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* Editorial Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.34em] text-[#A1A1AA] font-sans font-medium block">
            HAUTE PARFUMERIE
          </span>
          <h2 className="font-serif text-fluid-h2 text-[#FFFFFF] tracking-[0.06em] uppercase font-normal">
            THE ELORA COLLECTION
          </h2>
          <p className="text-xs sm:text-sm text-[#D4D4D8] font-sans uppercase tracking-[0.24em] font-light">
            SIGNATURE FRAGRANCES, CRAFTED TO BE REMEMBERED.
          </p>
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto my-3" />
        </div>

        {/* Minimalist Filter Navigation */}
        {showFilters && (
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-12 border-b border-[#24232C] pb-5">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-sans py-1 transition-colors relative ${
                  activeFilter === f.id
                    ? 'text-[#FFFFFF] font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                }`}
              >
                {f.label}
                {activeFilter === f.id && (
                  <span className="absolute -bottom-5 left-0 w-full h-[1.5px] bg-[#D4AF37]" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid: 2 columns on Mobile, 3 columns on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
          {displayList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
