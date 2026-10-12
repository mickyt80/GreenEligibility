import { Link } from 'react-router-dom';

// GOV.UK button, following GOV.UK Frontend's button markup.
// Pass `to` to make it a link styled as a button, as the design system does for start buttons.
function GovukButton({ children, onClick, to, type = 'button', variant = '' }) {
  const isStart = variant === 'start';
  const className = `govuk-button ${isStart ? 'govuk-button--start' : ''}`.trim();
  const startIcon = isStart && (
    <svg
      className="govuk-button__start-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="17.5"
      height="19"
      viewBox="0 0 33 40"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
    </svg>
  );

  if (to) {
    return (
      <Link to={to} role="button" draggable="false" className={className}>
        {children}
        {startIcon}
      </Link>
    );
  }

  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
      {startIcon}
    </button>
  );
}

export default GovukButton;
