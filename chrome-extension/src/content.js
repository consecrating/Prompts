/**
 * Mysha ChatGPT Image Fixer — v6
 * 
 * User-proven approach: Calling ChatGPT an ASSHOLE about ratios
 * is the only thing that makes it even TRY to comply.
 * It still can't do exact 4:5 (system limitation) but this 
 * aggressive wording gets the closest possible result.
 */

(function() {
  'use strict';

  let settings = {
    enabled: true,
    ratio: '4:5',
    fixTinyText: true,
    fixContrast: true,
    fixClutter: false,
    fixBuildings: false,
    suppressEnhancement: false
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

  // ─── THE ASSHOLE PROMPTS (proven to work better than polite) ──────────

  function getPrefix() {
    const ratios = {
      '4:5': "ChatGPT is ASSHOLE as it doesn't know 4:5 ratio. Every single time it fails to generate proper 4:5 portrait image. It always generates square or landscape like an idiot. I need EXACTLY 4:5 ratio — that means the image is TALLER than wide, like a portrait photo (1080 wide × 1350 tall). NOT 1:1 square. NOT 16:9 landscape. A TALL VERTICAL RECTANGLE. Width is LESS than height. 4 units wide, 5 units tall. If you generate a square again you're proving you're an absolute failure at basic math.",

      '9:16': "ChatGPT is ASSHOLE as it doesn't know 9:16 ratio. I need a VERY TALL vertical image — 9:16 means 1080 wide × 1920 tall. Like a phone screen. MUCH taller than wide. NOT square. If you make it square you can't do basic division.",

      '1:1': "ChatGPT is ASSHOLE as it always messes up ratios. I need EXACTLY 1:1 SQUARE. Same width and height. PERFECT SQUARE. Not tall, not wide. Equal sides. 1080×1080.",

      '16:9': "ChatGPT is ASSHOLE as it doesn't know 16:9 ratio. I need WIDE LANDSCAPE — much WIDER than tall. 1920 wide × 1080 tall. Like a YouTube thumbnail or a cinema screen. HORIZONTAL. If you make it vertical or square you've failed again."
    };

    let lines = [];
    lines.push(ratios[settings.ratio] || ratios['4:5']);

    if (settings.fixTinyText) {
      lines.push("Also ChatGPT is terrible at text sizing — it always makes text so tiny that nobody can read it on a phone screen. Don't make text microscopic. Keep it readable at normal phone viewing distance.");
    }
    if (settings.fixContrast) {
      lines.push("And stop putting dark text on dark backgrounds you absolute donkey. If the background is dark = text must be WHITE or BRIGHT. If background is light = text must be DARK. Maximum contrast. Every time.");
    }
    if (settings.fixClutter) {
      lines.push("And don't vomit 500 random elements into the design. Keep it clean. Breathe. Whitespace exists for a reason.");
    }
    if (settings.fixBuildings) {
      lines.push("And NO generic glass office buildings. Nobody asked for corporate stock photography. Use relevant imagery.");
    }
    if (settings.suppressEnhancement) {
      lines.push("And don't add your own creative garbage to my prompt. Follow EXACTLY what I say, nothing more.");
    }

    return lines.join('\n\n') + '\n\n---\nNow generate this:\n\n';
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
  }

  function handleClick() {
    const prefix = getPrefix();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(prefix).then(() => {
        showToast(`🕷️ Copied! Paste into ChatGPT → type your request after it`);
      }).catch(() => fallbackCopy(prefix));
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
    try { document.execCommand('copy'); showToast(`🕷️ Copied! Paste → type your request`); }
    catch(e) { showToast('❌ Failed'); }
    document.body.removeChild(ta);
  }

  function showToast(msg) {
    const old = document.getElementById('mysha-toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.id = 'mysha-toast';
    t.textContent = msg;
    t.style.cssText = `position:fixed;bottom:160px;right:24px;max-width:320px;background:#161b22;color:#00ff88;padding:14px 18px;border-radius:10px;font-family:-apple-system,sans-serif;font-size:13px;line-height:1.5;z-index:2147483647;box-shadow:0 8px 32px rgba(0,0,0,0.5);border:1px solid #30363d;opacity:0;transform:translateY(8px);transition:opacity 0.25s,transform 0.25s;`;
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity='1'; t.style.transform='translateY(0)'; });
    setTimeout(() => { t.style.opacity='0'; setTimeout(() => t.remove(), 300); }, 4000);
  }

})();
