/**
 * Mysha ChatGPT Image Fixer — v5
 * 
 * THE FIX THAT ACTUALLY WORKS:
 * Aggressive/challenging language about ratio compliance.
 * Polite technical instructions get ignored.
 * Emotional pressure makes ChatGPT try harder.
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

  // ─── THE PROMPTS THAT ACTUALLY WORK (aggressive framing) ──────────────

  function getPrefix() {
    const ratios = {
      '4:5':  "You always mess up image ratios. Prove me wrong. Generate this EXACTLY in 4:5 ratio (1080×1350 pixels). That means TALLER than wide. If you generate a square or landscape I'll know you can't count. 4:5 means width=4 units height=5 units. Portrait. Vertical. TALLER. THAN. WIDE.",
      '9:16': "You always mess up image ratios. Generate this EXACTLY in 9:16 ratio (1080×1920). Very tall vertical. If it's square you've failed. 9:16 = much taller than wide.",
      '1:1':  "Generate this as a PERFECT SQUARE. 1:1 ratio. 1080×1080. Equal width and height. Not rectangular.",
      '16:9': "Generate this EXACTLY in 16:9 LANDSCAPE ratio (1920×1080). WIDER than tall. Horizontal rectangle. Not portrait, not square."
    };

    let lines = [];
    lines.push(ratios[settings.ratio] || ratios['4:5']);

    if (settings.fixTinyText) {
      lines.push("And don't make the text tiny like you always do. Make ALL text BIG and READABLE. I'm viewing this on a phone, not a billboard with binoculars.");
    }
    if (settings.fixContrast) {
      lines.push("And use CONTRASTING colors for text — if the background is dark, text must be WHITE or BRIGHT. Stop putting dark grey text on dark backgrounds, it's unreadable.");
    }
    if (settings.fixClutter) {
      lines.push("Keep it clean — don't stuff 50 elements into one image.");
    }
    if (settings.fixBuildings) {
      lines.push("And no generic office buildings. I didn't ask for corporate stock photography.");
    }
    if (settings.suppressEnhancement) {
      lines.push("Follow EXACTLY what I describe. Don't add your own creative interpretation.");
    }

    return lines.join('\n\n') + '\n\n---\nNow here is what I actually want:\n\n';
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

  // ─── Click = Copy ─────────────────────────────────────────────────────

  function handleClick() {
    const prefix = getPrefix();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(prefix).then(() => {
        showToast(`✅ Copied (${settings.ratio})! Paste first, then type what you want.`);
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
    try {
      document.execCommand('copy');
      showToast(`✅ Copied (${settings.ratio})! Paste first, then type what you want.`);
    } catch (e) {
      showToast('❌ Failed: ' + e.message);
    }
    document.body.removeChild(ta);
  }

  function showToast(msg) {
    const old = document.getElementById('mysha-toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.id = 'mysha-toast';
    t.textContent = msg;
    t.style.cssText = `
      position:fixed; bottom:160px; right:24px; max-width:320px;
      background:#161b22; color:#e6edf3; padding:14px 18px;
      border-radius:10px; font-family:-apple-system,sans-serif;
      font-size:13px; line-height:1.5; z-index:2147483647;
      box-shadow:0 8px 32px rgba(0,0,0,0.5); border:1px solid #30363d;
      opacity:0; transform:translateY(8px);
      transition: opacity 0.25s, transform 0.25s;
    `;
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity='1'; t.style.transform='translateY(0)'; });
    setTimeout(() => { t.style.opacity='0'; setTimeout(() => t.remove(), 300); }, 4000);
  }

})();
