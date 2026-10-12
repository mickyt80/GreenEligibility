# Intent: Green Home Grant – region page

*Based on Question 1 in `Questions.md`, an interview with the site owner, 2026-10-12, and their answers to the open questions in `spec/02-region-page/spec.md`. It follows on from `intent/01-start-page/intent.md`.*

## Problem

After the first page, people press "Check your eligibility" and reach `/region`, which is empty. The Green Home Grant needs to know what region of the UK someone is in. It also needs to stop people outside the UK and tell them they aren't eligible.

## Who is it for

"UK citizens checking whether they can get the grant." This is the same group as the first page. They need to say which region they live in, then carry on with the eligibility check.

It is also for anyone outside the UK who reaches the page. They need to be told clearly that they aren't eligible, and why.

## What success looks like

The page asks the user what region of the UK they are in.

### The question

From `Questions.md`, used exactly:

- Question: **"In what region do you live?"**
- Answers:
  - England
  - Scotland
  - Wales
  - Northern Ireland
  - Outside of the UK

### What happens after an answer

| Answer | What happens |
|---|---|
| England, Scotland, Wales or Northern Ireland | The user goes to the next question, the existing `/ownership` page: "use the current /ownership page's question, with its four rental options as answers". For now it "just shows the heading, the four answers and its Back link to the region page, with nothing happening yet". |
| Outside of the UK | "Stop the person and tell them they aren't eligible." This is "the end of the journey". It "will redirect to the results page", which displays text saying that they are not eligible. |

### The results page

- When the user is not eligible, the results page shows that they are not eligible ("show not eligible on the page if not eligible").
- It gives the reason: "The Green Home Grant is only available to people who live in the UK".
- There is nothing more to do from there. The page offers no way to go back and change the answer, but the browser's own Back button works as normal.

### No answer chosen

If the user continues without choosing an answer, they are stopped and shown the message **"Select the region where you live"**.

### Going back

- The page has a "Back" link to the start page.
- If the user goes back and returns, the answer they already chose is still selected.

### Main measure of success

Someone can choose their region and either go on to the next question or be told clearly, with the reason, that they aren't eligible.

## Out of scope

- Any change to the question or its five answers. They are used "exactly" as written in `Questions.md`.
- Making the `/ownership` page work (a "Continue" button, an error when nothing is chosen, where each answer leads), and every question after it.
- The "Do you own your home?" question with Yes or No answers from `Questions.md`, which is replaced by the `/ownership` page's question.
- Any result on the results page other than "not eligible", such as an "eligible" result.
- Offering someone who chose "Outside of the UK" a link or button to go back and change their answer, because that is "the end of the journey".
