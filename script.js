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
} from './calculator.js';

const display = document.getElementById('display');
const displayPreview = document.getElementById('display-preview');
const copyButton = document.getElementById('copy-btn');
const copyButtonText = document.getElementById('copy-btn-text');
const themeToggle = document.getElementById('theme-toggle');
const soundToggle = document.getElementById('sound-toggle');
const shortcutsToggle = document.getElementById('shortcuts-toggle');
const shortcutsModal = document.getElementById('shortcuts-modal');
const shortcutsClose = document.getElementById('shortcuts-close');
const constantsToggle = document.getElementById('constants-toggle');
const constantsModal = document.getElementById('constants-modal');
const constantsClose = document.getElementById('constants-close');
const constantsSearch = document.getElementById('constants-search');
const constantsList = document.getElementById('constants-list');
const historyToggle = document.getElementById('history-toggle');
const historyClearBtn = document.getElementById('history-clear');
const historySearch = document.getElementById('history-search');
const exportCsvBtn = document.getElementById('export-csv-btn');
const exportTxtBtn = document.getElementById('export-txt-btn');
const memoryIndicator = document.getElementById('memory-indicator');
const historyList = document.getElementById('history-list');
const angleStatus = document.getElementById('angle-status');
const unitTypeSelect = document.getElementById('unit-type');
const fromUnitSelect = document.getElementById('from-unit');
const toUnitSelect = document.getElementById('to-unit');
const convertButton = document.getElementById('convert-btn');

// Programmer DOM elements
const baseHex = document.getElementById('base-hex');
const baseDec = document.getElementById('base-dec');
const baseOct = document.getElementById('base-oct');
const baseBin = document.getElementById('base-bin');

// Graph DOM elements
const graphExpr = document.getElementById('graph-expr');
const graphPlotBtn = document.getElementById('graph-plot-btn');
const graphCanvas = document.getElementById('graph-canvas');
const graphCoords = document.getElementById('graph-coords');
const graphZoomIn = document.getElementById('graph-zoom-in');
const graphZoomOut = document.getElementById('graph-zoom-out');
const graphReset = document.getElementById('graph-reset');

// Statistics DOM elements
const statsInput = document.getElementById('stats-input');
const statsCalcBtn = document.getElementById('stats-calc-btn');
const statsSampleBtn = document.getElementById('stats-sample-btn');
const statsClearBtn = document.getElementById('stats-clear-btn');
const statsCanvas = document.getElementById('stats-canvas');

const memory = createMemoryState();
const history = createHistoryState();

let expression = '';
let lastAnswer = 0;
let angleMode = 'deg';
let calculatorMode = 'standard';
let wordSize = 32;

let audioCtx = null;
let soundEnabled = (() => {
  try {
    return localStorage.getItem('calculator-sound') !== 'false';
  } catch {
    return true;
  }
})();

const playClickSound = (freq = 440) => {
  if (!soundEnabled) return;
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;
    if (!audioCtx) {
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.035);
  } catch {
    // Audio playback blocked or unsupported
  }
};

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
  if (displayPreview) {
    displayPreview.textContent = '';
  }
};

const setCalculatorMode = (mode) => {
  if (!['standard', 'scientific', 'graph', 'stats', 'programmer', 'financial', 'converter'].includes(mode)) {
    return;
  }

  calculatorMode = mode;
  document.body.dataset.mode = mode;

  document.querySelectorAll('[data-calculator-mode]').forEach((button) => {
    const isActive = button.dataset.calculatorMode === mode;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  if (mode === 'programmer') {
    updateBaseBoard();
  } else if (mode === 'financial') {
    updateFinancialEmi();
    updateFinancialTip();
    updateFinancialDiscount();
  } else if (mode === 'graph') {
    setTimeout(renderGraph, 30);
  } else if (mode === 'stats') {
    renderStatistics();
  }
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
  updateLivePreview();
  updateBaseBoard();
};

const updateLivePreview = () => {
  if (!displayPreview) return;
  if (!expression || !/[+\-*/^]/.test(expression)) {
    displayPreview.textContent = '';
    return;
  }
  try {
    const previewVal = calculateExpression(expression, { ans: lastAnswer });
    if (Number.isFinite(previewVal)) {
      displayPreview.textContent = `= ${formatNumber(previewVal)}`;
    } else {
      displayPreview.textContent = '';
    }
  } catch {
    displayPreview.textContent = '';
  }
};

const updateBaseBoard = () => {
  if (!baseHex && !baseDec && !baseOct && !baseBin) return;
  let val = 0;
  if (expression) {
    try {
      val = calculateExpression(expression, { ans: lastAnswer });
    } catch {
      val = lastAnswer;
    }
  } else {
    val = lastAnswer;
  }
  const cleanInt = Math.trunc(Number(val) || 0);
  if (baseHex) baseHex.textContent = toBaseString(cleanInt, 16, wordSize);
  if (baseDec) baseDec.textContent = toBaseString(cleanInt, 10, wordSize);
  if (baseOct) baseOct.textContent = toBaseString(cleanInt, 8, wordSize);
  if (baseBin) {
    const binStr = toBaseString(cleanInt, 2, wordSize);
    baseBin.textContent = binStr.replace(/(.{4})/g, '$1 ').trim();
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

  const query = historySearch?.value.trim().toLowerCase() || '';
  const allEntries = history.getEntries();
  const entriesWithIdx = allEntries.map((rawEntry, idx) => ({ rawEntry, actualIndex: idx }));

  const filtered = query
    ? entriesWithIdx.filter(({ rawEntry }) => {
        const parsed = parseHistoryEntry(rawEntry);
        return (parsed.expression + ' ' + parsed.result).toLowerCase().includes(query);
      })
    : entriesWithIdx;

  historyList.innerHTML = '';

  if (filtered.length === 0) {
    const item = document.createElement('li');
    item.className = 'history-empty';
    item.textContent = query ? 'No matching calculations' : 'No calculations yet';
    historyList.appendChild(item);
    return;
  }

  filtered.slice(-20).reverse().forEach(({ rawEntry, actualIndex }) => {
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

const THEMES = ['dark', 'light', 'oled', 'cyberpunk', 'sunset'];
const THEME_ICONS = {
  dark: '☀️',
  light: '🌙',
  oled: '⬛',
  cyberpunk: '⚡',
  sunset: '🌅',
};

const updateTheme = (theme) => {
  document.body.dataset.theme = theme;
  try {
    localStorage.setItem('calculator-theme', theme);
  } catch {
    // Storage access restricted
  }
  if (themeToggle) {
    themeToggle.textContent = THEME_ICONS[theme] || '☀️';
    themeToggle.title = `Theme: ${theme.toUpperCase()} (Click to cycle)`;
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
    if (displayPreview) {
      displayPreview.textContent = '';
    }
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

// Programmer Mode Bitwise Handlers
const applyBitwiseAction = (action) => {
  let val = 0;
  try {
    val = calculateExpression(expression || String(lastAnswer), { ans: lastAnswer });
  } catch {
    val = lastAnswer;
  }

  const intVal = Math.trunc(Number(val) || 0);

  if (action === 'bitwise-not') {
    const res = bitwiseNot(intVal, wordSize);
    lastAnswer = res;
    expression = String(res);
    updateDisplay(formatDisplayValue(res));
    return;
  }

  // Operator-style prompt for two-operand bitwise
  const opSymbol = {
    'bitwise-and': '&',
    'bitwise-or': '|',
    'bitwise-xor': '^',
    'bitwise-lsh': '<<',
    'bitwise-rsh': '>>',
  }[action];

  if (!opSymbol) return;

  // Evaluate directly if second operand is present, or append
  const parts = expression.split(/\s*(&|\||\^|<<|>>)\s*/);
  if (parts.length === 3 && parts[2]) {
    const a = Math.trunc(Number(parts[0]) || 0);
    const op = parts[1];
    const b = Math.trunc(Number(parts[2]) || 0);
    let res = 0;
    if (op === '&') res = bitwiseAnd(a, b, wordSize);
    else if (op === '|') res = bitwiseOr(a, b, wordSize);
    else if (op === '^') res = bitwiseXor(a, b, wordSize);
    else if (op === '<<') res = bitwiseShiftLeft(a, b, wordSize);
    else if (op === '>>') res = bitwiseShiftRight(a, b, wordSize);

    lastAnswer = res;
    expression = `${res} ${opSymbol} `;
    updateDisplay(expression);
  } else {
    expression = `${intVal} ${opSymbol} `;
    updateDisplay(expression);
  }
};

// Financial Calculators Live Updates
const updateFinancialEmi = () => {
  const pInput = document.getElementById('emi-principal');
  const rInput = document.getElementById('emi-rate');
  const tInput = document.getElementById('emi-tenure');
  const monthlyRes = document.getElementById('emi-monthly-result');
  const interestRes = document.getElementById('emi-interest-result');
  const totalRes = document.getElementById('emi-total-result');
  if (!pInput || !rInput || !tInput) return;

  const p = Number(pInput.value) || 0;
  const r = Number(rInput.value) || 0;
  const t = (Number(tInput.value) || 0) * 12;

  if (p > 0 && r >= 0 && t > 0) {
    try {
      const { emi, totalPayment, totalInterest } = calculateEMI(p, r, t);
      if (monthlyRes) monthlyRes.textContent = `₹${formatNumber(emi)}`;
      if (interestRes) interestRes.textContent = `₹${formatNumber(totalInterest)}`;
      if (totalRes) totalRes.textContent = `₹${formatNumber(totalPayment)}`;
    } catch {
      // ignore
    }
  }
};

const updateFinancialTip = () => {
  const billInput = document.getElementById('tip-bill');
  const pctInput = document.getElementById('tip-percent');
  const pplInput = document.getElementById('tip-people');
  const tipTotRes = document.getElementById('tip-total-result');
  const billTotRes = document.getElementById('tip-bill-result');
  const personRes = document.getElementById('tip-person-result');
  if (!billInput || !pctInput || !pplInput) return;

  const bill = Number(billInput.value) || 0;
  const pct = Number(pctInput.value) || 0;
  const people = Number(pplInput.value) || 1;

  if (bill >= 0 && pct >= 0 && people >= 1) {
    try {
      const { tipAmount, totalBill, perPerson } = calculateTip(bill, pct, people);
      if (tipTotRes) tipTotRes.textContent = `₹${formatNumber(tipAmount)}`;
      if (billTotRes) billTotRes.textContent = `₹${formatNumber(totalBill)}`;
      if (personRes) personRes.textContent = `₹${formatNumber(perPerson)}`;
    } catch {
      // ignore
    }
  }
};

const updateFinancialDiscount = () => {
  const priceInput = document.getElementById('disc-price');
  const pctInput = document.getElementById('disc-percent');
  const taxInput = document.getElementById('disc-tax');
  const savRes = document.getElementById('disc-savings-result');
  const taxRes = document.getElementById('disc-tax-result');
  const finalRes = document.getElementById('disc-final-result');
  if (!priceInput || !pctInput || !taxInput) return;

  const price = Number(priceInput.value) || 0;
  const pct = Number(pctInput.value) || 0;
  const tax = Number(taxInput.value) || 0;

  if (price >= 0 && pct >= 0 && tax >= 0) {
    try {
      const { totalSavings, taxAmount, finalPrice } = calculateDiscount(price, pct, tax);
      if (savRes) savRes.textContent = `₹${formatNumber(totalSavings)}`;
      if (taxRes) taxRes.textContent = `₹${formatNumber(taxAmount)}`;
      if (finalRes) finalRes.textContent = `₹${formatNumber(finalPrice)}`;
    } catch {
      // ignore
    }
  }
};

const toggleShortcutsModal = (open) => {
  if (!shortcutsModal) return;
  if (open === true || (open === undefined && !shortcutsModal.open)) {
    shortcutsModal.showModal();
  } else {
    shortcutsModal.close();
  }
};

const updateSoundToggleUI = () => {
  if (!soundToggle) return;
  soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
  soundToggle.classList.toggle('is-muted', !soundEnabled);
  try {
    localStorage.setItem('calculator-sound', String(soundEnabled));
  } catch {
    // restricted storage
  }
};

// Global audio click feedback
document.addEventListener('click', (event) => {
  const btn = event.target.closest('button, .base-row');
  if (btn) {
    const isAccent = btn.classList.contains('accent') || btn.classList.contains('convert-btn');
    playClickSound(isAccent ? 560 : 420);
  }
});

// Sound toggle
if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    updateSoundToggleUI();
  });
}

// Shortcuts modal toggle & close
if (shortcutsToggle) {
  shortcutsToggle.addEventListener('click', () => toggleShortcutsModal(true));
}
if (shortcutsClose) {
  shortcutsClose.addEventListener('click', () => toggleShortcutsModal(false));
}
if (shortcutsModal) {
  shortcutsModal.addEventListener('click', (e) => {
    if (e.target === shortcutsModal) {
      toggleShortcutsModal(false);
    }
  });
}

// Programmer Word Size Selector
document.querySelectorAll('[data-word-size]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-word-size]').forEach((b) => b.classList.remove('is-active'));
    button.classList.add('is-active');
    wordSize = Number(button.dataset.wordSize) || 32;
    updateBaseBoard();
  });
});

// Programmer Hex Input Buttons (A-F)
document.querySelectorAll('[data-hex]').forEach((button) => {
  button.addEventListener('click', () => {
    appendValue(button.dataset.hex);
  });
});

// Programmer Base Board Click to Copy
document.querySelectorAll('.base-row').forEach((row) => {
  row.addEventListener('click', async () => {
    const valElem = row.querySelector('.base-value');
    if (!valElem) return;
    const text = valElem.textContent.replace(/\s+/g, '');
    if (text) {
      if (navigator?.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          // ignore
        }
      }
      row.style.outline = '2px solid #f97316';
      setTimeout(() => {
        row.style.outline = '';
      }, 350);
    }
  });
});

// Financial Tabs
document.querySelectorAll('[data-finance-tab]').forEach((tabBtn) => {
  tabBtn.addEventListener('click', () => {
    const tabName = tabBtn.dataset.financeTab;
    document.querySelectorAll('[data-finance-tab]').forEach((b) => b.classList.remove('is-active'));
    tabBtn.classList.add('is-active');

    document.querySelectorAll('.finance-view').forEach((view) => view.classList.remove('is-active'));
    const targetView = document.getElementById(`finance-${tabName}-view`);
    if (targetView) targetView.classList.add('is-active');
  });
});

// Financial Input Listeners
['emi-principal', 'emi-rate', 'emi-tenure'].forEach((id) => {
  document.getElementById(id)?.addEventListener('input', updateFinancialEmi);
});

['tip-bill', 'tip-percent', 'tip-people'].forEach((id) => {
  document.getElementById(id)?.addEventListener('input', updateFinancialTip);
});

document.querySelectorAll('[data-tip]').forEach((tipBtn) => {
  tipBtn.addEventListener('click', () => {
    document.querySelectorAll('[data-tip]').forEach((b) => b.classList.remove('is-active'));
    tipBtn.classList.add('is-active');
    const tipInput = document.getElementById('tip-percent');
    if (tipInput) {
      tipInput.value = tipBtn.dataset.tip;
      updateFinancialTip();
    }
  });
});

['disc-price', 'disc-percent', 'disc-tax'].forEach((id) => {
  document.getElementById(id)?.addEventListener('input', updateFinancialDiscount);
});

// Financial "Use in Calculator" Buttons
document.getElementById('emi-use-btn')?.addEventListener('click', () => {
  const p = Number(document.getElementById('emi-principal')?.value) || 0;
  const r = Number(document.getElementById('emi-rate')?.value) || 0;
  const t = (Number(document.getElementById('emi-tenure')?.value) || 0) * 12;
  const { emi } = calculateEMI(p, r, t);
  expression = String(emi);
  lastAnswer = emi;
  setCalculatorMode('standard');
  updateDisplay(formatDisplayValue(expression));
});

document.getElementById('tip-use-btn')?.addEventListener('click', () => {
  const bill = Number(document.getElementById('tip-bill')?.value) || 0;
  const pct = Number(document.getElementById('tip-percent')?.value) || 0;
  const ppl = Number(document.getElementById('tip-people')?.value) || 1;
  const { totalBill } = calculateTip(bill, pct, ppl);
  expression = String(totalBill);
  lastAnswer = totalBill;
  setCalculatorMode('standard');
  updateDisplay(formatDisplayValue(expression));
});

document.getElementById('disc-use-btn')?.addEventListener('click', () => {
  const price = Number(document.getElementById('disc-price')?.value) || 0;
  const pct = Number(document.getElementById('disc-percent')?.value) || 0;
  const tax = Number(document.getElementById('disc-tax')?.value) || 0;
  const { finalPrice } = calculateDiscount(price, pct, tax);
  expression = String(finalPrice);
  lastAnswer = finalPrice;
  setCalculatorMode('standard');
  updateDisplay(formatDisplayValue(expression));
});

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
      // Check if expression is bitwise operation
      const bitwiseMatch = expression.match(/^\s*(-?\d+)\s*(&|\||\^|<<|>>)\s*(-?\d+)\s*$/);
      if (bitwiseMatch) {
        const a = Math.trunc(Number(bitwiseMatch[1]) || 0);
        const op = bitwiseMatch[2];
        const b = Math.trunc(Number(bitwiseMatch[3]) || 0);
        let res = 0;
        if (op === '&') res = bitwiseAnd(a, b, wordSize);
        else if (op === '|') res = bitwiseOr(a, b, wordSize);
        else if (op === '^') res = bitwiseXor(a, b, wordSize);
        else if (op === '<<') res = bitwiseShiftLeft(a, b, wordSize);
        else if (op === '>>') res = bitwiseShiftRight(a, b, wordSize);

        const rawExpression = expression;
        const formattedResult = formatDisplayValue(res);
        const historyEntry = formatHistoryEntry(rawExpression, formattedResult, new Date());
        history.add(historyEntry);
        lastAnswer = res;
        expression = String(res);
        updateDisplay(formattedResult);
        if (displayPreview) displayPreview.textContent = '';
        renderHistory();
        return;
      }
      evaluate();
    } else if (action === 'clear-history') {
      clearHistory();
    } else if (action === 'ans') {
      applyAnsAction();
    } else if (action.startsWith('memory-')) {
      applyMemoryAction(action);
    } else if (action.startsWith('bitwise-')) {
      applyBitwiseAction(action);
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

  // ? -> Shortcuts modal
  if (key === '?') {
    event.preventDefault();
    toggleShortcutsModal();
    return;
  }

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
    const bitwiseMatch = expression.match(/^\s*(-?\d+)\s*(&|\||\^|<<|>>)\s*(-?\d+)\s*$/);
    if (bitwiseMatch) {
      const a = Math.trunc(Number(bitwiseMatch[1]) || 0);
      const op = bitwiseMatch[2];
      const b = Math.trunc(Number(bitwiseMatch[3]) || 0);
      let res = 0;
      if (op === '&') res = bitwiseAnd(a, b, wordSize);
      else if (op === '|') res = bitwiseOr(a, b, wordSize);
      else if (op === '^') res = bitwiseXor(a, b, wordSize);
      else if (op === '<<') res = bitwiseShiftLeft(a, b, wordSize);
      else if (op === '>>') res = bitwiseShiftRight(a, b, wordSize);

      const rawExpression = expression;
      const formattedResult = formatDisplayValue(res);
      const historyEntry = formatHistoryEntry(rawExpression, formattedResult, new Date());
      history.add(historyEntry);
      lastAnswer = res;
      expression = String(res);
      updateDisplay(formattedResult);
      if (displayPreview) displayPreview.textContent = '';
      renderHistory();
      return;
    }
    evaluate();
    return;
  }

  // Backspace -> Delete
  if (key === 'Backspace') {
    event.preventDefault();
    deleteLast();
    return;
  }

  // Escape -> Close modal or Clear
  if (key === 'Escape') {
    event.preventDefault();
    if (shortcutsModal?.open) {
      toggleShortcutsModal(false);
      return;
    }
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

// 2D Function Graphing
let graphScale = 32; // px per unit
let graphOriginX = 0;
let graphOriginY = 0;
let graphDragging = false;
let graphDragStartX = 0;
let graphDragStartY = 0;

const renderGraph = () => {
  if (!graphCanvas) return;
  const ctx = graphCanvas.getContext('2d');
  const w = graphCanvas.width;
  const h = graphCanvas.height;

  // Background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, w, h);

  const ox = w / 2 + graphOriginX;
  const oy = h / 2 + graphOriginY;

  // Grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;

  const startX = (ox % graphScale) - graphScale;
  for (let x = startX; x <= w + graphScale; x += graphScale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  const startY = (oy % graphScale) - graphScale;
  for (let y = startY; y <= h + graphScale; y += graphScale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(0, oy);
  ctx.lineTo(w, oy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(ox, 0);
  ctx.lineTo(ox, h);
  ctx.stroke();

  // Plot curve
  const expr = (graphExpr?.value || 'sin(x)').trim();
  if (!expr) return;

  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  let isFirst = true;
  for (let px = 0; px <= w; px += 2) {
    const xVal = (px - ox) / graphScale;
    const yVal = evaluateFunctionAt(expr, xVal);

    if (yVal === null || !Number.isFinite(yVal)) {
      isFirst = true;
      continue;
    }

    const py = oy - yVal * graphScale;
    if (py < -h || py > h * 2) {
      isFirst = true;
      continue;
    }

    if (isFirst) {
      ctx.moveTo(px, py);
      isFirst = false;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
};

if (graphCanvas) {
  graphCanvas.addEventListener('mousemove', (e) => {
    const rect = graphCanvas.getBoundingClientRect();
    const scaleX = graphCanvas.width / rect.width;
    const scaleY = graphCanvas.height / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;

    const ox = graphCanvas.width / 2 + graphOriginX;
    const oy = graphCanvas.height / 2 + graphOriginY;

    const xVal = (px - ox) / graphScale;
    const yVal = (oy - py) / graphScale;

    if (graphCoords) {
      graphCoords.textContent = `x: ${xVal.toFixed(2)}, y: ${yVal.toFixed(2)}`;
    }

    if (graphDragging) {
      graphOriginX += (e.clientX - graphDragStartX) * scaleX;
      graphOriginY += (e.clientY - graphDragStartY) * scaleY;
      graphDragStartX = e.clientX;
      graphDragStartY = e.clientY;
      renderGraph();
    }
  });

  graphCanvas.addEventListener('mousedown', (e) => {
    graphDragging = true;
    graphDragStartX = e.clientX;
    graphDragStartY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    graphDragging = false;
  });

  graphCanvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      graphScale = Math.min(160, graphScale * 1.15);
    } else {
      graphScale = Math.max(8, graphScale / 1.15);
    }
    renderGraph();
  }, { passive: false });
}

if (graphPlotBtn) {
  graphPlotBtn.addEventListener('click', renderGraph);
}
if (graphExpr) {
  graphExpr.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      renderGraph();
    }
  });
}
document.querySelectorAll('.graph-preset').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.graph-preset').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    if (graphExpr) graphExpr.value = btn.dataset.preset;
    renderGraph();
  });
});
if (graphZoomIn) {
  graphZoomIn.addEventListener('click', () => {
    graphScale = Math.min(160, graphScale * 1.25);
    renderGraph();
  });
}
if (graphZoomOut) {
  graphZoomOut.addEventListener('click', () => {
    graphScale = Math.max(8, graphScale / 1.25);
    renderGraph();
  });
}
if (graphReset) {
  graphReset.addEventListener('click', () => {
    graphScale = 32;
    graphOriginX = 0;
    graphOriginY = 0;
    renderGraph();
  });
}

// Statistics Analyzer
const renderStatistics = () => {
  const input = statsInput?.value || '';
  try {
    const stats = calculateStatistics(input);
    const countEl = document.getElementById('stat-count');
    const sumEl = document.getElementById('stat-sum');
    const meanEl = document.getElementById('stat-mean');
    const medianEl = document.getElementById('stat-median');
    const modeEl = document.getElementById('stat-mode');
    const rangeEl = document.getElementById('stat-range');
    const varEl = document.getElementById('stat-var');
    const stdEl = document.getElementById('stat-std');

    if (countEl) countEl.textContent = stats.count;
    if (sumEl) sumEl.textContent = formatNumber(stats.sum);
    if (meanEl) meanEl.textContent = formatNumber(stats.mean);
    if (medianEl) medianEl.textContent = formatNumber(stats.median);
    if (modeEl) modeEl.textContent = stats.mode ? stats.mode.join(', ') : 'None';
    if (rangeEl) rangeEl.textContent = formatNumber(stats.range);
    if (varEl) varEl.textContent = formatNumber(stats.variance);
    if (stdEl) stdEl.textContent = formatNumber(stats.stdDev);

    renderStatsChart(input);
  } catch {
    // Keep clean
  }
};

const renderStatsChart = (input) => {
  if (!statsCanvas) return;
  const ctx = statsCanvas.getContext('2d');
  const w = statsCanvas.width;
  const h = statsCanvas.height;

  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, w, h);

  const nums = input
    .split(/[\s,]+/)
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);

  if (nums.length === 0) return;

  const barCount = Math.min(nums.length, 30);
  const maxVal = Math.max(...nums, 1);
  const minVal = Math.min(0, Math.min(...nums));
  const span = maxVal - minVal || 1;

  const barW = Math.max(8, (w - 30) / barCount);
  const padding = 15;

  nums.slice(0, barCount).forEach((val, i) => {
    const barH = Math.max(4, ((val - minVal) / span) * (h - 30));
    const x = padding + i * barW;
    const y = h - 15 - barH;

    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, '#f97316');
    grad.addColorStop(1, '#ea580c');
    ctx.fillStyle = grad;
    ctx.fillRect(x + 2, y, barW - 4, barH);
  });
};

if (statsCalcBtn) {
  statsCalcBtn.addEventListener('click', renderStatistics);
}
if (statsSampleBtn) {
  statsSampleBtn.addEventListener('click', () => {
    if (statsInput) {
      statsInput.value = '15, 22, 28, 35, 35, 42, 50, 58, 64, 75';
      renderStatistics();
    }
  });
}
if (statsClearBtn) {
  statsClearBtn.addEventListener('click', () => {
    if (statsInput) statsInput.value = '';
    ['stat-count', 'stat-sum', 'stat-mean', 'stat-median', 'stat-range', 'stat-var', 'stat-std'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = '0';
    });
    const modeEl = document.getElementById('stat-mode');
    if (modeEl) modeEl.textContent = 'None';
    if (statsCanvas) {
      const ctx = statsCanvas.getContext('2d');
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, statsCanvas.width, statsCanvas.height);
    }
  });
}
if (statsInput) {
  statsInput.addEventListener('input', renderStatistics);
}

// Constants Modal
const toggleConstantsModal = (open) => {
  if (!constantsModal) return;
  if (open === true || (open === undefined && !constantsModal.open)) {
    renderConstantsList(constantsSearch?.value || '');
    constantsModal.showModal();
  } else {
    constantsModal.close();
  }
};

const renderConstantsList = (query = '') => {
  if (!constantsList) return;
  constantsList.innerHTML = '';
  const q = query.trim().toLowerCase();
  const filtered = PHYSICS_CONSTANTS.filter((c) =>
    c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
  );

  filtered.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'constant-card';
    card.title = `Insert ${c.symbol} (${c.value}) into calculation`;
    card.innerHTML = `
      <div class="constant-info">
        <span class="constant-name">${c.name} (${c.symbol})</span>
        <span class="constant-unit">${c.unit}</span>
      </div>
      <span class="constant-val">${c.value}</span>
    `;
    card.addEventListener('click', () => {
      appendValue(String(c.value));
      toggleConstantsModal(false);
    });
    constantsList.appendChild(card);
  });
};

if (constantsToggle) {
  constantsToggle.addEventListener('click', () => toggleConstantsModal(true));
}
if (constantsClose) {
  constantsClose.addEventListener('click', () => toggleConstantsModal(false));
}
if (constantsModal) {
  constantsModal.addEventListener('click', (e) => {
    if (e.target === constantsModal) toggleConstantsModal(false);
  });
}
if (constantsSearch) {
  constantsSearch.addEventListener('input', (e) => {
    renderConstantsList(e.target.value);
  });
}

// History search input listener
if (historySearch) {
  historySearch.addEventListener('input', renderHistory);
}

// Theme cycling
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.body.dataset.theme || 'dark';
    const nextIdx = (THEMES.indexOf(current) + 1) % THEMES.length;
    updateTheme(THEMES[nextIdx]);
  });
}

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
updateSoundToggleUI();
updateFinancialEmi();
updateFinancialTip();
updateFinancialDiscount();

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
