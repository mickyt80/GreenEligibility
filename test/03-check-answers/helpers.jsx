import { screen, within } from '@testing-library/react';
import { getMain, answerRegion } from '../02-region-page/helpers';

export * from '../02-region-page/helpers';

export const CHECK_HEADING = 'Check your answers';
export const CHECK_TITLE = `${CHECK_HEADING} – GOV.UK`;
export const REGION_LABEL = 'In what region do you live?';
export const CHANGE_REGION_NAME = 'Change in what region do you live?';
export const ACCEPT_TEXT = 'Accept and continue';

export const ELIGIBLE_HEADING = 'You are eligible for a Green Home Grant';
export const ELIGIBLE_TITLE = `${ELIGIBLE_HEADING} – GOV.UK`;

export const getRows = () => getMain().querySelectorAll('.govuk-summary-list__row');
export const getRowKey = (row) => row.querySelector('.govuk-summary-list__key');
export const getRowValue = (row) => row.querySelector('.govuk-summary-list__value');
export const getChangeLink = () => screen.getByRole('link', { name: CHANGE_REGION_NAME });
export const getAccept = () => within(getMain()).getByRole('button', { name: ACCEPT_TEXT });
export const getOwnershipContinue = () => within(getMain()).getByRole('button', { name: 'Continue' });

// Answers the region question from /region and, for a UK region, answers "Own (with or
// without mortgage)" on the ownership page too, so the user ends on the check answers page.
// (The ownership page needs an answer since spec/04-ownership-page. Since
// spec/05-property-questions, owners also answer "First home", "Yes" and "D" on the way.)
export async function reachCheckAnswers(user, region) {
  await answerRegion(user, region);
  if (region !== 'Outside of the UK') {
    for (const answer of ['Own (with or without mortgage)', 'First home', 'Yes', 'D']) {
      await user.click(screen.getByRole('radio', { name: answer }));
      await user.click(getOwnershipContinue());
    }
  }
}
