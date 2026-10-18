function buildQuote(data) {
  const fields = [['nombre','Nombre'],['empresa','Empresa'],['correo','Correo'],['telefono','Teléfono'],['ubicacion','Ubicación'],['fecha','Fecha requerida'],['servicio','Servicio'],['mensaje','Detalle']];
  return 'Hola, quisiera cotizar una inspección con Grupo Berlap.\n\n' + fields.map(([key,label]) => label + ': ' + (String(data.get(key) || '').trim() || 'Por definir')).join('\n');
}
const form = document.getElementById('cotizacion');
if (form) form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  window.location.assign('https://wa.me/528338182922?text=' + encodeURIComponent(buildQuote(new FormData(form))));
});
