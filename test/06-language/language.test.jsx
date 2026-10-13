// The language navigation (English and Welsh) and the Welsh translation.
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, within, waitFor } from '@testing-library/react';
import { translations } from '../../src/i18n/translations';
import {
  renderApp,
  clearCookies,
  normalise,
  getMain,
  getRows,
  getRowKey,
  getRowValue,
  checkedLabels,
  refresh,
  newTab,
  answerPath,
  ELIGIBLE_PATH,
} from '../05-property-questions/helpers';

const getLanguageNav = (name = 'Language') => screen.getByRole('navigation', { name });
const switchTo = (user, language) =>
  user.click(screen.getByRole('link', { name: new RegExp(`^${language}`) }));

// Pages that show without any answers saved.
const PAGES = ['/', '/region', '/ownership', '/main-residence', '/built-before-2000', '/epc-rating', '/cookies', '/accessibility-statement'];

beforeEach(() => {
  clearCookies();
  window.sessionStorage.clear();
  document.title = '';
  document.documentElement.lang = '';
});

describe('the language navigation', () => {
  it.each(PAGES)('is on %s, with English as the current language and a link to Cymraeg', (path) => {
    renderApp(path);
    const nav = getLanguageNav();
    const current = within(nav).getByText('English');
    expect(current.tagName).toBe('SPAN');
    expect(current).toHaveAttribute('aria-current', 'true');
    expect(current).toHaveAttribute('lang', 'en');
    const welsh = within(nav).getByRole('link', { name: 'Cymraeg Newid yr iaith i’r Gymraeg' });
    expect(welsh).toHaveAttribute('lang', 'cy');
    expect(welsh).toHaveAttribute('hreflang', 'cy');
    expect(welsh).toHaveAttribute('rel', 'alternate');
    expect(welsh).toHaveAttribute('href', path);
  });

  it('is on check answers and the results page too', async () => {
    const { user } = renderApp('/region');
    await answerPath(user, ELIGIBLE_PATH);
    expect(getLanguageNav()).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Accept and continue' }));
    expect(getLanguageNav()).toBeInTheDocument();
  });

  it('comes before the main content', () => {
    renderApp('/');
    expect(getLanguageNav().compareDocumentPosition(getMain()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('marks the page as English by default', async () => {
    renderApp('/');
    await waitFor(() => expect(document.documentElement.lang).toBe('en'));
  });
});

describe('switching to Welsh', () => {
  it('stays on the same page and shows it in Welsh', async () => {
    const { user, currentPath } = renderApp('/');
    await switchTo(user, 'Cymraeg');
    expect(currentPath()).toBe('/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(translations.cy.serviceName);
    await waitFor(() => expect(document.title).toBe(`${translations.cy.serviceName} – GOV.UK`));
    await waitFor(() => expect(document.documentElement.lang).toBe('cy'));
  });

  it('makes Cymraeg the current language, with a link back to English', async () => {
    const { user } = renderApp('/');
    await switchTo(user, 'Cymraeg');
    const nav = getLanguageNav('Iaith');
    expect(within(nav).getByText('Cymraeg')).toHaveAttribute('aria-current', 'true');
    expect(within(nav).getByRole('link', { name: 'English Change the language to English' })).toHaveAttribute('lang', 'en');
  });

  it('shows the page frame in Welsh', async () => {
    const { user } = renderApp('/');
    await switchTo(user, 'Cymraeg');
    expect(screen.getByRole('region', { name: translations.cy.cookiesHeading })).toBeInTheDocument();
    expect(screen.getByText('Neidio i’r prif gynnwys')).toBeInTheDocument();
    expect(screen.getByText('Alffa')).toBeInTheDocument();
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByRole('link', { name: 'Datganiad hygyrchedd' })).toBeInTheDocument();
    expect(footer).toHaveTextContent('© Hawlfraint y Goron');
  });

  it('is remembered on the next page, and the answers are shown in Welsh', async () => {
    const { user } = renderApp('/');
    await switchTo(user, 'Cymraeg');
    await user.click(screen.getByText(translations.cy.startButton));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(translations.cy.regionQuestion);
    const labels = within(getMain())
      .getAllByRole('radio')
      .map((radio) => normalise(radio.labels[0].textContent));
    expect(labels).toEqual(['Lloegr', 'Yr Alban', 'Cymru', 'Gogledd Iwerddon', 'Y tu allan i’r DU']);
    expect(screen.getByRole('button', { name: 'Yn eich blaen' })).toBeInTheDocument();
  });

  it('is remembered after a refresh, and forgotten in a new tab', async () => {
    const { user } = renderApp('/region');
    await switchTo(user, 'Cymraeg');
    refresh('/region');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(translations.cy.regionQuestion);
    newTab('/region');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(translations.en.regionQuestion);
  });

  it('shows the error in Welsh', async () => {
    const { user } = renderApp('/region');
    await switchTo(user, 'Cymraeg');
    await user.click(screen.getByRole('button', { name: 'Yn eich blaen' }));
    const summary = document.querySelector('.govuk-error-summary');
    expect(within(summary).getByRole('heading')).toHaveTextContent('Mae problem wedi codi');
    expect(within(summary).getByRole('link', { name: translations.cy.regionError })).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe(`Gwall: ${translations.cy.regionQuestion} – GOV.UK`));
  });

  it('shows the "or" divider in Welsh on the EPC page', async () => {
    const { user } = renderApp('/epc-rating');
    await switchTo(user, 'Cymraeg');
    expect(normalise(getMain().querySelector('.govuk-radios__divider').textContent)).toBe('neu');
    expect(screen.getByRole('radio', { name: 'Ddim yn gwybod' })).toBeInTheDocument();
  });
});

describe('answering in Welsh', () => {
  it('works through to the eligible result, with check answers in Welsh', async () => {
    const { user } = renderApp('/');
    await switchTo(user, 'Cymraeg');
    await user.click(screen.getByText(translations.cy.startButton));
    for (const answer of ['Lloegr', 'Yn berchen arno (gyda neu heb forgais)', 'Cartref cyntaf', 'Do', 'D']) {
      await user.click(screen.getByRole('radio', { name: answer }));
      await user.click(screen.getByRole('button', { name: 'Yn eich blaen' }));
    }
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Gwirio eich atebion');
    const rows = [...getRows()];
    expect(rows.map((row) => normalise(getRowValue(row).textContent))).toEqual([
      'Lloegr',
      'Yn berchen arno (gyda neu heb forgais)',
      'Cartref cyntaf',
      'Do',
      'D',
    ]);
    expect(normalise(getRowKey(rows[0]).textContent)).toBe(translations.cy.regionQuestion);
    expect(screen.getByRole('link', { name: 'Newid sgôr EPC eich cartref' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Derbyn a pharhau' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(translations.cy.eligibleHeading);
  });

  it('gives the "not eligible" reason in Welsh', async () => {
    const { user } = renderApp('/region');
    await answerPath(user, { region: 'Outside of the UK' });
    await switchTo(user, 'Cymraeg');
    await user.click(screen.getByRole('button', { name: 'Derbyn a pharhau' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(translations.cy.notEligibleHeading);
    expect(getMain()).toHaveTextContent(translations.cy.reasonRegion);
  });

  it('keeps answers given in one language when switching to the other', async () => {
    const { user } = renderApp('/region');
    await switchTo(user, 'Cymraeg');
    await user.click(screen.getByRole('radio', { name: 'Cymru' }));
    await user.click(screen.getByRole('button', { name: 'Yn eich blaen' }));
    refresh('/region');
    expect(checkedLabels()).toEqual(['Cymru']);
    const { user: user2 } = refresh('/region');
    await switchTo(user2, 'English');
    expect(checkedLabels()).toEqual(['Wales']);
  });
});

describe('the translations', () => {
  it('have Welsh for every piece of English text', () => {
    const missing = Object.keys(translations.en).filter((key) => !(key in translations.cy));
    expect(missing).toEqual([]);
  });

  it('have Welsh for every answer that isn’t an EPC letter', () => {
    const answers = [
      'England', 'Scotland', 'Wales', 'Northern Ireland', 'Outside of the UK',
      'Own (with or without mortgage)', 'Rent from a private landlord', 'Rent from a housing association', 'Rent from the council',
      'First home', 'Secondary home', 'Yes', 'No', 'Not known',
    ];
    expect(answers.filter((answer) => !(answer in translations.cy.answers))).toEqual([]);
  });
});
