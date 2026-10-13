import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { BackLinkSlot } from './components/BackLinkSlot';
import CookieBanner from './components/CookieBanner';
import SkipLink from './components/SkipLink';
import GovukHeader from './components/GovukHeader';
import PhaseBanner from './components/PhaseBanner';
import GovukFooter from './components/GovukFooter';
import LanguageNavigation from './components/LanguageNavigation';
import { LanguageProvider } from './i18n/LanguageContext';
import StartPage from './pages/StartPage';
import RegionPage from './pages/RegionPage';
import CookiesPage from './pages/CookiesPage';
import OwnershipPage from './pages/OwnershipPage';
import MainResidencePage from './pages/MainResidencePage';
import BuiltBefore2000Page from './pages/BuiltBefore2000Page';
import EpcRatingPage from './pages/EpcRatingPage';
import CheckAnswersPage from './pages/CheckAnswersPage';
import ResultPage from './pages/ResultPage';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';

// The page frame and the journey's pages. Each page keeps its own answer in
// journeyAnswers.js, so no answers are held here. The whole service is shown in the
// language chosen in the language navigation, which appears on every page.
// The top row holds the page's "Back" link (if it has one) on the left and the language
// navigation on the right. The language navigation comes first in the page, so pressing Tab
// from "Back" goes straight to the page's question.
function App() {
  const [backLinkSlot, setBackLinkSlot] = useState(null);

  return (
    <LanguageProvider>
      <BackLinkSlot.Provider value={backLinkSlot}>
        <CookieBanner />
        <SkipLink />
        <GovukHeader />
        <PhaseBanner feedbackHref="#" />
        <div className="govuk-width-container">
          <div className="app-top-row">
            <LanguageNavigation />
            <div className="app-top-row__back" ref={setBackLinkSlot} />
          </div>
          <main className="govuk-main-wrapper" id="main-content">
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/region" element={<RegionPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/ownership" element={<OwnershipPage />} />
              <Route path="/main-residence" element={<MainResidencePage />} />
              <Route path="/built-before-2000" element={<BuiltBefore2000Page />} />
              <Route path="/epc-rating" element={<EpcRatingPage />} />
              <Route path="/check-answers" element={<CheckAnswersPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
            </Routes>
          </main>
        </div>
        <GovukFooter />
      </BackLinkSlot.Provider>
    </LanguageProvider>
  );
}

export default App;
