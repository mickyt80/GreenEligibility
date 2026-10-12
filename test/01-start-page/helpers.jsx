import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import App from '../../src/App';

export const SERVICE_NAME = 'Check if you are eligible for a Green Home Grant';
export const SERVICE_TITLE = `${SERVICE_NAME} – GOV.UK`;
export const DESCRIPTION =
  'The Green Home Grant is a government scheme that funds home insulation and heat pumps.';
export const START_BUTTON_TEXT = 'Check your eligibility';
export const COOKIE_BANNER_NAME = `Cookies on ${SERVICE_NAME}`;

// Records where the app has navigated to, and lets a test press "Back".
const probe = { pathname: null, navigate: null };

function RouterProbe() {
  probe.pathname = useLocation().pathname;
  probe.navigate = useNavigate();
  return null;
}

// Renders the whole app as if the browser had opened `path`.
export function renderApp(path = '/') {
  const user = userEvent.setup();
  const result = render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <RouterProbe />
    </MemoryRouter>
  );
  return {
    ...result,
    user,
    currentPath: () => probe.pathname,
    goBack: () => probe.navigate(-1),
  };
}

// Removes every cookie the site has set, like "clear site cookies" in a browser.
export function clearCookies() {
  for (const pair of document.cookie.split(';')) {
    const name = pair.split('=')[0].trim();
    if (!name) continue;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export const normalise = (text) => text.replace(/\s+/g, ' ').trim();

// Finds the element whose whole text (including any links inside it) is `text`.
export function getByFullText(text, tagName) {
  const matches = screen.getAllByText((_, element) => {
    if (tagName && element.tagName !== tagName) return false;
    return normalise(element.textContent) === text;
  });
  return matches[0];
}

export function queryCookieBanner() {
  return screen.queryByRole('region', { name: COOKIE_BANNER_NAME });
}

// True when `first` appears before `second` in the page.
export function comesBefore(first, second) {
  return Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
}
