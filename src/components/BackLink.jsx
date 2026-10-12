import { Link } from 'react-router-dom';

// GOV.UK back link, following GOV.UK Frontend's back link markup.
// It moves between pages without reloading the whole page.
export default function BackLink({ to }) {
  return (
    <Link to={to} className="govuk-back-link">
      Back
    </Link>
  );
}
