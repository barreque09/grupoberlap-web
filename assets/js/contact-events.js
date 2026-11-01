/* Grupo BERLAP · Eventos de contacto para Google Analytics 4.
   No recopila datos personales ni transmite nada si gtag no está configurado. */
(function () {
  'use strict';
  function emit(name, method) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, {
      contact_method: method,
      page_path: window.location.pathname
    });
  }
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (/^https:\/\/(?:api\.)?wa\.me\//i.test(href) || /^https:\/\/api\.whatsapp\.com\//i.test(href)) {
      emit('contact_click', 'whatsapp');
    } else if (/^tel:/i.test(href)) {
      emit('contact_click', 'telephone');
    } else if (/^mailto:/i.test(href)) {
      emit('contact_click', 'email');
    }
  });
  var quoteForm = document.getElementById('cotizacion');
  if (quoteForm) quoteForm.addEventListener('submit', function () {
    emit('quote_form_submit', 'whatsapp');
  });
})();
