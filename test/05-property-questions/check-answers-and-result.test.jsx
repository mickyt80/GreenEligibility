// Plan step 2: the path on check answers and the results page.
// Spec requirements 26–33.
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, within, waitFor, act } from '@testing-library/react';
import {
  renderApp,
  clearCookies,
  normalise,
  getMain,
  checkedLabels,
  refresh,
  getAccept,
  getRows,
  getRowKey,
  getRowValue,
  REGION_LABEL,
  OWNERSHIP_LABEL,
  OUTSIDE_UK,
  OWN,
  RENTS,
  RESULT_HEADING,
  RESULT_REASON,
  OWN_HOME_REASON,
  ELIGIBLE_HEADING,
  FIRST_HOME,
  SECONDARY_HOME,
  ELIGIBLE_EPC,
  NOT_ELIGIBLE_EPC,
  MAIN_RESIDENCE,
  BUILT,
  EPC,
  ELIGIBLE_PATH,
  answerPage,
  answerPath,
  getLink,
} from './helpers';

const rowLabels = () => [...getRows()].map((row) => normalise(getRowKey(row).textContent));
const rowAnswers = () => [...getRows()].map((row) => normalise(getRowValue(row).textContent));

// Accepts on check answers, then returns to it with the browser's Back button.
async function acceptAndGoBack(user, goBack) {
  await user.click(getAccept());
  act(() => goBack());
}

beforeEach(() => {
  clearCookies();
  window.sessionStorage.clear();
  document.title = '';
});

describe('rows on check answers (requirement 26)', () => {
  it.each([
    ['Outside of the UK', { region: OUTSIDE_UK }, [REGION_LABEL]],
    ['a renter', { ownership: RENTS[0] }, [REGION_LABEL, OWNERSHIP_LABEL]],
    ['a secondary home', { ownership: OWN, residence: SECONDARY_HOME }, [REGION_LABEL, OWNERSHIP_LABEL, MAIN_RESIDENCE.question]],
    [
      'a home built in 2000 or later',
      { ownership: OWN, residence: FIRST_HOME, built: 'No' },
      [REGION_LABEL, OWNERSHIP_LABEL, MAIN_RESIDENCE.question, BUILT.question],
    ],
    ['every question', ELIGIBLE_PATH, [REGION_LABEL, OWNERSHIP_LABEL, MAIN_RESIDENCE.question, BUILT.question, EPC.question]],
  ])('shows the rows on the path for %s', async (_, answers, labels) => {
    const { user, currentPath } = renderApp('/region');
    await answerPath(user, answers);
    expect(currentPath()).toBe('/check-answers');
    expect(rowLabels()).toEqual(labels);
  });

  it('shows each answer in its row, with a "Change" link', async () => {
    const { user } = renderApp('/region');
    await answerPath(user, { ...ELIGIBLE_PATH, epc: 'Not known' });
    expect(rowAnswers()).toEqual(['England', OWN, FIRST_HOME, 'Yes', 'Not known']);
    for (const row of getRows()) {
      expect(normalise(within(row).getByRole('link').textContent)).toMatch(/^Change/);
    }
  });
});

describe('answers no longer on the path (requirement 27)', () => {
  it(`hides the year built and EPC rows after changing to "${SECONDARY_HOME}"`, async () => {
    const { user, goBack } = renderApp('/region');
    await answerPath(user, { ...ELIGIBLE_PATH, epc: 'B' });
    await acceptAndGoBack(user, goBack);
    await user.click(getLink(MAIN_RESIDENCE.changeName));
    await answerPage(user, SECONDARY_HOME);
    expect(rowLabels()).toEqual([REGION_LABEL, OWNERSHIP_LABEL, MAIN_RESIDENCE.question]);
  });

  it('keeps the hidden answers, so they are still selected after changing back', async () => {
    const { user, goBack } = renderApp('/region');
    await answerPath(user, { ...ELIGIBLE_PATH, epc: 'B' });
    await acceptAndGoBack(user, goBack);
    await user.click(getLink(MAIN_RESIDENCE.changeName));
    await answerPage(user, SECONDARY_HOME);
    await user.click(getLink(MAIN_RESIDENCE.changeName));
    await answerPage(user, FIRST_HOME);
    expect(checkedLabels()).toEqual(['Yes']);
    await answerPage(user, 'Yes');
    expect(checkedLabels()).toEqual(['B']);
  });
});

describe('"Change" links', () => {
  it.each([MAIN_RESIDENCE, BUILT, EPC])(
    'names the $path row’s link for screen readers, showing only "Change" (requirement 28)',
    async (page) => {
      const { user } = renderApp('/region');
      await answerPath(user, ELIGIBLE_PATH);
      const link = getLink(page.changeName);
      const hidden = link.querySelector('.govuk-visually-hidden');
      expect(hidden).not.toBeNull();
      expect(normalise(link.textContent.replace(hidden.textContent, ''))).toBe('Change');
    }
  );

  it.each([
    { page: MAIN_RESIDENCE, answer: FIRST_HOME },
    { page: BUILT, answer: 'Yes' },
    { page: EPC, answer: 'D' },
  ])('opens $page.path with the answer selected (requirement 29)', async ({ page, answer }) => {
    const { user, currentPath } = renderApp('/region');
    await answerPath(user, ELIGIBLE_PATH);
    const link = getLink(page.changeName);
    expect(link).toHaveAttribute('href', page.path);
    await user.click(link);
    expect(currentPath()).toBe(page.path);
    expect(checkedLabels()).toEqual([answer]);
  });

  it('follows the normal journey after "Change" (requirement 29)', async () => {
    const { user, currentPath } = renderApp('/region');
    await answerPath(user, ELIGIBLE_PATH);
    await user.click(getLink(MAIN_RESIDENCE.changeName));
    await answerPage(user, FIRST_HOME);
    expect(currentPath()).toBe('/built-before-2000');
  });
});

describe('an unanswered question on the path (requirement 30)', () => {
  it.each([
    ['main residence', { ownership: OWN }],
    ['year built', { ownership: OWN, residence: FIRST_HOME }],
    ['EPC rating', { ownership: OWN, residence: FIRST_HOME, built: 'Yes' }],
  ])('opens the first page from /check-answers with no %s answer', async (_, answers) => {
    const { user } = renderApp('/region');
    await answerPath(user, answers);
    const { currentPath } = refresh('/check-answers');
    await waitFor(() => expect(currentPath()).toBe('/'));
  });
});

describe('the result', () => {
  it.each([
    ['Outside of the UK', { region: OUTSIDE_UK }, RESULT_REASON],
    ['a renter', { ownership: RENTS[2] }, OWN_HOME_REASON],
    ['a secondary home', { ownership: OWN, residence: SECONDARY_HOME }, MAIN_RESIDENCE.reason],
    ['a home built in 2000 or later', { ownership: OWN, residence: FIRST_HOME, built: 'No' }, BUILT.reason],
    ...NOT_ELIGIBLE_EPC.map((rating) => [`EPC rating ${rating}`, { ...ELIGIBLE_PATH, epc: rating }, EPC.reason]),
  ])('shows only the reason for %s (requirement 31)', async (_, answers, reason) => {
    const { user } = renderApp('/region');
    await answerPath(user, answers);
    await user.click(getAccept());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(RESULT_HEADING);
    const withoutSpaces = (text) => text.replace(/\s/g, '');
    expect(withoutSpaces(getMain().textContent)).toBe(withoutSpaces(`${RESULT_HEADING} ${reason}`));
  });

  it('shows the first reason on the path, not a hidden later one (requirement 31)', async () => {
    const { user, goBack } = renderApp('/region');
    await answerPath(user, { ...ELIGIBLE_PATH, epc: 'A' });
    await acceptAndGoBack(user, goBack);
    await user.click(getLink(BUILT.changeName));
    await answerPage(user, 'No');
    await user.click(getAccept());
    expect(within(getMain()).getByText(BUILT.reason)).toBeInTheDocument();
    expect(screen.queryByText(EPC.reason)).not.toBeInTheDocument();
  });

  it.each(ELIGIBLE_EPC)('shows the green "eligible" panel with EPC rating "%s" (requirement 32)', async (rating) => {
    const { user } = renderApp('/region');
    await answerPath(user, { ...ELIGIBLE_PATH, epc: rating });
    await user.click(getAccept());
    const heading = screen.getByRole('heading', { level: 1 });
    expect(normalise(heading.textContent)).toBe(ELIGIBLE_HEADING);
    expect(heading.closest('.govuk-panel')).toHaveClass('govuk-panel--confirmation');
  });

  it('opens the first page from /result before "Accept and continue" (requirement 33)', async () => {
    const { user } = renderApp('/region');
    await answerPath(user, ELIGIBLE_PATH);
    const { currentPath } = refresh('/result');
    await waitFor(() => expect(currentPath()).toBe('/'));
  });

  it('opens the first page from /result with a question on the path unanswered (requirement 33)', async () => {
    const { user } = renderApp('/region');
    await answerPath(user, { ownership: OWN, residence: FIRST_HOME });
    const { currentPath } = refresh('/result');
    await waitFor(() => expect(currentPath()).toBe('/'));
  });
});
