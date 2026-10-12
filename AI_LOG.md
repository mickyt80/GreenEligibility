# AI Assistance Log

Record every instance where you use AI to generate, refactor, or debug code. Four fields per entry: what you asked for, what the AI produced, what you changed, and why you changed it.

Document **3+ entries** in your AI_LOG covering **3-5 distinct patterns** from this list -- planning, multi-agent critique, plan-mode scaffolding, refactor, test generation. Aim for variety: an entry that just says "asked Claude to write X" three times doesn't demonstrate AI as a real engineering tool.

## Instance 1: Eligibility logic for married couple's allowance edge case

| Field | Detail |
|-------|--------|
| **Date** | YYYY-MM-DD |
| **Task** | Scaffolded eligibility check for married couple's allowance |
| **What AI Generated** | if/else chain covering 5 scenarios: single owner, joint owner, private renter, housing association renter, and council tenant. Used hardcoded age threshold of 65 for pension-credit eligibility. Did not include civil-partnership status. Error message on ineligible path was generic ("You are not eligible"). |
| **What You Changed + Why** | Removed hardcoded age threshold (was 65, should be state-pension-age variable) -- hardcoded age breaks if policy changes. Added missing civil-partnership case alongside married status -- civil partnership is a legal requirement since 2004. Changed error message from generic to specific ("You are not eligible because your household income exceeds the threshold") -- generic errors do not help users correct their input. |

## Instance 2: Test generation, then building the first page against the tests

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Task** | Asked Claude to generate unit tests from `plan/01-start-page/plan.md` before any code existed, then to build the plan one step at a time (frame, first page, cookie banner) until the tests passed. |
| **What AI Generated** | **Tests (`test/`):** 67 Vitest and Testing Library tests in `test/01-start-page/` (`page-frame`, `start-page` and `cookie-banner` test files, plus a shared `helpers.jsx` that renders the whole app at a given address). Each test names the spec requirement it checks. Also `vitest.config.js`, `test/setup.js` and an `npm test` script. First run: 57 failing, 10 passing, as expected before the build.<br>**Source (`src/`):** official GOV.UK Frontend markup for `GovukHeader`, `PhaseBanner`, `GovukFooter` (only an "Accessibility statement" link) and `GovukButton` (now a start-button link with an arrow). New `GovukLogo`, `SkipLink`, `CookieBanner`, `RegionPage`, `CookiesPage` and a `usePageTitle` hook. `StartPage` filled in. `App.jsx` given the frame order (cookie banner, skip link, header, phase banner, main, footer) and the `/region` and `/cookies` routes. The extra `<main>` removed from `AccessibilityStatementPage`. The hand-written GOV.UK styles in `App.css` replaced by the official stylesheet, loaded in `main.jsx`.<br>**Corrections Claude made to its own tests during the build:** the two style tests read the wrong file, because `import.meta.url` isn't a file path under jsdom, so they now read from the project folder. The "nothing else on the page" test expected spaces that `textContent` doesn't add, so it now compares without whitespace. It also corrected a step 3 check in `plan.md` that wrongly said a refresh after "Reject" would bring the banner back. Final result: 67 of 67 passing. |
| **What You Changed + Why** | *To complete: what you reviewed, questioned or changed yourself in these test and src files, and why. For example, did you agree with the corrected tests, or with how the footer test allows the standard licence and copyright links?*
We questioned claude throughout the planning phase on language choices to be used in the site. As well as altering the use of vite to not allow for updating code to change the site as and when, this was because the page refreshed every few seconds, making for a bad user experience. |

## Instance 3

| Field | Detail |
|-------|--------|
| **Date** | |
| **Task** | |
| **What AI Generated** | |
| **What You Changed + Why** | |
