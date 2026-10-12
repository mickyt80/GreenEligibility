// Plan step 2: the first page, the empty /region page and the empty /cookies page.
// Spec requirements 21–38.
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, within, waitFor, act } from '@testing-library/react';
import {
  renderApp,
  clearCookies,
  normalise,
  comesBefore,
  SERVICE_NAME,
  SERVICE_TITLE,
  DESCRIPTION,
  START_BUTTON_TEXT,
} from './helpers';

const getStartButton = () => screen.getByText(START_BUTTON_TEXT).closest('a');

beforeEach(() => {
  clearCookies();
  document.title = '';
});

describe('the first page', () => {
  it(`has the tab title "${SERVICE_TITLE}" (requirement 21)`, async () => {
    renderApp('/');
    await waitFor(() => expect(document.title).toBe(SERVICE_TITLE));
  });

  it(`has the heading "${SERVICE_NAME}" (requirement 22)`, () => {
    renderApp('/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(SERVICE_NAME);
  });

  it('describes the scheme in the intent’s words (requirement 23)', () => {
    renderApp('/');
    expect(within(screen.getByRole('main')).getByText(DESCRIPTION)).toBeInTheDocument();
  });

  it('has a green GOV.UK start button with an arrow, reading "Check your eligibility" (requirement 24)', () => {
    renderApp('/');
    const button = getStartButton();
    expect(button).not.toBeNull();
    expect(normalise(button.textContent)).toBe(START_BUTTON_TEXT);
    expect(button).toHaveClass('govuk-button', 'govuk-button--start');
    expect(button.querySelector('svg')).not.toBeNull();
  });

  it('shows the heading, then the description, then the start button (requirement 25)', () => {
    renderApp('/');
    const main = screen.getByRole('main');
    const heading = within(main).getByRole('heading', { level: 1 });
    const description = within(main).getByText(DESCRIPTION);
    const button = getStartButton();
    expect(comesBefore(heading, description)).toBe(true);
    expect(comesBefore(description, button)).toBe(true);
  });

  it('shows nothing else in the main content: no grant amount, who can apply, time taken or anything to have ready (requirements 26–28)', () => {
    renderApp('/');
    // textContent runs the elements' text together, so compare without any whitespace.
    const withoutSpaces = (text) => text.replace(/\s/g, '');
    const mainText = withoutSpaces(screen.getByRole('main').textContent);
    expect(mainText).toBe(withoutSpaces(`${SERVICE_NAME} ${DESCRIPTION} ${START_BUTTON_TEXT}`));
  });

  it('has no questions, form fields or other buttons (requirement 29)', () => {
    renderApp('/');
    const main = screen.getByRole('main');
    expect(main.querySelectorAll('input, select, textarea, form, fieldset')).toHaveLength(0);
    const clickables = main.querySelectorAll('a, button');
    expect(clickables).toHaveLength(1);
    expect(clickables[0]).toBe(getStartButton());
  });
});

describe('continuing to the next page', () => {
  it('opens /region when "Check your eligibility" is clicked (requirement 30)', async () => {
    const { user, currentPath } = renderApp('/');
    expect(getStartButton()).toHaveAttribute('href', '/region');
    await user.click(getStartButton());
    expect(currentPath()).toBe('/region');
  });

  it('opens /region when the button is focused and Enter is pressed (requirement 31)', async () => {
    const { user, currentPath } = renderApp('/');
    getStartButton().focus();
    expect(getStartButton()).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(currentPath()).toBe('/region');
  });

  // Requirements 32 and 33 (an empty /region page with the service name as its tab title)
  // no longer apply: the region page now has its question. See spec/02-region-page/spec.md.

  it('returns to the first page, as it was, when Back is pressed (requirement 34)', async () => {
    const { user, currentPath, goBack } = renderApp('/');
    await user.click(getStartButton());
    expect(currentPath()).toBe('/region');
    act(() => goBack());
    expect(currentPath()).toBe('/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(SERVICE_NAME);
    expect(screen.getByText(DESCRIPTION)).toBeInTheDocument();
    expect(getStartButton()).toBeInTheDocument();
  });

  it('shows the region page, not an error, when /region is opened directly (requirement 35)', () => {
    renderApp('/region');
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.queryByText(/not found|error/i)).not.toBeInTheDocument();
  });
});

describe('the cookies page', () => {
  it('shows nothing between the phase banner and the footer (requirement 36)', () => {
    renderApp('/cookies');
    const main = screen.getByRole('main');
    expect(normalise(main.textContent)).toBe('');
    expect(main.querySelectorAll('h1, h2, a, button, input')).toHaveLength(0);
  });

  it(`has the tab title "${SERVICE_TITLE}" (requirement 37)`, async () => {
    renderApp('/cookies');
    await waitFor(() => expect(document.title).toBe(SERVICE_TITLE));
  });

  it('shows the empty page, not an error, when opened directly (requirement 38)', () => {
    renderApp('/cookies');
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.queryByText(/not found|error/i)).not.toBeInTheDocument();
  });
});
