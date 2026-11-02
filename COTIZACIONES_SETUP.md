# Formulario de cotizaciones — Configuración

Este cambio se encuentra preparado en una rama de revisión. No estará operativo en producción hasta configurar los servicios e integrar la rama.

## Variables en Vercel
- `RESEND_API_KEY`: API key de Resend (crearla desde la cuenta autorizada).
- `QUOTE_FROM_EMAIL`: remitente de un dominio validado en Resend, por ejemplo `Cotizaciones Grupo Berlap <cotizaciones@grupoberlap.com>`.
- `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`: base Redis REST de Upstash para el folio consecutivo y el límite de envío.

El dominio `grupoberlap.com` debe estar verificado en Resend mediante DNS para poder enviar a cualquier cliente.
El correo receptor está definido en el servidor como `ventas@grupoberlap.com`.

## Prueba de aceptación
1. Configura las variables en el proyecto de Vercel y despliega la rama de pruebas.
2. Llena el formulario con una cuenta real, PDF pequeño y fotografía.
3. Comprueba llegada a ventas, adjuntos, folio y correo de confirmación.
4. Comprueba que el botón de WhatsApp sigue independiente.
5. Comprueba campos requeridos, límites de adjuntos y diseño móvil.
6. Integra la rama solo después de la prueba.

Los folios son atómicos y consecutivos por año, pero pueden tener saltos si falla el correo después de reservar un número. Esta solución no incorpora aún una bandeja de gestión comercial ni almacenamiento permanente de solicitudes.
