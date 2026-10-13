// The journey's questions, in order, and which answers mean not eligible.
// Check answers and the results page both use this, so they always agree on which
// questions count.
import { getAnswer } from './journeyAnswers';
import { MAIN_RESIDENCE_QUESTION, FIRST_HOME } from './pages/MainResidencePage';
import { BUILT_QUESTION } from './pages/BuiltBefore2000Page';
import { EPC_QUESTION } from './pages/EpcRatingPage';
import { OWNERSHIP_QUESTION, OWN } from './pages/OwnershipPage';
import { OUTSIDE_UK } from './pages/RegionPage';

// Each question is on the path only when the answer before it is eligible. So the path
// stops at the first answer that means not eligible.
// - `key` is the name the answer is saved under.
// - `changeText` follows "Change" for screen readers on check answers.
// - `isEligible(answer)` says whether the user can carry on to the next question.
const QUESTIONS = [
  {
    key: 'region',
    label: 'In what region do you live?',
    path: '/region',
    changeText: 'in what region do you live?',
    isEligible: (answer) => answer !== OUTSIDE_UK,
    reason: 'The Green Home Grant is only available to people who live in the UK.',
  },
  {
    key: 'ownership',
    label: OWNERSHIP_QUESTION,
    path: '/ownership',
    changeText: 'whether you own or rent your property',
    isEligible: (answer) => answer === OWN,
    reason: 'The Green Home Grant is only available to people who own their home.',
  },
  {
    key: 'mainResidence',
    label: MAIN_RESIDENCE_QUESTION,
    path: '/main-residence',
    changeText: 'whether this is your main residence or a secondary home',
    isEligible: (answer) => answer === FIRST_HOME,
    reason: 'The Green Home Grant is only available for your main residence.',
  },
  {
    key: 'builtBefore2000',
    label: BUILT_QUESTION,
    path: '/built-before-2000',
    changeText: 'whether your property was built before the year 2000',
    isEligible: (answer) => answer === 'Yes',
    reason: 'The Green Home Grant is only available for properties built before the year 2000.',
  },
  {
    key: 'epcRating',
    label: EPC_QUESTION,
    path: '/epc-rating',
    changeText: "your home's EPC rating",
    isEligible: (answer) => !['A', 'B', 'C'].includes(answer),
    reason: 'The Green Home Grant is only available for properties with an EPC rating of D or below.',
  },
];

// Works out the user's path from their saved answers. Returns:
// - `steps`: each question on the path with its answer, in order
// - `complete`: false if a question on the path is unanswered
// - `reason`: the reason for the first "not eligible" answer, or null if every answer passes
// Answers to questions no longer on the path are kept, but left out here.
export function getPath() {
  const steps = [];
  for (const question of QUESTIONS) {
    const answer = getAnswer(question.key);
    if (!answer) return { steps, complete: false, reason: null };
    steps.push({ ...question, answer });
    if (!question.isEligible(answer)) return { steps, complete: true, reason: question.reason };
  }
  return { steps, complete: true, reason: null };
}
