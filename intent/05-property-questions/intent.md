# Intent: Green Home Grant – property questions (main residence, year built, EPC rating)

*Based on `instruction.md`, `Questions.md` (questions 3 to 5), `route.md`, and an interview with the site owner, 2026-10-13. It follows on from `intent/04-ownership-page/intent.md`.*

## Problem

After the ownership page, the service has no questions about the home itself. Anyone in the UK who owns their home is told they are eligible, without being asked whether it is their main residence, how old it is, or how energy efficient it is.

The service needs "three new pages that will show after the /ownership page in the journey".

## Who is it for

"UK citizens checking whether they can get the grant." This is the same group as the earlier pages. Those who own their home need to answer three questions about it, check their answers, and find out whether they are eligible.

## What success looks like

Someone who owns their home can answer the three questions about it, check and change their answers, and get the right result.

### The questions

The instruction's wording is used, with "build" corrected to "built", capitals on "Yes", and an apostrophe in "home's".

**1. Main residence**
- Question: **"Is this your main residence or a secondary home?"**
- Answers: First home, Secondary home

**2. Year built**
- Question: **"Was your property built before the year 2000?"**
- Answers: Yes, No

**3. EPC rating**
- Question: **"What is your home's EPC rating?"**
- Answers: A, B, C, D, E, F, G, Not known

### Who sees the new pages

- Only people who answer "Own (with or without mortgage)" on the ownership page.
- Renters go straight to check answers, as they do now.
- "Outside of the UK" goes straight to check answers, as it does now.

### Who is eligible, and where each answer leads

As soon as an answer means not eligible, the remaining questions are skipped and the user goes straight to check answers.

| Question | Answer | Eligible? | Next page |
|---|---|---|---|
| Main residence | First home | Can be eligible | Year built |
| Main residence | Secondary home | Not eligible | Check answers |
| Year built | Yes | Can be eligible | EPC rating |
| Year built | No | Not eligible | Check answers |
| EPC rating | D, E, F, G or Not known | Can be eligible | Check answers |
| EPC rating | A, B or C | Not eligible | Check answers |

The journey, extending `route.md`:

```
/ownership ->
	/check-answers (when any "Rent" answer) -> /result (not eligible)
	main residence (when "Own (with or without mortgage)") ->
		/check-answers (when "Secondary home") -> /result (not eligible)
		year built (when "First home") ->
			/check-answers (when "No") -> /result (not eligible)
			EPC rating (when "Yes") ->
				/check-answers ->
					/result (eligible for D, E, F, G or Not known; not eligible for A, B or C)
```

Check answers is still always shown before the result.

### No answer chosen

If the user presses "Continue" without choosing an answer, they are stopped and shown a message, in the same way as the earlier pages:

| Page | Message |
|---|---|
| Main residence | **"Select if this is your main residence or a secondary home"** |
| Year built | **"Select yes if your property was built before the year 2000"** |
| EPC rating | **"Select your home's EPC rating, or select Not known"** |

### Keeping the answers

Each answer is kept in the same way as the earlier answers:

- It is saved when "Continue" is pressed.
- It is still selected if the user goes back or refreshes the page.
- It is forgotten when the browser tab is closed.
- Saving it undoes an earlier "Accept and continue".

Each page has a "Back" link to the page before it in the journey.

### Check answers

- Check answers shows one row for each question on the user's current path, in journey order, after the ownership row. Each row is labelled with the full question and has a "Change" link.
- Questions that are not on the current path have no row. For example, someone who answered "Secondary home" sees no rows for the year built or EPC rating.
- Any answers given earlier to those questions are kept, but they don't count. This is the same as the ownership answer after "Outside of the UK".
- "Change" opens that question's page with the answer selected. From there, the normal journey is followed.

### The result

After "Accept and continue", only one reason is shown: the reason for the first answer on the path that means not eligible.

| Not eligible because | Reason shown |
|---|---|
| Outside of the UK | "The Green Home Grant is only available to people who live in the UK." (unchanged) |
| Any "Rent" answer | "The Green Home Grant is only available to people who own their home." (unchanged) |
| Secondary home | "The Green Home Grant is only available for your main residence." |
| Built in 2000 or later ("No") | "The Green Home Grant is only available for properties built before the year 2000." |
| EPC rating A, B or C | "The Green Home Grant is only available for properties with an EPC rating of D or below." |

The heading is still "You are not eligible for a Green Home Grant".

Someone in the UK who owns their home, with "First home", "Yes", and an EPC rating of D, E, F, G or "Not known", sees the green panel "You are eligible for a Green Home Grant".

### Main measure of success

Someone who owns their main residence, built before 2000, with an EPC rating of D or below or not known, is told they are eligible. Anyone else is told clearly, with one reason, why they aren't.

## Out of scope

- Any more questions after the EPC rating.
- Asking the new questions of renters or people outside the UK.
- Anything more on the "eligible" result.
- Showing more than one reason at a time.
- Changing the earlier questions, their answers or their reasons.
