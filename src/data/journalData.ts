import { OlfactoryJournalEntry } from '../types';

export const INITIAL_JOURNAL_ENTRIES: OlfactoryJournalEntry[] = [
  {
    id: 'journal-entry-1',
    fragranceId: 'elora-noir',
    fragranceSlug: 'noir',
    fragranceName: 'NOIR',
    concentration: '25% Extrait de Parfum',
    rating: 5,
    recordedAt: '12 Sep 2026',
    purchasedDate: '02 Aug 2026',
    batchNumber: 'GEN-NOIR-B001-44',
    wearTest: {
      hoursLongevity: 15.5,
      sillage: 'radiant',
      weatherTested: 'Autumn Evening Breeze · 19°C',
      occasions: ['Black Tie Gala', 'Candlelit Dinner'],
      openingImpression: 'Smoked cardamom and black tea hit with an intoxicating crisp smokiness that immediately commands presence.',
      drydownEvolution: 'After 3 hours, a creamy bourbon vanilla and salted ambergris skin accord emerges, radiating gently yet persistently throughout the entire night.',
      layeringPairingTested: 'Layered with 1 pulse-point mist of AURA on the collarbones.',
      verdictQuote: 'An extraordinary nocturnal masterpiece. Endures well past midnight with zero synthetic harshness.',
    },
    personalReflections:
      'Wore this for an orchestral performance at the Royal Opera. Received compliments from two fellow patrons during intermission asking what bespoke fragrance house crafted this scent. The sandalwood base clings to cashmere coats for days.',
    favoredLayeringCombination: 'Noir (2 sprays base of neck) + Aura (1 spray wrist)',
    authorName: 'Elena Vance',
    authorPatronId: 'ELORA-VIP-8824',
  },
  {
    id: 'journal-entry-2',
    fragranceId: 'elora-aura',
    fragranceSlug: 'aura',
    fragranceName: 'AURA',
    concentration: '25% Extrait de Parfum',
    rating: 5,
    recordedAt: '28 Aug 2026',
    purchasedDate: '15 Jul 2026',
    batchNumber: 'GEN-AURA-B001-19',
    wearTest: {
      hoursLongevity: 11,
      sillage: 'moderate',
      weatherTested: 'Sunlit Morning · 24°C',
      occasions: ['Executive Boardroom', 'Sunday High Tea'],
      openingImpression: 'Calabrian bergamot and dewy mandarin sparkle like crystal-clear spring water on sun-warmed marble.',
      drydownEvolution: 'Transforms into an ethereal velvet veil of clean jasmine petals and pristine white musk that smells effortless and extraordinarily wealthy.',
      layeringPairingTested: 'Worn solo on bare moisturized skin.',
      verdictQuote: 'The quintessential signature day fragrance. Clean, luminescent, and completely devoid of soapy clichés.',
    },
    personalReflections:
      'My go-to companion for morning strategy summits and private gallery previews. It projects an aura of composed elegance and quiet authority. Extremely uplifting on warmer days.',
    favoredLayeringCombination: 'Standalone daily signature',
    authorName: 'Elena Vance',
    authorPatronId: 'ELORA-VIP-8824',
  },
  {
    id: 'journal-entry-3',
    fragranceId: 'elora-oud-elite',
    fragranceSlug: 'oud-elite',
    fragranceName: 'OUD ÉLITE',
    concentration: '25% Extrait de Parfum',
    rating: 5,
    recordedAt: '05 Sep 2026',
    purchasedDate: '20 Aug 2026',
    batchNumber: 'GEN-OUD-B001-08',
    wearTest: {
      hoursLongevity: 18,
      sillage: 'sovereign',
      weatherTested: 'Rainy Night · 17°C',
      occasions: ['Private Salon Gathering', 'Autumn Formal'],
      openingImpression: 'Rare cardamom pods ignite smoldering birch and deep royal agarwood. Deeply commanding and regal.',
      drydownEvolution: 'The Damascus rose heart weaves seamlessly into aged leather and golden benzoin, leaving a warm incense trail that fills rooms effortlessly.',
      layeringPairingTested: 'Worn solo on pulse points.',
      verdictQuote: 'Unquestionably the most majestic oud I have encountered. Royal, smooth, and extraordinarily long-lived.',
    },
    personalReflections:
      'Reserved for moments where quiet presence is not enough. The pure agarwood extraction has none of the barnyard sharpness common in cheaper ouds; it is velvety, smoky, and warm.',
    favoredLayeringCombination: 'Oud Élite (1 spray) + Noir (1 spray)',
    authorName: 'Elena Vance',
    authorPatronId: 'ELORA-VIP-8824',
  },
];

const JOURNAL_STORAGE_KEY = 'elora_olfactory_journal_v1';

export function getStoredJournalEntries(): OlfactoryJournalEntry[] {
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(INITIAL_JOURNAL_ENTRIES));
      return INITIAL_JOURNAL_ENTRIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_JOURNAL_ENTRIES;
  } catch (err) {
    console.error('Failed to load journal entries from storage', err);
    return INITIAL_JOURNAL_ENTRIES;
  }
}

export function saveStoredJournalEntry(entry: OlfactoryJournalEntry): OlfactoryJournalEntry[] {
  try {
    const existing = getStoredJournalEntries();
    const index = existing.findIndex((e) => e.id === entry.id);
    let updated: OlfactoryJournalEntry[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = entry;
    } else {
      updated = [entry, ...existing];
    }
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save journal entry', err);
    return [];
  }
}

export function deleteStoredJournalEntry(id: string): OlfactoryJournalEntry[] {
  try {
    const existing = getStoredJournalEntries();
    const updated = existing.filter((e) => e.id !== id);
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete journal entry', err);
    return [];
  }
}
