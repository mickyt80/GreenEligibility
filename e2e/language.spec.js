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
