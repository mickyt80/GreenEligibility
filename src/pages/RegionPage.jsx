import QuestionPage from '../components/QuestionPage';

export const OUTSIDE_UK = 'Outside of the UK';
// The question and answers from Questions.md, used exactly.
const REGIONS = ['England', 'Scotland', 'Wales', 'Northern Ireland', OUTSIDE_UK];

// The first question of the journey. Following route.md, "Outside of the UK" goes straight
// to check answers, which is always shown before the result; any other region goes on to
// the ownership question.
export default function RegionPage() {
  return (
    <QuestionPage
      name="region"
      questionKey="regionQuestion"
      options={REGIONS}
      errorKey="regionError"
      backTo="/"
      nextPage={(answer) => (answer === OUTSIDE_UK ? '/check-answers' : '/ownership')}
    />
  );
}
