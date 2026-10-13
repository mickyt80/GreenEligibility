import { Navigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import { answersAccepted } from '../journeyAnswers';
import { getPath } from '../journeyPath';

const ELIGIBLE_HEADING = 'You are eligible for a Green Home Grant';
const NOT_ELIGIBLE_HEADING = 'You are not eligible for a Green Home Grant';

// The end of the journey. What it shows comes from the saved answers, so a refresh still
// shows the result. It checks, in this order:
// 1. Answers not accepted on the check answers page → the first page.
// 2. A question on the path unanswered → the first page.
// 3. The first answer on the path that means not eligible → its reason, and no other.
// 4. Every answer passes → eligible.
// Redirects don't add the results page to the browser's history.
export default function ResultPage() {
  const accepted = answersAccepted();
  const { complete, reason } = getPath();

  usePageTitle(reason ? NOT_ELIGIBLE_HEADING : ELIGIBLE_HEADING);

  if (!accepted || !complete) {
    return <Navigate to="/" replace />;
  }

  if (reason) {
    return (
      <>
        <h1 className="govuk-heading-l">{NOT_ELIGIBLE_HEADING}</h1>
        <p className="govuk-body">{reason}</p>
      </>
    );
  }

  return (
    <div className="govuk-panel govuk-panel--confirmation">
      <h1 className="govuk-panel__title">{ELIGIBLE_HEADING}</h1>
    </div>
  );
}
