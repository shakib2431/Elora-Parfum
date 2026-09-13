import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ChevronDown, Lock } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { PriveLoyaltySection } from './PriveLoyaltySection';
import { usePriveLoyalty } from '../context/PriveLoyaltyContext';

export const Footer: React.FC = () => {
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({});
  const { openPriveModal } = usePriveLoyalty();

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-deep-espresso text-warm-ivory border-t border-[#3B332B]">
      {/* Elora Privé Loyalty Section */}
      <PriveLoyaltySection />

      {/* Upper Footer Branding & Return to Top */}
      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 pt-16 pb-12 border-b border-[#3B332B]">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
          <div className="space-y-3">
            <Link to="/" className="inline-block group">
              <span className="font-serif text-3xl font-medium tracking-[0.24em] text-warm-ivory block uppercase">
                ELORA
              </span>
              <span className="font-serif text-[11px] tracking-[0.38em] text-antique-gold block mt-1 uppercase">
                PARFUM
              </span>
              <span className="text-[8px] tracking-[0.3em] text-champagne/80 block mt-1 uppercase font-sans">
                HAUTE PARFUMERIE
              </span>
            </Link>
            <p className="text-xs text-champagne/90 max-w-sm font-sans font-light leading-relaxed mx-auto md:mx-0">
              Haute parfumerie crafted with French-matured botanical essences and rare resins. Defined by presence, restrained elegance, and enduring sillage.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.22em] text-warm-ivory hover:text-antique-gold transition-all px-6 py-3 border border-[#3B332B] hover:border-antique-gold"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links: Desktop 5-Columns & Mobile Accordion */}
      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 py-12 sm:py-16">
        {/* DESKTOP VIEW (md and up): 5 Columns */}
        <div className="hidden md:grid md:grid-cols-5 gap-8 lg:gap-10">
          {/* 1. Fragrances */}
          <div>
            <h4 className="font-serif text-xs tracking-[0.24em] uppercase text-warm-ivory font-medium mb-5">
              Fragrances
            </h4>
            <ul className="space-y-3 text-xs text-champagne/90 font-sans">
              {PRODUCTS.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/products/${p.slug}`}
                    className="hover:text-antique-gold transition-colors"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/bundle"
                  className="hover:text-warm-ivory text-antique-gold transition-colors"
                >
                  Custom Bundle Atelier
                </Link>
              </li>
            </ul>
          </div>

          {/* 2. The House */}
          <div>
            <h4 className="font-serif text-xs tracking-[0.24em] uppercase text-warm-ivory font-medium mb-5">
              The House
            </h4>
            <ul className="space-y-3 text-xs text-champagne/90 font-sans">
              <li>
                <Link to="/pages/about" className="hover:text-antique-gold transition-colors">
                  Atelier Philosophy
                </Link>
              </li>
              <li>
                <Link to="/journal" className="hover:text-antique-gold transition-colors">
                  Olfactory Journal
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openPriveModal()}
                  className="hover:text-warm-ivory text-antique-gold transition-colors text-left"
                >
                  Elora Privé Vault
                </button>
              </li>
              <li>
                <Link to="/pages/about" className="hover:text-antique-gold transition-colors">
                  Grasse Provenance
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Client Care */}
          <div>
            <h4 className="font-serif text-xs tracking-[0.24em] uppercase text-warm-ivory font-medium mb-5">
              Client Care
            </h4>
            <ul className="space-y-3 text-xs text-champagne/90 font-sans">
              <li>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-concierge-chat'))}
                  className="hover:text-warm-ivory text-antique-gold transition-colors flex items-center space-x-1.5 text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-antique-gold animate-pulse" />
                  <span>Live Concierge Chat</span>
                </button>
              </li>
              <li>
                <Link to="/pages/contact" className="hover:text-antique-gold transition-colors">
                  Concierge Desk
                </Link>
              </li>
              <li>
                <Link to="/order-status" className="hover:text-antique-gold transition-colors">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link to="/pages/shipping" className="hover:text-antique-gold transition-colors">
                  Courier & Delivery
                </Link>
              </li>
              <li>
                <Link to="/pages/refund" className="hover:text-antique-gold transition-colors">
                  Exchange Privilege
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Boutiques / Atelier */}
          <div>
            <h4 className="font-serif text-xs tracking-[0.24em] uppercase text-warm-ivory font-medium mb-5">
              Boutiques / Atelier
            </h4>
            <ul className="space-y-3 text-xs text-champagne/90 font-sans">
              <li className="text-warm-ivory font-medium">Paris Atelier</li>
              <li className="text-[11px] text-champagne/60">12 Place Vendôme, 75001 Paris</li>
              <li className="text-warm-ivory font-medium mt-3">Mumbai Salon</li>
              <li className="text-[11px] text-champagne/60">Apollo Bunder, Colaba, Mumbai</li>
              <li className="pt-2">
                <Link to="/pages/contact" className="text-antique-gold hover:text-warm-ivory text-xs transition-colors">
                  Book Private Appointment →
                </Link>
              </li>
            </ul>
          </div>

          {/* 5. Legal */}
          <div>
            <h4 className="font-serif text-xs tracking-[0.24em] uppercase text-warm-ivory font-medium mb-5">
              Legal
            </h4>
            <ul className="space-y-3 text-xs text-champagne/90 font-sans">
              <li>
                <Link to="/pages/privacy" className="hover:text-antique-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/pages/terms" className="hover:text-antique-gold transition-colors">
                  Terms of Commission
                </Link>
              </li>
              <li>
                <Link to="/pages/shipping" className="hover:text-antique-gold transition-colors">
                  Shipping Terms
                </Link>
              </li>
              <li>
                <Link to="/pages/refund" className="hover:text-antique-gold transition-colors">
                  Refund & Return Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* MOBILE VIEW (Accordion) */}
        <div className="md:hidden divide-y divide-[#3B332B]">
          {[
            {
              key: 'fragrances',
              title: 'Fragrances',
              links: PRODUCTS.map((p) => ({ label: p.name, path: `/products/${p.slug}` })),
            },
            {
              key: 'house',
              title: 'The House',
              links: [
                { label: 'Atelier Philosophy', path: '/pages/about' },
                { label: 'Olfactory Journal', path: '/journal' },
                { label: 'Grasse Provenance', path: '/pages/about' },
              ],
            },
            {
              key: 'client',
              title: 'Client Care',
              links: [
                { label: 'Concierge Desk', path: '/pages/contact' },
                { label: 'Track Consignment', path: '/order-status' },
                { label: 'Courier & Delivery', path: '/pages/shipping' },
                { label: 'Exchange Privilege', path: '/pages/refund' },
              ],
            },
            {
              key: 'legal',
              title: 'Legal',
              links: [
                { label: 'Privacy Policy', path: '/pages/privacy' },
                { label: 'Terms of Commission', path: '/pages/terms' },
                { label: 'Shipping Policy', path: '/pages/shipping' },
                { label: 'Refund Policy', path: '/pages/refund' },
              ],
            },
          ].map((section) => (
            <div key={section.key} className="py-4">
              <button
                onClick={() => toggleAccordion(section.key)}
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] font-serif text-warm-ivory"
              >
                <span>{section.title}</span>
                <ChevronDown
                  className={`w-4 h-4 stroke-[1.5] transition-transform duration-300 ${
                    openAccordions[section.key] ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordions[section.key] && (
                <ul className="mt-3 space-y-2.5 text-xs text-champagne/90 font-sans pl-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.path} className="block py-1 hover:text-antique-gold">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom copyright & certifications */}
        <div className="mt-14 pt-8 border-t border-[#3B332B] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] font-sans text-champagne/70">
          <p>© {new Date().getFullYear()} ELORA PARFUM HAUTE PARFUMERIE. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-6 text-[10px] tracking-[0.16em] uppercase text-champagne/70">
            <span>GRASSE BOTANICALS</span>
            <span>·</span>
            <span>25% PURE EXTRAIT</span>
            <span>·</span>
            <span>CRUELTY FREE</span>
            <span>·</span>
            <Link
              to="/admin/login"
              title="Atelier Administration Portal"
              className="hover:text-antique-gold transition-colors underline underline-offset-4 flex items-center space-x-1"
            >
              <Lock className="w-2.5 h-2.5 inline stroke-[1.5] text-antique-gold/80" />
              <span>ATELIER CONSOLE</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
