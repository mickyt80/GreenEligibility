import GovukButton from '../components/GovukButton';
import usePageTitle from '../hooks/usePageTitle';

export const SERVICE_NAME = 'Check if you are eligible for a Green Home Grant';

// The first page, following the design system's "Start using a service" pattern.
function StartPage() {
  usePageTitle(SERVICE_NAME);

  return (
    <>
      <h1 className="govuk-heading-xl">{SERVICE_NAME}</h1>
      <p className="govuk-body">
        The Green Home Grant is a government scheme that funds home insulation and heat pumps.
      </p>
      <GovukButton to="/region" variant="start">
        Check your eligibility
      </GovukButton>
    </>
  );
}

export default StartPage;
