import {
  acosValue,
  asinValue,
  atanValue,
  calculateExpression,
  convertArea,
  convertData,
  convertLength,
  convertSpeed,
  convertTemperature,
  convertTime,
  convertVolume,
  convertWeight,
  createHistoryState,
  createMemoryState,
  factorialValue,
  formatNumber,
  fromRadians,
  lnValue,
  logValue,
  percentValue,
  powerValue,
  reciprocalValue,
  sqrtValue,
  squareValue,
  toRadians,
} from './calculator.js';

const display = document.getElementById('display');
const themeToggle = document.getElementById('theme-toggle');
const memoryIndicator = document.getElementById('memory-indicator');
const historyList = document.getElementById('history-list');
const unitTypeSelect = document.getElementById('unit-type');
const fromUnitSelect = document.getElementById('from-unit');
const toUnitSelect = document.getElementById('to-unit');
const convertButton = document.getElementById('convert-btn');

const memory = createMemoryState();
const history = createHistoryState();
let expression = '';
let angleMode = 'deg';

const setAngleMode = (mode) => {
  if (mode !== 'deg' && mode !== 'rad') {
    return;
  }

  angleMode = mode;
  document.querySelectorAll('[data-angle-mode]').forEach((button) => {
    const isActive = button.dataset.angleMode === mode;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
};

const formatDisplayValue = (value) => {
  const text = String(value ?? '').trim();

  if (text === '') {
    return '0';
  }

  if (/^[0-9+\-*/().\s]+$/.test(text)) {
    return text;
  }

  const number = Number(text);
  if (!Number.isFinite(number)) {
    return 'Error';
  }

  return formatNumber(number);
};

const updateDisplay = (value) => {
  display.value = String(value || '0');
};

const updateMemoryIndicator = () => {
  memoryIndicator.textContent = `M: ${formatNumber(memory.recall())}`;
};

const renderHistory = () => {
  const entries = history.getEntries();
  historyList.innerHTML = '';

  if (entries.length === 0) {
    const item = document.createElement('li');
    item.className = 'history-empty';
    item.textContent = 'No calculations yet';
    historyList.appendChild(item);
    return;
  }

  entries.slice(-8).reverse().forEach((entry, index) => {
    const item = document.createElement('li');
    item.className = 'history-item';

    const label = document.createElement('span');
    label.className = 'history-label';
    label.textContent = entry;

    const actualIndex = entries.length - 1 - index;
    item.dataset.historyIndex = String(actualIndex);

    const reuseButton = document.createElement('button');
    reuseButton.type = 'button';
    reuseButton.className = 'history-reuse';
    reuseButton.textContent = 'Reuse';
    reuseButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const selectedEntry = history.select(actualIndex);
      if (selectedEntry) {
        expression = selectedEntry;
        updateDisplay(formatDisplayValue(expression));
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'history-delete';
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', `Delete history entry ${actualIndex + 1}`);
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      history.remove(actualIndex);
      renderHistory();
    });

    item.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('button')) {
        return;
      }

      const selectedEntry = history.select(actualIndex);
      if (selectedEntry) {
        expression = selectedEntry;
        updateDisplay(formatDisplayValue(expression));
      }
    });

    item.appendChild(label);
    item.appendChild(reuseButton);
    item.appendChild(deleteButton);
    historyList.appendChild(item);
  });
};

const clearExpression = () => {
  expression = '';
  updateDisplay('0');
};

const clearHistory = () => {
  history.clear();
  renderHistory();
};

const removeHistoryEntry = (index) => {
  history.remove(index);
  renderHistory();
};

const updateTheme = (theme) => {
  document.body.dataset.theme = theme;
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
};

const appendValue = (value) => {
  if (expression === 'Error') {
    expression = '';
  }

  if (value === '.' && expression === '') {
    expression = '0.';
    updateDisplay(expression);
    return;
  }

  if (value === '.' && /[0-9]$/.test(expression) === false) {
    expression += '0.';
    updateDisplay(expression);
    return;
  }

  if (value === '.' && expression.endsWith('.')) {
    return;
  }

  if (['+', '-', '*', '/'].includes(value)) {
    const lastChar = expression.slice(-1);
    if (!expression) {
      if (value === '-') {
        expression += value;
      }
      updateDisplay(expression || '0');
      return;
    }

    if (['+', '-', '*', '/'].includes(lastChar)) {
      expression = expression.slice(0, -1) + value;
      updateDisplay(expression);
      return;
    }
  }

  if (value === '(') {
    if (expression && /[0-9)]$/.test(expression)) {
      return;
    }
    expression += value;
    updateDisplay(expression);
    return;
  }

  if (value === ')') {
    if (!expression || !/[0-9)]$/.test(expression)) {
      return;
    }
    expression += value;
    updateDisplay(expression);
    return;
  }

  expression += value;
  updateDisplay(expression);
};

const deleteLast = () => {
  expression = expression.slice(0, -1);
  updateDisplay(expression ? formatDisplayValue(expression) : '0');
};

const applyMemoryAction = (action) => {
  if (action === 'memory-clear') {
    memory.clear();
    updateMemoryIndicator();
    return;
  }

  if (action === 'memory-recall') {
    expression = String(memory.recall());
    updateDisplay(formatDisplayValue(expression));
    updateMemoryIndicator();
    return;
  }

  if (!expression) {
    return;
  }

  const value = Number(expression);
  if (Number.isNaN(value)) {
    return;
  }

  if (action === 'memory-store') {
    memory.store(value);
  } else if (action === 'memory-add') {
    memory.add(value);
  } else if (action === 'memory-subtract') {
    memory.subtract(value);
  }

  updateMemoryIndicator();
};

const applyScientificAction = (action) => {
  if (action === 'pi') {
    expression = `${expression}${Math.PI}`;
    updateDisplay(formatDisplayValue(expression));
    return;
  }

  if (action === 'e') {
    expression = `${expression}${Math.E}`;
    updateDisplay(formatDisplayValue(expression));
    return;
  }

  if (action === 'factorial') {
    if (!expression) {
      return;
    }

    try {
      const value = Number(expression);
      expression = String(factorialValue(value));
      updateDisplay(formatDisplayValue(expression));
    } catch (error) {
      expression = '';
      updateDisplay('Error');
    }
    return;
  }

  if (!expression) {
    return;
  }

  try {
    const value = Number(expression);
    let nextValue = value;

    switch (action) {
      case 'sqrt':
        nextValue = sqrtValue(value);
        break;
      case 'square':
        nextValue = squareValue(value);
        break;
      case 'reciprocal':
        nextValue = reciprocalValue(value);
        break;
      case 'percent':
        nextValue = percentValue(value);
        break;
      case 'toggle-sign':
        nextValue = -value;
        break;
      case 'sin':
        nextValue = Math.sin(toRadians(value, angleMode));
        break;
      case 'cos':
        nextValue = Math.cos(toRadians(value, angleMode));
        break;
      case 'tan':
        nextValue = Math.tan(toRadians(value, angleMode));
        break;
      case 'log':
        nextValue = logValue(value);
        break;
      case 'ln':
        nextValue = lnValue(value);
        break;
      case 'asin':
        nextValue = asinValue(value, angleMode);
        break;
      case 'acos':
        nextValue = acosValue(value, angleMode);
        break;
      case 'atan':
        nextValue = atanValue(value, angleMode);
        break;
      default:
        return;
    }

    expression = String(nextValue);
    updateDisplay(formatDisplayValue(expression));
  } catch (error) {
    expression = '';
    updateDisplay('Error');
  }
};

const unitCategories = {
  temperature: {
    label: 'Temperature',
    units: {
      c: '°C',
      f: '°F',
      k: 'K',
    },
    defaults: ['c', 'f'],
  },
  length: {
    label: 'Length',
    units: {
      mm: 'mm',
      cm: 'cm',
      m: 'm',
      km: 'km',
      in: 'in',
      ft: 'ft',
      yd: 'yd',
    },
    defaults: ['cm', 'm'],
  },
  weight: {
    label: 'Weight',
    units: {
      mg: 'mg',
      g: 'g',
      kg: 'kg',
      lb: 'lb',
      oz: 'oz',
    },
    defaults: ['kg', 'lb'],
  },
  area: {
    label: 'Area',
    units: {
      mm2: 'mm²',
      cm2: 'cm²',
      m2: 'm²',
      km2: 'km²',
      in2: 'in²',
      ft2: 'ft²',
      yd2: 'yd²',
    },
    defaults: ['m2', 'ft2'],
  },
  volume: {
    label: 'Volume',
    units: {
      ml: 'ml',
      l: 'L',
      m3: 'm³',
      cup: 'cup',
      pint: 'pt',
      gal: 'gal',
    },
    defaults: ['l', 'gal'],
  },
  speed: {
    label: 'Speed',
    units: {
      'm/s': 'm/s',
      'km/h': 'km/h',
      mph: 'mph',
      knot: 'kn',
      'ft/s': 'ft/s',
    },
    defaults: ['km/h', 'mph'],
  },
  time: {
    label: 'Time',
    units: {
      ms: 'ms',
      s: 's',
      min: 'min',
      h: 'h',
      day: 'day',
      week: 'week',
    },
    defaults: ['min', 'h'],
  },
  data: {
    label: 'Data',
    units: {
      bit: 'bit',
      byte: 'B',
      kb: 'KB',
      mb: 'MB',
      gb: 'GB',
      tb: 'TB',
    },
    defaults: ['mb', 'gb'],
  },
};

const updateUnitOptions = () => {
  const type = unitTypeSelect.value;
  const category = unitCategories[type] || unitCategories.length;
  const options = Object.entries(category.units);

  const buildOptions = (select, selected) => {
    select.innerHTML = options
      .map(([value, label]) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`)
      .join('');
  };

  const [fromDefault, toDefault] = category.defaults;
  buildOptions(fromUnitSelect, fromDefault);
  buildOptions(toUnitSelect, toDefault);
};

const handleUnitConversion = () => {
  const value = Number(expression || display.value);
  if (!Number.isFinite(value)) {
    updateDisplay('Error');
    return;
  }

  const type = unitTypeSelect.value;
  const fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;

  try {
    let result;

    if (type === 'temperature') {
      result = convertTemperature(value, fromUnit, toUnit);
    } else if (type === 'length') {
      result = convertLength(value, fromUnit, toUnit);
    } else if (type === 'weight') {
      result = convertWeight(value, fromUnit, toUnit);
    } else if (type === 'area') {
      result = convertArea(value, fromUnit, toUnit);
    } else if (type === 'volume') {
      result = convertVolume(value, fromUnit, toUnit);
    } else if (type === 'speed') {
      result = convertSpeed(value, fromUnit, toUnit);
    } else if (type === 'time') {
      result = convertTime(value, fromUnit, toUnit);
    } else if (type === 'data') {
      result = convertData(value, fromUnit, toUnit);
    } else {
      throw new Error('Unsupported conversion type');
    }

    expression = String(result);
    updateDisplay(formatDisplayValue(expression));
  } catch (error) {
    updateDisplay('Error');
  }
};

const evaluate = () => {
  if (!expression) {
    updateDisplay('0');
    return;
  }

  try {
    const result = calculateExpression(expression);
    expression = String(result);
    history.add(expression);
    updateDisplay(formatDisplayValue(expression));
    renderHistory();
  } catch (error) {
    expression = '';
    updateDisplay('Error');
  }
};

document.querySelectorAll('[data-value]').forEach((button) => {
  button.addEventListener('click', () => {
    appendValue(button.dataset.value);
  });
});

document.querySelectorAll('[data-action]').forEach((button) => {
  const action = button.dataset.action;
  button.addEventListener('click', () => {
    if (action === 'clear') {
      clearExpression();
    } else if (action === 'delete') {
      deleteLast();
    } else if (action === 'equals') {
      evaluate();
    } else if (action === 'clear-history') {
      clearHistory();
    } else if (action.startsWith('memory-')) {
      applyMemoryAction(action);
    } else {
      applyScientificAction(action);
    }
  });
});

const powerButton = document.createElement('button');
powerButton.className = 'btn scientific';
powerButton.type = 'button';
powerButton.dataset.action = 'power';
powerButton.textContent = 'xʸ';

const piButton = document.createElement('button');
piButton.className = 'btn scientific';
piButton.type = 'button';
piButton.dataset.action = 'pi';
piButton.textContent = 'π';

const eButton = document.createElement('button');
eButton.className = 'btn scientific';
eButton.type = 'button';
eButton.dataset.action = 'e';
eButton.textContent = 'e';

const logButton = document.createElement('button');
logButton.className = 'btn scientific';
logButton.type = 'button';
logButton.dataset.action = 'log';
logButton.textContent = 'log';

const lnButton = document.createElement('button');
lnButton.className = 'btn scientific';
lnButton.type = 'button';
lnButton.dataset.action = 'ln';
lnButton.textContent = 'ln';

const asinButton = document.createElement('button');
asinButton.className = 'btn scientific';
asinButton.type = 'button';
asinButton.dataset.action = 'asin';
asinButton.textContent = 'asin';

const acosButton = document.createElement('button');
acosButton.className = 'btn scientific';
acosButton.type = 'button';
acosButton.dataset.action = 'acos';
acosButton.textContent = 'acos';

const atanButton = document.createElement('button');
atanButton.className = 'btn scientific';
atanButton.type = 'button';
atanButton.dataset.action = 'atan';
atanButton.textContent = 'atan';

const factorialButton = document.createElement('button');
factorialButton.className = 'btn scientific';
factorialButton.type = 'button';
factorialButton.dataset.action = 'factorial';
factorialButton.textContent = '!';

const scientificGrid = document.querySelector('.scientific-grid');
if (scientificGrid) {
  scientificGrid.appendChild(piButton);
  scientificGrid.appendChild(eButton);
  scientificGrid.appendChild(powerButton);
  scientificGrid.appendChild(logButton);
  scientificGrid.appendChild(lnButton);
  scientificGrid.appendChild(asinButton);
  scientificGrid.appendChild(acosButton);
  scientificGrid.appendChild(atanButton);
  scientificGrid.appendChild(factorialButton);
}

historyList.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const historyItem = target.closest('.history-item');
  if (!historyItem) {
    return;
  }

  const index = Number(historyItem.dataset.historyIndex);
  if (Number.isNaN(index)) {
    return;
  }

  if (target.classList.contains('history-delete')) {
    removeHistoryEntry(index);
    return;
  }

  if (target.classList.contains('history-reuse')) {
    const selectedEntry = history.select(index);
    if (selectedEntry) {
      expression = selectedEntry;
      updateDisplay(formatDisplayValue(expression));
    }
  }
});

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/^\d$/.test(key) || ['+', '-', '*', '/', '.'].includes(key)) {
    event.preventDefault();
    appendValue(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    event.preventDefault();
    evaluate();
    return;
  }

  if (key === 'Backspace') {
    event.preventDefault();
    deleteLast();
    return;
  }

  if (key === 'Escape') {
    event.preventDefault();
    clearExpression();
    return;
  }

  const loweredKey = key.toLowerCase();
  if (loweredKey === 's') {
    event.preventDefault();
    applyScientificAction('sqrt');
  } else if (loweredKey === 'q') {
    event.preventDefault();
    applyScientificAction('square');
  } else if (loweredKey === 'r') {
    event.preventDefault();
    applyScientificAction('reciprocal');
  } else if (loweredKey === 'p') {
    event.preventDefault();
    applyScientificAction('pi');
  } else if (loweredKey === 'l') {
    event.preventDefault();
    applyScientificAction('log');
  } else if (loweredKey === 'i') {
    event.preventDefault();
    applyScientificAction('ln');
  } else if (loweredKey === 'c') {
    event.preventDefault();
    applyScientificAction('cos');
  } else if (loweredKey === 't') {
    event.preventDefault();
    applyScientificAction('tan');
  } else if (loweredKey === 'n') {
    event.preventDefault();
    applyScientificAction('toggle-sign');
  }
});

themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  updateTheme(nextTheme);
});

document.querySelectorAll('[data-angle-mode]').forEach((button) => {
  button.addEventListener('click', () => {
    setAngleMode(button.dataset.angleMode);
  });
});

unitTypeSelect.addEventListener('change', updateUnitOptions);
convertButton.addEventListener('click', handleUnitConversion);
updateUnitOptions();
setAngleMode('deg');
updateTheme('dark');
updateMemoryIndicator();
renderHistory();
clearExpression();
