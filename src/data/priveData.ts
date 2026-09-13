import { PriveRewardItem } from '../types';

export const PRIVE_LIMITED_EDITIONS: PriveRewardItem[] = [
  {
    id: 'prive-iris-nobile',
    title: 'Iris Nobile Extrait',
    editionSubtitle: 'Genesis Batch 001 · Private Reserve Flacon',
    category: 'Powdery · Velvet Iris · Smoked Wood',
    size: '30ml Hand-Numbered Extrait',
    concentration: '32% Ultra-Pure Extrait de Parfum',
    pointsRequired: 1200,
    availableQuantity: 18,
    description:
      'Distilled from 3-year cellar-aged Florentine Iris Pallida rhizomes macerated in French oak barrels. Enveloped in warm ambrette seeds, powdery heliotrope, and smoked Mysore cedarwood. Never commercially retailed.',
    notes: ['Florentine Iris Pallida', 'French Ambrette Seed', 'White Suede', 'Smoked Mysore Cedar'],
    rarityBadge: 'Only 100 Flacons Crafted',
    flaconColor: '#9370DB',
  },
  {
    id: 'prive-attar-santal',
    title: 'Attar Santal Privé',
    editionSubtitle: 'Non-Alcoholic Pure Oil Distillation',
    category: 'Sacred Woods · Golden Saffron · Warm Resin',
    size: '12ml Crystal Dropper Flacon',
    concentration: '100% Pure Botanical Perfume Oil',
    pointsRequired: 1500,
    availableQuantity: 9,
    description:
      'An ancient hydro-distillation of aged Indian sandalwood infused with Kashmiri saffron threads and raw Yemen labdanum tears. Presented in an optical lead-crystal flacon with 24k gold-dipped glass wand.',
    notes: ['Aged Sandalwood Heart', 'Kashmiri Saffron', 'Wild Cardamom', 'Raw Benzoin Tears'],
    rarityBadge: 'Private Cellar Allocation',
    flaconColor: '#DAA520',
  },
  {
    id: 'prive-cacao-blanc',
    title: 'Cacao Blanc & Cardamom Reserve',
    editionSubtitle: 'Autumn Solstice Distillation',
    category: 'Gourmand Woods · White Cacao · Warm Spice',
    size: '50ml Heavy Glass Flacon',
    concentration: '28% Extrait de Parfum',
    pointsRequired: 2200,
    availableQuantity: 12,
    description:
      'Cold-extracted Ecuadorian white porcelain cacao roasted over gentle fruitwood flames, folded into green Guatemala cardamom pods and creamy Tahitian vanilla bean. Enriched with golden ambergris.',
    notes: ['Ecuadorian White Cacao', 'Green Guatemala Cardamom', 'Tahitian Vanilla Pod', 'Golden Ambergris'],
    rarityBadge: 'Master Perfumer Personal Reserve',
    flaconColor: '#D2691E',
  },
  {
    id: 'prive-damascus-rose',
    title: 'Rose Damascus Imperial Otto',
    editionSubtitle: 'First-Dawn Harvest · Grasse',
    category: 'Imperial Florals · Dewy Rose · Incense',
    size: '15ml Pocket Travel Flacon',
    concentration: '30% Extrait de Parfum',
    pointsRequired: 850,
    availableQuantity: 24,
    description:
      'Hand-plucked at first morning light before the Mediterranean sun evaporates the morning dew. A majestic, dewy velvet rose grounded by smoldering frankincense resin and virgin cedar.',
    notes: ['First-Dawn Damascus Rose Otto', 'May Rose Absolute', 'Hojari Frankincense', 'White Musk'],
    rarityBadge: 'First Dawn Harvest',
    flaconColor: '#E06D8A',
  },
];

export const PRIVE_TIERS = [
  {
    name: 'Atelier Circle',
    minPoints: 0,
    multiplier: '1x Points (₹10 = 1 pt)',
    perks: ['Invitation to seasonal distillations', 'Complimentary gift packaging'],
  },
  {
    name: 'Amber Concierge',
    minPoints: 1000,
    multiplier: '1.25x Points (₹10 = 1.25 pts)',
    perks: ['Priority White-Glove dispatch', 'Complimentary 2ml bespoke discovery vials with every order'],
  },
  {
    name: 'Obsidian Reserve',
    minPoints: 2500,
    multiplier: '1.5x Points (₹10 = 1.5 pts)',
    perks: ['Direct WhatsApp Master Perfumer concierge', 'First allocation rights on Genesis batches', 'Private bespoke coffret engraving'],
  },
];
