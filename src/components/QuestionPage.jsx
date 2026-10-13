import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from './BackLink';
import ErrorSummary from './ErrorSummary';
import GovukButton from './GovukButton';
import GovukRadios from './GovukRadios';
import usePageTitle from '../hooks/usePageTitle';
import { getAnswer, saveAnswer } from '../journeyAnswers';

// A page that asks one radios question, following the design system's question page pattern.
// - `name` is the key the answer is saved under in the journey's answers.
// - `nextPage(answer)` gives the address to open after "Continue".
// - `inline` and `dividerBefore` are passed on to the radios.
// The answer is only saved when "Continue" is pressed with an answer selected. Saving also
// undoes an earlier "Accept and continue".
export default function QuestionPage({
  name,
  question,
  options,
  errorMessage,
  backTo,
  nextPage,
  inline,
  dividerBefore,
}) {
  const navigate = useNavigate();
  // Starts with the answer last continued with, if there is one.
  const [answer, setAnswer] = useState(() => getAnswer(name) ?? '');
  // Counts failed attempts, so the error summary is drawn afresh, and takes focus, each time.
  const [failedAttempts, setFailedAttempts] = useState(0);
  const hasError = failedAttempts > 0;

  usePageTitle(hasError ? `Error: ${question}` : question);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!answer) {
      setFailedAttempts((count) => count + 1);
      return;
    }
    saveAnswer(name, answer);
    navigate(nextPage(answer));
  };

  return (
    <>
      <BackLink to={backTo} />
      {hasError && <ErrorSummary key={failedAttempts} errors={[{ fieldId: name, message: errorMessage }]} />}
      <form onSubmit={handleSubmit} noValidate>
        <GovukRadios
          name={name}
          question={question}
          options={options}
          value={answer}
          onChange={setAnswer}
          error={hasError ? errorMessage : undefined}
          inline={inline}
          dividerBefore={dividerBefore}
        />
        <GovukButton type="submit">Continue</GovukButton>
      </form>
    </>
  );
}
