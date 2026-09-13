import { LayeringPairing } from '../types';

export const LAYERING_PAIRINGS: LayeringPairing[] = [
  {
    id: 'aura-noir',
    title: 'Twilight Velvet',
    flacon1Slug: 'aura',
    flacon2Slug: 'noir',
    vibe: 'Mysterious, Sensual, Gilded Floriental',
    harmonyScore: 98,
    fusedTopNotes: ['Calabrian Bergamot', 'Crushed Cardamom', 'Smoked Black Tea'],
    fusedHeartNotes: ['French Jasmine Sambac', 'Bourbon Vanilla Pod', 'Orange Blossom'],
    fusedBaseNotes: ['White Velvet Musk', 'Mysore Sandalwood', 'Dark Ambergris'],
    olfactorySymphony:
      'The crisp, crystalline dew of Aura softens Noir’s smoldering vanillic resins, producing an intoxicating twilight skin-scent that sparkles with bergamot before settling into warm cashmere amber.',
    perfumerTip:
      'Spray 2 sprays of NOIR onto warm pulse points (neck, wrists) first. Allow 60 seconds to warm, then mist 2 sprays of AURA across your collarbones for an angelic halo.',
    recommendedRatio: '1:1 Balanced Duet',
  },
  {
    id: 'aura-eclat',
    title: 'Riviera Sunrise',
    flacon1Slug: 'aura',
    flacon2Slug: 'eclat',
    vibe: 'Solar, Breezy, Crystalline Freshness',
    harmonyScore: 95,
    fusedTopNotes: ['Sunlit Amalfi Lemon', 'Calabrian Bergamot', 'Crushed Wild Mint'],
    fusedHeartNotes: ['French Jasmine Sambac', 'Mediterranean Sea Breeze', 'Violet Petals'],
    fusedBaseNotes: ['Clean Driftwood', 'White Velvet Musk', 'Mineral Amber'],
    olfactorySymphony:
      'A radiant rush of sun-drenched Amalfi citrus and Mediterranean sea salt uplifted by Grasse jasmine sambac and delicate white musk. An effortless daytime aura of pure clean elegance.',
    perfumerTip:
      'Apply ÉCLAT generously on bare skin post-shower, then mist AURA lightly over your linen shirt or silk scarf for maximum diffusion throughout the day.',
    recommendedRatio: '2 sprays Éclat : 1 spray Aura',
  },
  {
    id: 'aura-oud-elite',
    title: 'Imperial Silk',
    flacon1Slug: 'aura',
    flacon2Slug: 'oud-elite',
    vibe: 'Regal, Modern Royalty, Softened Smoke',
    harmonyScore: 96,
    fusedTopNotes: ['Dewy Mandarin', 'Wild Green Cardamom', 'Pink Peppercorn'],
    fusedHeartNotes: ['Damascus Rose Otto', 'French Jasmine Sambac', 'Precious Cambodian Oud'],
    fusedBaseNotes: ['White Velvet Musk', 'Burnished Leather', 'Atlas Cedarwood'],
    olfactorySymphony:
      'The heavy, sovereign smoke of wild Cambodian oud and royal rose is veiled in a luminous shroud of dewy white petals and musk, dramatically transforming an imposing oud into an approachable, regal daytime statement.',
    perfumerTip:
      'Apply 1 single concentrated spray of OUD ÉLITE at the base of the throat, then diffuse 2 generous sprays of AURA over the chest and forearms to create a royal sillage.',
    recommendedRatio: '1 spray Oud Élite : 2 sprays Aura',
  },
  {
    id: 'noir-eclat',
    title: 'Nocturnal Coast',
    flacon1Slug: 'eclat',
    flacon2Slug: 'noir',
    vibe: 'Chiaroscuro, Salty Woods, Smoked Ambergris',
    harmonyScore: 94,
    fusedTopNotes: ['Amalfi Lemon', 'Crushed Cardamom', 'Crushed Wild Mint'],
    fusedHeartNotes: ['Mediterranean Sea Breeze', 'Bourbon Vanilla', 'Smoked Labdanum'],
    fusedBaseNotes: ['Dark Ambergris', 'Clean Driftwood', 'Mysore Sandalwood'],
    olfactorySymphony:
      'An avant-garde clash of cold maritime sea salt and hot vanilla smoke. The briny minerality of Éclat cuts cleanly through Noir’s dark resinous ambergris, creating a magnetic coastal twilight aesthetic.',
    perfumerTip:
      'Layer side-by-side: 1 spray of NOIR behind each ear, and 2 sprays of ÉCLAT across the chest and wrists so both accords interact dynamically in the air around you.',
    recommendedRatio: '1 spray Noir : 1 spray Éclat',
  },
  {
    id: 'noir-oud-elite',
    title: 'Grand Midnight',
    flacon1Slug: 'noir',
    flacon2Slug: 'oud-elite',
    vibe: 'Opulent, Black-Tie, Sovereign Depth',
    harmonyScore: 99,
    fusedTopNotes: ['Smoked Nutmeg', 'Crushed Cardamom', 'Zanzibar Clove'],
    fusedHeartNotes: ['Cambodian Agarwood', 'Bourbon Vanilla Pod', 'Damascus Rose'],
    fusedBaseNotes: ['Mysore Sandalwood', 'Burnished Leather', 'Sumatran Benzoin'],
    olfactorySymphony:
      'The pinnacle of nocturnal grandeur. Noir’s creamy bourbon vanilla and aged Mysore sandalwood soften and enrich Oud Élite’s potent agarwood and birch smoke into a velvety, commanding 16-hour presence.',
    perfumerTip:
      'The ultimate evening power pairing. Apply NOIR to pulse points and OUD ÉLITE to the lapels of a dark wool or velvet coat for an unforgettable entrance.',
    recommendedRatio: '1:1 Evening Potency',
  },
  {
    id: 'eclat-oud-elite',
    title: 'Solar Agarwood',
    flacon1Slug: 'eclat',
    flacon2Slug: 'oud-elite',
    vibe: 'Modern Contrast, Aromatic Wood, Incense Sparkle',
    harmonyScore: 92,
    fusedTopNotes: ['Sunlit Amalfi Lemon', 'Green Cardamom', 'Neroli'],
    fusedHeartNotes: ['Sea Salt Accord', 'Cambodian Oud', 'Clary Sage'],
    fusedBaseNotes: ['Mineral Vetiver', 'Incense Smoke', 'Clean Driftwood'],
    olfactorySymphony:
      'A striking olfactory contrast where bright Italian sunshine directly pierces deep Cambodian forest incense. The effervescent lemon and coastal salinity bring startling modern vibrance to dark ancient oud.',
    perfumerTip:
      'Spray OUD ÉLITE first as the foundational base. Wait 3 minutes, then overspray ÉCLAT to let the citrus oils sparkle atop the warm wood resins.',
    recommendedRatio: '1 spray Oud Élite : 2 sprays Éclat',
  },
];

export function getLayeringPairingsForProduct(productSlug: string): LayeringPairing[] {
  return LAYERING_PAIRINGS.filter(
    (p) => p.flacon1Slug === productSlug || p.flacon2Slug === productSlug
  );
}
