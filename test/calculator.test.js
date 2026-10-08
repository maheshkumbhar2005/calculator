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
  prepareResultForClipboard,
  formatHistoryEntry,
  parseHistoryEntry,
  exportHistoryAsCSV,
  exportHistoryAsTXT,
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

test('prepareResultForClipboard formats values cleanly', () => {
  assert.equal(prepareResultForClipboard('42'), '42');
  assert.equal(prepareResultForClipboard('  3.14  '), '3.14');
  assert.equal(prepareResultForClipboard(''), '0');
  assert.equal(prepareResultForClipboard(null), '0');
  assert.equal(prepareResultForClipboard(undefined), '0');
  assert.equal(prepareResultForClipboard(100), '100');
});

test('calculateExpression evaluates expressions with ANS', () => {
  assert.equal(calculateExpression('ans + 10', { ans: 5 }), 15);
  assert.equal(calculateExpression('2 * ans', 25), 50);
  assert.equal(calculateExpression('ans ^ 2', { ans: 4 }), 16);
  assert.equal(calculateExpression('ans / 2', { ans: 10 }), 5);
});

test('clear error handling throws specific error messages', () => {
  assert.throws(() => calculateExpression('10 / 0'), /Cannot divide by zero|Division by zero/);
  assert.throws(() => divide(10, 0), /Cannot divide by zero/);
  assert.throws(() => reciprocalValue(0), /Cannot divide by zero/);
  assert.throws(() => sqrtValue(-9), /Invalid input/);
  assert.throws(() => logValue(-5), /Invalid input/);
  assert.throws(() => lnValue(0), /Invalid input/);
  assert.throws(() => factorialValue(-3), /Invalid input/);
  assert.throws(() => factorialValue(3.14), /Invalid input/);
  assert.throws(() => asinValue(2), /Invalid input/);
  assert.throws(() => calculateExpression(null), /Invalid input/);
  assert.throws(() => calculateExpression(''), /Invalid expression/);
});

test('extended scientific calculations evaluate accurately', () => {
  assert.equal(logValue(1000), 3);
  assert.equal(lnValue(Math.E), 1);
  assert.equal(squareValue(8), 64);
  assert.equal(powerValue(5, 3), 125);
  assert.equal(factorialValue(0), 1);
  assert.equal(factorialValue(1), 1);
  assert.equal(factorialValue(6), 720);
  assert.equal(asinValue(1, 'deg'), 90);
  assert.equal(acosValue(1, 'deg'), 0);
  assert.equal(atanValue(0, 'deg'), 0);
  assert.equal(calculateExpression('pi * 2'), Math.PI * 2);
  assert.equal(calculateExpression('e * 3'), Math.E * 3);
});

test('history formatting and export work correctly', () => {
  const testDate = new Date('2026-10-08T12:45:00');
  const formatted = formatHistoryEntry('10 + 20', '30', testDate);
  assert.match(formatted, /10 \+ 20 = 30 —/);

  const parsed = parseHistoryEntry('10 + 20 = 30 — 12:45 PM');
  assert.equal(parsed.expression, '10 + 20');
  assert.equal(parsed.result, '30');
  assert.equal(parsed.timestamp, '12:45 PM');

  const history = createHistoryState('test-export-history');
  history.clear();
  history.add('10 + 20 = 30 — 12:45 PM');
  history.add('5 * 5 = 25 — 12:46 PM');

  const csv = history.exportAsCSV();
  assert.match(csv, /Expression,Result,Timestamp/);
  assert.match(csv, /"10 \+ 20","30","12:45 PM"/);

  const txt = history.exportAsTXT();
  assert.match(txt, /Calculation History/);
  assert.match(txt, /10 \+ 20 = 30 — 12:45 PM/);

  history.clear();
  assert.equal(history.getEntries().length, 0);
});

test('all unit converter categories handle bidirectional conversions', () => {
  // Length
  assert.equal(convertLength(1000, 'm', 'km'), 1);
  assert.equal(Math.round(convertLength(12, 'in', 'ft')), 1);
  // Weight
  assert.equal(convertWeight(1000, 'g', 'kg'), 1);
  assert.equal(convertWeight(16, 'oz', 'lb'), 1);
  // Temperature
  assert.equal(convertTemperature(0, 'c', 'f'), 32);
  assert.equal(convertTemperature(373.15, 'k', 'c'), 100);
  // Area
  assert.equal(convertArea(10000, 'cm2', 'm2'), 1);
  // Volume
  assert.equal(convertVolume(1000, 'ml', 'l'), 1);
  // Speed
  assert.equal(convertSpeed(36, 'km/h', 'm/s'), 10);
  // Time
  assert.equal(convertTime(60, 's', 'min'), 1);
  assert.equal(convertTime(24, 'h', 'day'), 1);
  // Data
  assert.equal(convertData(8, 'bit', 'byte'), 1);
  assert.equal(convertData(1024, 'gb', 'tb'), 1);
});
