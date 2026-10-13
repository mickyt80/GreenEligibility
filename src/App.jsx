import { Routes, Route } from 'react-router-dom';
import CookieBanner from './components/CookieBanner';
import SkipLink from './components/SkipLink';
import GovukHeader from './components/GovukHeader';
import PhaseBanner from './components/PhaseBanner';
import GovukFooter from './components/GovukFooter';
import StartPage from './pages/StartPage';
import RegionPage from './pages/RegionPage';
import CookiesPage from './pages/CookiesPage';
import PropertyTypePage from './pages/PropertyTypePage';
import OwnershipPage from './pages/OwnershipPage';
import MainResidencePage from './pages/MainResidencePage';
import BuiltBefore2000Page from './pages/BuiltBefore2000Page';
import EpcRatingPage from './pages/EpcRatingPage';
import IncomePage from './pages/IncomePage';
import InsulationPage from './pages/InsulationPage';
import HeatingPage from './pages/HeatingPage';
import CheckAnswersPage from './pages/CheckAnswersPage';
import ResultPage from './pages/ResultPage';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';

function App() {
  // TODO: Add form state here (useState) to hold all question answers
  // TODO: Pass state and setter to each page component via props

  return (
    <>
      <CookieBanner />
      <SkipLink />
      <GovukHeader />
      <PhaseBanner phase="Alpha" feedbackHref="#" />
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="main-content">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/region" element={<RegionPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/property-type" element={<PropertyTypePage />} />
            <Route path="/ownership" element={<OwnershipPage />} />
            <Route path="/main-residence" element={<MainResidencePage />} />
            <Route path="/built-before-2000" element={<BuiltBefore2000Page />} />
            <Route path="/epc-rating" element={<EpcRatingPage />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/insulation" element={<InsulationPage />} />
            <Route path="/heating" element={<HeatingPage />} />
            <Route path="/check-answers" element={<CheckAnswersPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
          </Routes>
        </main>
      </div>
      <GovukFooter />
    </>
  );
}

export default App;
