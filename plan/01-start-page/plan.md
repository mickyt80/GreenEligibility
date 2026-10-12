# Plan: Green Home Grant – first page

*Based on `intent/01-start-page/intent.md` and `spec/01-start-page/spec.md`. Requirement numbers below refer to the spec.*

## Context

UK citizens checking whether they can get the Green Home Grant need a first page that describes the scheme, "a government scheme that funds home insulation and heat pumps", and lets them continue with "Check your eligibility". The site is UI only, in React, with no backend, using the GOV.UK Design System.

The answers to the spec's open questions added the following to the original intent:
- The heading is "Check if you are eligible for a Green Home Grant", and each page's tab title is its heading followed by "– GOV.UK".
- Every page has a GOV.UK cookie banner, an alpha phase banner and a footer. The footer has only an "Accessibility statement" link.
- The next page is an empty `/region` page, and "View cookies" goes to an empty `/cookies` page.
- Styles come from the official GOV.UK Frontend package, not the starter's hand-written `App.css`.

All five open questions are settled, so the spec and this plan agree.

**What's already in place:**
- The `GreenEligibility` starter has React, Vite and the page-routing library installed.
- Node v22 and npm 10 are on the PATH at `/usr/bin`.
- The dev server already uses port 5000, behind the lab's reverse proxy at `https://lab11139.labs.decoded.com:5000/`.
- The site sits at the root of that address, not under a sub-path, so links such as `/region` work as written.
- The starter already has a header, phase banner, footer, start-button component and an accessibility statement page. They will be reused and corrected, not recreated.

**Cookie banner rule (the part most easily got wrong):**
- On load, if the browser already holds a cookie choice, no banner is shown at all.
- If there is no choice yet, the banner is shown on every page except `/cookies`.
- Accepting or rejecting saves the choice straight away, before "Hide cookie message" is clicked. So a refresh after accepting shows no banner (requirement 17).

## Steps

### Step 1: GOV.UK Frontend styles and the page frame

- **Files:**
  - `package.json`, `package-lock.json`
  - `index.html`
  - `src/main.jsx`
  - `src/App.jsx`
  - `src/App.css`
  - `src/components/GovukHeader.jsx`, `src/components/PhaseBanner.jsx`, `src/components/GovukFooter.jsx`
  - new `src/components/SkipLink.jsx`
  - `src/pages/AccessibilityStatementPage.jsx`
  - new folder `public/assets/`
- **Do:**
  - Install the official `govuk-frontend` package (current version, 6.x). Load its stylesheet once for the whole app. Make its fonts and images reachable at `/assets/` so the GOV.UK typeface and crown logo load.
  - Remove the starter's hand-written GOV.UK styles from `App.css`, so only the official styles apply.
  - Give the page the design system's template classes, and set the language to English.
  - Make the header, phase banner and footer match the design system's published markup:
    - The header shows the GOV.UK logo, linking to `/`.
    - The phase banner shows the "Alpha" tag and its sentence, with the "feedback" link going nowhere.
    - The footer has the licence statement, "© Crown copyright" and only an "Accessibility statement" link.
  - Mount them in order: skip link, header, phase banner, main content, footer. The skip link is "Skip to main content", and the main content area is its target.
  - Remove the accessibility statement page's own extra main area, so the page has only one.
  - Give each page a way to set its tab title as "heading – GOV.UK". The accessibility statement page uses "Accessibility statement – GOV.UK".
- **Check:**
  1. Run `npm install`, then `npm run build`. The build ends with a "built in" line and no errors.
  2. Run `npm run dev` and open `https://lab11139.labs.decoded.com:5000/`.
  3. You see the GOV.UK header and crown logo, the "Alpha" phase banner, and the footer with "© Crown copyright" and one "Accessibility statement" link, all in the GOV.UK typeface (requirements 3, 4, 5, 7).
  4. Click "feedback": nothing changes (requirement 6). Click the GOV.UK logo: you stay on the first page (requirement 4).
  5. Click "Accessibility statement": the address ends in `/accessibility-statement`, the starter's headings show, and the tab reads "Accessibility statement – GOV.UK" (requirements 39, 40). Press Back.
  6. Press Tab once: "Skip to main content" appears. Press Enter: focus moves to the main content (requirement 8).
  7. Run `npx vitest run test/01-start-page/page-frame.test.jsx`. All tests pass, except "the skip link and the cookie banner", which waits for step 3.

### Step 2: The first page, the empty `/region` page and the empty `/cookies` page

- **Files:**
  - `src/pages/StartPage.jsx`
  - `src/components/GovukButton.jsx`
  - new `src/pages/RegionPage.jsx`, new `src/pages/CookiesPage.jsx`
  - `src/App.jsx`
- **Do:**
  - Set out the first page using the "Start using a service" pattern:
    - the heading "Check if you are eligible for a Green Home Grant"
    - the description "The Green Home Grant is a government scheme that funds home insulation and heat pumps."
    - a green start button with an arrow, reading "Check your eligibility"
  - The start button is a link styled as a button, so it opens `/region` by click or by Enter, and the browser's Back button works.
  - Add the empty `/region` and `/cookies` pages. Each shows only the page frame, and its tab title is "Check if you are eligible for a Green Home Grant – GOV.UK".
  - Leave the starter's other pages and routes as they are, unlinked.
- **Check:**
  1. Open `https://lab11139.labs.decoded.com:5000/`.
  2. The tab, heading, description and button read exactly as in requirements 21–24. Nothing else appears between the phase banner and the footer (requirements 25–29).
  3. Click "Check your eligibility". The address ends in `/region`, the page is empty between the phase banner and footer, and the tab title is unchanged (requirements 30, 32, 33). Refresh: it's still the empty page, with no error (requirement 35). Press Back: the first page returns (requirement 34).
  4. Press Tab until "Check your eligibility" has the yellow focus highlight, then press Enter. `/region` opens (requirement 31).
  5. Type `https://lab11139.labs.decoded.com:5000/cookies` into the address bar. You see an empty page with the same tab title, and no error (requirements 36–38).
  6. Use the browser's device toolbar to set the width to 320 pixels on the first page. There is no sideways scrolling, and the button is full width (requirement 41, without the banner for now).
  7. Run `npx vitest run test/01-start-page/start-page.test.jsx`. All tests pass.

### Step 3: The cookie banner

- **Files:**
  - new `src/components/CookieBanner.jsx`
  - `src/App.jsx`
- **Do:**
  - Build the design system's cookie banner with the exact wording in requirements 10–14:
    - "Accept analytics cookies" and "Reject analytics cookies" buttons
    - a "View cookies" link to `/cookies`
    - an accepted or rejected confirmation message, with a "change your cookie settings" link to `/cookies` and a "Hide cookie message" button
  - Show it above the skip link on every page except `/cookies`, and only while no choice is saved.
  - Save the choice as soon as it's made, in a browser cookie that lasts one year.
  - "Hide cookie message" removes the banner.
  - Nothing is loaded or sent for analytics, whichever choice is made.
- **Check:** use a private browsing window, or clear the site's cookies first.
  1. Open the first page. The banner is at the very top, above the header, with the heading, text, buttons and link from requirements 9–12. Click "View cookies": `/cookies` opens with no banner (requirements 19, 36). Press Back.
  2. Click "Accept analytics cookies". You see the accepted message and "Hide cookie message" (requirement 13). Without hiding it, refresh: the banner has gone. Open `/region`: there is no banner either (requirement 17).
  3. In developer tools, under Application, then Cookies, the site has one cookie with an expiry about a year from today (requirement 17). The Network tab shows no requests to any analytics service (requirement 20).
  4. Clear the site's cookies and refresh: the banner is back (requirement 18). Click "Reject analytics cookies", and check the rejected message (requirement 14). Click "change your cookie settings": `/cookies` opens (requirement 15). Press Back: the rejected message is still showing. Click "Hide cookie message": the banner disappears (requirement 16).
  5. Clear the cookies again. Press Tab from the top: the banner's buttons come before "Skip to main content" (requirement 8). At 320 pixels wide, the banner fits without sideways scrolling (requirement 41).
  6. Run `npm test`. All tests in `test/01-start-page/` pass.

## Verification (end to end)

From a clean state:
1. In `GreenEligibility`, run `npm install`, then `npm test` (every test passes), then `npm run build` (it finishes with no errors).
2. Run `npm run dev`.
3. Open a fresh private browsing window at `https://lab11139.labs.decoded.com:5000/`.
4. Work through the spec's walkthrough (requirement 42), steps 1 to 12, in order. Every step should behave as described:
   - the cookie banner and its wording
   - the header, phase banner, feedback link and accessibility statement link
   - the first page's exact text, and nothing else
   - `/cookies` empty, with no banner
   - accepting, then refreshing without hiding: no banner
   - clearing cookies, rejecting and hiding
   - "Check your eligibility" to the empty `/region`, by mouse and by keyboard
   - Back, and refresh on `/region`
   - 320-pixel width with no sideways scrolling and a full-width button
