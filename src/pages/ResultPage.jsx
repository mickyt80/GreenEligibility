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
// 4. Every answer passes → eligible.
// Redirects don't add the results page to the browser's history.
export default function ResultPage() {
  const { t } = useLanguage();
  const accepted = answersAccepted();
  const { complete, reasonKey } = getPath();
  const heading = t(reasonKey ? 'notEligibleHeading' : 'eligibleHeading');

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

  return (
    <div className="govuk-panel govuk-panel--confirmation">
      <h1 className="govuk-panel__title">{heading}</h1>
    </div>
  );
}
