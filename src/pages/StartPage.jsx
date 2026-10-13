import GovukButton from '../components/GovukButton';
import usePageTitle from '../hooks/usePageTitle';
import { useLanguage } from '../i18n/LanguageContext';

// The first page, following the design system's "Start using a service" pattern.
function StartPage() {
  const { t } = useLanguage();
  const serviceName = t('serviceName');
  usePageTitle(serviceName);

  return (
    <>
      <h1 className="govuk-heading-xl">{serviceName}</h1>
      <p className="govuk-body">{t('startDescription')}</p>
      <GovukButton to="/region" variant="start">
        {t('startButton')}
      </GovukButton>
    </>
  );
}

export default StartPage;
