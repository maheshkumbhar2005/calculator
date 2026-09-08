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

function createHistoryState() {
  const entries = [];

  return {
    add(entry) {
      entries.push(entry);
      return entries;
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
      return entries;
    },
  };
}

function calculateExpression(expression) {
  const sanitized = expression.replace(/\s+/g, '');
  const tokens = sanitized.match(/\d+|[+\-*/]/g);

  if (!tokens || tokens.length === 0 || tokens.length % 2 === 0) {
    throw new Error('Invalid expression');
  }

  const values = [];
  const operators = [];

  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  const applyOperator = (op, b, a) => {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') return a / b;
    throw new Error(`Unsupported operator: ${op}`);
  };

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];

    if (/\d+/.test(token)) {
      values.push(Number(token));
      continue;
    }

    const operator = token;
    if (!['+', '-', '*', '/'].includes(operator)) {
      throw new Error(`Unsupported operator: ${operator}`);
    }

    while (
      operators.length > 0 &&
      precedence[operators[operators.length - 1]] >= precedence[operator]
    ) {
      const lastOperator = operators.pop();
      const rightValue = values.pop();
      const leftValue = values.pop();
      values.push(applyOperator(lastOperator, rightValue, leftValue));
    }

    operators.push(operator);
  }

  while (operators.length > 0) {
    const operator = operators.pop();
    const rightValue = values.pop();
    const leftValue = values.pop();
    values.push(applyOperator(operator, rightValue, leftValue));
  }

  return values[0];
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
