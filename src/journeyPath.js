// The journey's questions, in order, and which answers mean not eligible.
// Check answers and the results page both use this, so they always agree on which
// questions count.
import { getAnswer } from './journeyAnswers';
import { FIRST_HOME } from './pages/MainResidencePage';
import { OWN } from './pages/OwnershipPage';
import { OUTSIDE_UK } from './pages/RegionPage';

// Each question is on the path only when the answer before it is eligible. So the path
// stops at the first answer that means not eligible.
// - `key` is the name the answer is saved under.
// - `labelKey`, `changeKey` and `reasonKey` name the question, the text that follows
//   "Change" for screen readers on check answers, and the "not eligible" reason, in the
//   translations.
// - `isEligible(answer)` says whether the user can carry on to the next question. Answers
//   are saved in English, so this works in either language.
const QUESTIONS = [
  {
    key: 'region',
    labelKey: 'regionQuestion',
    path: '/region',
    changeKey: 'changeRegion',
    isEligible: (answer) => answer !== OUTSIDE_UK,
    reasonKey: 'reasonRegion',
  },
  {
    key: 'ownership',
    labelKey: 'ownershipQuestion',
    path: '/ownership',
    changeKey: 'changeOwnership',
    isEligible: (answer) => answer === OWN,
    reasonKey: 'reasonOwnership',
  },
  {
    key: 'mainResidence',
    labelKey: 'mainResidenceQuestion',
    path: '/main-residence',
    changeKey: 'changeMainResidence',
    isEligible: (answer) => answer === FIRST_HOME,
    reasonKey: 'reasonMainResidence',
  },
  {
    key: 'builtBefore2000',
    labelKey: 'builtQuestion',
    path: '/built-before-2000',
    changeKey: 'changeBuilt',
    isEligible: (answer) => answer === 'Yes',
    reasonKey: 'reasonBuilt',
  },
  {
    key: 'epcRating',
    labelKey: 'epcQuestion',
    path: '/epc-rating',
    changeKey: 'changeEpc',
    isEligible: (answer) => !['A', 'B', 'C'].includes(answer),
    reasonKey: 'reasonEpc',
  },
];

// Works out the user's path from their saved answers. Returns:
// - `steps`: each question on the path with its answer, in order
// - `complete`: false if a question on the path is unanswered
// - `reasonKey`: the reason for the first "not eligible" answer, or null if every answer passes
// Answers to questions no longer on the path are kept, but left out here.
export function getPath() {
  const steps = [];
  for (const question of QUESTIONS) {
    const answer = getAnswer(question.key);
    if (!answer) return { steps, complete: false, reasonKey: null };
    steps.push({ ...question, answer });
    if (!question.isEligible(answer)) return { steps, complete: true, reasonKey: question.reasonKey };
  }
  return { steps, complete: true, reasonKey: null };
}
