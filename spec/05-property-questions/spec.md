# Spec: Green Home Grant – property questions (main residence, year built, EPC rating)

*Based on `intent/05-property-questions/intent.md` and `route.md`, plus the site owner's answers to three follow-up questions on 2026-10-13. It builds on the specs in `spec/01-start-page/` to `spec/04-ownership-page/`. Everything there still applies, except where this spec says otherwise. Requirements marked *Changed* or added after requirement 36 were updated on 2026-10-13 for the "Not known" result.*

## Requirements

### Reaching the new pages

1. On the ownership page, choosing "Own (with or without mortgage)" and clicking "Continue" opens the main residence page, and the address bar ends in `/main-residence`.
2. Choosing any "Rent" answer and clicking "Continue" still opens check answers.
3. "Outside of the UK" on the region page still opens check answers.

### The main residence page

4. The browser tab reads "Is this your main residence or a secondary home? – GOV.UK".
5. The page shows a "Back" link to `/ownership`, then the heading "Is this your main residence or a secondary home?", then two radio buttons, "First home" and "Secondary home", one under the other, then a green "Continue" button.
6. Choosing "First home" and clicking "Continue" opens the year built page, and the address bar ends in `/built-before-2000`.
7. Choosing "Secondary home" and clicking "Continue" opens check answers.

### The year built page

8. The browser tab reads "Was your property built before the year 2000? – GOV.UK".
9. The page shows a "Back" link to `/main-residence`, then the heading "Was your property built before the year 2000?", then two radio buttons, "Yes" and "No", side by side, then a green "Continue" button.
10. Choosing "Yes" and clicking "Continue" opens the EPC rating page, and the address bar ends in `/epc-rating`.
11. Choosing "No" and clicking "Continue" opens check answers.

### The EPC rating page

12. The browser tab reads "What is your home's EPC rating? – GOV.UK".
13. The page shows a "Back" link to `/built-before-2000`, then the heading "What is your home's EPC rating?", then radio buttons A, B, C, D, E, F and G, one under the other. Below G is the word "or", then a "Not known" radio button, then a green "Continue" button.
14. Choosing any answer and clicking "Continue" opens check answers.

### On every new page

15. The first time each page opens, no answer is selected, and only one answer can be selected at a time.
16. Clicking "Continue" with no answer selected keeps the user on the page, and shows:
    - a red-bordered box with "There is a problem" and a link with the page's message, which is focused straight away
    - the same message in red above the answers, with a red bar beside them
    - the tab title starting with "Error: "
17. The messages are:

    | Page | Message |
    |---|---|
    | Main residence | "Select if this is your main residence or a secondary home" |
    | Year built | "Select yes if your property was built before the year 2000" |
    | EPC rating | "Select your home's EPC rating, or select Not known" |

18. Clicking the link in the error box moves focus to the page's first answer: "First home", "Yes" or "A".
19. Each page's "Back" link opens the page before it, with that page's answer still selected.
20. Typing a new page's address straight into the address bar shows that page. It does not show an error.
21. Each page shows no other questions, form fields or buttons, apart from the cookie banner.

### Keeping the answers

22. An answer is kept only when "Continue" is pressed with it selected. Going back to the page, refreshing it, or returning to it later in the journey shows the answer last continued with.
23. Choosing an answer and leaving without pressing "Continue" does not keep it.
24. Closing the browser tab and opening the service again in a new tab shows each new page with no answer selected.
25. Saving any new answer undoes an earlier "Accept and continue". Typing `/result` after that opens the first page until "Accept and continue" is clicked again.

### Check answers

26. Check answers shows one row for each question on the user's current path, in journey order. Each row has the full question as its label, the answer, and a "Change" link. For example:

    | Answers given | Rows shown |
    |---|---|
    | Outside of the UK | region |
    | England, any "Rent" answer | region, ownership |
    | England, Own, Secondary home | region, ownership, main residence |
    | England, Own, First home, No | region, ownership, main residence, year built |
    | England, Own, First home, Yes, any EPC rating | region, ownership, main residence, year built, EPC rating |

27. Answers to questions no longer on the path are kept, but not shown. For example, someone who answered "First home", "Yes" and "B", then changed to "Secondary home", sees no year built or EPC rating rows.
28. A screen reader reads the new rows' links as:
    - "Change whether this is your main residence or a secondary home"
    - "Change whether your property was built before the year 2000"
    - "Change your home's EPC rating"
29. Each "Change" link opens that question's page with the answer selected. Clicking "Continue" there follows the normal journey from that page.
30. Typing `/check-answers` with a question on the user's path still unanswered opens the first page. For example, "England", "Own" and "First home", with no year built answer.

### The result

31. After "Accept and continue", the result shows only one reason: the reason for the first answer on the path that means not eligible. The heading is still "You are not eligible for a Green Home Grant".

    | First "not eligible" answer | Reason shown |
    |---|---|
    | Outside of the UK | "The Green Home Grant is only available to people who live in the UK." |
    | Any "Rent" answer | "The Green Home Grant is only available to people who own their home." |
    | Secondary home | "The Green Home Grant is only available for your main residence." |
    | No (built in 2000 or later) | "The Green Home Grant is only available for properties built before the year 2000." |
    | A, B or C | "The Green Home Grant is only available for properties with an EPC rating of D or below." |

32. With "Own (with or without mortgage)", "First home", "Yes", and D, E, F or G, "Accept and continue" shows the green panel "You are eligible for a Green Home Grant". *Changed: "Not known" now gives the result in requirements 37–41.*
33. Typing `/result` before "Accept and continue", or with a question on the path unanswered, opens the first page.

### Using a keyboard

34. On each new page, pressing Tab from the "Back" link moves to the answers. The arrow keys or Space select an answer, and Tab then moves to "Continue". Pressing Enter on "Continue" does the same as clicking it.

### Phone-sized screens

35. At a 320-pixel-wide window, each new page (including its error) and check answers with five rows can be read without scrolling sideways, and the "Continue" button stretches to the full width of the content.

### Walkthrough

36. Anyone can check the pages by following these steps. Start in a new private browsing window, so that no answer has been kept.
    1. Start the app (`npm run dev`) and open `https://lab11139.labs.decoded.com:5000/`. Click "Check your eligibility", choose "England", continue, choose "Own (with or without mortgage)" and continue. Check the address ends in `/main-residence`.
    2. Click "Continue" without choosing. Check the error box, the red message "Select if this is your main residence or a secondary home" and the "Error:" tab title. Click the error box's link and check "First home" is focused.
    3. Choose "First home" and continue. On `/built-before-2000`, check "Yes" and "No" sit side by side. Choose "Yes" and continue.
    4. On `/epc-rating`, check A to G, then "or", then "Not known". Type `/check-answers` after the address, and check you are sent to the first page. Go back to `/epc-rating`.
    5. Choose "D" and continue. Check check answers shows five rows, in journey order. Click "Accept and continue", and check the green "eligible" panel.
    6. Press Back. Click the EPC row's "Change", choose "B" and continue. Click "Accept and continue": check the EPC reason.
    7. Press Back. Click the year built row's "Change", choose "No" and continue. Check check answers shows four rows. Click "Accept and continue": check the year built reason.
    8. Press Back. Click the main residence row's "Change", choose "Secondary home" and continue. Check check answers shows three rows. Click "Accept and continue": check the main residence reason.
    9. Press Back. Click the main residence row's "Change", choose "First home" and continue. Check "No" is still selected on `/built-before-2000`. Click "Back" twice, and check `/ownership` shows "Own (with or without mortgage)" selected.
    10. Narrow the window to about 320 pixels. Check there is no sideways scrolling on the three new pages or on check answers.
    11. Close the tab, open the service in a new tab, and go to `/epc-rating`. Check no answer is selected.

### The "Not known" result

37. With "Own (with or without mortgage)", "First home", "Yes" and "Not known", "Accept and continue" shows the heading "You may be eligible", not in the green panel. The tab reads "You may be eligible – GOV.UK".
38. Under the heading is one paragraph, and nothing else: "We cannot assess your eligibility without an EPC rating. For more information on your property's EPC rating, see Find an energy certificate."
39. "Find an energy certificate" is a link to https://www.gov.uk/find-energy-certificate, opening in the same tab.
40. An earlier "not eligible" answer still gives its own reason instead. For example, "No" for the year built with an earlier "Not known" EPC answer gives the year built reason.
41. In Welsh, the heading is "Efallai eich bod yn gymwys" and the link reads "Dod o hyd i dystysgrif ynni" (draft Welsh, to be checked). The link goes to the same GOV.UK page.

## Decisions

| Decision | Reason |
|---|---|
| Keep building in React inside the existing starter, UI only, with the official GOV.UK Frontend styles and no backend. | Required. This carries over from the earlier specs. |
| The new pages are at `/main-residence`, `/built-before-2000` and `/epc-rating`. | Required (follow-up answer, 2026-10-13). |
| Each new page follows the question page pattern used by the region and ownership pages, reusing the same radios, error, back link and button components. | It keeps every question page the same, and the components already exist. |
| The questions read "built", "Yes" and "home's", correcting the instruction's "build", "yes" and "homes". | Required. The intent records these corrections. |
| "Yes" and "No" are shown side by side. | Design system guidance for two short answers. |
| "First home" and "Secondary home" are shown one under the other. | Design system guidance for longer answers. |
| The EPC page shows A to G, then an "or" divider, then "Not known". | Required (follow-up answer, 2026-10-13). It follows design system guidance. |
| Each answer is kept in the tab's session storage with the earlier answers, saved only on "Continue". Saving any answer undoes an earlier acceptance. | Required. The intent says each answer is kept in the same way as the earlier answers. |
| "Own (with or without mortgage)" now goes to `/main-residence`, and any "Rent" answer still goes to `/check-answers`. | Required. The intent says only owners see the new pages. This updates requirement 9 of the ownership spec. |
| An answer that means not eligible skips the remaining questions and goes straight to `/check-answers`. | Required. The intent's table sets out each page's next page. |
| Work out the user's path in one place: region → ownership (UK only) → main residence (Own only) → year built (First home only) → EPC rating (Yes only). Check answers and the results page both use it. | Both pages then agree on which questions count. |
| Check answers decides what to show in this order: no region → the first page; a question on the path unanswered → the first page; otherwise show one row per question on the path. | Required (follow-up answer, 2026-10-13). It extends how a missing ownership answer is handled. |
| Answers to questions no longer on the path are kept, but not shown or used. | Required. The intent treats them like the ownership answer after "Outside of the UK". |
| The results page decides in this order: not accepted → the first page; then each question on the path in order, where an unanswered question → the first page, and a "not eligible" answer → its reason; if every answer passes but the EPC rating is "Not known" → "You may be eligible"; otherwise → eligible. | This gives the first "not eligible" answer's reason, one at a time, as the intent asks. *Changed 2026-10-13 for the "Not known" result.* |
| The "Not known" result uses a plain heading and one paragraph, with "Find an energy certificate" as the link text. | Required (site owner's choices, 2026-10-13). It isn't a confirmed result, and GOV.UK style avoids "here" as link text. |
| The "Change" links' hidden screen reader text is "whether this is your main residence or a secondary home", "whether your property was built before the year 2000" and "your home's EPC rating". | Design system guidance. It matches the wording style chosen for the ownership row. |
| Tests that expect "Own (with or without mortgage)" to go to check answers, or to be eligible on its own, are updated to go through the new pages. | These requirements have changed: ownership spec requirements 9 and 22, and the check answers tests that reach the "eligible" result. |
| Add the new pages to `route.md`. | It records the journey the site owner shared. |

## Open questions

None. The three follow-up questions (the addresses, an unanswered question on `/check-answers`, and the EPC layout) were answered before this spec was written.
