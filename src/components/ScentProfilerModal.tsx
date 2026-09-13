import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag, Layers, Award } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { EloraBottleVisualizer } from './EloraBottleVisualizer';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface ScentProfilerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuizOption {
  label: string;
  tag: string;
  icon: string;
  detail: string;
  matchedSlugs: string[]; // slugs that benefit from this choice
}

interface QuizQuestion {
  id: number;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: 'What atmosphere or sensory world captures your aesthetic?',
    subtitle: 'Question 1 of 4 · Olfactory Atmosphere',
    options: [
      {
        label: 'Twilight Opulence & Private Lounges',
        tag: 'oud-amber',
        icon: '🌙',
        detail: 'Smoked black tea, cardamom, aged amber, and rare agarwood',
        matchedSlugs: ['noir', 'oud-elite'],
      },
      {
        label: 'Sun-Drenched Mediterranean Riviera',
        tag: 'citrus-coastal',
        icon: '🍋',
        detail: 'Sunlit Amalfi lemon, crushed wild mint, and mineral driftwood',
        matchedSlugs: ['eclat', 'aura'],
      },
      {
        label: 'Midnight Grasse Garden & Dewy Silk',
        tag: 'floral-musk',
        icon: '🌸',
        detail: 'Night-blooming Grasse jasmine, orange blossom, and skin musk',
        matchedSlugs: ['aura', 'eclat'],
      },
      {
        label: 'Ancient Incense Sanctum & Smoldering Resins',
        tag: 'rare-woods',
        icon: '🪵',
        detail: 'Cambodian oud, Damascus rose otto, birch smoke, and seasoned leather',
        matchedSlugs: ['oud-elite', 'noir'],
      },
    ],
  },
  {
    id: 2,
    title: 'How do you prefer your fragrance presence (sillage)?',
    subtitle: 'Question 2 of 4 · Sillage & Footprint',
    options: [
      {
        label: 'Sovereign & Majestic (Room-Filling Trail)',
        tag: 'bold',
        icon: '👑',
        detail: 'Extravagant 16+ hour longevity with an indelible, commanding presence',
        matchedSlugs: ['oud-elite', 'noir'],
      },
      {
        label: 'Warm, Enigmatic & Magnetic',
        tag: 'sensual',
        icon: '🔥',
        detail: 'Deep bourbon vanilla and smoked resins drawing admirers in closer',
        matchedSlugs: ['noir', 'oud-elite'],
      },
      {
        label: 'Luminous, Crisp & Uplifting',
        tag: 'fresh',
        icon: '✨',
        detail: 'Solar radiance with invigorating sea salt and botanical herbs',
        matchedSlugs: ['eclat', 'aura'],
      },
      {
        label: 'Intimate Skin Scent & Velvet Glow',
        tag: 'intimate',
        icon: '🤍',
        detail: 'Soft Calabrian bergamot and white cashmere musk warming to your touch',
        matchedSlugs: ['aura', 'eclat'],
      },
    ],
  },
  {
    id: 3,
    title: 'Which time or setting will this fragrance most often accompany?',
    subtitle: 'Question 3 of 4 · Setting & Occasion',
    options: [
      {
        label: 'Nocturnal Galas, Soirées & Intimate Dinners',
        tag: 'evening',
        icon: '🥂',
        detail: 'Opulent occasions steeped in candlelit warmth and allure',
        matchedSlugs: ['noir', 'oud-elite'],
      },
      {
        label: 'Sunlit Brunches, Seaside Promenades & High Tea',
        tag: 'daytime',
        icon: '☀️',
        detail: 'Effortless luxury bathed in natural golden hour light',
        matchedSlugs: ['aura', 'eclat'],
      },
      {
        label: 'Executive Presence & High-Stakes Focus',
        tag: 'boardroom',
        icon: '🏛️',
        detail: 'Refined woods and crisp spices projecting poise and gravitas',
        matchedSlugs: ['noir', 'oud-elite'],
      },
      {
        label: 'A Daily Signature Across All Four Seasons',
        tag: 'versatile',
        icon: '🕊️',
        detail: 'Adaptable harmony of citrus, florals, and warm drydown',
        matchedSlugs: ['aura', 'eclat'],
      },
    ],
  },
  {
    id: 4,
    title: 'Which sacred base accord awakens your deepest desire?',
    subtitle: 'Question 4 of 4 · Lingering Base Foundation',
    options: [
      {
        label: 'Aged Agarwood (Oud), Damascus Rose & Birch Smoke',
        tag: 'oud',
        icon: '🌹',
        detail: 'The sovereign crown of Arabian perfumery: smoky, floral, and regal',
        matchedSlugs: ['oud-elite'],
      },
      {
        label: 'Bourbon Vanilla Pod, Roasted Tonka & Mysore Sandalwood',
        tag: 'vanilla',
        icon: '🥃',
        detail: 'Intoxicating golden warmth with smoky black tea and crushed cardamom',
        matchedSlugs: ['noir'],
      },
      {
        label: 'White Velvet Musk, Atlas Cedarwood & Golden Amber',
        tag: 'musk',
        icon: '🌿',
        detail: 'Clean, luminous skin-warmth that lasts seamlessly from dawn to dusk',
        matchedSlugs: ['aura'],
      },
      {
        label: 'Clean Mineral Driftwood, White Amber & Clary Sage',
        tag: 'driftwood',
        icon: '🌊',
        detail: 'Vibrant Mediterranean aromatics evoking crystalline coastal waters',
        matchedSlugs: ['eclat'],
      },
    ],
  },
];

interface CuratedRecommendation {
  product: Product;
  matchScore: number;
  matchPercentage: number;
  badgeLabel: string;
  reason: string;
}

export const ScentProfilerModal: React.FC<ScentProfilerModalProps> = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<QuizOption[]>([]);
  const [curatedList, setCuratedList] = useState<CuratedRecommendation[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [addedItemSlug, setAddedItemSlug] = useState<string | null>(null);

  // Listen to external window trigger event
  useEffect(() => {
    const handleTrigger = () => {
      // open modal if closed
    };
    window.addEventListener('open-scent-quiz', handleTrigger);
    return () => window.removeEventListener('open-scent-quiz', handleTrigger);
  }, []);

  if (!isOpen) return null;

  const handleSelectOption = (option: QuizOption) => {
    const nextChoices = [...selectedChoices, option];
    setSelectedChoices(nextChoices);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate Curated Product List
      calculateCuratedList(nextChoices);
      setIsQuizComplete(true);
    }
  };

  const calculateCuratedList = (choices: QuizOption[]) => {
    // Collect all bottle products (exclude coffret set from base score)
    const singleProducts = PRODUCTS.filter((p) => p.type !== 'Discovery Coffret');

    const scored = singleProducts.map((product) => {
      let score = 0;

      choices.forEach((choice) => {
        if (choice.matchedSlugs.includes(product.slug)) {
          score += 25;
        }
      });

      // Tie-breakers based on category matches
      choices.forEach((choice) => {
        if (choice.detail.toLowerCase().includes(product.name.toLowerCase())) {
          score += 10;
        }
      });

      return { product, score };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    // Calculate match percentages and badges
    const badges = [
      'Primary Signature Match',
      'Evening & Layering Complement',
      'Luminous Daytime Alternate',
    ];

    const reasons = [
      'Flawlessly mirrors your preferred sillage intensity, ambient mood, and sacred base accords.',
      'An exquisite contrasting flacon engineered for evening transitions or sophisticated scent layering.',
      'A fresh, radiant counterpart for sunlit hours and effortless daily wear.',
    ];

    const curated: CuratedRecommendation[] = scored.slice(0, 3).map((item, idx) => {
      // Normalize percentage nicely: top is 96-99%, second is 90-93%, third is 85-88%
      const basePct = 98 - idx * 6;
      const variation = (item.score % 3);
      const matchPercentage = Math.min(99, Math.max(82, basePct - variation));

      return {
        product: item.product,
        matchScore: item.score,
        matchPercentage,
        badgeLabel: badges[idx] || 'Curated Recommendation',
        reason: reasons[idx] || 'Curated by Master Parfumeur based on your style choices.',
      };
    });

    setCuratedList(curated);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedChoices([]);
    setCuratedList([]);
    setIsQuizComplete(false);
    setAddedItemSlug(null);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedItemSlug(product.slug);
    setTimeout(() => {
      setAddedItemSlug(null);
    }, 2500);
  };

  // Find Discovery Set for optional sampler card
  const discoverySet = PRODUCTS.find((p) => p.slug === 'elora-signature-set');

  return (
    <div
      id="discover-scent-quiz-backdrop"
      className="fixed inset-0 z-50 bg-[#08060D]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="discover-scent-quiz-card"
        className="w-full max-w-2xl bg-[#120E1A] border border-white/20 rounded-3xl shadow-2xl relative overflow-hidden text-white my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#181223] relative z-10 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="font-display text-xs tracking-[0.22em] uppercase font-bold text-white">
              DISCOVER YOUR SCENT · ELORA QUIZ
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            aria-label="Close quiz"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-8 overflow-y-auto relative z-10 flex-1">
          {!isQuizComplete ? (
            <div>
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-purple-300/80 mb-2">
                  <span className="font-sans font-medium">
                    Question {currentStep + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <span className="font-sans text-[11px] text-amber-300/90 font-semibold tracking-wider">
                    {Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}% COMPLETE
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 transition-all duration-300 ease-out"
                    style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Heading */}
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-[0.25em] text-purple-300/70 font-sans font-semibold block mb-1">
                  {QUIZ_QUESTIONS[currentStep].subtitle}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium leading-snug">
                  {QUIZ_QUESTIONS[currentStep].title}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt)}
                    className="w-full text-left p-4 rounded-2xl bg-[#1A1327] hover:bg-[#231A33] border border-white/15 hover:border-amber-400/40 transition-all duration-200 flex items-start space-x-3.5 group relative"
                  >
                    <span className="text-2xl mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform">
                      {opt.icon}
                    </span>
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-serif text-base sm:text-lg text-white group-hover:text-amber-200 transition-colors">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-purple-200/70 font-sans mt-0.5 leading-relaxed">
                        {opt.detail}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-300 mt-1.5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Curated Recommendation Results */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Curated Results Header */}
              <div className="text-center pb-2">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/35 text-amber-300 text-xs font-sans uppercase tracking-widest font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated For Your Olfactory Profile</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-medium">
                  Your Personalized Elora Wardrobe
                </h2>
                <p className="text-xs sm:text-sm text-purple-200/70 font-sans max-w-lg mx-auto mt-2 leading-relaxed">
                  Based on your style responses, our master formulation algorithm has curated these high-concentration (25% Extrait) flacons tailored to your skin and presence.
                </p>
              </div>

              {/* Primary Signature Flacon (Hero recommendation) */}
              {curatedList.length > 0 && (
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#211634] to-[#160F24] border border-amber-400/40 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-400 text-[#120E1A] font-sans font-bold text-[10px] uppercase tracking-[0.2em] rounded-bl-2xl shadow-md flex items-center space-x-1">
                    <Award className="w-3 h-3" />
                    <span>{curatedList[0].matchPercentage}% MATCH · PRIMARY SIGNATURE</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5 mt-2">
                    {/* Bottle Visualizer */}
                    <div className="w-36 h-44 sm:w-40 sm:h-48 flex-shrink-0 flex items-center justify-center p-2 rounded-2xl bg-[#140E20]/80 border border-white/10 shadow-inner">
                      <EloraBottleVisualizer product={curatedList[0].product} size="md" showPedestal={false} />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 text-center sm:text-left">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-sans font-semibold">
                        {curatedList[0].product.category}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-white font-semibold mt-0.5">
                        {curatedList[0].product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-purple-100/80 font-serif italic mt-1 leading-relaxed">
                        "{curatedList[0].product.editorialQuote || curatedList[0].product.tagline}"
                      </p>

                      {/* Notes accords */}
                      <div className="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
                        {curatedList[0].product.accords.slice(0, 3).map((accord) => (
                          <span
                            key={accord}
                            className="text-[10px] px-2.5 py-0.5 bg-white/10 border border-white/10 rounded-full text-purple-200 font-sans"
                          >
                            {accord}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between sm:justify-start sm:space-x-4 mt-4 pt-3 border-t border-white/10">
                        <span className="font-sans text-lg font-bold text-white">
                          ₹{curatedList[0].product.price.toLocaleString('en-IN')}
                          <span className="text-xs text-purple-300/60 font-normal ml-1">
                            ({curatedList[0].product.size})
                          </span>
                        </span>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAddToCart(curatedList[0].product)}
                            className="bg-white text-[#120E1A] px-4 py-2 rounded-full font-sans text-xs uppercase tracking-wider font-bold hover:bg-white/95 transition-all shadow flex items-center space-x-1.5"
                          >
                            {addedItemSlug === curatedList[0].product.slug ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add to Bag</span>
                              </>
                            )}
                          </button>
                          <Link
                            to={`/products/${curatedList[0].product.slug}`}
                            onClick={onClose}
                            className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-sans text-purple-200 hover:text-white transition-colors flex items-center space-x-1"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Secondary & Tertiary Curated Matches */}
              <div className="space-y-3">
                <h4 className="font-display text-xs uppercase tracking-[0.2em] text-purple-300/80 font-bold px-1">
                  Complementary Wardrobe Selections
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {curatedList.slice(1).map((item) => (
                    <div
                      key={item.product.id}
                      className="p-4 rounded-2xl bg-[#191225] border border-white/15 hover:border-purple-400/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-purple-200 font-sans font-semibold">
                            {item.badgeLabel}
                          </span>
                          <span className="text-[10px] font-sans font-bold text-amber-300">
                            {item.matchPercentage}% Match
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 my-2">
                          <div className="w-14 h-18 bg-[#120B1C] border border-white/10 rounded-xl p-1 flex-shrink-0 flex items-center justify-center">
                            <EloraBottleVisualizer product={item.product} size="sm" showPedestal={false} />
                          </div>
                          <div>
                            <h5 className="font-serif text-base font-semibold text-white">
                              {item.product.name}
                            </h5>
                            <p className="text-[11px] text-purple-300/70 truncate">
                              {item.product.category}
                            </p>
                            <span className="font-sans text-xs font-semibold text-white block mt-1">
                              ₹{item.product.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-purple-200/70 font-sans leading-relaxed mt-2">
                          {item.reason}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 pt-3 mt-3 border-t border-white/10">
                        <button
                          onClick={() => handleAddToCart(item.product)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-full text-[11px] font-sans uppercase tracking-wider font-semibold transition-colors flex items-center justify-center space-x-1"
                        >
                          {addedItemSlug === item.product.slug ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <ShoppingBag className="w-3 h-3" />
                          )}
                          <span>{addedItemSlug === item.product.slug ? 'Added' : 'Add to Bag'}</span>
                        </button>
                        <Link
                          to={`/products/${item.product.slug}`}
                          onClick={onClose}
                          className="p-2 text-purple-300 hover:text-white transition-colors"
                          aria-label={`View ${item.product.name}`}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete Discovery Coffret Suggestion */}
              {discoverySet && (
                <div className="p-4 rounded-2xl bg-[#171022] border border-white/10 flex items-center justify-between flex-wrap sm:flex-nowrap gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center flex-shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-serif text-sm font-semibold text-white">
                        Sample All Fragrances at Home: {discoverySet.name}
                      </h5>
                      <p className="text-[11px] text-purple-200/70 font-sans">
                        4 × 20ml atomizers in ivory coffret · Includes full purchase rebate voucher
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/products/${discoverySet.slug}`}
                    onClick={onClose}
                    className="text-xs uppercase tracking-wider font-sans text-rose-300 hover:text-white font-semibold underline whitespace-nowrap"
                  >
                    Explore Set (₹{discoverySet.price.toLocaleString('en-IN')})
                  </Link>
                </div>
              )}

              {/* Footer actions */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white text-xs uppercase tracking-wider font-sans flex items-center space-x-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Scent Quiz</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-white text-[#120E1A] text-xs uppercase tracking-widest font-sans font-bold hover:bg-white/95 transition-all shadow"
                >
                  Close & Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
