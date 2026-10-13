import QuestionPage from '../components/QuestionPage';

export const BUILT_QUESTION = 'Was your property built before the year 2000?';

// Asked only of people whose home is their main residence. "No" is not eligible, so it skips
// the EPC question and goes straight to check answers.
export default function BuiltBefore2000Page() {
  return (
    <QuestionPage
      name="builtBefore2000"
      question={BUILT_QUESTION}
      options={['Yes', 'No']}
      errorMessage="Select yes if your property was built before the year 2000"
      backTo="/main-residence"
      nextPage={(answer) => (answer === 'Yes' ? '/epc-rating' : '/check-answers')}
      inline
    />
  );
}
