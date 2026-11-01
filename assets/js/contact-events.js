/* Grupo BERLAP: eventos de intención de contacto, sin datos personales. */
(function () {
  'use strict';
  function track(name, method) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, {
      contact_method: method,
      page_path: window.location.pathname
    });
  }
  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (/^https:\/\/(?:api\.)?wa\.me\//i.test(href) || /^https:\/\/api\.whatsapp\.com\//i.test(href)) {
      track('whatsapp_click', 'whatsapp');
      track('contact_click', 'whatsapp');
    } else if (/^tel:/i.test(href)) {
      track('phone_click', 'telephone');
      track('contact_click', 'telephone');
    } else if (/^mailto:/i.test(href)) {
      track('email_click', 'email');
      track('contact_click', 'email');
    }
  });
  const form = document.getElementById('cotizacion');
  if (form) form.addEventListener('submit', function () {
    if (!form.checkValidity()) return;
    track('quote_form_submit', 'whatsapp');
  });
})();
