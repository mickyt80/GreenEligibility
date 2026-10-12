import BackLink from '../components/BackLink';
import GovukRadios from '../components/GovukRadios';
import usePageTitle from '../hooks/usePageTitle';

const QUESTION = 'Do you own or rent your property?';
const ANSWERS = [
  'Own (with or without mortgage)',
  'Rent from a private landlord',
  'Rent from a housing association',
  'Rent from the council',
];

// The next question after the region page. For now it shows the question and its
// answers only: there is no "Continue" button, and nothing chosen here is kept.
export default function OwnershipPage() {
  usePageTitle(QUESTION);

  return (
    <>
      <BackLink to="/region" />
      <GovukRadios name="ownership" question={QUESTION} options={ANSWERS} />
    </>
  );
}
