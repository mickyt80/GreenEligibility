import { Navigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import { answersAccepted, getAnswer } from '../journeyAnswers';
import { OUTSIDE_UK } from './RegionPage';

const ELIGIBLE_HEADING = 'You are eligible for a Green Home Grant';
const NOT_ELIGIBLE_HEADING = 'You are not eligible for a Green Home Grant';

// The end of the journey. What it shows comes from the saved answers, so a refresh
// still shows the result. It is checked in this order:
// 1. Answers not accepted on the check answers page → the first page, without adding
//    the results page to the browser's history.
// 2. "Outside of the UK" → not eligible.
// 3. Any other region → eligible.
export default function ResultPage() {
  const accepted = answersAccepted();
  const eligible = getAnswer('region') !== OUTSIDE_UK;

  usePageTitle(eligible ? ELIGIBLE_HEADING : NOT_ELIGIBLE_HEADING);

  if (!accepted) {
    return <Navigate to="/" replace />;
  }

  if (!eligible) {
    return (
      <>
        <h1 className="govuk-heading-l">{NOT_ELIGIBLE_HEADING}</h1>
        <p className="govuk-body">The Green Home Grant is only available to people who live in the UK.</p>
      </>
    );
  }

  return (
    <div className="govuk-panel govuk-panel--confirmation">
      <h1 className="govuk-panel__title">{ELIGIBLE_HEADING}</h1>
    </div>
  );
}
