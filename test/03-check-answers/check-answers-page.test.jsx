// Plan step 1: the new journey and the check answers page.
// Spec requirements 1–19 and 29.
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, within, waitFor } from '@testing-library/react';
import {
  renderApp,
  clearCookies,
  normalise,
  comesBefore,
  getMain,
  getRadio,
  queryBackLink,
  checkedLabels,
  answerRegion,
  refresh,
  REGION_QUESTION,
  REGION_TITLE,
  UK_REGIONS,
  OUTSIDE_UK,
  OWNERSHIP_ANSWERS,
  CHECK_HEADING,
  CHECK_TITLE,
  REGION_LABEL,
  getRows,
  getRowKey,
  getRowValue,
  getChangeLink,
  getAccept,
  getOwnershipContinue,
  reachCheckAnswers,
} from './helpers';

beforeEach(() => {
  clearCookies();
  window.sessionStorage.clear();
  document.title = '';
});

describe('the journey', () => {
  it.each(UK_REGIONS)('opens the ownership page after "%s" (requirement 1)', async (region) => {
    const { user, currentPath } = renderApp('/region');
    await answerRegion(user, region);
    expect(currentPath()).toBe('/ownership');
  });

  it(`opens the check answers page, not the results page, after "${OUTSIDE_UK}" (requirement 2)`, async () => {
    const { user, currentPath } = renderApp('/region');
    await answerRegion(user, OUTSIDE_UK);
    expect(currentPath()).toBe('/check-answers');
  });

  it('shows a green "Continue" button under the ownership page’s answers (requirement 3)', () => {
    renderApp('/ownership');
    const button = getOwnershipContinue();
    expect(button).toHaveClass('govuk-button');
    expect(button).not.toHaveClass('govuk-button--secondary', 'govuk-button--warning');
    expect(comesBefore(getRadio(OWNERSHIP_ANSWERS[3]), button)).toBe(true);
  });

  // Changed by spec/04-ownership-page: "Continue" with no ownership answer now shows an
  // error, and the answer is kept and shown. See test/04-ownership-page/.

  it('opens the check answers page from the ownership page’s "Continue", with an ownership answer selected (requirement 4)', async () => {
    const { user, currentPath } = renderApp('/region');
    await answerRegion(user, 'Wales');
    await user.click(getRadio('Rent from the council'));
    await user.click(getOwnershipContinue());
    expect(currentPath()).toBe('/check-answers');
  });

});

describe('the check answers page', () => {
  it(`has the tab title "${CHECK_TITLE}" (requirement 6)`, async () => {
    const { user } = renderApp('/region');
    await reachCheckAnswers(user, 'England');
    await waitFor(() => expect(document.title).toBe(CHECK_TITLE));
  });

  it(`has the heading "${CHECK_HEADING}" (requirement 7)`, async () => {
    const { user } = renderApp('/region');
    await reachCheckAnswers(user, 'England');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(CHECK_HEADING);
  });

  it.each([...UK_REGIONS, OUTSIDE_UK])(
    // Changed by spec/04-ownership-page: a UK region also has an ownership row, after this one.
    'shows the region row first, with the label, the answer "%s" and a "Change" link (requirement 8)',
    async (region) => {
      const { user } = renderApp('/region');
      await reachCheckAnswers(user, region);
      const rows = getRows();
      // Since spec/05-property-questions, an owner in the UK has five rows.
      expect(rows).toHaveLength(region === OUTSIDE_UK ? 1 : 5);
      expect(normalise(getRowKey(rows[0]).textContent)).toBe(REGION_LABEL);
      expect(normalise(getRowValue(rows[0]).textContent)).toBe(region);
      expect(within(rows[0]).getByRole('link')).toBe(getChangeLink());
      expect(comesBefore(screen.getByRole('heading', { level: 1 }), rows[0])).toBe(true);
    }
  );

  it('names the link "Change in what region do you live?" for screen readers, showing only "Change" (requirement 9)', async () => {
    const { user } = renderApp('/region');
    await reachCheckAnswers(user, 'Scotland');
    const link = getChangeLink();
    const hidden = link.querySelector('.govuk-visually-hidden');
    expect(hidden).not.toBeNull();
    expect(normalise(link.textContent.replace(hidden.textContent, ''))).toBe('Change');
  });

  it('has no "Back" link (requirement 10)', async () => {
    const { user } = renderApp('/region');
    await reachCheckAnswers(user, 'Scotland');
    expect(queryBackLink()).toBeNull();
  });

  it('shows a green "Accept and continue" button under the list (requirement 11)', async () => {
    const { user } = renderApp('/region');
    await reachCheckAnswers(user, 'Scotland');
    const button = getAccept();
    expect(button).toHaveClass('govuk-button');
    expect(button).not.toHaveClass('govuk-button--secondary', 'govuk-button--warning');
    expect(comesBefore(getRows()[0], button)).toBe(true);
  });

  // Changed by spec/04-ownership-page: checked with "Outside of the UK", which has only the
  // region row. The UK regions' second row is tested in test/04-ownership-page/.
  it('shows no other rows, form fields, links or buttons (requirement 12)', async () => {
    const { user } = renderApp('/region');
    await reachCheckAnswers(user, OUTSIDE_UK);
    const main = getMain();
    expect(getRows()).toHaveLength(1);
    expect(main.querySelectorAll('input, select, textarea')).toHaveLength(0);
    expect(within(main).getAllByRole('link')).toEqual([getChangeLink()]);
    expect(within(main).getAllByRole('button')).toEqual([getAccept()]);
  });

  it('shows the same answer after a refresh (requirement 13)', async () => {
    const { user } = renderApp('/region');
    await reachCheckAnswers(user, 'Northern Ireland');
    const { currentPath } = refresh('/check-answers');
    expect(currentPath()).toBe('/check-answers');
    expect(normalise(getRowValue(getRows()[0]).textContent)).toBe('Northern Ireland');
  });

  it('opens the first page when /check-answers is opened with no region answer (requirement 14)', async () => {
    const { currentPath } = renderApp('/check-answers');
    await waitFor(() => expect(currentPath()).toBe('/'));
    expect(screen.queryByText(CHECK_HEADING)).not.toBeInTheDocument();
  });
});

describe('changing the region answer', () => {
  it('opens the region page with the current answer selected when "Change" is clicked (requirement 15)', async () => {
    const { user, currentPath } = renderApp('/region');
    await reachCheckAnswers(user, OUTSIDE_UK);
    expect(getChangeLink()).toHaveAttribute('href', '/region');
    await user.click(getChangeLink());
    expect(currentPath()).toBe('/region');
    expect(checkedLabels()).toEqual([OUTSIDE_UK]);
  });

  it('shows the region page as it is the first time through (requirement 16)', async () => {
    const { user } = renderApp('/region');
    await reachCheckAnswers(user, 'Wales');
    await user.click(getChangeLink());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(REGION_QUESTION);
    expect(queryBackLink()).not.toBeNull();
    await waitFor(() => expect(document.title).toBe(REGION_TITLE));
  });

  it('still opens the first page from the region page’s "Back" link after "Change" (requirement 17)', async () => {
    const { user, currentPath } = renderApp('/region');
    await reachCheckAnswers(user, 'Wales');
    await user.click(getChangeLink());
    await user.click(queryBackLink());
    expect(currentPath()).toBe('/');
  });

  it('goes through the ownership page to check answers after changing to a UK region (requirement 18)', async () => {
    const { user, currentPath } = renderApp('/region');
    await reachCheckAnswers(user, OUTSIDE_UK);
    await user.click(getChangeLink());
    await answerRegion(user, 'Scotland');
    expect(currentPath()).toBe('/ownership');
    // Since spec/05-property-questions, "Own" also answers the property questions on the way.
    for (const answer of ['Own (with or without mortgage)', 'First home', 'Yes', 'D']) {
      await user.click(getRadio(answer));
      await user.click(getOwnershipContinue());
    }
    expect(currentPath()).toBe('/check-answers');
    expect(normalise(getRowValue(getRows()[0]).textContent)).toBe('Scotland');
  });

  it(`goes straight to check answers after changing to "${OUTSIDE_UK}" (requirement 19)`, async () => {
    const { user, currentPath } = renderApp('/region');
    await reachCheckAnswers(user, 'England');
    await user.click(getChangeLink());
    await answerRegion(user, OUTSIDE_UK);
    expect(currentPath()).toBe('/check-answers');
    expect(normalise(getRowValue(getRows()[0]).textContent)).toBe(OUTSIDE_UK);
  });
});

describe('using a keyboard (requirement 29)', () => {
  // Checked with "Outside of the UK", which has only one "Change" link (spec/04-ownership-page).
  it('moves from "Change" to "Accept and continue" with Tab', async () => {
    const { user } = renderApp('/region');
    await reachCheckAnswers(user, OUTSIDE_UK);
    getChangeLink().focus();
    await user.tab();
    expect(getAccept()).toHaveFocus();
  });

  it('opens the region page when Enter is pressed on "Change"', async () => {
    const { user, currentPath } = renderApp('/region');
    await reachCheckAnswers(user, 'England');
    getChangeLink().focus();
    await user.keyboard('{Enter}');
    expect(currentPath()).toBe('/region');
  });

  it('opens the results page when Enter is pressed on "Accept and continue"', async () => {
    const { user, currentPath } = renderApp('/region');
    await reachCheckAnswers(user, 'England');
    getAccept().focus();
    await user.keyboard('{Enter}');
    expect(currentPath()).toBe('/result');
  });
});
