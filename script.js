import {
  calculateExpression,
  formatNumber,
  percentValue,
  reciprocalValue,
  sqrtValue,
  squareValue,
} from './calculator.js';

const display = document.getElementById('display');
const themeToggle = document.getElementById('theme-toggle');
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

const clearExpression = () => {
  expression = '';
  updateDisplay('0');
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
    updateDisplay(formatDisplayValue(expression));
  } catch (error) {
    expression = '';
    updateDisplay('Error');
  }
};

document.querySelectorAll('[data-value]').forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    appendValue(value);
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
clearExpression();
