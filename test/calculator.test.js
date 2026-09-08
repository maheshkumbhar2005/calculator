import test from 'node:test';
import assert from 'node:assert/strict';

import {
  add,
  subtract,
  multiply,
  divide,
  calculateExpression,
  sqrtValue,
  squareValue,
  reciprocalValue,
  percentValue,
  formatNumber,
  createMemoryState,
  createHistoryState,
} from '../calculator.js';

test('add adds numbers correctly', () => {
  assert.equal(add(2, 3), 5);
});

test('subtract subtracts numbers correctly', () => {
  assert.equal(subtract(10, 4), 6);
});

test('multiply multiplies numbers correctly', () => {
  assert.equal(multiply(6, 7), 42);
});

test('divide divides numbers correctly', () => {
  assert.equal(divide(20, 4), 5);
});

test('calculateExpression evaluates arithmetic expressions', () => {
  assert.equal(calculateExpression('12 + 5 * 3'), 27);
  assert.equal(calculateExpression('30 / 5 + 2'), 8);
});

test('scientific helpers work correctly', () => {
  assert.equal(sqrtValue(9), 3);
  assert.equal(squareValue(4), 16);
  assert.equal(reciprocalValue(4), 0.25);
  assert.equal(percentValue(250), 2.5);
});

test('number formatting produces readable output', () => {
  assert.equal(formatNumber(12345.678), '12,345.678');
  assert.equal(formatNumber(0.0000123), '0.0000123');
});

test('memory state supports add, subtract, and recall', () => {
  const memory = createMemoryState();

  assert.equal(memory.add(25), 25);
  assert.equal(memory.subtract(10), 15);
  assert.equal(memory.recall(), 15);
  assert.equal(memory.clear(), 0);
});

test('history state tracks expression entries', () => {
  const history = createHistoryState();

  history.add('12 + 5');
  history.add('30 / 5');

  assert.deepEqual(history.getEntries(), ['12 + 5', '30 / 5']);
});
