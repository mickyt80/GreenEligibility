# Plan: Green Home Grant – property questions (main residence, year built, EPC rating)

*Based on `intent/05-property-questions/intent.md`, `spec/05-property-questions/spec.md` and `route.md`. Requirement numbers below refer to the property questions spec, unless they say "ownership spec", meaning `spec/04-ownership-page/spec.md`.*

## Context

Anyone in the UK who owns their home is currently told they are eligible, without any questions about the home itself. This work adds three question pages after the ownership page, for owners only:
- **Main residence** (`/main-residence`): "Is this your main residence or a secondary home?"
- **Year built** (`/built-before-2000`): "Was your property built before the year 2000?"
- **EPC rating** (`/epc-rating`): "What is your home's EPC rating?"

An answer that means not eligible skips the remaining questions and goes straight to check answers. Check answers is still always shown before the result.

The spec has no open questions. The site owner's three follow-up answers are already in it:
- the addresses above
- an unanswered question on the path sends `/check-answers` (and `/result`) to the first page
- the EPC page shows A to G, then an "or" divider, then "Not known"

**What's already in place:**
- The region and ownership pages show how a question page works: `GovukRadios`, `ErrorSummary`, `BackLink` and `GovukButton`, with the answer saved in `journeyAnswers.js` on "Continue" (which also undoes any "Accept and continue").
- Check answers and the results page currently work out the path themselves, for the region and ownership only.
- 221 tests pass. Node v22 and npm 10 are on the PATH. The app runs with `npm run dev` at `https://lab11139.labs.decoded.com:5000/`. Live reload is off, so refresh the browser by hand.

**The path (the part most easily got wrong).** Each question is on the path only if the answer before it lets the user carry on:

| Question | On the path when | Answers that mean not eligible |
|---|---|---|
| Region | always | Outside of the UK |
| Ownership | region is a UK region | any "Rent" answer |
| Main residence | ownership is "Own (with or without mortgage)" | Secondary home |
| Year built | main residence is "First home" | No |
| EPC rating | year built is "Yes" | A, B, C |

The path stops at the first "not eligible" answer. Both check answers and the results page use this one path:
- **Check answers:** if any question on the path is unanswered → the first page. Otherwise, one row per question on the path.
- **Results page:** not accepted → the first page. Otherwise, it uses the same path. An unanswered question → the first page. The first "not eligible" answer → its reason. If every answer passes → eligible.

## Steps

### Step 1: The three question pages

- **Files:**
  - new `src/pages/MainResidencePage.jsx`, `src/pages/BuiltBefore2000Page.jsx`, `src/pages/EpcRatingPage.jsx`
  - new `src/components/QuestionPage.jsx`
  - `src/components/GovukRadios.jsx`
  - `src/pages/OwnershipPage.jsx`
  - `src/App.jsx`
  - `route.md`
  - `test/03-check-answers/helpers.jsx`, `test/04-ownership-page/helpers.jsx`, and the ownership and check answers tests that send "Own" to check answers
  - new `test/05-property-questions/helpers.jsx`, `test/05-property-questions/question-pages.test.jsx`
- **Do:**
  - Add a shared question page component for the three new pages. It covers the Back link, error summary, radios, "Continue", saving on "Continue", and the error tab title. Each page then only gives its question, answers, error message, Back address and where each answer leads.
  - Extend `GovukRadios` so answers can sit side by side (for "Yes" and "No"), and so an "or" divider can come before an answer (for "Not known").
  - Build the three pages with the exact wording, answers, error messages and next pages in requirements 4–14 and 17. Add their routes.
  - On the ownership page, "Own (with or without mortgage)" now opens `/main-residence`. "Rent" answers still open `/check-answers` (requirements 1, 2).
  - Add the three pages to `route.md`.
  - Update the test helpers that reach check answers with "Own" so they answer "First home", "Yes" and "D" on the way. Update the ownership tests that expected "Own" to open check answers (ownership spec requirement 9).
  - Add tests for requirements 1–25 and 34.
- **Check:**
  1. Run `npm test`. Every test passes, except the step 2 tests in `test/05-property-questions/`.
  2. Run `npm run dev`. In a private window, go to `/region`, choose "England", continue, choose "Own (with or without mortgage)" and continue. The address ends in `/main-residence`. Check the tab title, "Back" link, heading and the two answers one under the other (requirements 4, 5).
  3. Click "Continue" without choosing. Check the error box, the red message "Select if this is your main residence or a secondary home" and the "Error:" tab title. Click the box's link: "First home" is focused (requirements 16–18).
  4. Choose "First home" and continue. On `/built-before-2000`, "Yes" and "No" sit side by side. Choose "Yes" and continue. On `/epc-rating`, check A to G, then "or", then "Not known" (requirements 9, 13).
  5. Choose "D" and continue: check answers opens. Press the browser's Back button: "D" is selected. Click "Back" twice: "First home" is selected on `/main-residence` (requirements 19, 22).
  6. On `/main-residence` choose "Secondary home" and continue: check answers opens. Go to `/built-before-2000`, choose "No" and continue: check answers opens (requirements 7, 11).

### Step 2: The path on check answers and the results page

- **Files:**
  - new `src/journeyPath.js`
  - `src/pages/CheckAnswersPage.jsx`
  - `src/pages/ResultPage.jsx`
  - the check answers and ownership tests that expect "Own" to be eligible on its own (ownership spec requirement 22)
  - new `test/05-property-questions/check-answers-and-result.test.jsx`
- **Do:**
  - In `journeyPath.js`, set out the path table from the Context section once. Each question has its label, address, the hidden text for its "Change" link, when it is on the path, and its "not eligible" answers and reason.
  - Check answers uses the path. It sends the user to the first page if a question on the path is unanswered. Otherwise it shows one row per question on the path, in order, with each "Change" link's hidden text (requirements 26–30).
  - The results page uses the path. Not accepted, or an unanswered question → the first page. The first "not eligible" answer → its reason. If every answer passes → the green "eligible" panel. Only one reason is ever shown (requirements 31–33).
  - Add tests for requirements 26–33 and 35.
- **Check:**
  1. Run `npm test`. Every test passes.
  2. In a private window, answer "England", "Own", "First home" and "Yes", then type `/check-answers` after the address. The first page opens (requirement 30).
  3. Answer through to "D" on `/epc-rating`. Check answers shows five rows: region, ownership, main residence, year built, EPC rating, each with "Change". Click "Accept and continue": the green "eligible" panel shows (requirements 26, 32).
  4. Press Back. Change the EPC rating to "B" and accept: the EPC reason shows. Press Back. Change the year built to "No": check answers shows four rows. Accept: the year built reason shows (requirement 31).
  5. Press Back. Change the main residence to "Secondary home": check answers shows three rows. Accept: the main residence reason shows (requirements 26, 27, 31).
  6. Press Back. Change the main residence to "First home" and continue: "No" is still selected on `/built-before-2000`. At 320 pixels wide, there's no sideways scrolling on the new pages or on check answers with five rows (requirement 35).

## Verification (end to end)

From a clean state:
1. In `GreenEligibility`, run `npm install`, then `npm test` (every test in `test/01-start-page/` to `test/05-property-questions/` passes), then `npm run lint` (no errors), then `npm run build` (it finishes with no errors).
2. Run `npm run dev`.
3. Open a fresh private browsing window at `https://lab11139.labs.decoded.com:5000/`.
4. Work through the property questions spec's walkthrough (requirement 36), steps 1 to 11, in order. Every step should behave as described:
   - "Own" reaching `/main-residence`, with the error and its link to "First home"
   - "Yes" and "No" side by side, and the EPC page's "or" divider
   - `/check-answers` with an unanswered question sending you to the first page
   - five rows on check answers and the green "eligible" panel
   - the EPC, year built and main residence reasons, each one at a time, with four and three rows on check answers
   - answers kept when switching back, and the "Back" links
   - 320-pixel width with no sideways scrolling
   - a new tab starting with no answer
5. Also run the ownership spec's walkthrough (ownership spec requirement 31). Wherever it expects "Own" to reach check answers or the "eligible" result, answer "First home", "Yes" and "D" on the way. This confirms nothing else has broken.
