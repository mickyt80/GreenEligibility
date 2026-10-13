// Plan step 3: the ownership page.
// Spec requirements 21–28.
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, within, waitFor } from '@testing-library/react';
import {
  renderApp,
  clearCookies,
  normalise,
  comesBefore,
  getMain,
  getRadio,
  getRadios,
  queryBackLink,
  checkedLabels,
  answerRegion,
  refresh,
  OWNERSHIP_QUESTION,
  OWNERSHIP_TITLE,
  OWNERSHIP_ANSWERS,
} from './helpers';

beforeEach(() => {
  clearCookies();
  window.sessionStorage.clear();
  document.title = '';
});

describe('the ownership page', () => {
  it('shows the GOV.UK header and footer (requirement 21)', () => {
    renderApp('/ownership');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it(`has the tab title "${OWNERSHIP_TITLE}" (requirement 22)`, async () => {
    renderApp('/ownership');
    await waitFor(() => expect(document.title).toBe(OWNERSHIP_TITLE));
  });

  it('shows a "Back" link above the question, going to /region (requirement 23)', () => {
    renderApp('/ownership');
    const back = queryBackLink();
    expect(back).not.toBeNull();
    expect(back).toHaveAttribute('href', '/region');
    expect(comesBefore(back, screen.getByRole('heading', { level: 1 }))).toBe(true);
  });

  it('opens the region page, with the answer already chosen still selected, from its "Back" link (requirement 23)', async () => {
    const { user, currentPath } = renderApp('/region');
    await answerRegion(user, 'Northern Ireland');
    await user.click(queryBackLink());
    expect(currentPath()).toBe('/region');
    expect(checkedLabels()).toEqual(['Northern Ireland']);
  });

  it(`has the heading "${OWNERSHIP_QUESTION}" (requirement 24)`, () => {
    renderApp('/ownership');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(OWNERSHIP_QUESTION);
  });

  it('shows the four answers as radio buttons, in order and labelled exactly (requirement 25)', () => {
    renderApp('/ownership');
    const labels = getRadios().map((radio) => normalise(radio.labels[0].textContent));
    expect(labels).toEqual(OWNERSHIP_ANSWERS);
  });

  // Changed by spec/03-check-answers: the page now has a "Continue" button.
  it('has a "Continue" button, and no other form fields or buttons (requirement 26)', () => {
    renderApp('/ownership');
    const main = getMain();
    const buttons = within(main).queryAllByRole('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent('Continue');
    expect(main.querySelectorAll('input')).toHaveLength(4);
    expect(main.querySelectorAll('select, textarea')).toHaveLength(0);
  });

  it('stays on the page when an answer is selected, and forgets it on refresh (requirement 27)', async () => {
    const { user, currentPath } = renderApp('/ownership');
    await user.click(getRadio('Rent from the council'));
    expect(currentPath()).toBe('/ownership');
    refresh('/ownership');
    expect(checkedLabels()).toEqual([]);
  });

  it('shows the page, not an error, when /ownership is opened directly (requirement 28)', () => {
    renderApp('/ownership');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(OWNERSHIP_QUESTION);
    expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();
  });
});
