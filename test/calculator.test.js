import test from 'node:test';
import assert from 'node:assert/strict';

import { add, subtract, multiply, divide, calculateExpression } from '../calculator.js';

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
