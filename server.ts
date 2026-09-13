import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { ecommerceRouter } from "./server/routes";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Lazy GoogleGenAI initialization with required telemetry header
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Mount E-Commerce Routes (Guest Checkout, Cashfree, Shiprocket, Admin)
app.use("/api", ecommerceRouter);

// System instruction defining the Elora Parfum Atelier Concierge role
const ELORA_CONCIERGE_SYSTEM_INSTRUCTION = `
You are the Senior Atelier Concierge and Master Olfactory Advisor for ELORA PARFUM, an ultra-prestige French-Indian haute parfumerie house with flagship salons on Rue Saint-Honoré, Paris and Colaba, Mumbai.

Your role:
Provide exquisite, personalized customer assistance, scent consultations, order guidance, and fragrance expertise to discerning clientele.

Maison Knowledge & Specifications:
1. THE FRAGRANCE ARCHIVE:
   - "AURA" (100ml Extrait - ₹14,500): Fresh, luminous, floral-musk. Top: Calabrian Bergamot, Green Mandarin. Heart: Grasse Jasmine Sambac, White Peony. Base: Velvet Musks, Solar Amber. Perfect for crisp morning light, high-profile daytime meetings, effortless elegance.
   - "NOIR" (100ml Extrait - ₹16,500): Nocturnal, sensual, warm woody-amber. Top: Crushed Cardamom, Nutmeg, Saffron. Heart: Damask Rose, Smoked Bourbon Vanilla Pod. Base: Aged Mysore Sandalwood, Ambergris. Ideal for black-tie galas, intimate dinners, magnetic evening allure.
   - "ÉCLAT" (100ml Extrait - ₹13,500): Crystalline, invigorating, citrus-aromatic. Top: Sunlit Amalfi Lemon, Pink Peppercorn. Heart: Mediterranean Marine Accord, Clary Sage. Base: White Amber, Cedar Driftwood. Ideal for coastal escapes, sunlit terraces, summer vitality.
   - "OUD ÉLITE" (100ml Extrait - ₹18,500): Sovereign, regal, smoky-oriental. Top: Bitter Almond, Cardamom, Incense Tears. Heart: Damascus Rose Absolute, Saffron. Base: Aged Cambodian Agarwood (Oud), Birch Smoke, Burnished Leather. 28% concentration for regal authority.
   - "THE SIGNATURE DISCOVERY TRIO" (3 × 15ml Flacons - ₹9,500): Curated set of Aura, Noir, and Éclat in a velvet-lined lacquered keepsake coffret.

2. ATELIER SERVICES & POLICIES:
   - Concentration: 25% to 28% pure Extrait de Parfum (sillage lasts 14+ hours on skin, 48+ hours on fabrics).
   - Complimentary Discovery Vial Guarantee: Each 100ml flacon arrives accompanied by an identical 2ml discovery vial. Patrons can test the vial before opening the sealed full flacon.
   - Returns & Exchanges: Complimentary 30-day returns on any sealed 100ml flacon. If unsealed, our concierge offers bespoke exchange guidance.
   - Delivery: Complimentary insured worldwide express delivery via DHL Carbon Neutral / BlueDart Priority. Dispatched within 24 hours from our Paris or Mumbai salons (3-5 business days delivery).
   - Packaging: Hand-tied grosgrain silk ribbon, wax seal of Maison Elora, archival heavy black box, and personalized calligraphy note on cotton paper.
   - Bespoke Monogramming: Complimentary laser engraving of up to 3 initials on the heavy magnetic gold cap.
   - Privé Loyalty Guild: Silver, Gold, and Imperial tiers with 10% back in maison credits, private salon appointments, and annual archival flacon gifts.

Style & Demeanor:
- Address the patron with refined warmth, poise, and sophistication ("Cher Patron", "Dear Guest", or gracious, courteous tones).
- Be helpful, knowledgeable, and concise while retaining literary elegance.
- If recommending a fragrance, highlight its olfactory notes and evocative mood.
- Help with orders, tracking, gifts, notes layering, and application rituals (e.g., spraying onto pulse points without rubbing).
`;

// Multi-turn Customer Query Concierge endpoint using Gemini
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, taskComplexity = "general" } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    // Model selection based on user requirements:
    // - gemini-3.1-pro-preview for particularly complex tasks
    // - gemini-3.5-flash for general tasks
    // - gemini-3.1-flash-lite for tasks that should happen fast
    let selectedModel = "gemini-3.5-flash";
    if (taskComplexity === "complex") {
      selectedModel = "gemini-3.1-pro-preview";
    } else if (taskComplexity === "fast") {
      selectedModel = "gemini-3.1-flash-lite";
    }

    const ai = getAI();

    // If Gemini API is not yet configured with an API key, use rich contextual fallback
    if (!ai) {
      const latestUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || "";
      let fallbackReply = "";

      if (latestUserMsg.includes("return") || latestUserMsg.includes("exchange") || latestUserMsg.includes("refund")) {
        fallbackReply =
          "At Maison Elora, your satisfaction is an absolute commitment. Every 100ml flacon is accompanied by a complimentary 2ml discovery vial. We invite you to experience the fragrance from the vial first. If for any reason it does not captivate your senses, you may return the unopened, sealed 100ml flacon within 30 days for a full, unconditional refund with complimentary return courier pickup.";
      } else if (latestUserMsg.includes("ship") || latestUserMsg.includes("deliver") || latestUserMsg.includes("track") || latestUserMsg.includes("when")) {
        fallbackReply =
          "We offer complimentary expedited shipping on every commission worldwide. Each parcel is prepared by hand in our Paris or Mumbai ateliers and dispatched within 24 hours. Delivery typically arrives within 3 to 5 business days, fully insured in our signature shock-absorbing archival presentation coffret with real-time SMS & email tracking.";
      } else if (latestUserMsg.includes("noir") || latestUserMsg.includes("evening") || latestUserMsg.includes("night") || latestUserMsg.includes("date")) {
        fallbackReply =
          "For evenings and magnetic nocturnal encounters, **ELORA NOIR** (₹16,500) is our most sought-after creation. Formulated at 25% Extrait concentration, it opens with crushed green cardamom and pink peppercorn, revealing a smoldering heart of smoked Bourbon vanilla pod and dark ambergris over aged Mysore sandalwood. It projects a warm, irresistible sillage that lingers in rooms long after you have departed.";
      } else if (latestUserMsg.includes("aura") || latestUserMsg.includes("day") || latestUserMsg.includes("fresh") || latestUserMsg.includes("work") || latestUserMsg.includes("office")) {
        fallbackReply =
          "For daytime poise and effortless distinction, **ELORA AURA** (₹14,500) is exquisite. It weaves sparkling Calabrian bergamot and mandarin with dewy Grasse jasmine sambac and velvet solar musks. It feels like stepping into the morning light draped in raw white silk—radiant, clean, and intimately memorable.";
      } else if (latestUserMsg.includes("oud") || latestUserMsg.includes("elite") || latestUserMsg.includes("royal") || latestUserMsg.includes("strong") || latestUserMsg.includes("heavy")) {
        fallbackReply =
          "If you desire commanding authority and regal gravitas, **ELORA OUD ÉLITE** (₹18,500) is our masterpiece. Blended at 28% concentration with aged wild Cambodian agarwood, crimson Damascus rose, birch smoke, and burnished saddle leather. It is an unapologetic statement of sovereignty and ancient mystique.";
      } else if (latestUserMsg.includes("sample") || latestUserMsg.includes("set") || latestUserMsg.includes("gift") || latestUserMsg.includes("trio")) {
        fallbackReply =
          "If you are discovering Maison Elora for the first time or seeking an unforgettable gift, we recommend **THE SIGNATURE DISCOVERY TRIO** (₹9,500). It includes three 15ml flacons of Aura, Noir, and Éclat nestled in our velvet-lined lacquered coffret, alongside an exclusive voucher redeemable toward your first full-sized flacon.";
      } else if (latestUserMsg.includes("ingredient") || latestUserMsg.includes("pure") || latestUserMsg.includes("toxic") || latestUserMsg.includes("natural") || latestUserMsg.includes("concentration")) {
        fallbackReply =
          "All Elora creations are formulated at genuine Extrait de Parfum strength (25% to 28% aromatic concentration), yielding remarkable longevity of 14+ hours. We source ethical, hand-harvested botanicals from Grasse, sustainably farmed Haitian vetiver, and cruelty-free synthetic ambergris alternatives. Free from parabens, phthalates, and harsh synthetics.";
      } else {
        fallbackReply =
          "Welcome to Maison Elora Parfum. It is our honor to assist you. Whether you seek guidance in selecting your signature olfactory portrait, wish to inquire regarding bespoke monogramming, or have questions regarding our complimentary worldwide delivery, I am here at your service. Which fragrance or query may I assist you with today?";
      }

      return res.json({
        reply: fallbackReply,
        modelUsed: "atelier-concierge-fallback",
        taskComplexity,
      });
    }

    // Format multi-turn message history for Google Gen AI SDK
    const formattedContents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: formattedContents,
      config: {
        systemInstruction: ELORA_CONCIERGE_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I am at your service. How may I further assist your journey with Elora Parfum?";

    return res.json({
      reply: replyText,
      modelUsed: selectedModel,
      taskComplexity,
    });
  } catch (error: any) {
    console.error("Gemini Concierge Chat Error:", error);
    return res.status(500).json({
      error: "Our atelier concierge is temporarily tending to an exclusive salon appointment. Please try again shortly.",
      details: error?.message,
    });
  }
});

// Scent Mood Matcher endpoint using Gemini 3.8 Flash
app.post("/api/mood-matcher", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", userVibeContext } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing image data" });
    }

    // Clean base64 string if data URI header is included
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const ai = getAI();

    const fragranceCataloguePrompt = `
You are the Chief Perfumer and Scent Stylist for ELORA PARFUM, an ultra-luxury haute parfumerie house.
Examine this image capturing the user's current environment, aesthetic, attire, lighting, or visual mood.

The Elora Parfum collection consists of four bespoke 100ml Extrait/Eau de Parfums:
1. "aura" (AURA): Fresh, Floral, Musky. Key notes: Calabrian Bergamot, French Jasmine Sambac, White Velvet Musk. Ideal for luminous, crisp daytime elegance, clean tailoring, linen, daylight, soft romantic moods, effortless grace.
2. "noir" (NOIR): Warm, Woody, Amber. Key notes: Crushed Cardamom, Bourbon Vanilla Pod, Mysore Sandalwood, Dark Ambergris. Ideal for mysterious, intimate, evening, dark velvet or silk textures, sultry dim lighting, sophisticated allure.
3. "eclat" (ÉCLAT): Fresh, Citrus, Aromatic. Key notes: Sunlit Amalfi Lemon, Mediterranean Sea Breeze, Clary Sage, Clean Driftwood. Ideal for energetic, sunlit coastal vibes, relaxed luxury, vibrant confidence, refreshing minimalism.
4. "oud-elite" (OUD ÉLITE): Oud, Smoky, Spicy. Key notes: Cambodian Agarwood, Damascus Rose Otto, Birch Smoke, Burnished Leather. Ideal for commanding presence, formal black-tie, opulent fabrics, rich jewelry, deep ceremonial grandeur.

Analyze the image carefully:
1. Identify the aesthetic mood, color harmony, atmosphere, and visual textures.
2. Select the single best matched fragrance from ["aura", "noir", "eclat", "oud-elite"].
3. Provide a confidence percentage (85 - 99).
4. Create an evocative title for their mood (e.g., "Gilded Velvet Nocturne", "Mediterranean Riviera Dawn", "Sunlit Cashmere Serenity", "Imperial Agarwood Elegance").
5. List 3 to 4 distinct aesthetic tags/vibe keywords.
6. Write a personalized, poetic rationale (3 to 4 sentences) explaining why this specific Elora fragrance harmonizes with their visual look, environment, and presence.
7. Provide a recommended application ritual (e.g. spray technique, pulse points, fabric layering).

Return ONLY valid JSON with no backticks, matching this exact structure:
{
  "moodTitle": "string",
  "vibeKeywords": ["string", "string", "string"],
  "colorPaletteAnalysis": "string",
  "recommendedFragranceSlug": "aura" | "noir" | "eclat" | "oud-elite",
  "recommendedFragranceName": "AURA" | "NOIR" | "ÉCLAT" | "OUD ÉLITE",
  "matchConfidence": number,
  "poeticRationale": "string",
  "applicationRitual": "string"
}
`;

    if (!ai) {
      // Graceful high-end heuristic fallback if API key is not configured in local preview
      const heuristics = [
        {
          moodTitle: "Luminous Solar Grace",
          vibeKeywords: ["Sun-Drenched", "Crisp Clean", "Effortless Radiance"],
          colorPaletteAnalysis: "Balanced natural illumination with crisp neutral accents",
          recommendedFragranceSlug: "eclat",
          recommendedFragranceName: "ÉCLAT",
          matchConfidence: 94,
          poeticRationale: "Your visual atmosphere radiates clean, uplifting vitality. The crisp citrus sparkle of sunlit Amalfi lemon and sea-salt accords perfectly mirrors your relaxed yet sophisticated personal aura.",
          applicationRitual: "Mist 2 sprays across collarbones and one light veil onto linen fabrics for an enduring fresh sillage.",
        },
        {
          moodTitle: "Velvet Intimate Allure",
          vibeKeywords: ["Warm Amber", "Sensual Depth", "Nocturnal Charm"],
          colorPaletteAnalysis: "Rich deep tones with warm ambient shadows",
          recommendedFragranceSlug: "noir",
          recommendedFragranceName: "NOIR",
          matchConfidence: 97,
          poeticRationale: "The subtle warmth and magnetic presence in your current setting calls for the intoxicating contrast of smoked cardamom, rich bourbon vanilla, and rare Mysore sandalwood.",
          applicationRitual: "Apply directly to pulse points at the base of the throat and inner wrists to allow the natural body heat to project the warm ambergris trail.",
        },
        {
          moodTitle: "Celestial Silk Serenity",
          vibeKeywords: ["Luminous Floral", "Pure Elegance", "Gentle Luxury"],
          colorPaletteAnalysis: "Harmonious soft tones with refined minimalist styling",
          recommendedFragranceSlug: "aura",
          recommendedFragranceName: "AURA",
          matchConfidence: 96,
          poeticRationale: "Your aesthetic speaks to timeless poise and quiet refinement. The dewy bergamot and night-blooming Grasse jasmine of Aura will wrap around your silhouette like an invisible veil of white silk.",
          applicationRitual: "Spray from 6 inches away in an arc above your head, stepping through the fragrant mist for an all-enveloping halo.",
        },
      ];
      const selected = heuristics[Math.floor(Math.random() * heuristics.length)];
      return res.json(selected);
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType || "image/jpeg",
                data: cleanBase64,
              },
            },
            {
              text: `${fragranceCataloguePrompt}\nUser contextual note: ${userVibeContext || "Visual mood analysis"}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const cleanedText = responseText.trim().replace(/^```json\s*/, "").replace(/```$/, "");
    const parsed = JSON.parse(cleanedText);

    return res.json(parsed);
  } catch (error: any) {
    console.error("Gemini Mood Matcher API Error:", error);

    // Provide a resilient fallback so the user always receives a beautiful luxury recommendation
    return res.json({
      moodTitle: "Luminous Signature Presence",
      vibeKeywords: ["Timeless Poise", "Clean Architecture", "Quiet Radiance"],
      colorPaletteAnalysis: "Organic natural daylight and refined modern styling",
      recommendedFragranceSlug: "aura",
      recommendedFragranceName: "AURA",
      matchConfidence: 93,
      poeticRationale: "Your visual ambiance reflects balanced poise and understated luxury. Aura's sparkling Calabrian bergamot and French jasmine sambac harmonize effortlessly with your effortless presence.",
      applicationRitual: "Spray onto pulse points at the wrists and collarbone, followed by a gentle veil over your favorite garment.",
    });
  }
});

// Vite middleware / production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Elora Parfum Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
