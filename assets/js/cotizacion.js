const form = document.getElementById('cotizacion');
if (form) {
  const selected = new URLSearchParams(location.search).get('servicio');
  const input = form.querySelector('[name="servicio"]');
  if (selected && input && !input.value) input.value = selected.slice(0, 120);
  form.querySelector('#startedAt').value = String(Date.now());
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector('#submit-cotizacion');
    const status = form.querySelector('#cotizacion-estado');
    const files = [...form.querySelector('[name="adjuntos"]').files];
    if (files.length > 3 || files.some(f => f.size > 1048576) ||
        files.reduce((total, f) => total + f.size, 0) > 3145728) {
      status.textContent = 'Adjunta hasta 3 archivos de máximo 1 MB cada uno.';
      return;
    }
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (files.some(f => !allowed.includes(f.type))) {
      status.textContent = 'Solo se permiten archivos PDF, JPG, PNG o WebP.';
      return;
    }
    button.disabled = true;
    status.textContent = 'Enviando solicitud…';
    try {
      const attachments = await Promise.all(files.map(file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({filename: file.name, type: file.type, content: String(reader.result).split(',')[1]});
        reader.onerror = reject;
        reader.readAsDataURL(file);
      })));
      const payload = Object.fromEntries(new FormData(form).entries());
      delete payload.adjuntos;
      payload.attachments = attachments;
      const response = await fetch('/.netlify/functions/cotizaciones', {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw Error(result.error || 'No se pudo enviar la solicitud.');
      form.reset();
      form.querySelector('#startedAt').value = String(Date.now());
      status.textContent = '¡Solicitud recibida! Tu folio es ' + result.folio + (result.confirmationSent ? '. Te enviamos una confirmación al correo.' : '. Nuestro equipo recibió la solicitud; la confirmación por correo no pudo enviarse.');
    } catch (error) {
      status.textContent = error.message || 'Error al enviar. Intenta nuevamente.';
    } finally {
      button.disabled = false;
    }
  });
}
