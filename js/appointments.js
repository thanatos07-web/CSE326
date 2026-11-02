(() => {
  const storageKey = 'bloom-thread-appointments';
  const form = document.getElementById('appointment-form');
  const dateInput = document.getElementById('appointment-date');
  const errorMessage = document.getElementById('form-error');
  const historyList = document.getElementById('appointment-list');
  const confirmation = document.getElementById('booking-confirmation');
  const submitButton = form.querySelector('[type="submit"]');

  function readAppointments() {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return [];
    try {
      const appointments = JSON.parse(saved);
      if (!Array.isArray(appointments)) throw new Error('Stored appointments are not a list.');
      return appointments;
    } catch (error) {
      window.BloomThread.showToast('Saved appointment history could not be read. Please clear this site’s saved data to continue.');
      console.error('Unable to read saved appointment history:', error);
      throw error;
    }
  }

  function saveAppointments(appointments) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(appointments));
      return true;
    } catch (error) {
      window.BloomThread.showToast('Your browser could not save this appointment. Check local storage settings and try again.');
      console.error('Unable to save appointment:', error);
      return false;
    }
  }

  function formatDate(dateString) {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(`${dateString}T12:00:00`));
  }

  function renderHistory() {
    const appointments = readAppointments();
    historyList.replaceChildren();
    if (!appointments.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-history';
      empty.textContent = 'Your saved appointment requests will appear here.';
      historyList.append(empty);
      return;
    }
    appointments.forEach((appointment) => {
      const card = document.createElement('article');
      card.className = 'appointment-item';
      const details = document.createElement('div');
      const heading = document.createElement('h3');
      heading.textContent = `${appointment.category} · ${appointment.name}`;
      const meta = document.createElement('p');
      meta.textContent = `${formatDate(appointment.date)} at ${appointment.time} · ${appointment.mobile}${appointment.email ? ` · ${appointment.email}` : ''}`;
      details.append(heading, meta);
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.textContent = 'Cancel request';
      cancel.setAttribute('aria-label', `Cancel appointment request for ${appointment.name} on ${formatDate(appointment.date)}`);
      cancel.addEventListener('click', () => cancelAppointment(appointment.id));
      card.append(details, cancel);
      historyList.append(card);
    });
  }

  function cancelAppointment(id) {
    const appointments = readAppointments();
    const updated = appointments.filter((appointment) => appointment.id !== id);
    if (updated.length === appointments.length) {
      window.BloomThread.showToast('That appointment could not be found in your saved history.');
      return;
    }
    if (!saveAppointments(updated)) return;
    renderHistory();
    window.BloomThread.showToast('Appointment request cancelled.');
  }

  function todayString() {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10);
  }

  dateInput.min = todayString();
  dateInput.addEventListener('change', () => {
    if (dateInput.value && dateInput.value < todayString()) {
      dateInput.setCustomValidity('Please choose today or a future date.');
    } else {
      dateInput.setCustomValidity('');
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    errorMessage.hidden = true;
    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());
    const requiredFields = ['name', 'mobile', 'category', 'date', 'time'];
    const missingField = requiredFields.find((field) => !String(values[field] || '').trim());
    if (missingField) {
      errorMessage.textContent = 'Please complete your name, mobile number, outfit category, date and preferred time.';
      errorMessage.hidden = false;
      form.elements.namedItem(missingField).focus();
      return;
    }
    if (!/^[+()\d\s-]{8,18}$/.test(String(values.mobile).trim())) {
      errorMessage.textContent = 'Please enter a valid mobile number (8–18 digits, spaces, +, brackets or hyphens).';
      errorMessage.hidden = false;
      form.elements.namedItem('mobile').focus();
      return;
    }
    if (values.email && !form.elements.namedItem('email').checkValidity()) {
      errorMessage.textContent = 'Please enter a valid email address or leave it blank.';
      errorMessage.hidden = false;
      form.elements.namedItem('email').focus();
      return;
    }
    if (values.date < todayString()) {
      dateInput.setCustomValidity('Please choose today or a future date.');
      dateInput.reportValidity();
      return;
    }
    dateInput.setCustomValidity('');
    const appointment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(values.name).trim(),
      mobile: String(values.mobile).trim(),
      email: String(values.email || '').trim(),
      date: String(values.date),
      time: String(values.time),
      category: String(values.category),
      requirements: String(values.requirements || '').trim(),
      createdAt: new Date().toISOString()
    };
    const appointments = readAppointments();
    if (!saveAppointments([appointment, ...appointments])) return;
    renderHistory();
    confirmation.textContent = `Thank you, ${appointment.name}. Your ${appointment.category.toLowerCase()} consultation request for ${formatDate(appointment.date)} at ${appointment.time} has been saved on this device. This demo request has not been sent to the boutique.`;
    confirmation.hidden = false;
    form.reset();
    dateInput.min = todayString();
    window.BloomThread.showToast('Your appointment request is saved on this device.');
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  renderHistory();
})();
