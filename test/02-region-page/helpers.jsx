import { screen, cleanup, within } from '@testing-library/react';
import { renderApp } from '../01-start-page/helpers';

export {
  renderApp,
  clearCookies,
  normalise,
  comesBefore,
  SERVICE_TITLE,
} from '../01-start-page/helpers';

export const REGION_QUESTION = 'In what region do you live?';
export const REGION_TITLE = `${REGION_QUESTION} – GOV.UK`;
export const REGION_ERROR_TITLE = `Error: ${REGION_QUESTION} – GOV.UK`;
export const REGIONS = ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Outside of the UK'];
export const UK_REGIONS = REGIONS.slice(0, 4);
export const OUTSIDE_UK = 'Outside of the UK';
export const REGION_ERROR = 'Select the region where you live';

export const OWNERSHIP_QUESTION = 'Do you own or rent your property?';
export const OWNERSHIP_TITLE = `${OWNERSHIP_QUESTION} – GOV.UK`;
export const OWNERSHIP_ANSWERS = [
  'Own (with or without mortgage)',
  'Rent from a private landlord',
  'Rent from a housing association',
  'Rent from the council',
];

export const RESULT_HEADING = 'You are not eligible for a Green Home Grant';
export const RESULT_TITLE = `${RESULT_HEADING} – GOV.UK`;
export const RESULT_REASON = 'The Green Home Grant is only available to people who live in the UK.';

export const getMain = () => screen.getByRole('main');
export const getRadio = (label) => screen.getByRole('radio', { name: label });
export const getRadios = () => within(getMain()).queryAllByRole('radio');
export const getContinue = () => screen.getByRole('button', { name: 'Continue' });
// The "Back" link sits at the top of the page, before the main content, on the same row as
// the language navigation.
export const queryBackLink = () => screen.queryByRole('link', { name: 'Back' });
export const checkedLabels = () =>
  getRadios()
    .filter((radio) => radio.checked)
    .map((radio) => normaliseLabel(radio));

const normaliseLabel = (radio) => radio.labels[0].textContent.replace(/\s+/g, ' ').trim();

// Answers the region question and presses "Continue", starting from /region.
export async function answerRegion(user, region) {
  await user.click(getRadio(region));
  await user.click(getContinue());
}

// Like refreshing the browser: the page is drawn again from scratch, but the tab's
// session storage is kept.
export function refresh(path) {
  cleanup();
  return renderApp(path);
}

// Like closing the tab and opening the service in a new one: session storage is lost.
export function newTab(path) {
  cleanup();
  window.sessionStorage.clear();
  return renderApp(path);
}
