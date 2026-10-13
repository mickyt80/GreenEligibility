// Plan step 1: the three question pages.
// Spec requirements 1–25 and 34.
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, within, waitFor, act } from '@testing-library/react';
import {
  renderApp,
  clearCookies,
  normalise,
  comesBefore,
  getMain,
  getRadio,
  getRadios,
  queryBackLink,
  checkedLabels,
  refresh,
  newTab,
  getAccept,
  queryErrorSummary,
  OWN,
  RENTS,
  OUTSIDE_UK,
  FIRST_HOME,
  SECONDARY_HOME,
  EPC_LETTERS,
  NOT_KNOWN,
  MAIN_RESIDENCE,
  BUILT,
  EPC,
  NEW_PAGES,
  ANSWERS_TO_REACH,
  ELIGIBLE_PATH,
  getContinueOnPage,
  answerPage,
  answerPath,
} from './helpers';

// Answers from /region through to the given new page.
const reach = (user, page) => answerPath(user, ANSWERS_TO_REACH[page.path]);

const radioLabels = () => getRadios().map((radio) => normalise(radio.labels[0].textContent));

beforeEach(() => {
  clearCookies();
  window.sessionStorage.clear();
  document.title = '';
});

describe('reaching the new pages', () => {
  it(`opens /main-residence after "${OWN}" (requirement 1)`, async () => {
    const { user, currentPath } = renderApp('/region');
    await answerPath(user, { ownership: OWN });
    expect(currentPath()).toBe('/main-residence');
  });

  it.each(RENTS)('still opens /check-answers after "%s" (requirement 2)', async (answer) => {
    const { user, currentPath } = renderApp('/region');
    await answerPath(user, { ownership: answer });
    expect(currentPath()).toBe('/check-answers');
  });

  it(`still opens /check-answers after "${OUTSIDE_UK}" (requirement 3)`, async () => {
    const { user, currentPath } = renderApp('/region');
    await answerPath(user, { region: OUTSIDE_UK });
    expect(currentPath()).toBe('/check-answers');
  });
});

describe('the main residence page', () => {
  it('has its tab title, "Back" link, heading and two answers one under the other (requirements 4, 5)', async () => {
    renderApp(MAIN_RESIDENCE.path);
    await waitFor(() => expect(document.title).toBe(`${MAIN_RESIDENCE.question} – GOV.UK`));
    expect(queryBackLink()).toHaveAttribute('href', '/ownership');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(MAIN_RESIDENCE.question);
    expect(radioLabels()).toEqual([FIRST_HOME, SECONDARY_HOME]);
    expect(getMain().querySelector('.govuk-radios')).not.toHaveClass('govuk-radios--inline');
  });

  it(`opens /built-before-2000 after "${FIRST_HOME}" (requirement 6)`, async () => {
    const { user, currentPath } = renderApp('/region');
    await answerPath(user, { ownership: OWN, residence: FIRST_HOME });
    expect(currentPath()).toBe('/built-before-2000');
  });

  it(`opens /check-answers after "${SECONDARY_HOME}" (requirement 7)`, async () => {
    const { user, currentPath } = renderApp('/region');
    await answerPath(user, { ownership: OWN, residence: SECONDARY_HOME });
    expect(currentPath()).toBe('/check-answers');
  });
});

describe('the year built page', () => {
  it('has its tab title, "Back" link, heading and "Yes" and "No" side by side (requirements 8, 9)', async () => {
    renderApp(BUILT.path);
    await waitFor(() => expect(document.title).toBe(`${BUILT.question} – GOV.UK`));
    expect(queryBackLink()).toHaveAttribute('href', '/main-residence');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(BUILT.question);
    expect(radioLabels()).toEqual(['Yes', 'No']);
    expect(getMain().querySelector('.govuk-radios')).toHaveClass('govuk-radios--inline');
  });

  it('opens /epc-rating after "Yes" (requirement 10)', async () => {
    const { user, currentPath } = renderApp('/region');
    await answerPath(user, { ownership: OWN, residence: FIRST_HOME, built: 'Yes' });
    expect(currentPath()).toBe('/epc-rating');
  });

  it('opens /check-answers after "No" (requirement 11)', async () => {
    const { user, currentPath } = renderApp('/region');
    await answerPath(user, { ownership: OWN, residence: FIRST_HOME, built: 'No' });
    expect(currentPath()).toBe('/check-answers');
  });
});

describe('the EPC rating page', () => {
  it('has its tab title, "Back" link and heading (requirements 12, 13)', async () => {
    renderApp(EPC.path);
    await waitFor(() => expect(document.title).toBe(`${EPC.question} – GOV.UK`));
    expect(queryBackLink()).toHaveAttribute('href', '/built-before-2000');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(EPC.question);
  });

  it('shows A to G one under the other, then "or", then "Not known" (requirement 13)', () => {
    renderApp(EPC.path);
    expect(radioLabels()).toEqual([...EPC_LETTERS, NOT_KNOWN]);
    expect(getMain().querySelector('.govuk-radios')).not.toHaveClass('govuk-radios--inline');
    const divider = getMain().querySelector('.govuk-radios__divider');
    expect(divider).not.toBeNull();
    expect(normalise(divider.textContent)).toBe('or');
    expect(comesBefore(getRadio('G'), divider)).toBe(true);
    expect(comesBefore(divider, getRadio(NOT_KNOWN))).toBe(true);
  });

  it.each([...EPC_LETTERS, NOT_KNOWN])('opens /check-answers after "%s" (requirement 14)', async (rating) => {
    const { user, currentPath } = renderApp('/region');
    await answerPath(user, { ...ANSWERS_TO_REACH[EPC.path], epc: rating });
    expect(currentPath()).toBe('/check-answers');
  });
});

describe.each(NEW_PAGES)('on $path', (page) => {
  it('has no answer selected the first time, and only one can be selected (requirement 15)', async () => {
    const { user } = renderApp(page.path);
    expect(checkedLabels()).toEqual([]);
    await user.click(getRadio(page.answers[0]));
    await user.click(getRadio(page.answers[1]));
    expect(checkedLabels()).toEqual([page.answers[1]]);
  });

  it('stops "Continue" with nothing selected and shows the error box, message and tab title (requirements 16, 17)', async () => {
    const { user, currentPath } = renderApp('/region');
    await reach(user, page);
    await user.click(getContinueOnPage());
    expect(currentPath()).toBe(page.path);
    const summary = queryErrorSummary();
    expect(summary).not.toBeNull();
    expect(within(summary).getByRole('heading', { name: 'There is a problem' })).toBeInTheDocument();
    expect(within(summary).getByRole('link', { name: page.error })).toBeInTheDocument();
    await waitFor(() => expect(summary).toHaveFocus());
    const message = getMain().querySelector('.govuk-error-message');
    expect(normalise(message.textContent)).toMatch(new RegExp(`${page.error}$`));
    expect(comesBefore(message, getRadio(page.answers[0]))).toBe(true);
    expect(message.closest('.govuk-form-group')).toHaveClass('govuk-form-group--error');
    await waitFor(() => expect(document.title).toBe(`Error: ${page.question} – GOV.UK`));
  });

  it('moves focus to the first answer when the error link is clicked (requirement 18)', async () => {
    const { user } = renderApp(page.path);
    await user.click(getContinueOnPage());
    await user.click(within(queryErrorSummary()).getByRole('link', { name: page.error }));
    expect(getRadio(page.answers[0])).toHaveFocus();
  });

  it('opens the page before, with its answer still selected, from the "Back" link (requirement 19)', async () => {
    const { user, currentPath } = renderApp('/region');
    await reach(user, page);
    await user.click(queryBackLink());
    expect(currentPath()).toBe(page.back);
    const before = { '/ownership': OWN, '/main-residence': FIRST_HOME, '/built-before-2000': 'Yes' };
    expect(checkedLabels()).toEqual([before[page.back]]);
  });

  it('shows the page, not an error, when opened directly (requirement 20)', () => {
    renderApp(page.path);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(page.question);
    expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();
  });

  it('has no other questions, form fields, links or buttons (requirement 21)', () => {
    renderApp(page.path);
    const main = getMain();
    expect(main.querySelectorAll('input')).toHaveLength(page.answers.length);
    expect(main.querySelectorAll('select, textarea')).toHaveLength(0);
    expect(main.querySelectorAll('fieldset')).toHaveLength(1);
    // The "Back" link sits before the main content, so the main content has no links.
    expect(within(main).queryAllByRole('link')).toEqual([]);
    expect(queryBackLink()).not.toBeNull();
    expect(within(main).getAllByRole('button')).toEqual([getContinueOnPage()]);
  });

  it('keeps the answer after continuing, through the browser’s Back button and a refresh (requirement 22)', async () => {
    const { user, currentPath, goBack } = renderApp('/region');
    await reach(user, page);
    const answer = page.answers[page.answers.length - 1];
    await answerPage(user, answer);
    act(() => goBack());
    expect(currentPath()).toBe(page.path);
    expect(checkedLabels()).toEqual([answer]);
    refresh(page.path);
    expect(checkedLabels()).toEqual([answer]);
  });

  it('does not keep an answer selected without pressing "Continue" (requirement 23)', async () => {
    const { user, currentPath } = renderApp('/region');
    await reach(user, page);
    await user.click(getRadio(page.answers[0]));
    await user.click(queryBackLink());
    await user.click(getContinueOnPage());
    expect(currentPath()).toBe(page.path);
    expect(checkedLabels()).toEqual([]);
  });

  it('forgets the answer in a new tab (requirement 24)', async () => {
    const { user } = renderApp('/region');
    await reach(user, page);
    await answerPage(user, page.answers[0]);
    newTab(page.path);
    expect(checkedLabels()).toEqual([]);
  });

  it('undoes an earlier "Accept and continue" when its answer is saved again (requirement 25)', async () => {
    const { user } = renderApp('/region');
    await answerPath(user, ELIGIBLE_PATH);
    await user.click(getAccept());
    const fresh = refresh(page.path);
    const saved = { '/main-residence': FIRST_HOME, '/built-before-2000': 'Yes', '/epc-rating': 'D' };
    await answerPage(fresh.user, saved[page.path]);
    const { currentPath } = refresh('/result');
    await waitFor(() => expect(currentPath()).toBe('/'));
  });

  it('works with a keyboard: Tab to the answers, Space to select, Tab to "Continue", Enter to continue (requirement 34)', async () => {
    const { user, currentPath } = renderApp('/region');
    await reach(user, page);
    queryBackLink().focus();
    await user.tab();
    expect(getRadio(page.answers[0])).toHaveFocus();
    await user.keyboard(' ');
    expect(getRadio(page.answers[0])).toBeChecked();
    for (let i = 0; i < 10 && document.activeElement !== getContinueOnPage(); i += 1) {
      await user.tab();
    }
    expect(getContinueOnPage()).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(currentPath()).not.toBe(page.path);
  });
});
