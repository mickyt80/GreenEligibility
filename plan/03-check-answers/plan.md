# Plan: Green Home Grant – check answers page

*Based on `intent/03-check-answers/intent.md`, `spec/03-check-answers/spec.md` and `route.md`. Requirement numbers below refer to the check answers spec, unless they say "region spec", meaning `spec/02-region-page/spec.md`.*

## Context

People can answer the region question, but have no way to check their answer before getting a result, and can't get a positive result. This work adds a check answers page, using the GOV.UK Design System's "Check answers" pattern, and an "eligible" result. "Check your answer will always be shown before the results page."

The journey, from `route.md`:

```
start ->
	/region ->
		/check-answers (when "outside of the uk" is the /region answer) ->
			/result (not eligible)
		/Ownership (when any other answer is the /region answer) ->
			/check-answers ->
				/result (eligible)
```

Both open questions in the spec are settled, and the region page's intent and spec have been updated to match, so the documents and this plan agree. Compared with what's built now:
- "Outside of the UK" on the region page goes to `/check-answers`, not `/result` (region spec requirement 29).
- The ownership page gets a "Continue" button to `/check-answers` (region spec requirement 26).
- `/result` needs "Accept and continue" first, for both results (region spec requirements 35 and 36).

**What's already in place:**
- The region page, the ownership page and the "not eligible" result are built, with 121 passing tests.
- `src/journeyAnswers.js` keeps answers in the browser tab's session storage, and `GovukButton`, `BackLink` and `usePageTitle` can be reused.
- The starter has an unfinished page at `/check-answers`, already routed in `src/App.jsx`.
- Node v22 and npm 10 are on the PATH. The app runs with `npm run dev` at `https://lab11139.labs.decoded.com:5000/`, at the root of the address. Live reload is off, so refresh the browser by hand after each change.

**The results page's rule (the part most easily got wrong), checked in this order:**
1. "Accept and continue" hasn't been clicked since the region answer was last saved → send the user to the first page.
2. The region answer is "Outside of the UK" → "not eligible".
3. Any other region → "eligible".

Saving a region answer always clears the acceptance (requirement 28), even if the answer is the same as before.

## Steps

### Step 1: The new journey and the check answers page

- **Files:**
  - `src/pages/CheckAnswersPage.jsx`
  - `src/pages/RegionPage.jsx`
  - `src/pages/OwnershipPage.jsx`
  - `test/02-region-page/region-page.test.jsx`, `test/02-region-page/ownership-page.test.jsx`, `test/02-region-page/result-page.test.jsx`
  - new `test/03-check-answers/helpers.jsx`
  - new `test/03-check-answers/check-answers-page.test.jsx`
- **Do:**
  - On the region page, "Outside of the UK" now opens `/check-answers`. UK regions still open `/ownership` (requirements 1, 2).
  - Add a green "Continue" button under the ownership page's answers. It opens `/check-answers` without checking or saving the ownership answer (requirements 3–5).
  - Build the check answers page with the design system's "Check answers" pattern (requirements 6–12):
    - the heading "Check your answers"
    - a summary list with one row: "In what region do you live?", the saved answer, and a "Change" link to `/region`, with hidden text so screen readers hear "Change in what region do you live?"
    - a green "Accept and continue" button that opens `/result`
    - no "Back" link
  - Opening `/check-answers` with no saved region answer sends the user to the first page, without adding the page to the browser's history (requirement 14).
  - Update the region page's tests for region spec requirements 26 and 29. In the results page tests, reach the "not eligible" result through check answers.
  - Add tests for requirements 1–19 and 29.
- **Check:**
  1. Run `npm test`. Every test passes, except the results page tests that need step 2.
  2. Run `npm run dev`. In a private window, type `https://lab11139.labs.decoded.com:5000/check-answers`. The first page opens (requirement 14).
  3. Click "Check your eligibility", choose "Outside of the UK" and click "Continue". The address ends in `/check-answers`. Check the tab title, heading, row ("In what region do you live?", "Outside of the UK", "Change") and "Accept and continue" button match requirements 6–11, with no "Back" link. Refresh: it's the same (requirement 13).
  4. Click "Change". The region page opens with "Outside of the UK" selected (requirement 15). Choose "Wales" and click "Continue": the ownership page opens, with a "Continue" button. Click it without choosing: check answers shows "Wales" (requirements 3, 4, 18).
  5. Click "Change", then the region page's "Back" link. The first page opens (requirement 17).
  6. On check answers, press Tab: the focus goes to "Change", then "Accept and continue" (requirement 29).

### Step 2: Accepting the answers and the "eligible" result

- **Files:**
  - `src/journeyAnswers.js`
  - `src/pages/CheckAnswersPage.jsx`
  - `src/pages/RegionPage.jsx`
  - `src/pages/ResultPage.jsx`
  - `test/02-region-page/result-page.test.jsx`
  - new `test/03-check-answers/result-page.test.jsx`
- **Do:**
  - Clicking "Accept and continue" saves a note that the answers were accepted, alongside the region answer, then opens `/result`.
  - Saving a region answer on the region page clears that note (requirement 28).
  - The results page follows the rule in the Context section, in that order (requirements 20, 24, 27):
    - not accepted → the first page, without adding the results page to the browser's history
    - "Outside of the UK" → the existing "not eligible" message
    - any other region → "eligible"
  - The "eligible" result is the design system's green confirmation panel with the heading "You are eligible for a Green Home Grant", and nothing else. Its tab title is "You are eligible for a Green Home Grant – GOV.UK" (requirements 21–23).
  - Update the results page tests for region spec requirements 35 and 36: the browser's Back button now returns to check answers, and `/result` without acceptance opens the first page.
  - Add tests for requirements 20–28.
- **Check:**
  1. Run `npm test`. Every test passes.
  2. In a private window, go to `/region`, choose "Outside of the UK" and continue. On check answers, type `/result` after the address: the first page opens (requirement 27).
  3. Go to `/check-answers` and click "Accept and continue". The "not eligible" message shows (requirement 24). Refresh: it's still shown. Press the browser's Back button: check answers opens (requirements 25, 26).
  4. Click "Change", choose "England", click "Continue", then "Continue" on the ownership page. Type `/result` after the address: the first page opens, because the new answer undid the earlier acceptance (requirement 28).
  5. Go to `/check-answers` and click "Accept and continue". The green panel reads "You are eligible for a Green Home Grant", the tab title matches, and there's nothing else (requirements 21–23). Refresh: it's still shown. Press Back: check answers shows "England".
  6. At 320 pixels wide, there's no sideways scrolling on check answers or the "eligible" result, and "Accept and continue" is full width (requirement 30).

## Verification (end to end)

From a clean state:
1. In `GreenEligibility`, run `npm install`, then `npm test` (every test in `test/01-start-page/`, `test/02-region-page/` and `test/03-check-answers/` passes), then `npm run lint` (no errors), then `npm run build` (it finishes with no errors).
2. Run `npm run dev`.
3. Open a fresh private browsing window at `https://lab11139.labs.decoded.com:5000/`.
4. Work through the check answers spec's walkthrough (requirement 31), steps 1 to 10, in order. Every step should behave as described:
   - `/check-answers` with no answer sends you to the first page
   - "Outside of the UK" goes to check answers, not straight to the result
   - `/result` before "Accept and continue" sends you to the first page
   - the check answers page's exact heading, row and button, with no "Back" link
   - "not eligible" after "Accept and continue", surviving a refresh, with Back returning to check answers
   - "Change" to "Wales" going through the ownership page's "Continue" back to check answers
   - choosing a new answer undoing the earlier acceptance
   - the "eligible" panel and nothing else, surviving a refresh
   - the region page's "Back" link still going to the first page after "Change"
   - 320-pixel width with no sideways scrolling
5. Also run the region page's walkthrough (region spec requirement 47) to confirm nothing else on the region and ownership pages has broken.
