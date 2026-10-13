// Plan step 2: accepting the answers and the "eligible" result.
// Spec requirements 20–28.
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, within, waitFor, act } from '@testing-library/react';
import {
  renderApp,
  clearCookies,
  normalise,
  getMain,
  answerRegion,
  refresh,
  UK_REGIONS,
  OUTSIDE_UK,
  RESULT_HEADING,
  RESULT_TITLE,
  RESULT_REASON,
  ELIGIBLE_HEADING,
  ELIGIBLE_TITLE,
  getRows,
  getRowValue,
  getChangeLink,
  getAccept,
  reachCheckAnswers,
} from './helpers';

// Answers the region question, goes through to check answers and accepts.
async function acceptWith(region) {
  const app = renderApp('/region');
  await reachCheckAnswers(app.user, region);
  await app.user.click(getAccept());
  return app;
}

beforeEach(() => {
  clearCookies();
  window.sessionStorage.clear();
  document.title = '';
});

describe('accepting the answers', () => {
  it.each([...UK_REGIONS, OUTSIDE_UK])('opens /result after "Accept and continue" with "%s" (requirement 20)', async (region) => {
    const { currentPath } = await acceptWith(region);
    expect(currentPath()).toBe('/result');
  });
});

describe('the "eligible" result', () => {
  it.each(UK_REGIONS)(
    `shows a green confirmation panel with the heading "${ELIGIBLE_HEADING}" for "%s" (requirement 21)`,
    async (region) => {
      await acceptWith(region);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(normalise(heading.textContent)).toBe(ELIGIBLE_HEADING);
      const panel = heading.closest('.govuk-panel');
      expect(panel).not.toBeNull();
      expect(panel).toHaveClass('govuk-panel--confirmation');
    }
  );

  it(`has the tab title "${ELIGIBLE_TITLE}" (requirement 22)`, async () => {
    await acceptWith('England');
    await waitFor(() => expect(document.title).toBe(ELIGIBLE_TITLE));
  });

  it('shows nothing else: no other text, links or buttons (requirement 23)', async () => {
    await acceptWith('England');
    const main = getMain();
    expect(normalise(main.textContent)).toBe(ELIGIBLE_HEADING);
    expect(within(main).queryAllByRole('link')).toHaveLength(0);
    expect(within(main).queryAllByRole('button')).toHaveLength(0);
  });

  it('does not show the "not eligible" message', async () => {
    await acceptWith('Scotland');
    expect(screen.queryByText(RESULT_HEADING)).not.toBeInTheDocument();
    expect(screen.queryByText(RESULT_REASON)).not.toBeInTheDocument();
  });
});

describe('the "not eligible" result', () => {
  it(`shows the "not eligible" heading, reason and tab title after accepting "${OUTSIDE_UK}" (requirement 24)`, async () => {
    await acceptWith(OUTSIDE_UK);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(RESULT_HEADING);
    expect(within(getMain()).getByText(RESULT_REASON)).toBeInTheDocument();
    expect(screen.queryByText(ELIGIBLE_HEADING)).not.toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe(RESULT_TITLE));
  });
});

describe('refreshing and going back', () => {
  it.each([
    ['England', ELIGIBLE_HEADING],
    [OUTSIDE_UK, RESULT_HEADING],
  ])('still shows the result for "%s" after a refresh (requirement 25)', async (region, heading) => {
    await acceptWith(region);
    const { currentPath } = refresh('/result');
    expect(currentPath()).toBe('/result');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(heading);
  });

  it.each(['England', OUTSIDE_UK])(
    'returns to check answers from the result for "%s" with the browser’s Back button (requirement 26)',
    async (region) => {
      const { currentPath, goBack } = await acceptWith(region);
      act(() => goBack());
      expect(currentPath()).toBe('/check-answers');
      expect(normalise(getRowValue(getRows()[0]).textContent)).toBe(region);
    }
  );
});

describe('opening /result directly', () => {
  it('opens the first page when no answer has been given (requirement 27)', async () => {
    const { currentPath } = renderApp('/result');
    await waitFor(() => expect(currentPath()).toBe('/'));
  });

  it.each([...UK_REGIONS, OUTSIDE_UK])(
    'opens the first page with "%s" as the answer, before "Accept and continue" (requirement 27)',
    async (region) => {
      const { user } = renderApp('/region');
      await reachCheckAnswers(user, region);
      const { currentPath } = refresh('/result');
      await waitFor(() => expect(currentPath()).toBe('/'));
      expect(screen.queryByText(RESULT_HEADING)).not.toBeInTheDocument();
      expect(screen.queryByText(ELIGIBLE_HEADING)).not.toBeInTheDocument();
    }
  );
});

describe('changing the answer after accepting (requirement 28)', () => {
  it('undoes the acceptance when a new region answer is saved', async () => {
    const { user, goBack } = await acceptWith('England');
    act(() => goBack());
    await user.click(getChangeLink());
    await answerRegion(user, 'Scotland');
    const { currentPath } = refresh('/result');
    await waitFor(() => expect(currentPath()).toBe('/'));
  });

  it('undoes the acceptance even when the same answer is saved again', async () => {
    const { user, goBack } = await acceptWith(OUTSIDE_UK);
    act(() => goBack());
    await user.click(getChangeLink());
    await answerRegion(user, OUTSIDE_UK);
    const { currentPath } = refresh('/result');
    await waitFor(() => expect(currentPath()).toBe('/'));
  });

  it('shows the new result once "Accept and continue" is clicked again', async () => {
    const { user, goBack } = await acceptWith(OUTSIDE_UK);
    act(() => goBack());
    await user.click(getChangeLink());
    await reachCheckAnswers(user, 'Wales');
    await user.click(getAccept());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(ELIGIBLE_HEADING);
  });
});
