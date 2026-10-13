import { Fragment } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// GOV.UK radios, following GOV.UK Frontend's radios markup for a page that asks
// one question: the question is the fieldset's legend and the page's heading.
// The first radio's id is `name`, so an error summary can link to it.
// Pass `value` and `onChange` to control which answer is selected; leave them out
// and the browser alone keeps track of it.
// `inline` puts the answers side by side, as the design system does for two short answers.
// `dividerBefore` names an answer to put an "or" divider before, such as "Not known".
// Answers are saved in English; each is shown in the current language.
export default function GovukRadios({ name, question, options, value, onChange, error, inline, dividerBefore }) {
  const { t, tAnswer } = useLanguage();
  const errorId = `${name}-error`;
  const radioId = (index) => (index === 0 ? name : `${name}-${index + 1}`);
  const controlled = onChange !== undefined;

  return (
    <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
      <fieldset className="govuk-fieldset" aria-describedby={error ? errorId : undefined}>
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
          <h1 className="govuk-fieldset__heading">{question}</h1>
        </legend>
        {error && (
          <p id={errorId} className="govuk-error-message">
            <span className="govuk-visually-hidden">{t('errorPrefix')}</span> {error}
          </p>
        )}
        <div className={`govuk-radios${inline ? ' govuk-radios--inline' : ''}`} data-module="govuk-radios">
          {options.map((option, index) => (
            <Fragment key={option}>
              {option === dividerBefore && <div className="govuk-radios__divider">{t('or')}</div>}
              <div className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id={radioId(index)}
                  name={name}
                  type="radio"
                  value={option}
                  {...(controlled && {
                    checked: value === option,
                    onChange: () => onChange(option),
                  })}
                />
                <label className="govuk-label govuk-radios__label" htmlFor={radioId(index)}>
                  {tAnswer(option)}
                </label>
              </div>
            </Fragment>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
