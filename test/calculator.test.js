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
  powerValue,
  logValue,
  lnValue,
  asinValue,
  acosValue,
  atanValue,
  factorialValue,
  toRadians,
  fromRadians,
  formatNumber,
  createMemoryState,
  createHistoryState,
  convertTemperature,
  convertLength,
  convertWeight,
  convertArea,
  convertVolume,
  convertSpeed,
  convertTime,
  convertData,
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
  assert.equal(calculateExpression('2.5 + 3.5 * 2'), 9.5);
  assert.equal(calculateExpression('(2 + 3) * 4'), 20);
  assert.equal(calculateExpression('-5 + 3'), -2);
  assert.equal(calculateExpression('5 * (-2 + 3)'), 5);
  assert.equal(calculateExpression('2 ^ 3 + 1'), 9);
  assert.equal(calculateExpression('pi + e'), Math.PI + Math.E);
});

test('calculateExpression rejects invalid input and division by zero', () => {
  assert.throws(() => calculateExpression('2 + * 3'), /Invalid expression|Unsupported operator/);
  assert.throws(() => calculateExpression('((2 + 3)'), /Invalid expression|Unmatched parenthesis/);
  assert.throws(() => calculateExpression('5 / 0'), /Division by zero/);
});

test('scientific helpers work correctly', () => {
  assert.equal(sqrtValue(9), 3);
  assert.equal(squareValue(4), 16);
  assert.equal(reciprocalValue(4), 0.25);
  assert.equal(percentValue(250), 2.5);
  assert.equal(powerValue(2, 3), 8);
  assert.equal(logValue(100), 2);
  assert.equal(lnValue(Math.E), 1);
  assert.equal(asinValue(0.5), 30);
  assert.equal(acosValue(0.5), 60);
  assert.equal(atanValue(1), 45);
  assert.equal(factorialValue(5), 120);
  assert.equal(toRadians(90, 'deg'), Math.PI / 2);
  assert.equal(toRadians(1, 'rad'), 1);
  assert.equal(fromRadians(Math.PI / 2, 'deg'), 90);
  assert.equal(fromRadians(1, 'rad'), 1);
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
  assert.equal(history.select(1), '30 / 5');
});

test('history state can delete a single entry and persist it', () => {
  const storage = {};
  const originalStorage = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key) => storage[key] ?? null,
      setItem: (key, value) => {
        storage[key] = value;
      },
      removeItem: (key) => {
        delete storage[key];
      },
    },
    configurable: true,
  });

  try {
    const history = createHistoryState('test-history');
    history.add('10 + 5');
    history.add('20 + 3');

    history.remove(0);
    assert.deepEqual(history.getEntries(), ['20 + 3']);
    assert.equal(JSON.parse(storage['test-history'])[0], '20 + 3');
  } finally {
    if (originalStorage) {
      Object.defineProperty(globalThis, 'localStorage', {
        value: originalStorage,
        configurable: true,
      });
    } else {
      delete globalThis.localStorage;
    }
  }
});

test('memory state supports a full reset action', () => {
  const memory = createMemoryState();

  memory.add(20);
  memory.clear();

  assert.equal(memory.recall(), 0);
});

test('temperature conversions work for common units', () => {
  assert.equal(convertTemperature(32, 'f', 'c'), 0);
  assert.equal(convertTemperature(100, 'c', 'f'), 212);
  assert.equal(convertTemperature(273.15, 'k', 'c'), 0);
});

test('length conversions work for metric units', () => {
  assert.equal(convertLength(100, 'cm', 'm'), 1);
  assert.equal(convertLength(2, 'km', 'm'), 2000);
  assert.equal(convertLength(500, 'mm', 'cm'), 50);
});

test('advanced conversions work for common categories', () => {
  assert.equal(convertWeight(2.2, 'kg', 'lb'), 4.850169768067307);
  assert.equal(convertArea(1, 'm2', 'ft2'), 10.763910416709722);
  assert.equal(convertVolume(1, 'l', 'ml'), 1000);
  assert.equal(convertSpeed(100, 'km/h', 'm/s'), 27.77777777777778);
  assert.equal(convertTime(2, 'h', 'min'), 120);
  assert.equal(convertData(1, 'mb', 'kb'), 1024);
});
