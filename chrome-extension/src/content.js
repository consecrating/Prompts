/**
 * Mysha ChatGPT Image Fixer — Content Script v4
 * 
 * FIXED: v3 was too restrictive ("only 3 elements, 40% whitespace")
 * which killed rich designs like product comparison posters.
 * 
 * v4 ONLY fixes the ACTUAL problems:
 * - Wrong aspect ratio (the main issue)
 * - Unreadable tiny text
 * - Dark text on dark background
 * 
 * It does NOT restrict layout complexity or element count anymore.
 */

(function() {
  'use strict';

  let settings = {
    enabled: true,
    ratio: '4:5',
    fixTinyText: true,
    fixContrast: true,
    fixClutter: false,  // OFF by default now — was killing rich designs
    fixBuildings: false, // OFF by default — only relevant for some prompts
    suppressEnhancement: false // OFF by default — ChatGPT's enhancement often HELPS
  };

  if (chrome && chrome.storage) {
    chrome.storage.sync.get(settings, (saved) => {
      settings = { ...settings, ...saved };
      if (settings.enabled) startExtension();
    });

    chrome.storage.onChanged.addListener((changes) => {
      for (const [key, { newValue }] of Object.entries(changes)) {
        settings[key] = newValue;
      }
    });
  } else {
    startExtension();
  }

  // ─── Build prefix — MINIMAL, only fixes real problems ─────────────────

  function getPrefix() {
    const ratios = {
      '4:5':  'Image dimensions: EXACTLY 4:5 ratio (1080×1350 pixels). Vertical portrait — taller than wide. NOT square. Fill the entire frame.',
      '9:16': 'Image dimensions: EXACTLY 9:16 ratio (1080×1920 pixels). Tall vertical. NOT square. Fill entire frame.',
      '1:1':  'Image dimensions: EXACTLY 1:1 ratio (1080×1080 pixels). Perfect square.',
      '16:9': 'Image dimensions: EXACTLY 16:9 ratio (1920×1080 pixels). Wide landscape.'
    };

    let lines = [];
    lines.push(ratios[settings.ratio] || ratios['4:5']);

    if (settings.fixTinyText) {
      lines.push('All text must be large and clearly readable — no tiny text anywhere in the image.');
    }
    if (settings.fixContrast) {
      lines.push('Ensure strong contrast between text and background — light text on dark areas, dark text on light areas.');
    }
    if (settings.fixClutter) {
      lines.push('Keep the layout clean with adequate spacing between elements.');
    }
    if (settings.fixBuildings) {
      lines.push('Do not include generic office buildings or corporate stock imagery.');
    }
    if (settings.suppressEnhancement) {
      lines.push('Follow my description exactly without adding extra elements.');
    }

    return lines.join(' ') + '\n\n';
  }

  // ─── Floating Button ──────────────────────────────────────────────────

  function startExtension() {
    const btn = document.createElement('div');
    btn.id = 'mysha-fab';
    btn.innerHTML = '🕷️';
    btn.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 52px;
      height: 52px;
      background: #0d1117;
      border: 2px solid #00ff88;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      cursor: pointer;
      z-index: 2147483647;
      box-shadow: 0 4px 24px rgba(0,255,136,0.4);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      user-select: none;
    `;

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.15)';
      btn.style.boxShadow = '0 6px 32px rgba(0,255,136,0.6)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 24px rgba(0,255,136,0.4)';
    });

    btn.addEventListener('click', handleClick);
    document.body.appendChild(btn);

    console.log('[Mysha v4] Ready. Click spider → paste prefix → type prompt.');
  }

  // ─── Click = Copy to Clipboard ────────────────────────────────────────

  function handleClick() {
    const prefix = getPrefix();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(prefix).then(() => {
        showToast(`✅ Copied (${settings.ratio})! Paste into ChatGPT then type your prompt.`);
      }).catch(() => {
        fallbackCopy(prefix);
      });
    } else {
      fallbackCopy(prefix);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showToast(`✅ Copied (${settings.ratio})! Paste into ChatGPT then type your prompt.`);
    } catch (e) {
      showToast('❌ Copy failed: ' + e.message);
    }
    document.body.removeChild(ta);
  }

  // ─── Toast ────────────────────────────────────────────────────────────

  function showToast(message) {
    const existing = document.getElementById('mysha-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'mysha-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 160px;
      right: 24px;
      max-width: 320px;
      background: #161b22;
      color: #e6edf3;
      padding: 14px 18px;
      border-radius: 10px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      line-height: 1.5;
      z-index: 2147483647;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      border: 1px solid #30363d;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.25s ease, transform 0.25s ease;
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

})();
