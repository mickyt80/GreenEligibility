import usePageTitle from '../hooks/usePageTitle';
import { useLanguage } from '../i18n/LanguageContext';

export default function AccessibilityStatementPage() {
  const { t } = useLanguage();
  usePageTitle(t('accessibilityHeading'));

  return (
    <>
      <h1 className="govuk-heading-xl">{t('accessibilityHeading')}</h1>
      {/* TODO: Service name and scope */}
      <h2 className="govuk-heading-l">{t('accessibilityHowAccessible')}</h2>
      {/* TODO: Known non-compliances */}
      <h2 className="govuk-heading-l">{t('accessibilityFeedback')}</h2>
      {/* TODO: Reasonable adjustment contact */}
      <h2 className="govuk-heading-l">{t('accessibilityTechnical')}</h2>
      <p className="govuk-body">{t('accessibilityCompliance')}</p>
      {/* TODO: Non-compliance list */}
      <h2 className="govuk-heading-l">{t('accessibilityTesting')}</h2>
      {/* TODO: Testing methodology */}
      <h2 className="govuk-heading-l">{t('accessibilityImproving')}</h2>
      {/* TODO: Improvement plan */}
    </>
  );
}
