/**
 * Mysha ChatGPT Image Fixer — Content Script v2
 * 
 * APPROACH: Instead of trying to intercept/modify the textarea (which breaks
 * because ChatGPT uses ProseMirror contenteditable with React state),
 * we inject a FLOATING BUTTON that the user clicks BEFORE sending.
 * 
 * When clicked, it copies the fix prefix to clipboard and shows instructions,
 * OR it directly prepends to the current input using execCommand.
 * 
 * Also provides a "Mysha Mode" toggle that adds a persistent system instruction
 * approach via the ChatGPT custom instructions if available.
 */

(function() {
  'use strict';

  // ─── Settings ─────────────────────────────────────────────────────────
  let settings = {
    enabled: true,
    ratio: '4:5',
    fixTinyText: true,
    fixContrast: true,
    fixClutter: true,
    fixBuildings: true,
    suppressEnhancement: true,
    autoActivateMysha: true
  };

  chrome.storage.sync.get(settings, (saved) => {
    settings = { ...settings, ...saved };
    if (settings.enabled) init();
  });

  chrome.storage.onChanged.addListener((changes) => {
    for (const [key, { newValue }] of Object.entries(changes)) {
      settings[key] = newValue;
    }
    updateButtonLabel();
  });

  // ─── Fix Prefix Builder ───────────────────────────────────────────────

  const RATIOS = {
    '4:5':  '[IMAGE SIZE: 4:5 portrait ratio, 1080×1350px. Taller than wide. NOT square. Fill entire tall frame, no blank bars.]\n',
    '9:16': '[IMAGE SIZE: 9:16 vertical, 1080×1920px. Very tall portrait. NOT square. NOT landscape. Fill entire frame.]\n',
    '1:1':  '[IMAGE SIZE: 1:1 square, 1080×1080px. Perfect square. Fill entire frame.]\n',
    '16:9': '[IMAGE SIZE: 16:9 landscape, 1920×1080px. Wide horizontal. Fill entire frame.]\n'
  };

  function buildPrefix() {
    let parts = [];
    
    parts.push(RATIOS[settings.ratio] || RATIOS['4:5']);
    
    if (settings.fixTinyText || settings.fixContrast) {
      parts.push('[TEXT: Make ALL text EXTREMELY LARGE (30%+ of image width). White text on dark bg, black text on light bg. MAXIMUM contrast. Readable on phone screen.]');
    }
    if (settings.fixClutter) {
      parts.push('[LAYOUT: Max 3 text elements + 1 visual. 40% empty space. Clean and minimal. Remove rather than shrink.]');
    }
    if (settings.fixBuildings) {
      parts.push('[NO office buildings, NO corporate stock images, NO glass skyscrapers. Use relevant specific imagery instead.]');
    }
    if (settings.suppressEnhancement) {
      parts.push('[Follow EXACTLY as described. Do NOT add extra elements. Do NOT rewrite my prompt.]');
    }
    
    return parts.join('\n') + '\n\n';
  }

  // ─── Floating Button UI ───────────────────────────────────────────────

  let myshaButton = null;
  let myshaPanel = null;

  function createUI() {
    // Main floating button
    myshaButton = document.createElement('div');
    myshaButton.id = 'mysha-float-btn';
    myshaButton.innerHTML = '🕷️';
    myshaButton.title = 'Mysha: Click to inject image fix prefix';
    document.body.appendChild(myshaButton);

    // Quick panel (shows on click)
    myshaPanel = document.createElement('div');
    myshaPanel.id = 'mysha-panel';
    myshaPanel.innerHTML = `
      <div class="mysha-panel-header">
        <span>🕷️ Mysha Image Fixer</span>
        <span class="mysha-panel-close">✕</span>
      </div>
      <div class="mysha-panel-body">
        <div class="mysha-ratio-display">Ratio: <strong>${settings.ratio}</strong></div>
        <button id="mysha-inject-btn" class="mysha-btn primary">⚡ Inject into message</button>
        <button id="mysha-copy-btn" class="mysha-btn secondary">📋 Copy prefix to clipboard</button>
        <p class="mysha-hint">Click "Inject" before sending your image request to ChatGPT</p>
      </div>
    `;
    document.body.appendChild(myshaPanel);

    // Events
    myshaButton.addEventListener('click', togglePanel);
    myshaPanel.querySelector('.mysha-panel-close').addEventListener('click', () => {
      myshaPanel.classList.remove('show');
    });
    document.getElementById('mysha-inject-btn').addEventListener('click', injectIntoChat);
    document.getElementById('mysha-copy-btn').addEventListener('click', copyToClipboard);

    updateButtonLabel();
  }

  function togglePanel() {
    myshaPanel.classList.toggle('show');
    // Update ratio display
    myshaPanel.querySelector('.mysha-ratio-display').innerHTML = 
      `Ratio: <strong>${settings.ratio}</strong> (${{'4:5':'Instagram Post','9:16':'Story/Reel','1:1':'Square','16:9':'YouTube'}[settings.ratio] || settings.ratio})`;
  }

  function updateButtonLabel() {
    if (myshaButton) {
      myshaButton.title = `Mysha: ${settings.ratio} ratio | Click to inject`;
    }
  }

  // ─── Inject into ChatGPT's input ─────────────────────────────────────

  function injectIntoChat() {
    const prefix = buildPrefix();
    
    // Find ChatGPT's input element (ProseMirror contenteditable)
    const editor = document.querySelector(
      '#prompt-textarea, ' +
      'div[contenteditable="true"][data-placeholder], ' +
      'div.ProseMirror[contenteditable="true"], ' +
      'textarea[data-id="root"]'
    );

    if (!editor) {
      // Fallback: try any contenteditable in the form area
      const form = document.querySelector('form');
      const editable = form && form.querySelector('[contenteditable="true"]');
      if (editable) {
        insertText(editable, prefix);
        showNotice('✅ Injected! Now type your request after the prefix and send.');
      } else {
        // Last resort: copy to clipboard
        copyToClipboard();
        showNotice('⚠️ Could not find input. Prefix copied to clipboard — paste it yourself.');
      }
      return;
    }

    insertText(editor, prefix);
    showNotice('✅ Injected! Type your image request after the prefix and send.');
    myshaPanel.classList.remove('show');
  }

  function insertText(element, text) {
    // Focus the element
    element.focus();
    
    // Method 1: Try using the clipboard API to paste
    // This works best with ProseMirror/contenteditable
    const existingContent = element.textContent || '';
    
    if (element.tagName === 'TEXTAREA') {
      // Standard textarea
      const start = element.selectionStart || 0;
      element.value = text + element.value;
      element.selectionStart = element.selectionEnd = text.length;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // ContentEditable (ProseMirror)
      // Move cursor to beginning
      const selection = window.getSelection();
      const range = document.createRange();
      
      if (element.firstChild) {
        range.setStart(element.firstChild, 0);
      } else {
        range.setStart(element, 0);
      }
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Insert via execCommand (deprecated but still works for contenteditable)
      document.execCommand('insertText', false, text);
      
      // If execCommand didn't work, try direct DOM manipulation
      if (!element.textContent.includes(text.substring(0, 20))) {
        const textNode = document.createTextNode(text);
        if (element.firstChild) {
          element.insertBefore(textNode, element.firstChild);
        } else {
          element.appendChild(textNode);
        }
        // Trigger React's synthetic events
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
      
      // Move cursor to end
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  // ─── Copy to clipboard fallback ───────────────────────────────────────

  function copyToClipboard() {
    const prefix = buildPrefix();
    navigator.clipboard.writeText(prefix).then(() => {
      showNotice('📋 Copied! Paste at the START of your ChatGPT message.');
    }).catch(() => {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = prefix;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showNotice('📋 Copied! Paste at the START of your ChatGPT message.');
    });
    myshaPanel.classList.remove('show');
  }

  // ─── Notification ─────────────────────────────────────────────────────

  function showNotice(msg) {
    let notice = document.getElementById('mysha-notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.id = 'mysha-notice';
      document.body.appendChild(notice);
    }
    notice.textContent = msg;
    notice.classList.add('show');
    setTimeout(() => notice.classList.remove('show'), 4000);
  }

  // ─── Init ─────────────────────────────────────────────────────────────

  function init() {
    // Wait for ChatGPT page to load
    const checkReady = setInterval(() => {
      if (document.querySelector('main') || document.querySelector('form')) {
        clearInterval(checkReady);
        createUI();
        console.log('🕷️ Mysha ChatGPT Image Fixer v2 loaded');
      }
    }, 500);

    // Stop checking after 30s
    setTimeout(() => clearInterval(checkReady), 30000);
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { if (settings.enabled) init(); });
  } else {
    if (settings.enabled) init();
  }

})();
