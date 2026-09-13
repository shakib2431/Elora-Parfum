import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Star,
  Clock,
  Wind,
  CloudSun,
  Plus,
  Trash2,
  Edit3,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Share2,
  RotateCcw,
} from 'lucide-react';
import { OlfactoryJournalEntry } from '../types';
import { PRODUCTS } from '../data/products';
import {
  getStoredJournalEntries,
  saveStoredJournalEntry,
  deleteStoredJournalEntry,
  INITIAL_JOURNAL_ENTRIES,
} from '../data/journalData';
import { Link } from 'react-router-dom';

export const OlfactoryJournalPage: React.FC = () => {
  const [entries, setEntries] = useState<OlfactoryJournalEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<OlfactoryJournalEntry | null>(null);
  const [selectedEntryForDetails, setSelectedEntryForDetails] = useState<OlfactoryJournalEntry | null>(null);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    fragranceId: string;
    rating: number;
    hoursLongevity: number;
    sillage: 'skin_scent' | 'intimate' | 'moderate' | 'radiant' | 'sovereign';
    weatherTested: string;
    occasions: string;
    openingImpression: string;
    drydownEvolution: string;
    layeringPairingTested: string;
    verdictQuote: string;
    personalReflections: string;
  }>({
    fragranceId: PRODUCTS[0].id,
    rating: 5,
    hoursLongevity: 14,
    sillage: 'radiant',
    weatherTested: 'Breezy evening, 20°C',
    occasions: 'Evening Salon',
    openingImpression: 'Vibrant sparkling citrus dissolving into solar petals.',
    drydownEvolution: 'Warm sandalwood and amber holding close to the skin.',
    layeringPairingTested: '',
    verdictQuote: 'An extraordinary expression of restraint and enduring warmth.',
    personalReflections: 'Remarkable performance on cashmere and linen.',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const loaded = getStoredJournalEntries();
    setEntries(loaded);
  }, []);

  const handleOpenAddModal = () => {
    setEditingEntry(null);
    setFormData({
      fragranceId: PRODUCTS[0].id,
      rating: 5,
      hoursLongevity: 14,
      sillage: 'radiant',
      weatherTested: 'Evening Atelier, 21°C',
      occasions: 'Private Gathering',
      openingImpression: 'Luminous top notes with immediate warmth.',
      drydownEvolution: 'Smooth resinous drydown adhering for hours.',
      layeringPairingTested: '',
      verdictQuote: 'Enduring elegance without imposition.',
      personalReflections: 'Gracefully evolved across twelve hours.',
    });
    setIsModalOpen(true);
  };

  const handleEditEntry = (entry: OlfactoryJournalEntry) => {
    setEditingEntry(entry);
    setFormData({
      fragranceId: entry.fragranceId,
      rating: entry.rating,
      hoursLongevity: entry.wearTest.hoursLongevity,
      sillage: entry.wearTest.sillage,
      weatherTested: entry.wearTest.weatherTested,
      occasions: entry.wearTest.occasions,
      openingImpression: entry.wearTest.openingImpression,
      drydownEvolution: entry.wearTest.drydownEvolution,
      layeringPairingTested: entry.wearTest.layeringPairingTested || '',
      verdictQuote: entry.wearTest.verdictQuote,
      personalReflections: entry.personalReflections,
    });
    setIsModalOpen(true);
  };

  const handleDeleteEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Remove this journal entry from your archive?')) {
      const updated = deleteStoredJournalEntry(id);
      setEntries(updated);
      if (selectedEntryForDetails?.id === id) {
        setSelectedEntryForDetails(null);
      }
    }
  };

  const handleResetToSample = () => {
    localStorage.removeItem('elora_olfactory_journal_v2');
    setEntries(INITIAL_JOURNAL_ENTRIES);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenProduct = PRODUCTS.find((p) => p.id === formData.fragranceId) || PRODUCTS[0];

    const newOrUpdated: OlfactoryJournalEntry = {
      id: editingEntry ? editingEntry.id : `dossier-${Date.now()}`,
      fragranceId: chosenProduct.id,
      fragranceName: chosenProduct.name,
      fragranceSlug: chosenProduct.slug,
      concentration: '25% Extrait de Parfum',
      batchNumber: editingEntry ? editingEntry.batchNumber : `LOT-${Math.floor(1000 + Math.random() * 9000)}-GRASSE`,
      rating: formData.rating,
      recordedAt: editingEntry ? editingEntry.recordedAt : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      purchasedDate: editingEntry ? editingEntry.purchasedDate : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      wearTest: {
        hoursLongevity: formData.hoursLongevity,
        sillage: formData.sillage,
        weatherTested: formData.weatherTested,
        occasions: formData.occasions ? [formData.occasions] : ['Private Salon'],
        openingImpression: formData.openingImpression,
        drydownEvolution: formData.drydownEvolution,
        layeringPairingTested: formData.layeringPairingTested,
        verdictQuote: formData.verdictQuote,
      },
      personalReflections: formData.personalReflections,
      favoredLayeringCombination: formData.layeringPairingTested,
      authorName: 'Patron Archive',
      authorPatronId: 'ELORA-RES-8824',
    };

    const updatedList = saveStoredJournalEntry(newOrUpdated);
    setEntries(updatedList);
    setIsModalOpen(false);
  };

  const handleShareEntry = (entry: OlfactoryJournalEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `ELORA OLFACTORY JOURNAL · WEAR TEST
Fragrance: ${entry.fragranceName} (25% Extrait de Parfum)
Rating: ${entry.rating}/5 Stars
Longevity Observed: ${entry.wearTest.hoursLongevity} Hours
Sillage: ${entry.wearTest.sillage.toUpperCase()}
Opening: "${entry.wearTest.openingImpression}"
Drydown: "${entry.wearTest.drydownEvolution}"
Verdict: "${entry.wearTest.verdictQuote}"`;

    navigator.clipboard.writeText(text);
    setCopiedShareId(entry.id);
    setTimeout(() => setCopiedShareId(null), 2500);
  };

  const filteredEntries = entries.filter((e) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === '5_STARS') return e.rating === 5;
    return e.fragranceSlug.toLowerCase().includes(activeFilter.toLowerCase());
  });

  const totalEntries = entries.length;
  const avgLongevity =
    totalEntries > 0
      ? (entries.reduce((acc, curr) => acc + curr.wearTest.hoursLongevity, 0) / totalEntries).toFixed(1)
      : '0';

  return (
    <div id="olfactory-journal-page" className="min-h-screen bg-[#F5F2EC] text-[#171614] py-16 sm:py-24">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-8">
        {/* Header Strip */}
        <div className="border-b border-[#D7D1C7] pb-10 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.32em] text-[#68645E] font-sans font-medium block">
                Patron Olfactory Dossier
              </span>
              <h1 className="font-serif text-fluid-h1 tracking-[0.06em] uppercase font-normal text-[#171614]">
                OLFACTORY JOURNAL
              </h1>
              <div className="w-12 h-[1px] bg-[#A88A5A] my-3" />
              <p className="text-xs sm:text-sm text-[#68645E] font-sans font-light max-w-2xl leading-relaxed">
                A private, bespoke archive for patrons of Elora Haute Parfumerie to chronicle wear longevity, sillage projection, and evolving skin chemistry across seasons.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-6 py-3.5 bg-[#171614] text-[#F5F2EC] hover:bg-[#2D2B27] font-sans text-xs uppercase tracking-[0.2em] transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4 stroke-[1.5]" />
                <span>Record Scent Impression</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="p-5 bg-[#FAF8F5] border border-[#D7D1C7] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#68645E] font-sans block">
                Chronicles Recorded
              </span>
              <span className="font-serif text-2xl text-[#171614] block">
                {totalEntries} Flacons
              </span>
            </div>

            <div className="p-5 bg-[#FAF8F5] border border-[#D7D1C7] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#68645E] font-sans block">
                Average Wear Time
              </span>
              <span className="font-serif text-2xl text-[#171614] block">
                {avgLongevity} Hours
              </span>
            </div>

            <div className="p-5 bg-[#FAF8F5] border border-[#D7D1C7] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#68645E] font-sans block">
                Oil Calibration
              </span>
              <span className="font-serif text-2xl text-[#171614] block">
                25% Extrait
              </span>
            </div>

            <div className="p-5 bg-[#FAF8F5] border border-[#D7D1C7] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#68645E] font-sans block">
                Botanical Maceration
              </span>
              <span className="font-serif text-2xl text-[#171614] block">
                56 Days
              </span>
            </div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#D7D1C7]">
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`text-xs uppercase tracking-[0.2em] font-sans transition-colors relative py-1 ${
                activeFilter === 'ALL'
                  ? 'text-[#171614] font-semibold'
                  : 'text-[#68645E] hover:text-[#171614]'
              }`}
            >
              All Impressions ({entries.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('5_STARS')}
              className={`text-xs uppercase tracking-[0.2em] font-sans transition-colors relative py-1 ${
                activeFilter === '5_STARS'
                  ? 'text-[#171614] font-semibold'
                  : 'text-[#68645E] hover:text-[#171614]'
              }`}
            >
              5-Star Ratings
            </button>
            {['NOIR', 'AURA', 'OUD'].map((flacon) => (
              <button
                key={flacon}
                type="button"
                onClick={() => setActiveFilter(flacon)}
                className={`text-xs uppercase tracking-[0.2em] font-sans transition-colors relative py-1 ${
                  activeFilter === flacon
                    ? 'text-[#171614] font-semibold'
                    : 'text-[#68645E] hover:text-[#171614]'
                }`}
              >
                {flacon}
              </button>
            ))}
          </div>

          {entries.length === 0 && (
            <button
              type="button"
              onClick={handleResetToSample}
              className="text-xs text-[#A88A5A] hover:underline flex items-center space-x-1 font-sans"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Sample Dossier</span>
            </button>
          )}
        </div>

        {/* Journal Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEntries.map((entry) => {
            const isShared = copiedShareId === entry.id;

            return (
              <div
                key={entry.id}
                onClick={() => setSelectedEntryForDetails(entry)}
                className="bg-[#FAF8F5] border border-[#D7D1C7] hover:border-[#171614] p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_8px_30px_rgba(23,22,20,0.02)] cursor-pointer group"
              >
                <div>
                  {/* Batch & Actions */}
                  <div className="flex items-center justify-between border-b border-[#D7D1C7] pb-3 mb-4 text-[11px] font-sans text-[#68645E]">
                    <span className="font-mono text-[10px] tracking-wider">
                      {entry.batchNumber}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px]">{entry.recordedAt}</span>
                      <button
                        type="button"
                        onClick={(e) => handleShareEntry(entry, e)}
                        className="p-1 text-[#68645E] hover:text-[#171614] transition-colors"
                        title="Copy note"
                      >
                        {isShared ? <Check className="w-3.5 h-3.5 text-[#171614]" /> : <Share2 className="w-3.5 h-3.5 stroke-[1.5]" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEntry(entry);
                        }}
                        className="p-1 text-[#68645E] hover:text-[#171614] transition-colors"
                        title="Edit entry"
                      >
                        <Edit3 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteEntry(entry.id, e)}
                        className="p-1 text-[#68645E] hover:text-red-700 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Rating */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-[9.5px] uppercase tracking-[0.25em] text-[#A88A5A] font-sans font-semibold block mb-0.5">
                        {entry.concentration}
                      </span>
                      <h3 className="font-serif text-2xl text-[#171614] group-hover:text-[#2D2B27] transition-colors">
                        {entry.fragranceName}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-0.5 text-[#A88A5A]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= entry.rating ? 'fill-current' : 'text-[#D7D1C7]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Longevity & Sillage */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-sans">
                    <div className="p-3 bg-[#F5F2EC] border border-[#D7D1C7]">
                      <span className="text-[9px] uppercase tracking-wider text-[#68645E] block">
                        Longevity
                      </span>
                      <span className="font-medium text-[#171614]">{entry.wearTest.hoursLongevity} Hours</span>
                    </div>

                    <div className="p-3 bg-[#F5F2EC] border border-[#D7D1C7]">
                      <span className="text-[9px] uppercase tracking-wider text-[#68645E] block">
                        Sillage
                      </span>
                      <span className="font-medium text-[#171614] capitalize">
                        {entry.wearTest.sillage.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Verdict Quote */}
                  <div className="p-3 mb-4 bg-[#F5F2EC] border-l-2 border-[#A88A5A]">
                    <p className="font-serif italic text-xs text-[#171614] leading-relaxed line-clamp-2">
                      "{entry.wearTest.verdictQuote}"
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#D7D1C7] flex items-center justify-between text-[11px] font-sans text-[#68645E]">
                  <span>{entry.wearTest.weatherTested}</span>
                  <span className="text-[#171614] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>View Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedEntryForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-[#FAF8F5] border border-[#D7D1C7] p-8 shadow-2xl text-[#171614] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D7D1C7] pb-4 mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#A88A5A] font-sans font-semibold block">
                  {selectedEntryForDetails.concentration} · Batch {selectedEntryForDetails.batchNumber}
                </span>
                <h3 className="font-serif text-3xl text-[#171614] mt-1">
                  {selectedEntryForDetails.fragranceName}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEntryForDetails(null)}
                className="p-2 text-[#68645E] hover:text-[#171614]"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-6 text-xs font-sans text-[#68645E]">
              <div className="p-4 bg-[#F5F2EC] border border-[#D7D1C7] space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#A88A5A] block">
                  Initial Opening (First 15–30 Minutes)
                </span>
                <p className="text-sm text-[#171614] font-serif">
                  {selectedEntryForDetails.wearTest.openingImpression}
                </p>
              </div>

              <div className="p-4 bg-[#F5F2EC] border border-[#D7D1C7] space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#A88A5A] block">
                  Base Drydown Evolution (3–14 Hours)
                </span>
                <p className="text-sm text-[#171614] font-serif">
                  {selectedEntryForDetails.wearTest.drydownEvolution}
                </p>
              </div>

              <div className="p-4 bg-[#F5F2EC] border-l-2 border-[#A88A5A] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#68645E] block">
                  Patron Verdict
                </span>
                <p className="font-serif italic text-base text-[#171614]">
                  "{selectedEntryForDetails.wearTest.verdictQuote}"
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#D7D1C7] flex justify-between items-center">
              <Link
                to={`/products/${selectedEntryForDetails.fragranceSlug}`}
                className="text-xs uppercase tracking-[0.2em] font-sans text-[#171614] hover:underline"
              >
                View Flacon Page →
              </Link>
              <button
                type="button"
                onClick={() => setSelectedEntryForDetails(null)}
                className="px-6 py-2.5 bg-[#171614] text-[#F5F2EC] text-xs uppercase tracking-[0.2em] font-sans"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-[#FAF8F5] border border-[#D7D1C7] p-8 shadow-2xl text-[#171614] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D7D1C7] pb-4 mb-6">
              <h3 className="font-serif text-2xl text-[#171614]">
                {editingEntry ? 'EDIT WEAR TEST' : 'RECORD SCENT IMPRESSION'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#68645E] hover:text-[#171614]"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-5 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#68645E] block">
                  Select Fragrance
                </label>
                <select
                  value={formData.fragranceId}
                  onChange={(e) => setFormData({ ...formData, fragranceId: e.target.value })}
                  className="w-full p-3 bg-[#F5F2EC] border border-[#D7D1C7] text-xs text-[#171614] outline-none"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#68645E] block">
                    Longevity ({formData.hoursLongevity} hrs)
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="24"
                    step="1"
                    value={formData.hoursLongevity}
                    onChange={(e) =>
                      setFormData({ ...formData, hoursLongevity: parseFloat(e.target.value) })
                    }
                    className="w-full accent-[#171614] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#68645E] block">
                    Sillage
                  </label>
                  <select
                    value={formData.sillage}
                    onChange={(e) => setFormData({ ...formData, sillage: e.target.value as any })}
                    className="w-full p-3 bg-[#F5F2EC] border border-[#D7D1C7] text-xs text-[#171614] outline-none"
                  >
                    <option value="skin_scent">Skin Scent</option>
                    <option value="intimate">Intimate</option>
                    <option value="moderate">Moderate</option>
                    <option value="radiant">Radiant</option>
                    <option value="sovereign">Sovereign</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#68645E] block">
                  Opening Evolution
                </label>
                <input
                  type="text"
                  required
                  value={formData.openingImpression}
                  onChange={(e) => setFormData({ ...formData, openingImpression: e.target.value })}
                  className="w-full p-3 bg-[#F5F2EC] border border-[#D7D1C7] text-xs text-[#171614] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#68645E] block">
                  Drydown Evolution
                </label>
                <input
                  type="text"
                  required
                  value={formData.drydownEvolution}
                  onChange={(e) => setFormData({ ...formData, drydownEvolution: e.target.value })}
                  className="w-full p-3 bg-[#F5F2EC] border border-[#D7D1C7] text-xs text-[#171614] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#68645E] block">
                  Verdict Quote
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.verdictQuote}
                  onChange={(e) => setFormData({ ...formData, verdictQuote: e.target.value })}
                  className="w-full p-3 bg-[#F5F2EC] border border-[#D7D1C7] text-xs text-[#171614] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs text-[#68645E] hover:text-[#171614]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#171614] text-[#F5F2EC] text-xs uppercase tracking-[0.2em] font-sans"
                >
                  Save Impression
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
