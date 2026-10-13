import QuestionPage from '../components/QuestionPage';

export const OWN = 'Own (with or without mortgage)';
const ANSWERS = [OWN, 'Rent from a private landlord', 'Rent from a housing association', 'Rent from the council'];

// The question after the region page. "Own (with or without mortgage)" goes on to the main
// residence question; any "Rent" answer goes straight to check answers, as set out in route.md.
export default function OwnershipPage() {
  return (
    <QuestionPage
      name="ownership"
      questionKey="ownershipQuestion"
      options={ANSWERS}
      errorKey="ownershipError"
      backTo="/region"
      nextPage={(answer) => (answer === OWN ? '/main-residence' : '/check-answers')}
    />
  );
}
