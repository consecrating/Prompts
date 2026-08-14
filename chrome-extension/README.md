# Mysha Chrome Extension — ChatGPT Image Fixer

**Forces ChatGPT to generate images in your chosen aspect ratio (default: 4:5 for Instagram) and fixes the 5 most common image generation failures.**

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Edge%20%7C%20Brave-blue)

---

## What It Does

When you send a message to ChatGPT that looks like an image generation request, this extension **automatically injects** the Mysha fix rules before your prompt reaches ChatGPT. You see a small notification confirming the injection.

### Fixes Applied:
| Problem | Fix |
|---|---|
| Wrong ratio (generates square instead of 4:5) | Forces exact pixel dimensions |
| Tiny unreadable text | Demands billboard-size text |
| Dark text on dark background | Enforces maximum contrast |
| Overstuffed messy layouts | Hard limits element count + whitespace |
| Generic office buildings | Explicit ban with alternative |
| ChatGPT rewrites your prompt | Suppresses internal enhancement |

### Ratio Options:
- **4:5** (1080×1350) — Instagram Post ← default
- **9:16** (1080×1920) — Instagram Story / Reels
- **1:1** (1080×1080) — Square
- **16:9** (1920×1080) — YouTube / Landscape

---

## Install (Developer Mode)

Since this isn't on the Chrome Web Store yet, install manually:

1. **Download** this `chrome-extension/` folder (or clone the repo)
2. Open Chrome → `chrome://extensions/`
3. Enable **"Developer mode"** (top right toggle)
4. Click **"Load unpacked"**
5. Select the `chrome-extension/` folder
6. Done — you'll see the 🕷️ Mysha icon in your toolbar

### Works on:
- Google Chrome
- Microsoft Edge (same install process via `edge://extensions/`)
- Brave Browser
- Any Chromium-based browser

---

## How to Use

1. **Install the extension** (steps above)
2. **Go to ChatGPT** (chatgpt.com or chat.openai.com)
3. **Type any image request** — e.g., "Create a poster for Diwali"
4. **The extension detects** it's an image request and auto-injects the fix rules
5. **You see a notification:** "🕷️ Mysha: 4:5 ratio enforced"
6. **ChatGPT generates** at the correct ratio with readable text

### You DON'T need to:
- Paste any prefix manually
- Remember the ratio dimensions
- Type the fix rules yourself
- Do anything different from normal ChatGPT use

---

## Settings (Click the Extension Icon)

| Setting | Default | What it does |
|---|---|---|
| Extension Active | ✅ ON | Master on/off switch |
| Aspect Ratio | 4:5 | Which ratio to enforce |
| Fix tiny text | ✅ ON | Forces large readable text |
| Fix contrast | ✅ ON | Prevents dark-on-dark |
| Fix clutter | ✅ ON | Limits elements + enforces whitespace |
| Block buildings | ✅ ON | Removes generic corporate imagery |
| Stop prompt rewriting | ✅ ON | ChatGPT follows your words literally |
| Auto-activate Mysha | ✅ ON | Enables full Mysha prompt style |

---

## How Detection Works

The extension looks for **image-generation intent** in your message. It triggers when it sees combinations of words like:

- "generate" + "image/photo/poster/banner"
- "create" + "design/illustration/portrait"
- "instagram post"
- "youtube thumbnail"
- "make a poster"

If your message is just a text question (no image intent), **the extension does nothing** — your normal ChatGPT experience is unchanged.

---

## Icons

The extension needs icon files. For now, create simple icons or use any 🕷️ spider icon:

- `icons/icon16.png` — 16×16 px
- `icons/icon48.png` — 48×48 px
- `icons/icon128.png` — 128×128 px

You can generate these using ChatGPT itself:
> "Create a minimal spider icon in neon green on dark background, flat design, [16/48/128]px square, transparent background PNG"

---

## Privacy

- **No data collected** — everything runs locally in your browser
- **No external servers** — the extension never makes network requests
- **No tracking** — no analytics, no telemetry
- Only active on chatgpt.com and chat.openai.com
- Your prompts are modified **locally** before being sent (same as if you typed the prefix yourself)

---

## Limitations

- Cannot guarantee ChatGPT will always respect the ratio — but success rate improves from ~30% to ~80%
- Text rendering in AI images remains imperfect across all platforms
- The extension detects image intent via keywords — very unusual phrasings might not trigger it
- If ChatGPT changes its DOM structure significantly, the injection might need updating

---

## Source

Part of the [Mysha Prompt Engineering System](https://github.com/consecrating/Prompts)
