# Grupo BERLAP: solicitudes de cotización por correo

Este cambio convierte el formulario de `contacto.html` en un formulario HTML de **Netlify Forms**. El botón de WhatsApp sigue disponible como vía independiente.

## Requisitos antes de activar en producción

1. **Confirmar alojamiento**: este mecanismo solo recibe solicitudes si `www.grupoberlap.com` se publica mediante **Netlify**. No funciona automáticamente en GitHub Pages ni Vercel.
2. En el proyecto correspondiente de Netlify, abrir **Forms** y comprobar que la **detección de formularios** esté activada. Si se acaba de activar, publicar un nuevo deploy.
3. Integrar este cambio y desplegarlo en Netlify. Comprobar que en **Forms** se detecta un formulario llamado `cotizacion`.
4. Abrir **Forms → Submission notifications → Add notification → Email notification** y configurar el destinatario **ventas@grupoberlap.com** para `cotizacion`. Guardar la notificación. La dirección debe ser un buzón activo.
5. Abrir `https://www.grupoberlap.com/contacto.html`, hacer una solicitud de prueba y verificar **ambas cosas**: que aparezca en la lista de envíos de Netlify y que llegue la notificación a `ventas@grupoberlap.com` (revisar también spam).
6. Confirmar el funcionamiento en móvil. Probar también el enlace de WhatsApp por separado.

## Comportamiento

- El formulario utiliza `method="POST"` y `data-netlify="true"`, con el nombre `cotizacion`.
- Los datos del cliente se entregan al procesamiento de Netlify, no al navegador ni al código de GitHub.
- Si Netlify acepta el envío, redirige a `/gracias.html`.
- El campo oculto `bot-field` es un honeypot antispam.
- `assets/js/cotizacion.js` solo preselecciona el servicio solicitado por URL; **no intercepta ni simula el envío**.
- Los eventos de Analytics registran un **intento** de envío, no una confirmación de entrega.

## Si el sitio no está en Netlify

No fusionar este cambio como solución completa: será necesario implementar un receptor seguro de formularios en el proveedor de alojamiento (por ejemplo, una función serverless y un servicio SMTP/API de correo). No colocar contraseñas ni claves de correo en JavaScript público.

**Importante**: este repositorio no permite verificar ni activar notificaciones del panel de Netlify; el cambio de código por sí solo NO confirma que estén llegando correos.
