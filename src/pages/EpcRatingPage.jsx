import QuestionPage from '../components/QuestionPage';

export const EPC_QUESTION = "What is your home's EPC rating?";
export const NOT_KNOWN = 'Not known';

// The last question, asked only of people whose home was built before 2000.
// Every answer goes to check answers.
export default function EpcRatingPage() {
  return (
    <QuestionPage
      name="epcRating"
      question={EPC_QUESTION}
      options={['A', 'B', 'C', 'D', 'E', 'F', 'G', NOT_KNOWN]}
      errorMessage="Select your home's EPC rating, or select Not known"
      backTo="/built-before-2000"
      nextPage={() => '/check-answers'}
      dividerBefore={NOT_KNOWN}
    />
  );
}
