import { Link, Navigate, useNavigate } from 'react-router-dom';
import GovukButton from '../components/GovukButton';
import usePageTitle from '../hooks/usePageTitle';
import { acceptAnswers, getAnswer } from '../journeyAnswers';

const HEADING = 'Check your answers';
const REGION_QUESTION = 'In what region do you live?';

// The design system's "Check answers" pattern. For now it shows only the region
// answer; more rows are added as each later question is built.
// Without a region answer there is nothing to check, so it sends the user to the first
// page, without adding this page to the browser's history.
export default function CheckAnswersPage() {
  const navigate = useNavigate();
  const region = getAnswer('region');

  usePageTitle(HEADING);

  if (!region) {
    return <Navigate to="/" replace />;
  }

  const handleAccept = () => {
    acceptAnswers();
    navigate('/result');
  };

  return (
    <>
      <h1 className="govuk-heading-l">{HEADING}</h1>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">{REGION_QUESTION}</dt>
          <dd className="govuk-summary-list__value">{region}</dd>
          <dd className="govuk-summary-list__actions">
            <Link className="govuk-link" to="/region">
              Change<span className="govuk-visually-hidden"> {REGION_QUESTION.toLowerCase()}</span>
            </Link>
          </dd>
        </div>
      </dl>
      <GovukButton onClick={handleAccept}>Accept and continue</GovukButton>
    </>
  );
}
