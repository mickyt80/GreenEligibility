// Plan step 1: GOV.UK Frontend styles and the page frame.
// Spec requirements 3–8, 39 and 40.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, within, waitFor } from '@testing-library/react';
import {
  renderApp,
  clearCookies,
  getByFullText,
  queryCookieBanner,
  comesBefore,
} from './helpers';

// Tests run from the GreenEligibility folder (npm test).
const projectFile = (name) => readFileSync(resolve(process.cwd(), name), 'utf8');

beforeEach(() => {
  clearCookies();
  document.title = '';
});

describe('GOV.UK Frontend styles (requirement 3)', () => {
  it('uses the official govuk-frontend package', () => {
    const pkg = JSON.parse(projectFile('package.json'));
    expect(pkg.dependencies).toHaveProperty('govuk-frontend');
  });

  it('no longer has the starter’s hand-written GOV.UK styles in App.css', () => {
    expect(projectFile('src/App.css')).not.toMatch(/\.govuk-/);
  });
});

describe.each(['/', '/region', '/cookies', '/accessibility-statement'])(
  'the page frame on %s',
  (path) => {
    it('shows the GOV.UK header, with the logo linking to the first page (requirement 4)', () => {
      renderApp(path);
      const header = screen.getByRole('banner');
      const logo = within(header).getByRole('link', { name: /GOV\.UK/ });
      expect(logo).toHaveAttribute('href', '/');
    });

    it('shows the alpha phase banner with a "feedback" link (requirement 5)', () => {
      renderApp(path);
      expect(screen.getByText('Alpha')).toBeInTheDocument();
      expect(
        getByFullText('This is a new service – your feedback will help us improve it.')
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'feedback' })).toBeInTheDocument();
    });

    it('shows the GOV.UK footer with the licence, copyright and an "Accessibility statement" link (requirement 7)', () => {
      renderApp(path);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveTextContent('Open Government Licence');
      expect(footer).toHaveTextContent('© Crown copyright');
      expect(within(footer).getByRole('link', { name: 'Accessibility statement' })).toHaveAttribute(
        'href',
        '/accessibility-statement'
      );
    });

    it('has no "Cookies" or other service links in the footer (requirement 7)', () => {
      renderApp(path);
      const footer = screen.getByRole('contentinfo');
      const linkNames = within(footer)
        .queryAllByRole('link')
        .map((link) => link.textContent.trim());
      const serviceLinks = linkNames.filter(
        (name) => !/Open Government Licence|Crown copyright/.test(name)
      );
      expect(serviceLinks).toEqual(['Accessibility statement']);
    });

    it('has a "Skip to main content" link that points to the one main content area (requirement 8)', () => {
      renderApp(path);
      const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
      expect(skipLink).toHaveAttribute('href', '#main-content');
      const mains = screen.getAllByRole('main');
      expect(mains).toHaveLength(1);
      expect(mains[0]).toHaveAttribute('id', 'main-content');
    });

    it('puts the frame in order: skip link, header, phase banner, main content, footer', () => {
      renderApp(path);
      const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
      const header = screen.getByRole('banner');
      const phaseBanner = screen.getByText('Alpha');
      const main = screen.getByRole('main');
      const footer = screen.getByRole('contentinfo');
      expect(comesBefore(skipLink, header)).toBe(true);
      expect(comesBefore(header, phaseBanner)).toBe(true);
      expect(comesBefore(phaseBanner, main)).toBe(true);
      expect(comesBefore(main, footer)).toBe(true);
    });
  }
);

describe('the "feedback" link (requirement 6)', () => {
  it('leaves the user on the same page', async () => {
    const { user, currentPath } = renderApp('/');
    await user.click(screen.getByRole('link', { name: 'feedback' }));
    expect(currentPath()).toBe('/');
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});

describe('the skip link and the cookie banner (requirement 8)', () => {
  it('comes after the cookie banner’s buttons when the banner is showing', () => {
    renderApp('/');
    const banner = queryCookieBanner();
    expect(banner).toBeInTheDocument();
    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    for (const button of within(banner).getAllByRole('button')) {
      expect(comesBefore(button, skipLink)).toBe(true);
    }
  });
});

describe('the accessibility statement page (requirements 39 and 40)', () => {
  it('opens from the footer link', async () => {
    const { user, currentPath } = renderApp('/');
    const footer = screen.getByRole('contentinfo');
    await user.click(within(footer).getByRole('link', { name: 'Accessibility statement' }));
    expect(currentPath()).toBe('/accessibility-statement');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Accessibility statement' })
    ).toBeInTheDocument();
  });

  it('keeps the starter’s existing headings', () => {
    renderApp('/accessibility-statement');
    for (const name of [
      'How accessible this service is',
      'Feedback and contact information',
      'Technical information',
      'How we tested this service',
      'What we are doing to improve',
    ]) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    }
  });

  it('has the tab title "Accessibility statement – GOV.UK"', async () => {
    renderApp('/accessibility-statement');
    await waitFor(() => expect(document.title).toBe('Accessibility statement – GOV.UK'));
  });
});
