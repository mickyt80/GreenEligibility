// GOV.UK skip link, following GOV.UK Frontend's skip link markup.
// It stays hidden until it receives keyboard focus.
export default function SkipLink({ href = '#main-content' }) {
  return (
    <a href={href} className="govuk-skip-link">
      Skip to main content
    </a>
  );
}
