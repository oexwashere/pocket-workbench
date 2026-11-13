import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root) || !['/index.html', '/src/app.js', '/src/tools.js', '/src/style.css'].includes(pathname === '/' ? '/index.html' : pathname)) {
      res.writeHead(404).end('Not found'); return;
    }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': `${types[path.extname(file)] || 'text/plain'}; charset=utf-8`, 'X-Content-Type-Options': 'nosniff' });
    res.end(body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log('Pocket Workbench listening on port ' + (process.env.PORT || 4173)));
