// The journey's answers, kept in the browser tab's session storage under one key.
// They survive going back and refreshing, and are forgotten when the tab is closed.
// Alongside them is a note that the answers were accepted on the check answers page.

const STORAGE_KEY = 'green-home-grant-answers';

function readAll() {
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    // Storage can be blocked or hold something unreadable. Start with no answers.
    return {};
  }
}

function writeAll(answers) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // If storage is blocked, the journey still works; the answers just aren't kept.
  }
}

export function getAnswer(question) {
  return readAll().answers?.[question];
}

// Saving any answer undoes an earlier acceptance, even if the answer hasn't changed,
// so the user has to check and accept their answers again.
export function saveAnswer(question, answer) {
  const { answers } = readAll();
  writeAll({ answers: { ...answers, [question]: answer }, accepted: false });
}

export function acceptAnswers() {
  writeAll({ ...readAll(), accepted: true });
}

export function answersAccepted() {
  return readAll().accepted === true;
}
