import { Navigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import { useLanguage } from '../i18n/LanguageContext';
import { answersAccepted } from '../journeyAnswers';
import { getPath } from '../journeyPath';

// The end of the journey. What it shows comes from the saved answers, so a refresh still
// shows the result. It checks, in this order:
// 1. Answers not accepted on the check answers page → the first page.
// 2. A question on the path unanswered → the first page.
// 3. The first answer on the path that means not eligible → its reason, and no other.
// 4. Every answer passes, but the EPC rating is "Not known" → "You may be eligible", with a
//    link to find the property's energy certificate.
// 5. Every answer passes → eligible.
// Redirects don't add the results page to the browser's history.
export default function ResultPage() {
  const { t } = useLanguage();
  const accepted = answersAccepted();
  const { complete, reasonKey, mayBeEligible } = getPath();
  let headingKey = 'eligibleHeading';
  if (reasonKey) headingKey = 'notEligibleHeading';
  else if (mayBeEligible) headingKey = 'mayBeEligibleHeading';
  const heading = t(headingKey);

  usePageTitle(heading);

  if (!accepted || !complete) {
    return <Navigate to="/" replace />;
  }

  if (reasonKey) {
    return (
      <>
        <h1 className="govuk-heading-l">{heading}</h1>
        <p className="govuk-body">{t(reasonKey)}</p>
      </>
    );
  }

  // Not a confirmed result, so a plain heading rather than the green panel.
  if (mayBeEligible) {
    return (
      <>
        <h1 className="govuk-heading-l">{heading}</h1>
        <p className="govuk-body">
          {t('mayBeEligibleReason')} {t('mayBeEligibleMoreBefore')}
          <a className="govuk-link" href="https://www.gov.uk/find-energy-certificate">
            {t('findEnergyCertificate')}
          </a>
          {t('mayBeEligibleMoreAfter')}
        </p>
      </>
    );
  }

  return (
    <div className="govuk-panel govuk-panel--confirmation">
      <h1 className="govuk-panel__title">{heading}</h1>
    </div>
  );
}
