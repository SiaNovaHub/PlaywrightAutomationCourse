# QURE.md

## Repository overview

This repository is an end-to-end test automation sandbox centered on **Playwright** with a secondary **Cucumber + Playwright** BDD layer.

The codebase contains both **JavaScript** and **TypeScript** examples for the same flows, especially around a page-object-based client app checkout journey.

Primary target applications seen in the tests:
- `https://eventhub.rahulshettyacademy.com`
- `https://rahulshettyacademy.com/client`
- additional practice/demo pages used in individual example specs

## Main tooling

- **Test runner:** `@playwright/test`
- **BDD layer:** `@cucumber/cucumber`
- **Language mix:** CommonJS JavaScript plus some TypeScript test/page object files
- **Reporting:** Playwright HTML report, Allure packages present in dependencies
- **Other utilities:** `exceljs`

Relevant package scripts from `package.json`:
- `npm test` → `npx playwright test tests/WebAPI.spec.js`
- `npm run regression` → `npx playwright test`
- `npm run web` → `npx playwright test --grep @Web`

## Important directories

### Test suites
- `tests/` — main Playwright specs (`*.spec.js`, `*.spec.ts`)
- `features/` — Cucumber feature files
- `features/step_definitions/` — Cucumber step definitions
- `features/support/` — Cucumber hooks

### Page objects
- `pageobjects/` — JavaScript page objects
- `pageobjects_ts/` — TypeScript page objects

### Shared utilities and data
- `utils/` — JavaScript helpers
- `utils_ts/` — TypeScript helpers
- `utils/testData/` and `utils_ts/testData/` — JSON test data

### Generated artifacts already present
- `playwright-report/`
- `allure-report/`
- `allure-results/`
- `state.json` — browser storage state used by session-based tests

## Playwright configuration

There are two Playwright config files in the root:

### `playwright.config.js`
Used for the main `tests/` directory with these notable defaults:
- `testDir: './tests'`
- `fullyParallel: false`
- `workers: 1`
- `browserName: 'webkit'`
- `headless: false`
- `baseURL: 'https://eventhub.rahulshettyacademy.com'`
- `trace: 'only-on-failure'`
- `screenshot: 'only-on-failure'`
- viewport fixed to `1920x1080`
- reporter: `html`

### `playwright2.config.js`
Alternative config with a different execution profile:
- `testDir: './tests'`
- `fullyParallel: true`
- `browserName: 'chromium'`
- `headless: false`
- `trace: 'only-on-failure'`
- `screenshot: 'only-on-failure'`
- `viewport: null`
- browser launched maximized via `--start-maximized`
- reporter: `html`

## Observed test architecture and patterns

### 1. Playwright specs are the primary automation style
Most coverage lives in `tests/` and uses Playwright's built-in `test` and `expect` APIs.

Patterns seen in the repository:
- direct Playwright page-level tests for demo scenarios
- API/session-assisted UI tests
- network interception examples
- page-object-based E2E tests
- visual/screenshot examples
- data-driven tests

Representative spec files:
- `tests/PageObjectPractise.spec.ts`
- `tests/SessionAPI.spec.js`
- `tests/WebAPI.spec.js`
- `tests/UIBasicsTest.spec.js`
- `tests/EventsBanner.spec.js`

### 2. Page Object Model is an established convention
The client-app checkout flow is encapsulated in page objects and a manager class.

Key classes:
- `LoginPage`
- `DashboardPage`
- `CheckoutPage`
- `OrderConfirmationPage`
- `OrdersHistoryPage`
- `POManager`

`POManager` is used to construct and expose page objects from a single place. This is a strong existing convention and should be reused instead of creating ad hoc page helpers inside specs.

### 3. Both JavaScript and TypeScript variants exist
The repository keeps parallel implementations in some areas:
- JS page objects in `pageobjects/`
- TS page objects in `pageobjects_ts/`
- JS utilities in `utils/`
- TS utilities in `utils_ts/`

When adding or updating code, match the language of the surrounding test file.

### 4. Data-driven testing is already used
`tests/PageObjectPractise.spec.ts` loads JSON data from:
- `utils_ts/testData/PageObjectPracticeTestData.json`

This file is iterated to generate tests dynamically. Similar future coverage should prefer shared JSON fixtures over hardcoding multiple near-identical tests.

### 5. Custom Playwright fixtures are present
`utils_ts/test-base.ts` defines a custom extended test with a `testDataForOrder` fixture. Reuse this style when typed reusable test data is needed in TypeScript specs.

### 6. Session reuse via storage state is part of the suite
`tests/SessionAPI.spec.js` logs in once in `beforeAll`, saves storage state to `state.json`, and reuses it in a new browser context. This pattern is already accepted in the repo for authenticated flows.

## Cucumber / BDD layer

BDD coverage exists under `features/` with step definitions in `features/step_definitions/steps.js`.

Observed feature files:
- `features/Ecomm.feature`
- `features/ErrorValidation.feature`

Observed BDD patterns:
- hooks launch a Playwright Chromium browser for each scenario
- scenario context stores `page`, `poManager`, and transient business values like `orderId`
- steps reuse the same page object model as the Playwright specs
- screenshots are captured in `AfterStep` on failure

This means the BDD layer is not separate from the page object architecture; it is another entry point into the same abstraction layer.

## Selector and assertion style

Common selector strategies in existing tests:
- `getByRole(...)`
- `getByPlaceholder(...)`
- `locator('css')`
- `filter({ hasText: ... })`
- explicit waits like `.waitFor()` before interacting or asserting

Common assertion style:
- Playwright `expect(...)`
- boolean equality checks such as `expect(a === b).toBeTruthy()`
- visibility assertions like `await expect(locator).toBeVisible()`

When editing or adding tests, follow the existing Playwright style already used in nearby files rather than introducing a new assertion or helper style.

## Practical guidance for future work

### Prefer these conventions
- Put new Playwright coverage in `tests/`
- Reuse the existing page object structure for client-app flows
- Add page methods to page object classes instead of filling specs with low-level selectors
- Keep JavaScript tests with JavaScript helpers and TypeScript tests with TypeScript helpers
- Store reusable structured data in the existing `testData` JSON files/directories
- Keep Playwright assertions consistent with current usage

### Be aware of these repo characteristics
- The project is configured as `"type": "commonjs"`, but some files mix import-style syntax with CommonJS exports
- Browsers are configured to run **headed** by default in both Playwright configs
- HTML reports, traces, and screenshots are part of the default debugging workflow
- Some tests contain hardcoded credentials and product names for practice/demo environments

## Suggested commands

### Run all Playwright tests
```bash
npm run regression
```

### Run the default scripted test
```bash
npm test
```

### Run tests tagged with `@Web`
```bash
npm run web
```

### Run a single Playwright spec directly
```bash
npx playwright test tests/PageObjectPractise.spec.ts
```

### Run with the alternate Playwright config
```bash
npx playwright test --config=playwright2.config.js
```

### Run Cucumber features
No dedicated npm script is defined, but the repository includes feature files, hooks, and step definitions compatible with `cucumber-js`.

## What an AI/code assistant should assume about this repo

1. **Playwright is the main framework.**
2. **`tests/` is the default place for new automated coverage.**
3. **Page Object Model is the preferred abstraction for the client app flow.**
4. **TypeScript and JavaScript coexist; match the local pattern before adding code.**
5. **Cucumber scenarios reuse the same Playwright page objects rather than separate UI wrappers.**
6. **Failure diagnostics rely on Playwright traces, screenshots, and HTML reports.**
7. **The repo is primarily a test-learning/practice project with multiple example styles, not a single narrowly standardized production suite.**
