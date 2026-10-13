// End-to-end test of the language navigation, in a real browser: switching to Welsh and
// answering the whole journey in Welsh.
import { test, expect } from '@playwright/test';

test('the whole journey can be completed in Welsh', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  const nav = page.getByRole('navigation', { name: 'Language' });
  await nav.getByRole('link', { name: /^Cymraeg/ }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'cy');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Gwirio a ydych yn gymwys i gael Grant Cartrefi Gwyrdd'
  );

  await page.getByRole('button', { name: 'Gwirio eich cymhwysedd' }).click();
  for (const answer of ['Lloegr', 'Yn berchen arno (gyda neu heb forgais)', 'Cartref cyntaf', 'Do', 'D']) {
    await page.getByRole('radio', { name: answer, exact: true }).check();
    await page.getByRole('button', { name: 'Yn eich blaen' }).click();
  }

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gwirio eich atebion');
  await page.getByRole('button', { name: 'Derbyn a pharhau' }).click();
  await expect(page.locator('.govuk-panel--confirmation')).toHaveText('Rydych yn gymwys i gael Grant Cartrefi Gwyrdd');

  // The language is remembered after a refresh, and switching back shows English.
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'cy');
  await page.getByRole('navigation', { name: 'Iaith' }).getByRole('link', { name: /^English/ }).click();
  await expect(page.locator('.govuk-panel--confirmation')).toHaveText('You are eligible for a Green Home Grant');
});

test('the language navigation sits on the right of the content', async ({ page }) => {
  await page.goto('/');
  const list = await page.locator('.govuk-language-navigation__list').boundingBox();
  const main = await page.getByRole('main').boundingBox();
  // Its right edge lines up with the content's right edge, and it starts past the middle.
  expect(Math.abs(list.x + list.width - (main.x + main.width))).toBeLessThanOrEqual(1);
  expect(list.x).toBeGreaterThan(main.x + main.width / 2);
});

for (const width of [1280, 320]) {
  test(`at ${width} pixels wide, the "Back" link sits on the same row as the language navigation, on the left`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/region');
    const back = await page.getByRole('link', { name: 'Back', exact: true }).boundingBox();
    const list = await page.locator('.govuk-language-navigation__list').boundingBox();
    const main = await page.getByRole('main').boundingBox();
    // Same row: their vertical middles line up, and both are above the main content.
    expect(Math.abs(back.y + back.height / 2 - (list.y + list.height / 2))).toBeLessThanOrEqual(2);
    expect(back.y + back.height).toBeLessThanOrEqual(main.y);
    // "Back" on the left, the language navigation on the right.
    expect(back.x + back.width).toBeLessThan(list.x);
    expect(Math.abs(back.x - main.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(list.x + list.width - (main.x + main.width))).toBeLessThanOrEqual(1);
  });
}

test('the language navigation is the same height above the content with or without a "Back" link', async ({ page }) => {
  await page.goto('/');
  const withoutBack = (await page.getByRole('main').boundingBox()).y;
  await page.goto('/region');
  const withBack = (await page.getByRole('main').boundingBox()).y;
  expect(Math.abs(withBack - withoutBack)).toBeLessThanOrEqual(2);
});

test.describe('at 320 pixels wide', () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test('the language navigation and Welsh pages fit without scrolling sideways', async ({ page }) => {
    const fitsWidth = () =>
      page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

    await page.goto('/');
    await page.getByRole('link', { name: /^Cymraeg/ }).click();
    expect(await fitsWidth()).toBe(true);
    await page.getByRole('button', { name: 'Gwirio eich cymhwysedd' }).click();
    await page.getByRole('button', { name: 'Yn eich blaen' }).click();
    await expect(page.locator('.govuk-error-summary')).toBeVisible();
    expect(await fitsWidth()).toBe(true);
  });
});
