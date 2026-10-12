import { Link } from 'react-router-dom';
import GovukLogo from './GovukLogo';

// GOV.UK header, following GOV.UK Frontend's header markup.
// The logo links to this service's first page.
function GovukHeader() {
  return (
    <header className="govuk-template__header">
      <div className="govuk-header">
        <div className="govuk-header__container govuk-width-container">
          <div className="govuk-header__logo">
            <Link to="/" className="govuk-header__homepage-link">
              <GovukLogo className="govuk-header__logotype" ariaLabel="GOV.UK" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default GovukHeader;
