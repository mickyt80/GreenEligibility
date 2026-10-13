// The result when the EPC rating is "Not known": "You may be eligible", with a link to find
// the property's energy certificate.
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, within, waitFor, act } from '@testing-library/react';
import { translations } from '../../src/i18n/translations';
import {
  renderApp,
  clearCookies,
  normalise,
  getMain,
  refresh,
  getAccept,
  answerPage,
  answerPath,
  getLink,
  ELIGIBLE_PATH,
  ELIGIBLE_HEADING,
  RESULT_HEADING,
  NOT_KNOWN,
  BUILT,
} from '../05-property-questions/helpers';

const MAY_BE_ELIGIBLE = 'You may be eligible';
const MAY_BE_TEXT =
  "We cannot assess your eligibility without an EPC rating. For more information on your property's EPC rating, see Find an energy certificate.";
const FIND_CERTIFICATE = 'https://www.gov.uk/find-energy-certificate';

// Answers every question eligibly, but with "Not known" for the EPC rating, and accepts.
async function acceptWithNotKnown() {
  const app = renderApp('/region');
  await answerPath(app.user, { ...ELIGIBLE_PATH, epc: NOT_KNOWN });
  await app.user.click(getAccept());
  return app;
}

beforeEach(() => {
  clearCookies();
  window.sessionStorage.clear();
  document.title = '';
});

describe('the result for an EPC rating of "Not known"', () => {
  it('has the heading "You may be eligible", not in the green panel', async () => {
    await acceptWithNotKnown();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(normalise(heading.textContent)).toBe(MAY_BE_ELIGIBLE);
    expect(heading.closest('.govuk-panel')).toBeNull();
    expect(screen.queryByText(ELIGIBLE_HEADING)).not.toBeInTheDocument();
  });

  it('has the tab title "You may be eligible – GOV.UK"', async () => {
    await acceptWithNotKnown();
    await waitFor(() => expect(document.title).toBe(`${MAY_BE_ELIGIBLE} – GOV.UK`));
  });

  it('explains why, in one paragraph under the heading, and nothing else', async () => {
    await acceptWithNotKnown();
    const paragraphs = getMain().querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
    expect(normalise(paragraphs[0].textContent)).toBe(MAY_BE_TEXT);
    expect(within(getMain()).queryAllByRole('button')).toHaveLength(0);
  });

  it('links "Find an energy certificate" to the GOV.UK service', async () => {
    await acceptWithNotKnown();
    const links = within(getMain()).getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName('Find an energy certificate');
    expect(links[0]).toHaveAttribute('href', FIND_CERTIFICATE);
    expect(links[0]).toHaveClass('govuk-link');
  });

  it('is still shown after a refresh', async () => {
    await acceptWithNotKnown();
    refresh('/result');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(MAY_BE_ELIGIBLE);
  });

  it('is not shown before "Accept and continue": /result opens the first page', async () => {
    const { user } = renderApp('/region');
    await answerPath(user, { ...ELIGIBLE_PATH, epc: NOT_KNOWN });
    const { currentPath } = refresh('/result');
    await waitFor(() => expect(currentPath()).toBe('/'));
  });

  it('gives way to an earlier "not eligible" answer', async () => {
    const { user, goBack } = await acceptWithNotKnown();
    act(() => goBack());
    await user.click(getLink(BUILT.changeName));
    await answerPage(user, 'No');
    await user.click(getAccept());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(RESULT_HEADING);
    expect(getMain()).toHaveTextContent(BUILT.reason);
    expect(screen.queryByText(MAY_BE_ELIGIBLE)).not.toBeInTheDocument();
  });

  it('changes to the green "eligible" panel if the rating is changed to D', async () => {
    const { user, goBack } = await acceptWithNotKnown();
    act(() => goBack());
    await user.click(getLink("Change your home's EPC rating"));
    await answerPage(user, 'D');
    await user.click(getAccept());
    expect(screen.getByRole('heading', { level: 1 }).closest('.govuk-panel')).toHaveClass('govuk-panel--confirmation');
  });

  it('is shown in Welsh, with the link in Welsh', async () => {
    const { user } = await acceptWithNotKnown();
    await user.click(screen.getByRole('link', { name: /^Cymraeg/ }));
    const { cy } = translations;
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(cy.mayBeEligibleHeading);
    const paragraph = getMain().querySelector('p');
    expect(normalise(paragraph.textContent)).toBe(
      `${cy.mayBeEligibleReason} ${cy.mayBeEligibleMoreBefore}${cy.findEnergyCertificate}${cy.mayBeEligibleMoreAfter}`
    );
    expect(within(getMain()).getByRole('link', { name: cy.findEnergyCertificate })).toHaveAttribute('href', FIND_CERTIFICATE);
  });
});
