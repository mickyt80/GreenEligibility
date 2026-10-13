import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { BackLinkSlot } from './BackLinkSlot';

// GOV.UK back link, following GOV.UK Frontend's back link markup.
// It moves between pages without reloading the whole page.
// Each page says where its "Back" link goes, but the link is drawn at the top of the page,
// before the main content and on the same row as the language navigation, as the design
// system recommends.
export default function BackLink({ to }) {
  const { t } = useLanguage();
  const slot = useContext(BackLinkSlot);

  const link = (
    <Link to={to} className="govuk-back-link">
      {t('back')}
    </Link>
  );

  return slot ? createPortal(link, slot) : link;
}
