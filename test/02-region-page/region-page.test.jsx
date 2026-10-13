// Plan step 1: the region page's question, error and routing.
// Spec requirements 1–20, 29, 37, 38, 44 and 45.
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
  getContinue,
  queryBackLink,
  checkedLabels,
  answerRegion,
  REGION_QUESTION,
  REGION_TITLE,
  REGION_ERROR_TITLE,
  REGIONS,
  UK_REGIONS,
  OUTSIDE_UK,
  REGION_ERROR,
} from './helpers';

const queryErrorSummary = () => document.querySelector('.govuk-error-summary');

beforeEach(() => {
  clearCookies();
  window.sessionStorage.clear();
  document.title = '';
});

describe('reaching the region page', () => {
  it('opens /region from "Check your eligibility" (requirement 1)', async () => {
    const { user, currentPath } = renderApp('/');
    await user.click(screen.getByText('Check your eligibility'));
    expect(currentPath()).toBe('/region');
    expect(screen.getByRole('heading', { level: 1, name: REGION_QUESTION })).toBeInTheDocument();
  });

  it('shows the region page, with no answer selected, when /region is opened directly (requirement 2)', () => {
    renderApp('/region');
    expect(screen.getByRole('heading', { level: 1, name: REGION_QUESTION })).toBeInTheDocument();
    expect(checkedLabels()).toEqual([]);
    expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();
  });
});

describe('the region page', () => {
  it('shows the GOV.UK header and footer (requirement 3)', () => {
    renderApp('/region');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it(`has the tab title "${REGION_TITLE}" (requirement 4)`, async () => {
    renderApp('/region');
    await waitFor(() => expect(document.title).toBe(REGION_TITLE));
  });

  it('shows a "Back" link above the question (requirement 5)', () => {
    renderApp('/region');
    const back = queryBackLink();
    expect(back).not.toBeNull();
    expect(back).toHaveClass('govuk-back-link');
    expect(comesBefore(back, screen.getByRole('heading', { level: 1 }))).toBe(true);
  });

  it(`has the heading "${REGION_QUESTION}", which labels the answers (requirement 6)`, () => {
    renderApp('/region');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(REGION_QUESTION);
    expect(screen.getByRole('group', { name: REGION_QUESTION })).toBeInTheDocument();
  });

  it('shows the five answers as radio buttons, in order and labelled exactly (requirement 7)', () => {
    renderApp('/region');
    const labels = getRadios().map((radio) => normalise(radio.labels[0].textContent));
    expect(labels).toEqual(REGIONS);
  });

  it('has no answer selected when it first opens (requirement 8)', () => {
    renderApp('/region');
    expect(checkedLabels()).toEqual([]);
  });

  it('lets only one answer be selected at a time (requirement 9)', async () => {
    const { user } = renderApp('/region');
    await user.click(getRadio('England'));
    await user.click(getRadio('Wales'));
    expect(checkedLabels()).toEqual(['Wales']);
  });

  it('selects an answer when its label text is clicked (requirement 10)', async () => {
    const { user } = renderApp('/region');
    await user.click(screen.getByText('Northern Ireland'));
    expect(getRadio('Northern Ireland')).toBeChecked();
  });

  it('shows a green GOV.UK "Continue" button under the answers (requirement 11)', () => {
    renderApp('/region');
    const button = getContinue();
    expect(button).toHaveClass('govuk-button');
    expect(button).not.toHaveClass('govuk-button--secondary', 'govuk-button--warning');
    expect(comesBefore(getRadio(OUTSIDE_UK), button)).toBe(true);
  });

  it('has no other questions, form fields or buttons (requirement 12)', () => {
    renderApp('/region');
    const main = getMain();
    expect(main.querySelectorAll('input')).toHaveLength(5);
    expect(main.querySelectorAll('select, textarea')).toHaveLength(0);
    expect(main.querySelectorAll('fieldset')).toHaveLength(1);
    expect(within(main).getAllByRole('button')).toEqual([getContinue()]);
    expect(within(main).getAllByRole('link')).toEqual([queryBackLink()]);
  });
});

describe('no answer chosen', () => {
  it('keeps the user on /region when "Continue" is clicked with nothing selected (requirement 13)', async () => {
    const { user, currentPath } = renderApp('/region');
    await user.click(getContinue());
    expect(currentPath()).toBe('/region');
  });

  it('shows "There is a problem" with a link reading the error, below the Back link and above the heading (requirement 14)', async () => {
    const { user } = renderApp('/region');
    expect(queryErrorSummary()).toBeNull();
    await user.click(getContinue());
    const summary = queryErrorSummary();
    expect(summary).not.toBeNull();
    expect(within(summary).getByRole('heading', { name: 'There is a problem' })).toBeInTheDocument();
    expect(within(summary).getByRole('link', { name: REGION_ERROR })).toBeInTheDocument();
    expect(comesBefore(queryBackLink(), summary)).toBe(true);
    expect(comesBefore(summary, screen.getByRole('heading', { level: 1 }))).toBe(true);
  });

  it('focuses the error summary straight away (requirement 15)', async () => {
    const { user } = renderApp('/region');
    await user.click(getContinue());
    await waitFor(() => expect(queryErrorSummary()).toHaveFocus());
  });

  it('moves focus to "England" when the error summary’s link is clicked (requirement 16)', async () => {
    const { user } = renderApp('/region');
    await user.click(getContinue());
    await user.click(within(queryErrorSummary()).getByRole('link', { name: REGION_ERROR }));
    expect(getRadio('England')).toHaveFocus();
  });

  it('shows the error message above the answers and marks the question as having an error (requirement 17)', async () => {
    const { user } = renderApp('/region');
    await user.click(getContinue());
    const message = getMain().querySelector('.govuk-error-message');
    expect(message).not.toBeNull();
    expect(normalise(message.textContent)).toMatch(new RegExp(`${REGION_ERROR}$`));
    expect(comesBefore(message, getRadio('England'))).toBe(true);
    expect(message.closest('.govuk-form-group')).toHaveClass('govuk-form-group--error');
  });

  it(`changes the tab title to "${REGION_ERROR_TITLE}" (requirement 18)`, async () => {
    const { user } = renderApp('/region');
    await user.click(getContinue());
    await waitFor(() => expect(document.title).toBe(REGION_ERROR_TITLE));
  });

  it('moves on once an answer is selected and "Continue" is clicked (requirement 19)', async () => {
    const { user, currentPath } = renderApp('/region');
    await user.click(getContinue());
    await answerRegion(user, 'Scotland');
    expect(currentPath()).toBe('/ownership');
  });
});

describe('where each answer leads', () => {
  it.each(UK_REGIONS)('opens /ownership after "%s" (requirement 20)', async (region) => {
    const { user, currentPath } = renderApp('/region');
    await answerRegion(user, region);
    expect(currentPath()).toBe('/ownership');
  });

  // Changed by spec/03-check-answers: check answers is always shown before the result.
  it(`opens /check-answers after "${OUTSIDE_UK}" (requirement 29)`, async () => {
    const { user, currentPath } = renderApp('/region');
    await answerRegion(user, OUTSIDE_UK);
    expect(currentPath()).toBe('/check-answers');
  });
});

describe('going back from the region page', () => {
  it('opens the first page when the "Back" link is clicked (requirement 37)', async () => {
    const { user, currentPath } = renderApp('/region');
    await user.click(queryBackLink());
    expect(currentPath()).toBe('/');
  });

  it('returns to the first page with the browser’s Back button (requirement 38)', async () => {
    const { user, currentPath, goBack } = renderApp('/');
    await user.click(screen.getByText('Check your eligibility'));
    act(() => goBack());
    expect(currentPath()).toBe('/');
  });
});

describe('using a keyboard', () => {
  it('moves from the "Back" link to the answers with Tab, and selects one with the keyboard (requirement 44)', async () => {
    const { user } = renderApp('/region');
    queryBackLink().focus();
    await user.tab();
    expect(getRadio('England')).toHaveFocus();
    await user.keyboard(' ');
    expect(getRadio('England')).toBeChecked();
  });

  it('reaches "Continue" with Tab, and pressing Enter on it continues (requirement 45)', async () => {
    const { user, currentPath } = renderApp('/region');
    await user.click(getRadio(OUTSIDE_UK));
    for (let i = 0; i < 6 && document.activeElement !== getContinue(); i += 1) {
      await user.tab();
    }
    expect(getContinue()).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(currentPath()).toBe('/check-answers');
  });
});
