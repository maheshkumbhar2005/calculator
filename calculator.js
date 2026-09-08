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
    throw new Error('Division by zero is not allowed.');
  }
  return a / b;
}

function sqrtValue(value) {
  if (value < 0) {
    throw new Error('Square root of a negative number is not allowed.');
  }
  return Math.sqrt(value);
}

function squareValue(value) {
  return value * value;
}

function reciprocalValue(value) {
  if (value === 0) {
    throw new Error('Division by zero is not allowed.');
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
    throw new Error('Logarithm requires a positive value.');
  }
  return Math.log10(value);
}

function lnValue(value) {
  if (value <= 0) {
    throw new Error('Natural logarithm requires a positive value.');
  }
  return Math.log(value);
}

function asinValue(value, mode = 'deg') {
  if (value < -1 || value > 1) {
    throw new Error('asin requires a value between -1 and 1.');
  }
  return Number(fromRadians(Math.asin(value), mode).toFixed(10));
}

function acosValue(value, mode = 'deg') {
  if (value < -1 || value > 1) {
    throw new Error('acos requires a value between -1 and 1.');
  }
  return Number(fromRadians(Math.acos(value), mode).toFixed(10));
}

function atanValue(value, mode = 'deg') {
  return Number(fromRadians(Math.atan(value), mode).toFixed(10));
}

function factorialValue(value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('Factorial requires a non-negative integer.');
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
  };
}

function calculateExpression(expression) {
  if (typeof expression !== 'string') {
    throw new Error('Invalid expression');
  }

  const sanitized = expression.replace(/\s+/g, '');
  if (sanitized === '') {
    throw new Error('Invalid expression');
  }

  const constants = {
    pi: Math.PI,
    e: Math.E,
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
          throw new Error('Division by zero is not allowed.');
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
  createMemoryState,
  createHistoryState,
};
