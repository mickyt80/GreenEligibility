// GOV.UK radios, following GOV.UK Frontend's radios markup for a page that asks
// one question: the question is the fieldset's legend and the page's heading.
// The first radio's id is `name`, so an error summary can link to it.
// Pass `value` and `onChange` to control which answer is selected; leave them out
// and the browser alone keeps track of it.
export default function GovukRadios({ name, question, options, value, onChange, error }) {
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
            <span className="govuk-visually-hidden">Error:</span> {error}
          </p>
        )}
        <div className="govuk-radios" data-module="govuk-radios">
          {options.map((option, index) => (
            <div className="govuk-radios__item" key={option}>
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
                {option}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
