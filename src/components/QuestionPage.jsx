import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackLink from './BackLink';
import ErrorSummary from './ErrorSummary';
import GovukButton from './GovukButton';
import GovukRadios from './GovukRadios';
import usePageTitle from '../hooks/usePageTitle';
import { useLanguage } from '../i18n/LanguageContext';
import { getAnswer, saveAnswer } from '../journeyAnswers';

// A page that asks one radios question, following the design system's question page pattern.
// - `name` is the key the answer is saved under in the journey's answers.
// - `questionKey` and `errorKey` name the question and error message in the translations.
// - `options` are the answers, in English; they are saved in English and shown translated.
// - `nextPage(answer)` gives the address to open after "Continue".
// - `inline` and `dividerBefore` are passed on to the radios.
// The answer is only saved when "Continue" is pressed with an answer selected. Saving also
// undoes an earlier "Accept and continue".
export default function QuestionPage({
  name,
  questionKey,
  options,
  errorKey,
  backTo,
  nextPage,
  inline,
  dividerBefore,
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  // Starts with the answer last continued with, if there is one.
  const [answer, setAnswer] = useState(() => getAnswer(name) ?? '');
  // Counts failed attempts, so the error summary is drawn afresh, and takes focus, each time.
  const [failedAttempts, setFailedAttempts] = useState(0);
  const hasError = failedAttempts > 0;
  const question = t(questionKey);
  const errorMessage = t(errorKey);

  usePageTitle(hasError ? `${t('errorPrefix')} ${question}` : question);

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
        <GovukButton type="submit">{t('continue')}</GovukButton>
      </form>
    </>
  );
}
