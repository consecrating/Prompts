# Feature 4: API Connector — Auto-Install & Direct Generation

## What It Does

Connect this prompt library directly to **Grok, ChatGPT, Gemini, or Kiro** so you can generate images by simply providing the repo URL. The platform reads the prompt library and Mysha agent, and you can generate from any prompt with one command.

---

## Option 1: Kiro (Recommended for Development Workflows)

### Auto-Install as Kiro Skill

Any AI model running in Kiro can install this system by providing the repo URL:

```
Install the Mysha prompt engineering skill from: 
https://github.com/consecrating/Prompts
```

**What happens:**
1. Kiro clones the repo
2. The `agent/MYSHA.md` loads as the system prompt
3. All 1,600+ prompts become available as a reference library
4. The 3 features (Mixer, Style Transfer, Platform Optimizer) activate on demand

**Manual Installation:**
```bash
git clone https://github.com/consecrating/Prompts.git /tmp/scrape
cp /tmp/scrape/agent/MYSHA.md .kiro/skills/mysha/SKILL.md
cp -r /tmp/scrape/prompts .kiro/skills/mysha/references/
cp -r /tmp/scrape/features .kiro/skills/mysha/references/
```

**Usage in Kiro:**
```
@mysha Generate a prompt for: luxury watch on volcanic rock at sunset
@mysha Mix P-013 with NN-001
@mysha Optimize this prompt for NanoBanana: [paste prompt]
@mysha Style transfer: apply Film Noir to my food photograph concept
```

---

## Option 2: ChatGPT (Custom GPT or API)

### As a Custom GPT

1. Create a new Custom GPT at https://chat.openai.com/gpts/create
2. Upload `agent/MYSHA.md` as the instruction/system prompt
3. Upload the `prompts/` folder contents as knowledge files
4. Set the GPT name to "Mysha — Prompt Engineer"

### Via API (Python)

```python
import openai
import json

# Load Mysha system prompt
with open("agent/MYSHA.md") as f:
    mysha_system = f.read()

# Load prompt library as context
def load_category(category):
    with open(f"prompts/{category}/prompts.md") as f:
        return f.read()

client = openai.OpenAI()

def generate_with_mysha(user_request, category=None):
    messages = [{"role": "system", "content": mysha_system}]
    
    if category:
        messages.append({
            "role": "system", 
            "content": f"Reference prompts:\n{load_category(category)}"
        })
    
    messages.append({"role": "user", "content": user_request})
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )
    return response.choices[0].message.content

# Generate a prompt
prompt = generate_with_mysha(
    "Create a portrait prompt for a 30-year-old chef in her restaurant kitchen",
    category="portrait"
)

# Then generate the image
image_response = client.images.generate(
    model="dall-e-3",
    prompt=prompt,
    size="1792x1024",
    quality="hd"
)
print(image_response.data[0].url)
```

---

## Option 3: Gemini / NanoBanana (Google AI Studio or API)

### Via Google AI Studio
1. Open https://aistudio.google.com
2. In System Instructions, paste `agent/MYSHA.md`
3. Attach prompt files as context
4. Select Gemini 2.0 Flash Image or Gemini 2.0 Pro Image model
5. Ask Mysha to generate a prompt, then generate the image in-context

### Via API (Python)

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")

# Load Mysha
with open("agent/MYSHA.md") as f:
    mysha_system = f.read()

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    system_instruction=mysha_system
)

# Step 1: Generate optimized prompt
chat = model.start_chat()
response = chat.send_message(
    "Generate a NanoBanana-optimized prompt for: luxury perfume bottle on marble at golden hour"
)
optimized_prompt = response.text

# Step 2: Generate image with Imagen/NanoBanana
imagen_model = genai.ImageGenerationModel("imagen-3.0-generate-002")
result = imagen_model.generate_images(
    prompt=optimized_prompt,
    number_of_images=1,
    aspect_ratio="16:9"
)
result.images[0].save("output.png")
```

---

## Option 4: Grok (xAI API)

### Via API (Python)

```python
import requests
import json

XAI_API_KEY = "YOUR_XAI_API_KEY"

with open("agent/MYSHA.md") as f:
    mysha_system = f.read()

# Step 1: Generate Grok-optimized prompt via Grok text
headers = {
    "Authorization": f"Bearer {XAI_API_KEY}",
    "Content-Type": "application/json"
}

response = requests.post(
    "https://api.x.ai/v1/chat/completions",
    headers=headers,
    json={
        "model": "grok-2",
        "messages": [
            {"role": "system", "content": mysha_system},
            {"role": "user", "content": "Generate a Grok-optimized cinematic prompt for: noir detective in rain"}
        ]
    }
)
optimized_prompt = response.json()["choices"][0]["message"]["content"]

# Step 2: Generate image with Grok's image model
image_response = requests.post(
    "https://api.x.ai/v1/images/generations",
    headers=headers,
    json={
        "model": "grok-2-image",
        "prompt": optimized_prompt,
        "n": 1
    }
)
# Save the generated image
```

---

## Option 5: One-URL Auto-Install (Any Platform)

Simply paste this in any AI chat (Kiro, ChatGPT, Gemini, Grok, Claude):

```
Read the Mysha prompt engineering system from this repository and become 
a professional image prompt engineer following its architecture:
https://github.com/consecrating/Prompts

Load the agent/MYSHA.md file as your operating instructions.
The prompts/ directory contains 1,600+ reference prompts across 30 categories.
The features/ directory contains 4 powerful tools: Prompt Mixer, Style Transfer, 
Platform Optimizer, and this API Connector.

You are now Mysha. Generate prompts using the 9-layer Mysha Prompt Architecture 
with anti-AI-appearance rules embedded in every output.
```

This works because:
- The repo is public on GitHub
- All platforms can fetch and read markdown from URLs
- The Mysha system prompt is self-contained
- No API keys needed for the prompt generation (only for image generation)

---

## Environment Variables for Automation

```bash
export OPENAI_API_KEY="sk-..."        # ChatGPT/DALL-E
export GOOGLE_AI_KEY="..."             # Gemini/NanoBanana
export XAI_API_KEY="..."               # Grok
export MYSHA_REPO="https://github.com/consecrating/Prompts"
```

---

## Quick Reference: Which Platform for What

| Need | Best Platform | Why |
|---|---|---|
| Photorealistic portrait | NanoBanana | Superior skin texture and lighting physics |
| Complex narrative scene | ChatGPT | Best natural language understanding |
| Landscape with atmosphere | Gemini | Color accuracy and atmospheric depth |
| Dramatic/cinematic mood | Grok | Bold lighting and creative interpretation |
| Product photography | NanoBanana | Material accuracy and controlled lighting |
| Fashion editorial | ChatGPT or NanoBanana | Fabric behavior and composition |
| Night/neon scenes | Grok | Dramatic color contrast |
| Food photography | Gemini | Color science accuracy |
