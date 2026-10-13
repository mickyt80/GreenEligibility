# Intent: Green Home Grant – ownership page

*Based on `instruction.md`, the existing `/ownership` page, `route.md`, and an interview with the site owner, 2026-10-13. It follows on from `intent/03-check-answers/intent.md`.*

## Problem

The `/ownership` page asks "Do you own or rent your property?", but the answer does nothing. It isn't checked, saved or shown on check answers, and it doesn't affect the result. So everyone in the UK is told they are eligible, whether they own or rent their home.

## Who is it for

"UK citizens checking whether they can get the grant." This is the same group as the earlier pages. They need to say whether they own or rent their property, check that answer, and find out whether they are eligible.

## What success looks like

People can say whether they own or rent, check and change that answer, and get the right result.

### The question

The page keeps its existing question and answers:

- Question: **"Do you own or rent your property?"**
- Answers:
  - Own (with or without mortgage)
  - Rent from a private landlord
  - Rent from a housing association
  - Rent from the council

### Who is eligible

| Answer | Eligible? |
|---|---|
| Own (with or without mortgage) | Can be eligible |
| Rent from a private landlord | Not eligible |
| Rent from a housing association | Not eligible |
| Rent from the council | Not eligible |

### The journey

The journey in `route.md` doesn't change: check answers is always shown before the result.

- Every answer, including the "Rent" answers, goes to check answers when "Continue" is pressed.
- The result is shown only after "Accept and continue".

### No answer chosen

If the user presses "Continue" without choosing an answer, they are stopped and shown the message **"Select if you own or rent your property"**, in the same way as the region page's error.

### Keeping the answer

The ownership answer is kept in the same way as the region answer:

- It is saved when "Continue" is pressed.
- It is still selected if the user goes back or refreshes the page.
- It is forgotten when the browser tab is closed.
- Saving it undoes an earlier "Accept and continue".

The ownership page's "Back" link still goes to `/region`.

### Check answers

- When the region is England, Scotland, Wales or Northern Ireland, check answers shows a second row, after the region row:

  | Label | Answer | Link |
  |---|---|---|
  | Do you own or rent your property? | the answer given | Change |

- When the region is "Outside of the UK", the ownership row is left out, because that answer no longer counts.
- The ownership row's "Change" link opens the ownership page with the answer selected. Pressing "Continue" there returns to check answers.

### The result

After "Accept and continue":

| Region | Ownership | Result |
|---|---|---|
| Outside of the UK | any, or none | "You are not eligible for a Green Home Grant", with the reason "The Green Home Grant is only available to people who live in the UK". |
| England, Scotland, Wales or Northern Ireland | any "Rent" answer | "You are not eligible for a Green Home Grant", with the reason "The Green Home Grant is only available to people who own their home." |
| England, Scotland, Wales or Northern Ireland | Own (with or without mortgage) | The green panel, "You are eligible for a Green Home Grant". |

Only one reason is shown at a time. When the region is "Outside of the UK", only the region reason is shown, because "Outside of the UK" skips the ownership question, so that answer no longer counts.

### Main measure of success

Someone can say whether they own or rent, check and change that answer, and get the right result: owners in the UK are eligible, and renters are told clearly, with the reason, that they aren't.

## Out of scope

- The questions after this one in `Questions.md`: "Is this your main residence?", "Was your property built before the year 2000?" and "What is your homes EPC rating?".
- Anything more on the "eligible" result.
- Showing two reasons at once.
- Changing the ownership question or its four answers.
