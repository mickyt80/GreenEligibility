import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from '../components/BackLink';
import ErrorSummary from '../components/ErrorSummary';
import GovukButton from '../components/GovukButton';
import GovukRadios from '../components/GovukRadios';
import usePageTitle from '../hooks/usePageTitle';
import { getAnswer, saveAnswer } from '../journeyAnswers';

const QUESTION = 'In what region do you live?';
// The question and answers from Questions.md, used exactly.
const REGIONS = ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Outside of the UK'];
export const OUTSIDE_UK = 'Outside of the UK';
const ERROR_MESSAGE = 'Select the region where you live';

// The first question of the journey, following the design system's question page pattern.
export default function RegionPage() {
  const navigate = useNavigate();
  // Starts with the answer last continued with, if there is one.
  const [region, setRegion] = useState(() => getAnswer('region') ?? '');
  // Counts failed attempts, so the error summary is drawn afresh, and takes focus, each time.
  const [failedAttempts, setFailedAttempts] = useState(0);
  const hasError = failedAttempts > 0;

  usePageTitle(hasError ? `Error: ${QUESTION}` : QUESTION);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!region) {
      setFailedAttempts((count) => count + 1);
      return;
    }
    // Only kept once "Continue" is pressed, so leaving without continuing saves nothing.
    saveAnswer('region', region);
    navigate(region === OUTSIDE_UK ? '/result' : '/ownership');
  };

  return (
    <>
      <BackLink to="/" />
      {hasError && (
        <ErrorSummary key={failedAttempts} errors={[{ fieldId: 'region', message: ERROR_MESSAGE }]} />
      )}
      <form onSubmit={handleSubmit} noValidate>
        <GovukRadios
          name="region"
          question={QUESTION}
          options={REGIONS}
          value={region}
          onChange={setRegion}
          error={hasError ? ERROR_MESSAGE : undefined}
        />
        <GovukButton type="submit">Continue</GovukButton>
      </form>
    </>
  );
}
