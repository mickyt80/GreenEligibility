import { screen, within } from '@testing-library/react';
import { getMain, getRadio, answerRegion, answerOwnership, OWN } from '../04-ownership-page/helpers';

export * from '../04-ownership-page/helpers';

export const FIRST_HOME = 'First home';
export const SECONDARY_HOME = 'Secondary home';
export const EPC_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
export const NOT_KNOWN = 'Not known';
// "Not known" gives "You may be eligible" instead; see test/07-epc-not-known/.
export const ELIGIBLE_EPC = ['D', 'E', 'F', 'G'];
export const NOT_ELIGIBLE_EPC = ['A', 'B', 'C'];

export const MAIN_RESIDENCE = {
  path: '/main-residence',
  question: 'Is this your main residence or a secondary home?',
  answers: [FIRST_HOME, SECONDARY_HOME],
  error: 'Select if this is your main residence or a secondary home',
  back: '/ownership',
  changeName: 'Change whether this is your main residence or a secondary home',
  reason: 'The Green Home Grant is only available for your main residence.',
};

export const BUILT = {
  path: '/built-before-2000',
  question: 'Was your property built before the year 2000?',
  answers: ['Yes', 'No'],
  error: 'Select yes if your property was built before the year 2000',
  back: '/main-residence',
  changeName: 'Change whether your property was built before the year 2000',
  reason: 'The Green Home Grant is only available for properties built before the year 2000.',
};

export const EPC = {
  path: '/epc-rating',
  question: "What is your home's EPC rating?",
  answers: [...EPC_LETTERS, NOT_KNOWN],
  error: "Select your home's EPC rating, or select Not known",
  back: '/built-before-2000',
  changeName: "Change your home's EPC rating",
  reason: 'The Green Home Grant is only available for properties with an EPC rating of D or below.',
};

export const NEW_PAGES = [MAIN_RESIDENCE, BUILT, EPC];

export const getContinueOnPage = () => within(getMain()).getByRole('button', { name: 'Continue' });

// Chooses an answer on the current question page and presses "Continue".
export async function answerPage(user, answer) {
  await user.click(getRadio(answer));
  await user.click(getContinueOnPage());
}

// From /region, answers each question in turn. Leave out later answers to stop early:
// for example { region: 'England', ownership: OWN } ends on /main-residence.
export async function answerPath(user, { region = 'England', ownership, residence, built, epc } = {}) {
  await answerRegion(user, region);
  if (ownership) await answerOwnership(user, ownership);
  if (residence) await answerPage(user, residence);
  if (built) await answerPage(user, built);
  if (epc) await answerPage(user, epc);
}

// The answers that lead from /region to each new page.
export const ANSWERS_TO_REACH = {
  [MAIN_RESIDENCE.path]: { ownership: OWN },
  [BUILT.path]: { ownership: OWN, residence: FIRST_HOME },
  [EPC.path]: { ownership: OWN, residence: FIRST_HOME, built: 'Yes' },
};

// A full path that ends on check answers and is eligible.
export const ELIGIBLE_PATH = { region: 'England', ownership: OWN, residence: FIRST_HOME, built: 'Yes', epc: 'D' };

export const getLink = (name) => screen.getByRole('link', { name });
