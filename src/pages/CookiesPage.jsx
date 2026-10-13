import usePageTitle from '../hooks/usePageTitle';
import { useLanguage } from '../i18n/LanguageContext';

// The cookies page. It is empty for now.
export default function CookiesPage() {
  const { t } = useLanguage();
  usePageTitle(t('serviceName'));
  return null;
}
