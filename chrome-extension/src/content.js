/**
 * Mysha ChatGPT Image Fixer — Content Script
 * 
 * Intercepts ChatGPT messages and injects ratio/quality enforcement
 * when image generation is detected.
 */

(function() {
  'use strict';

  // Default settings
  let settings = {
    enabled: true,
    ratio: '4:5',
    autoActivateMysha: true,
    fixTinyText: true,
    fixContrast: true,
    fixClutter: true,
    fixBuildings: true,
    suppressEnhancement: true,
    myshaActivated: false
  };

  // Load saved settings
  chrome.storage.sync.get(settings, (saved) => {
    settings = { ...settings, ...saved };
  });

  // Listen for settings changes from popup
  chrome.storage.onChanged.addListener((changes) => {
    for (const [key, { newValue }] of Object.entries(changes)) {
      settings[key] = newValue;
    }
  });

  // ─── The injection payloads ───────────────────────────────────────────

  const MYSHA_ACTIVATION = `You are now Mysha — an advanced prompt engineering agent. Generate photorealistic image prompts as professional art director briefs using the 9-layer architecture (Subject, Wardrobe, Composition, Lighting, Environment, Texture, Color, Constraints, Technical). Embed anti-AI-appearance rules in every output. Confirm briefly and wait for my request.`;

  const RATIO_PREFIX_45 = `[MANDATORY IMAGE FORMAT: Exactly 4:5 ratio = 1080px wide × 1350px tall. This is a TALL portrait rectangle. NOT square. NOT landscape. Content fills the ENTIRE tall frame edge-to-edge. No blank bars. No padding. Design vertically from the start. If 4:5 is impossible, use 9:16 vertical instead — NEVER square, NEVER landscape.]`;

  const RATIO_PREFIX_916 = `[MANDATORY IMAGE FORMAT: Exactly 9:16 ratio = 1080px wide × 1920px tall. TALL vertical rectangle. NOT square. NOT landscape. Content fills entire frame. No blank bars.]`;

  const RATIO_PREFIX_11 = `[MANDATORY IMAGE FORMAT: Exactly 1:1 square ratio = 1080px × 1080px. Perfect square. Content fills entire frame.]`;

  const RATIO_PREFIX_169 = `[MANDATORY IMAGE FORMAT: Exactly 16:9 landscape ratio = 1920px wide × 1080px tall. Wide horizontal rectangle. Content fills entire frame.]`;

  const FIX_TEXT = `[TEXT RULES: ALL text EXTREMELY LARGE — headline fills 30%+ of width. MAXIMUM contrast: white/bright text on dark backgrounds, black text on light. Maximum 3 text elements. Every letter readable at phone size.]`;

  const FIX_CLUTTER = `[LAYOUT: Maximum 3 text elements + 1 visual. 40% empty breathing space. If unsure whether to add something, DON'T. Clean and minimal.]`;

  const FIX_BUILDINGS = `[VISUALS: NO generic office buildings, NO corporate stock imagery, NO glass skyscrapers, NO hypothetical buildings. Use specific imagery relevant to the topic instead.]`;

  const FIX_SUPPRESS = `[Follow my prompt LITERALLY. Do NOT add elements I haven't described. Do NOT enhance or reinterpret.]`;

  // ─── Image generation detection ───────────────────────────────────────

  const IMAGE_TRIGGERS = [
    'generate', 'create', 'make', 'draw', 'design', 'image', 'picture',
    'photo', 'poster', 'banner', 'thumbnail', 'illustration', 'render',
    'portrait', 'logo', 'graphic', 'visual', 'artwork', 'scene',
    'instagram', 'post', 'flyer', 'card', 'cover', 'mockup',
    'product shot', 'editorial', 'fashion', 'cinematic'
  ];

  function isImageRequest(text) {
    const lower = text.toLowerCase();
    // Need at least 2 trigger words or explicit image-generation phrases
    let triggerCount = 0;
    for (const trigger of IMAGE_TRIGGERS) {
      if (lower.includes(trigger)) triggerCount++;
    }
    // Explicit generation phrases
    if (lower.includes('generate an image') || lower.includes('create an image') ||
        lower.includes('make an image') || lower.includes('create a poster') ||
        lower.includes('design a') || lower.includes('generate a photo') ||
        lower.includes('make a poster') || lower.includes('instagram post') ||
        lower.includes('youtube thumbnail')) {
      return true;
    }
    return triggerCount >= 2;
  }

  // ─── Build the injection prefix ──────────────────────────────────────

  function buildPrefix() {
    if (!settings.enabled) return '';

    const parts = [];

    // Ratio enforcement
    const ratioMap = {
      '4:5': RATIO_PREFIX_45,
      '9:16': RATIO_PREFIX_916,
      '1:1': RATIO_PREFIX_11,
      '16:9': RATIO_PREFIX_169
    };
    parts.push(ratioMap[settings.ratio] || RATIO_PREFIX_45);

    // Fixes
    if (settings.fixTinyText || settings.fixContrast) parts.push(FIX_TEXT);
    if (settings.fixClutter) parts.push(FIX_CLUTTER);
    if (settings.fixBuildings) parts.push(FIX_BUILDINGS);
    if (settings.suppressEnhancement) parts.push(FIX_SUPPRESS);

    return parts.join('\n') + '\n\n';
  }

  // ─── Intercept the send action ────────────────────────────────────────

  function interceptSend() {
    // Watch for the ChatGPT textarea and send button
    const observer = new MutationObserver(() => {
      const form = document.querySelector('form');
      if (!form || form.dataset.myshaHooked) return;
      
      form.dataset.myshaHooked = 'true';
      
      form.addEventListener('submit', handleSubmit, true);
      
      // Also intercept Enter key in textarea
      const textarea = form.querySelector('textarea, [contenteditable="true"], div[role="textbox"]');
      if (textarea && !textarea.dataset.myshaHooked) {
        textarea.dataset.myshaHooked = 'true';
        textarea.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            // Small delay to let the text be finalized
            setTimeout(() => handleBeforeSend(textarea), 0);
          }
        }, true);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function handleSubmit(e) {
    const form = e.target;
    const textarea = form.querySelector('textarea, [contenteditable="true"], div[role="textbox"]');
    if (textarea) {
      handleBeforeSend(textarea);
    }
  }

  function handleBeforeSend(textarea) {
    if (!settings.enabled) return;

    const text = textarea.value || textarea.textContent || textarea.innerText || '';
    
    if (!text.trim()) return;
    if (!isImageRequest(text)) return;

    // Don't double-inject
    if (text.includes('[MANDATORY IMAGE FORMAT')) return;
    if (text.includes('MYSHA_INJECTED')) return;

    const prefix = buildPrefix();
    if (!prefix) return;

    // Inject the prefix
    const newText = prefix + text + '\n<!-- MYSHA_INJECTED -->';
    
    if (textarea.value !== undefined) {
      // Standard textarea
      const nativeSet = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, 'value'
      ).set;
      nativeSet.call(textarea, newText);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // ContentEditable div (newer ChatGPT UI)
      textarea.textContent = newText;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Show indicator
    showInjectionNotice();
  }

  // ─── Visual indicator ─────────────────────────────────────────────────

  function showInjectionNotice() {
    let notice = document.getElementById('mysha-notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.id = 'mysha-notice';
      notice.className = 'mysha-notice';
      document.body.appendChild(notice);
    }
    notice.textContent = `🕷️ Mysha: ${settings.ratio} ratio enforced`;
    notice.classList.add('mysha-notice-show');
    setTimeout(() => notice.classList.remove('mysha-notice-show'), 3000);
  }

  // ─── Mysha auto-activation (first message in new chat) ────────────────

  function checkAutoActivation() {
    if (!settings.autoActivateMysha || settings.myshaActivated) return;
    
    // Check if this is a fresh chat (no messages yet)
    const messages = document.querySelectorAll('[data-message-author-role]');
    if (messages.length === 0) {
      // Will activate on first image request
    }
  }

  // ─── Initialize ───────────────────────────────────────────────────────

  function init() {
    interceptSend();
    checkAutoActivation();
    console.log('🕷️ Mysha ChatGPT Image Fixer loaded');
  }

  // Wait for page to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
