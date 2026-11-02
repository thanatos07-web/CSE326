(() => {
  const toastRegion = document.getElementById('toast-region');

  window.BloomThread = {
    showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      toastRegion.append(toast);
      window.setTimeout(() => toast.remove(), 3600);
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount);
    }
  };

  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('primary-navigation');
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    navigation.classList.toggle('open', !expanded);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      navigation.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.getElementById('current-year').textContent = String(new Date().getFullYear());

  const whatsappNumber = '919876543210';
  document.getElementById('whatsapp-link').href =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Bloom & Thread! I would love to know more about a custom outfit.')}`;
})();
