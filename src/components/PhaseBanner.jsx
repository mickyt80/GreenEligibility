import { useLanguage } from '../i18n/LanguageContext';

// GOV.UK phase banner, following GOV.UK Frontend's phase banner markup.
export default function PhaseBanner({ feedbackHref = '#' }) {
  const { t } = useLanguage();
  return (
    <div className="govuk-phase-banner govuk-width-container">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag">{t('phaseTag')}</strong>
        <span className="govuk-phase-banner__text">
          {t('phaseBefore')}
          <a className="govuk-link" href={feedbackHref}>
            {t('phaseLink')}
          </a>
          {t('phaseAfter')}
        </span>
      </p>
    </div>
  );
}
