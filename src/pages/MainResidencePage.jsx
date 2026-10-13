import QuestionPage from '../components/QuestionPage';

export const FIRST_HOME = 'First home';

// Asked only of people who own their home. "Secondary home" is not eligible, so it skips
// the remaining questions and goes straight to check answers.
export default function MainResidencePage() {
  return (
    <QuestionPage
      name="mainResidence"
      questionKey="mainResidenceQuestion"
      options={[FIRST_HOME, 'Secondary home']}
      errorKey="mainResidenceError"
      backTo="/ownership"
      nextPage={(answer) => (answer === FIRST_HOME ? '/built-before-2000' : '/check-answers')}
    />
  );
}
