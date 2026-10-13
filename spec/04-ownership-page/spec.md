# Spec: Green Home Grant – ownership page

*Based on `intent/04-ownership-page/intent.md` and `route.md`, plus the site owner's answer to a follow-up question on 2026-10-13. It builds on the specs in `spec/01-start-page/`, `spec/02-region-page/` and `spec/03-check-answers/`. Everything there still applies, except where this spec says otherwise.*

## Requirements

### The ownership page

1. The ownership page looks as it does now: the GOV.UK header, phase banner and footer, the tab title "Do you own or rent your property? – GOV.UK", a "Back" link to `/region`, the heading "Do you own or rent your property?", and these four answers, in this order:
   1. Own (with or without mortgage)
   2. Rent from a private landlord
   3. Rent from a housing association
   4. Rent from the council
2. The first time the page opens, no answer is selected.

### No answer chosen

3. Clicking "Continue" with no answer selected keeps the user on the ownership page. The address bar still ends in `/ownership`.
4. Below the "Back" link and above the heading, a red-bordered box appears with the heading "There is a problem" and a link reading "Select if you own or rent your property". The box is focused straight away.
5. Clicking "Select if you own or rent your property" in that box moves focus to the first answer, "Own (with or without mortgage)".
6. Directly above the answers, the message "Select if you own or rent your property" appears in red, and a red bar shows down the left of the question.
7. While the error is shown, the browser tab reads "Error: Do you own or rent your property? – GOV.UK".
8. Selecting an answer and clicking "Continue" clears the error and moves on.

### Continuing

9. Selecting any of the four answers and clicking "Continue" opens the check answers page, and the address bar ends in `/check-answers`.

### Keeping the answer

10. After continuing, pressing the browser's Back button on check answers returns to the ownership page with the answer still selected.
11. Refreshing the ownership page after an answer has been chosen and continued keeps that answer selected.
12. After continuing, going back to the region page with the ownership page's "Back" link, then clicking "Continue" there with a UK region, opens the ownership page with the answer still selected.
13. Choosing an answer and leaving without pressing "Continue" does not keep it. Returning shows the answer last continued with, or none.
14. Closing the browser tab and opening the service again in a new tab shows the ownership page with no answer selected.
15. Saving an ownership answer undoes an earlier "Accept and continue". Typing `/result` after that opens the first page until "Accept and continue" is clicked again.

### Check answers

16. When the region is England, Scotland, Wales or Northern Ireland, check answers shows two rows. The first is the region row, as before. The second shows the label "Do you own or rent your property?", the ownership answer last continued with, and a "Change" link.
17. A screen reader reads the second row's link as "Change whether you own or rent your property", so it's clear what it changes.
18. When the region is "Outside of the UK", check answers shows only the region row, even if an ownership answer was given earlier.
19. Clicking the ownership row's "Change" link opens the ownership page with the current answer selected. Choosing an answer and clicking "Continue" returns to check answers, which shows the new answer.
20. Typing `https://lab11139.labs.decoded.com:5000/check-answers` with a UK region but no ownership answer opens the first page, and the address bar ends in `/`.
21. Typing `/check-answers` with no region answer still opens the first page.

### The result

22. With a UK region and "Own (with or without mortgage)", "Accept and continue" shows the green panel "You are eligible for a Green Home Grant", as before.
23. With a UK region and "Rent from a private landlord", "Rent from a housing association" or "Rent from the council", "Accept and continue" shows the heading "You are not eligible for a Green Home Grant" and the text "The Green Home Grant is only available to people who own their home." The tab reads "You are not eligible for a Green Home Grant – GOV.UK".
24. With "Outside of the UK", "Accept and continue" shows the heading "You are not eligible for a Green Home Grant" and the text "The Green Home Grant is only available to people who live in the UK.", whatever the ownership answer.
25. The "not eligible" result shows only one reason, and no other text, links or buttons.
26. Typing `/result` before "Accept and continue" still opens the first page, whatever the answers.

### Changing the region after answering ownership

27. After answering "England" and "Rent from the council", using "Change" to switch the region to "Outside of the UK" opens check answers with only the region row. "Accept and continue" then shows the UK reason only.
28. Using "Change" again to switch the region back to "England" opens the ownership page with "Rent from the council" still selected.

### Using a keyboard

29. On the ownership page, pressing Tab from the "Back" link moves to the answers. The arrow keys or Space select an answer. Tab then moves to "Continue", and pressing Enter on it does the same as clicking it.

### Phone-sized screens

30. At a 320-pixel-wide window, the ownership page (including its error), check answers with two rows, and the renters' "not eligible" result can be read without scrolling sideways, and the "Continue" button stretches to the full width of the content.

### Walkthrough

31. Anyone can check the pages by following these steps. Start in a new private browsing window, so that no answer has been kept.
    1. Start the app (`npm run dev`) and open `https://lab11139.labs.decoded.com:5000/`. Click "Check your eligibility", choose "England" and click "Continue".
    2. On the ownership page, click "Continue" without choosing. Check the error box, the red message above the answers and the "Error:" tab title (requirements 4–7). Click the link in the error box and check "Own (with or without mortgage)" is focused.
    3. Type `/check-answers` after the address. Check you are sent to the first page (requirement 20). Click "Check your eligibility", check "England" is still selected, and click "Continue".
    4. Choose "Rent from the council" and click "Continue". Check check answers shows two rows: "In what region do you live?" with "England", and "Do you own or rent your property?" with "Rent from the council", each with "Change".
    5. Press the browser's Back button. Check "Rent from the council" is selected. Refresh, and check it's still selected. Click "Continue".
    6. Click "Accept and continue". Check the heading "You are not eligible for a Green Home Grant" and the text "The Green Home Grant is only available to people who own their home.", and nothing else.
    7. Press Back. Click the ownership row's "Change", choose "Own (with or without mortgage)" and click "Continue". Check check answers shows the new answer. Type `/result` after the address and check you are sent to the first page (requirement 15).
    8. Go to `/check-answers` and click "Accept and continue". Check the green panel "You are eligible for a Green Home Grant".
    9. Press Back. Click the region row's "Change", choose "Outside of the UK" and click "Continue". Check check answers shows only the region row. Click "Accept and continue" and check only the UK reason is shown.
    10. Press Back. Click "Change", choose "England" and click "Continue". Check the ownership page shows "Own (with or without mortgage)" selected.
    11. Narrow the window to about 320 pixels. Check there is no sideways scrolling on the ownership page with its error, on check answers with two rows, or on the renters' result.
    12. Close the tab, open the service in a new tab, and go to `/ownership`. Check no answer is selected.

## Decisions

| Decision | Reason |
|---|---|
| Keep building in React inside the existing starter, UI only, with the official GOV.UK Frontend styles and no backend. | Required. This carries over from the earlier specs. |
| Keep the ownership question, its four answers and its "Back" link to `/region` unchanged. | Required. The intent rules out changing them. |
| Show the error using the design system's error summary and error message, as the region page does, with the text "Select if you own or rent your property". | Required wording. It reuses the region page's error components. |
| Keep the ownership answer in the tab's session storage with the region answer, saved only when "Continue" is pressed with an answer selected. | Required. The intent says it is kept the same way as the region answer. |
| Saving the ownership answer clears the "accepted" note, as saving the region answer does. | Required. The intent says saving it undoes an earlier "Accept and continue". |
| Keep a saved ownership answer when the region changes to "Outside of the UK", but don't show it or use it. | Required (open question 1). The intent says it "no longer counts", and keeping it means switching back to a UK region still shows it. |
| "Continue" on the ownership page always goes to `/check-answers`, including after "Change". | Required. `route.md` and the intent send every answer to check answers. |
| Check answers decides what to show in this order: no region → the first page; UK region with no ownership answer → the first page; otherwise show the rows. The redirect doesn't add check answers to the browser's history. | Required (follow-up answer, 2026-10-13, changed from the ownership page to the first page). It matches how check answers already treats a missing region answer. |
| The ownership row comes after the region row, and only for a UK region. | This is the order the questions are asked in. Required by the intent. |
| The ownership row's "Change" link includes hidden text, " whether you own or rent your property", for screen readers. | Design system guidance. Required (open question 2): it reads more naturally. |
| The results page decides what to show in this order: not accepted → the first page; "Outside of the UK" → the UK reason; no ownership answer → the first page; any "Rent" answer → the home ownership reason; otherwise → eligible. | This gives each row of the intent's result table its expected result, with one reason at a time. |
| The two "not eligible" results share one heading and tab title, and differ only in the reason. | Required. The intent gives the same heading for both. |
| Tests that expect the ownership answer not to be kept, "Continue" to work with nothing selected, one row on check answers for a UK region, or "eligible" for every UK region, are updated. | These requirements have changed: region spec requirements 26 and 27, and check answers spec requirements 4, 5, 8, 12 and 21. |

## Open questions

1. **Ownership answer after switching to "Outside of the UK" and back.** Someone who answered "Rent from the council", switched to "Outside of the UK", then switched back to "England" will see "Rent from the council" still selected on the ownership page. Is that right, or should switching to "Outside of the UK" forget the ownership answer, so the page starts with nothing selected?

   **Answer:** A. "Rent from the council" still selected; the earlier answer is kept.

   *Settled.* See requirement 28.

2. **What the ownership row's "Change" link says to screen readers.** The spec follows the region row and reads it as "Change do you own or rent your property?". A more natural wording would be "Change whether you own or rent your property". Which do you want?

   **Answer:** B. "Change whether you own or rent your property".

   *Settled.* See requirement 17.
