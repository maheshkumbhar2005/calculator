# Contributing to Scientific Calculator

Thank you for your interest in contributing to the **Scientific Calculator** project! We welcome contributions from developers of all skill levels. Whether you are fixing bugs, proposing new features, improving documentation, or adding unit tests, your help is appreciated.

---

## Code of Conduct

Please help us keep this project open, welcoming, and inclusive:
- Be respectful, constructive, and collaborative in discussions, issues, and code reviews.
- Focus on what is best for the community and project quality.

---

## How Can I Contribute?

### 1. Reporting Bugs
- Check the [Issues tab](https://github.com/maheshkumbhar2005/calculator/issues) to ensure the bug has not already been reported.
- Open a new issue with a descriptive title and include:
  - Steps to reproduce the bug.
  - Expected vs. actual behavior.
  - Screenshots or browser console error logs if applicable.
  - Your browser and operating system version.

### 2. Suggesting Enhancements
- Open an issue outlining the proposed calculator feature or mode.
- Explain the use case and why it would benefit users.

### 3. Submitting Pull Requests
Follow the development workflow below to contribute code.

---

## Development Workflow

### 1. Clone the Repository
```bash
git clone https://github.com/maheshkumbhar2005/calculator.git
cd calculator
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```
*Use conventional prefixes such as `feature/`, `bugfix/`, or `docs/`.*

### 3. Run Locally
The project uses vanilla JavaScript modules and native Node.js HTTP server without external package bloat:
```bash
node server.js
```
Open `http://localhost:3000` in your web browser.

### 4. Run Automated Tests
Before committing changes, make sure all automated regression tests pass:
```bash
node --test
```

### 5. Coding Standards & Guidelines
- **Modularity**: Place pure calculation helpers and algorithms in `calculator.js` so they can be independently tested.
- **UI Logic**: Keep DOM manipulation, keyboard hotkeys, and event listeners in `script.js`.
- **CSS Architecture**: Use CSS variables in `style.css` for consistent dark/light themes. Avoid ad-hoc inline styling.
- **Testing**: Add unit tests in `test/calculator.test.js` for any new mathematical or conversion functions.

---

## Commit Guidelines

Write clear, concise commit messages following standard conventions:
- `feat: add programmer mode and bitwise operations`
- `fix: resolve decimal precision in EMI calculation`
- `docs: update README with contributing guidelines`
- `test: add unit tests for base conversions`

---

## Pull Request Checklist

Before submitting your PR:
- [ ] Code runs without console errors.
- [ ] All tests pass (`node --test`).
- [ ] Documentation and README are updated if new features were introduced.
- [ ] PR title and description clearly explain the problem and solution.

Thank you for contributing! 🚀
