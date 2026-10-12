# Intent: Green Home Grant – first page

*Based on an interview with the site owner, 2026-10-12, and their answers to the open questions in `spec/01-start-page/spec.md`. Later pages of the journey will be written one at a time, each in its own subfolder.*

## Problem

The Green Home Grant is "a government scheme that funds home insulation and heat pumps". People need a first page that describes the grant scheme and then allows them to continue to the next page of the journey.

## Who is it for

"UK citizens checking whether they can get the grant." They need to read what the scheme funds, then continue to check their eligibility.

## What success looks like

The page describes the grant scheme: it is "a government scheme that funds home insulation and heat pumps".

### The page

- The page heading is "Check if you are eligible for a Green Home Grant".
- Below the heading, the page says what the scheme funds, and nothing else.
- The page has a continue button that reads exactly **"Check your eligibility"**.
- Pressing "Check your eligibility" takes the user to the next page of the journey, at `/region`. For now, the next page is an empty page.
- Each page's title is its page heading.

### Around the page

The site will "use the GOV.UK header, footer, the cookie banner and the phase banner".

- **Cookie banner:** it has buttons to accept or reject analytics cookies, then shows a confirmation message with "Hide cookie message". The choice is remembered in the browser. "View cookies" goes to an empty `/cookies` page.
- **Phase banner:** it reads "alpha", "with the feedback link going nowhere".
- **Footer:** it has "only [the] accessibility statement link".

### Styling

"We will use the official GOV.UK Frontend styles."

### Main measure of success

Someone can read what the scheme funds and press "Check your eligibility" to reach the next page.

## Out of scope

- "We don't want anything not mentioned so far." This rules out:
  - how much the grant is worth
  - who can apply
  - how long the check takes, or what information people need to hand
- Any footer link other than the accessibility statement, including a "Cookies" link.
- Running any analytics, whichever cookie choice is made.
- The content of the next page (`/region`) and the cookies page (`/cookies`), which stay empty for now. That includes the eligibility questions, which will be written later, one page at a time.
- Writing the content of the accessibility statement page.
- Somewhere for the phase banner's feedback link to go.
