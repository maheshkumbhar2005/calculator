import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateExpression } from './calculator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
};

const createServer = () => {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');

    if (req.method === 'GET' && url.pathname === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/calculate') {
      const rawExpression = url.searchParams.get('expression') || '';
      const ansParam = url.searchParams.get('ans');
      const ansValue = ansParam !== null ? Number(ansParam) : 0;
      const expression = rawExpression.replace(/\s+/g, '');

      try {
        const result = calculateExpression(expression, { ans: ansValue });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ expression, result }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message || 'Invalid Expression' }));
      }
      return;
    }

    if (req.method === 'GET') {
      const safePath = path.normalize(url.pathname).replace(/^(\.\.[/\\])+/, '');
      const filePath = path.join(__dirname, safePath === '/' || safePath === '\\' ? 'index.html' : safePath);

      if (filePath.startsWith(__dirname) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  return server;
};

if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  const server = createServer();
  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => {
    console.log(`Calculator app and API listening on http://localhost:${port}`);
  });
}

export { createServer };

