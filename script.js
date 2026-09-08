import {
  calculateExpression,
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

const memory = createMemoryState();
const history = createHistoryState();
let expression = '';

const formatDisplayValue = (value) => {
  const number = Number(value);
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

  entries.slice(-8).reverse().forEach((entry) => {
    const item = document.createElement('li');
    item.textContent = entry;
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
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
};

const appendValue = (value) => {
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
      updateDisplay(formatDisplayValue(expression));
      return;
    }
  }

  expression += value;
  updateDisplay(formatDisplayValue(expression));
};

const deleteLast = () => {
  expression = expression.slice(0, -1);
  updateDisplay(expression ? formatDisplayValue(expression) : '0');
};

const applyMemoryAction = (action) => {
  if (!expression) {
    return;
  }

  const value = Number(expression);
  if (Number.isNaN(value)) {
    return;
  }

  if (action === 'memory-add') {
    memory.add(value);
  } else if (action === 'memory-subtract') {
    memory.subtract(value);
  } else if (action === 'memory-recall') {
    expression = String(memory.recall());
    updateDisplay(formatDisplayValue(expression));
    updateMemoryIndicator();
    return;
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

const evaluate = () => {
  if (!expression) {
    updateDisplay('0');
    return;
  }

  try {
    const result = calculateExpression(expression);
    expression = String(result);
    history.add(`${expression}`);
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

updateTheme('dark');
updateMemoryIndicator();
renderHistory();
clearExpression();
