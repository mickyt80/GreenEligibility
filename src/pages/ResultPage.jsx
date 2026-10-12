import { Navigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import { getAnswer } from '../journeyAnswers';
import { OUTSIDE_UK } from './RegionPage';

const HEADING = 'You are not eligible for a Green Home Grant';

// The end of the journey for someone outside the UK. What it shows comes from the
// saved answer, not from how the user arrived, so a refresh still shows the result.
// Without a "not eligible" answer there is nothing to show, so it sends the user to
// the first page, without adding the results page to the browser's history.
export default function ResultPage() {
  usePageTitle(HEADING);

  if (getAnswer('region') !== OUTSIDE_UK) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <h1 className="govuk-heading-l">{HEADING}</h1>
      <p className="govuk-body">The Green Home Grant is only available to people who live in the UK.</p>
    </>
  );
}
