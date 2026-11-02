(() => {
  const state = {
    base: 'Anarkali',
    neckline: 'Sweetheart',
    fabric: 'Silk',
    embroidery: [],
    lining: false,
    express: false,
    sleeves: 'Standard sleeves',
    requirements: '',
    design: null
  };

  const fieldMap = {
    'base-options': 'base',
    'neckline-options': 'neckline',
    'fabric-options': 'fabric'
  };

  Object.entries(fieldMap).forEach(([groupId, key]) => {
    document.getElementById(groupId).addEventListener('click', (event) => {
      const button = event.target.closest('[data-value]');
      if (!button) return;
      state[key] = button.dataset.value;
      document.querySelectorAll(`#${groupId} .choice-button`).forEach((option) => {
        option.classList.toggle('selected', option === button);
      });
      state.design = null;
      updateSummary();
      window.dispatchEvent(new CustomEvent('bloom:customization-change'));
    });
  });

  document.getElementById('embroidery-options').addEventListener('click', (event) => {
    const button = event.target.closest('[data-value]');
    if (!button) return;
    const value = button.dataset.value;
    const selected = state.embroidery.includes(value);
    state.embroidery = selected ? state.embroidery.filter((item) => item !== value) : [...state.embroidery, value];
    button.classList.toggle('selected', !selected);
    button.setAttribute('aria-pressed', String(!selected));
    button.querySelector('span').textContent = selected ? '+' : '✓';
    window.dispatchEvent(new CustomEvent('bloom:customization-change'));
    updateSummary();
  });

  document.getElementById('lining-option').addEventListener('change', (event) => {
    state.lining = event.target.checked;
    window.dispatchEvent(new CustomEvent('bloom:customization-change'));
  });
  document.getElementById('express-option').addEventListener('change', (event) => {
    state.express = event.target.checked;
    window.dispatchEvent(new CustomEvent('bloom:customization-change'));
  });
  document.getElementById('sleeve-style').addEventListener('change', (event) => {
    state.sleeves = event.target.value;
    updateSummary();
    window.dispatchEvent(new CustomEvent('bloom:customization-change'));
  });
  document.getElementById('custom-requirements').addEventListener('input', (event) => {
    state.requirements = event.target.value.trim();
  });

  window.addEventListener('bloom:select-design', (event) => {
    const design = event.detail;
    state.design = design;
    const neckline = {
      'Sweetheart Neckline': 'Sweetheart',
      'Boat Neck': 'Boat Neck',
      'Deep Back Neck': 'Deep Back',
      'Sleeve Patterns': null,
      'Lehenga Borders': null
    }[design.category];
    if (design.category === 'Lehenga Borders') state.base = 'Lehenga';
    if (neckline) state.neckline = neckline;
    document.querySelectorAll('#base-options .choice-button').forEach((button) => {
      button.classList.toggle('selected', button.dataset.value === state.base);
    });
    document.querySelectorAll('#neckline-options .choice-button').forEach((button) => {
      button.classList.toggle('selected', button.dataset.value === state.neckline);
    });
    updateSummary();
    window.dispatchEvent(new CustomEvent('bloom:customization-change'));
  });

  function updateSummary() {
    document.getElementById('summary-design-name').textContent = state.design ? state.design.name : `Your ${state.base}`;
    document.getElementById('summary-design-caption').textContent = state.design
      ? state.design.description
      : 'A new favourite, in the making.';
    document.getElementById('summary-base').textContent = state.base;
    document.getElementById('summary-neckline').textContent = state.neckline;
    document.getElementById('summary-fabric').textContent = state.fabric;
    document.getElementById('summary-embroidery').textContent = state.embroidery.length ? state.embroidery.join(', ') : 'Not selected';
    document.getElementById('summary-sleeves').textContent = state.sleeves;
  }

  document.getElementById('reset-customization').addEventListener('click', () => {
    state.base = 'Anarkali';
    state.neckline = 'Sweetheart';
    state.fabric = 'Silk';
    state.embroidery = [];
    state.lining = false;
    state.express = false;
    state.sleeves = 'Standard sleeves';
    state.requirements = '';
    state.design = null;
    Object.entries(fieldMap).forEach(([groupId, key]) => {
      document.querySelectorAll(`#${groupId} .choice-button`).forEach((button) => {
        button.classList.toggle('selected', button.dataset.value === state[key]);
      });
    });
    document.querySelectorAll('#embroidery-options .choice-button').forEach((button) => {
      button.classList.remove('selected');
      button.setAttribute('aria-pressed', 'false');
      button.querySelector('span').textContent = '+';
    });
    document.getElementById('lining-option').checked = false;
    document.getElementById('express-option').checked = false;
    document.getElementById('sleeve-style').value = state.sleeves;
    document.getElementById('custom-requirements').value = '';
    updateSummary();
    window.dispatchEvent(new CustomEvent('bloom:customization-change'));
    window.BloomThread.showToast('Your design has been reset.');
  });

  window.BloomThread.getCustomization = () => ({ ...state, embroidery: [...state.embroidery] });
  updateSummary();
})();
