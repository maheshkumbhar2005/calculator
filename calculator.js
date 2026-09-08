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

export { add, subtract, multiply, divide, calculateExpression };
