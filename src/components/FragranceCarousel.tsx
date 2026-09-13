import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

export const FragranceCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const discoveryProducts = PRODUCTS.slice(0, 4);

  return (
    <section
      id="fragrance-discovery"
      className="py-20 sm:py-28 bg-[#E9E4DB]/50 border-b border-[#D7D1C7] overflow-hidden"
    >
      <div className="max-w-[1360px] mx-auto px-6 sm:px-8">
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#D7D1C7]">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#68645E] font-sans font-medium block">
              Curated Selection
            </span>
            <h2 className="font-serif text-fluid-h2 text-[#171614] tracking-[0.06em] uppercase font-normal">
              THE ELORA EDIT
            </h2>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 border border-[#D7D1C7] bg-[#F5F2EC] text-[#171614] hover:bg-[#171614] hover:text-[#F5F2EC] transition-all flex items-center justify-center focus:outline-none"
              aria-label="Previous fragrances"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 border border-[#D7D1C7] bg-[#F5F2EC] text-[#171614] hover:bg-[#171614] hover:text-[#F5F2EC] transition-all flex items-center justify-center focus:outline-none"
              aria-label="Next fragrances"
            >
              <ChevronRight className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Scrollable Products */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto no-scrollbar pb-4 pt-1 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {discoveryProducts.map((product) => (
            <div
              key={product.id}
              className="w-[280px] sm:w-[320px] shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
