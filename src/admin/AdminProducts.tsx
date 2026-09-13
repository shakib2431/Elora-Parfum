import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Boxes, ExternalLink, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { EloraBottleVisualizer } from '../components/EloraBottleVisualizer';

export const AdminProducts: React.FC = () => {
  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24232C] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-sans font-medium block">
            Maison Atelier Catalog
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#FFFFFF] tracking-[0.04em] uppercase font-normal">
            HAUTE PARFUMS COLLECTION
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Original Elora Parfum master creations, 25% concentrated oil extraits, and Genesis reserve formulations
          </p>
        </div>

        <Link
          to="/admin/inventory"
          className="self-start sm:self-auto px-4 py-2.5 bg-[#D4AF37] text-[#0A0A0C] text-xs font-semibold uppercase tracking-wider hover:bg-[#E5C378] transition-colors flex items-center space-x-2"
        >
          <Boxes className="w-4 h-4" />
          <span>Manage Stock Inventory</span>
        </Link>
      </div>

      {/* Fragrances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="bg-[#14141B] border border-[#24232C] overflow-hidden flex flex-col group hover:border-[#3D3B48] transition-colors shadow-lg"
          >
            {/* Visualizer Frame */}
            <div className="h-56 overflow-hidden bg-[#0A0A0C] relative flex items-center justify-center p-4">
              <div className="scale-90 group-hover:scale-95 transition-transform duration-500">
                <EloraBottleVisualizer product={product} size="md" showPedestal={false} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#14141B] via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#0E0E12]/80 backdrop-blur-sm border border-[#24232C] text-[10px] text-[#D4AF37] uppercase tracking-widest font-sans">
                {product.size}
              </div>
            </div>

            {/* Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-sans block">
                  {product.category}
                </span>
                <h3 className="font-serif text-xl text-[#FFFFFF] tracking-wide">
                  {product.name}
                </h3>
                <p className="text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Notes */}
              <div className="border-t border-[#24232C] pt-3 text-[11px] space-y-1 text-[#A1A1AA]">
                <div>
                  <span className="text-[#D4AF37] font-medium">Head:</span> {product.notes.top.join(', ')}
                </div>
                <div>
                  <span className="text-[#D4AF37] font-medium">Heart:</span> {product.notes.heart.join(', ')}
                </div>
                <div>
                  <span className="text-[#D4AF37] font-medium">Base:</span> {product.notes.base.join(', ')}
                </div>
              </div>

              {/* Pricing & Storefront Link */}
              <div className="border-t border-[#24232C] pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] block">
                    Retail Valuation
                  </span>
                  <span className="font-serif text-lg text-[#FFFFFF]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <Link
                  to={`/products/${product.slug}`}
                  target="_blank"
                  className="text-xs text-[#D4AF37] hover:underline flex items-center space-x-1"
                >
                  <span>Boutique Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
