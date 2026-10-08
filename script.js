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
  exportHistoryAsCSV,
  exportHistoryAsTXT,
  factorialValue,
  formatHistoryEntry,
  formatNumber,
  fromRadians,
  lnValue,
  logValue,
  parseHistoryEntry,
  percentValue,
  powerValue,
  prepareResultForClipboard,
  reciprocalValue,
  sqrtValue,
  squareValue,
  toRadians,
} from './calculator.js';

const display = document.getElementById('display');
const copyButton = document.getElementById('copy-btn');
const copyButtonText = document.getElementById('copy-btn-text');
const themeToggle = document.getElementById('theme-toggle');
const historyToggle = document.getElementById('history-toggle');
const historyClearBtn = document.getElementById('history-clear');
const exportCsvBtn = document.getElementById('export-csv-btn');
const exportTxtBtn = document.getElementById('export-txt-btn');
const memoryIndicator = document.getElementById('memory-indicator');
const historyList = document.getElementById('history-list');
const angleStatus = document.getElementById('angle-status');
const unitTypeSelect = document.getElementById('unit-type');
const fromUnitSelect = document.getElementById('from-unit');
const toUnitSelect = document.getElementById('to-unit');
const convertButton = document.getElementById('convert-btn');

const memory = createMemoryState();
const history = createHistoryState();

let expression = '';
let lastAnswer = 0;
let angleMode = 'deg';
let calculatorMode = 'standard';

const mapErrorMessage = (msg) => {
  const lower = String(msg || '').toLowerCase();
  if (lower.includes('divide by zero')) {
    return 'Cannot divide by zero';
  }
  if (lower.includes('invalid input')) {
    return 'Invalid input';
  }
  return 'Invalid Expression';
};

const showError = (rawMsg) => {
  const message = mapErrorMessage(rawMsg);
  expression = '';
  if (display) {
    display.value = message;
    display.classList.add('error-state');
  }
};

const setCalculatorMode = (mode) => {
  if (!['standard', 'scientific', 'converter'].includes(mode)) {
    return;
  }

  calculatorMode = mode;
  document.body.dataset.mode = mode;

  document.querySelectorAll('[data-calculator-mode]').forEach((button) => {
    const isActive = button.dataset.calculatorMode === mode;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
};

const toggleHistoryDrawer = (open) => {
  const isOpen = typeof open === 'boolean' ? open : document.body.dataset.historyOpen !== 'true';
  document.body.dataset.historyOpen = String(isOpen);

  if (historyToggle) {
    historyToggle.setAttribute('aria-expanded', String(isOpen));
  }
};

const setAngleMode = (mode) => {
  if (mode !== 'deg' && mode !== 'rad') {
    return;
  }

  angleMode = mode;
  if (angleStatus) {
    angleStatus.textContent = mode.toUpperCase();
  }

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

  if (/^[0-9+\-*/^().\s]+$/.test(text)) {
    return text;
  }

  const number = Number(text);
  if (!Number.isFinite(number)) {
    return text;
  }

  return formatNumber(number);
};

const updateDisplay = (value) => {
  if (display) {
    display.classList.remove('error-state');
    display.value = String(value || '0');
  }
};

const updateMemoryIndicator = () => {
  if (memoryIndicator) {
    memoryIndicator.textContent = `M: ${formatNumber(memory.recall())}`;
  }
};

const renderHistory = () => {
  if (!historyList) {
    return;
  }

  const entries = history.getEntries();
  historyList.innerHTML = '';

  if (entries.length === 0) {
    const item = document.createElement('li');
    item.className = 'history-empty';
    item.textContent = 'No calculations yet';
    historyList.appendChild(item);
    return;
  }

  entries.slice(-20).reverse().forEach((rawEntry, index) => {
    const actualIndex = entries.length - 1 - index;
    const parsed = parseHistoryEntry(rawEntry);

    const item = document.createElement('li');
    item.className = 'history-item';
    item.dataset.historyIndex = String(actualIndex);

    const info = document.createElement('div');
    info.className = 'history-info';

    const eq = document.createElement('div');
    eq.className = 'history-equation';
    eq.textContent = parsed.expression ? `${parsed.expression} = ${parsed.result}` : parsed.result;

    const time = document.createElement('div');
    time.className = 'history-time';
    time.textContent = parsed.timestamp || 'Recent';

    info.appendChild(eq);
    info.appendChild(time);

    const actions = document.createElement('div');
    actions.className = 'history-actions';

    const reuseBtn = document.createElement('button');
    reuseBtn.type = 'button';
    reuseBtn.className = 'history-reuse';
    reuseBtn.textContent = 'Reuse';
    reuseBtn.title = 'Reuse result in calculator';
    reuseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      expression = parsed.result;
      const num = Number(parsed.result);
      if (Number.isFinite(num)) {
        lastAnswer = num;
      }
      updateDisplay(formatDisplayValue(expression));
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'history-delete';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Delete history entry';
    deleteBtn.setAttribute('aria-label', `Delete calculation entry`);
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      history.remove(actualIndex);
      renderHistory();
    });

    actions.appendChild(reuseBtn);
    actions.appendChild(deleteBtn);

    item.addEventListener('click', () => {
      expression = parsed.result;
      updateDisplay(formatDisplayValue(expression));
    });

    item.appendChild(info);
    item.appendChild(actions);
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

const updateTheme = (theme) => {
  document.body.dataset.theme = theme;
  try {
    localStorage.setItem('calculator-theme', theme);
  } catch {
    // Storage access restricted
  }
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
};

const appendValue = (value) => {
  if (display?.classList.contains('error-state')) {
    clearExpression();
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

  if (['+', '-', '*', '/', '^'].includes(value)) {
    const lastChar = expression.slice(-1);
    if (!expression) {
      if (value === '-') {
        expression += value;
      } else {
        expression = `${lastAnswer}${value}`;
      }
      updateDisplay(expression || '0');
      return;
    }

    if (['+', '-', '*', '/', '^'].includes(lastChar)) {
      expression = expression.slice(0, -1) + value;
      updateDisplay(expression);
      return;
    }
  }

  if (value === '(') {
    if (expression && /[0-9)]$/.test(expression)) {
      expression += '*' + value;
      updateDisplay(expression);
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
  if (display?.classList.contains('error-state')) {
    clearExpression();
    return;
  }
  expression = expression.slice(0, -1);
  updateDisplay(expression ? formatDisplayValue(expression) : '0');
};

const applyAnsAction = () => {
  if (display?.classList.contains('error-state') || !expression || expression === '0') {
    expression = String(lastAnswer);
  } else if (/[+\-*/^(]$/.test(expression)) {
    expression += String(lastAnswer);
  } else {
    expression += '*' + String(lastAnswer);
  }
  updateDisplay(formatDisplayValue(expression));
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
  if (!Number.isFinite(value)) {
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
  if (action === 'ans') {
    applyAnsAction();
    return;
  }

  if (action === 'pi') {
    if (expression && /[0-9)]$/.test(expression)) {
      expression += '*pi';
    } else {
      expression += 'pi';
    }
    updateDisplay(expression);
    return;
  }

  if (action === 'e') {
    if (expression && /[0-9)]$/.test(expression)) {
      expression += '*e';
    } else {
      expression += 'e';
    }
    updateDisplay(expression);
    return;
  }

  if (action === 'power') {
    appendValue('^');
    return;
  }

  const currentVal = expression || (display?.value && !display.classList.contains('error-state') ? display.value : '0');

  try {
    const value = calculateExpression(currentVal, { ans: lastAnswer });
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
        nextValue = Number(Math.sin(toRadians(value, angleMode)).toFixed(10));
        break;
      case 'cos':
        nextValue = Number(Math.cos(toRadians(value, angleMode)).toFixed(10));
        break;
      case 'tan': {
        const rad = toRadians(value, angleMode);
        if (Math.abs(Math.cos(rad)) < 1e-15) {
          throw new Error('Invalid input');
        }
        nextValue = Number(Math.tan(rad).toFixed(10));
        break;
      }
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
      case 'factorial':
        nextValue = factorialValue(value);
        break;
      default:
        return;
    }

    lastAnswer = nextValue;
    expression = String(nextValue);
    updateDisplay(formatDisplayValue(expression));
  } catch (error) {
    showError(error.message);
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
    defaults: ['m', 'ft'],
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
    label: 'Data storage',
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
  if (!unitTypeSelect || !fromUnitSelect || !toUnitSelect) {
    return;
  }
  const type = unitTypeSelect.value;
  const category = unitCategories[type] || unitCategories.temperature;
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
  const value = Number(expression || display?.value);
  if (!Number.isFinite(value)) {
    showError('Invalid input');
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
      throw new Error('Invalid input');
    }

    lastAnswer = result;
    expression = String(result);
    updateDisplay(formatDisplayValue(expression));
  } catch (error) {
    showError('Invalid input');
  }
};

const evaluate = () => {
  if (!expression) {
    updateDisplay('0');
    return;
  }

  try {
    const rawExpression = expression;
    const result = calculateExpression(expression, { ans: lastAnswer });
    lastAnswer = result;
    const formattedResult = formatDisplayValue(result);

    const historyEntry = formatHistoryEntry(rawExpression, formattedResult, new Date());
    history.add(historyEntry);

    expression = String(result);
    updateDisplay(formattedResult);
    renderHistory();
  } catch (error) {
    showError(error.message);
  }
};

const copyResultToClipboard = async () => {
  const textToCopy = prepareResultForClipboard(display?.value || expression);
  let success = false;

  if (navigator?.clipboard?.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      success = true;
    } catch {
      success = false;
    }
  }

  if (!success) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      success = document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch {
      success = false;
    }
  }

  if (copyButton) {
    copyButton.classList.add('copied');
    if (copyButtonText) {
      copyButtonText.textContent = success ? 'Copied!' : 'Failed';
    }
    setTimeout(() => {
      copyButton.classList.remove('copied');
      if (copyButtonText) {
        copyButtonText.textContent = 'Copy Result';
      }
    }, 1800);
  }

  return success;
};

const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Event Listeners
if (copyButton) {
  copyButton.addEventListener('click', () => {
    copyResultToClipboard();
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    updateTheme(nextTheme);
  });
}

if (historyToggle) {
  historyToggle.addEventListener('click', () => {
    toggleHistoryDrawer();
  });
}

if (historyClearBtn) {
  historyClearBtn.addEventListener('click', () => {
    clearHistory();
  });
}

if (exportCsvBtn) {
  exportCsvBtn.addEventListener('click', () => {
    const csv = history.exportAsCSV ? history.exportAsCSV() : exportHistoryAsCSV(history.getEntries());
    downloadFile(csv, 'calculator-history.csv', 'text/csv;charset=utf-8;');
  });
}

if (exportTxtBtn) {
  exportTxtBtn.addEventListener('click', () => {
    const txt = history.exportAsTXT ? history.exportAsTXT() : exportHistoryAsTXT(history.getEntries());
    downloadFile(txt, 'calculator-history.txt', 'text/plain;charset=utf-8;');
  });
}

document.querySelectorAll('[data-calculator-mode]').forEach((button) => {
  button.addEventListener('click', () => {
    setCalculatorMode(button.dataset.calculatorMode);
  });
});

document.querySelectorAll('[data-angle-mode]').forEach((button) => {
  button.addEventListener('click', () => {
    setAngleMode(button.dataset.angleMode);
  });
});

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
    } else if (action === 'ans') {
      applyAnsAction();
    } else if (action.startsWith('memory-')) {
      applyMemoryAction(action);
    } else {
      applyScientificAction(action);
    }
  });
});

if (unitTypeSelect) {
  unitTypeSelect.addEventListener('change', updateUnitOptions);
}

if (convertButton) {
  convertButton.addEventListener('click', handleUnitConversion);
}

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
  const key = event.key;
  const loweredKey = key.toLowerCase();

  // Ctrl+C / Cmd+C -> Copy result
  if ((event.ctrlKey || event.metaKey) && loweredKey === 'c' && !window.getSelection()?.toString()) {
    event.preventDefault();
    copyResultToClipboard();
    return;
  }

  // Ctrl+H / Cmd+H -> History drawer
  if ((event.ctrlKey || event.metaKey) && loweredKey === 'h') {
    event.preventDefault();
    toggleHistoryDrawer();
    return;
  }

  // Enter or = -> Calculate
  if (key === 'Enter' || key === '=') {
    event.preventDefault();
    evaluate();
    return;
  }

  // Backspace -> Delete
  if (key === 'Backspace') {
    event.preventDefault();
    deleteLast();
    return;
  }

  // Escape -> Clear
  if (key === 'Escape') {
    event.preventDefault();
    clearExpression();
    return;
  }

  // Digits and operators
  if (/^\d$/.test(key) || ['+', '-', '*', '/', '.', '^', '(', ')'].includes(key)) {
    event.preventDefault();
    appendValue(key);
    return;
  }

  // Scientific shortcuts (without modifiers)
  if (!event.ctrlKey && !event.altKey && !event.metaKey) {
    if (loweredKey === 's') {
      event.preventDefault();
      applyScientificAction('sin');
    } else if (loweredKey === 'c') {
      event.preventDefault();
      applyScientificAction('cos');
    } else if (loweredKey === 't') {
      event.preventDefault();
      applyScientificAction('tan');
    } else if (loweredKey === 'r') {
      event.preventDefault();
      applyScientificAction('sqrt');
    } else if (loweredKey === 'p') {
      event.preventDefault();
      applyScientificAction('pi');
    } else if (loweredKey === 'l') {
      event.preventDefault();
      applyScientificAction('log');
    } else if (loweredKey === 'i') {
      event.preventDefault();
      applyScientificAction('ln');
    } else if (loweredKey === 'q') {
      event.preventDefault();
      applyScientificAction('square');
    } else if (loweredKey === 'a') {
      event.preventDefault();
      applyAnsAction();
    }
  }
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('PWA service worker registration failed:', err);
    });
  });
}

// Initial state initialization
updateUnitOptions();
setCalculatorMode('standard');
setAngleMode('deg');

const savedTheme = (() => {
  try {
    return localStorage.getItem('calculator-theme') || 'dark';
  } catch {
    return 'dark';
  }
})();
updateTheme(savedTheme);

updateMemoryIndicator();
renderHistory();
clearExpression();
