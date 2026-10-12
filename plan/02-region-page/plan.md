# Plan: Green Home Grant – region page

*Based on `intent/02-region-page/intent.md` and `spec/02-region-page/spec.md`. Requirement numbers below refer to that spec.*

## Context

After the first page, people press "Check your eligibility" and reach `/region`, which is empty. The Green Home Grant needs to know what region of the UK someone is in, and to stop people outside the UK and tell them they aren't eligible. The page asks "In what region do you live?" with the five answers from `Questions.md`, used exactly.

The answers to the spec's open questions changed the original intent:
- The next page is the starter's `/ownership` page, "Do you own or rent your property?", with its four rental answers. It replaces "Do you own your home?" from `Questions.md`. For now it shows the question, answers and a "Back" link only, with no "Continue" button.
- The results page heading is "You are not eligible for a Green Home Grant".
- The browser's Back button works as normal on the results page.
- The answer is kept through going back and refreshing, and forgotten when the tab is closed.
- Typing `/result` without "Outside of the UK" as the last answer sends the user to the first page.

All open questions are settled, and the intent has been updated to match, so the intent, spec and this plan agree.

**What's already in place:**
- React, the page-routing library and the official GOV.UK Frontend styles are installed, and the page frame, cookie banner and first page are built and tested (`test/01-start-page/`).
- Node v22 and npm 10 are on the PATH at `/usr/bin`.
- The dev server runs on port 5000 at `https://lab11139.labs.decoded.com:5000/`, at the root of the address, so links such as `/region` work as written. Live reload is off, so refresh the browser by hand after each change.
- `/region` is an empty page. `/ownership` and `/result` are the starter's unfinished pages. The ownership page's "Back" link goes to `/property-type` and reloads the whole page.

**Rules most easily got wrong:**
- An answer is saved only when "Continue" is pressed with an answer selected (requirement 43). Selecting and then leaving saves nothing.
- On "Continue": no answer → the error, and nothing is saved. "Outside of the UK" → `/result`. Any other answer → `/ownership`.
- The results page decides what to show from the saved answer, not from how the user arrived. If the saved answer is "Outside of the UK", it shows the "not eligible" message, including after a refresh. Otherwise it sends the user to `/`.

## Steps

### Step 1: The region page's question, error and routing

- **Files:**
  - `src/pages/RegionPage.jsx`
  - new `src/components/GovukRadios.jsx`
  - new `src/components/BackLink.jsx`
  - new `src/components/ErrorSummary.jsx`
  - `test/01-start-page/start-page.test.jsx`
  - new `test/02-region-page/region-page.test.jsx`
- **Do:**
  - Build the region page using the design system's question page pattern: a "Back" link to `/`, the question "In what region do you live?" as the page heading, the five answers as radios in the order set by `Questions.md`, and a green "Continue" button (requirements 4–12).
  - Make the radios and "Back" link reusable components, matching the design system's markup, so the ownership page can use them. The "Back" link moves between pages without reloading the whole page.
  - Pressing "Continue" with nothing selected keeps the user on the page and shows:
    - the error summary, "There is a problem", with a "Select the region where you live" link. The summary is focused straight away, and its link moves focus to "England".
    - the red "Select the region where you live" message above the answers.
    - the tab title prefixed with "Error: " (requirements 13–18).
  - "Continue" with "Outside of the UK" selected opens `/result`. Any other answer opens `/ownership` (requirements 19, 20, 29).
  - Remove the first page's tests that expect `/region` to be empty and to use the service name as its tab title. Those requirements no longer apply.
  - Add tests for this step's requirements.
- **Check:**
  1. Run `npm test`. Every test passes.
  2. Run `npm run dev`, open `https://lab11139.labs.decoded.com:5000/` and click "Check your eligibility". Check the tab title, "Back" link, heading, five answers and "Continue" button match requirements 4–11 word for word, with nothing selected.
  3. Click "Continue" without choosing. Check the error box, the red message and the "Error:" tab title (requirements 14–18). Click the error box's link and check "England" is focused.
  4. Select "Wales" and click "Continue". The address ends in `/ownership`. Press Back, select "Outside of the UK" and click "Continue". The address ends in `/result`.
  5. Go to `/region`, click its "Back" link and check the first page opens (requirement 37). Press Tab from the "Back" link, use the arrow keys to choose an answer, Tab to "Continue" and press Enter (requirements 44, 45).

### Step 2: Keeping the answer

- **Files:**
  - new `src/journeyAnswers.js`
  - `src/pages/RegionPage.jsx`
  - `test/setup.js`
  - new `test/02-region-page/keeping-the-answer.test.jsx`
- **Do:**
  - Keep the journey's answers in the browser tab's session storage, under one key, so they survive going back and refreshing and are forgotten when the tab is closed.
  - Save the region answer only when "Continue" is pressed with an answer selected.
  - When the region page opens, preselect the saved answer, if there is one (requirements 39–43).
  - Clear session storage between tests, so tests don't affect each other.
- **Check:**
  1. Run `npm test`. Every test passes.
  2. In a private window, open `/region`, select "Scotland" and click "Continue". Press the browser's Back button: "Scotland" is selected. Refresh: it's still selected (requirements 39, 41).
  3. Click "Back", then "Check your eligibility": "Scotland" is still selected (requirement 40).
  4. Select "England" but click "Back" without continuing, then "Check your eligibility": "Scotland" is still selected (requirement 43).
  5. Close the tab, open `/region` in a new tab: nothing is selected (requirement 42).

### Step 3: The ownership page

- **Files:**
  - `src/pages/OwnershipPage.jsx`
  - new `test/02-region-page/ownership-page.test.jsx`
- **Do:**
  - Show the "Back" link to `/region`, the heading "Do you own or rent your property?" and its four answers as radios, using the components from step 1 (requirements 21–25).
  - Set the tab title to "Do you own or rent your property? – GOV.UK".
  - Don't add a "Continue" button. Nothing chosen on this page is saved (requirements 26, 27).
- **Check:**
  1. Run `npm test`. Every test passes.
  2. From `/region`, choose "Northern Ireland" and click "Continue". Check the tab title, "Back" link, heading and four answers match requirements 22–25 word for word, and there is no "Continue" button.
  3. Select "Rent from the council" and refresh: nothing is selected (requirement 27).
  4. Click "Back": the region page opens with "Northern Ireland" selected (requirement 23).
  5. Type `https://lab11139.labs.decoded.com:5000/ownership` into the address bar: the page shows, with no error (requirement 28).

### Step 4: The results page

- **Files:**
  - `src/pages/ResultPage.jsx`
  - new `test/02-region-page/result-page.test.jsx`
- **Do:**
  - If the saved region answer is "Outside of the UK", show the heading "You are not eligible for a Green Home Grant", then "The Green Home Grant is only available to people who live in the UK." The tab title is the heading followed by "– GOV.UK" (requirements 30–32).
  - Show no "Back" link, "Continue" button, link to change the answer or any other result (requirements 33, 34).
  - Otherwise, send the user to `/` without adding the results page to the browser's history (requirement 36).
- **Check:**
  1. Run `npm test`. Every test passes.
  2. In a private window, type `https://lab11139.labs.decoded.com:5000/result`. The first page opens, and the address ends in `/` (requirement 36).
  3. Go to `/region`, choose "England" and continue, then type `/result` after the address. The first page opens.
  4. Go to `/region`, choose "Outside of the UK" and continue. Check the heading, text and tab title match requirements 30–32, with no "Back" link, button or link to change the answer. Refresh: the message is still shown.
  5. Press the browser's Back button: the region page shows "Outside of the UK" selected (requirement 35).
  6. Set the browser's device toolbar to 320 pixels wide. The results, region and ownership pages have no sideways scrolling, and the region page's "Continue" button is full width (requirement 46).

## Verification (end to end)

From a clean state:
1. In `GreenEligibility`, run `npm install`, then `npm test` (every test in `test/01-start-page/` and `test/02-region-page/` passes), then `npm run lint` (no errors), then `npm run build` (it finishes with no errors).
2. Run `npm run dev`.
3. Open a fresh private browsing window at `https://lab11139.labs.decoded.com:5000/`.
4. Work through the spec's walkthrough (requirement 47), steps 1 to 12, in order. Every step should behave as described:
   - `/result` with no answer sends you to the first page
   - the region page's exact question, answers and "Continue" button
   - the error when nothing is chosen, and its link to "England"
   - each UK region reaching the ownership page, with its exact question and answers and no "Continue" button
   - the answer kept through Back, refresh and returning from the first page
   - `/result` after a UK region sends you to the first page
   - "Outside of the UK" reaching the "not eligible" message, which survives a refresh, with browser Back returning to the region page
   - 320-pixel width with no sideways scrolling
   - a new tab starting with no answer
5. Also run the first page's walkthrough (requirement 42 of `spec/01-start-page/spec.md`), skipping its checks that `/region` is empty, to confirm nothing on the first page has broken.
