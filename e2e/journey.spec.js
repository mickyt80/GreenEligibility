// End-to-end tests of the whole journey, in a real browser, from the first page to a result.
// They follow the walkthroughs in spec/03-check-answers/spec.md (requirement 31),
// spec/04-ownership-page/spec.md (requirement 31) and spec/05-property-questions/spec.md
// (requirement 36).
import { test, expect } from '@playwright/test';

const ELIGIBLE = 'You are eligible for a Green Home Grant';
const NOT_ELIGIBLE = 'You are not eligible for a Green Home Grant';

// Chooses an answer on the current question page and presses "Continue".
async function answer(page, label) {
  await page.getByRole('radio', { name: label, exact: true }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
}

// Starts from the first page and answers each question in turn.
async function answerAll(page, answers) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Check your eligibility' }).click();
  for (const label of answers) {
    await answer(page, label);
  }
}

// The text of each row on check answers, as [label, answer] pairs.
async function checkAnswersRows(page) {
  const rows = page.locator('.govuk-summary-list__row');
  return rows.evaluateAll((elements) =>
    elements.map((row) => [
      row.querySelector('.govuk-summary-list__key').textContent.trim(),
      row.querySelector('.govuk-summary-list__value').textContent.trim(),
    ])
  );
}

test('an owner of a main residence built before 2000 with EPC rating D is eligible', async ({ page }) => {
  await answerAll(page, ['England', 'Own (with or without mortgage)', 'First home', 'Yes', 'D']);

  await expect(page).toHaveURL(/\/check-answers$/);
  await expect(page).toHaveTitle('Check your answers – GOV.UK');
  expect(await checkAnswersRows(page)).toEqual([
    ['In what region do you live?', 'England'],
    ['Do you own or rent your property?', 'Own (with or without mortgage)'],
    ['Is this your main residence or a secondary home?', 'First home'],
    ['Was your property built before the year 2000?', 'Yes'],
    ["What is your home's EPC rating?", 'D'],
  ]);

  await page.getByRole('button', { name: 'Accept and continue' }).click();
  await expect(page).toHaveURL(/\/result$/);
  await expect(page.locator('.govuk-panel--confirmation')).toHaveText(ELIGIBLE);
  await expect(page).toHaveTitle(`${ELIGIBLE} – GOV.UK`);

  // The result survives a refresh, and Back returns to check answers.
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(ELIGIBLE);
  await page.goBack();
  await expect(page).toHaveURL(/\/check-answers$/);
});

test.describe('each "not eligible" answer skips the rest and gives its own reason', () => {
  const cases = [
    {
      name: 'outside the UK',
      answers: ['Outside of the UK'],
      rows: 1,
      reason: 'The Green Home Grant is only available to people who live in the UK.',
    },
    {
      name: 'a renter',
      answers: ['Wales', 'Rent from the council'],
      rows: 2,
      reason: 'The Green Home Grant is only available to people who own their home.',
    },
    {
      name: 'a secondary home',
      answers: ['Scotland', 'Own (with or without mortgage)', 'Secondary home'],
      rows: 3,
      reason: 'The Green Home Grant is only available for your main residence.',
    },
    {
      name: 'a home built in 2000 or later',
      answers: ['Northern Ireland', 'Own (with or without mortgage)', 'First home', 'No'],
      rows: 4,
      reason: 'The Green Home Grant is only available for properties built before the year 2000.',
    },
    {
      name: 'EPC rating B',
      answers: ['England', 'Own (with or without mortgage)', 'First home', 'Yes', 'B'],
      rows: 5,
      reason: 'The Green Home Grant is only available for properties with an EPC rating of D or below.',
    },
  ];

  for (const { name, answers, rows, reason } of cases) {
    test(name, async ({ page }) => {
      await answerAll(page, answers);
      await expect(page).toHaveURL(/\/check-answers$/);
      await expect(page.locator('.govuk-summary-list__row')).toHaveCount(rows);

      await page.getByRole('button', { name: 'Accept and continue' }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(NOT_ELIGIBLE);
      await expect(page.getByRole('main')).toContainText(reason);
      await expect(page.getByRole('main').locator('p')).toHaveCount(1);
    });
  }
});

test('"Continue" with no answer shows the error, and its link moves focus to the first answer', async ({ page }) => {
  await answerAll(page, []);
  await page.getByRole('button', { name: 'Continue' }).click();

  const summary = page.locator('.govuk-error-summary');
  await expect(summary).toBeFocused();
  await expect(summary.getByRole('heading')).toHaveText('There is a problem');
  await expect(page).toHaveTitle('Error: In what region do you live? – GOV.UK');

  await summary.getByRole('link', { name: 'Select the region where you live' }).click();
  await expect(page.getByRole('radio', { name: 'England' })).toBeFocused();
});

test('changing an answer undoes "Accept and continue" and changes the result', async ({ page }) => {
  await answerAll(page, ['England', 'Own (with or without mortgage)', 'First home', 'Yes', 'D']);
  await page.getByRole('button', { name: 'Accept and continue' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(ELIGIBLE);
  await page.goBack();

  await page.getByRole('link', { name: "Change your home's EPC rating" }).click();
  await expect(page.getByRole('radio', { name: 'D', exact: true })).toBeChecked();
  await answer(page, 'B');

  // The earlier acceptance no longer counts, so /result sends the user to the first page.
  await page.goto('/result');
  await expect(page).toHaveURL(/\/$/);

  await page.goto('/check-answers');
  await page.getByRole('button', { name: 'Accept and continue' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(NOT_ELIGIBLE);
});

test('the GOV.UK Frontend styles load in the browser', async ({ page }) => {
  await page.goto('/');
  // jsdom can't check styling. A real browser can: the start button is GOV.UK Frontend 6's
  // green, #0f7a52. Without the stylesheet it would be the browser's default grey.
  const button = page.getByRole('button', { name: 'Check your eligibility' });
  await expect(button).toHaveCSS('background-color', 'rgb(15, 122, 82)');
});

test.describe('at 320 pixels wide, pages fit without scrolling sideways', () => {
  test.use({ viewport: { width: 320, height: 640 } });

  // True when the page is no wider than the window, so there's no sideways scrolling.
  const fitsWidth = (page) =>
    page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

  test('the first page, each question with its error, check answers and the result', async ({ page }) => {
    await page.goto('/');
    expect(await fitsWidth(page)).toBe(true);
    await page.getByRole('button', { name: 'Check your eligibility' }).click();

    for (const label of ['England', 'Own (with or without mortgage)', 'First home', 'Yes', 'D']) {
      await page.getByRole('button', { name: 'Continue' }).click();
      await expect(page.locator('.govuk-error-summary')).toBeVisible();
      expect(await fitsWidth(page)).toBe(true);
      await answer(page, label);
    }

    expect(await fitsWidth(page)).toBe(true);
    await page.getByRole('button', { name: 'Accept and continue' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(ELIGIBLE);
    expect(await fitsWidth(page)).toBe(true);
  });
});
