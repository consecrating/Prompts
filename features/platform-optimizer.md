# Feature 3: Platform Optimizer

## What It Does

Automatically reformats any prompt from this library for the specific AI image generation engine you're using. Each platform has different strengths and interprets prompts differently — the optimizer exploits those differences.

## Platform Profiles

### NanoBanana (Gemini 3 Pro Image / Gemini 3.1 Flash Image)

**Strengths:** Reasoning before generation, precise composition, text rendering, multi-subject scenes, 4K output, reference image support

**Prompt Style:** Descriptive paragraphs. Positive framing (say what you want, not what you don't want). Art-director brief format.

**Optimization Rules:**
- Write as a continuous descriptive paragraph — no bullet points or keyword lists
- Describe spatial relationships explicitly ("to the left of", "behind and above")
- Be specific about quantities ("three people", not "a group")
- Use positive language: "empty street" not "no cars"
- Include intent: "for a magazine cover" or "for a product catalog"
- Specify aspect ratio and resolution explicitly

**Template:**
```
Create a [format/intent] photograph of [detailed subject description]. 
The scene takes place [environment with specific details]. [Lighting 
description with direction and quality]. [Composition and camera details].
[Texture and material specifics]. The overall mood is [mood description].
[Aspect ratio]. [Quality level].
```

---

### ChatGPT (GPT Image / DALL-E)

**Strengths:** Natural language understanding, complex scenes, consistent style application, narrative coherence, human expressions

**Prompt Style:** Conversational with clear intent. Can handle longer prompts well. Benefits from specifying purpose.

**Optimization Rules:**
- Start with what the image IS FOR: "A professional editorial photograph for..."
- Be conversational — write like you're describing it to a talented photographer
- Layer from most important to least important (it may truncate)
- Specify style anchors early: "photorealistic editorial photograph" in the first sentence
- Include emotional direction: "the mood should feel..."
- End with technical specs

**Template:**
```
Create a photorealistic [purpose] image. I need [subject description] in 
[setting]. The feeling should be [emotional direction]. Specifically, I want
[key details in priority order]. The photography style is [reference style]
with [lighting description]. Include [texture/realism details]. Make sure
[critical constraints].
```

---

### Gemini (Google AI Studio / Direct)

**Strengths:** Iterative refinement, color accuracy, atmospheric effects, scientific precision, landscape depth, structured prompts

**Prompt Style:** Structured brief with clear sections. Works well with follow-up refinement.

**Optimization Rules:**
- Structure the prompt with implicit sections (subject, then setting, then light, then mood)
- Be precise about colors (use specific names: "Prussian blue" not just "dark blue")
- Describe atmospheric conditions explicitly (humidity, dust, fog density)
- Leverage iterative refinement — start simpler, add detail in follow-ups
- Scientific accuracy impresses this model — specify species, materials, geography correctly
- Works well with reference to real-world examples

**Template:**
```
Subject: [precise subject description with specifics]
Setting: [environment with geographic/temporal accuracy]
Lighting: [direction, quality, color temperature in Kelvin]
Atmosphere: [weather, particles, visibility]
Composition: [lens, angle, framing]
Color palette: [specific named colors and relationships]
Mood: [emotional and tonal direction]
Quality: [output specifications]
```

---

### Grok (xAI Image Generation)

**Strengths:** Dramatic lighting, cinematic quality, bold color, dynamic energy, expressive mood, creative interpretation

**Prompt Style:** Cinematic scene description. Responds well to film references and dramatic language.

**Optimization Rules:**
- Use cinematic and dramatic language — "sweeping", "explosive", "intimate"
- Reference film aesthetics and visual genres
- Emphasize contrast and drama in lighting descriptions
- Allow more creative interpretation — slightly less rigid specification
- Describe the ENERGY of the scene, not just its contents
- Color should be bold and intentional

**Template:**
```
[Dramatic opening line establishing mood/energy]. [Subject with attitude 
and intention, not just appearance]. The setting is [environment described 
cinematically]. [Lighting described as storytelling tool — what it reveals 
and what it hides]. [Color and contrast as emotional language]. [Camera 
described as narrative device]. The image should feel like [film/genre 
reference].
```

---

## Quick Conversion Examples

### Original Prompt (from library):
> A 36-year-old West African jazz pianist at weathered upright piano in dim club. Midnight-blue velvet blazer worn at elbows, open-collar white shirt. Single amber spotlight creates chiaroscuro. Dark skin with natural variation — lighter knuckles, deeper cheek hollows. Thin perspiration sheen at temples. Long fingers on ivory keys, nails trimmed for playing.

### → Optimized for NanoBanana:
> Create a photorealistic editorial portrait photograph of a 36-year-old West African male jazz pianist seated at a weathered upright piano in a dimly lit jazz club. He wears a midnight-blue velvet blazer showing wear at the elbows with an open-collar white shirt beneath. A single amber spotlight from above-left creates dramatic chiaroscuro lighting with deep shadows. His dark skin shows natural tonal variation with lighter knuckles and deeper color in cheek hollows, and visible perspiration at his temples. His long fingers rest on ivory piano keys with nails trimmed short for playing. The piano's lacquer shows years of honest wear. 50mm lens, f/1.8 aperture, shallow depth of field. 16:9 aspect ratio at 4K resolution.

### → Optimized for ChatGPT:
> Create a photorealistic portrait photograph for a jazz magazine feature. I need a 36-year-old West African jazz pianist at his piano in a dim club. The feeling should be intimate and contemplative — a private moment of musical meditation. He's wearing a midnight-blue velvet blazer that shows its age at the elbows, open white shirt. The most important element is the chiaroscuro lighting: one amber spotlight creating dramatic shadows that sculpt his features. His skin should look real — natural variation, slight sheen of perspiration at the temples, visible pores. His long pianist's fingers on the ivory keys tell a story. The piano behind him is weathered and loved. Make sure the image has no AI smoothness — I want real textures, imperfect surfaces, and honest lighting physics.

### → Optimized for Gemini:
> Subject: 36-year-old West African male jazz pianist, midnight-blue velvet blazer with elbow wear, open-collar white cotton shirt, long-fingered hands on piano keys  
> Setting: Intimate jazz club interior, weathered upright piano with aged lacquer showing wear patterns  
> Lighting: Single amber-warm spotlight (approx 2700K) from 45 degrees above-left, creating Rembrandt-style chiaroscuro with 8:1 contrast ratio, deep shadows on camera-right  
> Atmosphere: Dim ambient, slight haze suggesting intimate venue  
> Composition: 50mm f/1.8, medium close-up, piano keys providing leading lines, shallow DOF  
> Color palette: Deep navy velvet, warm amber highlight, neutral ivory keys, rich brown skin tones  
> Mood: Contemplative, intimate, musical meditation between sets  
> Quality: Photorealistic, editorial publication standard

### → Optimized for Grok:
> A moment stolen between jazz sets — the kind of photograph that makes you hear the music. A West African pianist, late thirties, sits alone at a piano that has lived as many nights as he has. Midnight velvet blazer catching amber light like the last note of a ballad. One spotlight from above cuts through the club dark like a confession, leaving half his face in shadow deep enough to hide secrets. Sweat at his temples from playing. Fingers draped across ivory keys with the casual authority of ten thousand hours. The chiaroscuro is absolute: golden light, infinite shadow. This image should feel like a smoke-filled Dexter Gordon album cover from Blue Note's golden era, but shot today.

---

## Auto-Install for Your Platform

See `features/api-connector.md` for how to connect this library directly to your preferred platform and generate images with one command.
