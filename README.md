# Scientific Calculator

A browser-based calculator with a scientific layout, memory functions, calculation history, keyboard support, and a light/dark theme.

## Features

- Basic arithmetic: addition, subtraction, multiplication, division
- Scientific functions: square root, square, reciprocal, percent, sin, cos, tan
- Memory actions: MS, M+, M-, MR, MC
- Calculation history panel with click-to-reuse entries
- Keyboard input support
- Dark/light theme toggle
- Clean number formatting for large and small values

## Run locally

From the project folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Run tests

```bash
node --test
```

## Project structure

- `index.html` — calculator layout
- `style.css` — theme and UI styling
- `script.js` — button and keyboard interaction logic
- `calculator.js` — arithmetic and scientific calculation helpers
- `test/calculator.test.js` — automated regression tests
