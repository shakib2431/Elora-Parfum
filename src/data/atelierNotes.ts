export interface AtelierNoteData {
  slug: string;
  scentStory: {
    title: string;
    chapter: string;
    inspiration: string;
    narrative: string[];
    atmosphereLocation: string;
    perfumerQuote: string;
    perfumerName: string;
    perfumerRole: string;
    moodBoardAccords: string[];
  };
  perfumerJournal: {
    trialNumber: string;
    logDate: string;
    journalEntry: string;
    formulaBreakdown: {
      component: string;
      percentage: string;
      role: string;
    }[];
    craftInsight: string;
  };
  terroirAndHarvest: {
    region: string;
    harvestSeason: string;
    extractionMethod: string;
    provenanceHighlights: {
      botanical: string;
      origin: string;
      detail: string;
    }[];
    sustainabilityNote: string;
  };
  macerationAndBottling: {
    macerationDays: number;
    restingChamberTemp: string;
    filtrationMethod: string;
    flaconDetails: string;
    curingPhilosophy: string;
  };
}

export const ATELIER_NOTES_DATABASE: Record<string, AtelierNoteData> = {
  noir: {
    slug: 'noir',
    scentStory: {
      title: 'The Architecture of Midnight Shadow',
      chapter: 'Genesis Chapter I · Nocturnal Allure',
      inspiration:
        'Born from the memory of late-autumn rainfall tapping against the leaded glass windows of a private Mayfair library, where seasoned cedar shelves meet the smoky warmth of black tea, aged cognac, and whispers of Indonesian agarwood.',
      narrative: [
        'Noir was conceived not as a fragrance for public declaration, but as an intimate nocturnal signature. It seeks the elusive hour between midnight and dawn—when conversation softens, shadows lengthen, and the warmth of bare skin releases subterranean spices.',
        'We wanted an opening that surprises with cool cardamom and bergamot before immediately surrendering to a smoldering heart of roasted tonka bean, birch smoke, and dark bourbon vanilla. It is smoky, enigmatic, and magnetically quiet.',
      ],
      atmosphereLocation: 'Private Mayfair Salon & Smoked Tea Archives · 01:40 AM',
      perfumerQuote:
        'To craft Noir, we stripped away all ornamental sweetness, leaving only the hypnotic tension between cold twilight air and the subterranean fire of aged woods.',
      perfumerName: 'Alix de Saint-Florent',
      perfumerRole: 'Master Perfumer & Nose, Grasse',
      moodBoardAccords: ['Black Tea Vapor', 'Smoked Birch', 'Bourbon Vanilla Pod', 'Cured Leather', 'Crushed Green Cardamom'],
    },
    perfumerJournal: {
      trialNumber: 'Trial #73 / Batch Final',
      logDate: 'November 14, 2024 · Atelier Journal',
      journalEntry:
        'Previous formulations (Trials 64 through 71) leaned excessively sweet due to the natural richness of Madagascar vanilla absolute. Today, we counterbalanced the vanilla resinoid with a 4.2% addition of smoked black tea fraction and wild Guatemalan cardamom. The transition between the brisk top accord and the smoldering heart is now seamless and magnetic.',
      formulaBreakdown: [
        { component: 'Smoked Black Tea Tincture', percentage: '18.5%', role: 'Creates the signature shadowy, atmospheric opening' },
        { component: 'Guatemalan Cardamom Supercritical CO2', percentage: '12.0%', role: 'Brisk, aromatic spine cutting through resinous warmth' },
        { component: 'Aged Bourbon Vanilla Resinoid', percentage: '22.0%', role: 'Deep, dark gourmand foundation without cloying sugar' },
        { component: 'Indonesian Agarwood & Birch Tar', percentage: '15.5%', role: 'Provides smoky, room-commanding sillage lasting 14+ hours' },
      ],
      craftInsight:
        'We deliberately held the perfume oil concentration at a dense 25% Extrait de Parfum to ensure the smoky accords adhere to skin lipids rather than evaporating rapidly.',
    },
    terroirAndHarvest: {
      region: 'Guatemala, Madagascar & East Kalimantan',
      harvestSeason: 'Late Monsoonal Harvest (October–November)',
      extractionMethod: 'Supercritical Fluid CO2 & Slow Alcohol Tincturing',
      provenanceHighlights: [
        {
          botanical: 'Guatemalan Green Cardamom',
          origin: 'Alta Verapaz Highlands',
          detail: 'Grown under cloud forest canopy and cold-extracted to preserve volatile terpenes.',
        },
        {
          botanical: 'Bourbon Vanilla Beans',
          origin: 'Sava Region, Madagascar',
          detail: 'Hand-pollinated orchids cured under equatorial sun for five months before aging.',
        },
        {
          botanical: 'Birch Tar Fraction',
          origin: 'Lapland Birch Groves',
          detail: 'Rectified through multi-stage vacuum distillation to eliminate burnt acridity.',
        },
      ],
      sustainabilityNote:
        '100% of the cardamom and vanilla utilized are sourced from regenerative agroforestry cooperatives paying living-wage premiums.',
    },
    macerationAndBottling: {
      macerationDays: 90,
      restingChamberTemp: '14°C Controlled Micro-Vault',
      filtrationMethod: 'Triple-membrane unchilled cotton filtration',
      flaconDetails: 'Ultra-heavy lead-free crystal with hand-buffed obsidian gloss cap and gold foil seal.',
      curingPhilosophy:
        'Extrait-level oils require extended resting to allow the resinous vanillin molecules to naturally bond with the darker sesquiterpenes of the birch smoke.',
    },
  },

  aura: {
    slug: 'aura',
    scentStory: {
      title: 'The Dew-Drenched Petals of Dawn',
      chapter: 'Genesis Chapter II · Luminous Petals',
      inspiration:
        'An early June sunrise over the sun-drenched flower fields of Grasse, where crystalline dew still clings to freshly bloomed Grandiflorum jasmine and dewy orange blossoms, enveloped in a velvet cocoon of warm cashmere musk.',
      narrative: [
        'Aura was born from the desire to create a floral perfume completely untethered from vintage powder or heavy synthetic musk. We envisioned the radiant clarity of natural daylight striking clean silk sheets.',
        'At its heart is hand-harvested Grasse jasmine, gathered before the morning sun evaporates its most delicate floral nectar, paired with sparkling Calabrian bergamot and a skin-like white amber trail.',
      ],
      atmosphereLocation: 'Grasse Domaine des Fleurs · Dawn, 05:15 AM',
      perfumerQuote:
        'Aura is the scent of skin waking up in clean white linen—effortless, radiant, and endlessly magnetic.',
      perfumerName: 'Margaux Laurent',
      perfumerRole: 'Senior Floral Formulationist, Grasse',
      moodBoardAccords: ['Night-Blooming Jasmine', 'Dewy Petals', 'White Cashmere', 'Calabrian Bergamot', 'Solar Amber'],
    },
    perfumerJournal: {
      trialNumber: 'Trial #52 / Batch Final',
      logDate: 'September 22, 2024 · Atelier Journal',
      journalEntry:
        'The primary challenge with modern floral compositions is preventing the white musk from eclipsing the delicacy of jasmine. In Trial #52, we introduced a fractionated white ambergris accord and solar hedione, giving the jasmine petal effect a continuous 10-hour shimmer on warm pulse points.',
      formulaBreakdown: [
        { component: 'Grasse Jasmine Grandiflorum Absolute', percentage: '24.0%', role: 'The lush, opulent heart of pristine floral nectar' },
        { component: 'Calabrian Bergamot Peel Cold-Press', percentage: '16.0%', role: 'Crisp, dewy sparkle that welcomes the wearer' },
        { component: 'Cashmere Musk Accord', percentage: '26.0%', role: 'Velvety, intimate skin scent warmth' },
        { component: 'Solar Ambergris & White Cedar', percentage: '12.0%', role: 'Anchors the petals with refined mineral radiance' },
      ],
      craftInsight:
        'We harvest solely between 5:00 AM and 8:30 AM; once direct sunlight strikes the petals, up to 35% of the delicate indole fraction is lost.',
    },
    terroirAndHarvest: {
      region: 'Grasse, France & Calabria, Italy',
      harvestSeason: 'June–July Dawn Harvest',
      extractionMethod: 'Gentle Hexane-Free Volatile Solvent Absolute & Cold Expressed Peel',
      provenanceHighlights: [
        {
          botanical: 'Jasminum Grandiflorum',
          origin: 'Domaine de Grasse, France',
          detail: 'Harvested entirely by hand using traditional wicker baskets to avoid petal bruising.',
        },
        {
          botanical: 'Calabrian Bergamot',
          origin: 'Reggio Calabria Coastal Groves',
          detail: 'Cold-pressed from green winter rinds for crystalline citrus purity.',
        },
        {
          botanical: 'White Neroli Blossom',
          origin: 'Cap d’Antibes Orchards',
          detail: 'Steam distilled on the same afternoon as picking to capture volatile green water.',
        },
      ],
      sustainabilityNote:
        'Grown in certified organic biodiversity corridors that actively shelter wild pollinator bee populations in Provence.',
    },
    macerationAndBottling: {
      macerationDays: 75,
      restingChamberTemp: '12°C Dark Cold Cellar',
      filtrationMethod: 'Sub-zero gravity cellulose pads to preserve delicate floral volatile compounds',
      flaconDetails: 'Translucent champagne crystal flacon crowned with a brushed satin gold magnetic closure.',
      curingPhilosophy:
        'Delicate floral absolutes need gentle, cold conditioning so the volatile top notes do not oxidize before bottling.',
    },
  },

  eclat: {
    slug: 'eclat',
    scentStory: {
      title: 'The Crystalline Mediterranean Mist',
      chapter: 'Genesis Chapter III · Coastal Solstice',
      inspiration:
        'Inspired by the sheer limestone cliffs of Positano at midday, where the crisp scent of wild coastal lemons and crushed sage intermingles with sun-bleached mineral driftwood and the ionized breeze of the Tyrrhenian Sea.',
      narrative: [
        'Eclat is the olfactory embodiment of light. Unlike conventional aquatic colognes that fade within hours, Eclat was formulated as a 25% concentrated Extrait with an enduring foundation of coastal cedar, clary sage, and sea amber.',
        'It opens with an explosive, effervescent burst of sunlit Amalfi lemons and crushed sea salt before settling into a warm, mineral drydown that evokes sun-baked sea rock and crisp white linen.',
      ],
      atmosphereLocation: 'Positano Overlook & Tyrrhenian Coastline · 12:30 PM',
      perfumerQuote:
        'We sought to trap the electric vitality of Mediterranean sunlight inside crystal glass—crisp, salted, and infinitely revitalizing.',
      perfumerName: 'Henri Vaneau',
      perfumerRole: 'Master Citrus & Aquatic Perfumer',
      moodBoardAccords: ['Amalfi Lemon Rind', 'Iodine Sea Salt', 'Clary Sage', 'Bleached Driftwood', 'Sunlit Mint'],
    },
    perfumerJournal: {
      trialNumber: 'Trial #61 / Batch Final',
      logDate: 'August 09, 2024 · Atelier Journal',
      journalEntry:
        'Citrus molecules possess notoriously rapid evaporation rates. By structuring the base with captive mineral amber and aged coastal cedarwood, we locked the zest of Amalfi lemon into a persistent crystalline lattice that radiates cleanly for upwards of 11 hours without mutating into soapiness.',
      formulaBreakdown: [
        { component: 'Amalfi Lemon Primo Fiore Oil', percentage: '28.0%', role: 'Intensely aromatic, sun-drenched coastal zest' },
        { component: 'Marine Sea Salt & Algae Absolute', percentage: '9.5%', role: 'Authentic ocean breeze and mineral tension' },
        { component: 'French Clary Sage & Wild Mint', percentage: '14.0%', role: 'Aromatic herbal heart with crisp green crispness' },
        { component: 'Atlas Cedar & Driftwood Resins', percentage: '22.0%', role: 'Sun-dried mineral base providing steady 11-hour projection' },
      ],
      craftInsight:
        'We specifically utilized Primo Fiore winter lemons, which have a thicker rind containing 40% higher monoterpene oil density than summer fruit.',
    },
    terroirAndHarvest: {
      region: 'Amalfi Coast, Italy & Corsican Cliffs',
      harvestSeason: 'January–March Primo Fiore Picking',
      extractionMethod: 'Cold Manual Sponge Expression & Molecular Sea Salt Fractionation',
      provenanceHighlights: [
        {
          botanical: 'Amalfi Lemon (Sfumato)',
          origin: 'Sorrento & Amalfi Terraces',
          detail: 'Cultivated on steep cliffside stone terraces and cold-sponge pressed.',
        },
        {
          botanical: 'Corsican Clary Sage',
          origin: 'Cap Corse Maquis',
          detail: 'Wild-harvested from rocky coastal scrublands for aromatic herbaceous depth.',
        },
        {
          botanical: 'Mineral Cedarwood',
          origin: 'High Atlas Escarpments',
          detail: 'Sustainably sourced fallen timber exhibiting salty, sun-dried character.',
        },
      ],
      sustainabilityNote:
        'Terrace preservation initiative: each liter of lemon oil supports the restoration of ancient limestone dry-stone terraces on the Amalfi coast.',
    },
    macerationAndBottling: {
      macerationDays: 60,
      restingChamberTemp: '10°C Nitrogen-Blanketed Stainless Vats',
      filtrationMethod: 'Dual-phase fine paper cold filtration',
      flaconDetails: 'Aquamarine tinted high-purity Italian flint glass with polished platinum cap.',
      curingPhilosophy:
        'Nitrogen blanketing prevents the sensitive citrus aldehydes from oxygen exposure during the two-month settling period.',
    },
  },

  'oud-elite': {
    slug: 'oud-elite',
    scentStory: {
      title: 'The Sovereign Smoke of Agarwood',
      chapter: 'Genesis Chapter IV · Imperial Heritage',
      inspiration:
        'A homage to the ancestral incense chambers of ancient Arabian palaces. Aged Cambodian agarwood smolders slowly over glowing embers, kissed by rare Damascus rose otto, birch smoke, and deep golden labdanum amber.',
      narrative: [
        'Oud Elite represents the uncompromising pinnacle of oriental haute parfumerie. We discarded all synthetic oud approximations, choosing solely genuine wild-harvested agarwood aged for over 18 years in temperature-shielded cellars.',
        'The result is a regal, multidimensional creation: deeply balsamic, velvety, with whispers of antique leather, rose otto, and smoldering frankincense that leaves an indelible trail in any room you enter.',
      ],
      atmosphereLocation: 'Sanctum of Old Muscat & Damascus Rose Gardens · 21:00 PM',
      perfumerQuote:
        'True agarwood does not yell; it commands absolute reverence through dark, resinous gravitas.',
      perfumerName: 'Tariq Al-Mansoor & Alix de Saint-Florent',
      perfumerRole: 'Master Oud Curators & Co-Formulators',
      moodBoardAccords: ['18-Year Aged Oud', 'Damascus Rose Otto', 'Birch Smoke', 'Smoked Amber', 'Frankincense Tears'],
    },
    perfumerJournal: {
      trialNumber: 'Trial #89 / Master Formulation',
      logDate: 'October 03, 2024 · Atelier Journal',
      journalEntry:
        'Balancing aged Cambodian oud requires extreme precision. In Trial #89, we paired 18-year wild agarwood oil with steam-distilled Damascus rose otto from the Taif plateau. The rose softens the animalic nuances of the wood, transforming the opening into a velvety crimson smoke that blooms majestically on skin.',
      formulaBreakdown: [
        { component: '18-Year Wild Cambodian Agarwood', percentage: '21.0%', role: 'The dark, balsamic soul and sovereign backbone' },
        { component: 'Damascus Rose Otto (Copper Distilled)', percentage: '15.0%', role: 'Regal floral counterpoint to smoky agarwood' },
        { component: 'Royal Hojari Frankincense Resin', percentage: '16.5%', role: 'Sacred balsamic lift with subtle citrus facets' },
        { component: 'Aged Spanish Cistus Labdanum', percentage: '23.0%', role: 'Golden, leather-like foundation providing 16+ hour presence' },
      ],
      craftInsight:
        'The agarwood distillation was conducted in ancient wood-fired copper stills using low-temperature slow boiling to preserve the rare sesquiterpene profile.',
    },
    terroirAndHarvest: {
      region: 'Koh Kong, Cambodia & Taif, Saudi Arabia',
      harvestSeason: 'Autumn Resin Collection',
      extractionMethod: 'Artisanal Copper Still Hydro-Distillation & Resin Tincturing',
      provenanceHighlights: [
        {
          botanical: 'Cambodian Aquilaria Crassna',
          origin: 'Koh Kong Valley Forest Reserve',
          detail: 'Naturally resin-saturated heartwood aged 18 years post-distillation.',
        },
        {
          botanical: 'Damascus Rose Otto',
          origin: 'Taif Plateau, 2000m Elevation',
          detail: 'Over 30 roses hand-picked per milliliter of pure copper-distilled otto.',
        },
        {
          botanical: 'Hojari Frankincense Tears',
          origin: 'Dhofar Mountains, Oman',
          detail: 'Grade-A royal white tears harvested from ancient Boswellia sacra trees.',
        },
      ],
      sustainabilityNote:
        'Every tree harvested is matched by the planting of twelve wild Aquilaria saplings in protected community conservancies.',
    },
    macerationAndBottling: {
      macerationDays: 120,
      restingChamberTemp: '16°C Dark Oak Barrel Casks',
      filtrationMethod: 'Slow natural gravity sedimentation and double silk sieve',
      flaconDetails: 'Smoked amber crystal flacon with weighted antique brass cap and gold engraved crest.',
      curingPhilosophy:
        'Extended 120-day oak cask resting allows the dense resins of oud and frankincense to polymerize and reach velvety equilibrium.',
    },
  },

  'elora-signature-set': {
    slug: 'elora-signature-set',
    scentStory: {
      title: 'The Complete Olfactory Quadrant',
      chapter: 'Genesis Chapter V · The Discovery Coffret',
      inspiration:
        'A comprehensive exploration of the four pillars of haute parfumerie: Noir (Woody Amber), Aura (Floral Cashmere), Eclat (Coastal Solstice), and Oud Elite (Imperial Agarwood). Designed for the connoisseur to discover their bespoke signature or master the art of fragrance layering.',
      narrative: [
        'The Elora Signature Coffret was envisioned as an atelier in miniature. Four 20ml atomizers crafted with the same rigorous 25% Extrait de Parfum concentration as our full-scale flacons.',
        'Housed in an embossed ivory presentation box with magnetic closures and a gilded voucher for full rebate toward any full-sized 100ml flacon.',
      ],
      atmosphereLocation: 'Elora Parfumerie Atelier Archives · Grasse & Mumbai',
      perfumerQuote:
        'Fragrance is not static—it shifts with the seasons, the hour of the day, and the cadence of your mood. The Signature Coffret invites you to become the curator of your own presence.',
      perfumerName: 'The Elora Perfumery Council',
      perfumerRole: 'Collective Atelier noses',
      moodBoardAccords: ['Amber Dusk', 'Solar Floral', 'Coastal Salt', 'Regal Agarwood', 'Extrait Concentration'],
    },
    perfumerJournal: {
      trialNumber: 'Atelier Curated Edition',
      logDate: 'December 2024 · Atelier Journal',
      journalEntry:
        'Every individual atomizer is filled from the exact same master maceration batches as our flagship flacons. We engineered the 20ml miniature pumps to deliver the identical 0.12ml micro-mist droplet dispersion as our 100ml flacons, preserving the full bloom of the olfactory pyramid.',
      formulaBreakdown: [
        { component: 'Noir Extrait (20ml)', percentage: '25% Oil', role: 'Nocturnal, smoked tea, tonka and woods' },
        { component: 'Aura Extrait (20ml)', percentage: '25% Oil', role: 'Dewy Grasse jasmine, bergamot and white cashmere' },
        { component: 'Eclat Extrait (20ml)', percentage: '25% Oil', role: 'Amalfi lemon, wild coastal mint and mineral driftwood' },
        { component: 'Oud Elite Extrait (20ml)', percentage: '25% Oil', role: '18-year wild Cambodian oud and Damascus rose otto' },
      ],
      craftInsight:
        'Layering suggestion: Apply one spray of Eclat as a radiant base, crowned with one mist of Noir on collarbones for an unforgettable evening contrast.',
    },
    terroirAndHarvest: {
      region: 'Worldwide Terroirs: Grasse, Calabria, Guatemala, Koh Kong',
      harvestSeason: 'Four-Season Synchronized Harvest',
      extractionMethod: 'Unified Haute Parfumerie Extractions',
      provenanceHighlights: [
        { botanical: 'Multi-Terroir Sourcing', origin: 'Four Continents', detail: 'Only grade-A botanical fractions selected across all four profiles.' },
        { botanical: 'Custom 20ml Atomizers', origin: 'Florence, Italy', detail: 'Precision-machined nozzles producing ultra-fine micro-droplets.' },
      ],
      sustainabilityNote: '100% recyclable FSC-certified presentation coffret with soy inks and cotton velvet insert.',
    },
    macerationAndBottling: {
      macerationDays: 90,
      restingChamberTemp: '12°C to 15°C',
      filtrationMethod: 'Precision micro-membrane',
      flaconDetails: 'Four pocket-sized crystal cylinders with leakproof magnetic caps.',
      curingPhilosophy: 'Each batch is tested for sillage stability before assembly into coffrets.',
    },
  },
};

/**
 * Asynchronously retrieves the Atelier Notes for a given product slug.
 * Simulates a realistic luxury archive fetch with a brief async promise.
 */
export async function fetchAtelierNotes(slug: string): Promise<AtelierNoteData> {
  // Simulate micro-network latency for realistic dynamic fetching feel (180ms)
  await new Promise((resolve) => setTimeout(resolve, 180));

  const directMatch = ATELIER_NOTES_DATABASE[slug];
  if (directMatch) {
    return directMatch;
  }

  // Fallback synthesis for any custom/dynamic slug
  return {
    slug,
    scentStory: {
      title: 'The Artisanal Atelier Vision',
      chapter: 'Master Formulary Chapter',
      inspiration:
        'Formulated at a concentrated 25% Extrait ratio using rare cold-pressed botanicals, wild-harvested resins, and clean crystalline musks that react to individual skin warmth.',
      narrative: [
        'Every Elora creation begins in the historic perfume hills of Grasse, where ancient distillation rituals merge with modern olfactory precision.',
        'Engineered to evolve gradually over 16+ hours, revealing top sparkling accents, a generous heart, and a lingering skin-scent foundation.',
      ],
      atmosphereLocation: 'Elora Parfumerie Atelier · Grasse',
      perfumerQuote:
        'A fragrance should never announce you before you arrive, but gently linger long after you have departed.',
      perfumerName: 'Elora Master Parfumeur',
      perfumerRole: 'Lead Nose & Formulator',
      moodBoardAccords: ['25% Extrait', 'Rare Botanicals', 'Noble Woods', 'Skin Chemistry'],
    },
    perfumerJournal: {
      trialNumber: 'Atelier Batch Release',
      logDate: 'Formulation Archive Entry',
      journalEntry:
        'Carefully tested across multiple skin types to ensure harmonious sillage, high projection, and skin-friendly hypoallergenic longevity.',
      formulaBreakdown: [
        { component: 'Signature Core Accord', percentage: '30%', role: 'Defines the primary olfactive character' },
        { component: 'Aromatic & Citrus Accents', percentage: '25%', role: 'Bright, welcoming top opening' },
        { component: 'Resinous Base Foundation', percentage: '45%', role: 'Ensures 12+ hour sillage on pulse points' },
      ],
      craftInsight: 'Hand-blended in small micro-batches of 500 numbered flacons.',
    },
    terroirAndHarvest: {
      region: 'Grasse & Global Ethical Collectives',
      harvestSeason: 'Peak Season Morning Harvest',
      extractionMethod: 'Artisanal Steam & Cold Expression',
      provenanceHighlights: [
        { botanical: 'Pure Botanical Extracts', origin: 'Grasse Valley', detail: 'Ethically gathered by generational growers.' },
      ],
      sustainabilityNote: 'Formulated without parabens, phthalates, or cruelty. 100% vegan.',
    },
    macerationAndBottling: {
      macerationDays: 90,
      restingChamberTemp: '14°C Dark Vault',
      filtrationMethod: 'Triple-membrane cotton pad',
      flaconDetails: 'Heavy crystal glass with magnetic seal.',
      curingPhilosophy: 'Slow aging preserves delicate top note facets.',
    },
  };
}
