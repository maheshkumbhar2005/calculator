# Scientific Calculator

A browser-based progressive web application (PWA) calculator with scientific functions, unit converters, calculation history with timestamps and exports, memory registers, keyboard shortcuts, and theme persistence.

## Features

1. **ANS Button**: Store previous results and insert them directly into subsequent expressions.
2. **Clear Error Handling**: Specific user-friendly messages for `Cannot divide by zero`, `Invalid input`, and `Invalid Expression`.
3. **Calculation History with Timestamps**: Log every calculation with time formatted (e.g., `10 + 20 = 30 — 12:45 PM`) and click-to-reuse capability.
4. **Clear History**: Instantly clear history entries from both the view and local storage.
5. **Export History**: Download full calculation logs as CSV or TXT.
6. **Scientific Functions**: Trigonometric (`sin`, `cos`, `tan`), Inverse (`asin`, `acos`, `atan`), Logarithms (`log`, `ln`), Exponents (`x²`, `xʸ`, `√`), Factorial (`n!`), Constants (`π`, `e`), and Negation (`±`).
7. **2D Function Grapher (Canvas)**: Plot functions like $y = \sin(x)$, $y = x^2 - 4$, $y = \cos(x) \cdot x$ on an interactive grid with pan, zoom controls, coordinate hover inspection, and curve presets.
8. **Statistics & Data Analyzer**: Computes dataset metrics (Count, Sum, Mean, Median, Mode, Range, Variance $\sigma^2$, and Standard Deviation $\sigma$) with interactive frequency distribution chart.
9. **Scientific & Physics Constants Library**: Searchable database of verified constants (Speed of light $c$, Planck $h$, Gravitation $G$, Avogadro $N_A$, Elementary charge $e$, Boltzmann $k_B$, etc.) with 1-click insertion into calculations.
10. **Programmer Mode**: Real-time multi-base converter (**HEX**, **DEC**, **OCT**, **BIN**) with click-to-copy, bitwise operators (`AND`, `OR`, `XOR`, `NOT`, `<<`, `>>`), hex input keys (`A`–`F`), and word sizes (**64-bit**, **32-bit**, **16-bit**, **8-bit**).
11. **Financial Calculator Suite**:
    - **Loan / EMI Calculator**: Monthly installments, total interest, and total payout calculation.
    - **Tip & Bill Splitter**: Quick tip presets (10%, 15%, 18%, 20%), per-person total breakdown.
    - **Discount & Sales Tax / GST**: Calculate savings, tax, and final prices, with one-click transfer into the main calculator.
12. **8 Unit Converters**: Length, Weight, Temperature, Area, Volume, Speed, Time, and Data storage.
13. **Live Evaluation Preview**: Subtle running result preview underneath the display before pressing `=`.
14. **History Search & Filters**: Instant search bar to filter through previous calculations by expression or answer.
15. **Tactile Synthesizer Audio**: Web Audio API sound feedback for button clicks with instant mute toggle (`🔊` / `🔇`).
16. **5 Color Themes**: Instant cycle between **Dark Slate**, **Light Mode**, **Midnight OLED**, **Matrix Cyberpunk**, and **Sunset Rose**.
17. **Keyboard Shortcuts & Modal**: Full keyboard input support with quick cheat sheet modal triggered via `?` or `⌨️`.
18. **PWA Support**: Full Progressive Web App with offline service worker (`sw.js`) and web app manifest (`manifest.json`).
19. **Comprehensive Automated Tests**: 31 automated regression tests covering arithmetic, scientific math, error cases, bidirectional unit conversions, programmer base/bitwise logic, financial calculations, statistics, and function evaluation.

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
- `CONTRIBUTING.md` — Contribution guidelines and pull request instructions

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/maheshkumbhar2005/calculator/issues).

To get started, please read our [Contributing Guidelines](CONTRIBUTING.md) for details on code style, testing, and pull request procedures.
