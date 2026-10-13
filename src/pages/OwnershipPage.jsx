import { useNavigate } from 'react-router-dom';
import BackLink from '../components/BackLink';
import GovukButton from '../components/GovukButton';
import GovukRadios from '../components/GovukRadios';
import usePageTitle from '../hooks/usePageTitle';

const QUESTION = 'Do you own or rent your property?';
const ANSWERS = [
  'Own (with or without mortgage)',
  'Rent from a private landlord',
  'Rent from a housing association',
  'Rent from the council',
];

// The next question after the region page. For now its answer is not checked or kept:
// "Continue" only moves on to check answers.
export default function OwnershipPage() {
  const navigate = useNavigate();
  usePageTitle(QUESTION);

  return (
    <>
      <BackLink to="/region" />
      <GovukRadios name="ownership" question={QUESTION} options={ANSWERS} />
      <GovukButton onClick={() => navigate('/check-answers')}>Continue</GovukButton>
    </>
  );
}
