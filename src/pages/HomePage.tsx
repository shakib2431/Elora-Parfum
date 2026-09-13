import React from 'react';
import { Hero } from '../components/Hero';
import { ShopCollectionGrid } from '../components/ShopCollectionGrid';
import { SignatureCollectionEditorial } from '../components/SignatureCollectionEditorial';
import { FeaturedFragranceNoir } from '../components/FeaturedFragranceNoir';
import { FragranceNotesEditorial } from '../components/FragranceNotesEditorial';
import { CinemaSection } from '../components/CinemaSection';
import { StorySection } from '../components/StorySection';
import { ScentConsultationSection } from '../components/ScentConsultationSection';
import { BundleBuilderSection } from '../components/BundleBuilderSection';
import { SocialProofSection } from '../components/SocialProofSection';
import { Newsletter } from '../components/Newsletter';

export const HomePage: React.FC = () => {
  return (
    <div id="home-page" className="min-h-screen bg-deep-espresso text-warm-ivory">
      {/* 1. HERO: Editorial Haute Parfumerie Campaign */}
      <Hero />

      {/* 2. THE ELORA COLLECTION: Product showcase with large presentation & minimal typography */}
      <ShopCollectionGrid limit={6} showFilters={false} />

      {/* 3. SIGNATURE COLLECTION: Asymmetric editorial spread (Aura, Noir, Éclat), Warm Taupe (#EFEAE1) */}
      <SignatureCollectionEditorial />

      {/* 4. FEATURED FRAGRANCE (NOIR): Cinematic Deep Espresso (#191512), warm amber glow */}
      <FeaturedFragranceNoir />

      {/* 5. FRAGRANCE NOTES: The Anatomy of Scent, editorial typography, Warm Ivory (#F4F0E8) */}
      <FragranceNotesEditorial />

      {/* 6. CAMPAIGN FILM: Elora Cinéma - A Story in Every Drop, cinematic dark, [WATCH FILM] */}
      <CinemaSection />

      {/* 7. BRAND STORY: The House of Elora, split editorial layout with botanical/flacon atelier */}
      <StorySection />

      {/* 8. SCENT PROFILER: A Private Fragrance Consultation - Find Your Signature Scent */}
      <ScentConsultationSection />

      {/* 9. ATELIER BUNDLE: Hand-curated flacon sets */}
      <BundleBuilderSection />

      {/* 10. SOCIAL PROOF: The Elora Experience - Patron Reviews */}
      <SocialProofSection />

      {/* 11. NEWSLETTER: The Elora Circle - Deep Espresso (#191512) & Champagne */}
      <Newsletter />
    </div>
  );
};
