# Scientific Calculator

A browser-based progressive web application (PWA) calculator with scientific functions, unit converters, calculation history with timestamps and exports, memory registers, keyboard shortcuts, and theme persistence.

## Features

1. **ANS Button**: Store previous results and insert them directly into subsequent expressions.
2. **Clear Error Handling**: Specific user-friendly messages for `Cannot divide by zero`, `Invalid input`, and `Invalid Expression`.
3. **Calculation History with Timestamps**: Log every calculation with time formatted (e.g., `10 + 20 = 30 — 12:45 PM`) and click-to-reuse capability.
4. **Clear History**: Instantly clear history entries from both the view and local storage.
5. **Export History**: Download full calculation logs as CSV or TXT.
6. **Scientific Functions**: Trigonometric (`sin`, `cos`, `tan`), Inverse (`asin`, `acos`, `atan`), Logarithms (`log`, `ln`), Exponents (`x²`, `xʸ`, `√`), Factorial (`n!`), Constants (`π`, `e`), and Negation (`±`).
7. **8 Unit Converters**: Length, Weight, Temperature, Area, Volume, Speed, Time, and Data storage.
8. **Keyboard Shortcuts**:
   - `Enter` / `=` → Calculate
   - `Escape` → Clear expression
   - `Backspace` → Delete character
   - `Ctrl + H` → Toggle history panel
   - `Ctrl + C` → Copy result to clipboard
9. **Theme Persistence**: Light and Dark modes persisted across page reloads via `localStorage`.
10. **PWA Support**: Full Progressive Web App with offline service worker (`sw.js`) and web app manifest (`manifest.json`).
11. **Comprehensive Automated Tests**: 23 automated regression tests for arithmetic, scientific math, error cases, and bidirectional unit conversions.

## Run locally

From the project folder:

```bash
node server.js
```

Then open:

```text
http://localhost:3000
```

## Run tests

```bash
node --test
```

## Project structure

- `index.html` — Calculator layout and UI
- `style.css` — High-contrast themes and styling
- `script.js` — Interaction logic, keyboard shortcuts, PWA registration
- `calculator.js` — Arithmetic, scientific calculation, unit conversion, and history export helpers
- `sw.js` — Service worker for offline caching and PWA support
- `manifest.json` — PWA configuration and metadata
- `icon.svg` — Vector app icon
- `test/calculator.test.js` — Regression test suite
