// Server-side quote handler used by Netlify Functions. Configure RESEND_API_KEY, QUOTE_FROM_EMAIL,
// UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN en Environment Variables.
const DESTINATION = 'ventas@grupoberlap.com';
const TYPES = new Set(['application/pdf','image/jpeg','image/png','image/webp']);
const clean = (v, max=200) => typeof v === 'string' ? v.trim().slice(0,max) : '';
const escapeHtml = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const redis = async (command) => {
  const r = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
    method:'POST',
    headers:{Authorization:'Bearer '+process.env.UPSTASH_REDIS_REST_TOKEN,'Content-Type':'application/json'},
    body:JSON.stringify(command)
  });
  if(!r.ok) throw Error('Error en contador de folios');
  const data=await r.json();
  if(data.error) throw Error('Error en contador de folios');
  return data.result;
};
async function sendMail(message) {
  const response=await fetch('https://api.resend.com/emails',{
    method:'POST',
    headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},
    body:JSON.stringify(message)
  });
  if(!response.ok) throw Error('No se pudo enviar el correo');
}
module.exports = async (req,res) => {
  if(req.method!=='POST') return res.status(405).json({error:'Método no permitido'});
  res.setHeader('Cache-Control','no-store');
  if(!process.env.RESEND_API_KEY || !process.env.QUOTE_FROM_EMAIL ||
     !process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN)
    return res.status(503).json({error:'El envío aún no está habilitado. Comunícate a ventas@grupoberlap.com.'});
  try {
    const b=req.body||{};
    if(clean(b.website)) return res.status(200).json({folio:'SOLICITUD-RECIBIDA'});
    const startedAt=Number(b.startedAt);
    if(!Number.isFinite(startedAt)||Date.now()-startedAt<3000||Date.now()-startedAt>86400000)
      return res.status(400).json({error:'Actualiza la página e intenta nuevamente.'});
    const name=clean(b.nombre,120), email=clean(b.correo,254).toLowerCase(),
      company=clean(b.empresa,140), phone=clean(b.telefono,35),
      location=clean(b.ubicacion,180), date=clean(b.fecha,20),
      service=clean(b.servicio,150), details=clean(b.mensaje,5000);
    if(!name||!phone||!location||!details||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({error:'Revisa los campos obligatorios.'});
    const files=b.attachments||[];
    if(!Array.isArray(files)||files.length>3) return res.status(400).json({error:'Demasiados archivos adjuntos.'});
    let size=0;
    const attachments=[];
    for(const f of files){
      if(!f || !TYPES.has(f.type) || typeof f.content!=='string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(f.content) ||
         f.content.length>1400000 || !/^[\w .()\-áéíóúÁÉÍÓÚñÑ]{1,100}$/.test(f.filename))
        return res.status(400).json({error:'Archivo adjunto no válido.'});
      const buffer=Buffer.from(f.content,'base64');
      if(buffer.length>1048576) return res.status(400).json({error:'Cada archivo debe ser de máximo 1 MB.'});
      size+=buffer.length;
      attachments.push({filename:f.filename,content:f.content});
    }
    if(size>3145728) return res.status(400).json({error:'Máximo 3 MB en adjuntos.'});
    const ip=clean((req.headers['x-forwarded-for']||'').split(',')[0],100)||'unknown';
    const crypto=require('crypto');
    const ipKey='cotiza:rate:'+crypto.createHash('sha256').update(ip).digest('hex').slice(0,24);
    const attempts=Number(await redis(['INCR',ipKey]));
    if(attempts===1) await redis(['EXPIRE',ipKey,'3600']);
    if(attempts>8) return res.status(429).json({error:'Límite de solicitudes alcanzado. Intenta más tarde.'});
    const year=new Date().getUTCFullYear();
    const number=Number(await redis(['INCR','cotiza:folio:'+year]));
    const folio='COT-'+year+'-'+String(number).padStart(4,'0');
    const rows=[['Folio',folio],['Nombre',name],['Correo',email],['Empresa',company],
      ['Teléfono',phone],['Ubicación',location],['Fecha solicitada',date],
      ['Servicio',service],['Detalles',details]];
    const table=rows.map(([a,v])=>'<tr><th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">'+escapeHtml(a)+'</th><td style="padding:8px;border-bottom:1px solid #ddd;white-space:pre-wrap">'+escapeHtml(v||'No indicado')+'</td></tr>').join('');
    const from=process.env.QUOTE_FROM_EMAIL;
    await sendMail({
      from: 'Grupo Berlap - Cotizaciones <'+from+'>', to:[DESTINATION],
      subject:'BERLAP | Solicitud web '+folio,
      html:'<h2>Solicitud de cotización · Grupo Berlap</h2><table>'+table+'</table>',
      attachments
    });
    // El envío al cliente se intenta separadamente: no bloquear solicitudes recibidas por fallos de confirmación.
    let confirmationSent=true;
    try{
      await sendMail({from:'Grupo Berlap <'+from+'>',to:[email],subject:'Confirmación de solicitud '+folio+' | Grupo Berlap',
        html:'<h2>Gracias por contactar a Grupo Berlap</h2><p>Hemos recibido tu solicitud de cotización con folio <strong>'+escapeHtml(folio)+'</strong>.</p><p>Nuestro equipo revisará los detalles y responderá a este correo.</p><p>Grupo Berlap · ventas@grupoberlap.com</p>'});
    }catch(e){confirmationSent=false;console.error('Error enviando confirmación',folio);}
    return res.status(200).json({folio,confirmationSent});
  }catch(e){
    console.error('Error en cotizaciones',e);
    return res.status(500).json({error:'No se pudo enviar la solicitud. Intenta nuevamente o escribe a ventas@grupoberlap.com.'});
  }
};
