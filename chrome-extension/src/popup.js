/**
 * Popup settings controller for Mysha ChatGPT Image Fixer
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggleIds = ['enabled', 'fixTinyText', 'fixContrast', 'fixClutter', 'fixBuildings', 'suppressEnhancement', 'autoActivateMysha'];
  const ratioInputs = document.querySelectorAll('input[name="ratio"]');
  const radioOptions = document.querySelectorAll('.radio-option');

  // Load saved settings
  chrome.storage.sync.get(null, (settings) => {
    toggleIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && settings[id] !== undefined) {
        el.checked = settings[id];
      }
    });

    if (settings.ratio) {
      ratioInputs.forEach(input => {
        input.checked = input.value === settings.ratio;
      });
      radioOptions.forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.ratio === settings.ratio);
      });
    }
  });

  // Save toggle changes
  toggleIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        chrome.storage.sync.set({ [id]: el.checked });
      });
    }
  });

  // Save ratio changes
  ratioInputs.forEach(input => {
    input.addEventListener('change', () => {
      chrome.storage.sync.set({ ratio: input.value });
      radioOptions.forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.ratio === input.value);
      });
    });
  });

  // Make entire radio option clickable
  radioOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const input = opt.querySelector('input');
      input.checked = true;
      input.dispatchEvent(new Event('change'));
    });
  });
});
