// Plan step 2: the ownership row on check answers and the renters' result.
// Spec requirements 16–28.
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, within, waitFor, act } from '@testing-library/react';
import {
  renderApp,
  clearCookies,
  normalise,
  getMain,
  checkedLabels,
  answerRegion,
  refresh,
  UK_REGIONS,
  OUTSIDE_UK,
  OWNERSHIP_ANSWERS,
  RESULT_HEADING,
  RESULT_TITLE,
  RESULT_REASON,
  ELIGIBLE_HEADING,
  REGION_LABEL,
  getRows,
  getRowKey,
  getRowValue,
  getChangeLink,
  getAccept,
  OWN,
  RENTS,
  OWNERSHIP_LABEL,
  OWN_HOME_REASON,
  getChangeOwnershipLink,
  answerOwnership,
  answerPropertyQuestions,
  answerBoth,
} from './helpers';

const rowText = (row) => [normalise(getRowKey(row).textContent), normalise(getRowValue(row).textContent)];

// Answers both questions, then switches the region to "Outside of the UK" through "Change".
async function switchToOutsideUk(user, ownership) {
  await answerBoth(user, 'England', ownership);
  await user.click(getChangeLink());
  await answerRegion(user, OUTSIDE_UK);
}

beforeEach(() => {
  clearCookies();
  window.sessionStorage.clear();
  document.title = '';
});

describe('check answers', () => {
  // Changed by spec/05-property-questions: checked with a renter, who has only these two rows.
  // Owners' further rows are tested in test/05-property-questions/.
  it.each(UK_REGIONS)('shows the region row, then the ownership row, for "%s" (requirement 16)', async (region) => {
    const { user } = renderApp('/region');
    await answerBoth(user, region, RENTS[0]);
    const rows = getRows();
    expect(rows).toHaveLength(2);
    expect(rowText(rows[0])).toEqual([REGION_LABEL, region]);
    expect(rowText(rows[1])).toEqual([OWNERSHIP_LABEL, RENTS[0]]);
  });

  it.each(OWNERSHIP_ANSWERS)('shows "%s" in the ownership row (requirement 16)', async (answer) => {
    const { user } = renderApp('/region');
    await answerBoth(user, 'Wales', answer);
    expect(normalise(getRowValue(getRows()[1]).textContent)).toBe(answer);
  });

  // Changed by spec/05-property-questions: checked with a renter, who has only two rows.
  it('gives each row its own "Change" link, and no others (requirement 16)', async () => {
    const { user } = renderApp('/region');
    await answerBoth(user, 'Wales', RENTS[0]);
    const rows = getRows();
    expect(within(rows[0]).getByRole('link')).toBe(getChangeLink());
    expect(within(rows[1]).getByRole('link')).toBe(getChangeOwnershipLink());
    expect(within(getMain()).getAllByRole('link')).toHaveLength(2);
  });

  it('names the ownership link "Change whether you own or rent your property", showing only "Change" (requirement 17)', async () => {
    const { user } = renderApp('/region');
    await answerBoth(user, 'Wales', OWN);
    const link = getChangeOwnershipLink();
    const hidden = link.querySelector('.govuk-visually-hidden');
    expect(hidden).not.toBeNull();
    expect(normalise(link.textContent.replace(hidden.textContent, ''))).toBe('Change');
  });

  it(`shows only the region row for "${OUTSIDE_UK}", even after an ownership answer (requirement 18)`, async () => {
    const { user, currentPath } = renderApp('/region');
    await switchToOutsideUk(user, RENTS[2]);
    expect(currentPath()).toBe('/check-answers');
    const rows = getRows();
    expect(rows).toHaveLength(1);
    expect(rowText(rows[0])).toEqual([REGION_LABEL, OUTSIDE_UK]);
    expect(screen.queryByText(OWNERSHIP_LABEL)).not.toBeInTheDocument();
  });

  it('opens the ownership page with the answer selected from its "Change" link, and returns with the new answer (requirement 19)', async () => {
    const { user, currentPath } = renderApp('/region');
    await answerBoth(user, 'England', RENTS[0]);
    expect(getChangeOwnershipLink()).toHaveAttribute('href', '/ownership');
    await user.click(getChangeOwnershipLink());
    expect(currentPath()).toBe('/ownership');
    expect(checkedLabels()).toEqual([RENTS[0]]);
    await answerOwnership(user, OWN);
    // Changed by spec/05-property-questions: "Own" now goes on to /main-residence.
    expect(currentPath()).toBe('/main-residence');
    await answerPropertyQuestions(user);
    expect(currentPath()).toBe('/check-answers');
    expect(normalise(getRowValue(getRows()[1]).textContent)).toBe(OWN);
  });

  it('opens the first page from /check-answers with a UK region but no ownership answer (requirement 20)', async () => {
    const { user } = renderApp('/region');
    await answerRegion(user, 'England');
    const { currentPath } = refresh('/check-answers');
    await waitFor(() => expect(currentPath()).toBe('/'));
  });

  it('still opens the first page from /check-answers with no region answer (requirement 21)', async () => {
    const { currentPath } = renderApp('/check-answers');
    await waitFor(() => expect(currentPath()).toBe('/'));
  });
});

describe('the result', () => {
  it.each(UK_REGIONS)(`shows the "eligible" panel for "%s" and "${OWN}" (requirement 22)`, async (region) => {
    const { user } = renderApp('/region');
    await answerBoth(user, region, OWN);
    await user.click(getAccept());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(ELIGIBLE_HEADING);
  });

  it.each(RENTS)('shows "not eligible" with the home ownership reason for "%s" (requirement 23)', async (answer) => {
    const { user } = renderApp('/region');
    await answerBoth(user, 'Scotland', answer);
    await user.click(getAccept());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(RESULT_HEADING);
    expect(within(getMain()).getByText(OWN_HOME_REASON)).toBeInTheDocument();
    expect(screen.queryByText(ELIGIBLE_HEADING)).not.toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe(RESULT_TITLE));
  });

  it(`shows the UK reason for "${OUTSIDE_UK}", whatever the ownership answer (requirement 24)`, async () => {
    const { user } = renderApp('/region');
    await switchToOutsideUk(user, RENTS[1]);
    await user.click(getAccept());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(RESULT_HEADING);
    expect(within(getMain()).getByText(RESULT_REASON)).toBeInTheDocument();
    expect(screen.queryByText(OWN_HOME_REASON)).not.toBeInTheDocument();
  });

  it('shows only one reason, and no other text, links or buttons, for a renter (requirement 25)', async () => {
    const { user } = renderApp('/region');
    await answerBoth(user, 'Wales', RENTS[2]);
    await user.click(getAccept());
    const main = getMain();
    const withoutSpaces = (text) => text.replace(/\s/g, '');
    expect(withoutSpaces(main.textContent)).toBe(withoutSpaces(`${RESULT_HEADING} ${OWN_HOME_REASON}`));
    expect(within(main).queryAllByRole('link')).toHaveLength(0);
    expect(within(main).queryAllByRole('button')).toHaveLength(0);
  });

  it('opens the first page from /result before "Accept and continue", for a renter (requirement 26)', async () => {
    const { user } = renderApp('/region');
    await answerBoth(user, 'England', RENTS[0]);
    const { currentPath } = refresh('/result');
    await waitFor(() => expect(currentPath()).toBe('/'));
  });
});

describe('changing the region after answering ownership', () => {
  it(`shows only the UK reason after switching a renter to "${OUTSIDE_UK}" (requirement 27)`, async () => {
    const { user } = renderApp('/region');
    await switchToOutsideUk(user, RENTS[2]);
    expect(getRows()).toHaveLength(1);
    await user.click(getAccept());
    expect(within(getMain()).getByText(RESULT_REASON)).toBeInTheDocument();
    expect(screen.queryByText(OWN_HOME_REASON)).not.toBeInTheDocument();
  });

  it('shows the earlier ownership answer selected after switching back to a UK region (requirement 28)', async () => {
    const { user, currentPath, goBack } = renderApp('/region');
    await switchToOutsideUk(user, RENTS[2]);
    await user.click(getAccept());
    act(() => goBack());
    await user.click(getChangeLink());
    await answerRegion(user, 'England');
    expect(currentPath()).toBe('/ownership');
    expect(checkedLabels()).toEqual([RENTS[2]]);
  });
});
