import { Navigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import { answersAccepted, getAnswer } from '../journeyAnswers';
import { OWN } from './OwnershipPage';
import { OUTSIDE_UK } from './RegionPage';

const ELIGIBLE_HEADING = 'You are eligible for a Green Home Grant';
const NOT_ELIGIBLE_HEADING = 'You are not eligible for a Green Home Grant';
const OUTSIDE_UK_REASON = 'The Green Home Grant is only available to people who live in the UK.';
const RENTING_REASON = 'The Green Home Grant is only available to people who own their home.';

// Works out what the results page shows from the saved answers, checked in this order:
// 1. Answers not accepted on the check answers page → the first page.
// 2. "Outside of the UK" → not eligible, with the UK reason, whatever the ownership answer.
// 3. No ownership answer → the first page.
// 4. Any "Rent" answer → not eligible, with the home ownership reason.
// 5. "Own (with or without mortgage)" → eligible.
// Only one reason is ever shown.
function decideResult() {
  if (!answersAccepted()) return { redirect: true };
  if (getAnswer('region') === OUTSIDE_UK) return { reason: OUTSIDE_UK_REASON };
  const ownership = getAnswer('ownership');
  if (!ownership) return { redirect: true };
  if (ownership !== OWN) return { reason: RENTING_REASON };
  return { eligible: true };
}

// The end of the journey. What it shows comes from the saved answers, so a refresh still
// shows the result. Redirects don't add the results page to the browser's history.
export default function ResultPage() {
  const result = decideResult();

  usePageTitle(result.eligible ? ELIGIBLE_HEADING : NOT_ELIGIBLE_HEADING);

  if (result.redirect) {
    return <Navigate to="/" replace />;
  }

  if (result.reason) {
    return (
      <>
        <h1 className="govuk-heading-l">{NOT_ELIGIBLE_HEADING}</h1>
        <p className="govuk-body">{result.reason}</p>
      </>
    );
  }

  return (
    <div className="govuk-panel govuk-panel--confirmation">
      <h1 className="govuk-panel__title">{ELIGIBLE_HEADING}</h1>
    </div>
  );
}
