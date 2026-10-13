import { Link, Navigate, useNavigate } from 'react-router-dom';
import GovukButton from '../components/GovukButton';
import usePageTitle from '../hooks/usePageTitle';
import { acceptAnswers, getAnswer } from '../journeyAnswers';
import { OWNERSHIP_QUESTION } from './OwnershipPage';
import { OUTSIDE_UK } from './RegionPage';

const HEADING = 'Check your answers';
const REGION_QUESTION = 'In what region do you live?';

// One row of the design system's summary list. `hiddenText` follows "Change" for screen
// readers, so each link makes sense on its own.
function SummaryRow({ label, answer, changeTo, hiddenText }) {
  return (
    <div className="govuk-summary-list__row">
      <dt className="govuk-summary-list__key">{label}</dt>
      <dd className="govuk-summary-list__value">{answer}</dd>
      <dd className="govuk-summary-list__actions">
        <Link className="govuk-link" to={changeTo}>
          Change<span className="govuk-visually-hidden"> {hiddenText}</span>
        </Link>
      </dd>
    </div>
  );
}

// The design system's "Check answers" pattern. It checks, in this order:
// 1. No region answer → the first page.
// 2. A UK region with no ownership answer → the first page.
// 3. Otherwise it shows the region row and, for a UK region only, the ownership row.
// The redirects don't add this page to the browser's history.
export default function CheckAnswersPage() {
  const navigate = useNavigate();
  const region = getAnswer('region');
  const ownership = getAnswer('ownership');
  // For "Outside of the UK" the ownership answer no longer counts, so it isn't shown.
  const showOwnership = region !== OUTSIDE_UK;

  usePageTitle(HEADING);

  if (!region || (showOwnership && !ownership)) {
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
        <SummaryRow
          label={REGION_QUESTION}
          answer={region}
          changeTo="/region"
          hiddenText={REGION_QUESTION.toLowerCase()}
        />
        {showOwnership && (
          <SummaryRow
            label={OWNERSHIP_QUESTION}
            answer={ownership}
            changeTo="/ownership"
            hiddenText="whether you own or rent your property"
          />
        )}
      </dl>
      <GovukButton onClick={handleAccept}>Accept and continue</GovukButton>
    </>
  );
}
