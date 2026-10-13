import QuestionPage from '../components/QuestionPage';

export const MAIN_RESIDENCE_QUESTION = 'Is this your main residence or a secondary home?';
export const FIRST_HOME = 'First home';

// Asked only of people who own their home. "Secondary home" is not eligible, so it skips
// the remaining questions and goes straight to check answers.
export default function MainResidencePage() {
  return (
    <QuestionPage
      name="mainResidence"
      question={MAIN_RESIDENCE_QUESTION}
      options={[FIRST_HOME, 'Secondary home']}
      errorMessage="Select if this is your main residence or a secondary home"
      backTo="/ownership"
      nextPage={(answer) => (answer === FIRST_HOME ? '/built-before-2000' : '/check-answers')}
    />
  );
}
