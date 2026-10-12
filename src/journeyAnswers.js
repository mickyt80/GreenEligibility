// The journey's answers, kept in the browser tab's session storage under one key.
// They survive going back and refreshing, and are forgotten when the tab is closed.

const STORAGE_KEY = 'green-home-grant-answers';

function readAll() {
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    // Storage can be blocked or hold something unreadable. Start with no answers.
    return {};
  }
}

export function getAnswer(question) {
  return readAll()[question];
}

export function saveAnswer(question, answer) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readAll(), [question]: answer }));
  } catch {
    // If storage is blocked, the journey still works; the answer just isn't kept.
  }
}
