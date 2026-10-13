# Journey flow

How a user moves from page to page in "Check if you are eligible for a Green Home Grant". It matches the routing in the code: each question page's `nextPage` and `src/journeyPath.js`. See also `route.md`.

## The journey

Every path goes through **Check your answers** before the result. An answer that means "not eligible" skips the remaining questions.

```mermaid
flowchart TD
    start["<b>Start page</b><br/>/<br/>Check if you are eligible for a Green Home Grant"]
    region{"<b>Region</b><br/>/region<br/>In what region do you live?"}
    ownership{"<b>Ownership</b><br/>/ownership<br/>Do you own or rent your property?"}
    residence{"<b>Main residence</b><br/>/main-residence<br/>Is this your main residence or a secondary home?"}
    built{"<b>Year built</b><br/>/built-before-2000<br/>Was your property built before the year 2000?"}
    epc{"<b>EPC rating</b><br/>/epc-rating<br/>What is your home's EPC rating?"}
    check["<b>Check your answers</b><br/>/check-answers<br/>One row per question answered"]
    result{"<b>Result</b><br/>/result<br/>Decided by the first<br/>answer that isn't eligible"}

    eligible(["You are eligible for a Green Home Grant<br/><i>green panel</i>"])
    maybe(["You may be eligible<br/><i>link to Find an energy certificate</i>"])
    noUK(["Not eligible<br/><i>only available to people who live in the UK</i>"])
    noOwn(["Not eligible<br/><i>only available to people who own their home</i>"])
    noMain(["Not eligible<br/><i>only available for your main residence</i>"])
    noBuilt(["Not eligible<br/><i>only available for properties built before 2000</i>"])
    noEpc(["Not eligible<br/><i>only available with an EPC rating of D or below</i>"])

    start -- "Check your eligibility" --> region
    region -- "England, Scotland,<br/>Wales, Northern Ireland" --> ownership
    region -- "Outside of the UK" --> check
    ownership -- "Own (with or without mortgage)" --> residence
    ownership -- "Rent from a private landlord,<br/>a housing association<br/>or the council" --> check
    residence -- "First home" --> built
    residence -- "Secondary home" --> check
    built -- "Yes" --> epc
    built -- "No" --> check
    epc -- "A to G, or Not known" --> check
    check -- "Accept and continue" --> result

    result -- "Outside of the UK" --> noUK
    result -- "any Rent answer" --> noOwn
    result -- "Secondary home" --> noMain
    result -- "No (built 2000 or later)" --> noBuilt
    result -- "A, B or C" --> noEpc
    result -- "Not known" --> maybe
    result -- "D, E, F or G" --> eligible

    classDef page fill:#f3f2f1,stroke:#0b0c0c,color:#0b0c0c
    classDef question fill:#ffffff,stroke:#1d70b8,stroke-width:2px,color:#0b0c0c
    classDef good fill:#0f7a52,stroke:#0f7a52,color:#ffffff
    classDef maybe fill:#fff7bf,stroke:#b58840,color:#0b0c0c
    classDef bad fill:#f4dad8,stroke:#ca3535,color:#0b0c0c
    class start,check page
    class region,ownership,residence,built,epc,result question
    class eligible good
    class maybe maybe
    class noUK,noOwn,noMain,noBuilt,noEpc bad
```

## Going back and changing answers

- **"Back" links** go to the page before in the journey. Check your answers and the results page have no "Back" link.
- **"Change" links** on Check your answers open that question with the answer selected. From there, the normal journey is followed.
- **The browser's Back button** works as normal. From a result, it returns to Check your answers.

```mermaid
flowchart RL
    region["/region"] -- Back --> start["/"]
    ownership["/ownership"] -- Back --> region
    residence["/main-residence"] -- Back --> ownership
    built["/built-before-2000"] -- Back --> residence
    epc["/epc-rating"] -- Back --> built
    check["/check-answers"] -. "Change (each row)" .-> region
    check -. Change .-> ownership
    check -. Change .-> residence
    check -. Change .-> built
    check -. Change .-> epc
```

## Pages opened directly by address

| Address | When | What happens |
|---|---|---|
| `/check-answers` | A question on the user's path is unanswered (including the region) | Sends the user to the first page `/` |
| `/result` | "Accept and continue" hasn't been pressed since the last answer was saved | Sends the user to the first page `/` |
| `/result` | A question on the user's path is unanswered | Sends the user to the first page `/` |
| Any question page | Any time | Shows the question, with the saved answer selected if there is one |

Saving any answer undoes an earlier "Accept and continue", so the user has to check and accept their answers again.

## Pages outside the journey

- **Cookies** (`/cookies`): reached from the cookie banner's "View cookies" and "change your cookie settings" links.
- **Accessibility statement** (`/accessibility-statement`): reached from the footer.
- **Language navigation** (English | Cymraeg): on every page, it switches the language and stays on the same page.
