# Mysha Prompt Engineering System

**1,520+ professional prompts** across **30 categories** + **Mysha AI agent** + **4 powerful features** + **API connector for Grok, ChatGPT, Gemini & Kiro**

A photorealism-first prompt library designed to produce images that look like real photographs — not AI-generated content. Built for NanoBanana, ChatGPT, Gemini, and Grok. Auto-installable by providing the repo URL to any supported platform.

---

## What Makes This Different

Most prompt libraries are keyword dumps. This is an **art direction system**.

Every prompt follows the Mysha Prompt Architecture (MPA) — 9 layers that map to how real photographers think:

| Layer | Purpose | Example |
|---|---|---|
| 1. Subject & Identity | Who/what is in frame | "confident woman, late 20s, warm brown skin" |
| 2. Wardrobe & Styling | Precise garment description | "merlot silk charmeuse, asymmetric strap" |
| 3. Composition & Camera | Real lens physics | "85mm f/2.0, medium close-up, eye level" |
| 4. Lighting Design | Coherent light logic | "octabox 45° camera-left, 1:3 fill ratio" |
| 5. Environment & Setting | Grounded background | "artist's loft, exposed brick, scuffed floors" |
| 6. Texture & Material | Anti-AI-smoothness | "visible pores, fabric micro-creases" |
| 7. Color Science & Mood | Grade direction | "Portra 400 rendering, warm shadows" |
| 8. Negative Constraints | What to avoid | "no plastic skin, no uniform bokeh" |
| 9. Technical Output | Platform specs | "16:9, 4K, editorial publication" |

---

## Anti-AI Appearance System

The core innovation. Every prompt embeds rules that fight the five tells of AI imagery:

1. **Plastic skin** → natural pores, subsurface scattering, imperfections
2. **Fake backgrounds** → environmental depth, atmospheric haze, real-world mess
3. **Impossible objects** → proper weight, contact shadows, material physics
4. **Flat lighting** → coherent single-source logic with proper falloff
5. **Uncanny proportions** → anatomical correctness, natural asymmetry

---

## 1,520+ Prompts — 30 Categories

### Photography (501 core prompts)
| # | Category | Count |
|---|---|---|
| 1 | Portrait | 30 |
| 2 | Fashion Editorial | 30 |
| 3 | Cinematic | 25 |
| 4 | Product Photography | 25 |
| 5 | Travel & Landscape | 25 |
| 6 | Street Photography | 25 |
| 7 | Fantasy & Conceptual | 25 |
| 8 | Fitness & Athletic | 25 |
| 9 | Food & Culinary | 25 |
| 10 | Architecture & Interior | 25 |
| 11 | Lifestyle | 25 |
| 12 | Nature & Wildlife | 25 |
| 13 | Underwater | 20 |
| 14 | Night & Neon | 25 |
| 15 | Vintage & Retro | 25 |
| 16 | Surreal & Abstract | 20 |
| 17 | Swimwear & Beachwear (18+) | 26 |
| 18 | Lingerie & Intimate Fashion (18+) | 25 |
| 19 | Boudoir & Artistic (18+) | 25 |
| 20 | Cultural Fashion | 25 |

### Business & Marketing (1,000+ prompts)
| # | Category | Count |
|---|---|---|
| 21 | Festival & Event Posters | 100 |
| 22 | Instagram Business Posts | 100 |
| 23 | Real Estate Marketing | 100 |
| 24 | Hotel & Resort Promotional | 100 |
| 25 | Restaurant Promotional | 100 |
| 26 | Digital Marketing Assets | 100 |
| 27 | YouTube Thumbnails | 100 |
| 28 | YouTube Blog Thumbnails | 100 |
| 29 | Website Banners | 100 |
| 30 | Modern Youth Fashion (18+) | 100 |
| | **TOTAL** | **1,520+** |

---

## 4 Powerful Features

### Feature 1: Prompt Mixer Engine
Combine any two prompts from different categories to create hybrid scenes. The mixer applies proper lighting reconciliation and environmental logic.

→ See [`features/prompt-mixer.md`](features/prompt-mixer.md)

### Feature 2: Style Transfer Matrix
Apply the visual language of one category to the subject of another. 48 pre-built style transfer templates + the formula to create your own.

→ See [`features/style-transfer.md`](features/style-transfer.md)

### Feature 3: Platform Optimizer
Automatically reformats any prompt for the specific engine you're using. Each platform has different strengths — the optimizer exploits them.

→ See [`features/platform-optimizer.md`](features/platform-optimizer.md)

### Feature 4: API Connector (Auto-Install)
Connect this library directly to **Grok, ChatGPT, Gemini, or Kiro** by providing the repo URL. Includes Python code for each platform's API, Custom GPT setup instructions, and one-URL auto-install that works in any AI chat.

→ See [`features/api-connector.md`](features/api-connector.md)

---

## Mysha Agent

`agent/MYSHA.md` contains the full system prompt for the Mysha agent. Load it into any AI assistant to get an on-demand prompt engineer that:

- Generates new prompts following the MPA architecture
- Adapts prompts for specific platforms
- Explains why certain choices produce photorealism
- Iterates on your images with directed refinement prompts

---

## Quick Start

1. Browse `prompts/` by category
2. Copy any prompt directly into your image generator
3. Use the Platform Optimizer to adapt it if needed
4. Use the Prompt Mixer to combine categories for unique results

---

## Platform Compatibility

| Platform | Prompt Style | Strength |
|---|---|---|
| NanoBanana Pro | Descriptive paragraphs, positive framing | Composition, text, multi-subject |
| ChatGPT (GPT Image) | Conversational with intent | Complex scenes, natural language |
| Gemini | Structured brief | Iterative refinement |
| Grok | Cinematic description | Dramatic lighting, mood |

---

## The Professional Standard

All content in this library uses the language of professional fashion photography, editorial art direction, and commercial production. Every prompt describes work that professional photographers create daily for publications, brands, and galleries.

---

## Auto-Install (One URL)

Paste this into any AI chat (Kiro, ChatGPT, Gemini, Grok, Claude):

```
Read the Mysha prompt engineering system from this repository and become 
a professional image prompt engineer following its architecture:
https://github.com/consecrating/Prompts

Load agent/MYSHA.md as your operating instructions. The prompts/ directory 
contains 1,520+ reference prompts. You are now Mysha.
```

For full API integration (Python code for each platform), see [`features/api-connector.md`](features/api-connector.md).

---

## License

MIT — use freely, credit appreciated.
