# Team Green: GreenEligibility
App: https://app-lab11139.labs.decoded.com/
Code: https://github.com/mickyt80/GreenEligibility/tree/feat-version-1

## What it is

**Check if you are eligible for a Green Home Grant** is a GOV.UK-style service. The Green Home Grant is a government scheme that funds home insulation and heat pumps. The service asks a few questions, one per page:

1. In what region do you live?
2. Do you own or rent your property?
3. Is this your main residence or a secondary home?
4. Was your property built before the year 2000?
5. What is your home's EPC rating?

It then shows a "Check your answers" page, and tells the user whether they are eligible, may be eligible, or are not eligible and why. An answer that means "not eligible" skips the remaining questions. See [`flow.md`](flow.md) for a diagram of the journey.

It is built with React and Vite, and styled with the official [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/). It runs entirely in the browser, with no backend: answers are kept in the browser tab until it is closed. Every page is available in English and Welsh (the Welsh is a draft, to be checked by a Welsh speaker).

The intent, spec and plan for each part are in `intent/`, `spec/` and `plan/`.

## Getting started

You need Node.js 22 and npm. Install the dependencies once:

```
npm install
```

## Run the application

```
npm run dev
```

This starts the development server on port 5000 (set `VITE_PORT` in `.env` to change it). Open http://localhost:5000, or on the lab machine https://lab11139.labs.decoded.com:5000. Live reload is off, so refresh the browser after changing the code.

## Build

```
npm run build
```

This builds the site into `dist/`. To serve that build instead of the development server:

```
npm run preview
```

## Run the tests

| Command | What it runs |
|---|---|
| `npm test` | The unit tests in `test/`, with Vitest in a simulated browser. Each test names the spec requirement it checks. |
| `npm run test:e2e` | The end-to-end tests in `e2e/`, with Playwright in a real Chromium browser. It reuses a server already running on port 5000, or starts `npm run dev`. |
| `npm run test:e2e:ui` | Playwright's UI mode, to watch the end-to-end tests run. Open port 5002 (https://lab11139.labs.decoded.com:5002 on the lab machine). |
| `npm run test:e2e:report` | The report from the last end-to-end run, on port 5001. |
| `npm run lint` | ESLint over the code and tests. |

Before running the end-to-end tests for the first time, install Playwright's browser:

```
npx playwright install chromium
```

If port 5000 is being served by `npm run preview`, run `npm run build` first, or the end-to-end tests will check the last build rather than your latest code.
