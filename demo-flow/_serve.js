// Tiny static server so you can open the demo flow on your phone over wifi.
// Run: node demo-flow/_serve.js   (then open http://<your-LAN-ip>:5050 on the phone)
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname, PORT = 5050;
const TYPES = { '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.js': 'text/javascript', '.css': 'text/css' };
http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p === '/') p = '/index.html';
  const fp = path.join(ROOT, p);
  if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(fp)] || 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(fp).pipe(res);
}).listen(PORT, '0.0.0.0', () => console.log('demo-flow serving on 0.0.0.0:' + PORT));
