import {
  calculateExpression,
  convertLength,
  convertTemperature,
  createHistoryState,
  createMemoryState,
  formatNumber,
  percentValue,
  reciprocalValue,
  sqrtValue,
  squareValue,
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
        nextValue = Math.sin((value * Math.PI) / 180);
        break;
      case 'cos':
        nextValue = Math.cos((value * Math.PI) / 180);
        break;
      case 'tan':
        nextValue = Math.tan((value * Math.PI) / 180);
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

const updateUnitOptions = () => {
  const type = unitTypeSelect.value;
  const temperatureOptions = ['c', 'f', 'k'];
  const lengthOptions = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd'];
  const options = type === 'temperature' ? temperatureOptions : lengthOptions;

  const buildOptions = (select, selected) => {
    select.innerHTML = options
      .map((option) => `<option value="${option}" ${option === selected ? 'selected' : ''}>${option.toUpperCase()}</option>`)
      .join('');
  };

  if (type === 'temperature') {
    buildOptions(fromUnitSelect, 'c');
    buildOptions(toUnitSelect, 'f');
  } else {
    buildOptions(fromUnitSelect, 'cm');
    buildOptions(toUnitSelect, 'm');
  }
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
    const result = type === 'temperature'
      ? convertTemperature(value, fromUnit, toUnit)
      : convertLength(value, fromUnit, toUnit);

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
    applyScientificAction('percent');
  } else if (loweredKey === 'n') {
    event.preventDefault();
    applyScientificAction('toggle-sign');
  }
});

themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  updateTheme(nextTheme);
});

unitTypeSelect.addEventListener('change', updateUnitOptions);
convertButton.addEventListener('click', handleUnitConversion);
updateUnitOptions();
updateTheme('dark');
updateMemoryIndicator();
renderHistory();
clearExpression();
