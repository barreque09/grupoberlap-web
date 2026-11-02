// Netlify serverless adapter for the shared quote endpoint.
const quoteHandler = require('../../api/cotizaciones.js');
exports.handler = async (event) => {
  const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k,v]) => [k.toLowerCase(),v]));
  const req = {
    method: event.httpMethod,
    headers,
    body: (() => {
      try {
        const raw = event.isBase64Encoded ? Buffer.from(event.body||'', 'base64').toString('utf8') : event.body;
        return JSON.parse(raw || '{}');
      } catch { return {}; }
    })()
  };
  let statusCode = 200, responseHeaders = {};
  const res = {
    setHeader(name, value) { responseHeaders[name] = value; return this; },
    status(code) { statusCode = code; return this; },
    json(body) { return {statusCode, headers: {...responseHeaders,'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify(body)}; }
  };
  return quoteHandler(req,res);
};
