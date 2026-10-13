import QuestionPage from '../components/QuestionPage';

// Asked only of people whose home is their main residence. "No" is not eligible, so it skips
// the EPC question and goes straight to check answers.
export default function BuiltBefore2000Page() {
  return (
    <QuestionPage
      name="builtBefore2000"
      questionKey="builtQuestion"
      options={['Yes', 'No']}
      errorKey="builtError"
      backTo="/main-residence"
      nextPage={(answer) => (answer === 'Yes' ? '/epc-rating' : '/check-answers')}
      inline
    />
  );
}
