# Spec: Green Home Grant – check answers page

*Based on `intent/03-check-answers/intent.md`, `route.md` and the GOV.UK Design System's "Check answers" pattern, plus the site owner's answers on 2026-10-13. It builds on `spec/01-start-page/spec.md` and `spec/02-region-page/spec.md`. Everything there about starting the app, the page frame, and the region page's question, error and keeping of answers still applies, except where this spec says otherwise.*

## Requirements

### The journey

1. On the region page, choosing England, Scotland, Wales or Northern Ireland and clicking "Continue" opens the ownership page, as before.
2. On the region page, choosing "Outside of the UK" and clicking "Continue" opens the check answers page, and the address bar ends in `/check-answers`. It no longer opens the results page.
3. The ownership page now shows a green GOV.UK button reading exactly "Continue", under its four answers.
4. Clicking "Continue" on the ownership page opens the check answers page. This happens whether or not an ownership answer is selected.
5. The ownership answer is still not kept: going back to the ownership page shows no answer selected, and the check answers page doesn't show it.

### The check answers page

6. The browser tab reads "Check your answers – GOV.UK".
7. The page heading reads "Check your answers".
8. Under the heading, the page shows a list with one row. The row shows the label "In what region do you live?", the region answer last continued with (for example "Wales" or "Outside of the UK"), and a "Change" link.
9. A screen reader reads the link as "Change in what region do you live?", so it's clear what it changes.
10. The page has no "Back" link.
11. Under the list, the page shows a green GOV.UK button reading exactly "Accept and continue".
12. The page shows no other rows, questions, form fields, links or buttons, apart from the cookie banner.
13. Refreshing the check answers page shows the same answer.
14. Typing `https://lab11139.labs.decoded.com:5000/check-answers` into the address bar without having answered the region question opens the first page, and the address bar ends in `/`.

### Changing the region answer

15. Clicking "Change" opens the region page at `/region`, with the current answer selected.
16. The region page then works exactly as it does the first time through: the same tab title, heading, answers, error, "Continue" button and "Back" link.
17. The region page's "Back" link still opens the first page.
18. After "Change", choosing a UK region and clicking "Continue" opens the ownership page. Clicking "Continue" there opens the check answers page, which shows the new answer.
19. After "Change", choosing "Outside of the UK" and clicking "Continue" opens the check answers page, which shows "Outside of the UK".

### The result

20. Clicking "Accept and continue" opens the results page, and the address bar ends in `/result`.
21. With England, Scotland, Wales or Northern Ireland as the answer, the results page shows a green GOV.UK confirmation panel with the heading "You are eligible for a Green Home Grant".
22. The browser tab then reads "You are eligible for a Green Home Grant – GOV.UK".
23. The "eligible" result shows nothing else: no other text, no "Back" link, no buttons and no link to change the answer.
24. With "Outside of the UK" as the answer, the results page shows the existing "not eligible" message: the heading "You are not eligible for a Green Home Grant", the text "The Green Home Grant is only available to people who live in the UK.", and the tab title "You are not eligible for a Green Home Grant – GOV.UK".
25. Refreshing either result still shows it.
26. Pressing the browser's Back button on either result returns to the check answers page.

### Opening the results page directly

27. Typing `https://lab11139.labs.decoded.com:5000/result` before clicking "Accept and continue" opens the first page, whatever the region answer. This includes "Outside of the UK".
28. Saving a new region answer on the region page undoes an earlier "Accept and continue". Typing `/result` after that opens the first page until "Accept and continue" is clicked again.

### Using a keyboard

29. Pressing Tab on the check answers page moves to the "Change" link, then to "Accept and continue", each showing the yellow GOV.UK focus highlight. Pressing Enter on either does the same as clicking it.

### Phone-sized screens

30. At a 320-pixel-wide window, the check answers page and the "eligible" result can be read without scrolling sideways, and the "Accept and continue" button stretches to the full width of the content.

### Walkthrough

31. Anyone can check the pages by following these steps. Start in a new private browsing window, so that no answer has been kept.
    1. Start the app (`npm run dev`) and open `https://lab11139.labs.decoded.com:5000/check-answers`. Check you are sent to the first page.
    2. Click "Check your eligibility", choose "Outside of the UK" and click "Continue". Check the address ends in `/check-answers` and the row shows "Outside of the UK".
    3. Type `/result` after the address. Check you are sent to the first page. Go to `/check-answers` again.
    4. Check the tab title, heading, row ("In what region do you live?", "Outside of the UK", "Change") and "Accept and continue" button match requirements 6–11, with no "Back" link.
    5. Click "Accept and continue". Check the "not eligible" message shows. Refresh, and check it's still shown. Press the browser's Back button, and check the check answers page opens.
    6. Click "Change". Check the region page opens with "Outside of the UK" selected. Choose "Wales" and click "Continue". On the ownership page, check there is a "Continue" button, and click it without choosing an answer. Check the check answers page shows "Wales".
    7. Type `/result` after the address. Check you are sent to the first page, because choosing "Wales" undid the earlier "Accept and continue". Go to `/check-answers` again.
    8. Click "Accept and continue". Check the green panel reads "You are eligible for a Green Home Grant", the tab title matches, and nothing else is shown. Refresh, and check it's still shown.
    9. Press the browser's Back button. Check the check answers page shows "Wales". Click "Change", click the region page's "Back" link, and check the first page opens.
    10. Narrow the window to about 320 pixels. Check there is no sideways scrolling on the check answers page or the "eligible" result, and that "Accept and continue" is full width.

## Decisions

| Decision | Reason |
|---|---|
| Keep building in React inside the existing starter, UI only, with the official GOV.UK Frontend styles and no backend. | Required. This carries over from the earlier specs. |
| Follow the journey in `route.md`: "Outside of the UK" → check answers → "not eligible"; any other region → ownership → check answers → "eligible". | Required. "Check your answer will always be shown before the results page." |
| The check answers page is at `/check-answers`, not `/check` as `route.md` has it. | Required (follow-up answer, 2026-10-13). It keeps the starter's address. |
| "Outside of the UK" on the region page now goes to `/check-answers`. | Required. This updates requirements 29 and 35 of the region page's spec. |
| Lay out the page with the design system's "Check answers" pattern: heading, then a summary list, then the "Accept and continue" button. | Required. The intent asks for the existing GOV.UK pattern. |
| Leave out the pattern's optional "Now send your application" section. | Nothing is being sent; the button only shows the result. |
| The row's label is the full question, "In what region do you live?". | Required. The site owner chose the full question over a short label. |
| The "Change" link includes hidden text, " in what region do you live?", for screen readers. | Design system guidance, so each "Change" link makes sense on its own. |
| "Change" opens the plain `/region` page, with no marker in the address. | The region page now works the same way every time, so it doesn't need to know where the user came from. |
| The tab title is "Check your answers – GOV.UK", and the eligible result's is "You are eligible for a Green Home Grant – GOV.UK". | Each page's title is its heading, as settled for the first page. |
| The ownership page's "Continue" button goes to `/check-answers` without checking or saving the ownership answer. | Required. Saving and checking it is out of scope. This updates requirements 26 and 27 of the region page's spec. |
| Pressing "Accept and continue" saves a note that the answers were accepted, alongside the region answer in the tab's session storage. | Either result is shown only after acceptance, and it has to survive a refresh. |
| Saving any new region answer clears that note. | Required (open question 1). |
| The results page decides what to show in this order: not accepted → the first page; "Outside of the UK" → "not eligible"; any other region → "eligible". | This gives each case in the intent its expected result, including typing `/result` directly. This updates requirement 36 of the region page's spec. |
| The "eligible" result uses the design system's green confirmation panel, with only the heading. | Required. The intent asks for the panel and "nothing else for now". |
| The "eligible" result has no "Back" link or link to change the answer. | The intent asks it to match the "not eligible" result. |
| Opening `/check-answers` with no region answer sends the user to the first page, without adding the page to the browser's history. | Required. It matches how `/result` already behaves. |
| Tests for the region and ownership pages that expect "Outside of the UK" to open `/result`, no "Continue" button on the ownership page, or `/result` to show "not eligible" without acceptance, are updated. | Those requirements have changed. |

## Open questions

1. **Changing the answer after accepting.** If someone accepts, sees a result, then goes back and saves a new region answer, should the earlier acceptance still count?

   **Answer:** A. Saving a new answer undoes the earlier "Accept and continue", so they have to accept again.

   *Settled.* See requirement 28.

2. **Typing `/check-answers` after answering "Outside of the UK".** What should someone who answered "Outside of the UK" see on the check answers page?

   **Answer:** The journey changed instead (see `route.md`). "Outside of the UK" now always goes to check answers, which shows that answer, before the result. Follow-up answers: the address stays `/check-answers`, and both results need "Accept and continue" first.

   *Settled.* See requirements 2, 8, 19, 24 and 27.
