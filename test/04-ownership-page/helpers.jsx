import { screen, within } from '@testing-library/react';
import { getMain, getRadio, answerRegion } from '../03-check-answers/helpers';

export * from '../03-check-answers/helpers';

export const OWN = 'Own (with or without mortgage)';
export const RENTS = ['Rent from a private landlord', 'Rent from a housing association', 'Rent from the council'];
export const OWNERSHIP_ERROR = 'Select if you own or rent your property';
export const OWNERSHIP_LABEL = 'Do you own or rent your property?';
export const OWNERSHIP_ERROR_TITLE = `Error: ${OWNERSHIP_LABEL} – GOV.UK`;
export const CHANGE_OWNERSHIP_NAME = 'Change whether you own or rent your property';
export const OWN_HOME_REASON = 'The Green Home Grant is only available to people who own their home.';

export const getContinueButton = () => within(getMain()).getByRole('button', { name: 'Continue' });
export const getChangeOwnershipLink = () => screen.getByRole('link', { name: CHANGE_OWNERSHIP_NAME });
export const queryErrorSummary = () => document.querySelector('.govuk-error-summary');

// Chooses an ownership answer and presses "Continue", starting on /ownership.
export async function answerOwnership(user, answer) {
  await user.click(getRadio(answer));
  await user.click(getContinueButton());
}

// From /region, answers the region (a UK region) and continues to the ownership page.
export async function reachOwnership(user, region = 'England') {
  await answerRegion(user, region);
}

// From /region, answers both questions and ends on the check answers page.
export async function answerBoth(user, region, ownership) {
  await reachOwnership(user, region);
  await answerOwnership(user, ownership);
}
