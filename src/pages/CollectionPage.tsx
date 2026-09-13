import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const CollectionPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories = [
    { id: 'ALL', label: 'All Fragrances' },
    { id: 'FLORAL', label: 'Floral & Musky' },
    { id: 'WOODY', label: 'Woody & Amber' },
    { id: 'CITRUS', label: 'Citrus & Aromatic' },
    { id: 'OUD', label: 'Oud & Smoky' },
    { id: 'SETS', label: 'Discovery Sets' },
  ];

  let filtered = PRODUCTS.filter((p) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'FLORAL') return p.category.includes('Floral') || p.category.includes('Musky');
    if (selectedCategory === 'WOODY') return p.category.includes('Woody') || p.category.includes('Amber');
    if (selectedCategory === 'CITRUS') return p.category.includes('Citrus');
    if (selectedCategory === 'OUD') return p.category.includes('Oud') || p.category.includes('Smoky');
    if (selectedCategory === 'SETS') return p.category.includes('Discovery') || p.category.includes('Gift');
    return true;
  });

  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div id="shop-all-page" className="bg-[#0A0A0C] text-[#FFFFFF] min-h-screen">
      {/* Editorial Header Banner */}
      <div className="py-20 sm:py-28 border-b border-[#24232C] text-center px-6 bg-[#0E0E12]/50">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] uppercase tracking-[0.32em] text-[#D4AF37] font-sans font-medium block">
            The Complete Atelier
          </span>
          <h1 className="font-serif text-fluid-h1 text-[#FFFFFF] tracking-[0.06em] uppercase font-normal">
            HAUTE COLLECTION
          </h1>
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-[#A1A1AA] font-sans font-light max-w-xl mx-auto leading-relaxed">
            Every creation is formulated at 25% Extrait concentration, crafted to interact with the unique warmth of your pulse points.
          </p>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 py-12 sm:py-16">
        {/* Filter Navigation & Sort Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-6 mb-12 border-b border-[#24232C] gap-6">
          {/* Category Filter Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs uppercase tracking-[0.2em] font-sans transition-colors relative py-1 ${
                  selectedCategory === cat.id
                    ? 'text-[#D4AF37] font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF]'
                }`}
              >
                {cat.label}
                {selectedCategory === cat.id && (
                  <span className="absolute -bottom-6 left-0 w-full h-[1.5px] bg-[#D4AF37]" />
                )}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-3 text-xs font-sans text-[#A1A1AA]">
            <span className="uppercase tracking-[0.16em]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#14141B] border border-[#2B2A36] text-xs text-[#FFFFFF] px-3 py-2 outline-none cursor-pointer font-sans focus:border-[#D4AF37] transition-colors"
            >
              <option value="featured" className="bg-[#14141B] text-[#FFFFFF]">Featured Commission</option>
              <option value="price-asc" className="bg-[#14141B] text-[#FFFFFF]">Price: Ascending</option>
              <option value="price-desc" className="bg-[#14141B] text-[#FFFFFF]">Price: Descending</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Quiet Luxury Note */}
        <div className="mt-20 pt-8 border-t border-[#24232C] text-center text-xs font-sans text-[#71717A]">
          <p>Each flacon is individually weighed and hand-numbered in our atelier reserve.</p>
        </div>
      </div>
    </div>
  );
};
