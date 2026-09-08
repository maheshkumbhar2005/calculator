import test from 'node:test';
import assert from 'node:assert/strict';

import { createServer } from '../server.js';

test('health endpoint works', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`);
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(data, { ok: true });
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});

test('calculator API evaluates expressions', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();
  try {
    const expression = '2+3*4';
    const response = await fetch(`http://127.0.0.1:${port}/api/calculate?expression=${encodeURIComponent(expression)}`);
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.result, 14);
    assert.equal(data.expression, expression);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});
