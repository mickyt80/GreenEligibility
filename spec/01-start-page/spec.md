# Spec: Green Home Grant – first page

*Based on `intent/01-start-page/intent.md`, and the answers to the open questions below.*

## Requirements

### Starting the app

1. Running `npm run dev` in the `GreenEligibility` folder starts the app on port 5000.
2. The first page opens at `https://lab11139.labs.decoded.com:5000/`.

### On every page

3. Every page uses the GOV.UK Design System's fonts, colours and spacing.
4. Every page has the GOV.UK header at the top. Clicking the GOV.UK logo opens the first page.
5. Directly below the header, every page shows a phase banner with an "Alpha" tag and the text "This is a new service – your feedback will help us improve it." The word "feedback" is a link.
6. Clicking the "feedback" link leaves the user on the same page, and nothing else on the page changes.
7. Every page has the GOV.UK footer at the bottom, showing the Open Government Licence statement, "© Crown copyright", and one link, "Accessibility statement". It has no other links.
8. Pressing Tab from the top of any page reveals a "Skip to main content" link. If the cookie banner is showing, the link comes after the banner's buttons. Pressing Enter on it moves to the page's main content.

### Cookie banner

9. On a first visit, when no cookie choice has been made yet, the cookie banner is shown at the very top of every page, above the header. The only exception is the cookies page.
10. The banner's heading reads "Cookies on Check if you are eligible for a Green Home Grant".
11. The banner's text reads "We use some essential cookies to make this service work." followed by "We’d also like to use analytics cookies so we can understand how you use the service and make improvements."
12. The banner has two buttons, "Accept analytics cookies" and "Reject analytics cookies", and a link, "View cookies".
13. Clicking "Accept analytics cookies" replaces the banner's content with "You’ve accepted analytics cookies. You can change your cookie settings at any time." and a "Hide cookie message" button.
14. Clicking "Reject analytics cookies" replaces the banner's content with "You’ve rejected analytics cookies. You can change your cookie settings at any time." and a "Hide cookie message" button.
15. In either message, the "change your cookie settings" link opens the cookies page at `/cookies`.
16. Clicking "Hide cookie message" removes the banner from the page.
17. Once someone has accepted or rejected, the banner is not shown again in that browser for one year. This applies on refresh, on other pages and on later visits, even if they never clicked "Hide cookie message".
18. Clearing the site's cookies in the browser makes the banner appear again.
19. Clicking "View cookies" opens the cookies page at `/cookies`.
20. Whichever choice is made, no analytics run. The browser's developer tools show no requests to any analytics service.

### The first page

21. The browser tab reads "Check if you are eligible for a Green Home Grant – GOV.UK".
22. The page heading reads "Check if you are eligible for a Green Home Grant".
23. Under the heading, the page shows the text "The Green Home Grant is a government scheme that funds home insulation and heat pumps."
24. Under that text, the page shows a green GOV.UK start button with a right-pointing arrow, reading exactly "Check your eligibility".
25. The page follows the design system's "Start using a service" pattern: heading, then description, then start button.
26. The page does not say how much the grant is worth.
27. The page does not say who can apply.
28. The page does not say how long the check takes, or what information people need to hand.
29. Apart from the cookie banner, the page shows no questions, form fields or buttons other than "Check your eligibility".

### Continuing to the next page

30. Clicking "Check your eligibility" opens the next page, and the address bar ends in `/region`.
31. Pressing Tab until "Check your eligibility" has the yellow GOV.UK focus highlight, then pressing Enter, also opens the next page.
32. The next page shows the GOV.UK header, phase banner and footer, plus the cookie banner if no choice has been made yet. Between the phase banner and the footer there is nothing: no heading, text, questions or buttons.
33. The next page's browser tab reads "Check if you are eligible for a Green Home Grant – GOV.UK".
34. Pressing the browser's Back button on the next page returns to the first page, as it was.
35. Typing `https://lab11139.labs.decoded.com:5000/region` straight into the address bar, or refreshing the next page, shows the same empty next page. It does not show an error.

### The cookies page

36. The cookies page, at `/cookies`, shows the GOV.UK header, phase banner and footer, with nothing between the phase banner and the footer. It never shows the cookie banner.
37. The cookies page's browser tab reads "Check if you are eligible for a Green Home Grant – GOV.UK".
38. Typing `https://lab11139.labs.decoded.com:5000/cookies` straight into the address bar, or refreshing the cookies page, shows the same empty page. It does not show an error.

### The accessibility statement page

39. Clicking "Accessibility statement" in the footer of any page opens the accessibility statement page, and the address bar ends in `/accessibility-statement`.
40. The accessibility statement page shows the starter's existing headings, starting with "Accessibility statement". Its browser tab reads "Accessibility statement – GOV.UK".

### Phone-sized screens

41. At a 320-pixel-wide window, everything on the first page, including the cookie banner, can be read without scrolling sideways, and the "Check your eligibility" button stretches to the full width of the content.

### Walkthrough

42. Anyone can check the pages by following these steps. Start in a private browsing window, or after clearing the site's cookies, so that no cookie choice has been made.
    1. Start the app (requirement 1) and open `https://lab11139.labs.decoded.com:5000/`.
    2. Check the cookie banner is at the top, with the heading, text, buttons and link in requirements 10–12.
    3. Check the header, phase banner and footer (requirements 4, 5 and 7). Click "feedback" and confirm you stay on the first page. Click "Accessibility statement" in the footer, confirm the accessibility statement page opens at `/accessibility-statement`, then press Back.
    4. Check the tab title, heading, description and button text match requirements 21–24 word for word, and that nothing else is shown (requirements 26–29).
    5. Click "View cookies". Confirm the address ends in `/cookies`, the page is empty, and there is no cookie banner. Press Back.
    6. Click "Accept analytics cookies". Confirm the accepted message and the "Hide cookie message" button appear. Without hiding the banner, refresh the page. Confirm the banner has gone.
    7. Clear the site's cookies and refresh. Confirm the banner is back. Click "Reject analytics cookies", confirm the rejected message, then click "Hide cookie message". Confirm the banner disappears.
    8. Click "Check your eligibility". Confirm the address ends in `/region`, the page is empty between the phase banner and footer, and there is no cookie banner.
    9. Press Back. Confirm you are on the first page again.
    10. Press Tab until "Check your eligibility" is highlighted, then press Enter. Confirm the empty `/region` page opens.
    11. Refresh. Confirm the empty page is still shown.
    12. Go back to the first page and narrow the window to about 320 pixels. Confirm there is no sideways scrolling and the button is full width.

## Decisions

| Decision | Reason |
|---|---|
| Build the UI in React, inside the existing `GreenEligibility` starter. | Required. The starter is already set up for React. |
| UI only: no backend, and nothing is sent anywhere. | Required. |
| Use the GOV.UK Design System (design-system.service.gov.uk) for all styling and components. | Required. |
| Load the styles from the official GOV.UK Frontend package, in place of the starter's hand-written GOV.UK styles in `App.css`. | Required (open question 4). |
| Use only GOV.UK Frontend's styles, not its JavaScript. React handles the cookie banner and other behaviour. | This avoids two things fighting over the same page parts. Nothing on these pages needs the package's scripts. |
| Write small React components that reproduce the design system's published markup for the header, phase banner, footer, cookie banner, skip link and start button, reusing the starter's components where they exist. | The design system doesn't publish React components. Its markup is the source of truth. |
| The page frame is, in order: cookie banner, skip link, header, phase banner, main content, footer. | This is the order the design system's page template and cookie banner guidance give. |
| The header shows the GOV.UK logo only, linking to the first page. | The answers didn't ask for a service name in the header, and the first page is this service's home. |
| The phase banner shows "Alpha", and its "feedback" link goes nowhere. | Required (open question 2). |
| The footer shows the design system's standard licence and copyright, and one link, "Accessibility statement", to the starter's existing `/accessibility-statement` page. | Required (open question 5). |
| The accessibility statement page is left as the starter has it. Writing its content is out of scope for this page. | The intent doesn't cover it, and the starter already has the page. |
| The cookie banner uses the design system's wording for a service with analytics cookies, naming the service by its heading. | Required (open question 2). It keeps to the design system's tested wording. |
| The cookie choice is remembered in a browser cookie that lasts one year. | Required (open question 2). One year is GOV.UK's guidance for a cookie-consent cookie. |
| No analytics run, whatever the choice. | There is no backend or analytics service to send anything to. |
| The cookie banner is not shown on the cookies page. | This is design system guidance: people should not be asked to choose on the page where they choose. |
| Lay out the first page using the design system's "Start using a service" pattern, with the start button reading "Check your eligibility" instead of "Start now". | It is the design system's pattern for a first page, and the button text is required by the intent. |
| The heading is "Check if you are eligible for a Green Home Grant". | Required (open question 1). |
| The description is the intent's sentence word for word. | The intent asks for the user's own words. |
| Each page's tab title is its heading followed by "– GOV.UK". Pages with no heading yet (`/region` and `/cookies`) use the first page's heading. | Required (follow-up to open question 1). It is also the design system convention. |
| Move between pages in the browser, using the starter's existing page-routing library. | Nothing extra to install, and no backend is needed. |
| The next page is at `/region` and is empty. The cookies page is at `/cookies` and is empty. | Required (open questions 2 and 3). |
| The starter's other pages (property type, income and so on) are left as they are, and the first page doesn't link to them. | They are outside this page's intent. |
| Port 5000 on the lab host, as already set in the starter. | It keeps the lab's existing reverse-proxy setup working. |

## Open questions

1. **Page heading.** The intent doesn't say what the heading should read. Is "Check if you can get a Green Home Grant" right, or do you want something else, such as "Apply for a Green Home Grant"?

   **Answer:** "Check if you are eligible for a Green Home Grant" should be the page heading.
   **Follow-up answer:** Yes, update each page title with the page header.

   *Settled:* the heading and tab title both use "Check if you are eligible for a Green Home Grant". See requirements 21, 22, 33 and 37.

2. **Header, footer and phase banner.** The intent says "we don't want anything not mentioned so far". Does that include the standard GOV.UK header and footer? And do you want the "alpha" phase banner ("This is a new service – your feedback will help us improve it") that the starter has ready?

   **Answer:** Use the GOV.UK header, footer, the cookie banner and the phase banner.
   **Follow-up answer (cookie banner):** A. Accept and Reject buttons, a confirmation message with "Hide cookie message", and the choice remembered in the browser. "View cookies" goes to an empty `/cookies` page.
   **Follow-up answer (phase banner):** Alpha, with the feedback link going nowhere.

   *Settled.* See requirements 4–20 and 36–38.

3. **Next page address and journey.** The starter's next route is `/property-type`, followed by ownership, income, insulation and heating. Your `Questions.md` starts with region, then ownership, main residence, built before 2000 and EPC rating. Which journey are we building, and should the empty next page be at `/region`?

   **Answer:** The next page is /region.

   *Settled.* See requirements 30–35.

4. **Official GOV.UK Frontend package or the starter's own styles.** Should the pages use the official GOV.UK Frontend styles (one added package), or keep the starter's hand-written copy in `App.css` (nothing added, but it may not match the design system exactly)?

   **Answer:** We will use the official GOV.UK Frontend styles.

   *Settled.* See requirement 3.

5. **Footer links.** The starter's footer has an "Accessibility statement" link to a page it already has. GOV.UK services usually list "Cookies" and "Accessibility statement" in the footer. Should the footer have these links, and should "Cookies" go to the empty `/cookies` page?

   **Answer:** Only accessibility statement link.

   *Settled:* the footer has one link, "Accessibility statement", and no "Cookies" link. See requirements 7, 39 and 40.
