import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

// GOV.UK back link, following GOV.UK Frontend's back link markup.
// It moves between pages without reloading the whole page.
export default function BackLink({ to }) {
  const { t } = useLanguage();
  return (
    <Link to={to} className="govuk-back-link">
      {t('back')}
    </Link>
  );
}
