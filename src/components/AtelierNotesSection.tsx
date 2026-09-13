import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Scroll,
  MapPin,
  Clock,
  Compass,
  CheckCircle,
  FlaskConical,
  Award,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { fetchAtelierNotes, AtelierNoteData } from '../data/atelierNotes';
import { CinematicReveal } from './CinematicReveal';

interface AtelierNotesSectionProps {
  slug: string;
  productName: string;
}

type TabKey = 'story' | 'journal' | 'terroir' | 'maceration';

export const AtelierNotesSection: React.FC<AtelierNotesSectionProps> = ({ slug, productName }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('story');
  const [notes, setNotes] = useState<AtelierNoteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchAtelierNotes(slug)
      .then((data) => {
        if (isMounted) {
          setNotes(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching atelier notes:', err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; shortLabel: string }[] = [
    {
      key: 'story',
      label: 'Story of the Scent',
      shortLabel: 'Story & Inspiration',
      icon: <BookOpen className="w-3.5 h-3.5" />,
    },
    {
      key: 'journal',
      label: "Master Nose's Journal",
      shortLabel: "Nose's Journal",
      icon: <Scroll className="w-3.5 h-3.5" />,
    },
    {
      key: 'terroir',
      label: 'Terroir & Botanical Harvest',
      shortLabel: 'Terroir & Harvest',
      icon: <Compass className="w-3.5 h-3.5" />,
    },
    {
      key: 'maceration',
      label: 'Maceration & Bottling',
      shortLabel: 'Curing & Aging',
      icon: <FlaskConical className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <section
      id="atelier-notes-section"
      className="py-16 sm:py-24 bg-gradient-to-b from-[#140E1F] via-[#100B1A] to-[#0D0A14] border-t border-b border-white/10 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with entrance animation */}
        <CinematicReveal>
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-300/90 font-sans font-semibold block mb-2">
              Atelier Archives · Formulation Provenance
            </span>
            <h2 className="font-display text-fluid-h2 text-white tracking-[0.14em] uppercase font-medium">
              ATELIER NOTES
            </h2>
            <div className="w-14 h-[1px] bg-gradient-to-r from-amber-400/80 via-rose-300/80 to-purple-400/80 mx-auto mt-4 mb-4" />
            <p className="text-xs sm:text-sm text-purple-200/75 font-sans font-light max-w-lg mx-auto leading-relaxed">
              An unhurried exploration into the artistic genesis, raw terroir harvests, and hand-macerated craftsmanship behind{' '}
              <span className="text-white font-medium">{productName}</span>.
            </p>
          </div>
        </CinematicReveal>

        {/* Tab Switcher - Clean, horizontal scrollable on mobile */}
        <div className="mb-8">
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 sm:gap-3 px-1 py-1.5 border-b border-white/10 sm:border-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-xs font-sans tracking-wider uppercase font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-white text-[#120E1A] shadow-lg ring-1 ring-white'
                      : 'bg-[#191325]/90 text-purple-200/80 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                  aria-selected={isActive}
                  role="tab"
                >
                  <span className={isActive ? 'text-[#120E1A]' : 'text-amber-300'}>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Container */}
        <div className="bg-[#191325]/85 border border-white/15 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl relative min-h-[360px] flex flex-col justify-center">
          {loading ? (
            /* Dynamic Loading Skeleton */
            <div className="py-12 space-y-5 animate-pulse text-center max-w-md mx-auto">
              <div className="w-10 h-10 rounded-full bg-white/10 mx-auto flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300/60 animate-spin" />
              </div>
              <div className="h-4 bg-white/10 rounded-full w-3/4 mx-auto" />
              <div className="h-3 bg-white/10 rounded-full w-1/2 mx-auto" />
              <p className="text-[11px] uppercase tracking-[0.2em] font-sans text-purple-300/60 pt-2">
                Consulting Master Formulation Archives...
              </p>
            </div>
          ) : notes ? (
            <div className="animate-in fade-in duration-300">
              {/* TAB 1: STORY OF THE SCENT (INSPIRATION) */}
              {activeTab === 'story' && (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-rose-300 font-sans font-semibold">
                        {notes.scentStory.chapter}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium mt-1">
                        {notes.scentStory.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-purple-200/80 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full self-start sm:self-auto">
                      <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span className="font-sans text-[11px] truncate max-w-[240px]">
                        {notes.scentStory.atmosphereLocation}
                      </span>
                    </div>
                  </div>

                  {/* Core Inspiration Quote Card */}
                  <div className="bg-[#130E1C] border border-amber-400/25 rounded-2xl p-5 sm:p-6 relative overflow-hidden">
                    <span className="font-serif text-6xl text-amber-400/20 absolute -top-2 left-3 select-none pointer-events-none">
                      “
                    </span>
                    <p className="font-serif italic text-base sm:text-lg text-amber-100/95 leading-relaxed relative z-10 pl-4 sm:pl-6 border-l-2 border-amber-400/60">
                      {notes.scentStory.inspiration}
                    </p>
                  </div>

                  {/* Narrative Body */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 text-xs sm:text-sm text-purple-200/80 font-sans font-light leading-relaxed">
                    {notes.scentStory.narrative.map((paragraph, idx) => (
                      <p key={idx} className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Mood Board Accords & Perfumer Signed Quote */}
                  <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-purple-300/70 font-sans font-bold block mb-2">
                        Atmospheric Accord Palette
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {notes.scentStory.moodBoardAccords.map((accord) => (
                          <span
                            key={accord}
                            className="px-2.5 py-1 rounded-full bg-white/10 text-white text-[11px] font-sans border border-white/10"
                          >
                            {accord}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Perfumer Signature Stamp */}
                    <div className="bg-[#140E20] border border-white/10 p-3.5 rounded-2xl flex items-center space-x-3 w-full md:w-auto">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-[#120E1A] font-serif font-bold text-base flex items-center justify-center shrink-0 shadow-md">
                        {notes.scentStory.perfumerName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-serif text-sm font-semibold text-white block">
                          {notes.scentStory.perfumerName}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-purple-300/70 font-sans block">
                          {notes.scentStory.perfumerRole}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MASTER NOSE'S JOURNAL */}
              {activeTab === 'journal' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-amber-300 font-sans font-semibold">
                        Formulator Logbook
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium mt-0.5">
                        {notes.perfumerJournal.trialNumber}
                      </h3>
                    </div>
                    <span className="text-xs font-sans text-purple-300/80 bg-white/5 border border-white/10 px-3 py-1 rounded-full self-start sm:self-auto">
                      {notes.perfumerJournal.logDate}
                    </span>
                  </div>

                  {/* Journal handwritten note */}
                  <div className="p-5 sm:p-6 bg-[#130E1D] border border-white/10 rounded-2xl">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-rose-300 font-sans font-bold block mb-2">
                      Laboratory Formulation Entry
                    </span>
                    <p className="font-serif text-sm sm:text-base text-purple-100/90 leading-relaxed italic">
                      "{notes.perfumerJournal.journalEntry}"
                    </p>
                  </div>

                  {/* Component Breakdown Table / Cards */}
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-purple-300/80 font-sans font-bold block mb-3">
                      Core Oil Fractions (25% Extrait Matrix)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {notes.perfumerJournal.formulaBreakdown.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between"
                        >
                          <div>
                            <span className="font-serif text-sm font-semibold text-white block">
                              {item.component}
                            </span>
                            <span className="text-[11px] text-purple-300/70 font-sans block mt-0.5">
                              {item.role}
                            </span>
                          </div>
                          <span className="text-xs font-sans font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md shrink-0 ml-2">
                            {item.percentage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Craft Insight footer */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-amber-900/20 border border-white/10 flex items-center gap-3">
                    <Award className="w-5 h-5 text-amber-300 shrink-0" />
                    <p className="text-xs text-purple-200/80 font-sans">
                      <strong className="text-white font-medium">Atelier Standard: </strong>
                      {notes.perfumerJournal.craftInsight}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: TERROIR & BOTANICAL HARVEST */}
              {activeTab === 'terroir' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-rose-300 font-sans font-semibold">
                        Geographic Origin & Agriculture
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium mt-0.5">
                        {notes.terroirAndHarvest.region}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-sans text-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Season: {notes.terroirAndHarvest.harvestSeason}</span>
                    </div>
                  </div>

                  {/* Extraction Methodology Banner */}
                  <div className="bg-[#120B1C] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-purple-300/70 font-sans block">
                        Extraction Method
                      </span>
                      <h4 className="font-serif text-sm sm:text-base font-semibold text-white mt-0.5">
                        {notes.terroirAndHarvest.extractionMethod}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[11px] font-sans font-medium flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3" />
                      Ethically Sourced
                    </span>
                  </div>

                  {/* Botanical Provenance Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {notes.terroirAndHarvest.provenanceHighlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-amber-300 font-sans font-semibold block">
                            {highlight.origin}
                          </span>
                          <h5 className="font-serif text-base text-white font-medium mt-1 mb-2">
                            {highlight.botanical}
                          </h5>
                          <p className="text-xs text-purple-200/75 font-sans leading-relaxed">
                            {highlight.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sustainability Commitment */}
                  <div className="p-4 rounded-xl bg-[#140E20] border border-white/10 flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                    <p className="text-xs text-purple-200/80 font-sans leading-relaxed">
                      <strong className="text-white font-medium">Environmental Stewardship: </strong>
                      {notes.terroirAndHarvest.sustainabilityNote}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: MACERATION & BOTTLING */}
              {activeTab === 'maceration' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-purple-300/80 font-sans font-semibold">
                        Slow Parfumerie Protocol
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium mt-0.5">
                        {notes.macerationAndBottling.macerationDays}-Day Curing Period
                      </h3>
                    </div>
                    <span className="text-xs font-sans text-rose-300 bg-rose-500/10 border border-rose-400/30 px-3 py-1 rounded-full self-start sm:self-auto">
                      Resting: {notes.macerationAndBottling.restingChamberTemp}
                    </span>
                  </div>

                  {/* 4 Stat Indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <span className="text-[9px] uppercase tracking-wider text-purple-300/70 font-sans block">
                        Curing Days
                      </span>
                      <span className="font-display text-2xl sm:text-3xl text-white font-bold block mt-1">
                        {notes.macerationAndBottling.macerationDays}d
                      </span>
                      <span className="text-[10px] text-purple-300/60 font-sans mt-0.5 block">
                        Full Maturation
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <span className="text-[9px] uppercase tracking-wider text-purple-300/70 font-sans block">
                        Vault Temp
                      </span>
                      <span className="font-display text-xl sm:text-2xl text-white font-bold block mt-1.5 truncate">
                        {notes.macerationAndBottling.restingChamberTemp.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-purple-300/60 font-sans mt-0.5 block">
                        Dark Cold Vault
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <span className="text-[9px] uppercase tracking-wider text-purple-300/70 font-sans block">
                        Concentration
                      </span>
                      <span className="font-display text-2xl sm:text-3xl text-amber-300 font-bold block mt-1">
                        25%
                      </span>
                      <span className="text-[10px] text-purple-300/60 font-sans mt-0.5 block">
                        Extrait de Parfum
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <span className="text-[9px] uppercase tracking-wider text-purple-300/70 font-sans block">
                        Filtration
                      </span>
                      <span className="font-display text-xl sm:text-2xl text-white font-bold block mt-1.5 truncate">
                        Unchilled
                      </span>
                      <span className="text-[10px] text-purple-300/60 font-sans mt-0.5 block">
                        Preserves Lipids
                      </span>
                    </div>
                  </div>

                  {/* Philosophy & Flacon Engineering */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-purple-200/80 font-sans leading-relaxed">
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#130E1D] border border-white/10 space-y-1.5">
                      <h5 className="font-serif text-base font-semibold text-white">
                        The Maturation Philosophy
                      </h5>
                      <p className="font-light">
                        {notes.macerationAndBottling.curingPhilosophy}
                      </p>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-[#130E1D] border border-white/10 space-y-1.5">
                      <h5 className="font-serif text-base font-semibold text-white">
                        Vessel & Flacon Architecture
                      </h5>
                      <p className="font-light">
                        {notes.macerationAndBottling.flaconDetails}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
