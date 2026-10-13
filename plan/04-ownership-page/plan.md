# Plan: Green Home Grant – ownership page

*Based on `intent/04-ownership-page/intent.md`, `spec/04-ownership-page/spec.md` and `route.md`. Requirement numbers below refer to the ownership spec, unless they say "check answers spec", meaning `spec/03-check-answers/spec.md`.*

## Context

The `/ownership` page asks "Do you own or rent your property?", but the answer does nothing, so everyone in the UK is told they are eligible. This work makes the answer count: only "Own (with or without mortgage)" can be eligible, and the three "Rent" answers are not eligible.

The journey in `route.md` doesn't change: every answer goes to check answers, then the result after "Accept and continue".

The answers to the spec's questions settled:
- With a UK region but no ownership answer, typing `/check-answers` opens the first page (changed from the ownership page).
- The ownership answer is kept when the region switches to "Outside of the UK" and back, so the earlier answer is still selected.
- The ownership row's "Change" link reads "Change whether you own or rent your property" to screen readers.

All open questions are settled, so the intent, spec and this plan agree.

**What's already in place:**
- The ownership page shows its question, four answers, "Back" link and a "Continue" button that always goes to `/check-answers`.
- `GovukRadios` and `ErrorSummary` already give the region page its error. `journeyAnswers.js` keeps answers by question in the tab's session storage, and saving any answer already clears the "accepted" note.
- Check answers shows one row (region), and the results page checks: not accepted → first page; "Outside of the UK" → not eligible; otherwise → eligible.
- 177 tests pass. Node v22 and npm 10 are on the PATH. The app runs with `npm run dev` at `https://lab11139.labs.decoded.com:5000/`. Live reload is off, so refresh the browser by hand.

**Rules most easily got wrong:**
- **Check answers**, in this order: no region → first page; UK region with no ownership answer → first page; otherwise show the rows. The ownership row appears only for a UK region.
- **Results page**, in this order:
  1. not accepted → first page
  2. "Outside of the UK" → "The Green Home Grant is only available to people who live in the UK." (whatever the ownership answer)
  3. no ownership answer → first page
  4. any "Rent" answer → "The Green Home Grant is only available to people who own their home."
  5. "Own (with or without mortgage)" → eligible
- Only one reason is ever shown.

## Steps

### Step 1: The ownership question's error and keeping the answer

- **Files:**
  - `src/pages/OwnershipPage.jsx`
  - `test/02-region-page/ownership-page.test.jsx`
  - `test/03-check-answers/helpers.jsx`, `test/03-check-answers/check-answers-page.test.jsx`
  - new `test/04-ownership-page/helpers.jsx`
  - new `test/04-ownership-page/ownership-question.test.jsx`
- **Do:**
  - Turn the ownership page into a question page like the region page: the radios and "Continue" in a form, with the saved answer preselected (requirements 1, 2).
  - Pressing "Continue" with nothing selected shows the error summary and red message "Select if you own or rent your property", focuses the summary, links to "Own (with or without mortgage)", and prefixes the tab title with "Error: " (requirements 3–8).
  - Pressing "Continue" with an answer saves it, which also clears any earlier "Accept and continue", then opens `/check-answers` (requirements 9–15).
  - Update the check answers tests' `reachCheckAnswers` helper to choose "Own (with or without mortgage)" before "Continue". Update the check answers spec's requirement 4 and 5 tests, which pressed "Continue" with nothing selected and expected nothing to be kept.
  - Add tests for requirements 1–15 and 29.
- **Check:**
  1. Run `npm test`. Every test passes, except the step 2 tests in `test/04-ownership-page/`.
  2. Run `npm run dev`. In a private window, go to `/region`, choose "England" and continue. Click "Continue" without choosing. Check the error box, the red message and the "Error:" tab title (requirements 4–7). Click the error box's link: "Own (with or without mortgage)" is focused.
  3. Choose "Rent from the council" and click "Continue": check answers opens. Press the browser's Back button: "Rent from the council" is selected. Refresh: it's still selected (requirements 10, 11).
  4. Click "Back", then "Continue" on the region page: "Rent from the council" is still selected (requirement 12).
  5. Choose "Rent from a private landlord", but click "Back" without continuing. Click "Continue" on the region page: "Rent from the council" is still selected (requirement 13).
  6. Close the tab, open a new one, and go to `/ownership`: nothing is selected (requirement 14).

### Step 2: The ownership row on check answers and the renters' result

- **Files:**
  - `src/pages/CheckAnswersPage.jsx`
  - `src/pages/ResultPage.jsx`
  - `test/03-check-answers/check-answers-page.test.jsx`, `test/03-check-answers/result-page.test.jsx`
  - new `test/04-ownership-page/check-answers-and-result.test.jsx`
- **Do:**
  - For a UK region, check answers shows a second row after the region row: "Do you own or rent your property?", the answer, and a "Change" link to `/ownership` with the hidden text " whether you own or rent your property" (requirements 16, 17, 19).
  - For "Outside of the UK", check answers shows the region row only, while keeping the saved ownership answer (requirements 18, 28).
  - Check answers sends anyone with a UK region but no ownership answer to the first page, without adding it to the browser's history (requirements 20, 21).
  - The results page follows the order in the Context section. The two "not eligible" results share the heading and tab title, and differ only in the reason (requirements 22–27).
  - Update the check answers tests that expect one row or one link for a UK region.
  - Add tests for requirements 16–28.
- **Check:**
  1. Run `npm test`. Every test passes.
  2. In a private window, go to `/region`, choose "England" and continue to the ownership page. Type `/check-answers` after the address: the first page opens (requirement 20).
  3. Go to `/region`, continue with "England", choose "Rent from the council" and continue. Check answers shows two rows: "In what region do you live?" with "England", then "Do you own or rent your property?" with "Rent from the council", each with "Change" (requirement 16).
  4. Click "Accept and continue". Check the heading "You are not eligible for a Green Home Grant", the text "The Green Home Grant is only available to people who own their home.", and nothing else (requirements 23, 25).
  5. Press Back. Click the ownership row's "Change", choose "Own (with or without mortgage)" and continue. Type `/result` after the address: the first page opens (requirement 15). Go to `/check-answers`, click "Accept and continue": the green "eligible" panel shows (requirement 22).
  6. Press Back. Click the region row's "Change", choose "Outside of the UK" and continue. Check answers shows only the region row. Click "Accept and continue": only the UK reason shows (requirements 18, 24, 27). Press Back, click "Change", choose "England" and continue: "Own (with or without mortgage)" is still selected (requirement 28).

## Verification (end to end)

From a clean state:
1. In `GreenEligibility`, run `npm install`, then `npm test` (every test in `test/01-start-page/`, `test/02-region-page/`, `test/03-check-answers/` and `test/04-ownership-page/` passes), then `npm run lint` (no errors), then `npm run build` (it finishes with no errors).
2. Run `npm run dev`.
3. Open a fresh private browsing window at `https://lab11139.labs.decoded.com:5000/`.
4. Work through the ownership spec's walkthrough (requirement 31), steps 1 to 12, in order. Every step should behave as described:
   - the ownership page's error, its link to the first answer, and the "Error:" tab title
   - `/check-answers` with a UK region but no ownership answer sending you to the first page
   - two rows on check answers for a UK region
   - the answer kept through Back and refresh
   - the renters' "not eligible" result, with one reason and nothing else
   - changing to "Own" undoing the earlier acceptance, then the green "eligible" panel
   - "Outside of the UK" showing only the region row and the UK reason, and the ownership answer kept when switching back
   - 320-pixel width with no sideways scrolling
   - a new tab starting with no answer
5. Also run the check answers spec's walkthrough (check answers spec requirement 31). Choose "Own (with or without mortgage)" wherever it reaches the ownership page, to confirm nothing else has broken.
