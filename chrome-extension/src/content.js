/**
 * Mysha ChatGPT Image Fixer — Content Script v3
 * 
 * SIMPLIFIED APPROACH: 
 * - Floating button on ChatGPT
 * - Click = copies prefix to clipboard (GUARANTEED to work)
 * - Shows clear instruction to paste (Ctrl+V)
 * - No DOM manipulation of ChatGPT's editor (it always breaks)
 */

(function() {
  'use strict';

  let settings = {
    enabled: true,
    ratio: '4:5',
    fixTinyText: true,
    fixContrast: true,
    fixClutter: true,
    fixBuildings: true,
    suppressEnhancement: true
  };

  // Load settings
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

  // ─── Build the prefix text ────────────────────────────────────────────

  function getPrefix() {
    const ratios = {
      '4:5':  'Generate this image at EXACTLY 4:5 ratio (1080px wide, 1350px tall). This is a TALL vertical rectangle — taller than wide. NOT square. NOT landscape. Content fills entire tall frame edge-to-edge. No blank bars, no padding.',
      '9:16': 'Generate this image at EXACTLY 9:16 ratio (1080px wide, 1920px tall). Very tall vertical format. NOT square. NOT landscape. Fill entire frame.',
      '1:1':  'Generate this image at EXACTLY 1:1 square ratio (1080px × 1080px). Perfect square. Fill entire frame.',
      '16:9': 'Generate this image at EXACTLY 16:9 ratio (1920px wide, 1080px tall). Wide landscape. Fill entire frame.'
    };

    let lines = [];
    lines.push(ratios[settings.ratio] || ratios['4:5']);

    if (settings.fixTinyText || settings.fixContrast) {
      lines.push('ALL text in this image must be EXTREMELY LARGE — headline fills at least 30% of image width. Text must have MAXIMUM contrast with background: use WHITE or BRIGHT text on dark backgrounds, BLACK or DARK text on light backgrounds. NEVER put dark text on a dark background.');
    }
    if (settings.fixClutter) {
      lines.push('STRICT LAYOUT: Maximum 3 text elements and 1 main visual in the entire image. 40% of the image must be clean empty breathing space. Do NOT stuff extra elements, decorations, or details I did not ask for.');
    }
    if (settings.fixBuildings) {
      lines.push('Do NOT include generic office buildings, corporate glass skyscrapers, or stock-photo business imagery anywhere in this image.');
    }
    if (settings.suppressEnhancement) {
      lines.push('Follow my description EXACTLY. Do NOT add elements I have not described. Do NOT reinterpret or enhance my prompt.');
    }

    return lines.join('\n\n') + '\n\n---\nNow generate this:\n\n';
  }

  // ─── Create the floating UI ───────────────────────────────────────────

  function startExtension() {
    // Create floating button
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

    console.log('[Mysha] Extension loaded. Click the green spider to copy image fix prefix.');
  }

  // ─── Click handler: JUST COPY TO CLIPBOARD ────────────────────────────

  function handleClick() {
    const prefix = getPrefix();

    // Use the modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(prefix).then(() => {
        showToast(`✅ Copied! Now paste (Ctrl+V) into ChatGPT, then type your prompt after it.`);
      }).catch((err) => {
        // Clipboard API failed (permissions issue) — use fallback
        fallbackCopy(prefix);
      });
    } else {
      fallbackCopy(prefix);
    }
  }

  function fallbackCopy(text) {
    // Create a temporary textarea, select its content, copy
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const success = document.execCommand('copy');
      if (success) {
        showToast('✅ Copied! Now paste (Ctrl+V) into ChatGPT, then type your prompt after it.');
      } else {
        showToast('❌ Copy failed. Try: Right-click the spider → Inspect → Console → check for errors.');
      }
    } catch (e) {
      showToast('❌ Copy failed: ' + e.message);
    }

    document.body.removeChild(textarea);
  }

  // ─── Toast notification ───────────────────────────────────────────────

  function showToast(message) {
    // Remove existing toast
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

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Auto-hide after 5 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

})();
