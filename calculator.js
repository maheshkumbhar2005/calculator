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

    throw new Error('Invalid expression');
  };

  const parseMultiplyDivide = () => {
    let value = parsePrimary();

    while (index < sanitized.length) {
      const char = sanitized[index];
      if (char !== '*' && char !== '/') {
        break;
      }

      index += 1;
      const nextValue = parsePrimary();

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
  convertTemperature,
  convertLength,
  formatNumber,
  createMemoryState,
  createHistoryState,
};
