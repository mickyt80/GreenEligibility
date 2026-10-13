import QuestionPage from '../components/QuestionPage';

export const NOT_KNOWN = 'Not known';

// The last question, asked only of people whose home was built before 2000.
// Every answer goes to check answers. "Not known" can't be assessed, so the result says the
// user may be eligible and points them to where they can find their rating.
export default function EpcRatingPage() {
  return (
    <QuestionPage
      name="epcRating"
      questionKey="epcQuestion"
      options={['A', 'B', 'C', 'D', 'E', 'F', 'G', NOT_KNOWN]}
      errorKey="epcError"
      backTo="/built-before-2000"
      nextPage={() => '/check-answers'}
      dividerBefore={NOT_KNOWN}
    />
  );
}
