# Intent: Green Home Grant – check answers page

*Based on the GOV.UK Design System's "Check answers" pattern, the starter's unfinished `/check-answers` page, `route.md`, and an interview with the site owner, 2026-10-13. It follows on from `intent/02-region-page/intent.md`, and changes how the region page's "Outside of the UK" answer works.*

## Problem

People can answer the region question, but they have no way to check their answer before getting a result. They also can't get a positive result: the results page only shows "not eligible". After the ownership page there is nowhere to go, because it has no "Continue" button.

The service needs a page, using the existing GOV.UK Design System pattern "check answers", where people can see their answers, change them, and then get their result. "Check your answer will always be shown before the results page."

## Who is it for

"UK citizens checking whether they can get the grant." This is the same group as the first two pages. They need to see what they answered, change it if it's wrong, and then find out whether they are eligible.

## What success looks like

People can check their answers, change them, and then accept them to get their result.

### The journey

From `route.md`:

```
start ->
	/region ->
		/check (when "outside of the uk" is the /region answer) ->
			/result (not eligible)
		/Ownership (when any other answer is the /region answer) ->
			/check ->
				/result (eligible)
```

The check answers page stays at the starter's address, `/check-answers`, rather than `/check`.

- "Choosing 'Outside of the UK' no longer sends the user straight to the results page." It goes to the check answers page.
- England, Scotland, Wales or Northern Ireland go to the ownership page, as before.
- The ownership page gets a "Continue" button that goes to the check answers page. The ownership answer is not saved or checked yet.

### The check answers page

- The page heading is "Check your answers".
- For now it shows only the region answer, in one row:

  | Label | Answer | Link |
  |---|---|---|
  | In what region do you live? | the answer given | Change |

- More rows are added as each later question is built.
- The page has no "Back" link.
- The page ends with an "Accept and continue" button.

### Changing the region answer

- "Change" opens the region page, with the current answer selected.
- After that, the region page works exactly as it does the first time through: "Outside of the UK" goes to check answers, and any other answer goes to the ownership page, then check answers.
- The region page's "Back" link still goes to the first page.

### The result

"Accept and continue" goes to the results page:

| Region answer | Result |
|---|---|
| England, Scotland, Wales or Northern Ireland | A green GOV.UK confirmation panel with the heading "You are eligible for a Green Home Grant", and nothing else for now. |
| Outside of the UK | The existing "not eligible" message: "You are not eligible for a Green Home Grant", with the reason "The Green Home Grant is only available to people who live in the UK". |

Like the "not eligible" result, the "eligible" result has no "Back" link and no link to change the answer.

### Opening a page directly

- Typing `/check-answers` without having answered the region question sends the user to the first page.
- Either result is shown only after "Accept and continue" has been pressed. Typing `/result` before that, whatever the answer, sends the user to the first page.
- Saving a new region answer undoes an earlier "Accept and continue", so the user has to accept again.

### Main measure of success

Someone can see their region answer, change it, and press "Accept and continue" to get the right result: eligible for a UK region, and not eligible for "Outside of the UK". Check answers is always shown before the result.

## Out of scope

- Saving, checking or showing the ownership answer. The ownership page's "Continue" button only moves on.
- Rows for any other question, which will be added as each later question is built.
- Anything on the "eligible" result beyond the panel heading, such as next steps or how much the grant is worth.
- A "Back" link on the check answers page.
