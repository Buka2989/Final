// Small local static server. No npm dependencies are needed.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const port = Number(process.env.PORT) || 3000;
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.md': 'text/plain; charset=utf-8' };
const server = http.createServer(function (request, response) {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch (error) { response.writeHead(400); response.end('Bad request'); return; }
  const filename = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!filename.startsWith(root + path.sep) || pathname.split(/[\\/]/).some(part => part.startsWith('.'))) {
    response.writeHead(403); response.end('Forbidden'); return;
  }
  fs.readFile(filename, function (error, content) {
    if (error) { response.writeHead(404); response.end('Not found'); return; }
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(request.method === 'HEAD' ? undefined : content);
  });
});
server.on('error', function (error) {
  console.error(error.code === 'EADDRINUSE' ? 'Port ' + port + ' is busy. Set PORT to a free port and try again.' : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', function () { console.log('Arena ID is ready: http://127.0.0.1:' + port + '\nPress Ctrl+C to stop.'); });
