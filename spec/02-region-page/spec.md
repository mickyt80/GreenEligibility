# Spec: Green Home Grant – region page

*Based on `intent/02-region-page/intent.md` and Question 1 in `Questions.md`. It builds on `spec/01-start-page/spec.md`. Requirements marked *Changed* were updated on 2026-10-13 to follow `route.md` and `spec/03-check-answers/spec.md`, which now always shows check answers before the result. Requirement numbers are kept so earlier references stay correct. Everything there about starting the app, the page frame (header, phase banner, footer, cookie banner, skip link) and the cookies and accessibility statement pages still applies, and is not repeated here.*

## Requirements

### Reaching the region page

1. Clicking "Check your eligibility" on the first page opens the region page, and the address bar ends in `/region`.
2. Typing `https://lab11139.labs.decoded.com:5000/region` straight into the address bar shows the region page, with no answer selected. It does not show an error.

### The region page

3. The region page shows the GOV.UK header, phase banner and footer, plus the cookie banner if no cookie choice has been made yet, as on the first page.
4. The browser tab reads "In what region do you live? – GOV.UK".
5. Above the question, the page shows a "Back" link.
6. The page heading is the question, reading exactly "In what region do you live?".
7. Under the heading, the page shows five radio buttons, in this order, labelled exactly:
   1. England
   2. Scotland
   3. Wales
   4. Northern Ireland
   5. Outside of the UK
8. When the page first opens, no radio button is selected.
9. Only one answer can be selected at a time. Selecting a second answer clears the first.
10. Clicking an answer's label text selects that answer, as clicking the radio button does.
11. Under the radio buttons, the page shows a green GOV.UK button reading exactly "Continue".
12. The page shows no other questions, form fields or buttons, apart from the cookie banner.

### No answer chosen

13. Clicking "Continue" with no answer selected keeps the user on the region page. The address bar still ends in `/region`.
14. Below the "Back" link and above the heading, a red-bordered box appears with the heading "There is a problem" and a link reading "Select the region where you live".
15. The box is focused straight away, so screen reader users hear it and a keyboard user's next Tab press goes to its link.
16. Clicking "Select the region where you live" in that box moves focus to the first radio button, "England".
17. Directly above the radio buttons, the message "Select the region where you live" appears in red, and a red bar shows down the left of the question.
18. While the error is shown, the browser tab reads "Error: In what region do you live? – GOV.UK".
19. Selecting an answer and clicking "Continue" clears the error and moves on, following requirement 20 or 29.

### Answering England, Scotland, Wales or Northern Ireland

20. Selecting England, Scotland, Wales or Northern Ireland and clicking "Continue" opens the ownership page, and the address bar ends in `/ownership`.

### The ownership page

21. The ownership page shows the GOV.UK header, phase banner and footer, plus the cookie banner if no cookie choice has been made yet.
22. The browser tab reads "Do you own or rent your property? – GOV.UK".
23. Above the question, the page shows a "Back" link. Clicking it opens the region page at `/region`, with the answer already chosen still selected.
24. The page heading reads exactly "Do you own or rent your property?".
25. Under the heading, the page shows four radio buttons, in this order, labelled exactly:
    1. Own (with or without mortgage)
    2. Rent from a private landlord
    3. Rent from a housing association
    4. Rent from the council
26. The ownership page has a green "Continue" button, which opens the check answers page at `/check-answers`. It has no other questions, form fields or buttons apart from the cookie banner. *Changed by `spec/03-check-answers/spec.md`.*
27. Selecting an answer on the ownership page leaves the user on that page until "Continue" is clicked. The answer is not kept: refreshing the page shows no answer selected. *Changed by `spec/03-check-answers/spec.md`.*
28. Typing `https://lab11139.labs.decoded.com:5000/ownership` straight into the address bar shows the ownership page. It does not show an error.

### Answering "Outside of the UK"

29. Selecting "Outside of the UK" and clicking "Continue" opens the check answers page, and the address bar ends in `/check-answers`. Clicking "Accept and continue" there opens the results page at `/result`. *Changed by `spec/03-check-answers/spec.md`.*
30. The results page's heading reads "You are not eligible for a Green Home Grant".
31. Under the heading, the results page shows the text "The Green Home Grant is only available to people who live in the UK."
32. The results page's browser tab reads "You are not eligible for a Green Home Grant – GOV.UK".
33. The results page has no "Back" link, no "Continue" button, and no link to change the answer.
34. The results page shows nothing about being eligible, and no other result.
35. Pressing the browser's Back button on the results page returns to the check answers page. *Changed by `spec/03-check-answers/spec.md`.*
36. Typing `https://lab11139.labs.decoded.com:5000/result` straight into the address bar opens the first page, and the address bar ends in `/`, unless "Accept and continue" has been clicked on the check answers page since the region answer was last saved. This includes when no answer has been chosen, and when "Outside of the UK" was chosen. *Changed by `spec/03-check-answers/spec.md`.*

### Going back and returning

37. Clicking the "Back" link on the region page opens the first page at `/`.
38. Pressing the browser's Back button on the region page also returns to the first page.
39. After choosing an answer and continuing to the next page, going back to the region page (with the browser's Back button) shows the answer already chosen as selected.
40. After choosing an answer, going back to the first page and clicking "Check your eligibility" again shows the answer already chosen as selected.
41. Refreshing the region page after an answer has been chosen and continued keeps that answer selected.
42. Closing the browser tab and opening the service again in a new tab shows the region page with no answer selected.
43. Choosing an answer and clicking "Back" without pressing "Continue" does not keep that answer. Returning to the region page shows the answer last continued with, or none.

### Using a keyboard

44. Pressing Tab from the "Back" link moves to the radio buttons. The arrow keys then move between and select the answers, each showing the yellow GOV.UK focus highlight.
45. Pressing Tab from the radio buttons moves to "Continue", and pressing Enter on it does the same as clicking it.

### Phone-sized screens

46. At a 320-pixel-wide window, everything on the region page, the ownership page and the results page can be read without scrolling sideways. The region page's "Continue" button stretches to the full width of the content.

### Walkthrough

47. Anyone can check the pages by following these steps. Start in a new private browsing window, so that no answer has been kept.
    *Changed:* steps 4, 8, 9 and 10 now go through the check answers page. See the walkthrough in `spec/03-check-answers/spec.md` (requirement 31).
    1. Start the app (`npm run dev`) and open `https://lab11139.labs.decoded.com:5000/`. Type `/result` after the address and check you are sent back to the first page. Click "Check your eligibility".
    2. Check the address ends in `/region`, and that the tab title, "Back" link, heading, five answers and "Continue" button match requirements 4–11 word for word, with nothing selected.
    3. Click "Continue" without choosing. Check the error box, the red message above the answers and the "Error:" tab title (requirements 14–18). Click the link in the error box and check focus moves to "England".
    4. Select "Scotland" and click "Continue". Check the address ends in `/ownership`, and the tab title, "Back" link, heading and four answers match requirements 22–25 word for word, and that there is a "Continue" button. Select an answer, refresh, and check nothing is selected.
    5. Click the ownership page's "Back" link. Check the region page opens with "Scotland" still selected. Refresh, and check it is still selected.
    6. Click "Back". Check the first page opens. Click "Check your eligibility" and check "Scotland" is still selected.
    7. Repeat step 4 with "England", "Wales" and "Northern Ireland", going back each time. Each should reach the ownership page.
    8. With "Northern Ireland" the last answer continued with, type `/result` after the address. Check you are sent to the first page.
    9. Go to `/region`, select "Outside of the UK" and click "Continue". Check the address ends in `/check-answers`. Click "Accept and continue". Check the address ends in `/result`, and that the heading, text and tab title match requirements 30–32. Check there is no "Back" link, "Continue" button or link to change the answer.
    10. Refresh the results page and check it still shows the "not eligible" message. Press the browser's Back button and check the check answers page shows "Outside of the UK".
    11. Narrow the window to about 320 pixels. Check there is no sideways scrolling on the region page (with a full-width "Continue" button), the ownership page or the results page.
    12. Close the tab, open the service in a new tab, and go to `/region`. Check no answer is selected.

## Decisions

| Decision | Reason |
|---|---|
| Keep building in React inside the existing starter, UI only, with the official GOV.UK Frontend styles and no backend. | Required. This carries over from the first page's spec. |
| Lay out the region page with the design system's "Question pages" pattern: Back link, then a radios question whose heading is the question, then a "Continue" button. | It is the design system's pattern for asking one question per page. |
| The question's heading is the radios' legend, styled as a large page heading. | The design system does this when a page asks a single question, so screen readers read the question with the answers. |
| Use the question and answers from `Questions.md` word for word, in its order. | Required. The intent says "use exactly that question and those five answers". |
| The five answers are plain radios, with no "or" divider before "Outside of the UK". | The intent asks for the list exactly as written. |
| Show the error using the design system's error summary and error message, with the text "Select the region where you live" in both. | Required wording, set out in the design system's pattern for a missing radio answer. |
| Add "Error: " to the start of the tab title while an error is shown. | This is design system guidance, so screen reader users know the page has an error. |
| The "Back" link on the region page goes to the first page at `/`. | Required. The intent says the page has a "Back" link to the start page. |
| Each page's tab title is its heading followed by "– GOV.UK". This replaces the service-name title the region page had as an empty page. | Each page's title is its page heading, as settled for the first page. This updates requirement 33 of the first page's spec. |
| The region page's empty-page check in the first page's spec (requirement 32) and its tests no longer apply. | The region page now has content. |
| The next page is the starter's ownership page at `/ownership`, asking "Do you own or rent your property?" with its four answers, in place of "Do you own your home?" with Yes or No from `Questions.md`. | Required (open question 1). This changes what the intent said about the next page. |
| The ownership page shows its question, answers, "Back" link and a "Continue" button to `/check-answers`. Nothing is kept from it. | Required (open question 1a, then changed by `spec/03-check-answers/spec.md`). Saving and checking its answer is a later piece of work. |
| The ownership page's "Back" link goes to `/region`, not `/property-type` as the starter has it. | The region page is now the page before it. |
| The results page is the starter's page at `/result`. | It reuses the starter's address and page for results. |
| The results page heading is "You are not eligible for a Green Home Grant", followed by the reason as body text. | Required (open question 2). The reason is the intent's wording. |
| The results page doesn't use the design system's coloured panel. | The design system keeps panels for confirming that something is complete, not for refusals. |
| The results page has no Back link or link to change the answer. | Required. The intent says it is "the end of the journey". |
| The browser's own Back button works as normal on the results page. | Required (open question 3). |
| The chosen answer is kept in the browser tab's session storage, under one key for the journey's answers. | Required (open question 4): it survives going back and refreshing, and is forgotten when the tab is closed. |
| An answer is kept only when "Continue" is pressed with an answer selected. | This is how GOV.UK question pages behave: leaving without continuing doesn't save. |
| The results page decides what to show from the kept answer, so a refresh still shows the "not eligible" message. | The kept answer is the only record of the result, and it survives a refresh. |
| Opening `/result` before "Accept and continue" has been clicked on the check answers page sends the user to the first page, whatever the answer. | Required (open question 5, then changed by `spec/03-check-answers/spec.md`). |
| "Outside of the UK" goes to the check answers page, not straight to the results page. | Required. Changed by `route.md` and `spec/03-check-answers/spec.md`: check answers is always shown before the result. |
| The starter's other pages (property type, income, insulation, heating) are left as they are, and nothing links to them. | They are outside this page's intent. |

## Open questions

1. **Address and content of the next question's page.** The starter already has a page at `/ownership` asking "Do you own or rent your property?" with four rental options. Your `Questions.md` asks "Do you own your home?" with Yes or No. Should the next page be at `/ownership`, emptied for now as the spec assumes, or at a new address and leaving the starter's page alone?

   **Answer:** Use the current /ownership page's question, with its four rental options as answers.
   **Follow-up answer (1a):** A. For now it just shows the heading, the four answers and its Back link to the region page, with nothing happening yet.

   *Settled.* See requirements 20–28.

2. **Results page heading.** Is "You are not eligible for a Green Home Grant" right, or do you want something else, such as "You cannot get a Green Home Grant"?

   **Answer:** A. "You are not eligible for a Green Home Grant".

   *Settled.* See requirements 30 and 32.

3. **Browser Back button on the results page.** The browser's own Back button will still return to the region page with "Outside of the UK" selected, where the user could change it. Is that acceptable, or should Back from the results page skip the region page?

   **Answer:** A. Leave the browser's Back button working as normal.

   *Settled.* See requirement 35.

4. **How long the answer is kept.** Should the answer survive a refresh and be forgotten when the tab is closed, or be kept across visits too?

   **Answer:** A. Kept through going back and refreshing, and forgotten when the tab is closed.

   *Settled.* See requirements 39–43.

5. **Opening the results page directly.** What should someone see if they type `/result` into the address bar without having answered "Outside of the UK"?

   **Answer:** A. They are sent to the first page.

   *Settled.* See requirement 36.
