import { calculateExpression } from './calculator.js';

const display = document.getElementById('display');
let expression = '';

const updateDisplay = (value) => {
  display.value = value;
};

const appendValue = (value) => {
  if (value === '.' && expression.endsWith('.')) {
    return;
  }

  if (['+', '-', '*', '/'].includes(value)) {
    const lastChar = expression.slice(-1);
    if (!expression || ['+', '-', '*', '/'].includes(lastChar)) {
      if (value === '-' && (!expression || ['+', '-', '*', '/'].includes(lastChar))) {
        expression += value;
      } else if (expression && !['+', '-', '*', '/'].includes(lastChar)) {
        expression += value;
      }
      updateDisplay(expression || '0');
      return;
    }
  }

  expression += value;
  updateDisplay(expression);
};

const clearExpression = () => {
  expression = '';
  updateDisplay('0');
};

const deleteLast = () => {
  expression = expression.slice(0, -1);
  updateDisplay(expression || '0');
};

const evaluate = () => {
  if (!expression) {
    updateDisplay('0');
    return;
  }

  try {
    const result = calculateExpression(expression);
    expression = String(result);
    updateDisplay(expression);
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

document.querySelector('[data-action="clear"]').addEventListener('click', clearExpression);
document.querySelector('[data-action="delete"]').addEventListener('click', deleteLast);
document.querySelector('[data-action="equals"]').addEventListener('click', evaluate);

updateDisplay('0');
