import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from '../components/BackLink';
import ErrorSummary from '../components/ErrorSummary';
import GovukButton from '../components/GovukButton';
import GovukRadios from '../components/GovukRadios';
import usePageTitle from '../hooks/usePageTitle';
import { getAnswer, saveAnswer } from '../journeyAnswers';

export const OWNERSHIP_QUESTION = 'Do you own or rent your property?';
export const OWN = 'Own (with or without mortgage)';
const ANSWERS = [
  OWN,
  'Rent from a private landlord',
  'Rent from a housing association',
  'Rent from the council',
];
const ERROR_MESSAGE = 'Select if you own or rent your property';

// The question after the region page, following the design system's question page pattern.
// Every answer goes on to check answers, as set out in route.md.
export default function OwnershipPage() {
  const navigate = useNavigate();
  // Starts with the answer last continued with, if there is one.
  const [ownership, setOwnership] = useState(() => getAnswer('ownership') ?? '');
  // Counts failed attempts, so the error summary is drawn afresh, and takes focus, each time.
  const [failedAttempts, setFailedAttempts] = useState(0);
  const hasError = failedAttempts > 0;

  usePageTitle(hasError ? `Error: ${OWNERSHIP_QUESTION}` : OWNERSHIP_QUESTION);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!ownership) {
      setFailedAttempts((count) => count + 1);
      return;
    }
    // Only kept once "Continue" is pressed. Saving also undoes an earlier "Accept and continue".
    saveAnswer('ownership', ownership);
    navigate('/check-answers');
  };

  return (
    <>
      <BackLink to="/region" />
      {hasError && (
        <ErrorSummary key={failedAttempts} errors={[{ fieldId: 'ownership', message: ERROR_MESSAGE }]} />
      )}
      <form onSubmit={handleSubmit} noValidate>
        <GovukRadios
          name="ownership"
          question={OWNERSHIP_QUESTION}
          options={ANSWERS}
          value={ownership}
          onChange={setOwnership}
          error={hasError ? ERROR_MESSAGE : undefined}
        />
        <GovukButton type="submit">Continue</GovukButton>
      </form>
    </>
  );
}
