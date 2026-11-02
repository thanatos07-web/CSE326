(() => {
  const designs = [
    { id: 'rosewater', name: 'Rosewater Romance', category: 'Sweetheart Neckline', price: 1800, image: 'photo-1610030469983-98e550d6193c', description: 'A soft sweetheart curve with delicate hand-finished detailing. A lovely starting point for a celebration blouse.' },
    { id: 'gulabi', name: 'Gulabi Garden', category: 'Sweetheart Neckline', price: 2200, image: 'photo-1617627143750-d86bc21e42bb', description: 'A romantic neckline designed to frame the collarbone, finished with a subtle floral flourish.' },
    { id: 'noor', name: 'Noor of the Night', category: 'Sweetheart Neckline', price: 2600, image: 'photo-1583391733956-6c78276477e3', description: 'A little evening drama in a timeless sweetheart silhouette, imagined with luminous handwork.' },
    { id: 'lotus', name: 'Lotus on Water', category: 'Boat Neck', price: 1900, image: 'photo-1610189012906-4c48b8ab5c34', description: 'A graceful boat neckline with an elegant, clean line and room for your favourite embroidery.' },
    { id: 'jaipur', name: 'Jaipur Blue Hour', category: 'Boat Neck', price: 2100, image: 'photo-1610030469983-98e550d6193c', description: 'An easy, polished boat neck that pairs beautifully with a statement dupatta and heirloom jewellery.' },
    { id: 'chandni', name: 'Chandni Chowk', category: 'Boat Neck', price: 2350, image: 'photo-1583391733956-6c78276477e3', description: 'A classic boat neckline with a delicate border detail, made for long evenings and bright lights.' },
    { id: 'gulmohar', name: 'Gulmohar Back', category: 'Deep Back Neck', price: 2450, image: 'photo-1617627143750-d86bc21e42bb', description: 'A considered deep-back shape with a beautiful finishing detail. Designed to feel secure and special.' },
    { id: 'starlit', name: 'Starlit Dori', category: 'Deep Back Neck', price: 2800, image: 'photo-1610189012906-4c48b8ab5c34', description: 'A softly sculpted back with a traditional dori detail, ready to be tailored to your comfort.' },
    { id: 'sunehri', name: 'Sunehri Sleeves', category: 'Sleeve Patterns', price: 1750, image: 'photo-1583391733956-6c78276477e3', description: 'Statement sleeves with a touch of golden handwork, made to bring a little movement to your look.' },
    { id: 'parijat', name: 'Parijat Petals', category: 'Sleeve Patterns', price: 1950, image: 'photo-1610030469983-98e550d6193c', description: 'A soft, gathered sleeve inspired by morning blooms. Light, expressive and beautifully wearable.' },
    { id: 'gulal', name: 'Gulal Garden Border', category: 'Lehenga Borders', price: 3200, image: 'photo-1610189012906-4c48b8ab5c34', description: 'A festive lehenga border composition with room for colour, texture and intricate threadwork.' },
    { id: 'mogra', name: 'Mogra & Gold', category: 'Lehenga Borders', price: 3600, image: 'photo-1617627143750-d86bc21e42bb', description: 'An elegant border with a warm, heirloom feel, thoughtfully balanced for a modern celebration.' }
  ];

  const grid = document.getElementById('design-grid');
  const modal = document.getElementById('design-modal');
  const modalImage = document.getElementById('modal-image');
  const selectButton = document.getElementById('modal-select-design');
  let activeDesign = null;
  let previousFocus = null;

  const imageUrl = (image, width = 700) =>
    `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=82`;

  function render(filter = 'All') {
    const filtered = filter === 'All' ? designs : designs.filter((design) => design.category === filter);
    grid.replaceChildren();
    filtered.forEach((design, index) => {
      const card = document.createElement('article');
      card.className = 'design-card';
      card.innerHTML = `
        <div class="design-image-wrap">
          <img src="${imageUrl(design.image)}" alt="${design.name}, ${design.category.toLowerCase()} design" loading="lazy">
          <span class="design-number">DESIGN 0${designs.indexOf(design) + 1}</span>
          <button class="design-open" type="button" data-design="${design.id}" aria-label="View ${design.name} details">View design details ↗</button>
        </div>
        <div class="design-card-copy">
          <div><h3>${design.name}</h3><p>${design.category}</p></div>
          <span class="design-price">From ${window.BloomThread.formatCurrency(design.price)}</span>
        </div>`;
      grid.append(card);
    });
  }

  function openDesign(design) {
    activeDesign = design;
    previousFocus = document.activeElement;
    modalImage.src = imageUrl(design.image, 900);
    modalImage.alt = `${design.name} ${design.category.toLowerCase()} design`;
    document.getElementById('modal-category').textContent = design.category.toUpperCase();
    document.getElementById('modal-title').textContent = design.name;
    document.getElementById('modal-description').textContent = design.description;
    document.getElementById('modal-price').textContent = `From ${window.BloomThread.formatCurrency(design.price)}`;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    selectButton.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }

  document.querySelector('.filter-row').addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    document.querySelectorAll('.filter-button').forEach((item) => item.classList.toggle('active', item === button));
    render(button.dataset.filter);
  });
  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-design]');
    if (!button) return;
    const design = designs.find((item) => item.id === button.dataset.design);
    if (design) openDesign(design);
  });
  modal.addEventListener('click', (event) => {
    if (event.target.closest('[data-close-modal]')) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });
  selectButton.addEventListener('click', () => {
    if (!activeDesign) return;
    window.dispatchEvent(new CustomEvent('bloom:select-design', { detail: activeDesign }));
    closeModal();
    document.getElementById('customizer').scrollIntoView({ behavior: 'smooth' });
    window.BloomThread.showToast(`${activeDesign.name} added to your design.`);
  });
  render();
})();
