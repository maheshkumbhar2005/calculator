function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero (Division by zero is not allowed)');
  }
  return a / b;
}

function sqrtValue(value) {
  if (value < 0) {
    throw new Error('Invalid input');
  }
  return Math.sqrt(value);
}

function squareValue(value) {
  return value * value;
}

function reciprocalValue(value) {
  if (value === 0) {
    throw new Error('Cannot divide by zero (Division by zero is not allowed)');
  }
  return 1 / value;
}

function percentValue(value) {
  return value / 100;
}

function powerValue(base, exponent) {
  return Math.pow(base, exponent);
}

function toRadians(value, mode = 'deg') {
  if (mode === 'rad') {
    return value;
  }
  return (value * Math.PI) / 180;
}

function fromRadians(value, mode = 'deg') {
  if (mode === 'rad') {
    return value;
  }
  return (value * 180) / Math.PI;
}

function logValue(value) {
  if (value <= 0) {
    throw new Error('Invalid input');
  }
  return Math.log10(value);
}

function lnValue(value) {
  if (value <= 0) {
    throw new Error('Invalid input');
  }
  return Math.log(value);
}

function asinValue(value, mode = 'deg') {
  if (value < -1 || value > 1) {
    throw new Error('Invalid input');
  }
  return Number(fromRadians(Math.asin(value), mode).toFixed(10));
}

function acosValue(value, mode = 'deg') {
  if (value < -1 || value > 1) {
    throw new Error('Invalid input');
  }
  return Number(fromRadians(Math.acos(value), mode).toFixed(10));
}

function atanValue(value, mode = 'deg') {
  return Number(fromRadians(Math.atan(value), mode).toFixed(10));
}

function factorialValue(value) {
  if (!Number.isInteger(value) || value < 0 || value > 170) {
    throw new Error('Invalid input');
  }

  let result = 1;
  for (let i = 2; i <= value; i += 1) {
    result *= i;
  }
  return result;
}

function convertTemperature(value, fromUnit, toUnit) {
  const celsius = {
    c: value,
    f: (value - 32) * (5 / 9),
    k: value - 273.15,
  };

  if (fromUnit === 'c') {
    return {
      c: value,
      f: (value * 9) / 5 + 32,
      k: value + 273.15,
    }[toUnit];
  }

  if (fromUnit === 'f') {
    const inCelsius = celsius.f;
    return {
      c: inCelsius,
      f: value,
      k: inCelsius + 273.15,
    }[toUnit];
  }

  if (fromUnit === 'k') {
    const inCelsius = value - 273.15;
    return {
      c: inCelsius,
      f: (inCelsius * 9) / 5 + 32,
      k: value,
    }[toUnit];
  }

  throw new Error('Unsupported temperature unit');
}

function convertLength(value, fromUnit, toUnit) {
  const meters = {
    mm: value / 1000,
    cm: value / 100,
    m: value,
    km: value * 1000,
    in: value * 0.0254,
    ft: value * 0.3048,
    yd: value * 0.9144,
  };

  const inMeters = meters[fromUnit];
  if (inMeters === undefined) {
    throw new Error('Unsupported length unit');
  }

  const converted = {
    mm: inMeters * 1000,
    cm: inMeters * 100,
    m: inMeters,
    km: inMeters / 1000,
    in: inMeters / 0.0254,
    ft: inMeters / 0.3048,
    yd: inMeters / 0.9144,
  };

  if (converted[toUnit] === undefined) {
    throw new Error('Unsupported length unit');
  }

  return converted[toUnit];
}

function convertWeight(value, fromUnit, toUnit) {
  const grams = {
    mg: value / 1000,
    g: value,
    kg: value * 1000,
    lb: value * 453.59237,
    oz: value * 28.349523125,
  };

  const inGrams = grams[fromUnit];
  if (inGrams === undefined) {
    throw new Error('Unsupported weight unit');
  }

  const converted = {
    mg: inGrams * 1000,
    g: inGrams,
    kg: inGrams / 1000,
    lb: inGrams / 453.59237,
    oz: inGrams / 28.349523125,
  };

  if (converted[toUnit] === undefined) {
    throw new Error('Unsupported weight unit');
  }

  return converted[toUnit];
}

function convertArea(value, fromUnit, toUnit) {
  const squareMeters = {
    mm2: value / 1_000_000,
    cm2: value / 10_000,
    m2: value,
    km2: value * 1_000_000,
    in2: value * 0.00064516,
    ft2: value * 0.09290304,
    yd2: value * 0.83612736,
  };

  const inSquareMeters = squareMeters[fromUnit];
  if (inSquareMeters === undefined) {
    throw new Error('Unsupported area unit');
  }

  const converted = {
    mm2: inSquareMeters * 1_000_000,
    cm2: inSquareMeters * 10_000,
    m2: inSquareMeters,
    km2: inSquareMeters / 1_000_000,
    in2: inSquareMeters / 0.00064516,
    ft2: inSquareMeters / 0.09290304,
    yd2: inSquareMeters / 0.83612736,
  };

  if (converted[toUnit] === undefined) {
    throw new Error('Unsupported area unit');
  }

  return converted[toUnit];
}

function convertVolume(value, fromUnit, toUnit) {
  const liters = {
    ml: value / 1000,
    l: value,
    m3: value * 1000,
    cup: value * 0.236588,
    pint: value * 0.473176,
    gal: value * 3.785411784,
  };

  const inLiters = liters[fromUnit];
  if (inLiters === undefined) {
    throw new Error('Unsupported volume unit');
  }

  const converted = {
    ml: inLiters * 1000,
    l: inLiters,
    m3: inLiters / 1000,
    cup: inLiters / 0.236588,
    pint: inLiters / 0.473176,
    gal: inLiters / 3.785411784,
  };

  if (converted[toUnit] === undefined) {
    throw new Error('Unsupported volume unit');
  }

  return converted[toUnit];
}

function convertSpeed(value, fromUnit, toUnit) {
  const metersPerSecond = {
    'm/s': value,
    'km/h': value / 3.6,
    mph: value * 0.44704,
    knot: value * 0.514444,
    'ft/s': value * 0.3048,
  };

  const inMetersPerSecond = metersPerSecond[fromUnit];
  if (inMetersPerSecond === undefined) {
    throw new Error('Unsupported speed unit');
  }

  const converted = {
    'm/s': inMetersPerSecond,
    'km/h': inMetersPerSecond * 3.6,
    mph: inMetersPerSecond / 0.44704,
    knot: inMetersPerSecond / 0.514444,
    'ft/s': inMetersPerSecond / 0.3048,
  };

  if (converted[toUnit] === undefined) {
    throw new Error('Unsupported speed unit');
  }

  return converted[toUnit];
}

function convertTime(value, fromUnit, toUnit) {
  const seconds = {
    ms: value / 1000,
    s: value,
    min: value * 60,
    h: value * 3600,
    day: value * 86400,
    week: value * 604800,
  };

  const inSeconds = seconds[fromUnit];
  if (inSeconds === undefined) {
    throw new Error('Unsupported time unit');
  }

  const converted = {
    ms: inSeconds * 1000,
    s: inSeconds,
    min: inSeconds / 60,
    h: inSeconds / 3600,
    day: inSeconds / 86400,
    week: inSeconds / 604800,
  };

  if (converted[toUnit] === undefined) {
    throw new Error('Unsupported time unit');
  }

  return converted[toUnit];
}

function convertData(value, fromUnit, toUnit) {
  const bytes = {
    bit: value / 8,
    byte: value,
    kb: value * 1024,
    mb: value * 1024 * 1024,
    gb: value * 1024 * 1024 * 1024,
    tb: value * 1024 * 1024 * 1024 * 1024,
  };

  const inBytes = bytes[fromUnit];
  if (inBytes === undefined) {
    throw new Error('Unsupported data unit');
  }

  const converted = {
    bit: inBytes * 8,
    byte: inBytes,
    kb: inBytes / 1024,
    mb: inBytes / (1024 * 1024),
    gb: inBytes / (1024 * 1024 * 1024),
    tb: inBytes / (1024 * 1024 * 1024 * 1024),
  };

  if (converted[toUnit] === undefined) {
    throw new Error('Unsupported data unit');
  }

  return converted[toUnit];
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  const abs = Math.abs(value);
  if (abs >= 1_000_000_000 || (abs > 0 && abs < 0.000001)) {
    return value.toExponential(6).replace(/\.0+e/, 'e').replace(/(\.\d*?)0+e/, '$1e');
  }

  return Number(value.toFixed(12)).toLocaleString('en-US', {
    maximumFractionDigits: 12,
  });
}

function createMemoryState() {
  let memoryValue = 0;

  return {
    add(value) {
      memoryValue += Number(value);
      return memoryValue;
    },
    subtract(value) {
      memoryValue -= Number(value);
      return memoryValue;
    },
    store(value) {
      memoryValue = Number(value);
      return memoryValue;
    },
    recall() {
      return memoryValue;
    },
    clear() {
      memoryValue = 0;
      return memoryValue;
    },
  };
}

function createHistoryState(storageKey = 'calculator-history') {
  const readEntries = () => {
    try {
      if (typeof localStorage === 'undefined') {
        return [];
      }

      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  };

  const writeEntries = (entries) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(entries));
      }
    } catch (error) {
      // Ignore storage errors without breaking the calculator.
    }
  };

  const entries = readEntries();

  return {
    add(entry) {
      entries.push(entry);
      writeEntries(entries);
      return entries;
    },
    remove(index) {
      if (index < 0 || index >= entries.length) {
        return null;
      }

      const [removed] = entries.splice(index, 1);
      writeEntries(entries);
      return removed;
    },
    getEntries() {
      return [...entries];
    },
    select(index) {
      if (index < 0 || index >= entries.length) {
        return null;
      }
      return entries[index];
    },
    clear() {
      entries.length = 0;
      writeEntries(entries);
      return entries;
    },
    exportAsCSV() {
      return exportHistoryAsCSV(entries);
    },
    exportAsTXT() {
      return exportHistoryAsTXT(entries);
    },
  };
}

function formatHistoryEntry(expression, result, date = new Date()) {
  const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${expression} = ${result} — ${timeStr}`;
}

function parseHistoryEntry(entry) {
  if (typeof entry === 'object' && entry !== null) {
    return {
      expression: entry.expression || '',
      result: entry.result || '',
      timestamp: entry.timestamp || '',
      formatted: entry.formatted || `${entry.expression} = ${entry.result} — ${entry.timestamp}`,
    };
  }

  const str = String(entry || '');
  const dashIndex = str.lastIndexOf('—');
  let equation = str;
  let timestamp = '';

  if (dashIndex !== -1) {
    equation = str.slice(0, dashIndex).trim();
    timestamp = str.slice(dashIndex + 1).trim();
  }

  const equalIndex = equation.indexOf('=');
  let expression = equation;
  let result = equation;

  if (equalIndex !== -1) {
    expression = equation.slice(0, equalIndex).trim();
    result = equation.slice(equalIndex + 1).trim();
  }

  return {
    expression,
    result,
    timestamp,
    formatted: str,
  };
}

function exportHistoryAsCSV(entries) {
  const headers = ['Expression', 'Result', 'Timestamp'];
  const rows = (entries || []).map((entry) => {
    const parsed = parseHistoryEntry(entry);
    return [
      `"${parsed.expression.replace(/"/g, '""')}"`,
      `"${parsed.result.replace(/"/g, '""')}"`,
      `"${parsed.timestamp.replace(/"/g, '""')}"`,
    ].join(',');
  });
  return [headers.join(','), ...rows].join('\r\n');
}

function exportHistoryAsTXT(entries) {
  if (!entries || entries.length === 0) {
    return 'No calculation history.';
  }
  const lines = entries.map((entry) => {
    const parsed = parseHistoryEntry(entry);
    return parsed.timestamp
      ? `${parsed.expression} = ${parsed.result} — ${parsed.timestamp}`
      : `${parsed.expression} = ${parsed.result}`;
  });
  return ['Calculation History', '===================', ...lines].join('\r\n');
}

function calculateExpression(expression, options = {}) {
  if (typeof expression !== 'string') {
    throw new Error('Invalid input');
  }

  const sanitized = expression.replace(/\s+/g, '');
  if (sanitized === '') {
    throw new Error('Invalid expression');
  }

  const ansValue = typeof options === 'number'
    ? options
    : (options && Number.isFinite(options.ans) ? options.ans : 0);

  const constants = {
    pi: Math.PI,
    e: Math.E,
    ans: ansValue,
  };

  let index = 0;

  const parseNumber = () => {
    let number = '';
    let dotCount = 0;

    while (index < sanitized.length) {
      const char = sanitized[index];

      if (/\d/.test(char)) {
        number += char;
        index += 1;
        continue;
      }

      if (char === '.' && dotCount === 0) {
        number += char;
        dotCount += 1;
        index += 1;
        continue;
      }

      break;
    }

    if (number === '' || number === '.' || number.split('.').length > 2) {
      throw new Error('Invalid expression');
    }

    return Number(number);
  };

  const parseIdentifier = () => {
    let identifier = '';

    while (index < sanitized.length && /[a-zA-Z]/.test(sanitized[index])) {
      identifier += sanitized[index];
      index += 1;
    }

    if (!identifier) {
      throw new Error('Invalid expression');
    }

    const lower = identifier.toLowerCase();
    if (constants[lower] !== undefined) {
      return constants[lower];
    }

    throw new Error('Invalid expression');
  };

  const parsePrimary = () => {
    if (index >= sanitized.length) {
      throw new Error('Invalid expression');
    }

    const char = sanitized[index];

    if (char === '+' || char === '-') {
      const sign = char;
      index += 1;
      const value = parsePrimary();
      return sign === '-' ? -value : value;
    }

    if (char === '(') {
      index += 1;
      const value = parseAddSubtract();

      if (index >= sanitized.length || sanitized[index] !== ')') {
        throw new Error('Invalid expression: unmatched parenthesis');
      }

      index += 1;
      return value;
    }

    if (/\d/.test(char) || char === '.') {
      return parseNumber();
    }

    if (/[a-zA-Z]/.test(char)) {
      return parseIdentifier();
    }

    throw new Error('Invalid expression');
  };

  const parseExponent = () => {
    let value = parsePrimary();

    while (index < sanitized.length && sanitized[index] === '^') {
      index += 1;
      const exponent = parsePrimary();
      value = powerValue(value, exponent);
    }

    return value;
  };

  const parseMultiplyDivide = () => {
    let value = parseExponent();

    while (index < sanitized.length) {
      const char = sanitized[index];
      if (char !== '*' && char !== '/') {
        break;
      }

      index += 1;
      const nextValue = parseExponent();

      if (char === '/') {
        if (nextValue === 0) {
          throw new Error('Cannot divide by zero (Division by zero is not allowed)');
        }
        value /= nextValue;
      } else {
        value *= nextValue;
      }
    }

    return value;
  };

  const parseAddSubtract = () => {
    let value = parseMultiplyDivide();

    while (index < sanitized.length) {
      const char = sanitized[index];
      if (char !== '+' && char !== '-') {
        break;
      }

      index += 1;
      const nextValue = parseMultiplyDivide();
      value = char === '+' ? value + nextValue : value - nextValue;
    }

    return value;
  };

  const result = parseAddSubtract();

  if (index !== sanitized.length) {
    throw new Error('Invalid expression');
  }

  return result;
}

function getWordMask(wordSize = 32) {
  switch (Number(wordSize)) {
    case 8:
      return 0xFFn;
    case 16:
      return 0xFFFFn;
    case 64:
      return 0xFFFFFFFFFFFFFFFFn;
    case 32:
    default:
      return 0xFFFFFFFFn;
  }
}

function toBigIntSafe(value) {
  try {
    if (typeof value === 'bigint') return value;
    const num = Math.trunc(Number(value) || 0);
    return BigInt(num);
  } catch {
    return 0n;
  }
}

function toBaseString(value, base = 10, wordSize = 32) {
  const mask = getWordMask(wordSize);
  const rawBig = toBigIntSafe(value);
  const unsigned = rawBig & mask;

  if (base === 16) {
    return unsigned.toString(16).toUpperCase();
  }
  if (base === 8) {
    return unsigned.toString(8);
  }
  if (base === 2) {
    const rawBinary = unsigned.toString(2);
    const padLength = Math.max(4, Math.ceil(rawBinary.length / 4) * 4);
    return rawBinary.padStart(padLength, '0');
  }
  return unsigned.toString(10);
}

function bitwiseAnd(a, b, wordSize = 32) {
  const mask = getWordMask(wordSize);
  const res = (toBigIntSafe(a) & toBigIntSafe(b)) & mask;
  return Number(res);
}

function bitwiseOr(a, b, wordSize = 32) {
  const mask = getWordMask(wordSize);
  const res = (toBigIntSafe(a) | toBigIntSafe(b)) & mask;
  return Number(res);
}

function bitwiseXor(a, b, wordSize = 32) {
  const mask = getWordMask(wordSize);
  const res = (toBigIntSafe(a) ^ toBigIntSafe(b)) & mask;
  return Number(res);
}

function bitwiseNot(a, wordSize = 32) {
  const mask = getWordMask(wordSize);
  const res = (~toBigIntSafe(a)) & mask;
  return Number(res);
}

function bitwiseShiftLeft(a, bits, wordSize = 32) {
  const mask = getWordMask(wordSize);
  const shiftAmount = BigInt(Math.max(0, Math.trunc(Number(bits) || 0)));
  const res = (toBigIntSafe(a) << shiftAmount) & mask;
  return Number(res);
}

function bitwiseShiftRight(a, bits, wordSize = 32) {
  const mask = getWordMask(wordSize);
  const shiftAmount = BigInt(Math.max(0, Math.trunc(Number(bits) || 0)));
  const unsigned = toBigIntSafe(a) & mask;
  const res = (unsigned >> shiftAmount) & mask;
  return Number(res);
}

function calculateEMI(principal, annualRatePercent, tenureMonths) {
  const P = Number(principal);
  const rate = Number(annualRatePercent);
  const n = Number(tenureMonths);

  if (!Number.isFinite(P) || P <= 0 || !Number.isFinite(rate) || rate < 0 || !Number.isFinite(n) || n <= 0) {
    throw new Error('Invalid input');
  }

  const monthlyRate = (rate / 12) / 100;
  let emi = 0;

  if (monthlyRate === 0) {
    emi = P / n;
  } else {
    const factor = Math.pow(1 + monthlyRate, n);
    emi = (P * monthlyRate * factor) / (factor - 1);
  }

  const roundedEmi = Number(emi.toFixed(2));
  const totalPayment = Number((roundedEmi * n).toFixed(2));
  const totalInterest = Number((totalPayment - P).toFixed(2));

  return {
    emi: roundedEmi,
    totalPayment,
    totalInterest,
  };
}

function calculateTip(billAmount, tipPercent, peopleCount = 1) {
  const bill = Number(billAmount);
  const tipPct = Number(tipPercent);
  const people = Math.max(1, Math.trunc(Number(peopleCount) || 1));

  if (!Number.isFinite(bill) || bill < 0 || !Number.isFinite(tipPct) || tipPct < 0) {
    throw new Error('Invalid input');
  }

  const tipAmount = (bill * tipPct) / 100;
  const totalBill = bill + tipAmount;
  const perPerson = totalBill / people;
  const tipPerPerson = tipAmount / people;

  return {
    tipAmount: Number(tipAmount.toFixed(2)),
    totalBill: Number(totalBill.toFixed(2)),
    perPerson: Number(perPerson.toFixed(2)),
    tipPerPerson: Number(tipPerPerson.toFixed(2)),
  };
}

function calculateDiscount(originalPrice, discountPercent, taxPercent = 0) {
  const price = Number(originalPrice);
  const discPct = Number(discountPercent);
  const taxPct = Number(taxPercent || 0);

  if (!Number.isFinite(price) || price < 0 || !Number.isFinite(discPct) || discPct < 0 || !Number.isFinite(taxPct) || taxPct < 0) {
    throw new Error('Invalid input');
  }

  const discountAmount = (price * discPct) / 100;
  const discountedPrice = Math.max(0, price - discountAmount);
  const taxAmount = (discountedPrice * taxPct) / 100;
  const finalPrice = discountedPrice + taxAmount;

  return {
    discountAmount: Number(discountAmount.toFixed(2)),
    discountedPrice: Number(discountedPrice.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    finalPrice: Number(finalPrice.toFixed(2)),
    totalSavings: Number(discountAmount.toFixed(2)),
  };
}

function prepareResultForClipboard(value) {
  if (value === undefined || value === null) {
    return '0';
  }
  const str = String(value).trim();
  return str === '' ? '0' : str;
}

const PHYSICS_CONSTANTS = [
  { symbol: 'c', name: 'Speed of Light', value: 299792458, unit: 'm/s' },
  { symbol: 'h', name: 'Planck Constant', value: 6.62607015e-34, unit: 'J·s' },
  { symbol: 'G', name: 'Gravitational Constant', value: 6.6743e-11, unit: 'N·m²/kg²' },
  { symbol: 'N_A', name: 'Avogadro Constant', value: 6.02214076e23, unit: 'mol⁻¹' },
  { symbol: 'e', name: 'Elementary Charge', value: 1.602176634e-19, unit: 'C' },
  { symbol: 'm_e', name: 'Electron Mass', value: 9.1093837e-31, unit: 'kg' },
  { symbol: 'm_p', name: 'Proton Mass', value: 1.67262192e-27, unit: 'kg' },
  { symbol: 'k_B', name: 'Boltzmann Constant', value: 1.380649e-23, unit: 'J/K' },
  { symbol: 'R', name: 'Gas Constant', value: 8.314462618, unit: 'J/(mol·K)' },
  { symbol: 'g', name: 'Standard Gravity', value: 9.80665, unit: 'm/s²' },
  { symbol: 'atm', name: 'Standard Atmosphere', value: 101325, unit: 'Pa' },
];

function calculateStatistics(input) {
  let numbers = [];
  if (Array.isArray(input)) {
    numbers = input.map(Number).filter(Number.isFinite);
  } else if (typeof input === 'string') {
    numbers = input
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter((s) => s !== '' && !Number.isNaN(Number(s)))
      .map(Number);
  }

  if (numbers.length === 0) {
    throw new Error('Invalid input: at least one number required');
  }

  const n = numbers.length;
  const sum = numbers.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  const sorted = [...numbers].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;

  let median = 0;
  const mid = Math.floor(n / 2);
  if (n % 2 === 0) {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    median = sorted[mid];
  }

  const freq = new Map();
  let maxFreq = 0;
  for (const num of numbers) {
    const count = (freq.get(num) || 0) + 1;
    freq.set(num, count);
    if (count > maxFreq) maxFreq = count;
  }

  const modes = [];
  if (maxFreq > 1) {
    for (const [num, count] of freq.entries()) {
      if (count === maxFreq) modes.push(num);
    }
  }

  const variance = numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  return {
    count: n,
    sum: Number(sum.toFixed(6)),
    mean: Number(mean.toFixed(6)),
    median: Number(median.toFixed(6)),
    mode: modes.length > 0 ? modes.sort((a, b) => a - b) : null,
    min: Number(min.toFixed(6)),
    max: Number(max.toFixed(6)),
    range: Number(range.toFixed(6)),
    variance: Number(variance.toFixed(6)),
    stdDev: Number(stdDev.toFixed(6)),
  };
}

function evaluateFunctionAt(expression, x) {
  if (typeof expression !== 'string' || !Number.isFinite(x)) {
    throw new Error('Invalid input');
  }

  const sanitized = expression.trim().toLowerCase();
  if (!sanitized) {
    throw new Error('Empty expression');
  }

  const substituted = sanitized
    .replace(/(^|[^a-zA-Z0-9_])x(?=[^a-zA-Z0-9_]|$)/g, `$1(${x})`)
    .replace(/\^/g, '**');

  const mathContext = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sqrt: Math.sqrt,
    abs: Math.abs,
    log: Math.log10,
    ln: Math.log,
    exp: Math.exp,
    pi: Math.PI,
    e: Math.E,
  };

  const allowedChars = /^[0-9+\-*/^().eE\s,a-zA-Z*]+$/;
  if (!allowedChars.test(substituted)) {
    throw new Error('Invalid expression characters');
  }

  try {
    const fn = new Function(...Object.keys(mathContext), `return (${substituted});`);
    const val = fn(...Object.values(mathContext));

    if (!Number.isFinite(val)) {
      return null;
    }
    return val;
  } catch {
    return null;
  }
}

export {
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
  toRadians,
  fromRadians,
  logValue,
  lnValue,
  asinValue,
  acosValue,
  atanValue,
  factorialValue,
  convertTemperature,
  convertLength,
  convertWeight,
  convertArea,
  convertVolume,
  convertSpeed,
  convertTime,
  convertData,
  formatNumber,
  prepareResultForClipboard,
  formatHistoryEntry,
  parseHistoryEntry,
  exportHistoryAsCSV,
  exportHistoryAsTXT,
  createMemoryState,
  createHistoryState,
  toBaseString,
  bitwiseAnd,
  bitwiseOr,
  bitwiseXor,
  bitwiseNot,
  bitwiseShiftLeft,
  bitwiseShiftRight,
  calculateEMI,
  calculateTip,
  calculateDiscount,
  calculateStatistics,
  evaluateFunctionAt,
  PHYSICS_CONSTANTS,
};
