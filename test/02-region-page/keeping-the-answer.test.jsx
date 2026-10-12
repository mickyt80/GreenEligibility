// Plan step 2: keeping the answer.
// Spec requirements 39–43.
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import {
  renderApp,
  clearCookies,
  getRadio,
  queryBackLink,
  checkedLabels,
  answerRegion,
  refresh,
  newTab,
} from './helpers';

beforeEach(() => {
  clearCookies();
  window.sessionStorage.clear();
  document.title = '';
});

describe('keeping the region answer', () => {
  it('shows the answer selected after continuing, then pressing the browser’s Back button (requirement 39)', async () => {
    const { user, currentPath, goBack } = renderApp('/region');
    await answerRegion(user, 'Scotland');
    expect(currentPath()).toBe('/ownership');
    act(() => goBack());
    expect(currentPath()).toBe('/region');
    expect(checkedLabels()).toEqual(['Scotland']);
  });

  it('shows the answer selected after going back to the first page and pressing "Check your eligibility" again (requirement 40)', async () => {
    const { user, currentPath, goBack } = renderApp('/region');
    await answerRegion(user, 'Wales');
    act(() => goBack());
    await user.click(queryBackLink());
    expect(currentPath()).toBe('/');
    await user.click(screen.getByText('Check your eligibility'));
    expect(checkedLabels()).toEqual(['Wales']);
  });

  it('keeps the answer selected after a refresh (requirement 41)', async () => {
    const { user } = renderApp('/region');
    await answerRegion(user, 'Northern Ireland');
    refresh('/region');
    expect(checkedLabels()).toEqual(['Northern Ireland']);
  });

  it('forgets the answer when the tab is closed and the service opened in a new tab (requirement 42)', async () => {
    const { user } = renderApp('/region');
    await answerRegion(user, 'England');
    newTab('/region');
    expect(checkedLabels()).toEqual([]);
  });

  it('does not keep an answer that was selected without pressing "Continue" (requirement 43)', async () => {
    const { user } = renderApp('/region');
    await user.click(getRadio('England'));
    await user.click(queryBackLink());
    await user.click(screen.getByText('Check your eligibility'));
    expect(checkedLabels()).toEqual([]);
  });

  it('shows the answer last continued with, not a later one that was only selected (requirement 43)', async () => {
    const { user, goBack } = renderApp('/region');
    await answerRegion(user, 'Scotland');
    act(() => goBack());
    await user.click(getRadio('England'));
    await user.click(queryBackLink());
    await user.click(screen.getByText('Check your eligibility'));
    expect(checkedLabels()).toEqual(['Scotland']);
  });
});
