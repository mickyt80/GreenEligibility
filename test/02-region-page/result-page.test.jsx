// Plan step 4: the results page.
// Spec requirements 29–36.
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, within, waitFor, act } from '@testing-library/react';
import {
  renderApp,
  clearCookies,
  getMain,
  answerRegion,
  refresh,
  UK_REGIONS,
  OUTSIDE_UK,
  RESULT_HEADING,
  RESULT_TITLE,
  RESULT_REASON,
} from './helpers';

// Answers "Outside of the UK" on the region page, which opens check answers, then
// accepts, which opens the results page. (Changed by spec/03-check-answers.)
async function reachNotEligible() {
  const app = renderApp('/region');
  await answerRegion(app.user, OUTSIDE_UK);
  await app.user.click(screen.getByRole('button', { name: 'Accept and continue' }));
  return app;
}

beforeEach(() => {
  clearCookies();
  window.sessionStorage.clear();
  document.title = '';
});

describe('the results page after "Outside of the UK"', () => {
  it('opens at /result (requirement 29)', async () => {
    const { currentPath } = await reachNotEligible();
    expect(currentPath()).toBe('/result');
  });

  it(`has the heading "${RESULT_HEADING}" (requirement 30)`, async () => {
    await reachNotEligible();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(RESULT_HEADING);
  });

  it('gives the reason under the heading (requirement 31)', async () => {
    await reachNotEligible();
    expect(within(getMain()).getByText(RESULT_REASON)).toBeInTheDocument();
  });

  it(`has the tab title "${RESULT_TITLE}" (requirement 32)`, async () => {
    await reachNotEligible();
    await waitFor(() => expect(document.title).toBe(RESULT_TITLE));
  });

  it('has no "Back" link, "Continue" button or link to change the answer (requirement 33)', async () => {
    await reachNotEligible();
    const main = getMain();
    expect(within(main).queryAllByRole('link')).toHaveLength(0);
    expect(within(main).queryAllByRole('button')).toHaveLength(0);
  });

  it('shows only the heading and the reason, and no other result (requirement 34)', async () => {
    await reachNotEligible();
    const withoutSpaces = (text) => text.replace(/\s/g, '');
    expect(withoutSpaces(getMain().textContent)).toBe(withoutSpaces(`${RESULT_HEADING} ${RESULT_REASON}`));
  });

  // Changed by spec/03-check-answers: Back now returns to check answers.
  it('returns to the check answers page with the browser’s Back button (requirement 35)', async () => {
    const { currentPath, goBack } = await reachNotEligible();
    act(() => goBack());
    expect(currentPath()).toBe('/check-answers');
  });

  it('still shows the "not eligible" message after a refresh', async () => {
    await reachNotEligible();
    const { currentPath } = refresh('/result');
    expect(currentPath()).toBe('/result');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(RESULT_HEADING);
  });
});

describe('opening /result directly (requirement 36)', () => {
  it('sends the user to the first page when no answer has been given', async () => {
    const { currentPath } = renderApp('/result');
    await waitFor(() => expect(currentPath()).toBe('/'));
    expect(screen.queryByText(RESULT_HEADING)).not.toBeInTheDocument();
  });

  it.each(UK_REGIONS)('sends the user to the first page when the last answer was "%s"', async (region) => {
    const { user } = renderApp('/region');
    await answerRegion(user, region);
    const { currentPath } = refresh('/result');
    await waitFor(() => expect(currentPath()).toBe('/'));
    expect(screen.queryByText(RESULT_HEADING)).not.toBeInTheDocument();
  });
});
