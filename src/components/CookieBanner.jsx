import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// GOV.UK cookie banner, following GOV.UK Frontend's cookie banner markup and the
// design system's wording for a service that would use analytics cookies.
// The choice is saved in a browser cookie for one year. No analytics are ever run.

const SERVICE_NAME = 'Check if you are eligible for a Green Home Grant';
const COOKIE_NAME = 'cookies_policy';
const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

function hasSavedChoice() {
  return document.cookie.split(';').some((pair) => pair.trim().startsWith(`${COOKIE_NAME}=`));
}

function saveChoice(analytics) {
  const value = encodeURIComponent(JSON.stringify({ essential: true, analytics }));
  document.cookie = `${COOKIE_NAME}=${value}; max-age=${ONE_YEAR_IN_SECONDS}; path=/; SameSite=Lax`;
}

export default function CookieBanner() {
  const { pathname } = useLocation();
  // 'undecided' shows the question; 'accepted' or 'rejected' shows the confirmation;
  // 'hidden' shows nothing.
  const [status, setStatus] = useState(() => (hasSavedChoice() ? 'hidden' : 'undecided'));

  if (status === 'hidden' || pathname === '/cookies') return null;

  const choose = (analytics) => {
    saveChoice(analytics);
    setStatus(analytics ? 'accepted' : 'rejected');
  };

  return (
    <div className="govuk-cookie-banner" data-nosnippet role="region" aria-label={`Cookies on ${SERVICE_NAME}`}>
      {status === 'undecided' ? (
        <div className="govuk-cookie-banner__message govuk-width-container">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <h2 className="govuk-cookie-banner__heading govuk-heading-m">Cookies on {SERVICE_NAME}</h2>
              <div className="govuk-cookie-banner__content">
                <p className="govuk-body">We use some essential cookies to make this service work.</p>
                <p className="govuk-body">
                  We’d also like to use analytics cookies so we can understand how you use the service and make improvements.
                </p>
              </div>
            </div>
          </div>
          <div className="govuk-button-group">
            <button type="button" className="govuk-button" onClick={() => choose(true)}>
              Accept analytics cookies
            </button>
            <button type="button" className="govuk-button" onClick={() => choose(false)}>
              Reject analytics cookies
            </button>
            <Link className="govuk-link" to="/cookies">
              View cookies
            </Link>
          </div>
        </div>
      ) : (
        <div className="govuk-cookie-banner__message govuk-width-container" role="alert">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <div className="govuk-cookie-banner__content">
                <p className="govuk-body">
                  You’ve {status} analytics cookies. You can{' '}
                  <Link className="govuk-link" to="/cookies">
                    change your cookie settings
                  </Link>{' '}
                  at any time.
                </p>
              </div>
            </div>
          </div>
          <div className="govuk-button-group">
            <button type="button" className="govuk-button" onClick={() => setStatus('hidden')}>
              Hide cookie message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
