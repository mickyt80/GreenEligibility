// Plan step 3: the cookie banner.
// Spec requirements 9–20.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, within, cleanup } from '@testing-library/react';
import {
  renderApp,
  clearCookies,
  getByFullText,
  queryCookieBanner,
  comesBefore,
  COOKIE_BANNER_NAME,
} from './helpers';

const ACCEPTED_MESSAGE =
  'You’ve accepted analytics cookies. You can change your cookie settings at any time.';
const REJECTED_MESSAGE =
  'You’ve rejected analytics cookies. You can change your cookie settings at any time.';
const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;
const TWO_DAYS_IN_SECONDS = 2 * 24 * 60 * 60;

beforeEach(() => {
  clearCookies();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('before a choice is made', () => {
  it.each(['/', '/region', '/accessibility-statement'])(
    'shows the banner at the very top of %s, above the header (requirement 9)',
    (path) => {
      renderApp(path);
      const banner = queryCookieBanner();
      expect(banner).toBeInTheDocument();
      expect(comesBefore(banner, screen.getByRole('banner'))).toBe(true);
      expect(comesBefore(banner, screen.getByRole('link', { name: 'Skip to main content' }))).toBe(
        true
      );
    }
  );

  it('does not show the banner on the cookies page (requirements 9 and 36)', () => {
    renderApp('/cookies');
    expect(queryCookieBanner()).not.toBeInTheDocument();
  });

  it(`has the heading "${COOKIE_BANNER_NAME}" (requirement 10)`, () => {
    renderApp('/');
    expect(
      within(queryCookieBanner()).getByRole('heading', { name: COOKIE_BANNER_NAME })
    ).toBeInTheDocument();
  });

  it('explains essential and analytics cookies in the design system’s words (requirement 11)', () => {
    renderApp('/');
    const banner = within(queryCookieBanner());
    expect(banner.getByText('We use some essential cookies to make this service work.')).toBeInTheDocument();
    expect(
      banner.getByText(
        'We’d also like to use analytics cookies so we can understand how you use the service and make improvements.'
      )
    ).toBeInTheDocument();
  });

  it('has "Accept analytics cookies" and "Reject analytics cookies" buttons and a "View cookies" link (requirement 12)', () => {
    renderApp('/');
    const banner = within(queryCookieBanner());
    expect(banner.getByRole('button', { name: 'Accept analytics cookies' })).toBeInTheDocument();
    expect(banner.getByRole('button', { name: 'Reject analytics cookies' })).toBeInTheDocument();
    expect(banner.getByRole('link', { name: 'View cookies' })).toHaveAttribute('href', '/cookies');
  });

  it('opens the cookies page from "View cookies", with no banner there (requirement 19)', async () => {
    const { user, currentPath } = renderApp('/');
    await user.click(screen.getByRole('link', { name: 'View cookies' }));
    expect(currentPath()).toBe('/cookies');
    expect(queryCookieBanner()).not.toBeInTheDocument();
  });
});

describe('accepting analytics cookies', () => {
  it('shows the accepted message and a "Hide cookie message" button (requirement 13)', async () => {
    const { user } = renderApp('/');
    await user.click(screen.getByRole('button', { name: 'Accept analytics cookies' }));
    const banner = within(queryCookieBanner());
    expect(getByFullText(ACCEPTED_MESSAGE, 'P')).toBeInTheDocument();
    expect(banner.getByRole('button', { name: 'Hide cookie message' })).toBeInTheDocument();
    expect(banner.queryByRole('button', { name: 'Accept analytics cookies' })).not.toBeInTheDocument();
  });

  it('links "change your cookie settings" to the cookies page (requirement 15)', async () => {
    const { user, currentPath } = renderApp('/');
    await user.click(screen.getByRole('button', { name: 'Accept analytics cookies' }));
    const link = screen.getByRole('link', { name: 'change your cookie settings' });
    expect(link).toHaveAttribute('href', '/cookies');
    await user.click(link);
    expect(currentPath()).toBe('/cookies');
  });

  it('remembers the choice, so the banner is gone after a refresh even without hiding it (requirement 17)', async () => {
    const { user } = renderApp('/');
    await user.click(screen.getByRole('button', { name: 'Accept analytics cookies' }));
    cleanup(); // the "refresh"
    renderApp('/');
    expect(queryCookieBanner()).not.toBeInTheDocument();
  });

  it('remembers the choice on other pages too (requirement 17)', async () => {
    const { user } = renderApp('/');
    await user.click(screen.getByRole('button', { name: 'Accept analytics cookies' }));
    cleanup();
    renderApp('/region');
    expect(queryCookieBanner()).not.toBeInTheDocument();
  });

  it('saves the choice in a browser cookie that lasts one year (requirement 17)', async () => {
    const written = [];
    const realSetter = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie').set;
    vi.spyOn(document, 'cookie', 'set').mockImplementation(function (value) {
      written.push(value);
      realSetter.call(this, value);
    });

    const { user } = renderApp('/');
    const before = Date.now();
    await user.click(screen.getByRole('button', { name: 'Accept analytics cookies' }));

    const lifetimes = written
      .map((value) => {
        const maxAge = value.match(/max-age=(\d+)/i);
        if (maxAge) return Number(maxAge[1]);
        const expires = value.match(/expires=([^;]+)/i);
        if (expires) return (Date.parse(expires[1]) - before) / 1000;
        return null;
      })
      .filter((seconds) => seconds !== null);

    expect(lifetimes.length).toBeGreaterThan(0);
    for (const seconds of lifetimes) {
      expect(Math.abs(seconds - ONE_YEAR_IN_SECONDS)).toBeLessThan(TWO_DAYS_IN_SECONDS);
    }
  });
});

describe('rejecting analytics cookies', () => {
  it('shows the rejected message and a "Hide cookie message" button (requirement 14)', async () => {
    const { user } = renderApp('/');
    await user.click(screen.getByRole('button', { name: 'Reject analytics cookies' }));
    expect(getByFullText(REJECTED_MESSAGE, 'P')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hide cookie message' })).toBeInTheDocument();
  });

  it('links "change your cookie settings" to the cookies page (requirement 15)', async () => {
    const { user } = renderApp('/');
    await user.click(screen.getByRole('button', { name: 'Reject analytics cookies' }));
    expect(screen.getByRole('link', { name: 'change your cookie settings' })).toHaveAttribute(
      'href',
      '/cookies'
    );
  });

  it('remembers the choice after a refresh (requirement 17)', async () => {
    const { user } = renderApp('/');
    await user.click(screen.getByRole('button', { name: 'Reject analytics cookies' }));
    cleanup();
    renderApp('/');
    expect(queryCookieBanner()).not.toBeInTheDocument();
  });
});

describe('hiding and clearing', () => {
  it('removes the banner when "Hide cookie message" is clicked (requirement 16)', async () => {
    const { user } = renderApp('/');
    await user.click(screen.getByRole('button', { name: 'Reject analytics cookies' }));
    await user.click(screen.getByRole('button', { name: 'Hide cookie message' }));
    expect(queryCookieBanner()).not.toBeInTheDocument();
  });

  it('shows the banner again after the site’s cookies are cleared (requirement 18)', async () => {
    const { user } = renderApp('/');
    await user.click(screen.getByRole('button', { name: 'Accept analytics cookies' }));
    cleanup();
    clearCookies();
    renderApp('/');
    expect(queryCookieBanner()).toBeInTheDocument();
  });
});

describe('no analytics (requirement 20)', () => {
  it.each(['Accept analytics cookies', 'Reject analytics cookies'])(
    'loads no scripts and makes no requests after "%s"',
    async (choice) => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
        throw new Error('No requests should be made');
      });
      const scriptsBefore = document.querySelectorAll('script').length;

      const { user } = renderApp('/');
      await user.click(screen.getByRole('button', { name: choice }));

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(document.querySelectorAll('script')).toHaveLength(scriptsBefore);
    }
  );
});
