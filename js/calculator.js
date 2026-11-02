(() => {
  const basePrices = {
    Anarkali: 1800,
    'Designer Blouse': 1200,
    Lehenga: 2500,
    Gown: 2800,
    'Saree Blouse': 1000
  };
  const fabricPrices = { Silk: 1200, Georgette: 700, Cotton: 400, Velvet: 1500, Net: 600 };
  const embroideryPrices = { 'Zari Work': 1800, 'Mirror Work': 1200, 'Thread Work': 900 };
  const additionalPrices = { 'Lining fabric': 450, 'Express stitching': 500 };

  function getPriceLines(state) {
    const lines = [
      ['Base stitching · ' + state.base, basePrices[state.base]],
      ['Fabric · ' + state.fabric, fabricPrices[state.fabric]]
    ];
    state.embroidery.forEach((work) => lines.push([work, embroideryPrices[work]]));
    if (state.lining) lines.push(['Lining fabric', additionalPrices['Lining fabric']]);
    if (state.express) lines.push(['Express stitching', additionalPrices['Express stitching']]);
    return lines;
  }

  function updatePrice() {
    const state = window.BloomThread.getCustomization();
    const lines = getPriceLines(state);
    const total = lines.reduce((sum, line) => sum + line[1], 0);
    document.getElementById('price-items').innerHTML = lines.map(([label, amount]) =>
      `<div class="price-line"><span>${label}</span><strong>${window.BloomThread.formatCurrency(amount)}</strong></div>`
    ).join('');
    document.getElementById('estimated-total').textContent = window.BloomThread.formatCurrency(total);
  }

  window.addEventListener('bloom:customization-change', updatePrice);
  document.getElementById('print-quotation').addEventListener('click', () => {
    const state = window.BloomThread.getCustomization();
    const lines = getPriceLines(state);
    const total = lines.reduce((sum, line) => sum + line[1], 0);
    const date = new Intl.DateTimeFormat('en-IN', { dateStyle: 'long' }).format(new Date());
    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
    const printable = document.getElementById('printable-quotation');
    printable.innerHTML = `
      <div class="print-quote">
        <header class="print-quote-header"><div class="print-quote-brand">BLOOM &amp; THREAD</div><div class="print-quote-subtitle">DESIGNER BOUTIQUE · JAIPUR</div></header>
        <h1>Your design quotation</h1>
        <p class="print-quote-intro">Prepared ${escapeHtml(date)}. A thoughtful first estimate for a look made especially for you.</p>
        <div class="print-quote-details">
          <div><span>Design</span>${escapeHtml(state.design ? state.design.name : 'Custom ' + state.base)}</div>
          <div><span>Silhouette</span>${escapeHtml(state.base)}</div>
          <div><span>Neckline</span>${escapeHtml(state.neckline)}</div>
          <div><span>Fabric</span>${escapeHtml(state.fabric)}</div>
          <div><span>Embroidery</span>${escapeHtml(state.embroidery.length ? state.embroidery.join(', ') : 'None selected')}</div>
          <div><span>Sleeves</span>${escapeHtml(state.sleeves)}</div>
          <div><span>Lining</span>${state.lining ? 'Included' : 'Not included'}</div>
          <div><span>Express stitching</span>${state.express ? 'Included' : 'Not included'}</div>
          ${state.requirements ? `<div style="grid-column:1/-1"><span>Your note</span>${escapeHtml(state.requirements)}</div>` : ''}
        </div>
        <div class="print-quote-lines">${lines.map(([label, amount]) =>
          `<div class="print-quote-line"><span>${escapeHtml(label)}</span><strong>${window.BloomThread.formatCurrency(amount)}</strong></div>`
        ).join('')}</div>
        <div class="print-quote-total"><span>Estimated total</span><strong>${window.BloomThread.formatCurrency(total)}</strong></div>
        <p class="print-quote-note">This is an indicative estimate for demonstration purposes. Final design, fit and pricing are confirmed during a consultation. Bloom &amp; Thread · C-Scheme, Jaipur · +91 141 400 1234</p>
      </div>`;
    window.print();
  });

  updatePrice();
})();
