import http from 'node:http';
import { calculateExpression } from './calculator.js';

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
      const expression = rawExpression.replace(/\s+/g, '');

      try {
        const result = calculateExpression(expression);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ expression, result }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message || 'Invalid expression' }));
      }
      return;
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
    console.log(`Calculator API listening on http://localhost:${port}`);
  });
}

export { createServer };
