import { useEffect, useRef } from 'react';

// GOV.UK error summary, following GOV.UK Frontend's error summary markup.
// It takes focus as soon as it appears, so screen readers announce it.
// Each error links to the field it is about, and clicking it moves focus there.
export default function ErrorSummary({ errors }) {
  const summaryRef = useRef(null);

  useEffect(() => {
    summaryRef.current.focus();
  }, []);

  const focusField = (event, id) => {
    event.preventDefault();
    document.getElementById(id)?.focus();
  };

  return (
    <div className="govuk-error-summary" data-module="govuk-error-summary" tabIndex={-1} ref={summaryRef}>
      <div role="alert">
        <h2 className="govuk-error-summary__title">There is a problem</h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            {errors.map(({ fieldId, message }) => (
              <li key={fieldId}>
                <a href={`#${fieldId}`} onClick={(event) => focusField(event, fieldId)}>
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
