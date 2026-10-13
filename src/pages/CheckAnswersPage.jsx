import { Link, Navigate, useNavigate } from 'react-router-dom';
import GovukButton from '../components/GovukButton';
import usePageTitle from '../hooks/usePageTitle';
import { useLanguage } from '../i18n/LanguageContext';
import { acceptAnswers } from '../journeyAnswers';
import { getPath } from '../journeyPath';

// One row of the design system's summary list. `hiddenText` follows "Change" for screen
// readers, so each link makes sense on its own.
function SummaryRow({ label, answer, changeTo, changeText, hiddenText }) {
  return (
    <div className="govuk-summary-list__row">
      <dt className="govuk-summary-list__key">{label}</dt>
      <dd className="govuk-summary-list__value">{answer}</dd>
      <dd className="govuk-summary-list__actions">
        <Link className="govuk-link" to={changeTo}>
          {changeText}
          <span className="govuk-visually-hidden"> {hiddenText}</span>
        </Link>
      </dd>
    </div>
  );
}

// The design system's "Check answers" pattern. It shows one row for each question on the
// user's path, in order. If a question on the path is unanswered (including the region), it
// sends the user to the first page, without adding this page to the browser's history.
export default function CheckAnswersPage() {
  const { t, tAnswer } = useLanguage();
  const navigate = useNavigate();
  const { steps, complete } = getPath();
  const heading = t('checkHeading');

  usePageTitle(heading);

  if (!complete) {
    return <Navigate to="/" replace />;
  }

  const handleAccept = () => {
    acceptAnswers();
    navigate('/result');
  };

  return (
    <>
      <h1 className="govuk-heading-l">{heading}</h1>
      <dl className="govuk-summary-list">
        {steps.map((step) => (
          <SummaryRow
            key={step.key}
            label={t(step.labelKey)}
            answer={tAnswer(step.answer)}
            changeTo={step.path}
            changeText={t('change')}
            hiddenText={t(step.changeKey)}
          />
        ))}
      </dl>
      <GovukButton onClick={handleAccept}>{t('accept')}</GovukButton>
    </>
  );
}
