// Plan step 1: the ownership question's error and keeping the answer.
// Spec requirements 1–15 and 29.
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
  OWNERSHIP_TITLE,
  OWNERSHIP_ANSWERS,
  OWN,
  RENTS,
  OWNERSHIP_ERROR,
  OWNERSHIP_LABEL,
  OWNERSHIP_ERROR_TITLE,
  getContinueButton,
  queryErrorSummary,
  answerOwnership,
  reachOwnership,
  answerBoth,
} from './helpers';

beforeEach(() => {
  clearCookies();
  window.sessionStorage.clear();
  document.title = '';
});

describe('the ownership page', () => {
  it('keeps its tab title, "Back" link, heading and four answers (requirement 1)', async () => {
    renderApp('/ownership');
    await waitFor(() => expect(document.title).toBe(OWNERSHIP_TITLE));
    expect(queryBackLink()).toHaveAttribute('href', '/region');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(OWNERSHIP_LABEL);
    expect(getRadios().map((radio) => normalise(radio.labels[0].textContent))).toEqual(OWNERSHIP_ANSWERS);
  });

  it('has no answer selected the first time it opens (requirement 2)', () => {
    renderApp('/ownership');
    expect(checkedLabels()).toEqual([]);
  });
});

describe('no answer chosen', () => {
  it('keeps the user on /ownership when "Continue" is clicked with nothing selected (requirement 3)', async () => {
    const { user, currentPath } = renderApp('/region');
    await reachOwnership(user);
    await user.click(getContinueButton());
    expect(currentPath()).toBe('/ownership');
  });

  it('shows a focused "There is a problem" box with the error link, below "Back" and above the heading (requirement 4)', async () => {
    const { user } = renderApp('/ownership');
    expect(queryErrorSummary()).toBeNull();
    await user.click(getContinueButton());
    const summary = queryErrorSummary();
    expect(summary).not.toBeNull();
    expect(within(summary).getByRole('heading', { name: 'There is a problem' })).toBeInTheDocument();
    expect(within(summary).getByRole('link', { name: OWNERSHIP_ERROR })).toBeInTheDocument();
    expect(comesBefore(queryBackLink(), summary)).toBe(true);
    expect(comesBefore(summary, screen.getByRole('heading', { level: 1 }))).toBe(true);
    await waitFor(() => expect(summary).toHaveFocus());
  });

  it(`moves focus to "${OWN}" when the error link is clicked (requirement 5)`, async () => {
    const { user } = renderApp('/ownership');
    await user.click(getContinueButton());
    await user.click(within(queryErrorSummary()).getByRole('link', { name: OWNERSHIP_ERROR }));
    expect(getRadio(OWN)).toHaveFocus();
  });

  it('shows the error message above the answers and marks the question as having an error (requirement 6)', async () => {
    const { user } = renderApp('/ownership');
    await user.click(getContinueButton());
    const message = getMain().querySelector('.govuk-error-message');
    expect(message).not.toBeNull();
    expect(normalise(message.textContent)).toMatch(new RegExp(`${OWNERSHIP_ERROR}$`));
    expect(comesBefore(message, getRadio(OWN))).toBe(true);
    expect(message.closest('.govuk-form-group')).toHaveClass('govuk-form-group--error');
  });

  it(`changes the tab title to "${OWNERSHIP_ERROR_TITLE}" (requirement 7)`, async () => {
    const { user } = renderApp('/ownership');
    await user.click(getContinueButton());
    await waitFor(() => expect(document.title).toBe(OWNERSHIP_ERROR_TITLE));
  });

  it('moves on once an answer is selected and "Continue" is clicked (requirement 8)', async () => {
    const { user, currentPath } = renderApp('/region');
    await reachOwnership(user);
    await user.click(getContinueButton());
    await answerOwnership(user, OWN);
    expect(currentPath()).toBe('/check-answers');
  });
});

describe('continuing', () => {
  it.each(OWNERSHIP_ANSWERS)('opens /check-answers after "%s" (requirement 9)', async (answer) => {
    const { user, currentPath } = renderApp('/region');
    await answerBoth(user, 'Wales', answer);
    expect(currentPath()).toBe('/check-answers');
  });
});

describe('keeping the answer', () => {
  it('shows the answer selected after pressing the browser’s Back button on check answers (requirement 10)', async () => {
    const { user, currentPath, goBack } = renderApp('/region');
    await answerBoth(user, 'England', RENTS[2]);
    act(() => goBack());
    expect(currentPath()).toBe('/ownership');
    expect(checkedLabels()).toEqual([RENTS[2]]);
  });

  it('keeps the answer selected after a refresh (requirement 11)', async () => {
    const { user } = renderApp('/region');
    await answerBoth(user, 'England', RENTS[1]);
    refresh('/ownership');
    expect(checkedLabels()).toEqual([RENTS[1]]);
  });

  it('shows the answer selected after going back to the region page and continuing again (requirement 12)', async () => {
    const { user, goBack } = renderApp('/region');
    await answerBoth(user, 'Scotland', RENTS[0]);
    act(() => goBack());
    await user.click(queryBackLink());
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(checkedLabels()).toEqual([RENTS[0]]);
  });

  it('does not keep an answer selected without pressing "Continue" (requirement 13)', async () => {
    const { user } = renderApp('/region');
    await reachOwnership(user);
    await user.click(getRadio(OWN));
    await user.click(queryBackLink());
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(checkedLabels()).toEqual([]);
  });

  it('shows the answer last continued with, not a later one that was only selected (requirement 13)', async () => {
    const { user, goBack } = renderApp('/region');
    await answerBoth(user, 'England', RENTS[2]);
    act(() => goBack());
    await user.click(getRadio(OWN));
    await user.click(queryBackLink());
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(checkedLabels()).toEqual([RENTS[2]]);
  });

  it('forgets the answer in a new tab (requirement 14)', async () => {
    const { user } = renderApp('/region');
    await answerBoth(user, 'England', OWN);
    newTab('/ownership');
    expect(checkedLabels()).toEqual([]);
  });

  it('undoes an earlier "Accept and continue" when an ownership answer is saved (requirement 15)', async () => {
    const { user, goBack } = renderApp('/region');
    await answerBoth(user, 'England', OWN);
    await user.click(getAccept());
    act(() => goBack());
    act(() => goBack());
    await answerOwnership(user, OWN);
    const { currentPath } = refresh('/result');
    await waitFor(() => expect(currentPath()).toBe('/'));
  });
});

describe('using a keyboard (requirement 29)', () => {
  it('moves from "Back" to the answers with Tab, selects with Space, and continues with Enter', async () => {
    const { user, currentPath } = renderApp('/region');
    await reachOwnership(user);
    queryBackLink().focus();
    await user.tab();
    expect(getRadio(OWN)).toHaveFocus();
    await user.keyboard(' ');
    expect(getRadio(OWN)).toBeChecked();
    for (let i = 0; i < 6 && document.activeElement !== getContinueButton(); i += 1) {
      await user.tab();
    }
    expect(getContinueButton()).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(currentPath()).toBe('/check-answers');
  });
});
