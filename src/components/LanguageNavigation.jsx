import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

// The languages offered. Each name and description is written in its own language, so it
// reads correctly whichever language the page is in.
const ITEMS = [
  { lang: 'en', text: 'English', description: 'Change the language to English' },
  { lang: 'cy', text: 'Cymraeg', description: 'Newid yr iaith i’r Gymraeg' },
];

// GOV.UK language navigation, following GOV.UK Frontend's language navigation markup.
// The current language is shown as text; the other is a link to the same page, which
// switches the language without leaving the page. It sits on the right of the page, using
// GOV.UK Frontend's text-align override (the list is an inline row, so it follows it).
export default function LanguageNavigation() {
  const { language, setLanguage, t } = useLanguage();
  const { pathname } = useLocation();

  return (
    <nav className="govuk-language-navigation govuk-!-text-align-right" aria-label={t('languageNavLabel')}>
      <ul className="govuk-language-navigation__list">
        {ITEMS.map((item) => (
          <li className="govuk-language-navigation__list-item" key={item.lang}>
            {item.lang === language ? (
              <span className="govuk-language-navigation__text" aria-current="true" lang={item.lang}>
                {item.text}
              </span>
            ) : (
              <Link
                className="govuk-language-navigation__link"
                to={pathname}
                rel="alternate"
                lang={item.lang}
                hrefLang={item.lang}
                onClick={(event) => {
                  event.preventDefault();
                  setLanguage(item.lang);
                }}
              >
                {item.text}
                <span className="govuk-visually-hidden"> {item.description}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
