import { useLanguage } from '../i18n/LanguageContext';

// GOV.UK skip link, following GOV.UK Frontend's skip link markup.
// It stays hidden until it receives keyboard focus.
export default function SkipLink({ href = '#main-content' }) {
  const { t } = useLanguage();
  return (
    <a href={href} className="govuk-skip-link">
      {t('skipLink')}
    </a>
  );
}
